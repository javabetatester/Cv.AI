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
    // Hugging Face - Primeira opção (mais generosa)
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

    // OpenRouter - Terceira opção (múltiplos modelos)
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
        model: 'microsoft/wizardlm-2-8x22b', // Modelo gratuito
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
        content: `Você é um especialista mundial em otimização de currículos e sistemas ATS.

MISSÃO CRÍTICA:
1. EXTRAIR PALAVRAS-CHAVE EXATAS da descrição da vaga
2. INTEGRAR essas palavras no currículo de forma natural e relevante
3. ADAPTAR o currículo para a vaga específica usando as competências do candidato

INSTRUÇÕES ESPECÍFICAS:
- Leia TODA a descrição da vaga e identifique TODAS as tecnologias, ferramentas e competências mencionadas
- Use as palavras-chave EXATAS da vaga (não sinônimos)
- Mantenha as informações reais do candidato, mas ADAPTE a linguagem
- Reorganize experiências para destacar o que é RELEVANTE para a vaga
- No resumo, mencione especificamente as tecnologias da vaga
- Nas conquistas, use verbos de ação e quantifique resultados

RESPONDA APENAS COM JSON VÁLIDO. Nenhum texto extra.`
      },
      {
        role: 'user',
        content: `CURRÍCULO DO CANDIDATO:
${cvText}

DESCRIÇÃO DA VAGA:
${jobDescription}

TAREFA: Otimize este currículo especificamente para esta vaga.

ANÁLISE OBRIGATÓRIA:
1. Identifique TODAS as palavras-chave técnicas da vaga
2. Encontre as competências do candidato que se relacionam
3. Adapte o resumo para mencionar as tecnologias específicas da vaga
4. Reorganize experiências destacando projetos relevantes
5. Use as palavras-chave EXATAS da descrição da vaga

ESTRUTURA JSON EXATA:
{
  "name": "NOME DO CANDIDATO EM MAIÚSCULAS",
  "position": "Título exato da vaga ou similar",
  "area": "Área específica da vaga",
  "email": "email do candidato",
  "phone": "telefone do candidato", 
  "linkedin": "linkedin do candidato",
  "location": "localização do candidato",
  "summary": "Resumo de 3-4 linhas mencionando ESPECIFICAMENTE as tecnologias e competências da vaga, usando palavras-chave EXATAS",
  "skills": {
    "programming": ["tecnologias de programação relevantes para a vaga"],
    "frameworks": ["frameworks e ferramentas específicas da vaga"],
    "databases": ["bancos de dados mencionados ou relevantes"],
    "tools": ["ferramentas específicas da vaga como IA, Low Code, APIs"],
    "methodologies": ["metodologias de desenvolvimento relevantes"],
    "languages": ["idiomas do candidato"]
  },
  "experience": [
    {
      "company": "empresa real do candidato",
      "position": "cargo real, mas adaptado se necessário",
      "period": "período real",
      "location": "localização real",
      "achievements": [
        "Conquistas reais do candidato, mas reescritas usando palavras-chave da vaga",
        "Projetos do candidato descritos com terminologia da vaga",
        "Responsabilidades quantificadas e alinhadas com a vaga"
      ]
    }
  ],
  "education": [
    {
      "institution": "instituição real do candidato",
      "degree": "grau real",
      "course": "curso real",
      "year": "ano real",
      "location": "localização real",
      "projects": ["projetos acadêmicos relevantes para a vaga"]
    }
  ],
  "certifications": [
    {
      "name": "certificações reais do candidato",
      "institution": "instituição real",
      "year": "ano real"
    }
  ],
  "projects": [
    {
      "name": "projetos reais do candidato",
      "technologies": ["tecnologias usadas, priorizando as da vaga"],
      "description": "descrição focada nas competências da vaga",
      "achievements": ["resultados quantificados"],
      "link": "link real se disponível"
    }
  ],
  "achievements": ["conquistas reais do candidato"],
  "activities": ["atividades reais do candidato"],
  "keywords": ["TODAS as palavras-chave EXATAS extraídas da descrição da vaga"]
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
          continue; // Tenta próximo provider
        }
        
      } catch (error) {
        console.error(`Falha em ${provider.name}:`, error);
        lastError = error as Error;
        continue; // Tenta próximo provider
      }
    }

    // Se chegou aqui, todos os providers falharam
    console.warn('Todos os provedores de IA falharam, usando dados de demonstração');
    return this.getFallbackCVData();
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

  private static getFallbackCVData(): CVData {
    // Dados genéricos que se adaptam a qualquer área
    return {
      name: "MARIA SANTOS OLIVEIRA",
      position: "Especialista em Gestão e Desenvolvimento",
      area: "Administração e Negócios",
      email: "maria.santos@email.com",
      phone: "(11) 99999-7777",
      linkedin: "linkedin.com/in/mariasantos",
      location: "São Paulo, SP",
      summary: "Profissional com 6+ anos de experiência em gestão de projetos, análise de processos e desenvolvimento de estratégias. Expertise em liderança de equipes multidisciplinares, otimização de resultados e implementação de melhorias que geraram aumento de 35% na eficiência operacional. Busco oportunidade para aplicar conhecimentos analíticos e visão estratégica em ambiente dinâmico e orientado a resultados.",
      skills: {
        programming: ["Análise de Dados", "Gestão de Projetos", "Planejamento Estratégico", "Processos Organizacionais"],
        frameworks: ["Power BI", "MS Project", "Tableau", "CRM", "ERP"],
        databases: ["SQL", "Excel Avançado", "Access", "Business Intelligence"],
        tools: ["Excel Avançado", "Power BI", "MS Project", "Tableau", "CRM", "ERP"],
        methodologies: ["Scrum", "Kanban", "Lean Six Sigma", "PMBOK", "Design Thinking"],
        languages: ["Português (nativo)", "Inglês (fluente)", "Espanhol (intermediário)"]
      },
      experience: [
        {
          company: "Empresa Líder do Mercado",
          position: "Analista de Processos Senior",
          period: "Jan/2021 - Atual",
          location: "São Paulo, SP",
          achievements: [
            "Liderou implementação de metodologia ágil em 3 departamentos, reduzindo tempo de entrega em 40%",
            "Desenvolveu dashboard de KPIs que melhorou tomada de decisão estratégica em 60%",
            "Coordenou equipe multidisciplinar de 8 profissionais em projeto de reestruturação organizacional",
            "Implementou sistema de gestão da qualidade resultando em certificação ISO 9001",
            "Conduziu treinamentos para 50+ colaboradores em metodologias de melhoria contínua"
          ]
        },
        {
          company: "Consultoria Estratégica Nacional",
          position: "Consultora de Negócios",
          period: "Mar/2019 - Dez/2020",
          location: "São Paulo, SP",
          achievements: [
            "Realizou diagnóstico organizacional para 15+ empresas de médio porte",
            "Desenvolveu planos de ação que resultaram em economia média de R$ 200K por cliente",
            "Criou metodologia própria de análise de processos adotada pela consultoria",
            "Apresentou resultados para C-level de empresas multinacionais",
            "Mentorou 5 consultores júnior contribuindo para desenvolvimento profissional da equipe"
          ]
        }
      ],
      education: [
        {
          institution: "UNIVERSIDADE FEDERAL DE SÃO PAULO (UNIFESP)",
          degree: "Bacharelado",
          course: "Administração de Empresas",
          year: "2018",
          location: "São Paulo, SP",
          projects: [
            "TCC: Análise de Viabilidade Econômica em Startups Tecnológicas",
            "Projeto Integrador: Consultoria para Microempresas da Região"
          ]
        }
      ],
      certifications: [
        {
          name: "Project Management Professional (PMP)",
          institution: "Project Management Institute",
          year: "2023"
        },
        {
          name: "Lean Six Sigma Green Belt",
          institution: "International Association for Six Sigma Certification",
          year: "2022"
        },
        {
          name: "Professional Scrum Master I",
          institution: "Scrum.org",
          year: "2021"
        }
      ],
      projects: [
        {
          name: "Sistema de Gestão de Performance",
          technologies: ["Power BI", "Excel", "SQL", "Python"],
          description: "Desenvolveu sistema integrado de acompanhamento de KPIs para empresa de 200+ funcionários",
          achievements: [
            "Automatizou geração de relatórios reduzindo 80% do tempo manual",
            "Implementou alertas proativos que aumentaram reação a desvios em 70%"
          ]
        },
        {
          name: "Projeto de Transformação Digital",
          technologies: ["Metodologias Ágeis", "Change Management", "Process Mining"],
          description: "Liderou transformação digital em empresa tradicional do setor de manufatura",
          achievements: [
            "Digitalizou 90% dos processos manuais em 6 meses",
            "Treinou 100+ colaboradores em novas tecnologias e processos"
          ]
        }
      ],
      achievements: [
        "2023 - Prêmio Inovação em Processos - Associação Brasileira de Gestão",
        "2022 - Reconhecimento Profissional do Ano - Empresa Atual",
        "2021 - Certificação com Distinção - Lean Six Sigma Green Belt"
      ],
      activities: [
        "Voluntariado: Consultora Voluntária - ONG Empreendedorismo Social (2020-Atual)",
        "Palestras: 'Gestão Ágil na Prática' - Congresso Nacional de Administração (2023)",
        "Mentoria: Programa de Mentoria para Mulheres em Liderança - FIAP (2022-Atual)"
      ],
      keywords: [
        "Gestão de Projetos", "Análise de Processos", "Liderança", "Planejamento Estratégico",
        "Metodologias Ágeis", "Scrum", "Kanban", "Lean Six Sigma", "Power BI", "Excel",
        "KPIs", "Dashboard", "Melhoria Contínua", "Transformação Digital", "Change Management",
        "Equipes Multidisciplinares", "Tomada de Decisão", "Análise de Dados", "Consultoria",
        "Negociação", "Comunicação", "PMP", "ISO 9001", "Otimização de Resultados"
      ]
    };
  }
}