import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Order, Client, Expense, Role, OrderStatus, StockMovement, MovementType } from '../types';
import { USERS, PRODUCTS, ORDERS, CLIENTS, EXPENSES } from '../mockData';
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
      // 1. Fetch Products & Variants
      const { data: productsData, error: prodError } = await supabase.from('products').select('*, variants(*)');
      if (prodError) throw prodError;
      if (productsData) setProducts(productsData as unknown as Product[]);

      // 2. Fetch Stock Movements
      const { data: movementsData, error: movError } = await supabase.from('stock_movements').select('*').order('date', { ascending: false });
      if (movError) throw movError;
      if (movementsData) setStockMovements(movementsData as unknown as StockMovement[]);

      // 3. Fetch Clients
      const { data: clientsData, error: clientError } = await supabase.from('clients').select('*');
      if (clientError) throw clientError;
      if (clientsData) setClients(clientsData as unknown as Client[]);

      // 4. Fetch Orders
      const { data: ordersData, error: orderError } = await supabase.from('orders').select('*');
      if (orderError) throw orderError;
      if (ordersData) setOrders(ordersData as unknown as Order[]);

      // 5. Fetch Expenses
      const { data: expensesData, error: expenseError } = await supabase.from('expenses').select('*');
      if (expenseError) throw expenseError;
      if (expensesData) setExpenses(expensesData as unknown as Expense[]);

      // Fetch Users (Simulated Table)
      const { data: usersData, error: usersError } = await supabase.from('users').select('*');
      if (usersError) {
        console.warn('Could not fetch users from DB (table might be missing). Using mock data.', usersError);
        setUsersList(USERS);
      } else if (usersData) {
        setUsersList(usersData as unknown as User[]);
      }

    } catch (error) {
      console.error('Error fetching data (Supabase might be down or unconfigured). Using Mock Data.', error);
      // Fallback to Mock Data for Demo Mode
      setProducts(PRODUCTS);
      setOrders(ORDERS);
      setClients(CLIENTS);
      setExpenses(EXPENSES);
      setUsersList(USERS);
      // Stock movements mock is empty initially or could be added to mockData if needed
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
       // Check password if provided (mock users don't have passwords in mockData, so we accept any or specific hardcoded ones if we wanted)
       // For simplicity, we allow mock users to login easily
       setUser(mockUser);
       localStorage.setItem('stylos_user', JSON.stringify(mockUser));
       return true;
    }

    // 2. Check Supabase Users
    const { data: foundUsers, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password); 

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
    // Try Supabase first
    const { data, error } = await supabase.from('users').insert([userData]);
    
    if (error) {
      console.error('Error registering user (Supabase):', error);
      
      // Check for "table not found" error (Postgres 42P01 or specific message)
      if (error.code === '42P01' || error.message.includes('Could not find the table')) {
        // Fallback to Local State
        setUsersList(prev => [...prev, userData]);
        toast.success('Usuário salvo localmente (Tabela não criada no banco)');
        return true;
      } else {
        toast.error(`Erro ao cadastrar: ${error.message}`);
        return false;
      }
    }

    // If successful, refresh data
    await fetchData();
    toast.success('Usuário cadastrado com sucesso!');
    return true;
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    
    if (error) {
        console.error('Error deleting user (Supabase):', error);
        // Fallback local delete if table missing
        if (error.code === '42P01' || error.message.includes('Could not find the table')) {
            setUsersList(prev => prev.filter(u => u.id !== id));
            toast.success('Usuário removido (Localmente)');
            return;
        }
        toast.error('Erro ao remover usuário');
    } else {
        await fetchData();
        toast.success('Usuário removido.');
    }
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
