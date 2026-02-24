import React from 'react';
import { Download, Cloud, Server, Github } from 'lucide-react';

export const Help = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Central de Ajuda & Publicação</h1>

      <div className="grid gap-6">
        {/* Card 1: Como Baixar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
              <Download size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-700">1. Como baixar o código (ZIP)?</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Como esta é uma ferramenta de desenvolvimento online, você precisa exportar o código para o seu computador.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700">
            <strong>Onde está o botão?</strong><br/>
            Olhe para a <strong>barra superior</strong> desta janela (fora do aplicativo, na interface do editor). 
            Procure por um ícone de <strong>Seta para Baixo</strong>, <strong>Export</strong> ou <strong>Download</strong>.
            Ao clicar, você baixará um arquivo <code>.zip</code> com todo o código fonte.
          </div>
        </div>

        {/* Card 2: Netlify */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-lg mr-4">
              <Cloud size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-700">2. Como publicar no Netlify (Grátis)</h2>
          </div>
          <ol className="list-decimal list-inside space-y-3 text-slate-600 ml-2">
            <li>Acesse <a href="https://app.netlify.com" target="_blank" className="text-blue-600 hover:underline">app.netlify.com</a> e crie uma conta.</li>
            <li>Arraste a pasta do projeto (que você extraiu do ZIP) para a área de "Deploy" ou conecte com seu GitHub.</li>
            <li>
              <strong>Configuração Importante:</strong> Vá em <em>Site settings &gt; Environment variables</em> e adicione:
              <div className="mt-3 space-y-2">
                <div className="bg-slate-100 p-2 rounded border border-slate-300 text-xs break-all">
                  <span className="font-bold text-slate-700 block mb-1">VITE_SUPABASE_URL</span>
                  <code className="select-all">{import.meta.env.VITE_SUPABASE_URL}</code>
                </div>
                <div className="bg-slate-100 p-2 rounded border border-slate-300 text-xs break-all">
                  <span className="font-bold text-slate-700 block mb-1">VITE_SUPABASE_ANON_KEY</span>
                  <code className="select-all">{import.meta.env.VITE_SUPABASE_ANON_KEY}</code>
                </div>
              </div>
            </li>
            <li>O Netlify vai gerar um link (ex: <code>seusite.netlify.app</code>) que você pode acessar de qualquer lugar!</li>
          </ol>
        </div>

        {/* Card 3: Supabase */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
              <Server size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-700">3. Banco de Dados (Supabase)</h2>
          </div>
          <p className="text-slate-600">
            Seu banco de dados já está na nuvem! Não precisa fazer nada. 
            Tanto a versão de teste aqui quanto a versão publicada no Netlify usarão os mesmos dados.
          </p>
        </div>
        {/* Card 4: HostGator / cPanel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg mr-4">
              <Server size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-700">4. HostGator / cPanel (Hospedagem Tradicional)</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Sim! Você pode hospedar na HostGator. Como este é um site estático (React), ele funciona em qualquer hospedagem.
          </p>
          <ol className="list-decimal list-inside space-y-3 text-slate-600 ml-2">
            <li>
              <strong>Gere a versão final (Build):</strong>
              <br/>
              No seu computador (com Node.js instalado), rode o comando:
              <code className="bg-slate-100 px-2 py-1 rounded text-sm ml-2">npm run build</code>
              <br/>
              Isso vai criar uma pasta chamada <code>dist</code>.
            </li>
            <li>
              <strong>Acesse o cPanel:</strong>
              <br/>
              Vá no Gerenciador de Arquivos da HostGator e abra a pasta <code>public_html</code> (ou a pasta do seu domínio).
            </li>
            <li>
              <strong>Upload:</strong>
              <br/>
              Envie <strong>todos os arquivos</strong> que estão DENTRO da pasta <code>dist</code> para lá.
            </li>
            <li>
              <strong>Arquivo .htaccess (Importante):</strong>
              <br/>
              O sistema já inclui um arquivo <code>.htaccess</code> na pasta pública. Certifique-se de que ele foi enviado junto. 
              Ele é necessário para que as rotas (ex: /vendas, /estoque) funcionem corretamente ao recarregar a página.
            </li>
            <li>
              <strong>Variáveis de Ambiente:</strong>
              <br/>
              Na HostGator, você não configura variáveis de ambiente no painel. Você deve criar um arquivo chamado <code>.env</code> na raiz do seu site (dentro do public_html) ou, preferencialmente, editar o arquivo <code>assets/index-*.js</code> (avançado) ou garantir que as variáveis já foram "embutidas" durante o comando <code>npm run build</code>.
              <br/>
              <em className="text-sm text-orange-600">Dica: Ao rodar o build no seu computador, certifique-se de ter o arquivo .env configurado localmente. O Vite vai "queimar" as chaves no código final automaticamente.</em>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
