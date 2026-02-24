import React, { useState } from 'react';
import { useAuth, useData } from '../context/Store';
import { Role } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingBag, 
  Scissors, 
  DollarSign, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Archive,
  GraduationCap,
  Wifi,
  WifiOff,
  HelpCircle,
  UserCog
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onChangeView: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onChangeView }) => {
  const { user, logout } = useAuth();
  const { loading, products } = useData(); // Get loading and products to check connection
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === Role.ADMIN;
  const isConnected = !loading && products.length > 0;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.ADMIN, Role.ESTOQUE, Role.VENDAS] },
    { id: 'sales', label: 'Vendas', icon: ShoppingBag, roles: [Role.ADMIN, Role.VENDAS] },
    { id: 'stock', label: 'Estoque / Saídas', icon: Archive, roles: [Role.ADMIN, Role.ESTOQUE, Role.VENDAS] },
    { id: 'school-uniforms', label: 'Uniformes Escolares', icon: GraduationCap, roles: [Role.ADMIN, Role.ESTOQUE, Role.VENDAS] },
    { id: 'clients', label: 'Clientes', icon: Users, roles: [Role.ADMIN, Role.VENDAS] },
    { id: 'products', label: 'Catálogo Geral', icon: Package, roles: [Role.ADMIN, Role.ESTOQUE, Role.VENDAS] },
    { id: 'production', label: 'Produção', icon: Scissors, roles: [Role.ADMIN, Role.ESTOQUE, Role.VENDAS] },
    { id: 'finance', label: 'Financeiro', icon: DollarSign, roles: [Role.ADMIN] },
    { id: 'users', label: 'Funcionários', icon: UserCog, roles: [Role.ADMIN] },
    { id: 'help', label: 'Ajuda & Deploy', icon: HelpCircle, roles: [Role.ADMIN, Role.ESTOQUE, Role.VENDAS] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user!.role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white shadow-xl">
      <div className="p-6 border-b border-slate-800 flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold tracking-wider text-blue-400">STYLOS</h1>
        <div className={`mt-2 flex items-center text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
          {isConnected ? <Wifi size={12} className="mr-1" /> : <WifiOff size={12} className="mr-1" />}
          {isConnected ? 'Online (Supabase)' : 'Desconectado'}
        </div>
      </div>
      <nav className="flex-1 py-6 space-y-1">
        {filteredMenu.map(item => (
          <button
            key={item.id}
            onClick={() => {
              onChangeView(item.id);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-6 py-3 transition-colors ${
              activeView === item.id 
                ? 'bg-blue-600 text-white border-r-4 border-blue-300' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} className="mr-3" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center mb-4">
          <img src={user?.avatar || 'https://via.placeholder.com/40'} alt="User" className="w-10 h-10 rounded-full mr-3 border-2 border-slate-600" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out z-40 md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 z-10">
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-600">
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
            <Search size={18} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Buscar pedido, cliente, produto..." 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
