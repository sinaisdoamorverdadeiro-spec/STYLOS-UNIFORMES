import React, { useState, useEffect } from 'react';
import { useData, useAuth } from '../context/Store';
import { Order, OrderStatus, PaymentMethod, OrderItem, Product, MovementType, OutputReason } from '../types';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewOrderModal = ({ isOpen, onClose }: NewOrderModalProps) => {
  const { user } = useAuth();
  const { products, addOrder, clients, addStockMovement } = useData();
  
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCity, setClientCity] = useState('');
  
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');

  // Item form state
  const [selectedProductId, setSelectedProductId] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState<number | ''>('');

  if (!isOpen) return null;

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setClientId(id);
    if (id) {
      const client = clients.find(c => c.id === id);
      if (client) {
        setClientName(client.name);
        setClientPhone(client.phone);
        setClientCity(client.city || '');
      }
    } else {
      setClientName('');
      setClientPhone('');
      setClientCity('');
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleAddItem = () => {
    if (!selectedProduct || !size || !color || quantity <= 0) {
      toast.warning('Preencha o produto, tamanho, cor e quantidade.');
      return;
    }

    const unitPrice = customPrice !== '' ? Number(customPrice) : selectedProduct.price;

    // Try to find matching variant for stock tracking
    const matchingVariant = selectedProduct.variants.find(
      v => v.size.toLowerCase() === size.toLowerCase() && 
           v.color.toLowerCase() === color.toLowerCase()
    );

    // Check stock locally before adding to cart (optional but good UX)
    if (matchingVariant && matchingVariant.stock < quantity) {
      toast.warning(`Atenção: Estoque atual (${matchingVariant.stock}) é menor que a quantidade solicitada.`);
      // We allow adding but warn, or we could block. Let's allow but warn.
    }

    const newItem: OrderItem = {
      productId: selectedProduct.id,
      variantId: matchingVariant?.id, // Optional
      productName: selectedProduct.name,
      size: size,
      color: color,
      quantity: quantity,
      unitPrice: unitPrice,
      subtotal: unitPrice * quantity
    };

    setItems([...items, newItem]);
    
    // Reset item form
    setQuantity(1);
    setCustomPrice('');
    // Keep size/color or reset? Resetting is safer.
    setSize('');
    setColor('');
    toast.success('Item adicionado ao pedido.');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    toast.info('Item removido.');
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const calculateCostTotal = () => {
    return items.reduce((acc, item) => {
      const prod = products.find(p => p.id === item.productId);
      return acc + ((prod?.cost || 0) * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !deliveryDate || items.length === 0) {
      toast.error('Preencha os campos obrigatórios e adicione pelo menos um item.');
      return;
    }

    if (!user) {
      toast.error('Erro: Usuário não autenticado.');
      return;
    }

    const orderId = Math.random().toString(36).substr(2, 6).toUpperCase();

    // 1. Process Stock Movements (Deduct Stock)
    // We do this first. If any fail, we might want to abort or warn.
    // Since addStockMovement handles alerts, we just iterate.
    let stockErrors = false;
    
    for (const item of items) {
      if (item.variantId) {
        const product = products.find(p => p.id === item.productId);
        const success = await addStockMovement({
          type: MovementType.SAIDA,
          reason: OutputReason.PEDIDO,
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName,
          category: product?.category || 'Venda',
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          referenceId: orderId,
          clientName: clientName,
          unitValue: item.unitPrice,
          totalValue: item.subtotal
        });

        if (!success) {
          stockErrors = true;
          // In a real app we might rollback. Here we just stop and warn.
          // But since we are iterating, some might have succeeded.
          // For simplicity in this prototype, we assume the user handles the partial state or we just proceed with the Order creation but warn about stock.
        }
      }
    }

    if (stockErrors) {
      toast.warning('Alguns itens não puderam ter o estoque baixado (estoque insuficiente). O pedido será criado, mas verifique o estoque.');
    }

    // 2. Create/Get Client
    let finalClientId = clientId;
    if (!finalClientId) {
      // Create new client
      const newClient = {
        id: Math.random().toString(36).substr(2, 9),
        name: clientName,
        phone: clientPhone,
        city: clientCity,
        email: '', // Optional
        address: '', // Optional
        type: 'PF' as const,
        document: ''
      };
      addClient(newClient);
      finalClientId = newClient.id;
    }

    // 3. Create Order
    const newOrder: Order = {
      id: orderId,
      clientId: finalClientId,
      clientName,
      clientPhone,
      clientCity,
      date: new Date().toISOString(),
      deliveryDate: new Date(deliveryDate).toISOString(),
      status: OrderStatus.NOVO,
      items,
      total: calculateTotal(),
      costTotal: calculateCostTotal(), // Calculated Cost
      paymentMethod,
      notes
    };

    addOrder(newOrder);
    toast.success('Pedido criado com sucesso!');
    onClose();
    
    // Reset form
    setClientId('');
    setClientName('');
    setClientPhone('');
    setClientCity('');
    setDeliveryDate('');
    setItems([]);
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Novo Pedido de Venda</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* 1. Client & Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Selecionar Cliente</label>
                <select 
                  value={clientId}
                  onChange={handleClientChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Novo / Manual</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: João Silva ou Escola X"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input 
                type="text" 
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input 
                type="text" 
                value={clientCity}
                onChange={(e) => setClientCity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Cidade"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrega</label>
              <input 
                type="date" 
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* 2. Add Items */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-700 flex items-center">
              <Plus size={18} className="mr-2 text-blue-600" />
              Adicionar Produtos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Produto</label>
                <select 
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setSize('');
                    setColor('');
                    setCustomPrice('');
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Tamanho</label>
                <input 
                  type="text" 
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  placeholder="Ex: M"
                  disabled={!selectedProductId}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Cor</label>
                <input 
                  type="text" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  placeholder="Ex: Azul"
                  disabled={!selectedProductId}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Qtd</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Preço Unit. (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={customPrice !== '' ? customPrice : (selectedProduct?.price || '')}
                  onChange={(e) => setCustomPrice(parseFloat(e.target.value))}
                  placeholder={selectedProduct ? selectedProduct.price.toFixed(2) : '0.00'}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>

              <div className="md:col-span-1">
                <button 
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedProductId || !size || !color || quantity <= 0}
                  className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Items List */}
          {items.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 font-medium border-b">
                  <tr>
                    <th className="p-3">Produto</th>
                    <th className="p-3">Variação</th>
                    <th className="p-3 text-center">Qtd</th>
                    <th className="p-3 text-right">Unitário</th>
                    <th className="p-3 text-right">Subtotal</th>
                    <th className="p-3 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium">{item.productName}</td>
                      <td className="p-3 text-gray-500">{item.size} / {item.color}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold text-gray-800">R$ {item.subtotal.toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-bold text-gray-800">
                  <tr>
                    <td colSpan={4} className="p-3 text-right">TOTAL DO PEDIDO:</td>
                    <td className="p-3 text-right text-blue-600 text-lg">R$ {calculateTotal().toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* 4. Payment & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                >
                  {Object.values(PaymentMethod).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none h-20 resize-none"
                  placeholder="Detalhes adicionais..."
                />
             </div>
          </div>

        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-sm flex items-center"
          >
            <Save size={18} className="mr-2" />
            Salvar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};
