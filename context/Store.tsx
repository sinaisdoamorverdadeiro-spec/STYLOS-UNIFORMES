import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Order, Client, Expense, Role, OrderStatus, StockMovement, MovementType } from '../types';
import { USERS, PRODUCTS, ORDERS, CLIENTS, EXPENSES } from '../mockData';
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
  const [usersList, setUsersList] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  // Load Initial Data from LocalStorage or MockData
  useEffect(() => {
    const loadLocalData = () => {
      setLoading(true);
      
      // User Session
      const storedUser = localStorage.getItem('stylos_user');
      if (storedUser) setUser(JSON.parse(storedUser));

      // Users List
      const storedUsersList = localStorage.getItem('stylos_users_list');
      if (storedUsersList) {
        setUsersList(JSON.parse(storedUsersList));
      } else {
        setUsersList(USERS);
        localStorage.setItem('stylos_users_list', JSON.stringify(USERS));
      }

      // Products
      const storedProducts = localStorage.getItem('stylos_products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(PRODUCTS);
        localStorage.setItem('stylos_products', JSON.stringify(PRODUCTS));
      }

      // Orders
      const storedOrders = localStorage.getItem('stylos_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders(ORDERS);
        localStorage.setItem('stylos_orders', JSON.stringify(ORDERS));
      }

      // Clients
      const storedClients = localStorage.getItem('stylos_clients');
      if (storedClients) {
        setClients(JSON.parse(storedClients));
      } else {
        setClients(CLIENTS);
        localStorage.setItem('stylos_clients', JSON.stringify(CLIENTS));
      }

      // Expenses
      const storedExpenses = localStorage.getItem('stylos_expenses');
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      } else {
        setExpenses(EXPENSES);
        localStorage.setItem('stylos_expenses', JSON.stringify(EXPENSES));
      }

      // Stock Movements
      const storedMovements = localStorage.getItem('stylos_movements');
      if (storedMovements) {
        setStockMovements(JSON.parse(storedMovements));
      } else {
        setStockMovements([]);
        localStorage.setItem('stylos_movements', JSON.stringify([]));
      }

      setLoading(false);
    };

    loadLocalData();
  }, []);

  // Helper to persist data
  const persist = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const refreshData = async () => {
    // In local mode, state is already fresh, but we can re-read from LS if needed.
    // For now, we rely on state updates being synchronous-ish.
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    // Check against current usersList (which is loaded from LS or Mock)
    const foundUser = usersList.find(u => u.email === email && (password ? u.password === password : true));
    
    // Fallback for initial mock users if they don't have passwords set in LS yet
    // (Though our mockData update added passwords, existing LS might be stale if we didn't clear it. 
    //  But for a fresh start, it works.)
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('stylos_user', JSON.stringify(foundUser));
      toast.success(`Bem vindo, ${foundUser.name}!`);
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
    const updatedList = [...usersList, userData];
    setUsersList(updatedList);
    persist('stylos_users_list', updatedList);
    toast.success('Usuário cadastrado com sucesso!');
    return true;
  };

  const deleteUser = async (id: string) => {
    const updatedList = usersList.filter(u => u.id !== id);
    setUsersList(updatedList);
    persist('stylos_users_list', updatedList);
    toast.success('Usuário removido.');
  };

  const addProduct = async (p: Product) => {
    const updatedProducts = [...products, p];
    setProducts(updatedProducts);
    persist('stylos_products', updatedProducts);
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const updatedProducts = products.map(p => p.id === id ? { ...p, ...data } : p);
    setProducts(updatedProducts);
    persist('stylos_products', updatedProducts);
  };

  const addOrder = async (o: Order) => {
    const updatedOrders = [...orders, o];
    setOrders(updatedOrders);
    persist('stylos_orders', updatedOrders);
  };
  
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updatedOrders);
    persist('stylos_orders', updatedOrders);
  };

  const addClient = async (c: Client) => {
    const updatedClients = [...clients, c];
    setClients(updatedClients);
    persist('stylos_clients', updatedClients);
  };

  const addExpense = async (e: Expense) => {
    const updatedExpenses = [...expenses, e];
    setExpenses(updatedExpenses);
    persist('stylos_expenses', updatedExpenses);
  };

  const addStockMovement = async (movementData: Omit<StockMovement, 'id' | 'date' | 'userId'>): Promise<boolean> => {
    if (!user) return false;

    let updatedProducts = [...products];
    const productIndex = updatedProducts.findIndex(p => p.id === movementData.productId);
    if (productIndex === -1) return false;

    const product = updatedProducts[productIndex];
    const variantIndex = product.variants.findIndex(v => v.id === movementData.variantId);
    if (variantIndex === -1) return false;

    const variant = product.variants[variantIndex];

    if (movementData.type === MovementType.SAIDA) {
        if (variant.stock < movementData.quantity) {
            toast.error(`Estoque insuficiente! Disponível: ${variant.stock}`);
            return false;
        }
        // Update stock
        product.variants[variantIndex] = { ...variant, stock: variant.stock - movementData.quantity };
    } else if (movementData.type === MovementType.ENTRADA) {
        product.variants[variantIndex] = { ...variant, stock: variant.stock + movementData.quantity };
    }

    // Save updated products
    updatedProducts[productIndex] = product;
    setProducts(updatedProducts);
    persist('stylos_products', updatedProducts);

    // Log Movement
    const newMovement: StockMovement = {
        ...movementData,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        userId: user.id,
    };

    const updatedMovements = [newMovement, ...stockMovements];
    setStockMovements(updatedMovements);
    persist('stylos_movements', updatedMovements);

    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerUser, usersList, deleteUser }}>
      <DataContext.Provider value={{ 
          products, orders, clients, expenses, stockMovements, loading,
          addProduct, updateProduct, addOrder, updateOrderStatus, addClient, addExpense, addStockMovement, refreshData 
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
