import React, { useState } from 'react';
import { useAuth, useData } from '../context/Store';
import { OrderStatus, Role } from '../types';
import { Plus, MoreHorizontal, Truck, Check, Clock, XCircle, FileText } from 'lucide-react';
import { NewOrderModal } from '../components/NewOrderModal';

export const Orders = ({ isEmbedded = false }: { isEmbedded?: boolean }) => {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useData();
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // const isAdmin = user?.role === Role.ADMIN;

  // Since we have a dedicated Production page with 5 columns, 
  // we can group the production statuses here or show all of them.
  // Let's show all of them to maintain consistency between screens.
  
  const columns = [
    { id: OrderStatus.NOVO, label: 'Novos', color: 'border-blue-500', bg: 'bg-blue-50' },
    { id: OrderStatus.CORTE, label: 'Corte', color: 'border-orange-500', bg: 'bg-orange-50' },
    { id: OrderStatus.PINTURA, label: 'Pintura', color: 'border-purple-500', bg: 'bg-purple-50' },
    { id: OrderStatus.COSTURA, label: 'Costura', color: 'border-yellow-500', bg: 'bg-yellow-50' },
    { id: OrderStatus.PRONTO, label: 'Prontos', color: 'border-green-500', bg: 'bg-green-50' },
    // Delivered orders are usually archived, but we can show them if needed.
  ];

  const getNextStatus = (current: OrderStatus) => {
    switch (current) {
        case OrderStatus.NOVO: return OrderStatus.CORTE;
        case OrderStatus.CORTE: return OrderStatus.PINTURA;
        case OrderStatus.PINTURA: return OrderStatus.COSTURA;
        case OrderStatus.COSTURA: return OrderStatus.PRONTO;
        case OrderStatus.PRONTO: return OrderStatus.ENTREGUE;
        default: return null;
      }
  };

  const handleAdvance = (id: string, current: OrderStatus) => {
    const next = getNextStatus(current);
    if (next) updateOrderStatus(id, next);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
       {!isEmbedded && (
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Vendas & Pedidos</h2>
            <p className="text-gray-500 text-sm">Visão geral do pipeline de vendas</p>
          </div>
          <button 
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            Novo Pedido
          </button>
        </div>
       )}

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full space-x-6 min-w-[1400px]">
          {columns.map(col => {
            const colOrders = orders.filter(o => o.status === col.id);
            
            return (
              <div key={col.id} className="w-80 flex flex-col bg-gray-100 rounded-xl max-h-full">
                <div className={`p-4 border-t-4 ${col.color} bg-white rounded-t-xl shadow-sm z-10 sticky top-0`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">{col.label}</h3>
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{colOrders.length}</span>
                  </div>
                </div>
                
                <div className="p-3 overflow-y-auto custom-scroll flex-1 space-y-3">
                  {colOrders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition group">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-bold text-gray-400">#{order.id}</span>
                         <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                      </div>
                      <h4 className="font-bold text-gray-800 mb-0">{order.clientName}</h4>
                      {(order.clientPhone || order.clientCity) && (
                        <div className="text-xs text-gray-500 mb-2 flex flex-wrap gap-2">
                          {order.clientPhone && <span>{order.clientPhone}</span>}
                          {order.clientCity && <span>• {order.clientCity}</span>}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="font-bold text-blue-600 text-sm">R$ {order.total.toFixed(2)}</span>
                        <div className="text-xs text-gray-400 flex items-center">
                           <Clock size={12} className="mr-1" />
                           {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-3 hidden group-hover:flex gap-2">
                        {getNextStatus(order.status) && (
                           <button 
                             onClick={() => handleAdvance(order.id, order.status)}
                             className="flex-1 bg-blue-50 text-blue-600 text-xs font-medium py-1.5 rounded hover:bg-blue-100 transition flex justify-center items-center"
                           >
                             Avançar
                             <Check size={12} className="ml-1" />
                           </button>
                        )}
                        <button className="bg-gray-50 text-gray-600 p-1.5 rounded hover:bg-gray-200">
                           <FileText size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {colOrders.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm italic">
                      Nenhum pedido
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewOrderModal 
        isOpen={isNewOrderModalOpen} 
        onClose={() => setIsNewOrderModalOpen(false)} 
      />
    </div>
  );
};
