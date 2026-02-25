# Guia de Deploy na HostGator (Hospedagem Compartilhada / cPanel)

Este guia explica como preparar e subir o projeto **Stylos Uniformes** para a HostGator ou qualquer hospedagem que utilize cPanel (Apache/Nginx).

## 1. Preparação do Projeto (Build)

Antes de subir os arquivos, você precisa "compilar" o projeto para transformar o código TypeScript em arquivos estáticos (HTML, CSS e JS) que o navegador entende.

1.  Abra o terminal na pasta do projeto.
2.  Execute o comando de build:
    ```bash
    npm run build
    ```
3.  Isso criará uma pasta chamada **`dist`** na raiz do projeto.
    *   Esta pasta contém tudo o que você precisa enviar para a hospedagem.

## 2. Configuração para Rotas (React Router)

Como este é um aplicativo de Página Única (SPA) usando React Router, precisamos configurar o servidor Apache da HostGator para redirecionar todas as requisições para o `index.html`. Sem isso, ao recarregar uma página interna (ex: `/vendas`), você receberá um erro 404.

1.  Crie um arquivo chamado **`.htaccess`** dentro da pasta **`dist`** (se ele não foi criado automaticamente).
2.  Cole o seguinte conteúdo nele:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

## 3. Upload para a HostGator (cPanel)

1.  Acesse o **cPanel** da sua hospedagem HostGator.
2.  Abra o **Gerenciador de Arquivos** (File Manager).
3.  Navegue até a pasta pública onde o site deve ficar (geralmente **`public_html`** ou uma subpasta se for um subdomínio).
4.  Clique em **Carregar** (Upload).
5.  Selecione todos os arquivos **de dentro da pasta `dist`** (não a pasta `dist` em si, mas o conteúdo dela: `index.html`, `assets`, `.htaccess`, etc).
    *   Dica: Você pode zipar o conteúdo da pasta `dist` (`conteudo.zip`), fazer upload desse único arquivo e depois usar a opção **Extrair** do cPanel.

## 4. Variáveis de Ambiente (Supabase)

Como a HostGator serve arquivos estáticos, não há um "backend" rodando Node.js para ler variáveis de ambiente do servidor. As chaves do Supabase precisam estar "embutidas" no código durante o build.

**Opção A (Recomendada para Simplicidade):**
Crie um arquivo `.env.production` na raiz do projeto (no seu computador, antes do build) com suas chaves reais:

```env
VITE_SUPABASE_URL=https://sua-url-do-supabase.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-publica
```

Ao rodar `npm run build`, o Vite vai ler esse arquivo e substituir as variáveis no código JavaScript final.

**Opção B (Se não quiser criar o arquivo):**
Rode o build passando as variáveis diretamente no terminal:

```bash
VITE_SUPABASE_URL=https://... VITE_SUPABASE_ANON_KEY=ey... npm run build
```

## 5. Teste

Acesse seu domínio (ex: `www.sua-loja.com.br`). O aplicativo deve carregar.
*   Se aparecer a tela de login, o deploy funcionou!
*   Se der erro 404 ao recarregar páginas, verifique se o arquivo `.htaccess` está na mesma pasta do `index.html`.

---

**Nota:** Lembre-se que para o banco de dados funcionar, a URL do seu site na HostGator deve estar adicionada na lista de **Authentication > URL Configuration > Site URL** no painel do Supabase, embora para login simples com email/senha isso geralmente não seja bloqueante.
