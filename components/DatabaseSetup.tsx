import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { PRODUCTS } from '../mockData';

export const DatabaseSetup = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSetup = async () => {
    setLoading(true);
    setMessage('Iniciando configuração...');

    try {
      // 1. Check if products already exist
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
      
      if (count && count > 0) {
        setMessage('O banco de dados já contém dados. Nenhuma ação necessária.');
        setLoading(false);
        return;
      }

      // 2. Insert Products
      for (const p of PRODUCTS) {
        // Insert Product
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .insert([{
            // We let Supabase generate the ID, or we can use the one from mockData if it's a valid UUID
            // mockData IDs are '1', '2', etc. which are NOT valid UUIDs.
            // So we must let Supabase generate UUIDs and map them.
            name: p.name,
            category: p.category,
            description: p.description,
            price: p.price,
            cost: p.cost,
            min_stock: p.minStock,
            status: p.status,
            image: p.image
          }])
          .select()
          .single();

        if (prodError) {
          console.error('Erro ao inserir produto:', p.name, prodError);
          continue;
        }

        if (!prodData) continue;

        // Insert Variants
        if (p.variants && p.variants.length > 0) {
          const variantsToInsert = p.variants.map(v => ({
            product_id: prodData.id,
            size: v.size,
            color: v.color,
            stock: v.stock,
            sku: v.sku,
            model: v.model
          }));

          const { error: varError } = await supabase
            .from('variants')
            .insert(variantsToInsert);
          
          if (varError) {
            console.error('Erro ao inserir variantes para:', p.name, varError);
          }
        }
      }

      setMessage('Dados inseridos com sucesso! Agora você pode fazer login.');

    } catch (error: any) {
      setMessage('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
      <h3 className="text-sm font-bold text-gray-700 mb-2">Configuração Inicial (Apenas na primeira vez)</h3>
      <p className="text-xs text-gray-500 mb-3">
        Se você acabou de criar o banco no Supabase e ele está vazio, clique abaixo para inserir os dados de exemplo.
      </p>
      
      <button 
        onClick={handleSetup} 
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Configurando...' : 'Inicializar Banco de Dados'}
      </button>

      {message && (
        <div className={`mt-2 text-xs p-2 rounded ${message.includes('sucesso') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
};
