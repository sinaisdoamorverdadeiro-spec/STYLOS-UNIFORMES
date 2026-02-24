
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
