
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
  NOVO = 'NOVO',           // Coluna: Pedido
  CORTE = 'CORTE',         // Coluna: Corte
  PINTURA = 'PINTURA',     // Coluna: Pintura
  COSTURA = 'COSTURA',     // Coluna: Produção
  PRONTO = 'PRONTO',       // Coluna: Entrega
  ENTREGUE = 'ENTREGUE',   // Finalizado
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
  MANUAL = 'MANUAL', // Perda, Amostra, etc.
  ENTREGA_ESCOLAR = 'ENTREGA_ESCOLAR'
}

export enum EntryReason {
  COMPRA = 'COMPRA',
  PRODUCAO = 'PRODUCAO',
  DEVOLUCAO = 'DEVOLUCAO'
}

export const PRODUCT_CATEGORIES = [
  'Camisa',
  'Calças de Escola', // Renamed from Calças de escola to match prompt strict casing if needed, keeping consistent
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
}

export interface Client {
  id: string;
  name: string;
  type: 'PF' | 'PJ';
  document: string; // CPF or CNPJ
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
  model?: string; // 'Polo' | 'Gola Redonda' (Obrigatório para Camisas)
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number; // Sale price
  cost: number; // Unit cost (Sensitive)
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
  costTotal: number; // Sensitive
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
  referenceId?: string; // Order ID or Purchase ID
  userId: string;
  clientName?: string; // Optional for School Delivery
  model?: string; // Para relatórios de Camisa
  unitValue?: number;
  totalValue?: number;
}

export interface DashboardStats {
  revenueToday: number;
  ordersPending: number;
  lowStockCount: number;
  productionCount: number;
}
