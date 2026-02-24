import React, { useState } from 'react';
import { useAuth } from '../context/Store';
import { Role, User } from '../types';
import { Plus, Trash2, Shield, User as UserIcon, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const Users = () => {
  const { usersList, registerUser, deleteUser, user: currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | Role>('ALL');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.VENDAS);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
        toast.error('Preencha todos os campos.');
        return;
    }

    const success = await registerUser({
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
    });

    if (success) {
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        setRole(Role.VENDAS);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
        await deleteUser(id);
    }
  };

  const filteredUsers = usersList.filter(u => activeTab === 'ALL' || u.role === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Funcionários</h2>
          <p className="text-gray-500 text-sm">Gerencie o acesso de Vendedores e Estoquistas</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Novo Funcionário
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-1 overflow-x-auto">
        <button 
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'ALL' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Todos
        </button>
        <button 
            onClick={() => setActiveTab(Role.VENDAS)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === Role.VENDAS ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Vendedores
        </button>
        <button 
            onClick={() => setActiveTab(Role.ESTOQUE)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === Role.ESTOQUE ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Estoque
        </button>
        <button 
            onClick={() => setActiveTab(Role.ADMIN)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === Role.ADMIN ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Administradores
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between group hover:shadow-md transition">
            <div className="flex items-center">
              <img src={u.avatar || 'https://via.placeholder.com/50'} alt={u.name} className="w-12 h-12 rounded-full border-2 border-gray-100 mr-4" />
              <div>
                <h3 className="font-bold text-gray-800">{u.name}</h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Mail size={12} className="mr-1" /> {u.email}
                </p>
                <div className="mt-2 flex flex-col gap-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border w-fit ${
                        u.role === Role.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        u.role === Role.ESTOQUE ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                        {u.role === Role.ADMIN && <Shield size={10} className="mr-1" />}
                        {u.role}
                    </span>
                    {/* Show password only for admin to see/share (in a real app this is bad practice, but requested for generating login) */}
                    <span className="text-xs text-gray-400 flex items-center">
                        <Lock size={10} className="mr-1" /> Senha: {u.password || '******'}
                    </span>
                </div>
              </div>
            </div>
            {currentUser?.id !== u.id && (
                <button 
                    onClick={() => handleDelete(u.id)}
                    className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"
                    title="Remover Usuário"
                >
                    <Trash2 size={18} />
                </button>
            )}
          </div>
        ))}
        {filteredUsers.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
                Nenhum funcionário encontrado nesta categoria.
            </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Gerar Acesso de Funcionário</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <span className="text-2xl">&times;</span>
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Crie um login e senha para que o funcionário possa acessar a plataforma.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Funcionário</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nome Completo"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email de Login</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="email@exemplo.com"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha de Acesso</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Crie uma senha forte"
                            required
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Esta senha será usada para o funcionário entrar no sistema.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Função (Cargo)</label>
                    <select 
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={Role.VENDAS}>Vendedor(a)</option>
                        <option value={Role.ESTOQUE}>Estoquista</option>
                        <option value={Role.ADMIN}>Administrador</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        Gerar Acesso
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
