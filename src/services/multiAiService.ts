// src/services/multiAiService.ts
import { CVData } from '../types';

interface APIProvider {
  name: string;
  endpoint: string;
  headers: Record<string, string>;
  transform: (messages: any[]) => any;
  parseResponse: (response: any) => string;
}

export class MultiAIService {
  private static providers: APIProvider[] = [
    // Hugging Face - Primeira opção
    {
      name: 'HuggingFace',
      endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      transform: (messages) => ({
        inputs: messages[messages.length - 1].content,
        parameters: {
          max_length: 5000,
          temperature: 0.1,
          do_sample: true
        }
      }),
      parseResponse: (response) => {
        if (Array.isArray(response) && response[0]?.generated_text) {
          return response[0].generated_text;
        }
        return JSON.stringify(response);
      }
    },

    // Google Gemini - Segunda opção
    {
      name: 'Gemini',
      endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      headers: {
        'Content-Type': 'application/json',
      },
      transform: (messages) => ({
        contents: [{
          parts: [{
            text: messages.map(m => `${m.role}: ${m.content}`).join('\n\n')
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      }),
      parseResponse: (response) => {
        return response.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(response);
      }
    },

    // OpenRouter - Terceira opção
    {
      name: 'OpenRouter',
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'CV Optimizer AI'
      },
      transform: (messages) => ({
        model: 'microsoft/wizardlm-2-8x22b',
        messages,
        temperature: 0.3,
        max_tokens: 2000
      }),
      parseResponse: (response) => {
        return response.choices?.[0]?.message?.content || JSON.stringify(response);
      }
    }
  ];

  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static async callProvider(
    provider: APIProvider,
    messages: any[],
    retryCount = 0
  ): Promise<string> {
    const maxRetries = 2;

    try {
      console.log(`Tentando ${provider.name}...`);

      const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: provider.headers,
        body: JSON.stringify(provider.transform(messages)),
      });

      if (!response.ok) {
        if (response.status === 429 && retryCount < maxRetries) {
          console.log(`Rate limit em ${provider.name}, tentando novamente em 5s...`);
          await this.delay(5000);
          return this.callProvider(provider, messages, retryCount + 1);
        }

        const errorText = await response.text();
        throw new Error(`${provider.name} Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const result = provider.parseResponse(data);

      if (!result || result.trim().length === 0) {
        throw new Error(`${provider.name}: Resposta vazia`);
      }

      console.log(`✅ Sucesso com ${provider.name}`);
      return result;

    } catch (error) {
      console.error(`❌ Erro em ${provider.name}:`, error);
      throw error;
    }
  }

  public static async optimizeCV(
    cvText: string,
    jobDescription: string
  ): Promise<CVData> {
    const messages = [
      {
        role: 'system',
        content: `Você é um especialista sênior em Recrutamento & Seleção e Headhunter, com mais de 20 anos de experiência em otimização de currículos para sistemas ATS e para análise de recrutadores.

**REGRAS FUNDAMENTAIS:**
1.  **FIDELIDADE AO HISTÓRICO**: Manter 100% das experiências profissionais, mantendo datas, empresas e cargos originais. A cronologia é imutável.
2.  **ADEQUAÇÃO ESTRATÉGICA**: O objetivo é adaptar e reescrever o conteúdo para que o currículo atual pareça o mais adequado possível para a vaga, destacando as sinergias existentes.
3.  **ENRIQUECIMENTO, NÃO INVENÇÃO**: Enriqueça as descrições com palavras-chave e termos da vaga. É permitido reinterpretar responsabilidades para alinhar com a vaga, mas é proibido fabricar experiências ou competências que o candidato não possui.
4.  **RELEVÂNCIA PRIMEIRO**: Reorganize a ordem das seções ou dos itens dentro delas para dar prioridade ao que é mais relevante para a vaga.
5.  **FOCO NO ATS**: Utilize termos e palavras-chave exatas da descrição da vaga para garantir a máxima compatibilidade com os sistemas de triagem automática.
6.  **SAÍDA ESTRITAMENTE JSON**: Sua resposta deve ser exclusivamente um objeto JSON válido, sem nenhum texto ou comentário adicional fora do JSON.

**ADAPTAÇÕES PERMITIDAS:**
* **Título Profissional**: Modifique o título principal para espelhar o cargo da vaga (ex: "Analista de Dados" vira "Cientista de Dados" se a vaga for para essa posição e as competências forem compatíveis).
* **Resumo Profissional**: Reescreva completamente o resumo para ser um "pitch" direto para a vaga, conectando as principais experiências do candidato com os requisitos da vaga.
* **Responsabilidades e Conquistas**: Mantenha a essência de cada tarefa, mas reescreva-as usando a terminologia da vaga, quantificando resultados sempre que possível (ex: "Desenvolvi rotinas de otimização" pode virar "Liderei a otimização de processos de ETL, resultando em uma melhoria de 15% na performance", se for uma inferência razoável).
* **Competências**: Destaque e adapte a nomenclatura das habilidades que o candidato já possui para que correspondam exatamente aos termos usados na vaga. Não adicione habilidades que não sejam uma extensão lógica do perfil.`,
      },
      {
        role: 'user',
        content: `**MISSÃO DE RH ESTRATÉGICO:** Analise o currículo e a vaga a seguir. Otimize o currículo para maximizar a compatibilidade com a vaga, tornando-o altamente atrativo para os recrutadores e para os sistemas ATS. A otimização deve ser realista, sem alterar a cronologia e sem inventar experiências.

**CURRÍCULO ORIGINAL:**
\`\`\`
${cvText}
\`\`\`

**VAGA ALVO:**
\`\`\`
${jobDescription}
\`\`\`

**INSTRUÇÕES DE OTIMIZAÇÃO:**
1.  **ANÁLISE DA VAGA**: Identifique as competências, tecnologias, responsabilidades e palavras-chave mais críticas para o ATS.
2.  **ADAPTAÇÃO DE TÍTULO E RESUMO**: Alinhe o título profissional e reescreva o resumo para espelhar diretamente os requisitos da vaga.
3.  **REFORMULAÇÃO DA EXPERIÊNCIA**: Mantenha todas as experiências, mas reescreva as responsabilidades e conquistas de cada uma para destacar a relevância para a vaga, utilizando as palavras-chave identificadas.
4.  **ADEQUAÇÃO DE COMPETÊNCIAS**: Reestruture a seção de habilidades para priorizar as que são mencionadas na vaga. Use os mesmos termos da descrição da vaga para nomear as competências que o candidato já possui.
5.  **EXTRAÇÃO DE PALAVRAS-CHAVE**: Crie uma lista de palavras-chave extraídas diretamente da descrição da vaga para incluir no final do JSON.

**FORMATO DE SAÍDA (OBRIGATÓRIO - APENAS JSON):**
Gere um objeto JSON contendo a estrutura de dados completa do currículo otimizado, conforme o exemplo abaixo:
\`\`\`json
{
  "name": "NOME COMPLETO DO CANDIDATO",
  "position": "Título do cargo adaptado para a vaga",
  "area": "Área de atuação da vaga",
  "email": "email.real@exemplo.com",
  "phone": "Telefone real",
  "linkedin": "URL do LinkedIn real",
  "location": "Localização real",
  "summary": "Resumo profissional totalmente reescrito e focado na vaga.",
  "skills": {
    "programming": ["Linguagens existentes adaptadas e priorizadas pela vaga"],
    "frameworks": ["Frameworks existentes adaptados e priorizados pela vaga"],
    "databases": ["Bancos de dados existentes adaptados e priorizados pela vaga"],
    "tools": ["Ferramentas existentes adaptadas e priorizadas pela vaga"],
    "methodologies": ["Metodologias existentes adaptadas e priorizadas pela vaga"],
    "languages": ["Idiomas que o candidato fala"]
  },
  "experience": [
    {
      "company": "Nome da Empresa Original",
      "position": "Cargo Original (pode ser levemente ajustado)",
      "period": "Período Original (imutável)",
      "location": "Localização Original",
      "achievements": [
        "Responsabilidade 1 reescrita com foco na vaga.",
        "Conquista 2 quantificada e alinhada com os objetivos da vaga.",
        "Tecnologia X (da vaga) aplicada em projeto Y (real do candidato)."
      ]
    }
  ],
  "education": [
    {
      "institution": "Instituição de Ensino Original",
      "degree": "Grau Original",
      "course": "Curso Original",
      "year": "Ano de Conclusão Original",
      "location": "Localização Original",
      "projects": ["Projetos acadêmicos relevantes, se houver"]
    }
  ],
  "certifications": [
    {
      "name": "Nome da Certificação Original",
      "institution": "Instituição da Certificação Original",
      "year": "Ano Original"
    }
  ],
  "projects": [
    {
      "name": "Nome do Projeto Original",
      "technologies": ["Tecnologias originais, com nomenclatura alinhada à vaga"],
      "description": "Descrição original, reescrita para destacar relevância.",
      "achievements": ["Conquistas originais, reescritas para a vaga."]
    }
  ],
  "achievements": ["Conquistas e premiações gerais relevantes."],
  "activities": ["Atividades complementares relevantes."],
  "keywords": ["Lista de palavras-chave exatas e importantes extraídas da vaga para ATS."]
}
\`\`\`
`,
      },
    ];

    let lastError: Error | null = null;

    // Tenta cada provider em sequência
    for (const provider of this.providers) {
      try {
        // Verifica se a API key está configurada
        const apiKeyEnvVar = this.getApiKeyEnvVar(provider.name);
        if (!apiKeyEnvVar) {
          console.log(`⚠️ ${provider.name}: API key não configurada, pulando...`);
          continue;
        }

        const response = await this.callProvider(provider, messages);

        // Tenta fazer parse do JSON
        try {
          const cleanResponse = this.cleanJsonResponse(response);
          const cvData: CVData = JSON.parse(cleanResponse);

          // Validação básica
          if (this.validateCVData(cvData)) {
            console.log(`🎉 CV otimizado com sucesso usando ${provider.name}`);
            return cvData;
          } else {
            throw new Error('Dados do CV incompletos após validação');
          }

        } catch (parseError) {
          console.error(`Erro ao fazer parse da resposta de ${provider.name}:`, parseError);
          lastError = parseError as Error;
          continue;
        }

      } catch (error) {
        console.error(`Falha em ${provider.name}:`, error);
        lastError = error as Error;
        continue;
      }
    }

    // Se chegou aqui, todos os providers falharam
    console.error('Todos os provedores de IA falharam');
    throw new Error('Não foi possível conectar com os serviços de IA. Verifique sua conexão com a internet e tente novamente.');
  }

  private static getApiKeyEnvVar(providerName: string): string | undefined {
    switch (providerName) {
      case 'HuggingFace':
        return import.meta.env.VITE_HUGGINGFACE_API_KEY;
      case 'Gemini':
        return import.meta.env.VITE_GEMINI_API_KEY;
      case 'OpenRouter':
        return import.meta.env.VITE_OPENROUTER_API_KEY;
      default:
        return undefined;
    }
  }

  private static cleanJsonResponse(response: string): string {
    // Remove possíveis caracteres extras e foca no JSON
    let cleaned = response.trim();

    // Procura pelo início e fim do JSON
    const startIndex = cleaned.indexOf('{');
    const lastBraceIndex = cleaned.lastIndexOf('}');

    if (startIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > startIndex) {
      cleaned = cleaned.substring(startIndex, lastBraceIndex + 1);
    }

    return cleaned;
  }

  private static validateCVData(cvData: any): cvData is CVData {
    return (
      cvData &&
      typeof cvData.name === 'string' &&
      typeof cvData.email === 'string' &&
      typeof cvData.summary === 'string' &&
      Array.isArray(cvData.experience) &&
      Array.isArray(cvData.education) &&
      typeof cvData.skills === 'object'
    );
  }
}