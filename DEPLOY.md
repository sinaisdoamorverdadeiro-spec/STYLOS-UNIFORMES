# Como Publicar seu Sistema Gratuitamente

Para usar o sistema no dia a dia em sua loja ou fábrica, você precisa hospedá-lo em um serviço de nuvem. As melhores opções gratuitas para este tipo de aplicação (React + Vite + Supabase) são **Vercel** ou **Netlify**.

## Opção 1: Vercel (Recomendado)

A Vercel é excelente para aplicações React e tem um plano gratuito muito generoso.

### Passos:

1.  **Baixe o código**: Clique no botão de download no canto superior direito do editor para baixar o projeto como um arquivo ZIP.
2.  **Crie um repositório no GitHub**:
    *   Crie uma conta no [GitHub](https://github.com/) (se não tiver).
    *   Crie um novo repositório (público ou privado).
    *   Extraia o ZIP e envie os arquivos para este repositório (usando Git ou upload manual).
3.  **Conecte à Vercel**:
    *   Crie uma conta na [Vercel](https://vercel.com/).
    *   Clique em "Add New..." -> "Project".
    *   Importe o repositório do GitHub que você acabou de criar.
4.  **Configure as Variáveis de Ambiente**:
    *   Na tela de configuração do projeto na Vercel, procure a seção "Environment Variables".
    *   Adicione as mesmas variáveis que estão no seu arquivo `.env`:
        *   `VITE_SUPABASE_URL`: (Sua URL do Supabase)
        *   `VITE_SUPABASE_ANON_KEY`: (Sua chave Anon do Supabase)
5.  **Deploy**:
    *   Clique em "Deploy".
    *   Aguarde alguns instantes e você receberá uma URL (ex: `stylos-uniformes.vercel.app`).
    *   Essa URL pode ser acessada de qualquer computador ou celular!

## Opção 2: Netlify

O Netlify também é uma ótima opção gratuita.

### Passos:

1.  Siga os passos 1 e 2 acima (GitHub).
2.  Crie uma conta no [Netlify](https://www.netlify.com/).
3.  Clique em "Add new site" -> "Import an existing project".
4.  Conecte ao GitHub e escolha seu repositório.
5.  Em "Build settings", o comando de build deve ser `npm run build` e o diretório de publicação `dist`.
6.  Clique em "Show advanced" -> "New variable" e adicione as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
7.  Clique em "Deploy site".

---

**Observação Importante**:
O banco de dados (Supabase) já está na nuvem, então você não precisa fazer nada extra com ele. Apenas conectando o site (frontend) na Vercel ou Netlify, ele já vai ler e gravar os dados no seu banco Supabase automaticamente.
