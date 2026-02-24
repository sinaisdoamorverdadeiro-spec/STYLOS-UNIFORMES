import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { StoreProvider, useAuth } from './context/Store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Finance } from './pages/Finance';
import { Stock } from './pages/Stock';
import { SchoolUniforms } from './pages/SchoolUniforms';
import { Production } from './pages/Production';
import { Clients } from './pages/Clients';
import { Sales } from './pages/Sales';
import { Help } from './pages/Help';
import { Users } from './pages/Users';
import { Role } from './types';
import { USERS } from './mockData';

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for demo purposes - in a real app, this would validate against a backend
    if (email && password) {
        login(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-widest">STYLOS</h1>
          <p className="text-blue-200 mt-2 text-sm">Gestão Profissional de Uniformes</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg transform active:scale-95"
            >
              ACESSAR SISTEMA
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Esqueceu sua senha? Entre em contato com o administrador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthenticatedApp = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard />;
      case 'sales': return <Sales />;
      case 'orders': return <Orders />;
      case 'stock': return <Stock />;
      case 'school-uniforms': return <SchoolUniforms />;
      case 'products': return <Products />;
      case 'production': return <Production />;
      case 'finance': return user?.role === Role.ADMIN ? <Finance /> : <div className="text-center mt-20 text-gray-500">Acesso negado.</div>;
      case 'users': return user?.role === Role.ADMIN ? <Users /> : <div className="text-center mt-20 text-gray-500">Acesso negado.</div>;
      case 'clients': return <Clients />;
      case 'help': return <Help />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeView={activeView} onChangeView={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

const Main = () => {
  const { user } = useAuth();
  return (
    <>
      <Toaster richColors position="top-right" />
      {user ? <AuthenticatedApp /> : <LoginScreen />}
    </>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <Main />
    </StoreProvider>
  );
}
