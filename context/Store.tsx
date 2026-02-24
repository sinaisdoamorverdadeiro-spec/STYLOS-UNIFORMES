import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Order, Client, Expense, Role, OrderStatus, StockMovement, MovementType } from '../types';
import { USERS } from '../mockData'; // Keep USERS local for auth simulation
import { supabase } from '../services/supabase';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Data Context ---
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

// --- Provider ---
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  // Load User
  useEffect(() => {
    const storedUser = localStorage.getItem('stylos_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch Data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Products & Variants
      const { data: productsData, error: prodError } = await supabase
        .from('products')
        .select('*, variants(*)');
      
      if (prodError) throw prodError;

      if (productsData) {
        // Transform snake_case to camelCase if needed, or just cast if types match enough
        // Supabase returns variants as an array nested in the product
        setProducts(productsData as unknown as Product[]);
      }

      // 2. Fetch Stock Movements
      const { data: movementsData, error: movError } = await supabase
        .from('stock_movements')
        .select('*')
        .order('date', { ascending: false });
      
      if (movError) throw movError;
      if (movementsData) setStockMovements(movementsData as unknown as StockMovement[]);

      // 3. Fetch Clients
      const { data: clientsData } = await supabase.from('clients').select('*');
      if (clientsData) setClients(clientsData as unknown as Client[]);

      // 4. Fetch Orders
      const { data: ordersData } = await supabase.from('orders').select('*');
      if (ordersData) setOrders(ordersData as unknown as Order[]);

      // 5. Fetch Expenses
      const { data: expensesData } = await supabase.from('expenses').select('*');
      if (expensesData) setExpenses(expensesData as unknown as Expense[]);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to empty or show toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const login = (email: string) => {
    const foundUser = USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('stylos_user', JSON.stringify(foundUser));
    } else {
      alert('Usuário não encontrado (Use os emails sugeridos na tela de login)');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stylos_user');
  };

  // --- Actions ---

  const addProduct = async (p: Product) => {
    // Insert Product
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

    if (prodError || !prodData) {
      console.error('Error adding product:', prodError);
      return;
    }

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
      
      if (varError) console.error('Error adding variants:', varError);
    }

    await fetchData();
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    // This is complex because of variants. 
    // For now, we'll assume we are mostly updating stock via movements.
    // If updating product details:
    const { variants, ...productData } = data;

    if (Object.keys(productData).length > 0) {
        await supabase.from('products').update(productData).eq('id', id);
    }
    
    // If variants need update, it's usually specific ones.
    // This simple implementation might need expansion for full edit capabilities.
    
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

    // 1. Validate Stock for OUTPUT
    if (movementData.type === MovementType.SAIDA) {
        const product = products.find(p => p.id === movementData.productId);
        const variant = product?.variants.find(v => v.id === movementData.variantId);

        if (!product || !variant) {
            alert('Produto ou variação não encontrada.');
            return false;
        }

        if (variant.stock < movementData.quantity) {
            alert(`Estoque insuficiente! Disponível: ${variant.stock}. Sugestão: gerar compra/produção.`);
            return false;
        }

        // 2. Subtract Stock in DB
        const { error } = await supabase
            .from('variants')
            .update({ stock: variant.stock - movementData.quantity })
            .eq('id', movementData.variantId);
        
        if (error) {
            console.error('Error updating stock:', error);
            return false;
        }
    } else if (movementData.type === MovementType.ENTRADA) {
        // Add Stock logic
        const product = products.find(p => p.id === movementData.productId);
        const variant = product?.variants.find(v => v.id === movementData.variantId);
        
        if (variant) {
            const { error } = await supabase
                .from('variants')
                .update({ stock: variant.stock + movementData.quantity })
                .eq('id', movementData.variantId);

            if (error) {
                console.error('Error updating stock:', error);
                return false;
            }
        }
    }

    // 3. Log Movement
    const { error: movError } = await supabase
        .from('stock_movements')
        .insert([{
            ...movementData,
            date: new Date().toISOString(),
            user_id: user.id,
            // Ensure snake_case mapping if needed, but Supabase handles auto-mapping if columns match
            product_id: movementData.productId,
            variant_id: movementData.variantId,
            client_name: movementData.clientName,
            product_name: movementData.productName
        }]);

    if (movError) {
        console.error('Error logging movement:', movError);
        return false;
    }

    await fetchData(); // Refresh local state
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
