# Código Fonte Completo - Stylos Uniformes

Este arquivo contém o código fonte dos principais arquivos do projeto para referência.
Para baixar o projeto completo e executável, utilize o botão de **Export/Download** na barra superior do editor.

## Estrutura de Arquivos Incluídos:
1. package.json
2. vite.config.ts
3. index.tsx
4. types.ts
5. services/supabase.ts
6. context/Store.tsx
7. components/Layout.tsx
8. App.tsx
9. pages/Dashboard.tsx
10. pages/Sales.tsx
11. pages/Production.tsx
12. pages/Products.tsx
13. pages/Orders.tsx
14. pages/Stock.tsx
15. pages/Finance.tsx
16. pages/Clients.tsx
17. pages/SchoolUniforms.tsx
18. pages/Help.tsx
19. components/NewOrderModal.tsx
20. mockData.ts
21. index.html
22. index.css

---

## 1. package.json
```json
{
  "name": "stylos-uniformes",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.97.0",
    "lucide-react": "^0.574.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-to-print": "^3.2.0",
    "recharts": "^3.7.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

## 2. vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

## 3. index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 4. types.ts
```typescript
export enum Role {
  ADMIN = 'ADMIN',
  ESTOQUE = 'ESTOQUE',
  VENDAS = 'VENDAS'
}

export enum ProductStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO'
}

export enum OrderStatus {
  NOVO = 'NOVO',
  CORTE = 'CORTE',
  PINTURA = 'PINTURA',
  COSTURA = 'COSTURA',
  PRONTO = 'PRONTO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO'
}

export enum PaymentMethod {
  PIX = 'PIX',
  CARTAO = 'CARTAO',
  DINHEIRO = 'DINHEIRO',
  BOLETO = 'BOLETO'
}

export enum MovementType {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
  AJUSTE = 'AJUSTE'
}

export enum OutputReason {
  PEDIDO = 'PEDIDO',
  MANUAL = 'MANUAL',
  ENTREGA_ESCOLAR = 'ENTREGA_ESCOLAR'
}

export enum EntryReason {
  COMPRA = 'COMPRA',
  PRODUCAO = 'PRODUCAO',
  DEVOLUCAO = 'DEVOLUCAO'
}

export const PRODUCT_CATEGORIES = [
  'Camisa',
  'Calças de Escola',
  'Jaqueta',
  'Calças de brim',
  'Camisas Dry Fit',
  'Sublimação total',
  'Acessórios'
];

export const SCHOOL_CATEGORIES = [
  'Camisa',
  'Calças de Escola',
  'Jaqueta'
];

export const SHIRT_MODELS = ['Polo', 'Gola Redonda'];

export const SCHOOL_LIST = [
  'RISOLETA NEVES',
  'DANIEL NERI',
  'SÃO LUIZ',
  'MARIANA',
  'JANIÔS QUADROS',
  'PREFEITURA',
  'SEMEAR',
  'VOO DA JURITI'
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  password?: string; // Added for simple auth
}

export interface Client {
  id: string;
  name: string;
  type: 'PF' | 'PJ';
  document: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  model?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  cost: number;
  minStock: number;
  image: string;
  variants: ProductVariant[];
  status: ProductStatus;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientCity?: string;
  date: string;
  deliveryDate: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  costTotal: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export enum ExpenseCategory {
  FIXO = 'Custo Fixo (Luz, Internet, Aluguel)',
  PESSOAL = 'Pessoal (Salários, Comissões)',
  MATERIA_PRIMA = 'Matéria Prima (Tecidos, Linhas)',
  MANUTENCAO = 'Manutenção',
  MARKETING = 'Marketing',
  OUTROS = 'Outros'
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface StockMovement {
  id: string;
  type: MovementType;
  reason: OutputReason | EntryReason | string;
  productId: string;
  variantId?: string;
  productName: string;
  category: string;
  size: string;
  color: string;
  quantity: number;
  date: string;
  referenceId?: string;
  userId: string;
  clientName?: string;
  model?: string;
  unitValue?: number;
  totalValue?: number;
}
```

## 5. services/supabase.ts
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.');
}

// Prevent crash if variables are missing (common in new deployments)
// We use a placeholder so the app can at least render the UI
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder';

export const supabase = createClient(url, key);
```

## 6. context/Store.tsx
```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Order, Client, Expense, Role, OrderStatus, StockMovement, MovementType } from '../types';
import { USERS } from '../mockData';
import { supabase } from '../services/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (userData: User) => Promise<boolean>;
  usersList: User[]; // For Admin to see
  deleteUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface DataContextType {
  products: Product[];
  orders: Order[];
  clients: Client[];
  expenses: Expense[];
  stockMovements: StockMovement[];
  loading: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  addClient: (client: Client) => Promise<void>;
  addExpense: (expense: Expense) => Promise<void>;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date' | 'userId'>) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]); // State for all users
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('stylos_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: productsData } = await supabase.from('products').select('*, variants(*)');
      if (productsData) setProducts(productsData as unknown as Product[]);

      const { data: movementsData } = await supabase.from('stock_movements').select('*').order('date', { ascending: false });
      if (movementsData) setStockMovements(movementsData as unknown as StockMovement[]);

      const { data: clientsData } = await supabase.from('clients').select('*');
      if (clientsData) setClients(clientsData as unknown as Client[]);

      const { data: ordersData } = await supabase.from('orders').select('*');
      if (ordersData) setOrders(ordersData as unknown as Order[]);

      const { data: expensesData } = await supabase.from('expenses').select('*');
      if (expensesData) setExpenses(expensesData as unknown as Expense[]);

      // Fetch Users (Simulated Table)
      const { data: usersData } = await supabase.from('users').select('*');
      if (usersData) setUsersList(usersData as unknown as User[]);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    // 1. Check Mock Users first (fallback)
    const mockUser = USERS.find(u => u.email === email);
    if (mockUser) {
       setUser(mockUser);
       localStorage.setItem('stylos_user', JSON.stringify(mockUser));
       return true;
    }

    // 2. Check Supabase Users
    // NOTE: In a real app, use supabase.auth.signInWithPassword
    // Here we are using a custom 'users' table as requested for simple management
    const { data: foundUsers, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password); // Plain text for prototype simplicity as requested

    if (foundUsers && foundUsers.length > 0) {
      const loggedUser = foundUsers[0] as User;
      setUser(loggedUser);
      localStorage.setItem('stylos_user', JSON.stringify(loggedUser));
      toast.success(`Bem vindo, ${loggedUser.name}!`);
      return true;
    } else {
      toast.error('Email ou senha incorretos.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stylos_user');
  };

  const registerUser = async (userData: User): Promise<boolean> => {
    const { data, error } = await supabase.from('users').insert([userData]);
    if (error) {
      console.error('Error registering user:', error);
      toast.error('Erro ao cadastrar usuário.');
      return false;
    }
    await fetchData();
    toast.success('Usuário cadastrado com sucesso!');
    return true;
  };

  const deleteUser = async (id: string) => {
    await supabase.from('users').delete().eq('id', id);
    await fetchData();
    toast.success('Usuário removido.');
  };

  const addProduct = async (p: Product) => {
    const { data: prodData, error: prodError } = await supabase
      .from('products')
      .insert([{
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

    if (prodError || !prodData) return;

    if (p.variants && p.variants.length > 0) {
      const variantsToInsert = p.variants.map(v => ({
        product_id: prodData.id,
        size: v.size,
        color: v.color,
        stock: v.stock,
        sku: v.sku,
        model: v.model
      }));
      await supabase.from('variants').insert(variantsToInsert);
    }
    await fetchData();
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const { variants, ...productData } = data;
    if (Object.keys(productData).length > 0) {
        await supabase.from('products').update(productData).eq('id', id);
    }
    await fetchData();
  };

  const addOrder = async (o: Order) => {
    await supabase.from('orders').insert([o]);
    await fetchData();
  };
  
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    await fetchData();
  };

  const addClient = async (c: Client) => {
    await supabase.from('clients').insert([c]);
    await fetchData();
  };

  const addExpense = async (e: Expense) => {
    await supabase.from('expenses').insert([e]);
    await fetchData();
  };

  const addStockMovement = async (movementData: Omit<StockMovement, 'id' | 'date' | 'userId'>): Promise<boolean> => {
    if (!user) return false;

    if (movementData.type === MovementType.SAIDA) {
        const product = products.find(p => p.id === movementData.productId);
        const variant = product?.variants.find(v => v.id === movementData.variantId);

        if (!product || !variant) return false;
        if (variant.stock < movementData.quantity) {
            toast.error(`Estoque insuficiente! Disponível: ${variant.stock}`);
            return false;
        }

        await supabase.from('variants')
            .update({ stock: variant.stock - movementData.quantity })
            .eq('id', movementData.variantId);
    } else if (movementData.type === MovementType.ENTRADA) {
        const product = products.find(p => p.id === movementData.productId);
        const variant = product?.variants.find(v => v.id === movementData.variantId);
        
        if (variant) {
            await supabase.from('variants')
                .update({ stock: variant.stock + movementData.quantity })
                .eq('id', movementData.variantId);
        }
    }

    await supabase.from('stock_movements').insert([{
        ...movementData,
        date: new Date().toISOString(),
        user_id: user.id,
        product_id: movementData.productId,
        variant_id: movementData.variantId,
        client_name: movementData.clientName,
        product_name: movementData.productName
    }]);

    await fetchData();
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerUser, usersList, deleteUser }}>
      <DataContext.Provider value={{ 
          products, orders, clients, expenses, stockMovements, loading,
          addProduct, updateProduct, addOrder, updateOrderStatus, addClient, addExpense, addStockMovement, refreshData: fetchData 
      }}>
        {children}
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within StoreProvider");
  return context;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within StoreProvider");
  return context;
};
```

## 7. components/Layout.tsx
```typescript
import React, { useState } from 'react';
import { useAuth, useData } from '../context/Store';
import { Role } from '../types';
import { 
  LayoutDashboard, Users, Package, ShoppingBag, Scissors, DollarSign, LogOut, Menu, Bell, Search, Archive, GraduationCap, Wifi, WifiOff, HelpCircle, UserCog
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onChangeView: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onChangeView }) => {
  const { user, logout } = useAuth();
  const { loading, products } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { id: 'users', label: 'Usuários do Sistema', icon: UserCog, roles: [Role.ADMIN] },
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
      <aside className="hidden md:flex md:w-64 flex-col fixed h-full z-20">
        <SidebarContent />
      </aside>
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out z-40 md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 z-10">
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-600">
            <Menu size={24} />
          </button>
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
            <Search size={18} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-sm w-full text-gray-700" />
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
```

## 8. App.tsx
```typescript
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
  const { login, registerUser } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        
        // Register as Admin
        const success = await registerUser({
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            password,
            role: Role.ADMIN,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
        });
        
        if (success) {
            setIsRegistering(false);
            setPassword('');
            setConfirmPassword('');
        }
    } else {
        if (email && password) {
            login(email, password);
        }
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
            {isRegistering && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Seu Nome"
                    required
                  />
                </div>
            )}
            
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

            {isRegistering && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-lg"
            >
              {isRegistering ? 'CADASTRAR ADMINISTRADOR' : 'ACESSAR SISTEMA'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
                {isRegistering ? 'Já tem uma conta? Fazer Login' : 'Não tem conta? Cadastre-se como Admin'}
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
          &copy; 2024 Stylos Uniformes. Todos os direitos reservados.
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
      case 'clients': return <Clients />;
      case 'users': return user?.role === Role.ADMIN ? <Users /> : <div className="text-center mt-20 text-gray-500">Acesso negado.</div>;
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
```

## 9. pages/Dashboard.tsx
```typescript
import React from 'react';
import { useAuth, useData } from '../context/Store';
import { Role, OrderStatus } from '../types';
import { 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Truck,
  Package
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const { orders, products, expenses } = useData();

  const isAdmin = user?.role === Role.ADMIN;
  const isStock = user?.role === Role.ESTOQUE;
  const isSales = user?.role === Role.VENDAS;

  const today = new Date().toISOString().split('T')[0];

  // --- SALES PROFILE LOGIC (STRICT) ---
  if (isSales) {
    // Regra: Apenas pedidos com data = hoje
    const ordersToday = orders.filter(o => o.date === today);
    const revenueToday = ordersToday.reduce((acc, o) => acc + o.total, 0);
    
    // Group production statuses for the KPI
    const inProduction = orders.filter(o => 
      [OrderStatus.CORTE, OrderStatus.PINTURA, OrderStatus.COSTURA].includes(o.status)
    ).length;
    
    const pendingDelivery = orders.filter(o => o.status === OrderStatus.PRONTO).length;

    const SalesCard = ({ title, value, icon: Icon, color }: any) => (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard de Vendas</h2>
            <p className="text-gray-500 text-sm">Resumo operacional do dia: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* SALES SPECIFIC KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SalesCard 
            title="Vendas de Hoje (R$)" 
            value={`R$ ${revenueToday.toFixed(2)}`} 
            icon={DollarSign} 
            color="bg-green-500" 
          />
          <SalesCard 
            title="Pedidos Criados Hoje" 
            value={ordersToday.length} 
            icon={ShoppingCart} 
            color="bg-blue-500" 
          />
          <SalesCard 
            title="Pedidos em Produção" 
            value={inProduction} 
            icon={Clock} 
            color="bg-yellow-500" 
          />
          <SalesCard 
            title="Entregas Previstas" 
            value={pendingDelivery} 
            icon={Truck} 
            color="bg-purple-500" 
          />
        </div>

        {/* LISTA DE PEDIDOS DO DIA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Pedidos Criados Hoje</h3>
          </div>
          {ordersToday.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Pedido #</th>
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordersToday.map(o => (
                  <tr key={o.id}>
                    <td className="px-6 py-4 font-bold text-gray-700">{o.id}</td>
                    <td className="px-6 py-4">{o.clientName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${o.status === 'NOVO' ? 'bg-blue-100 text-blue-800' : ''}
                        ${['CORTE','PINTURA','COSTURA'].includes(o.status) ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${o.status === 'PRONTO' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">R$ {o.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-400">Nenhum pedido criado hoje.</div>
          )}
        </div>
      </div>
    );
  }

  // --- ADMIN & STOCK PROFILE LOGIC ---

  const ordersToday = orders.filter(o => o.date === today);
  const revenueToday = ordersToday.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status !== OrderStatus.ENTREGUE && o.status !== OrderStatus.CANCELADO);
  const lowStockProducts = products.filter(p => p.variants.some(v => v.stock <= p.minStock));
  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalProfit = isAdmin ? totalRevenue - (orders.reduce((acc, o) => acc + o.costTotal, 0) + totalExpense) : 0;
  
  // Calculate Total Stock Value (Cost Basis)
  const totalStockValue = products.reduce((acc, p) => {
      const productStockValue = p.variants.reduce((vAcc, v) => vAcc + (v.stock * p.cost), 0);
      return acc + productStockValue;
  }, 0);

  // Calculate Stock Breakdown by Category
  const stockByCategory = products.reduce((acc, p) => {
    const cat = p.category;
    if (!acc[cat]) {
      acc[cat] = { qty: 0, cost: 0, sale: 0 };
    }
    
    p.variants.forEach(v => {
      acc[cat].qty += v.stock;
      acc[cat].cost += v.stock * p.cost;
      acc[cat].sale += v.stock * p.price;
    });
    
    return acc;
  }, {} as Record<string, { qty: number, cost: number, sale: number }>);

  const salesData = [
    { name: 'Seg', vendas: 4000 },
    { name: 'Ter', vendas: 3000 },
    { name: 'Qua', vendas: 2000 },
    { name: 'Qui', vendas: 2780 },
    { name: 'Sex', vendas: 1890 },
    { name: 'Sab', vendas: 2390 },
    { name: 'Dom', vendas: 3490 },
  ];

  const statusData = [
    { name: 'Novo', value: orders.filter(o => o.status === OrderStatus.NOVO).length },
    { name: 'Em Produção', value: orders.filter(o => [OrderStatus.CORTE, OrderStatus.PINTURA, OrderStatus.COSTURA].includes(o.status)).length },
    { name: 'Pronto', value: orders.filter(o => o.status === OrderStatus.PRONTO).length },
  ];
  
  const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  const Card = ({ title, value, icon: Icon, color, subText }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        {subText && <p className={`text-xs mt-2 ${color.replace('bg-', 'text-')}`}>{subText}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 text-sm">Bem vindo de volta, {user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {!isStock && (
          <Card 
            title="Vendas Hoje" 
            value={isAdmin ? `R$ ${revenueToday.toFixed(2)}` : ordersToday.length} 
            icon={DollarSign} 
            color="bg-green-500" 
            subText={isAdmin ? `${ordersToday.length} pedidos` : ''}
          />
        )}
        <Card 
          title="Pedidos Pendentes" 
          value={pendingOrders.length} 
          icon={ShoppingCart} 
          color="bg-blue-500" 
          subText="Todo Pipeline Ativo"
        />
        <Card 
          title="Estoque Crítico" 
          value={lowStockProducts.length} 
          icon={AlertTriangle} 
          color="bg-red-500" 
          subText="Produtos abaixo do mínimo"
        />
        {isAdmin && (
          <>
            <Card 
              title="Lucro Estimado (Mês)" 
              value={`R$ ${totalProfit.toFixed(2)}`} 
              icon={TrendingUp} 
              color="bg-indigo-500" 
              subText="Receita - Custos - Despesas"
            />
            <Card 
              title="Valor em Estoque" 
              value={`R$ ${totalStockValue.toFixed(2)}`} 
              icon={Package} 
              color="bg-teal-500" 
              subText="Custo total do inventário"
            />
          </>
        )}
      </div>

      {isAdmin && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Detalhamento Financeiro do Estoque</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-medium">Categoria</th>
                  <th className="px-6 py-3 font-medium text-center">Qtd Peças</th>
                  <th className="px-6 py-3 font-medium text-right">Custo Total (Investido)</th>
                  <th className="px-6 py-3 font-medium text-right">Valor de Venda (Potencial)</th>
                  <th className="px-6 py-3 font-medium text-right">Margem Estimada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(stockByCategory).map(([cat, stats]) => (
                  <tr key={cat}>
                    <td className="px-6 py-4 font-medium text-gray-700">{cat}</td>
                    <td className="px-6 py-4 text-center">{stats.qty}</td>
                    <td className="px-6 py-4 text-right text-gray-600">R$ {stats.cost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-blue-600 font-medium">R$ {stats.sale.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-green-600 font-bold">
                      R$ {(stats.sale - stats.cost).toFixed(2)} 
                      <span className="text-xs font-normal text-gray-400 ml-1">
                        ({stats.sale > 0 ? ((stats.sale - stats.cost) / stats.sale * 100).toFixed(0) : 0}%)
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td className="px-6 py-4 text-gray-800">TOTAL GERAL</td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    {Object.values(stockByCategory).reduce((acc, s) => acc + s.qty, 0)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-800">
                    R$ {Object.values(stockByCategory).reduce((acc, s) => acc + s.cost, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-blue-700">
                    R$ {Object.values(stockByCategory).reduce((acc, s) => acc + s.sale, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-green-700">
                    R$ {Object.values(stockByCategory).reduce((acc, s) => acc + (s.sale - s.cost), 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {isAdmin ? 'Receita Semanal' : 'Volume de Pedidos'}
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Status dos Pedidos</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 10. pages/Sales.tsx
```typescript
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

## 11. pages/Products.tsx
```typescript
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
```

## 12. pages/Orders.tsx
```typescript
import React, { useState } from 'react';
import { useAuth, useData } from '../context/Store';
import { OrderStatus, Role } from '../types';
import { Plus, MoreHorizontal, Truck, Check, Clock, XCircle, FileText } from 'lucide-react';
import { NewOrderModal } from '../components/NewOrderModal';

export const Orders = ({ isEmbedded = false }: { isEmbedded?: boolean }) => {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useData();
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // const isAdmin = user?.role === Role.ADMIN;

  // Since we have a dedicated Production page with 5 columns, 
  // we can group the production statuses here or show all of them.
  // Let's show all of them to maintain consistency between screens.
  
  const columns = [
    { id: OrderStatus.NOVO, label: 'Novos', color: 'border-blue-500', bg: 'bg-blue-50' },
    { id: OrderStatus.CORTE, label: 'Corte', color: 'border-orange-500', bg: 'bg-orange-50' },
    { id: OrderStatus.PINTURA, label: 'Pintura', color: 'border-purple-500', bg: 'bg-purple-50' },
    { id: OrderStatus.COSTURA, label: 'Costura', color: 'border-yellow-500', bg: 'bg-yellow-50' },
    { id: OrderStatus.PRONTO, label: 'Prontos', color: 'border-green-500', bg: 'bg-green-50' },
    // Delivered orders are usually archived, but we can show them if needed.
  ];

  const getNextStatus = (current: OrderStatus) => {
    switch (current) {
        case OrderStatus.NOVO: return OrderStatus.CORTE;
        case OrderStatus.CORTE: return OrderStatus.PINTURA;
        case OrderStatus.PINTURA: return OrderStatus.COSTURA;
        case OrderStatus.COSTURA: return OrderStatus.PRONTO;
        case OrderStatus.PRONTO: return OrderStatus.ENTREGUE;
        default: return null;
      }
  };

  const handleAdvance = (id: string, current: OrderStatus) => {
    const next = getNextStatus(current);
    if (next) updateOrderStatus(id, next);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
       {!isEmbedded && (
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Vendas & Pedidos</h2>
            <p className="text-gray-500 text-sm">Visão geral do pipeline de vendas</p>
          </div>
          <button 
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            Novo Pedido
          </button>
        </div>
       )}

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full space-x-6 min-w-[1400px]">
          {columns.map(col => {
            const colOrders = orders.filter(o => o.status === col.id);
            
            return (
              <div key={col.id} className="w-80 flex flex-col bg-gray-100 rounded-xl max-h-full">
                <div className={`p-4 border-t-4 ${col.color} bg-white rounded-t-xl shadow-sm z-10 sticky top-0`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">{col.label}</h3>
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{colOrders.length}</span>
                  </div>
                </div>
                
                <div className="p-3 overflow-y-auto custom-scroll flex-1 space-y-3">
                  {colOrders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition group">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-bold text-gray-400">#{order.id}</span>
                         <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                      </div>
                      <h4 className="font-bold text-gray-800 mb-0">{order.clientName}</h4>
                      {(order.clientPhone || order.clientCity) && (
                        <div className="text-xs text-gray-500 mb-2 flex flex-wrap gap-2">
                          {order.clientPhone && <span>{order.clientPhone}</span>}
                          {order.clientCity && <span>• {order.clientCity}</span>}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="font-bold text-blue-600 text-sm">R$ {order.total.toFixed(2)}</span>
                        <div className="text-xs text-gray-400 flex items-center">
                           <Clock size={12} className="mr-1" />
                           {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-3 hidden group-hover:flex gap-2">
                        {getNextStatus(order.status) && (
                           <button 
                             onClick={() => handleAdvance(order.id, order.status)}
                             className="flex-1 bg-blue-50 text-blue-600 text-xs font-medium py-1.5 rounded hover:bg-blue-100 transition flex justify-center items-center"
                           >
                             Avançar
                             <Check size={12} className="ml-1" />
                           </button>
                        )}
                        <button className="bg-gray-50 text-gray-600 p-1.5 rounded hover:bg-gray-200">
                           <FileText size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {colOrders.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm italic">
                      Nenhum pedido
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewOrderModal 
        isOpen={isNewOrderModalOpen} 
        onClose={() => setIsNewOrderModalOpen(false)} 
      />
    </div>
  );
};

## 13. pages/Stock.tsx
```typescript
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

## 14. pages/Finance.tsx
```typescript
import React, { useState } from 'react';
import { useAuth, useData } from '../context/Store';
import { Role, ExpenseCategory, Expense } from '../types';
import { DollarSign, ArrowUpRight, ArrowDownRight, PieChart as PieIcon, Plus, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Finance = () => {
  const { user } = useAuth();
  const { orders, expenses, addExpense } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FIXO);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (user?.role !== Role.ADMIN) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Acesso Restrito: Somente Administradores.</p>
      </div>
    );
  }

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      amount: parseFloat(amount),
      category,
      date
    };

    addExpense(newExpense);
    setIsModalOpen(false);
    setDescription('');
    setAmount('');
    setCategory(ExpenseCategory.FIXO);
  };

  // Basic Calcs
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalCOGS = orders.reduce((acc, o) => acc + o.costTotal, 0); // Cost of Goods Sold
  const netProfit = totalRevenue - totalExpenses - totalCOGS;

  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const data = [
    { name: 'Receita', value: totalRevenue },
    { name: 'Custos Prod.', value: totalCOGS },
    { name: 'Despesas Op.', value: totalExpenses },
    { name: 'Lucro Líquido', value: netProfit },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Financeiro</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Nova Despesa
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm">Receita Total</p>
               <h3 className="text-2xl font-bold text-gray-800 mt-1">R$ {totalRevenue.toFixed(2)}</h3>
             </div>
             <div className="p-2 bg-green-100 rounded-lg text-green-600"><ArrowUpRight size={20}/></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm">Despesas + Custos</p>
               <h3 className="text-2xl font-bold text-gray-800 mt-1 text-red-600">R$ {(totalExpenses + totalCOGS).toFixed(2)}</h3>
             </div>
             <div className="p-2 bg-red-100 rounded-lg text-red-600"><ArrowDownRight size={20}/></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm">Lucro Líquido</p>
               <h3 className="text-2xl font-bold text-gray-800 mt-1 text-blue-600">R$ {netProfit.toFixed(2)}</h3>
             </div>
             <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><DollarSign size={20}/></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm">Margem Líquida</p>
               <h3 className="text-2xl font-bold text-gray-800 mt-1">{margin.toFixed(1)}%</h3>
             </div>
             <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><PieIcon size={20}/></div>
           </div>
        </div>
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="font-bold text-gray-700 mb-4">Fluxo de Caixa Simplificado</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={40}>
                 {/* No generic conditional fill in simple Recharts map without Cell, just defaulting blue */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h3 className="font-bold text-gray-700">Últimas Despesas</h3>
          </div>
          <div className="overflow-y-auto max-h-[300px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 sticky top-0">
                 <tr>
                   <th className="px-6 py-3">Descrição</th>
                   <th className="px-6 py-3">Categoria</th>
                   <th className="px-6 py-3 text-right">Valor</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.map(exp => (
                  <tr key={exp.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{exp.description}</div>
                      <div className="text-xs text-gray-400">{new Date(exp.date).toLocaleDateString('pt-BR')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{exp.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-red-600 font-medium">- R$ {exp.amount.toFixed(2)}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">Nenhuma despesa registrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Nova Despesa</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input 
                  type="text" 
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Ex: Conta de Luz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                >
                  {Object.values(ExpenseCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-sm"
                >
                  Registrar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
```

## 15. pages/Clients.tsx
```typescript
import React, { useState } from 'react';
import { useData } from '../context/Store';
import { Client } from '../types';
import { Plus, Search, User, Building, MapPin, Phone, Mail, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
        toast.warning('Nome e Telefone são obrigatórios');
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
    toast.success('Cliente cadastrado com sucesso!');
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

## 16. pages/SchoolUniforms.tsx
```typescript
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

## 17. pages/Help.tsx
```typescript
import React from 'react';
import { Download, Cloud, Server, Github } from 'lucide-react';

export const Help = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Central de Ajuda & Publicação</h1>

      <div className="grid gap-6">
        {/* Card 1: Como Baixar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
              <Download size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-700">1. Como baixar o código (ZIP)?</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Como esta é uma ferramenta de desenvolvimento online, você precisa exportar o código para o seu computador.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700">
            <strong>Onde está o botão?</strong><br/>
            Olhe para a <strong>barra superior</strong> desta janela (fora do aplicativo, na interface do editor). 
            Procure por um ícone de <strong>Seta para Baixo</strong>, <strong>Export</strong> ou <strong>Download</strong>.
            Ao clicar, você baixará um arquivo <code>.zip</code> com todo o código fonte.
          </div>
        </div>

        {/* Card 2: Netlify */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-lg mr-4">
              <Cloud size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-700">2. Como publicar no Netlify (Grátis)</h2>
          </div>
          <ol className="list-decimal list-inside space-y-3 text-slate-600 ml-2">
            <li>Acesse <a href="https://app.netlify.com" target="_blank" className="text-blue-600 hover:underline">app.netlify.com</a> e crie uma conta.</li>
            <li>Arraste a pasta do projeto (que você extraiu do ZIP) para a área de "Deploy" ou conecte com seu GitHub.</li>
            <li>
              <strong>Configuração Importante:</strong> Vá em <em>Site settings &gt; Environment variables</em> e adicione:
              <div className="mt-3 space-y-2">
                <div className="bg-slate-100 p-2 rounded border border-slate-300 text-xs break-all">
                  <span className="font-bold text-slate-700 block mb-1">VITE_SUPABASE_URL</span>
                  <code className="select-all">{import.meta.env.VITE_SUPABASE_URL}</code>
                </div>
                <div className="bg-slate-100 p-2 rounded border border-slate-300 text-xs break-all">
                  <span className="font-bold text-slate-700 block mb-1">VITE_SUPABASE_ANON_KEY</span>
                  <code className="select-all">{import.meta.env.VITE_SUPABASE_ANON_KEY}</code>
                </div>
              </div>
            </li>
            <li>O Netlify vai gerar um link (ex: <code>seusite.netlify.app</code>) que você pode acessar de qualquer lugar!</li>
          </ol>
        </div>

        {/* Card 3: Supabase */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
              <Server size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-700">3. Banco de Dados (Supabase)</h2>
          </div>
          <p className="text-slate-600">
            Seu banco de dados já está na nuvem! Não precisa fazer nada. 
            Tanto a versão de teste aqui quanto a versão publicada no Netlify usarão os mesmos dados.
          </p>
        </div>
        {/* Card 4: HostGator / cPanel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg mr-4">
              <Server size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-700">4. HostGator / cPanel (Hospedagem Tradicional)</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Sim! Você pode hospedar na HostGator. Como este é um site estático (React), ele funciona em qualquer hospedagem.
          </p>
          <ol className="list-decimal list-inside space-y-3 text-slate-600 ml-2">
            <li>
              <strong>Gere a versão final (Build):</strong>
              <br/>
              No seu computador (com Node.js instalado), rode o comando:
              <code className="bg-slate-100 px-2 py-1 rounded text-sm ml-2">npm run build</code>
              <br/>
              Isso vai criar uma pasta chamada <code>dist</code>.
            </li>
            <li>
              <strong>Acesse o cPanel:</strong>
              <br/>
              Vá no Gerenciador de Arquivos da HostGator e abra a pasta <code>public_html</code> (ou a pasta do seu domínio).
            </li>
            <li>
              <strong>Upload:</strong>
              <br/>
              Envie <strong>todos os arquivos</strong> que estão DENTRO da pasta <code>dist</code> para lá.
            </li>
            <li>
              <strong>Arquivo .htaccess (Importante):</strong>
              <br/>
              O sistema já inclui um arquivo <code>.htaccess</code> na pasta pública. Certifique-se de que ele foi enviado junto. 
              Ele é necessário para que as rotas (ex: /vendas, /estoque) funcionem corretamente ao recarregar a página.
            </li>
            <li>
              <strong>Variáveis de Ambiente:</strong>
              <br/>
              Na HostGator, você não configura variáveis de ambiente no painel. Você deve criar um arquivo chamado <code>.env</code> na raiz do seu site (dentro do public_html) ou, preferencialmente, editar o arquivo <code>assets/index-*.js</code> (avançado) ou garantir que as variáveis já foram "embutidas" durante o comando <code>npm run build</code>.
              <br/>
              <em className="text-sm text-orange-600">Dica: Ao rodar o build no seu computador, certifique-se de ter o arquivo .env configurado localmente. O Vite vai "queimar" as chaves no código final automaticamente.</em>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
```

## 18. components/NewOrderModal.tsx
```typescript
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
```

## 19. mockData.ts
```typescript
import { Role, ProductStatus, OrderStatus, PaymentMethod, User, Product, Order, Client, Expense } from './types';

export const USERS: User[] = [
  { id: '1', name: 'Carlos Admin', email: 'admin@stylos.com', role: Role.ADMIN, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Julia Estoque', email: 'estoque@stylos.com', role: Role.ESTOQUE, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Marcos Vendas', email: 'vendas@stylos.com', role: Role.VENDAS, avatar: 'https://i.pravatar.cc/150?u=3' },
];

export const CLIENTS: Client[] = [];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Camisa Uniforme Padrão',
    category: 'Camisa',
    description: 'Camisa escolar com brasão bordado',
    price: 65.00,
    cost: 25.00,
    minStock: 30,
    status: ProductStatus.ATIVO,
    image: 'https://picsum.photos/200/200?random=1',
    variants: [
      { id: 'v1_08', size: '08', color: 'Branco', stock: 0, sku: 'ESC-POLO-08', model: 'Polo' },
      { id: 'v1_10', size: '10', color: 'Branco', stock: 0, sku: 'ESC-POLO-10', model: 'Polo' },
      { id: 'v1_12', size: '12', color: 'Branco', stock: 0, sku: 'ESC-POLO-12', model: 'Polo' },
      { id: 'v1_14', size: '14', color: 'Branco', stock: 0, sku: 'ESC-POLO-14', model: 'Polo' },
      { id: 'v1_PP', size: 'PP', color: 'Branco', stock: 0, sku: 'ESC-POLO-PP', model: 'Polo' },
      { id: 'v1_P', size: 'P', color: 'Branco', stock: 0, sku: 'ESC-POLO-P', model: 'Polo' },
      { id: 'v1_M', size: 'M', color: 'Branco', stock: 0, sku: 'ESC-POLO-M', model: 'Polo' },
      { id: 'v1_G', size: 'G', color: 'Branco', stock: 0, sku: 'ESC-POLO-G', model: 'Polo' },
      { id: 'v1_GG', size: 'GG', color: 'Branco', stock: 0, sku: 'ESC-POLO-GG', model: 'Polo' },
      { id: 'v1_EXG', size: 'EXG', color: 'Branco', stock: 0, sku: 'ESC-POLO-EXG', model: 'Polo' },
    ]
  },
  {
    id: '2',
    name: 'Calça Helanca Escolar',
    category: 'Calças de Escola',
    description: 'Calça de helanca azul marinho',
    price: 80.00,
    cost: 35.00,
    minStock: 20,
    status: ProductStatus.ATIVO,
    image: 'https://picsum.photos/200/200?random=2',
    variants: [
      { id: 'v2_08', size: '08', color: 'Azul Marinho', stock: 0, sku: 'ESC-HEL-08' },
      { id: 'v2_10', size: '10', color: 'Azul Marinho', stock: 0, sku: 'ESC-HEL-10' },
      { id: 'v2_12', size: '12', color: 'Azul Marinho', stock: 0, sku: 'ESC-HEL-12' },
      { id: 'v2_14', size: '14', color: 'Azul Marinho', stock: 0, sku: 'ESC-HEL-14' },
      { id: 'v2_PP', size: 'PP', color: 'Azul Marinho', stock: 0, sku: 'ESC-HEL-PP' },
      { id: 'v2_P', size: 'P', color: 'Azul Marinho', stock: 0, sku: 'ESC-HEL-P' },
      { id: 'v2_M', size: 'M', color: 'Azul Marinho', stock: 0, sku: 'ESC-HEL-M' },
      { id: 'v2_G', size: 'G', color: 'Azul Marinho', stock: 0, sku: 'ESC-HEL-G' },
      { id: 'v2_GG', size: 'GG', color: 'Azul Marinho', stock: 0, sku: 'ESC-HEL-GG' },
      { id: 'v2_EXG', size: 'EXG', color: 'Azul Marinho', stock: 0, sku: 'ESC-HEL-EXG' },
    ]
  },
  {
    id: '5',
    name: 'Calça Tactel Escolar',
    category: 'Calças de Escola',
    description: 'Calça de tactel azul marinho',
    price: 85.00,
    cost: 38.00,
    minStock: 20,
    status: ProductStatus.ATIVO,
    image: 'https://picsum.photos/200/200?random=5',
    variants: [
      { id: 'v5_08', size: '08', color: 'Azul Marinho', stock: 0, sku: 'ESC-TAC-08' },
      { id: 'v5_10', size: '10', color: 'Azul Marinho', stock: 0, sku: 'ESC-TAC-10' },
      { id: 'v5_12', size: '12', color: 'Azul Marinho', stock: 0, sku: 'ESC-TAC-12' },
      { id: 'v5_14', size: '14', color: 'Azul Marinho', stock: 0, sku: 'ESC-TAC-14' },
      { id: 'v5_PP', size: 'PP', color: 'Azul Marinho', stock: 0, sku: 'ESC-TAC-PP' },
      { id: 'v5_P', size: 'P', color: 'Azul Marinho', stock: 0, sku: 'ESC-TAC-P' },
      { id: 'v5_M', size: 'M', color: 'Azul Marinho', stock: 0, sku: 'ESC-TAC-M' },
      { id: 'v5_G', size: 'G', color: 'Azul Marinho', stock: 0, sku: 'ESC-TAC-G' },
      { id: 'v5_GG', size: 'GG', color: 'Azul Marinho', stock: 0, sku: 'ESC-TAC-GG' },
      { id: 'v5_EXG', size: 'EXG', color: 'Azul Marinho', stock: 0, sku: 'ESC-TAC-EXG' },
    ]
  },
  {
    id: '3',
    name: 'Jaqueta Tactel Forrada',
    category: 'Jaqueta',
    description: 'Jaqueta de inverno com capuz',
    price: 150.00,
    cost: 70.00,
    minStock: 10,
    status: ProductStatus.ATIVO,
    image: 'https://picsum.photos/200/200?random=3',
    variants: [
      { id: 'v3_08', size: '08', color: 'Azul/Branco', stock: 0, sku: 'JAQ-08' },
      { id: 'v3_10', size: '10', color: 'Azul/Branco', stock: 0, sku: 'JAQ-10' },
      { id: 'v3_12', size: '12', color: 'Azul/Branco', stock: 0, sku: 'JAQ-12' },
      { id: 'v3_14', size: '14', color: 'Azul/Branco', stock: 0, sku: 'JAQ-14' },
      { id: 'v3_PP', size: 'PP', color: 'Azul/Branco', stock: 0, sku: 'JAQ-PP' },
      { id: 'v3_P', size: 'P', color: 'Azul/Branco', stock: 0, sku: 'JAQ-P' },
      { id: 'v3_M', size: 'M', color: 'Azul/Branco', stock: 0, sku: 'JAQ-M' },
      { id: 'v3_G', size: 'G', color: 'Azul/Branco', stock: 0, sku: 'JAQ-G' },
      { id: 'v3_GG', size: 'GG', color: 'Azul/Branco', stock: 0, sku: 'JAQ-GG' },
      { id: 'v3_EXG', size: 'EXG', color: 'Azul/Branco', stock: 0, sku: 'JAQ-EXG' },
    ]
  },
  {
    id: '4',
    name: 'Calça Brim Profissional',
    category: 'Calças de brim',
    description: 'Calça resistente para trabalho pesado',
    price: 120.00,
    cost: 55.00,
    minStock: 15,
    status: ProductStatus.ATIVO,
    image: 'https://picsum.photos/200/200?random=4',
    variants: [
      { id: 'v8', size: '40', color: 'Cinza', stock: 0, sku: 'CALCA-CZ-40' },
    ]
  }
];

export const ORDERS: Order[] = [];

export const EXPENSES: Expense[] = [];

## 20. index.html
```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>STYLOS UNIFORMES</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
      /* Custom scrollbar for tables */
      .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
      .custom-scroll::-webkit-scrollbar-track { background: #f1f1f1; }
      .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

## 21. index.css
```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}
```

## 23. pages/Users.tsx
```typescript
import React, { useState } from 'react';
import { useAuth } from '../context/Store';
import { Role, User } from '../types';
import { Plus, Trash2, Shield, User as UserIcon, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const Users = () => {
  const { usersList, registerUser, deleteUser, user: currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h2>
          <p className="text-gray-500 text-sm">Controle de acesso e permissões do sistema</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Novo Usuário
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usersList.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between group hover:shadow-md transition">
            <div className="flex items-center">
              <img src={u.avatar || 'https://via.placeholder.com/50'} alt={u.name} className="w-12 h-12 rounded-full border-2 border-gray-100 mr-4" />
              <div>
                <h3 className="font-bold text-gray-800">{u.name}</h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Mail size={12} className="mr-1" /> {u.email}
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2 border ${
                    u.role === Role.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' :
                    u.role === Role.ESTOQUE ? 'bg-orange-50 text-orange-700 border-orange-100' :
                    'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                    {u.role === Role.ADMIN && <Shield size={10} className="mr-1" />}
                    {u.role}
                </span>
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Novo Usuário</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Senha de acesso"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Função (Cargo)</label>
                    <select 
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={Role.VENDAS}>Vendedor</option>
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
                        Criar Usuário
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
```
