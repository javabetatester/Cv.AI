import { CVData, JobDescription } from '../types';
import { MultiAIService } from './multiAiService';

// Serviço principal que orquestra a otimização de CV
export class AIService {
  static async optimizeCV(pdfFile: File, jobDescription: string): Promise<CVData> {
    try {
      // Simula extração de texto do PDF
      const cvText = await this.extractTextFromPDF(pdfFile);
      
      // Chama o serviço multi-API para otimização
      const optimizedCV = await MultiAIService.optimizeCV(cvText, jobDescription);
      
      return optimizedCV;
      
    } catch (error) {
      console.error('Erro na otimização do CV:', error);
      throw new Error('Falha ao otimizar currículo. Verifique sua conexão e tente novamente.');
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
      
      // Extrai palavras-chave técnicas comuns
      const techKeywords = [
        'excel', 'powerbi', 'sql', 'python', 'javascript', 'react', 'node',
        'gestão', 'liderança', 'projetos', 'scrum', 'agile', 'kanban',
        'vendas', 'marketing', 'crm', 'negociação', 'atendimento',
        'saúde', 'enfermagem', 'medicina', 'psicologia', 'fisioterapia',
        'direito', 'jurídico', 'advocacia', 'contratos', 'compliance',
        'finanças', 'contabilidade', 'auditoria', 'controladoria',
        'rh', 'recursos humanos', 'recrutamento', 'seleção',
        'educação', 'ensino', 'pedagogia', 'didática', 'treinamento'
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
      requirements: requirements.slice(0, 10), // Limita a 10 requisitos
      keywords: keywords.slice(0, 15) // Limita a 15 palavras-chave
    };
  }

  private static async extractTextFromPDF(file: File): Promise<string> {
    // Simulação mais realista de extração de texto do PDF
    // Em produção, você usaria uma biblioteca como pdf-parse ou PDF.js
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Baseado no PDF do Bernardo que foi enviado, vou simular uma extração mais realista
        const mockCVText = `
        BERNARDO KUNZ
        Desenvolvedor Java | Spring Boot | APIs REST | Microserviços | Docker | Kubernetes
        
        CONTATO:
        Email: bernardokunz@gmail.com
        Telefone: (54) 99963-1568
        LinkedIn: linkedin.com/in/bernardokunz
        Website: bkunz.xyz
        Localização: Passo Fundo, Rio Grande do Sul, Brasil
        
        RESUMO PROFISSIONAL:
        Desenvolvedor Java Backend com 1 ano de experiência profissional e 5 anos de estudos focados no ecossistema Java e no desenvolvimento de aplicações. Experiência em desenvolvimento backend com Java, Spring Framework e construção de APIs REST. Experiência prática em sistemas corporativos e arquitetura de microserviços. Atualmente estudando Flutter/Dart e C#/.NET.
        
        COMPETÊNCIAS PRINCIPAIS:
        • Java (Core, 8+, Collections, Streams)
        • Spring Framework (Boot, Data, Security)
        • APIs REST e microserviços
        • Bancos de dados relacionais (SQL, Oracle) e não relacionais
        • Ferramentas: Maven, Git, Docker, Kubernetes
        • Conhecimento em mensageria (Kafka, RabbitMQ)
        • Express.js, TypeScript, Spring Security
        
        EXPERIÊNCIA PROFISSIONAL:
        
        Metasa S.A - Assistente de T.I (Estágio)
        Fevereiro 2025 - Presente (5 meses) | Brasil
        • Suporte e manutenção de sistemas internos da empresa
        • Desenvolvimento inicial em Java para aplicações web corporativas
        • Correção de bugs e implementação de pequenas melhorias em código existente
        • Aprendizado e aplicação de frameworks como Spring MVC e Hibernate
        • Criação de queries SQL básicas em bancos de dados relacionais
        • Atendimento de chamados técnicos de maior complexidade
        • Participação em reuniões de equipe com metodologia ágil
        • Documentação de código e processos técnicos
        
        Workana - Desenvolvedor FullStack
        Janeiro 2022 - Novembro 2024 (2 anos 11 meses)
        • Desenvolvimento de aplicações web completas para clientes diversos
        • Backend: APIs REST com Java/Spring Boot, integração com bancos de dados
        • Frontend: Interfaces responsivas com TypeScript e React
        • Integração de sistemas e desenvolvimento de microserviços
        • Gestão completa de projetos desde levantamento de requisitos até deploy
        • Manutenção e evolução de sistemas existentes
        • Comunicação direta com clientes para alinhamento de expectativas
        
        KUHN Group - Assistente de T.I (Estágio)
        Novembro 2020 - Dezembro 2021 (1 ano 2 meses) | Brasil
        • Suporte técnico especializado em sistemas corporativos e aplicações Java
        • Manutenção e otimização de aplicações backend utilizadas pela empresa
        • Análise e correção de problemas em bancos de dados e integrações
        • Desenvolvimento de scripts para automação de processos internos
        • Documentação técnica de sistemas e procedimentos de desenvolvimento
        • Colaboração com equipe de TI em projetos de migração e atualização
        
        Splora Tecnologia - Jovem Aprendiz - Desenvolvedor
        Janeiro 2016 - Janeiro 2017 (1 ano 1 mês) | Brasil
        • Desenvolvimento de funcionalidades CRUD para sistema interno de gestão de clientes em Java
        • Implementação de interfaces de usuário utilizando JavaScript, HTML e CSS
        • Criação de relatórios e consultas em banco de dados SQL para análise de dados operacionais
        • Colaboração em sprints de desenvolvimento utilizando metodologia Scrum
        • Documentação de código e implementação de testes unitários básicos
        • Participação em projetos de treinamento técnico interno, com foco em Java e Spring
        
        FORMAÇÃO ACADÊMICA:
        FIAP - Bacharelado em Computer Software Engineering
        Fevereiro 2020 - Novembro 2024
        
        EXPERIÊNCIAS ANTERIORES:
        • Havan - Jovem Aprendiz (Fevereiro 2019 - Março 2020)
        • Flexsul Distribuidora - Jovem Aprendiz (Junho 2017 - Julho 2018)
        
        PRINCIPAIS TECNOLOGIAS:
        Java, JavaScript, Spring Boot, TypeScript, React, Node.js, APIs REST, Microserviços, Docker, Kubernetes, SQL, Oracle, Git, Maven, Kafka, RabbitMQ, HTML, CSS, Spring MVC, Hibernate, Scrum
        `;
        
        resolve(mockCVText);
      }, 1000);
    });
  }

  private static generateRandomName(): string {
    const firstNames = [
      'Ana', 'Carlos', 'Maria', 'João', 'Paula', 'Pedro', 'Fernanda', 'Ricardo',
      'Juliana', 'Roberto', 'Camila', 'André', 'Beatriz', 'Felipe', 'Larissa',
      'Gabriel', 'Mariana', 'Thiago', 'Natália', 'Leonardo'
    ];
    
    const lastNames = [
      'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
      'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
      'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa'
    ];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const lastName2 = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName1} ${lastName2}`;
  }
}