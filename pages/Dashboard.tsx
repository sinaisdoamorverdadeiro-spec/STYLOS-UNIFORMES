import React from 'react';
import { useAuth, useData } from '../context/Store';
import { Role, OrderStatus } from '../types';
import { 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Truck,
  Package
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const { orders, products, expenses } = useData();

  const isAdmin = user?.role === Role.ADMIN;
  const isStock = user?.role === Role.ESTOQUE;
  const isSales = user?.role === Role.VENDAS;

  const today = new Date().toISOString().split('T')[0];

  // --- SALES PROFILE LOGIC (STRICT) ---
  if (isSales) {
    // Regra: Apenas pedidos com data = hoje
    const ordersToday = orders.filter(o => o.date === today);
    const revenueToday = ordersToday.reduce((acc, o) => acc + o.total, 0);
    
    // Group production statuses for the KPI
    const inProduction = orders.filter(o => 
      [OrderStatus.CORTE, OrderStatus.PINTURA, OrderStatus.COSTURA].includes(o.status)
    ).length;
    
    const pendingDelivery = orders.filter(o => o.status === OrderStatus.PRONTO).length;

    const SalesCard = ({ title, value, icon: Icon, color }: any) => (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard de Vendas</h2>
            <p className="text-gray-500 text-sm">Resumo operacional do dia: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* SALES SPECIFIC KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SalesCard 
            title="Vendas de Hoje (R$)" 
            value={`R$ ${revenueToday.toFixed(2)}`} 
            icon={DollarSign} 
            color="bg-green-500" 
          />
          <SalesCard 
            title="Pedidos Criados Hoje" 
            value={ordersToday.length} 
            icon={ShoppingCart} 
            color="bg-blue-500" 
          />
          <SalesCard 
            title="Pedidos em Produção" 
            value={inProduction} 
            icon={Clock} 
            color="bg-yellow-500" 
          />
          <SalesCard 
            title="Entregas Previstas" 
            value={pendingDelivery} 
            icon={Truck} 
            color="bg-purple-500" 
          />
        </div>

        {/* LISTA DE PEDIDOS DO DIA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Pedidos Criados Hoje</h3>
          </div>
          {ordersToday.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Pedido #</th>
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordersToday.map(o => (
                  <tr key={o.id}>
                    <td className="px-6 py-4 font-bold text-gray-700">{o.id}</td>
                    <td className="px-6 py-4">{o.clientName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${o.status === 'NOVO' ? 'bg-blue-100 text-blue-800' : ''}
                        ${['CORTE','PINTURA','COSTURA'].includes(o.status) ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${o.status === 'PRONTO' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">R$ {o.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-400">Nenhum pedido criado hoje.</div>
          )}
        </div>
      </div>
    );
  }

  // --- ADMIN & STOCK PROFILE LOGIC ---

  const ordersToday = orders.filter(o => o.date === today);
  const revenueToday = ordersToday.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status !== OrderStatus.ENTREGUE && o.status !== OrderStatus.CANCELADO);
  const lowStockProducts = products.filter(p => p.variants.some(v => v.stock <= p.minStock));
  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalProfit = isAdmin ? totalRevenue - (orders.reduce((acc, o) => acc + o.costTotal, 0) + totalExpense) : 0;
  
  // Calculate Total Stock Value (Cost Basis)
  const totalStockValue = products.reduce((acc, p) => {
      const productStockValue = p.variants.reduce((vAcc, v) => vAcc + (v.stock * p.cost), 0);
      return acc + productStockValue;
  }, 0);

  // Calculate Stock Breakdown by Category
  const stockByCategory = products.reduce((acc, p) => {
    const cat = p.category;
    if (!acc[cat]) {
      acc[cat] = { qty: 0, cost: 0, sale: 0 };
    }
    
    p.variants.forEach(v => {
      acc[cat].qty += v.stock;
      acc[cat].cost += v.stock * p.cost;
      acc[cat].sale += v.stock * p.price;
    });
    
    return acc;
  }, {} as Record<string, { qty: number, cost: number, sale: number }>);

  const salesData = [
    { name: 'Seg', vendas: 4000 },
    { name: 'Ter', vendas: 3000 },
    { name: 'Qua', vendas: 2000 },
    { name: 'Qui', vendas: 2780 },
    { name: 'Sex', vendas: 1890 },
    { name: 'Sab', vendas: 2390 },
    { name: 'Dom', vendas: 3490 },
  ];

  const statusData = [
    { name: 'Novo', value: orders.filter(o => o.status === OrderStatus.NOVO).length },
    { name: 'Em Produção', value: orders.filter(o => [OrderStatus.CORTE, OrderStatus.PINTURA, OrderStatus.COSTURA].includes(o.status)).length },
    { name: 'Pronto', value: orders.filter(o => o.status === OrderStatus.PRONTO).length },
  ];
  
  const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  const Card = ({ title, value, icon: Icon, color, subText }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        {subText && <p className={`text-xs mt-2 ${color.replace('bg-', 'text-')}`}>{subText}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 text-sm">Bem vindo de volta, {user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {!isStock && (
          <Card 
            title="Vendas Hoje" 
            value={isAdmin ? `R$ ${revenueToday.toFixed(2)}` : ordersToday.length} 
            icon={DollarSign} 
            color="bg-green-500" 
            subText={isAdmin ? `${ordersToday.length} pedidos` : ''}
          />
        )}
        <Card 
          title="Pedidos Pendentes" 
          value={pendingOrders.length} 
          icon={ShoppingCart} 
          color="bg-blue-500" 
          subText="Todo Pipeline Ativo"
        />
        <Card 
          title="Estoque Crítico" 
          value={lowStockProducts.length} 
          icon={AlertTriangle} 
          color="bg-red-500" 
          subText="Produtos abaixo do mínimo"
        />
        {isAdmin && (
          <>
            <Card 
              title="Lucro Estimado (Mês)" 
              value={`R$ ${totalProfit.toFixed(2)}`} 
              icon={TrendingUp} 
              color="bg-indigo-500" 
              subText="Receita - Custos - Despesas"
            />
            <Card 
              title="Valor em Estoque" 
              value={`R$ ${totalStockValue.toFixed(2)}`} 
              icon={Package} 
              color="bg-teal-500" 
              subText="Custo total do inventário"
            />
          </>
        )}
      </div>

      {isAdmin && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Detalhamento Financeiro do Estoque</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-medium">Categoria</th>
                  <th className="px-6 py-3 font-medium text-center">Qtd Peças</th>
                  <th className="px-6 py-3 font-medium text-right">Custo Total (Investido)</th>
                  <th className="px-6 py-3 font-medium text-right">Valor de Venda (Potencial)</th>
                  <th className="px-6 py-3 font-medium text-right">Margem Estimada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(stockByCategory).map(([cat, stats]) => (
                  <tr key={cat}>
                    <td className="px-6 py-4 font-medium text-gray-700">{cat}</td>
                    <td className="px-6 py-4 text-center">{stats.qty}</td>
                    <td className="px-6 py-4 text-right text-gray-600">R$ {stats.cost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-blue-600 font-medium">R$ {stats.sale.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-green-600 font-bold">
                      R$ {(stats.sale - stats.cost).toFixed(2)} 
                      <span className="text-xs font-normal text-gray-400 ml-1">
                        ({stats.sale > 0 ? ((stats.sale - stats.cost) / stats.sale * 100).toFixed(0) : 0}%)
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td className="px-6 py-4 text-gray-800">TOTAL GERAL</td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    {Object.values(stockByCategory).reduce((acc, s) => acc + s.qty, 0)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-800">
                    R$ {Object.values(stockByCategory).reduce((acc, s) => acc + s.cost, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-blue-700">
                    R$ {Object.values(stockByCategory).reduce((acc, s) => acc + s.sale, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-green-700">
                    R$ {Object.values(stockByCategory).reduce((acc, s) => acc + (s.sale - s.cost), 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {isAdmin ? 'Receita Semanal' : 'Volume de Pedidos'}
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Status dos Pedidos</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
