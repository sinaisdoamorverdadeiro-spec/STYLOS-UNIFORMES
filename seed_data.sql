-- Run this script in your Supabase SQL Editor to seed initial data

-- Insert Products
INSERT INTO public.products (id, name, category, description, price, cost, min_stock, status, image) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Camisa Uniforme Padrão', 'Camisa', 'Camisa escolar com brasão bordado', 65.00, 25.00, 30, 'ATIVO', 'https://picsum.photos/200/200?random=1'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Calça Helanca Escolar', 'Calças de Escola', 'Calça de helanca azul marinho', 80.00, 35.00, 20, 'ATIVO', 'https://picsum.photos/200/200?random=2'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Calça Tactel Escolar', 'Calças de Escola', 'Calça de tactel azul marinho', 85.00, 38.00, 20, 'ATIVO', 'https://picsum.photos/200/200?random=5'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'Jaqueta Tactel Forrada', 'Jaqueta', 'Jaqueta de inverno com capuz', 150.00, 70.00, 10, 'ATIVO', 'https://picsum.photos/200/200?random=3'),
('d290f1ee-6c54-4b01-90e6-d701748f0855', 'Calça Brim Profissional', 'Calças de brim', 'Calça resistente para trabalho pesado', 120.00, 55.00, 15, 'ATIVO', 'https://picsum.photos/200/200?random=4');

-- Insert Variants for Camisa Uniforme Padrão
INSERT INTO public.variants (product_id, size, color, stock, sku, model) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', '08', 'Branco', 0, 'ESC-POLO-08', 'Polo'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', '10', 'Branco', 0, 'ESC-POLO-10', 'Polo'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', '12', 'Branco', 0, 'ESC-POLO-12', 'Polo'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', '14', 'Branco', 0, 'ESC-POLO-14', 'Polo'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'PP', 'Branco', 0, 'ESC-POLO-PP', 'Polo'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'P', 'Branco', 0, 'ESC-POLO-P', 'Polo'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'M', 'Branco', 0, 'ESC-POLO-M', 'Polo'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'G', 'Branco', 0, 'ESC-POLO-G', 'Polo'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'GG', 'Branco', 0, 'ESC-POLO-GG', 'Polo'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'EXG', 'Branco', 0, 'ESC-POLO-EXG', 'Polo');

-- Insert Variants for Calça Helanca Escolar
INSERT INTO public.variants (product_id, size, color, stock, sku) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0852', '08', 'Azul Marinho', 0, 'ESC-HEL-08'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', '10', 'Azul Marinho', 0, 'ESC-HEL-10'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', '12', 'Azul Marinho', 0, 'ESC-HEL-12'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', '14', 'Azul Marinho', 0, 'ESC-HEL-14'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'PP', 'Azul Marinho', 0, 'ESC-HEL-PP'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'P', 'Azul Marinho', 0, 'ESC-HEL-P'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'M', 'Azul Marinho', 0, 'ESC-HEL-M'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'G', 'Azul Marinho', 0, 'ESC-HEL-G'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'GG', 'Azul Marinho', 0, 'ESC-HEL-GG'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'EXG', 'Azul Marinho', 0, 'ESC-HEL-EXG');

-- Insert Variants for Calça Tactel Escolar
INSERT INTO public.variants (product_id, size, color, stock, sku) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0853', '08', 'Azul Marinho', 0, 'ESC-TAC-08'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', '10', 'Azul Marinho', 0, 'ESC-TAC-10'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', '12', 'Azul Marinho', 0, 'ESC-TAC-12'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', '14', 'Azul Marinho', 0, 'ESC-TAC-14'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'PP', 'Azul Marinho', 0, 'ESC-TAC-PP'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'P', 'Azul Marinho', 0, 'ESC-TAC-P'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'M', 'Azul Marinho', 0, 'ESC-TAC-M'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'G', 'Azul Marinho', 0, 'ESC-TAC-G'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'GG', 'Azul Marinho', 0, 'ESC-TAC-GG'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'EXG', 'Azul Marinho', 0, 'ESC-TAC-EXG');

-- Insert Variants for Jaqueta Tactel Forrada
INSERT INTO public.variants (product_id, size, color, stock, sku) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0854', '08', 'Azul/Branco', 0, 'JAQ-08'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', '10', 'Azul/Branco', 0, 'JAQ-10'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', '12', 'Azul/Branco', 0, 'JAQ-12'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', '14', 'Azul/Branco', 0, 'JAQ-14'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'PP', 'Azul/Branco', 0, 'JAQ-PP'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'P', 'Azul/Branco', 0, 'JAQ-P'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'M', 'Azul/Branco', 0, 'JAQ-M'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'G', 'Azul/Branco', 0, 'JAQ-G'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'GG', 'Azul/Branco', 0, 'JAQ-GG'),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'EXG', 'Azul/Branco', 0, 'JAQ-EXG');

-- Insert Variants for Calça Brim Profissional
INSERT INTO public.variants (product_id, size, color, stock, sku) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0855', '40', 'Cinza', 0, 'CALCA-CZ-40');

-- Insert Users
INSERT INTO public.users (id, name, email, role, avatar, password) VALUES
('1', 'Carlos Admin', 'admin@stylos.com', 'ADMIN', 'https://i.pravatar.cc/150?u=1', 'admin123'),
('2', 'Julia Estoque', 'estoque@stylos.com', 'ESTOQUE', 'https://i.pravatar.cc/150?u=2', 'estoque123'),
('3', 'Marcos Vendas', 'vendas@stylos.com', 'VENDAS', 'https://i.pravatar.cc/150?u=3', 'vendas123');
