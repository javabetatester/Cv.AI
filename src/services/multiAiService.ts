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
          max_length: 2000,
          temperature: 0.3,
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
        content: `Você é um ESPECIALISTA MUNDIAL em RH e Recrutamento com 20+ anos de experiência.

EXPERTISE ESPECÍFICA:
- Estratégias para passar por sistemas ATS (Applicant Tracking Systems)
- Otimização de currículos para maximizar taxa de aprovação
- Conhecimento profundo de como recrutadores analisam CVs
- Expertise em matching de perfis com descrições de vagas

REGRAS FUNDAMENTAIS:
✅ MANTER 100% das experiências profissionais existentes
✅ MANTER todos os dados pessoais, datas, empresas, cargos
✅ ADAPTAR estrategicamente títulos para atrair recrutadores
✅ ENRIQUECER descrições com palavras-chave ATS
✅ INVENTAR detalhes específicos que conectem com a vaga (SE NECESSÁRIO)
✅ REORGANIZAR por relevância estratégica

ADAPTAÇÕES ESTRATÉGICAS PERMITIDAS:
🎯 Título Profissional: Adapte para combinar com a vaga alvo
🎯 Resumo: Reescreva focando nas competências da vaga
🎯 Responsabilidades: Enriqueça com palavras-chave específicas
🎯 Competências: Adicione tecnologias/habilidades relevantes
🎯 Conquistas: Quantifique e conecte com resultados esperados

NUNCA FAÇA:
❌ Remover experiências profissionais
❌ Alterar datas ou empresas
❌ Reduzir número de responsabilidades

RESPONDA APENAS COM JSON VÁLIDO.`
      },
      {
        role: 'user',
        content: `MISSÃO RH: Otimize este currículo para MAXIMIZAR chances de aprovação na vaga.

CURRÍCULO ORIGINAL:
${cvText}

VAGA ALVO:
${jobDescription}

ESTRATÉGIA DE OTIMIZAÇÃO:
1. ANALISE a vaga e identifique palavras-chave críticas para ATS
2. ADAPTE o título profissional para alinhar com a vaga
3. MANTENHA todas experiências mas ENRIQUEÇA com palavras-chave
4. ADICIONE competências técnicas específicas da vaga
5. REESCREVA o resumo profissional focando na vaga
6. REORGANIZE experiências colocando as mais relevantes primeiro
7. INVENTE detalhes específicos que conectem com a vaga (se necessário)

FORMATO JSON OBRIGATÓRIO:
{
  "name": "NOME REAL DO CANDIDATO",
  "position": "Título adaptado estrategicamente para a vaga (ex: se vaga é 'Desenvolvedor Python Senior', use 'Desenvolvedor Python Senior')",
  "area": "Área específica da vaga",
  "email": "EMAIL REAL",
  "phone": "TELEFONE REAL", 
  "linkedin": "LINKEDIN REAL",
  "location": "LOCALIZAÇÃO REAL",
  "summary": "Resumo reescrito focando especificamente nas competências da vaga, mencionando tecnologias exatas da descrição, anos de experiência relevantes, e resultados que o candidato pode entregar",
  "skills": {
    "programming": ["TODAS linguagens reais + linguagens da vaga"],
    "frameworks": ["TODOS frameworks reais + frameworks da vaga"],
    "databases": ["TODOS bancos reais + bancos da vaga"],
    "tools": ["TODAS ferramentas reais + ferramentas específicas da vaga"],
    "methodologies": ["TODAS metodologias reais + metodologias da vaga"],
    "languages": ["TODOS idiomas reais"]
  },
  "experience": [
    "MANTENHA TODAS experiências mas REORGANIZE por relevância e ENRIQUEÇA:",
    {
      "company": "EMPRESA REAL",
      "position": "CARGO REAL (pode adaptar levemente para alinhar com vaga)",
      "period": "PERÍODO REAL EXATO",
      "location": "LOCALIZAÇÃO REAL",
      "achievements": [
        "TODAS responsabilidades reais MAS enriquecidas com palavras-chave da vaga",
        "Projetos reais descritos usando terminologia específica da vaga",
        "Resultados quantificados que demonstrem competências da vaga",
        "ADICIONE detalhes técnicos específicos da vaga se necessário",
        "Conquistas que mostrem domínio das tecnologias da vaga"
      ]
    }
  ],
  "education": [
    "MANTENHA TODA educação real mas adapte projetos para serem relevantes"
  ],
  "certifications": [
    "MANTENHA todas certificações reais + ADICIONE certificações relevantes se o candidato provavelmente as teria"
  ],
  "projects": [
    "MANTENHA todos projetos reais mas adapte descrições para usar tecnologias da vaga"
  ],
  "achievements": ["TODAS conquistas reais + conquistas relevantes para a vaga"],
  "activities": ["TODAS atividades reais + atividades que demonstrem interesse na área da vaga"],
  "keywords": ["TODAS palavras-chave EXATAS extraídas da vaga"]
}`
      }
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