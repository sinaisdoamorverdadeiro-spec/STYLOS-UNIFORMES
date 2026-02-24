import React, { useState, useRef } from 'react';
import { useData } from '../context/Store';
import { Order, OrderStatus } from '../types';
import { Plus, Search, Printer, Eye, FileText, X } from 'lucide-react';
import { NewOrderModal } from '../components/NewOrderModal';
import { useReactToPrint } from 'react-to-print';

export const Sales = () => {
  const { orders, clients } = useData();
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Pedido_${selectedOrder?.id}`,
  });

  const filteredOrders = orders.filter(o => 
    o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPrintModal = (order: Order) => {
    setSelectedOrder(order);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Vendas</h2>
          <p className="text-gray-500 text-sm">Registre vendas, emita pedidos e imprima comprovantes</p>
        </div>
        <button 
          onClick={() => setIsNewSaleModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Nova Venda
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <Search className="text-gray-400 mr-2" size={20} />
        <input 
            type="text" 
            placeholder="Buscar por cliente ou número do pedido..." 
            className="flex-1 outline-none text-gray-700"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 font-medium">Pedido #</th>
              <th className="px-6 py-3 font-medium">Data</th>
              <th className="px-6 py-3 font-medium">Cliente</th>
              <th className="px-6 py-3 font-medium">Itens</th>
              <th className="px-6 py-3 font-medium text-right">Total</th>
              <th className="px-6 py-3 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold text-gray-700">#{order.id}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{order.clientName}</div>
                  <div className="text-xs text-gray-400">{order.clientCity}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {order.items.length} itens
                  <span className="text-xs text-gray-400 block truncate max-w-[200px]">
                    {order.items.map(i => i.productName).join(', ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-blue-600">
                  R$ {order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => openPrintModal(order)}
                    className="text-gray-500 hover:text-blue-600 transition p-2 rounded-full hover:bg-blue-50"
                    title="Imprimir Pedido"
                  >
                    <Printer size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  Nenhuma venda encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <NewOrderModal 
        isOpen={isNewSaleModalOpen} 
        onClose={() => setIsNewSaleModalOpen(false)} 
      />

      {/* Print Modal */}
      {isPrintModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Visualizar Impressão</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePrint && handlePrint()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center text-sm font-medium"
                >
                  <Printer size={16} className="mr-2" />
                  Imprimir
                </button>
                <button onClick={() => setIsPrintModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto bg-gray-50 flex-1">
              {/* Printable Area */}
              <div ref={printRef} className="bg-white p-8 shadow-sm mx-auto max-w-[210mm] min-h-[297mm] text-sm print:shadow-none print:m-0">
                
                {/* Header */}
                <div className="text-center border-b pb-6 mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">STYLOS UNIFORMES</h1>
                  <p className="text-gray-500 mt-1">Comprovante de Venda</p>
                  <p className="text-gray-400 text-xs mt-2">Pedido #{selectedOrder.id} • {new Date(selectedOrder.date).toLocaleDateString('pt-BR')}</p>
                </div>

                {/* Client Info */}
                <div className="mb-8 grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Dados do Cliente</h4>
                    <p className="text-gray-800"><span className="font-medium">Nome:</span> {selectedOrder.clientName}</p>
                    {selectedOrder.clientPhone && <p className="text-gray-600"><span className="font-medium">Tel:</span> {selectedOrder.clientPhone}</p>}
                    {selectedOrder.clientCity && <p className="text-gray-600"><span className="font-medium">Cidade:</span> {selectedOrder.clientCity}</p>}
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Detalhes</h4>
                    <p className="text-gray-600"><span className="font-medium">Entrega:</span> {new Date(selectedOrder.deliveryDate).toLocaleDateString('pt-BR')}</p>
                    <p className="text-gray-600"><span className="font-medium">Pagamento:</span> {selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                  <thead>
                    <tr className="border-b-2 border-gray-800">
                      <th className="text-left py-2 font-bold text-gray-800">Produto</th>
                      <th className="text-center py-2 font-bold text-gray-800">Tam.</th>
                      <th className="text-center py-2 font-bold text-gray-800">Qtd</th>
                      <th className="text-right py-2 font-bold text-gray-800">Unit.</th>
                      <th className="text-right py-2 font-bold text-gray-800">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 text-gray-700">
                          {item.productName}
                          <div className="text-xs text-gray-500">{item.color}</div>
                        </td>
                        <td className="py-3 text-center text-gray-700">{item.size}</td>
                        <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                        <td className="py-3 text-right text-gray-700">R$ {item.unitPrice.toFixed(2)}</td>
                        <td className="py-3 text-right font-medium text-gray-900">R$ {item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-800">
                      <td colSpan={4} className="py-4 text-right font-bold text-lg text-gray-900">TOTAL</td>
                      <td className="py-4 text-right font-bold text-lg text-gray-900">R$ {selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Footer / Notes */}
                {selectedOrder.notes && (
                  <div className="mb-8 p-4 bg-gray-50 rounded border border-gray-100">
                    <h5 className="font-bold text-gray-700 text-xs uppercase mb-1">Observações</h5>
                    <p className="text-gray-600 italic">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                  <p>Obrigado pela preferência!</p>
                  <p>Stylos Uniformes • (00) 0000-0000</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
