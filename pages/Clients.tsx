import React, { useState } from 'react';
import { useData } from '../context/Store';
import { Client } from '../types';
import { Plus, Search, User, Building, MapPin, Phone, Mail, Trash2 } from 'lucide-react';

export const Clients = () => {
  const { clients, addClient } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<'PF' | 'PJ'>('PF');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
        alert('Nome e Telefone são obrigatórios');
        return;
    }

    const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        type,
        document,
        email,
        phone,
        city,
        address
    };

    addClient(newClient);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
      setName('');
      setType('PF');
      setDocument('');
      setEmail('');
      setPhone('');
      setCity('');
      setAddress('');
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.document.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Clientes</h2>
          <p className="text-gray-500 text-sm">Base de clientes e contatos</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Novo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <Search className="text-gray-400 mr-2" size={20} />
        <input 
            type="text" 
            placeholder="Buscar por nome, documento ou email..." 
            className="flex-1 outline-none text-gray-700"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
            <div key={client.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                        {client.type === 'PJ' ? <Building size={24} /> : <User size={24} />}
                    </div>
                    <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {client.type}
                    </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">{client.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{client.document || 'Sem documento'}</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                        <Phone size={14} className="mr-2 text-gray-400" />
                        {client.phone}
                    </div>
                    <div className="flex items-center">
                        <Mail size={14} className="mr-2 text-gray-400" />
                        {client.email || '-'}
                    </div>
                    <div className="flex items-center">
                        <MapPin size={14} className="mr-2 text-gray-400" />
                        <span className="truncate">{client.address || '-'}</span>
                    </div>
                </div>
            </div>
        ))}
        {filteredClients.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">
                Nenhum cliente encontrado.
            </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Novo Cliente</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo / Razão Social</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select 
                                value={type}
                                onChange={e => setType(e.target.value as 'PF' | 'PJ')}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="PF">Pessoa Física</option>
                                <option value="PJ">Pessoa Jurídica</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF / CNPJ</label>
                            <input 
                                type="text" 
                                value={document}
                                onChange={e => setDocument(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                            <input 
                                type="text" 
                                required
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                            <input 
                                type="text" 
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                        <textarea 
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                        >
                            Salvar Cliente
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
