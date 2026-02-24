import React, { useState } from 'react';
import { useAuth, useData } from '../context/Store';
import { Role, ExpenseCategory, Expense } from '../types';
import { DollarSign, ArrowUpRight, ArrowDownRight, PieChart as PieIcon, Plus, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Finance = () => {
  const { user } = useAuth();
  const { orders, expenses, addExpense } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FIXO);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (user?.role !== Role.ADMIN) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Acesso Restrito: Somente Administradores.</p>
      </div>
    );
  }

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      amount: parseFloat(amount),
      category,
      date
    };

    addExpense(newExpense);
    setIsModalOpen(false);
    setDescription('');
    setAmount('');
    setCategory(ExpenseCategory.FIXO);
  };

  // Basic Calcs
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalCOGS = orders.reduce((acc, o) => acc + o.costTotal, 0); // Cost of Goods Sold
  const netProfit = totalRevenue - totalExpenses - totalCOGS;

  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const data = [
    { name: 'Receita', value: totalRevenue },
    { name: 'Custos Prod.', value: totalCOGS },
    { name: 'Despesas Op.', value: totalExpenses },
    { name: 'Lucro Líquido', value: netProfit },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Financeiro</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Nova Despesa
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm">Receita Total</p>
               <h3 className="text-2xl font-bold text-gray-800 mt-1">R$ {totalRevenue.toFixed(2)}</h3>
             </div>
             <div className="p-2 bg-green-100 rounded-lg text-green-600"><ArrowUpRight size={20}/></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm">Despesas + Custos</p>
               <h3 className="text-2xl font-bold text-gray-800 mt-1 text-red-600">R$ {(totalExpenses + totalCOGS).toFixed(2)}</h3>
             </div>
             <div className="p-2 bg-red-100 rounded-lg text-red-600"><ArrowDownRight size={20}/></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm">Lucro Líquido</p>
               <h3 className="text-2xl font-bold text-gray-800 mt-1 text-blue-600">R$ {netProfit.toFixed(2)}</h3>
             </div>
             <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><DollarSign size={20}/></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm">Margem Líquida</p>
               <h3 className="text-2xl font-bold text-gray-800 mt-1">{margin.toFixed(1)}%</h3>
             </div>
             <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><PieIcon size={20}/></div>
           </div>
        </div>
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="font-bold text-gray-700 mb-4">Fluxo de Caixa Simplificado</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={40}>
                 {/* No generic conditional fill in simple Recharts map without Cell, just defaulting blue */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h3 className="font-bold text-gray-700">Últimas Despesas</h3>
          </div>
          <div className="overflow-y-auto max-h-[300px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 sticky top-0">
                 <tr>
                   <th className="px-6 py-3">Descrição</th>
                   <th className="px-6 py-3">Categoria</th>
                   <th className="px-6 py-3 text-right">Valor</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.map(exp => (
                  <tr key={exp.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{exp.description}</div>
                      <div className="text-xs text-gray-400">{new Date(exp.date).toLocaleDateString('pt-BR')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{exp.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-red-600 font-medium">- R$ {exp.amount.toFixed(2)}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">Nenhuma despesa registrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Nova Despesa</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input 
                  type="text" 
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Ex: Conta de Luz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                >
                  {Object.values(ExpenseCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-sm"
                >
                  Registrar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
