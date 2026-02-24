import React, { useState } from 'react';
import { useAuth, useData } from '../context/Store';
import { Role, MovementType, OutputReason, SCHOOL_CATEGORIES, SHIRT_MODELS, SCHOOL_LIST } from '../types';
import { GraduationCap, Package, Plus, CheckCircle, Save, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'sonner';

const SIZES_ORDER = ['08', '10', '12', '14', 'PP', 'P', 'M', 'G', 'GG', 'EXG'];

export const SchoolUniforms = () => {
  const { user } = useAuth();
  const { products, stockMovements, addStockMovement } = useData();
  const [activeTab, setActiveTab] = useState<string>(SCHOOL_CATEGORIES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formOutputType, setFormOutputType] = useState<OutputReason>(OutputReason.PEDIDO);
  const [formProductId, setFormProductId] = useState('');
  const [formModel, setFormModel] = useState<string>(''); // NEW: Selected Model
  const [formVariantId, setFormVariantId] = useState('');
  const [formSize, setFormSize] = useState(''); // NEW: Track size explicitly
  const [formQuantity, setFormQuantity] = useState(1);
  const [formClient, setFormClient] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Filter products by the Active Tab Category
  const categoryProducts = products.filter(p => p.category === activeTab);

  const isShirtTab = activeTab === 'Camisa';

  // Flattened view for table (Product + Variant) - KEEPING FOR REPORTS
  const flattenedInventory = categoryProducts.flatMap(p => 
    p.variants.map(v => ({
      productId: p.id,
      productName: p.name,
      variantId: v.id,
      size: v.size,
      color: v.color,
      stock: v.stock,
      minStock: p.minStock,
      sku: v.sku,
      image: p.image,
      model: v.model // New field
    }))
  );

  const handleOpenOutput = () => {
    // Reset form
    setFormOutputType(OutputReason.PEDIDO);
    setFormProductId('');
    setFormModel('');
    setFormVariantId('');
    setFormSize('');
    setFormQuantity(1);
    setFormClient('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formProductId) return;
    
    if (isShirtTab && !formModel) {
      toast.warning('Selecione o Modelo da Camisa (Polo ou Gola Redonda)');
      return;
    }

    if (!formSize) {
      toast.warning('Selecione um tamanho.');
      return;
    }

    if (!formVariantId) {
      toast.error(`O tamanho ${formSize} não está cadastrado/ativo para este produto no sistema.`);
      return;
    }

    if (formQuantity <= 0) return;

    // Validate School Selection
    if (formOutputType === OutputReason.ENTREGA_ESCOLAR && !formClient) {
      toast.warning('Selecione a Escola/Instituição.');
      return;
    }

    const prod = products.find(p => p.id === formProductId);
    const variant = prod?.variants.find(v => v.id === formVariantId);

    if (!prod || !variant) return;

    const success = await addStockMovement({
      type: MovementType.SAIDA,
      reason: formOutputType,
      productId: prod.id,
      variantId: variant.id,
      productName: prod.name,
      category: activeTab, // Auto-defined by tab
      size: variant.size,
      color: variant.color,
      quantity: formQuantity,
      clientName: formClient,
      model: isShirtTab ? formModel : undefined, // Log the model
    });

    if (success) {
      toast.success('Saída escolar registrada com sucesso!');
      setIsModalOpen(false);
    }
  };

  // --- Reports Logic ---
  const getCategoryTotalOutput = () => {
    return stockMovements
      .filter(m => m.type === MovementType.SAIDA && m.category === activeTab)
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const selectedProductForForm = products.find(p => p.id === formProductId);
  
  // Filter variants based on selected model (if applicable)
  const visibleVariants = selectedProductForForm?.variants.filter(v => 
    isShirtTab ? v.model === formModel : true
  );

  // --- Matrix View Logic ---
  // 1. Get all unique sizes for current category
  const allSizes = Array.from(new Set(
    categoryProducts.flatMap(p => p.variants.map(v => v.size))
  ));

  // 2. Sort sizes: Numeric ascending, then specific order for letters
  const sizeOrderMap: Record<string, number> = { 'PP': 100, 'P': 101, 'M': 102, 'G': 103, 'GG': 104, 'EXG': 105, 'G1': 106, 'G2': 107, 'G3': 108 };
  
  const sortedSizes = allSizes.sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    if (!isNaN(numA)) return -1; // Numbers first
    if (!isNaN(numB)) return 1;
    
    return (sizeOrderMap[a] || 999) - (sizeOrderMap[b] || 999);
  });

  // 3. Build Rows (Group by Product + Model)
  const matrixRows = categoryProducts.flatMap(p => {
    // Group variants by model
    const variantsByModel: Record<string, typeof p.variants> = {};
    p.variants.forEach(v => {
      const model = v.model || 'Padrão';
      if (!variantsByModel[model]) variantsByModel[model] = [];
      variantsByModel[model].push(v);
    });

    return Object.entries(variantsByModel).map(([model, variants]) => ({
      productId: p.id,
      productName: p.name,
      model: model === 'Padrão' ? '' : model,
      image: p.image,
      stockBySize: variants.reduce((acc, v) => {
        acc[v.size] = v.stock;
        return acc;
      }, {} as Record<string, number>),
      totalStock: variants.reduce((acc, v) => acc + v.stock, 0),
      minStock: p.minStock
    }));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <GraduationCap className="mr-3 text-blue-600" />
            Uniformes Escolares
          </h2>
          <p className="text-gray-500 text-sm">Gestão especializada de {activeTab.toLowerCase()}</p>
        </div>
      </div>

      {/* Fixed Categories Tabs */}
      <div className="border-b border-gray-200 flex overflow-x-auto">
        {SCHOOL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 
              ${activeTab === cat ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex items-center text-gray-500 text-sm">
           <Package size={16} className="mr-2" />
           <span className="hidden sm:inline">Exibindo itens de: </span>
           <span className="font-bold text-gray-800 ml-1">{activeTab}</span>
        </div>
        <button 
          onClick={handleOpenOutput}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm flex items-center transition"
        >
          <Plus size={18} className="mr-2" />
          SAÍDA / PEDIDO ({activeTab})
        </button>
      </div>

      {/* Main Content: Inventory Matrix Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Produto</th>
                {isShirtTab && <th className="px-6 py-4 font-medium bg-blue-50 text-blue-800">Modelo</th>}
                {sortedSizes.map(size => (
                  <th key={size} className="px-2 py-4 font-medium text-center w-16">{size}</th>
                ))}
                <th className="px-6 py-4 font-medium text-center bg-gray-100">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {matrixRows.length === 0 ? (
                <tr>
                  <td colSpan={sortedSizes.length + (isShirtTab ? 3 : 2)} className="px-6 py-10 text-center text-gray-400">
                    Nenhum produto cadastrado na categoria {activeTab}.
                  </td>
                </tr>
              ) : (
                matrixRows.map((row, idx) => (
                  <tr key={`${row.productId}-${row.model}`} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={row.image} alt="" className="w-8 h-8 rounded object-cover mr-3 bg-gray-200" />
                        <span className="font-bold text-gray-800">{row.productName}</span>
                      </div>
                    </td>
                    {isShirtTab && (
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${row.model === 'Polo' ? 'bg-indigo-100 text-indigo-800' : 'bg-orange-100 text-orange-800'}`}>
                          {row.model || '-'}
                        </span>
                      </td>
                    )}
                    {sortedSizes.map(size => {
                      const stock = row.stockBySize[size];
                      const hasStock = stock !== undefined;
                      return (
                        <td key={size} className="px-2 py-4 text-center">
                          {hasStock ? (
                            <span className={`font-bold ${stock === 0 ? 'text-red-300' : stock < 5 ? 'text-yellow-600' : 'text-gray-700'}`}>
                              {stock}
                            </span>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-center bg-gray-50">
                      <span className={`font-bold text-base ${row.totalStock <= row.minStock ? 'text-red-600' : 'text-blue-600'}`}>
                        {row.totalStock}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reports Section (Simplified) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-2">Saídas de {activeTab}</h3>
            <div className="flex items-end">
               <span className="text-3xl font-bold text-blue-600">{getCategoryTotalOutput()}</span>
               <span className="text-gray-500 ml-2 mb-1">unidades retiradas</span>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-2">Itens com Estoque Crítico</h3>
            <ul className="space-y-2">
               {flattenedInventory.filter(i => i.stock <= i.minStock).slice(0, 3).map((i, idx) => (
                 <li key={idx} className="flex justify-between text-sm">
                   <span className="text-gray-600">{i.productName} ({i.size}) {isShirtTab ? `- ${i.model}` : ''}</span>
                   <span className="font-bold text-red-500">{i.stock} un.</span>
                 </li>
               ))}
               {flattenedInventory.filter(i => i.stock <= i.minStock).length === 0 && (
                 <li className="text-sm text-green-600 flex items-center"><CheckCircle size={14} className="mr-1"/> Estoque saudável</li>
               )}
            </ul>
         </div>
      </div>

      {/* MODAL: SAÍDA / PEDIDO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="bg-blue-600 p-4 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center">
                <GraduationCap className="mr-2" size={20} />
                Saída: {activeTab}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                 <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Product Selection (Filtered) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto ({activeTab})</label>
                <select 
                  value={formProductId}
                  onChange={e => { 
                    setFormProductId(e.target.value); 
                    setFormVariantId(''); 
                    setFormSize('');
                    setFormModel(''); // Reset model when product changes
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione...</option>
                  {categoryProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* MODEL SELECTION (Required for Shirts) */}
              {selectedProductForForm && isShirtTab && (
                <div>
                   <label className="block text-sm font-bold text-gray-800 mb-2">Modelo da Camisa <span className="text-red-500">*</span></label>
                   <div className="flex space-x-3">
                     {SHIRT_MODELS.map(model => (
                       <label 
                         key={model} 
                         className={`flex-1 cursor-pointer border rounded-lg p-3 text-center transition select-none
                           ${formModel === model 
                             ? 'bg-blue-100 border-blue-500 text-blue-900 font-bold shadow-sm' 
                             : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                           }`}
                       >
                         <input 
                           type="radio" 
                           name="shirtModel" 
                           className="hidden"
                           value={model}
                           checked={formModel === model}
                           onChange={() => { 
                             setFormModel(model); 
                             setFormVariantId(''); 
                             setFormSize('');
                           }}
                         />
                         {model}
                       </label>
                     ))}
                   </div>
                </div>
              )}

              {/* Variant Selection (Fixed Size Grid) */}
              {selectedProductForForm && (
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Tamanho
                   </label>
                   
                   {!formModel && isShirtTab ? (
                     <div className="p-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-200">
                       Selecione um modelo acima para ver os tamanhos disponíveis.
                     </div>
                   ) : (
                     <div className="grid grid-cols-5 gap-2">
                       {SIZES_ORDER.map(size => {
                         const variant = visibleVariants?.find(v => v.size === size);
                         const isSelected = formSize === size;
                         const isRegistered = !!variant;

                         return (
                           <button
                             key={size}
                             type="button"
                             onClick={() => {
                               setFormSize(size);
                               setFormVariantId(variant ? variant.id : '');
                             }}
                             className={`
                               h-12 rounded-lg border text-sm font-bold transition
                               ${isSelected
                                   ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105'
                                   : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                               }
                             `}
                           >
                             {size}
                           </button>
                         );
                       })}
                     </div>
                   )}
                </div>
              )}

              {/* Quantity */}
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                 <input 
                   type="number" 
                   min="1" 
                   value={formQuantity} 
                   onChange={e => setFormQuantity(parseInt(e.target.value))}
                   className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                   required
                 />
              </div>

              {/* Type and Client (Improved Layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Saída</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 cursor-pointer border rounded-lg p-3 text-center transition select-none flex items-center justify-center
                        ${formOutputType === OutputReason.PEDIDO 
                          ? 'bg-blue-100 border-blue-500 text-blue-900 font-bold shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <input type="radio" name="type" className="hidden"
                          checked={formOutputType === OutputReason.PEDIDO}
                          onChange={() => {
                            setFormOutputType(OutputReason.PEDIDO);
                            setFormClient(''); // Reset client when changing type
                          }}
                        />
                        <ShoppingBag size={18} className="mr-2" />
                        Pedido Normal
                      </label>
                      <label className={`flex-1 cursor-pointer border rounded-lg p-3 text-center transition select-none flex items-center justify-center
                        ${formOutputType === OutputReason.ENTREGA_ESCOLAR 
                          ? 'bg-purple-100 border-purple-500 text-purple-900 font-bold shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <input type="radio" name="type" className="hidden"
                          checked={formOutputType === OutputReason.ENTREGA_ESCOLAR}
                          onChange={() => {
                            setFormOutputType(OutputReason.ENTREGA_ESCOLAR);
                            setFormClient(''); // Reset client when changing type
                          }}
                        />
                        <Truck size={18} className="mr-2" />
                        Entrega Escolar
                      </label>
                    </div>
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formOutputType === OutputReason.ENTREGA_ESCOLAR ? 'Escola / Instituição' : 'Cliente / Aluno'}
                    </label>
                    
                    {formOutputType === OutputReason.ENTREGA_ESCOLAR ? (
                      <select
                        value={formClient}
                        onChange={e => setFormClient(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Selecione a Escola...</option>
                        {SCHOOL_LIST.map(school => (
                          <option key={school} value={school} className="text-gray-900">{school}</option>
                        ))}
                      </select>
                    ) : (
                      <input 
                         type="text" 
                         value={formClient}
                         onChange={e => setFormClient(e.target.value)}
                         placeholder="Nome do cliente"
                         className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea 
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={2}
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                <Save size={18} className="mr-2" />
                Confirmar Saída
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
