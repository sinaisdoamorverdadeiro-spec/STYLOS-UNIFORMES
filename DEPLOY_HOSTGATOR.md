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
    *   *Nota: Se você já tem um arquivo `.htaccess` na pasta `public` do seu projeto, ele será copiado automaticamente para a `dist` durante o build.*
2.  O conteúdo deve ser:

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

## 4. Banco de Dados (Local Storage)

O projeto foi configurado para funcionar **sem banco de dados externo** (como Supabase).
*   Todos os dados (produtos, clientes, pedidos, funcionários) são salvos no **Navegador** (Local Storage) de quem está usando.
*   Isso significa que não é necessário configurar variáveis de ambiente ou conectar bancos de dados.
*   **Atenção:** Se você limpar o cache do navegador ou trocar de computador, os dados não estarão lá. Para uso profissional com múltiplos usuários acessando os mesmos dados em computadores diferentes, seria necessário reativar o Supabase no futuro.

## 5. Teste

Acesse seu domínio (ex: `www.sua-loja.com.br`). O aplicativo deve carregar.
*   Se aparecer a tela de login, o deploy funcionou!
*   Use os logins padrão (ex: `admin@stylos.com` / `admin123`) ou os que você criar.
