// src/services/aiService.ts
import { CVData, JobDescription } from '../types';
import { MultiAIService } from './multiAiService';

// Serviço principal que orquestra a otimização de CV
export class AIService {
  static async optimizeCV(pdfFile: File, jobDescription: string): Promise<CVData> {
    try {
      console.log('🚀 Iniciando extração de texto do PDF...');
      
      // Extrai texto real do PDF
      const cvText = await this.extractTextFromPDF(pdfFile);
      
      console.log('📄 Texto extraído, enviando para IA...');
      
      // Chama o serviço multi-API para otimização
      const optimizedCV = await MultiAIService.optimizeCV(cvText, jobDescription);
      
      console.log('✅ CV otimizado com sucesso!');
      return optimizedCV;
      
    } catch (error) {
      console.error('❌ Erro na otimização do CV:', error);
      throw error; // Propaga o erro real sem fallback
    }
  }

  static async extractJobRequirements(jobDescription: string): Promise<JobDescription> {
    // Análise básica da descrição da vaga
    const lines = jobDescription.toLowerCase().split('\n');
    const requirements: string[] = [];
    const keywords: string[] = [];
    
    let title = "Posição Profissional";
    let company = "Empresa";
    
    // Extrai título da vaga
    const titleMatches = jobDescription.match(/(?:vaga|cargo|posição|oportunidade)[\s:]*(.+?)(?:\n|$)/i);
    if (titleMatches) {
      title = titleMatches[1].trim();
    }
    
    // Extrai nome da empresa
    const companyMatches = jobDescription.match(/(?:empresa|companhia|organização)[\s:]*(.+?)(?:\n|$)/i);
    if (companyMatches) {
      company = companyMatches[1].trim();
    }
    
    // Identifica requisitos comuns
    lines.forEach(line => {
      if (line.includes('requisito') || line.includes('experiência') || line.includes('conhecimento')) {
        requirements.push(line.trim());
      }
      
      // Extrai palavras-chave técnicas comuns (universais)
      const techKeywords = [
        // Programação e Desenvolvimento
        'excel', 'powerbi', 'sql', 'python', 'javascript', 'react', 'node', 'java', 'c#', '.net',
        'html', 'css', 'typescript', 'angular', 'vue', 'php', 'ruby', 'go', 'swift', 'kotlin',
        
        // Gestão e Negócios
        'gestão', 'liderança', 'projetos', 'scrum', 'agile', 'kanban', 'pmp', 'lean', 'six sigma',
        'vendas', 'marketing', 'crm', 'negociação', 'atendimento', 'relacionamento',
        
        // Áreas Específicas
        'saúde', 'enfermagem', 'medicina', 'psicologia', 'fisioterapia', 'farmácia',
        'direito', 'jurídico', 'advocacia', 'contratos', 'compliance', 'tributário',
        'finanças', 'contabilidade', 'auditoria', 'controladoria', 'fiscal',
        'rh', 'recursos humanos', 'recrutamento', 'seleção', 'treinamento',
        'educação', 'ensino', 'pedagogia', 'didática', 'coordenação',
        'engenharia', 'civil', 'mecânica', 'elétrica', 'produção', 'qualidade',
        
        // Tecnologias Emergentes
        'ia', 'inteligência artificial', 'machine learning', 'ai', 'deep learning',
        'low code', 'no code', 'automação', 'rpa', 'chatbot',
        'apis', 'rest', 'microserviços', 'webhooks', 'scraping', 'integrações',
        'cloud', 'aws', 'azure', 'google cloud', 'docker', 'kubernetes',
        'saas', 'devops', 'ci/cd', 'git', 'github', 'gitlab',
        
        // Dados e Analytics
        'dados', 'analytics', 'bi', 'business intelligence', 'tableau', 'qlik',
        'big data', 'hadoop', 'spark', 'elasticsearch', 'mongodb', 'postgresql',
        'mysql', 'oracle', 'redis', 'nosql'
      ];
      
      techKeywords.forEach(keyword => {
        if (line.includes(keyword) && !keywords.includes(keyword)) {
          keywords.push(keyword);
        }
      });
    });
    
    return {
      title,
      company,
      description: jobDescription,
      requirements: requirements.slice(0, 15),
      keywords: keywords.slice(0, 20)
    };
  }

  private static async extractTextFromPDF(file: File): Promise<string> {
    // Tentar usar PDF.js para extração real
    try {
      // Importação dinâmica do PDF.js
      const pdfjsLib = await import('pdfjs-dist');
      
      // Configurar worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extrair texto de todas as páginas
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
      }
      
      if (!fullText.trim()) {
        throw new Error('Não foi possível extrair texto do PDF');
      }
      
      console.log('✅ Texto extraído com sucesso do PDF');
      return fullText.trim();
      
    } catch (error) {
      console.error('❌ Erro na extração do PDF:', error);
      throw new Error(`Falha ao extrair texto do PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}