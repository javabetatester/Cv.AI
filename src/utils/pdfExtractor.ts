// src/utils/pdfExtractor.ts
import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker do PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

export class PDFExtractor {
  static async extractTextFromPDF(file: File): Promise<string> {
    try {
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
      
      return fullText.trim();
    } catch (error) {
      console.error('Erro ao extrair texto do PDF:', error);
      throw new Error('Falha ao processar arquivo PDF. Verifique se o arquivo está correto.');
    }
  }

  static async extractStructuredData(file: File): Promise<{
    text: string;
    sections: {
      personalInfo: string;
      experience: string;
      education: string;
      skills: string;
      projects: string;
    };
  }> {
    const fullText = await this.extractTextFromPDF(file);
    
    // Usar regex para identificar seções comuns
    const sections = {
      personalInfo: this.extractPersonalInfo(fullText),
      experience: this.extractSection(fullText, ['experiência', 'experience', 'trabalho', 'emprego']),
      education: this.extractSection(fullText, ['educação', 'education', 'formação', 'acadêmica']),
      skills: this.extractSection(fullText, ['habilidades', 'skills', 'competências', 'tecnologias']),
      projects: this.extractSection(fullText, ['projetos', 'projects', 'portfolio'])
    };
    
    return {
      text: fullText,
      sections
    };
  }

  private static extractPersonalInfo(text: string): string {
    const lines = text.split('\n').slice(0, 10); // Primeiras 10 linhas geralmente contêm info pessoal
    
    // Buscar por email, telefone, LinkedIn, etc.
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /\(?(\d{2})\)?\s*\d{4,5}-?\d{4}/g;
    const linkedinRegex = /(linkedin\.com\/in\/[a-zA-Z0-9-]+)/gi;
    
    const emails = text.match(emailRegex) || [];
    const phones = text.match(phoneRegex) || [];
    const linkedins = text.match(linkedinRegex) || [];
    
    let personalInfo = lines.join(' ');
    
    if (emails.length > 0) personalInfo += ` | Email: ${emails[0]}`;
    if (phones.length > 0) personalInfo += ` | Telefone: ${phones[0]}`;
    if (linkedins.length > 0) personalInfo += ` | LinkedIn: ${linkedins[0]}`;
    
    return personalInfo;
  }

  private static extractSection(text: string, keywords: string[]): string {
    const lines = text.split('\n');
    let sectionStart = -1;
    let sectionEnd = lines.length;
    
    // Encontrar início da seção
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (keywords.some(keyword => line.includes(keyword))) {
        sectionStart = i;
        break;
      }
    }
    
    if (sectionStart === -1) return '';
    
    // Encontrar fim da seção (próxima seção ou final)
    const commonSections = [
      'experiência', 'experience', 'educação', 'education', 'formação',
      'habilidades', 'skills', 'competências', 'projetos', 'projects',
      'certificações', 'certifications', 'conquistas', 'achievements'
    ];
    
    for (let i = sectionStart + 1; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (line.length > 0 && commonSections.some(section => 
        line.startsWith(section) && !keywords.includes(section)
      )) {
        sectionEnd = i;
        break;
      }
    }
    
    return lines.slice(sectionStart, sectionEnd).join('\n').trim();
  }
}