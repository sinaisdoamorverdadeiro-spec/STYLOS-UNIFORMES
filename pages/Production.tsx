import React from 'react';
import { useAuth, useData } from '../context/Store';
import { OrderStatus, Role } from '../types';
import { Scissors, Palette, Shirt, Truck, Package, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

export const Production = () => {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useData();

  // Define the 5 columns as requested
  const columns = [
    { 
      id: OrderStatus.NOVO, 
      label: 'Pedido', 
      icon: Package,
      color: 'border-blue-500', 
      bg: 'bg-blue-50',
      text: 'text-blue-700'
    },
    { 
      id: OrderStatus.CORTE, 
      label: 'Corte', 
      icon: Scissors,
      color: 'border-orange-500', 
      bg: 'bg-orange-50',
      text: 'text-orange-700'
    },
    { 
      id: OrderStatus.PINTURA, 
      label: 'Pintura', 
      icon: Palette,
      color: 'border-purple-500', 
      bg: 'bg-purple-50',
      text: 'text-purple-700'
    },
    { 
      id: OrderStatus.COSTURA, 
      label: 'Produção', 
      icon: Shirt,
      color: 'border-yellow-500', 
      bg: 'bg-yellow-50',
      text: 'text-yellow-700'
    },
    { 
      id: OrderStatus.PRONTO, 
      label: 'Entrega', 
      icon: Truck,
      color: 'border-green-500', 
      bg: 'bg-green-50',
      text: 'text-green-700'
    },
  ];

  // Logic to advance status in the specific chain
  const getNextStatus = (current: OrderStatus) => {
    switch (current) {
      case OrderStatus.NOVO: return OrderStatus.CORTE;
      case OrderStatus.CORTE: return OrderStatus.PINTURA;
      case OrderStatus.PINTURA: return OrderStatus.COSTURA;
      case OrderStatus.COSTURA: return OrderStatus.PRONTO;
      case OrderStatus.PRONTO: return OrderStatus.ENTREGUE; // Move to History/Done
      default: return null;
    }
  };

  const handleAdvance = (id: string, current: OrderStatus) => {
    const next = getNextStatus(current);
    if (next) {
      // Optional confirmation for final step
      if (next === OrderStatus.ENTREGUE) {
        if (!window.confirm('Confirmar entrega do pedido? Ele sairá do quadro de produção.')) return;
      }
      updateOrderStatus(id, next);
    }
  };

  // Helper to calculate days remaining
  const getDaysRemaining = (deliveryDate: string) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Scissors className="mr-3 text-blue-600" />
            Fila de Produção
          </h2>
          <p className="text-gray-500 text-sm">Acompanhamento detalhado do chão de fábrica</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full space-x-4 min-w-[1200px]">
          {columns.map(col => {
            const colOrders = orders.filter(o => o.status === col.id);
            const Icon = col.icon;
            
            return (
              <div key={col.id} className="flex-1 min-w-[280px] flex flex-col bg-gray-100 rounded-xl max-h-full border border-gray-200">
                {/* Column Header */}
                <div className={`p-4 border-t-4 ${col.color} bg-white rounded-t-xl shadow-sm z-10 sticky top-0`}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-bold flex items-center ${col.text}`}>
                      <Icon size={18} className="mr-2" />
                      {col.label}
                    </h3>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full border border-gray-200">
                      {colOrders.length}
                    </span>
                  </div>
                </div>
                
                {/* Cards List */}
                <div className="p-3 overflow-y-auto custom-scroll flex-1 space-y-3">
                  {colOrders.map(order => {
                    const daysLeft = getDaysRemaining(order.deliveryDate);
                    const isLate = daysLeft < 0;
                    const isUrgent = daysLeft <= 2 && daysLeft >= 0;

                    return (
                      <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition group relative">
                        {/* Tags / Badges */}
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-xs font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">#{order.id}</span>
                           {isLate && <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded flex items-center"><AlertTriangle size={10} className="mr-1"/> Atrasado</span>}
                           {isUrgent && <span className="text-xs font-bold text-white bg-orange-400 px-2 py-0.5 rounded">Urgente</span>}
                        </div>

                        <h4 className="font-bold text-gray-800 mb-1 leading-tight">{order.clientName}</h4>
                        
                        {/* Order Items Summary */}
                        <div className="bg-gray-50 p-2 rounded border border-gray-100 mb-3">
                          {order.items.slice(0, 2).map((i, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex justify-between">
                              <span>{i.productName} ({i.size})</span>
                              <span className="font-bold">x{i.quantity}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-xs text-blue-500 mt-1 font-medium">+ {order.items.length - 2} outros itens</div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <div className={`text-xs flex items-center font-medium ${isLate ? 'text-red-600' : 'text-gray-500'}`}>
                             <Clock size={12} className="mr-1" />
                             {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>

                        {/* Advance Button */}
                        <button 
                           onClick={() => handleAdvance(order.id, order.status)}
                           className={`mt-3 w-full py-2 rounded-lg text-xs font-bold flex justify-center items-center transition
                             ${col.bg} ${col.text} hover:bg-opacity-80 hover:shadow-sm`}
                        >
                           {col.id === OrderStatus.PRONTO ? 'Finalizar Entrega' : 'Próxima Etapa'}
                           <ArrowRight size={12} className="ml-1" />
                        </button>
                      </div>
                    );
                  })}
                  
                  {colOrders.length === 0 && (
                    <div className="h-20 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="text-gray-400 text-xs italic">Vazio</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
