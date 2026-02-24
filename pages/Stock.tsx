import React, { useState } from 'react';
import { useAuth, useData } from '../context/Store';
import { Role, MovementType, OutputReason, EntryReason, PRODUCT_CATEGORIES, SCHOOL_LIST } from '../types';
import { Search, Plus, Archive, ArrowRight, ClipboardList, AlertCircle, Save, Truck, ArrowDownCircle, ArrowUpCircle, ShoppingBag, Factory, RotateCcw, Trash2 } from 'lucide-react';

export const Stock = ({ isEmbedded = false }: { isEmbedded?: boolean }) => {
  const { user } = useAuth();
  const { products, stockMovements, orders, addStockMovement } = useData();
  const [activeTab, setActiveTab] = useState<'VISAO_GERAL' | 'MOVIMENTACAO'>('MOVIMENTACAO');

  // --- Movimentação Form State ---
  const [movementType, setMovementType] = useState<MovementType>(MovementType.ENTRADA); // Default to Replenishment
  
  const [outputReason, setOutputReason] = useState<OutputReason>(OutputReason.MANUAL);
  const [entryReason, setEntryReason] = useState<EntryReason>(EntryReason.COMPRA);
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [quantity, setQuantity] = useState(1);
  const [unitValue, setUnitValue] = useState<number | ''>(''); // New state for price
  const [entryQuantities, setEntryQuantities] = useState<Record<string, number>>({}); // Bulk entry state
  const [referenceId, setReferenceId] = useState(''); // Order ID
  const [clientName, setClientName] = useState(''); // For School Delivery
  // const [notes, setNotes] = useState('');

  const isAdmin = user?.role === Role.ADMIN;
  const isSales = user?.role === Role.VENDAS;

  React.useEffect(() => {
    if (isSales) {
      setMovementType(MovementType.SAIDA);
    }
  }, [isSales]);

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      // Auto-fill category based on product category if it matches the list, otherwise keep default
      const foundCat = PRODUCT_CATEGORIES.find(c => c.toLowerCase() === prod.category.toLowerCase());
      if (foundCat) setCategory(foundCat);
      setSelectedVariantId('');
      setUnitValue(prod.price); // Auto-fill price
      setEntryQuantities({}); // Reset bulk quantities
    }
  };

  const handleEntryQuantityChange = (variantId: string, qty: string) => {
    const val = parseInt(qty);
    setEntryQuantities(prev => ({
      ...prev,
      [variantId]: isNaN(val) ? 0 : val
    }));
  };

  // --- Staging State for Entries ---
  interface PendingEntry {
    tempId: string;
    type: MovementType;
    productId: string;
    productName: string;
    variantId: string;
    size: string;
    color: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    category: string;
  }
  const [pendingEntries, setPendingEntries] = useState<PendingEntry[]>([]);

    const handleAddToPending = () => {
    if (!selectedProductId) return;
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    const finalUnitValue = unitValue === '' ? 0 : Number(unitValue);
    
    // --- LOGIC FOR ENTRY (Bulk) ---
    if (movementType === MovementType.ENTRADA) {
      const variantsToProcess = Object.entries(entryQuantities).filter(([_, qty]) => qty > 0);
        
      if (variantsToProcess.length === 0) {
        alert('Informe a quantidade para pelo menos uma variação.');
        return;
      }

      setPendingEntries(prev => {
        const updatedEntries = [...prev];
        
        for (const [variantId, qty] of variantsToProcess) {
          const variant = prod.variants.find(v => v.id === variantId);
          if (!variant) continue;

          const existingIndex = updatedEntries.findIndex(e => e.variantId === variantId && e.type === MovementType.ENTRADA);

          if (existingIndex >= 0) {
            updatedEntries[existingIndex] = {
              ...updatedEntries[existingIndex],
              quantity: updatedEntries[existingIndex].quantity + qty,
              totalCost: updatedEntries[existingIndex].totalCost + (finalUnitValue * qty)
            };
          } else {
            updatedEntries.push({
              tempId: Math.random().toString(36).substr(2, 9),
              type: MovementType.ENTRADA,
              productId: prod.id,
              productName: prod.name,
              variantId: variant.id,
              size: variant.size,
              color: variant.color,
              quantity: qty,
              unitCost: finalUnitValue,
              totalCost: finalUnitValue * qty,
              category: category
            });
          }
        }
        return updatedEntries;
      });
      setEntryQuantities({});
    } 
    // --- LOGIC FOR EXIT (Single) ---
    else {
      if (!selectedVariantId || quantity <= 0) {
        alert('Selecione uma variação e informe a quantidade.');
        return;
      }
      
      const variant = prod.variants.find(v => v.id === selectedVariantId);
      if (!variant) return;

      // Check stock
      if (variant.stock < quantity) {
        alert(`Estoque insuficiente para ${variant.size}/${variant.color}. Disponível: ${variant.stock}`);
        return;
      }

      setPendingEntries(prev => {
        const updatedEntries = [...prev];
        const existingIndex = updatedEntries.findIndex(e => e.variantId === selectedVariantId && e.type === MovementType.SAIDA);

        if (existingIndex >= 0) {
           // Check stock for cumulative quantity
           if (variant.stock < (updatedEntries[existingIndex].quantity + quantity)) {
             alert(`Estoque insuficiente para adicionar mais itens. Total na lista: ${updatedEntries[existingIndex].quantity}, Disponível: ${variant.stock}`);
             return prev; // Return previous state without changes
           }

           updatedEntries[existingIndex] = {
             ...updatedEntries[existingIndex],
             quantity: updatedEntries[existingIndex].quantity + quantity,
             totalCost: updatedEntries[existingIndex].totalCost + (finalUnitValue * quantity)
           };
        } else {
           updatedEntries.push({
             tempId: Math.random().toString(36).substr(2, 9),
             type: MovementType.SAIDA,
             productId: prod.id,
             productName: prod.name,
             variantId: variant.id,
             size: variant.size,
             color: variant.color,
             quantity: quantity,
             unitCost: finalUnitValue,
             totalCost: finalUnitValue * quantity,
             category: category
           });
        }
        return updatedEntries;
      });
      
      // Reset fields for next item
      setQuantity(1);
      setSelectedVariantId('');
    }

    // Common reset
    // setSelectedProductId(''); // Keep product selected for convenience? User might want to add another variant of same product.
    // setUnitValue(''); // Keep price?
  };

  const handleRemovePending = (tempId: string) => {
    setPendingEntries(prev => prev.filter(e => e.tempId !== tempId));
  };

  const handleConfirmEntries = async () => {
    if (pendingEntries.length === 0) return;

    let successCount = 0;
    for (const entry of pendingEntries) {
      const success = await addStockMovement({
        type: entry.type,
        reason: entry.type === MovementType.ENTRADA ? entryReason : outputReason,
        productId: entry.productId,
        variantId: entry.variantId,
        productName: entry.productName,
        category: entry.category,
        size: entry.size,
        color: entry.color,
        quantity: entry.quantity,
        unitValue: entry.unitCost,
        totalValue: entry.totalCost,
        referenceId: (entry.type === MovementType.SAIDA && outputReason === OutputReason.PEDIDO) ? referenceId : undefined,
        clientName: (entry.type === MovementType.SAIDA && outputReason === OutputReason.ENTREGA_ESCOLAR) ? clientName : undefined,
      });
      if (success) successCount++;
    }

    if (successCount > 0) {
      alert(`${successCount} itens registrados com sucesso!`);
      setPendingEntries([]);
      setActiveTab('VISAO_GERAL');
      // Reset form global states
      setReferenceId('');
      setClientName('');
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  // --- REPORT GENERATION (Simple View) ---
  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    stockMovements
      .filter(m => m.type === MovementType.SAIDA)
      .forEach(m => {
        stats[m.category] = (stats[m.category] || 0) + m.quantity;
      });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  };

  return (
    <div className="space-y-6">
      {!isEmbedded && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestão de Estoque</h2>
            <p className="text-gray-500 text-sm">Controle de entradas, saídas e reposições</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('MOVIMENTACAO')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'MOVIMENTACAO' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          + Movimentação {isSales ? '(Saída)' : '(Entrada/Saída)'}
        </button>
        <button 
          onClick={() => setActiveTab('VISAO_GERAL')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'VISAO_GERAL' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Visão Geral & Histórico
        </button>
      </div>

      {/* CONTENT: MOVIMENTAÇÃO */}
      {activeTab === 'MOVIMENTACAO' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
          
          {/* Toggle Type */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            {!isSales && (
              <button
                type="button"
                onClick={() => setMovementType(MovementType.ENTRADA)}
                className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-bold transition ${
                  movementType === MovementType.ENTRADA 
                  ? 'bg-white text-green-700 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ArrowDownCircle className="mr-2" size={18} />
                Reposição / Entrada
              </button>
            )}
            <button
              type="button"
              onClick={() => setMovementType(MovementType.SAIDA)}
              className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-bold transition ${
                movementType === MovementType.SAIDA 
                ? 'bg-white text-red-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowUpCircle className="mr-2" size={18} />
              Saída / Baixa
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            {movementType === MovementType.ENTRADA ? (
               <>
                 <Archive className="mr-2 text-green-600" />
                 Registrar Reposição de Mercadoria
               </>
            ) : (
               <>
                 <Archive className="mr-2 text-red-600" />
                 Registrar Saída de Estoque
               </>
            )}
          </h3>
          
          <form className="space-y-6">
            
            {/* 1. Motivo da Movimentação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Motivo da {movementType === MovementType.ENTRADA ? 'Entrada' : 'Saída'}</label>
              
              {movementType === MovementType.ENTRADA ? (
                 <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                    <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition ${entryReason === EntryReason.COMPRA ? 'bg-green-50 border-green-500 text-green-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}>
                      <input type="radio" name="entryReason" className="hidden" 
                        checked={entryReason === EntryReason.COMPRA} onChange={() => setEntryReason(EntryReason.COMPRA)} 
                      />
                      <ShoppingBag size={18} className="mr-2" />
                      Compra
                    </label>
                    <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition ${entryReason === EntryReason.PRODUCAO ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}>
                      <input type="radio" name="entryReason" className="hidden" 
                        checked={entryReason === EntryReason.PRODUCAO} onChange={() => setEntryReason(EntryReason.PRODUCAO)} 
                      />
                      <Factory size={18} className="mr-2" />
                      Produção
                    </label>
                    <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition ${entryReason === EntryReason.DEVOLUCAO ? 'bg-yellow-50 border-yellow-500 text-yellow-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}>
                      <input type="radio" name="entryReason" className="hidden" 
                        checked={entryReason === EntryReason.DEVOLUCAO} onChange={() => setEntryReason(EntryReason.DEVOLUCAO)} 
                      />
                      <RotateCcw size={18} className="mr-2" />
                      Devolução
                    </label>
                 </div>
              ) : (
                 <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                   <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition ${outputReason === OutputReason.ENTREGA_ESCOLAR ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}>
                     <input type="radio" name="outputReason" className="hidden" 
                       checked={outputReason === OutputReason.ENTREGA_ESCOLAR} onChange={() => {
                         setOutputReason(OutputReason.ENTREGA_ESCOLAR);
                         setReferenceId('');
                       }} 
                     />
                     <Truck size={18} className="mr-2" />
                     Escolar
                   </label>
                   <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition ${outputReason === OutputReason.MANUAL ? 'bg-yellow-50 border-yellow-500 text-yellow-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}>
                     <input type="radio" name="outputReason" className="hidden" 
                       checked={outputReason === OutputReason.MANUAL} onChange={() => {
                         setOutputReason(OutputReason.MANUAL);
                         setClientName('');
                         setReferenceId('');
                       }} 
                     />
                     <AlertCircle size={18} className="mr-2" />
                     Manual
                   </label>
                 </div>
              )}
            </div>

            {/* 2. Campos Dinâmicos de Saída (Escola) */}
            {movementType === MovementType.SAIDA && outputReason === OutputReason.ENTREGA_ESCOLAR && (
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Escola / Instituição</label>
                  <select 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                    required={outputReason === OutputReason.ENTREGA_ESCOLAR}
                  >
                    <option value="">Selecione a Escola...</option>
                    {SCHOOL_LIST.map(school => (
                      <option key={school} value={school} className="text-gray-900">{school}</option>
                    ))}
                  </select>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 3. Produto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                  <select 
                    value={selectedProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Selecione o produto...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria 
                    {!isAdmin && <span className="text-xs text-gray-400 ml-2">(Somente Admin edita)</span>}
                  </label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={!isAdmin}
                    className={`w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none ${!isAdmin ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                    required
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
            </div>

            {/* 5. Variação (Tamanho/Cor) */}
            {selectedProduct && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {movementType === MovementType.ENTRADA ? 'Informe as Quantidades por Variação' : 'Selecione a Variação (Estoque Disponível)'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedProduct.variants.map(v => (
                     movementType === MovementType.ENTRADA ? (
                        // BULK ENTRY INPUT
                        <div key={v.id} className="bg-white border rounded-md p-2 flex flex-col items-center justify-center shadow-sm">
                           <span className="font-bold text-gray-800">{v.size}</span>
                           <span className="text-xs text-gray-500 mb-1">{v.color}</span>
                           <input 
                              type="number" 
                              min="0"
                              placeholder="0"
                              value={entryQuantities[v.id] || ''}
                              onChange={(e) => handleEntryQuantityChange(v.id, e.target.value)}
                              className="w-full text-center border border-gray-300 rounded px-1 py-1 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                           />
                           <span className="text-[10px] text-gray-400 mt-1">Atual: {v.stock}</span>
                        </div>
                     ) : (
                        // SINGLE SELECTION RADIO (SAIDA)
                        <label key={v.id} className={`cursor-pointer border rounded-md p-2 flex flex-col items-center justify-center transition ${selectedVariantId === v.id ? 'bg-blue-100 border-blue-500 ring-1 ring-blue-500' : 'bg-white hover:border-gray-400'}`}>
                           <input type="radio" name="variant" className="hidden" 
                             checked={selectedVariantId === v.id}
                             onChange={() => setSelectedVariantId(v.id)}
                           />
                           <span className="font-bold text-gray-800">{v.size}</span>
                           <span className="text-xs text-gray-500">{v.color}</span>
                           <span className={`text-xs mt-1 font-medium ${v.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                             {v.stock} un.
                           </span>
                        </label>
                     )
                  ))}
                </div>
              </div>
            )}

            {/* 6. Quantidade e Botão */}
            <div className="flex items-end gap-4">
                {movementType === MovementType.SAIDA && (
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qtd</label>
                    <input 
                      type="number" 
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                )}
                
                {/* Price Field - Only for Output or if needed for Entry cost */}
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {movementType === MovementType.SAIDA ? 'Valor Unit.' : 'Custo Unit.'}
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={unitValue}
                    onChange={(e) => setUnitValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex-1">
                   <button 
                    type="button"
                    onClick={handleAddToPending}
                    className={`w-full text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center shadow-sm ${
                      movementType === MovementType.ENTRADA ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                   >
                     <Plus size={18} className="mr-2" />
                     Adicionar à Lista
                   </button>
                </div>
            </div>
          </form>

          {/* Pending Entries List */}
          {pendingEntries.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                <ClipboardList className="mr-2 text-blue-600" size={20} />
                Itens a Confirmar ({pendingEntries.length})
              </h4>
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mb-4">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Produto</th>
                      <th className="p-3 text-center">Var.</th>
                      <th className="p-3 text-center">Qtd</th>
                      <th className="p-3 text-right">Valor</th>
                      <th className="p-3 text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingEntries.map((entry) => (
                      <tr key={entry.tempId}>
                        <td className="p-3">
                          {entry.type === MovementType.ENTRADA ? (
                            <span className="text-green-600 font-bold text-xs">ENTRADA</span>
                          ) : (
                            <span className="text-red-600 font-bold text-xs">SAÍDA</span>
                          )}
                        </td>
                        <td className="p-3 font-medium text-gray-700">{entry.productName}</td>
                        <td className="p-3 text-center text-gray-500">{entry.size} - {entry.color}</td>
                        <td className="p-3 text-center font-bold">{entry.quantity}</td>
                        <td className="p-3 text-right text-gray-600">R$ {entry.totalCost.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => handleRemovePending(entry.tempId)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100 font-bold text-gray-800">
                    <tr>
                      <td colSpan={4} className="p-3 text-right">TOTAL:</td>
                      <td className="p-3 text-right">
                        R$ {pendingEntries.reduce((acc, e) => acc + e.totalCost, 0).toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <button 
                onClick={handleConfirmEntries}
                className={`w-full text-white font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center text-lg ${
                  movementType === MovementType.ENTRADA 
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                  : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                }`}
              >
                <Save size={20} className="mr-2" />
                {movementType === MovementType.ENTRADA ? 'Finalizar Entrada' : 'Finalizar Saída'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* CONTENT: VISÃO GERAL */}
      {activeTab === 'VISAO_GERAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tabela de Movimentações Recentes */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
               <h3 className="font-bold text-gray-700">Histórico de Movimentações</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="text-gray-500 bg-white border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3">Data</th>
                      <th className="px-6 py-3">Produto</th>
                      <th className="px-6 py-3">Tipo</th>
                      <th className="px-6 py-3">Motivo</th>
                      <th className="px-6 py-3 text-right">Valor</th>
                      <th className="px-6 py-3 text-right">Qtd</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {stockMovements.length === 0 ? (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Nenhuma movimentação registrada.</td></tr>
                     ) : (
                        stockMovements.slice(0, 10).map((m, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-3 text-gray-500">{new Date(m.date).toLocaleDateString('pt-BR')}</td>
                            <td className="px-6 py-3 font-medium text-gray-800">
                              {m.productName} <span className="text-xs text-gray-400">({m.size}/{m.color})</span>
                            </td>
                            <td className="px-6 py-3">
                              {m.type === MovementType.ENTRADA ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">
                                  <ArrowDownCircle size={12} className="mr-1"/> Entrada
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">
                                  <ArrowUpCircle size={12} className="mr-1"/> Saída
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-gray-600">
                               {m.reason} 
                               {m.referenceId && <span className="text-blue-500 text-xs ml-1">#{m.referenceId}</span>}
                               {m.clientName && <span className="text-purple-600 text-xs font-bold ml-1">({m.clientName})</span>}
                            </td>
                            <td className="px-6 py-3 text-right text-sm text-gray-600">
                              {m.totalValue ? `R$ ${m.totalValue.toFixed(2)}` : '-'}
                            </td>
                            <td className={`px-6 py-3 text-right font-bold ${m.type === MovementType.ENTRADA ? 'text-green-600' : 'text-red-600'}`}>
                               {m.type === MovementType.ENTRADA ? '+' : '-'}{m.quantity}
                            </td>
                          </tr>
                        ))
                     )}
                  </tbody>
               </table>
             </div>
          </div>

          {/* Relatório Rápido */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-700 mb-4">Saídas por Categoria</h3>
               <div className="space-y-3">
                 {getCategoryStats().map(([cat, qty]) => (
                   <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{cat}</span>
                      <span className="font-bold text-blue-600">{qty} unid.</span>
                   </div>
                 ))}
                 {getCategoryStats().length === 0 && <p className="text-sm text-gray-400">Sem dados.</p>}
               </div>
            </div>

            <button 
              onClick={() => setActiveTab('MOVIMENTACAO')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-lg shadow-blue-200 transition flex items-center justify-center font-bold"
            >
              <Plus size={20} className="mr-2" />
              Nova Movimentação
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
