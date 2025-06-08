/// <reference types="vite/client" />

interface ImportMetaEnv {
  // APIs Gratuitas para CV Optimizer AI
  readonly VITE_HUGGINGFACE_API_KEY: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_TOGETHER_API_KEY: string
  
  // Outras variáveis de ambiente que podem ser adicionadas
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}