import jsPDF from 'jspdf';
import { CVData } from '../types';

export class PDFGenerator {
  static async generatePDF(cvData: CVData): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 6;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: string = '#000000') => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setTextColor(color);
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      
      // Check if we need a new page
      if (yPosition + (lines.length * lineHeight) > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * lineHeight + 2;
    };

    const addSection = (title: string, content: string[] | string) => {
      // Add some space before section
      yPosition += 4;
      
      // Section title
      addText(title, 12, true, '#6B46C1');
      
      // Section content
      if (Array.isArray(content)) {
        content.forEach(item => {
          addText(`• ${item}`, 9);
        });
      } else {
        addText(content, 9);
      }
    };

    // Header
    addText(cvData.name, 18, true, '#6B46C1');
    addText(`${cvData.position} | ${cvData.area}`, 12, false, '#374151');
    
    // Contact info
    const contactInfo = [
      `📧 ${cvData.email}`,
      `📱 ${cvData.phone}`,
      `🌐 LinkedIn: ${cvData.linkedin}`,
      `📍 ${cvData.location}`
    ].join(' | ');
    addText(contactInfo, 9, false, '#6B7280');
    
    // Add separator line
    yPosition += 5;
    pdf.setDrawColor(107, 70, 193); // Purple color
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Professional Summary
    addSection('RESUMO PROFISSIONAL', cvData.summary);

    // Technical Skills
    const skillsText = [
      `Linguagens de Programação: ${cvData.skills.programming.join(', ')}`,
      `Frameworks: ${cvData.skills.frameworks.join(', ')}`,
      `Bancos de Dados: ${cvData.skills.databases.join(', ')}`,
      `Ferramentas: ${cvData.skills.tools.join(', ')}`,
      `Metodologias: ${cvData.skills.methodologies.join(', ')}`,
      `Idiomas: ${cvData.skills.languages.join(', ')}`
    ];
    addSection('COMPETÊNCIAS TÉCNICAS', skillsText);

    // Professional Experience
    addText('EXPERIÊNCIA PROFISSIONAL', 12, true, '#6B46C1');
    cvData.experience.forEach(exp => {
      addText(`${exp.company} | ${exp.position}`, 10, true);
      addText(`${exp.period} | ${exp.location}`, 9, false, '#6B7280');
      exp.achievements.forEach(achievement => {
        addText(`• ${achievement}`, 9);
      });
      yPosition += 3;
    });

    // Education
    addText('FORMAÇÃO ACADÊMICA', 12, true, '#6B46C1');
    cvData.education.forEach(edu => {
      addText(edu.institution, 10, true);
      addText(`${edu.degree} em ${edu.course} | ${edu.year}`, 9);
      addText(edu.location, 9, false, '#6B7280');
      if (edu.projects && edu.projects.length > 0) {
        addText('Projetos Relevantes:', 9, true);
        edu.projects.forEach(project => {
          addText(`• ${project}`, 9);
        });
      }
      yPosition += 3;
    });

    // Certifications
    if (cvData.certifications && cvData.certifications.length > 0) {
      const certText = cvData.certifications.map(cert => 
        `${cert.name} - ${cert.institution} (${cert.year})`
      );
      addSection('CERTIFICAÇÕES', certText);
    }

    // Projects
    addText('PROJETOS DESTACADOS', 12, true, '#6B46C1');
    cvData.projects.slice(0, 3).forEach(project => {
      addText(project.name, 10, true);
      addText(`Tecnologias: ${project.technologies.join(', ')}`, 9, false, '#6B46C1');
      addText(project.description, 9);
      if (project.achievements && project.achievements.length > 0) {
        project.achievements.forEach(achievement => {
          addText(`• ${achievement}`, 9);
        });
      }
      if (project.link) {
        addText(`Link: ${project.link}`, 9, false, '#6B46C1');
      }
      yPosition += 3;
    });

    // Achievements
    if (cvData.achievements && cvData.achievements.length > 0) {
      addSection('CONQUISTAS E PREMIAÇÕES', cvData.achievements);
    }

    // Activities
    if (cvData.activities && cvData.activities.length > 0) {
      addSection('ATIVIDADES COMPLEMENTARES', cvData.activities);
    }

    // Keywords
    addSection('PALAVRAS-CHAVE RELEVANTES PARA ATS', cvData.keywords.join(', '));

    // Save the PDF
    const fileName = `${cvData.name.replace(/\s+/g, '_')}_CV_Otimizado.pdf`;
    pdf.save(fileName);
  }
}