import { CVData, JobDescription } from '../types';

// Mock AI service - In production, this would call your actual AI API
export class AIService {
  static async optimizeCV(pdfFile: File, jobDescription: string): Promise<CVData> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Mock optimized CV data based on job description
    const mockCVData: CVData = {
      name: "JOÃO SILVA SANTOS",
      position: "Desenvolvedor Full Stack Senior",
      area: "Tecnologia da Informação",
      email: "joao.silva@email.com",
      phone: "(11) 99999-8888",
      linkedin: "linkedin.com/in/joaosilva",
      location: "São Paulo, SP",
      summary: "Profissional com 8 anos de experiência em desenvolvimento full stack, especializado em JavaScript, Python e React. Expertise em arquitetura de microsserviços, desenvolvimento ágil e DevOps com histórico comprovado de liderar equipes técnicas e entregar soluções escaláveis que aumentaram a eficiência operacional em 40%. Busco oportunidade como Desenvolvedor Full Stack Senior para aplicar conhecimentos em cloud computing, machine learning e arquitetura distribuída, contribuindo para a inovação e crescimento da organização.",
      skills: {
        programming: ["JavaScript", "Python", "TypeScript", "Java", "SQL", "HTML5", "CSS3"],
        frameworks: ["React.js", "Node.js", "Next.js", "Django", "Express.js", "Spring Boot", "Angular"],
        databases: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Oracle", "DynamoDB"],
        tools: ["Git", "Docker", "Kubernetes", "Jenkins", "AWS", "Azure", "Terraform", "Jira"],
        methodologies: ["Scrum", "Kanban", "DevOps", "TDD", "CI/CD", "Microservices", "Clean Architecture"],
        languages: ["Português (nativo)", "Inglês (fluente)", "Espanhol (intermediário)"]
      },
      experience: [
        {
          company: "TechCorp Solutions",
          position: "Desenvolvedor Full Stack Senior",
          period: "Jan/2021 - Atual",
          location: "São Paulo, SP",
          achievements: [
            "Desenvolveu e implementou arquitetura de microsserviços utilizando Node.js e Docker, resultando em aumento de 45% na escalabilidade do sistema",
            "Liderou equipe de 6 desenvolvedores no desenvolvimento de plataforma e-commerce, entregando solução que processou R$ 2M em vendas mensais",
            "Otimizou queries de banco de dados PostgreSQL, reduzindo tempo de resposta em 60% e melhorando experiência do usuário",
            "Colaborou com equipes de UX/UI e DevOps para implementar CI/CD pipeline, alcançando 99.8% de uptime",
            "Implementou práticas de Clean Code e TDD, melhorando cobertura de testes em 80% e reduzindo bugs em produção"
          ]
        },
        {
          company: "StartupTech Innovations",
          position: "Desenvolvedor Full Stack Pleno",
          period: "Mar/2018 - Dez/2020",
          location: "São Paulo, SP",
          achievements: [
            "Responsável pelo desenvolvimento de SaaS em React e Python, atendendo 10.000+ usuários ativos mensais",
            "Realizou migração de monolito para microsserviços, melhorando performance em 35% e facilitando manutenção",
            "Executou integração com APIs terceiras (Stripe, PayPal) para processamento de pagamentos",
            "Participou de code reviews e mentoria de desenvolvedores júnior, contribuindo para crescimento técnico da equipe",
            "Documentou APIs RESTful e implementou sistema de logs distribuídos, melhorando debugging e monitoramento"
          ]
        }
      ],
      education: [
        {
          institution: "UNIVERSIDADE DE SÃO PAULO (USP)",
          degree: "Bacharelado",
          course: "Ciência da Computação",
          year: "2017",
          location: "São Paulo, SP",
          projects: [
            "Sistema de Gestão Acadêmica: Desenvolveu aplicação web completa utilizando React e Node.js",
            "Algoritmo de Machine Learning: Criou modelo de recomendação com Python e TensorFlow"
          ]
        }
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          institution: "Amazon Web Services",
          year: "2023"
        },
        {
          name: "Professional Scrum Master I",
          institution: "Scrum.org",
          year: "2022"
        },
        {
          name: "Google Cloud Professional Developer",
          institution: "Google Cloud",
          year: "2021"
        }
      ],
      projects: [
        {
          name: "EcoTracker - Sustentabilidade Corporativa",
          technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
          description: "Desenvolveu plataforma SaaS para tracking de pegada de carbono empresarial para 50+ empresas",
          achievements: [
            "Implementou dashboard em tempo real com D3.js resultando em 90% de engajamento dos usuários",
            "Integrou com APIs de terceiros para coleta automatizada de dados ambientais"
          ],
          link: "github.com/joaosilva/ecotracker"
        },
        {
          name: "FinanceAI - Assistente Financeiro Inteligente",
          technologies: ["Python", "TensorFlow", "React", "MongoDB", "Azure"],
          description: "Criou chatbot com IA para consultoria financeira pessoal utilizando processamento de linguagem natural",
          achievements: [
            "Alcançou 85% de precisão nas recomendações através de algoritmos de machine learning",
            "Processou 1M+ transações financeiras com análise preditiva em tempo real"
          ]
        }
      ],
      achievements: [
        "2023 - Prêmio Inovação Tecnológica - TechCorp Solutions",
        "2022 - Desenvolvedor Destaque do Ano com projeto que gerou economia de R$ 500K",
        "2021 - Palestrante no DevConf Brasil sobre 'Microsserviços na Prática'"
      ],
      activities: [
        "Voluntariado: Programador Voluntário - ONG Tech4Good - Desenvolvimento de soluções para ONGs (2020-Atual)",
        "Publicações: 'Clean Architecture em Node.js' - Medium (15K+ visualizações) (2023)",
        "Palestras: 'DevOps Culture' - São Paulo Tech Meetup (2022)"
      ],
      keywords: [
        "Desenvolvimento Full Stack", "JavaScript", "React", "Node.js", "Python", "AWS", "Docker", 
        "Microsserviços", "DevOps", "Scrum", "PostgreSQL", "MongoDB", "CI/CD", "TDD", "Clean Code",
        "Arquitetura de Software", "Machine Learning", "APIs REST", "Cloud Computing", "Liderança Técnica",
        "Mentoria", "Inovação", "Startup", "E-commerce", "SaaS", "Performance", "Escalabilidade"
      ]
    };

    return mockCVData;
  }

  static async extractJobRequirements(jobDescription: string): Promise<JobDescription> {
    // Mock job analysis
    return {
      title: "Desenvolvedor Full Stack Senior",
      company: "Empresa XYZ",
      description: jobDescription,
      requirements: [
        "Experiência com React/Node.js",
        "Conhecimento em AWS",
        "Metodologias ágeis",
        "Inglês fluente"
      ],
      keywords: ["React", "Node.js", "AWS", "Scrum", "JavaScript", "Python"]
    };
  }
}