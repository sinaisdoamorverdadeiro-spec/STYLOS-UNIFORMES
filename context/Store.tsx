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
