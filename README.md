# CV Optimizer AI 🚀

[](https://opensource.org/licenses/MIT)
[](https://react.dev/)
[](https://vitejs.dev/)
[](https://www.typescriptlang.org/)

Transforme seu currículo com o poder da Inteligência Artificial e conquiste a vaga dos seus sonhos. Esta ferramenta analisa o seu CV e a descrição de uma vaga para criar uma versão otimizada, focada em passar por sistemas de triagem (ATS) e em chamar a atenção dos recrutadores.

 \#\# ✨ Funcionalidades Principais

  - **Upload de Currículo**: Envie seu currículo atual no formato PDF.
  - **Análise de Vaga**: Cole a descrição da vaga desejada para que a IA identifique os pontos-chave.
  - **Otimização Inteligente**: Utiliza provedores de IA como Google Gemini e OpenRouter para reescrever e adequar seu currículo de forma estratégica.
  - **Visualização em Tempo Real**: Veja o novo currículo sendo "digitado" em tempo real.
  - **Download em PDF**: Baixe a versão otimizada do seu currículo em um arquivo PDF profissional.
  - **Sistema de Fallback**: Garante a robustez utilizando múltiplos provedores de IA em sequência.
  - **Interface Moderna**: Design limpo e agradável com suporte a modo claro e escuro.

## ⚙️ Como Funciona

O processo é dividido em quatro etapas simples:

1.  **Upload**: Você começa enviando seu currículo em PDF.
2.  **Descrição da Vaga**: Em seguida, você insere a descrição da vaga para a qual deseja se candidatar.
3.  **Processamento**: Nossa IA entra em ação, analisando ambos os documentos e cruzando as informações para criar a versão otimizada do seu CV.
4.  **Resultado**: Você visualiza o resultado e pode baixar o novo currículo em PDF, pronto para ser enviado\!

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

  - **Frontend**: React, Vite, TypeScript, Tailwind CSS
  - [cite\_start]**IA e Serviços**: Google Gemini API, OpenRouter API, Hugging Face API [cite: 1]
  - **Manipulação de PDF**:
      - `pdfjs-dist` para extração de texto de PDFs.
      - `jspdf` para a geração do novo arquivo PDF.
  - **UI & Ícones**: `lucide-react`

## 📂 Estrutura do Projeto

A estrutura de pastas principal do projeto é organizada da seguinte forma:

```
/src
├── /components      # Componentes React reutilizáveis (Upload, CVSection, etc.)
├── /hooks           # Hooks React customizados (ex: useTypingEffect)
├── /services        # Lógica de negócio e comunicação com APIs (aiService, multiAiService)
├── /types           # Definições de tipos e interfaces TypeScript
├── /utils           # Funções utilitárias (pdfGenerator, pdfExtractor)
├── App.tsx          # Componente principal que gerencia o estado e as etapas
└── main.tsx         # Ponto de entrada da aplicação
```

## 🚀 Configuração e Instalação

Siga os passos abaixo para executar o projeto localmente:

**1. Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as variáveis de ambiente:**

Crie um arquivo chamado `.env.local` na raiz do projeto e adicione suas chaves de API. Você pode obtê-las nos respectivos sites dos provedores.

```ini
# .env.local

# APIs Gratuitas para CV Optimizer AI
VITE_HUGGINGFACE_API_KEY="sua_chave_huggingface"
VITE_GEMINI_API_KEY="sua_chave_gemini"
VITE_OPENROUTER_API_KEY="sua_chave_openrouter"

# Outras variáveis (opcional)
VITE_APP_TITLE="CV Optimizer AI"
VITE_API_URL="http://localhost:5173"
```

[cite\_start]As definições de tipo para essas variáveis estão em `vite.env.d.ts`. [cite: 1]

**4. Execute o projeto:**

```bash
npm run dev
```

Abra [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) no seu navegador para ver a aplicação.

### Scripts Disponíveis

  - `npm run dev`: Inicia o servidor de desenvolvimento.
  - `npm run build`: Compila o projeto para produção.
  - `npm run lint`: Executa o linter para análise de código.
  - `npm run preview`: Inicia um servidor local para visualizar a build de produção.

## 🤝 Contribuição

Contribuições são muito bem-vindas\! Se você tem ideias para melhorias ou encontrou algum bug, sinta-se à vontade para:

1.  Fazer um **Fork** deste repositório.
2.  Criar uma nova **Branch** (`git checkout -b feature/sua-feature`).
3.  Fazer **Commit** de suas alterações (`git commit -m 'Adiciona nova feature'`).
4.  Fazer **Push** para a Branch (`git push origin feature/sua-feature`).
5.  Abrir um **Pull Request**.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
