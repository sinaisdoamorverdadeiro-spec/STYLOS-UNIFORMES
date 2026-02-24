import React, { useState } from 'react';
import { useAuth, useData } from '../context/Store';
import { Role, Product } from '../types';
import { Plus, Search, ChevronDown, ChevronUp, AlertCircle, Filter, Package } from 'lucide-react';

export const Products = () => {
  const { user } = useAuth();
  const { products } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const isAdmin = user?.role === Role.ADMIN;
  // const isStock = user?.role === Role.ESTOQUE;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Catálogo de Produtos</h2>
          <p className="text-gray-500 text-sm">Gerencie uniformes, grades e estoques</p>
        </div>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
          <Plus size={18} className="mr-2" />
          Novo Produto
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou categoria..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter size={18} className="mr-2" />
          Filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium w-16"></th>
                <th className="px-6 py-4 font-medium">Produto</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium text-center">Total Estoque</th>
                <th className="px-6 py-4 font-medium text-right">Preço Venda</th>
                {isAdmin && <th className="px-6 py-4 font-medium text-right bg-red-50 text-red-700">Custo (Admin)</th>}
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(product => (
                <React.Fragment key={product.id}>
                  <tr 
                    className={`hover:bg-gray-50 transition cursor-pointer ${expandedRow === product.id ? 'bg-blue-50/30' : ''}`}
                    onClick={() => toggleRow(product.id)}
                  >
                    <td className="px-6 py-4 text-gray-400">
                      {expandedRow === product.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover mr-3 bg-gray-200" />
                        <div>
                          <p className="font-semibold text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       {product.variants.reduce((acc, v) => acc + v.stock, 0)} unid.
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      R$ {product.price.toFixed(2)}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right font-medium text-red-600 bg-red-50/50">
                        R$ {product.cost.toFixed(2)}
                      </td>
                    )}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                  
                  {/* Expanded Variants */}
                  {expandedRow === product.id && (
                    <tr className="bg-gray-50/50 shadow-inner">
                      <td colSpan={isAdmin ? 7 : 6} className="px-6 py-4">
                         <div className="bg-white rounded-lg border border-gray-200 p-4">
                           <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                             <Package size={14} className="mr-2" />
                             Variações em Estoque
                           </h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                             {product.variants.map(v => (
                               <div key={v.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                                 <div>
                                   <p className="text-sm font-semibold text-gray-700">{v.sku}</p>
                                   <p className="text-xs text-gray-500">Tam: <span className="font-bold">{v.size}</span> | Cor: {v.color}</p>
                                 </div>
                                 <div className="text-right">
                                   <span className={`text-lg font-bold ${v.stock <= product.minStock ? 'text-red-600' : 'text-green-600'}`}>
                                     {v.stock}
                                   </span>
                                   {v.stock <= product.minStock && (
                                     <AlertCircle size={14} className="text-red-500 ml-auto mt-1" />
                                   )}
                                 </div>
                               </div>
                             ))}
                           </div>
                         </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};