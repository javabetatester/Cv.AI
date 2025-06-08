// src/services/groqAiService.ts - Versão Universal para QUALQUER profissional
import { CVData } from '../types';

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface PDFTextExtraction {
  text: string;
  sections: {
    personalInfo: string;
    experience: string;
    education: string;
    skills: string;
    projects: string;
  };
}

export class GroqAIService {
  private static readonly GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  private static readonly API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  private static readonly MODEL = 'llama3-8b-8192';

  private static async callGroq(prompt: string, maxTokens: number = 4000): Promise<string> {
    if (!this.API_KEY) {
      throw new Error('VITE_GROQ_API_KEY não configurada. Obtenha uma chave gratuita em https://console.groq.com');
    }

    try {
      const response = await fetch(this.GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.1,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na API Groq: ${response.status} - ${errorText}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message.content || '';
    } catch (error) {
      console.error('Erro ao chamar Groq API:', error);
      throw error;
    }
  }

  static async extractTextFromPDF(file: File): Promise<PDFTextExtraction> {
    try {
      const { PDFExtractor } = await import('../utils/pdfExtractor');
      const extractedData = await PDFExtractor.extractStructuredData(file);
      
      // Prompt universal para qualquer formato de currículo
      const structurePrompt = `
        Você é um especialista em análise de currículos. Extraia e organize as informações do currículo de forma estruturada.
        
        TEXTO DO CURRÍCULO:
        ${extractedData.text}
        
        Identifique e extraia as seções principais. Retorne JSON neste formato:
        {
          "text": "texto completo do currículo",
          "sections": {
            "personalInfo": "informações de contato: nome, telefone, email, LinkedIn, endereço",
            "experience": "todas as experiências profissionais com datas, empresas, cargos e atividades",
            "education": "formação acadêmica: instituições, cursos, graus, anos",
            "skills": "habilidades técnicas, competências, tecnologias, idiomas mencionados",
            "projects": "projetos desenvolvidos, trabalhos acadêmicos, portfolios mencionados"
          }
        }
        
        REGRAS IMPORTANTES:
        - Use APENAS informações que estão explicitamente no texto
        - NÃO invente ou suponha informações que não estão presentes
        - Mantenha nomes, datas, empresas e detalhes exatamente como aparecem
        - Se uma seção não existir no currículo, deixe-a vazia
        - Preserve formatação de datas, períodos e localizações
      `;

      const structuredData = await this.callGroq(structurePrompt, 3000);
      
      try {
        const jsonMatch = structuredData.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : structuredData;
        const parsed = JSON.parse(jsonString);
        return parsed;
      } catch {
        console.log('Usando fallback para estruturação');
        return extractedData;
      }
    } catch (error) {
      console.error('Erro na extração de PDF:', error);
      throw new Error('Falha ao processar arquivo PDF. Verifique se o arquivo é válido.');
    }
  }

  static async analyzeJobDescription(jobDescription: string): Promise<{
    keywords: string[];
    requirements: string[];
    skills: string[];
    responsibilities: string[];
    company: string;
    position: string;
  }> {
    const prompt = `
      Analise esta descrição de vaga e extraia as informações mais relevantes para otimização de currículo:
      
      DESCRIÇÃO DA VAGA:
      ${jobDescription}
      
      Identifique e extraia:
      {
        "keywords": ["palavras-chave importantes que devem aparecer no currículo para ATS"],
        "requirements": ["requisitos técnicos e experiências obrigatórias"],
        "skills": ["habilidades específicas mencionadas"],
        "responsibilities": ["principais responsabilidades e atividades do cargo"],
        "company": "nome da empresa (se mencionado)",
        "position": "título/cargo da vaga"
      }
      
      Retorne apenas o JSON válido.
    `;

    const response = await this.callGroq(prompt, 2000);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      return JSON.parse(jsonString);
    } catch {
      // Fallback genérico
      return {
        keywords: ["experiência", "conhecimento", "desenvolvimento"],
        requirements: ["experiência na área"],
        skills: ["habilidades técnicas"],
        responsibilities: ["atividades do cargo"],
        company: "Empresa não especificada",
        position: "Profissional"
      };
    }
  }

  static async optimizeCV(
    extractedCV: PDFTextExtraction, 
    jobDescription: string
  ): Promise<CVData> {
    try {
      const jobAnalysis = await this.analyzeJobDescription(jobDescription);
      
      // Prompt UNIVERSAL que funciona para qualquer área/profissão
      const optimizationPrompt = `
        Você é um especialista em otimização de currículos para sistemas ATS (Applicant Tracking Systems). 
        Sua tarefa é otimizar um currículo para uma vaga específica, mantendo todas as informações verdadeiras.

        VAGA ALVO:
        - Cargo: ${jobAnalysis.position}
        - Palavras-chave importantes: ${jobAnalysis.keywords.join(', ')}
        - Requisitos: ${jobAnalysis.requirements.join(', ')}
        - Habilidades buscadas: ${jobAnalysis.skills.join(', ')}
        - Responsabilidades: ${jobAnalysis.responsibilities.join(', ')}

        CURRÍCULO ORIGINAL:
        ${extractedCV.text}

        INSTRUÇÕES DE OTIMIZAÇÃO:
        1. MANTENHA todas as informações verdadeiras do currículo original
        2. NÃO invente experiências, habilidades ou dados pessoais
        3. Reorganize experiências por relevância para a vaga (mais relevante primeiro)
        4. Incorpore palavras-chave da vaga nas descrições das experiências
        5. Destaque habilidades que coincidem com os requisitos da vaga
        6. Crie um resumo profissional que conecte o perfil do candidato à vaga
        7. Mantenha datas, nomes de empresas e cargos exatamente como no original
        8. Otimize descrições para incluir termos que sistemas ATS procuram

        Retorne um JSON válido neste formato:
        {
          "name": "Nome real extraído do currículo",
          "position": "Cargo otimizado baseado no perfil e na vaga",
          "area": "Área de atuação do profissional",
          "email": "Email real do currículo",
          "phone": "Telefone real do currículo",
          "linkedin": "LinkedIn real do currículo",
          "location": "Localização real do currículo",
          "summary": "Resumo profissional de 3-4 linhas conectando o perfil do candidato à vaga, usando palavras-chave relevantes",
          "skills": {
            "programming": ["linguagens de programação mencionadas no currículo"],
            "frameworks": ["frameworks e bibliotecas do currículo"],
            "databases": ["bancos de dados mencionados"],
            "tools": ["ferramentas e softwares do currículo"],
            "methodologies": ["metodologias e práticas mencionadas"],
            "languages": ["idiomas que o candidato fala"]
          },
          "experience": [
            {
              "company": "Nome real da empresa",
              "position": "Cargo real ocupado",
              "period": "Período real de trabalho",
              "location": "Local real",
              "achievements": ["Atividades reais otimizadas com palavras-chave da vaga"]
            }
          ],
          "education": [
            {
              "institution": "Instituição real",
              "degree": "Grau/tipo de formação real",
              "course": "Nome do curso real",
              "year": "Ano real de conclusão",
              "location": "Local real da instituição",
              "projects": ["Projetos acadêmicos mencionados"]
            }
          ],
          "certifications": [
            {
              "name": "Nome da certificação real",
              "institution": "Instituição que emitiu",
              "year": "Ano de obtenção"
            }
          ],
          "projects": [
            {
              "name": "Nome real do projeto",
              "technologies": ["Tecnologias reais utilizadas"],
              "description": "Descrição real otimizada com palavras-chave",
              "achievements": ["Resultados reais alcançados"],
              "link": "Link real se mencionado"
            }
          ],
          "achievements": ["Conquistas e premiações reais mencionadas"],
          "activities": ["Atividades extracurriculares reais"],
          "keywords": ["Lista de palavras-chave da vaga para otimização ATS"]
        }

        REGRAS FUNDAMENTAIS:
        - Use SOMENTE informações que existem no currículo original
        - NÃO crie dados fictícios
        - Se alguma informação não existir no currículo, use valores padrão ou deixe arrays vazios
        - Foque na reorganização e otimização do conteúdo existente
        - Priorize clareza e relevância para a vaga específica
      `;

      const optimizedResponse = await this.callGroq(optimizationPrompt, 4000);
      
      try {
        const jsonMatch = optimizedResponse.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : optimizedResponse;
        const optimizedCV = JSON.parse(jsonString);
        
        // Garantir estrutura mínima com fallbacks seguros
        return {
          name: optimizedCV.name || "Nome não encontrado no currículo",
          position: optimizedCV.position || jobAnalysis.position || "Profissional",
          area: optimizedCV.area || "Área de atuação",
          email: optimizedCV.email || "email@exemplo.com",
          phone: optimizedCV.phone || "(00) 00000-0000",
          linkedin: optimizedCV.linkedin || "linkedin.com/in/perfil",
          location: optimizedCV.location || "Localização",
          summary: optimizedCV.summary || "Profissional com experiência relevante para a posição.",
          skills: {
            programming: Array.isArray(optimizedCV.skills?.programming) ? optimizedCV.skills.programming : [],
            frameworks: Array.isArray(optimizedCV.skills?.frameworks) ? optimizedCV.skills.frameworks : [],
            databases: Array.isArray(optimizedCV.skills?.databases) ? optimizedCV.skills.databases : [],
            tools: Array.isArray(optimizedCV.skills?.tools) ? optimizedCV.skills.tools : [],
            methodologies: Array.isArray(optimizedCV.skills?.methodologies) ? optimizedCV.skills.methodologies : [],
            languages: Array.isArray(optimizedCV.skills?.languages) ? optimizedCV.skills.languages : ["Português"]
          },
          experience: Array.isArray(optimizedCV.experience) ? optimizedCV.experience : [],
          education: Array.isArray(optimizedCV.education) ? optimizedCV.education : [],
          certifications: Array.isArray(optimizedCV.certifications) ? optimizedCV.certifications : [],
          projects: Array.isArray(optimizedCV.projects) ? optimizedCV.projects : [],
          achievements: Array.isArray(optimizedCV.achievements) ? optimizedCV.achievements : [],
          activities: Array.isArray(optimizedCV.activities) ? optimizedCV.activities : [],
          keywords: Array.isArray(optimizedCV.keywords) ? optimizedCV.keywords : jobAnalysis.keywords
        };
      } catch (error) {
        console.error('Erro ao processar resposta da IA:', error);
        console.log('Resposta original:', optimizedResponse);
        throw new Error('Erro ao processar otimização. Tente novamente com um currículo mais claro.');
      }
    } catch (error) {
      console.error('Erro na otimização:', error);
      throw error;
    }
  }

  static async testConnection(): Promise<string> {
    try {
      const response = await this.callGroq('Responda apenas: "Conexão funcionando!"', 50);
      return response;
    } catch (error) {
      throw error;
    }
  }
}