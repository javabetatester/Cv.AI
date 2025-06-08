import React from 'react';
import { Download, FileText, Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { CVData } from '../types';
import { useTypingEffect } from '../hooks/useTypingEffect';

interface CVSectionProps {
  cvData: CVData;
  onDownload: () => void;
}

const TypingText: React.FC<{ text: string; delay?: number; speed?: number; className?: string }> = ({ 
  text, 
  delay = 0, 
  speed = 30, 
  className = '' 
}) => {
  const { displayedText } = useTypingEffect(text, speed, delay);
  
  return (
    <span className={className}>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="animate-pulse text-purple-500">|</span>
      )}
    </span>
  );
};

export const CVSection: React.FC<CVSectionProps> = ({ cvData, onDownload }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-800 to-black bg-clip-text text-transparent mb-4">
          Seu Novo Currículo Otimizado
        </h2>
        <p className="text-xl text-gray-600 dark:text-purple-300 mb-6">
          Veja sua experiência sendo formatada em tempo real
        </p>
        
        <button
          onClick={onDownload}
          className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <Download className="w-6 h-6 mr-3" />
          Baixar Currículo PDF
        </button>
      </div>

      <div className="bg-white dark:bg-black/80 rounded-3xl shadow-2xl p-12 font-mono text-sm leading-relaxed max-h-96 overflow-y-auto border border-purple-200 dark:border-purple-800">
        {/* Header */}
        <div className="text-center border-b-2 border-purple-200 dark:border-purple-700 pb-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">
            <TypingText text={cvData.name} speed={50} />
          </h1>
          <p className="text-lg text-gray-600 dark:text-purple-300 mb-4">
            <TypingText text={`${cvData.position} | ${cvData.area}`} delay={1000} speed={40} />
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-purple-500" />
              <TypingText text={cvData.email} delay={2000} speed={25} />
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-purple-500" />
              <TypingText text={cvData.phone} delay={2500} speed={25} />
            </div>
            <div className="flex items-center">
              <Linkedin className="w-4 h-4 mr-2 text-purple-600" />
              <TypingText text={cvData.linkedin} delay={3000} speed={20} />
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-purple-500" />
              <TypingText text={cvData.location} delay={3500} speed={25} />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
            <TypingText text="RESUMO PROFISSIONAL" delay={4000} speed={60} />
          </h3>
          <p className="text-gray-700 dark:text-purple-200 leading-relaxed">
            <TypingText text={cvData.summary} delay={5000} speed={15} />
          </p>
        </section>

        {/* Technical Skills */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
            <TypingText text="COMPETÊNCIAS TÉCNICAS" delay={8000} speed={60} />
          </h3>
          <div className="space-y-2 text-gray-700 dark:text-purple-200">
            <p>
              <span className="font-semibold">Linguagens de Programação: </span>
              <TypingText text={cvData.skills.programming.join(', ')} delay={9000} speed={20} />
            </p>
            <p>
              <span className="font-semibold">Frameworks: </span>
              <TypingText text={cvData.skills.frameworks.join(', ')} delay={10000} speed={20} />
            </p>
            <p>
              <span className="font-semibold">Bancos de Dados: </span>
              <TypingText text={cvData.skills.databases.join(', ')} delay={11000} speed={20} />
            </p>
            <p>
              <span className="font-semibold">Ferramentas: </span>
              <TypingText text={cvData.skills.tools.join(', ')} delay={12000} speed={20} />
            </p>
            <p>
              <span className="font-semibold">Metodologias: </span>
              <TypingText text={cvData.skills.methodologies.join(', ')} delay={13000} speed={20} />
            </p>
            <p>
              <span className="font-semibold">Idiomas: </span>
              <TypingText text={cvData.skills.languages.join(', ')} delay={14000} speed={20} />
            </p>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
            <TypingText text="EXPERIÊNCIA PROFISSIONAL" delay={15000} speed={60} />
          </h3>
          {cvData.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="mb-2">
                <h4 className="font-bold text-gray-800 dark:text-white">
                  <TypingText text={`${exp.company} | ${exp.position}`} delay={16000 + index * 2000} speed={30} />
                </h4>
                <p className="text-gray-600 dark:text-purple-300 text-sm">
                  <TypingText text={`${exp.period} | ${exp.location}`} delay={16500 + index * 2000} speed={25} />
                </p>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-purple-200 ml-4">
                {exp.achievements.map((achievement, achIndex) => (
                  <li key={achIndex}>
                    <TypingText 
                      text={achievement} 
                      delay={17000 + index * 2000 + achIndex * 1000} 
                      speed={15} 
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
            <TypingText text="FORMAÇÃO ACADÊMICA" delay={22000} speed={60} />
          </h3>
          {cvData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-bold text-gray-800 dark:text-white">
                <TypingText text={edu.institution} delay={23000 + index * 1000} speed={30} />
              </h4>
              <p className="text-gray-600 dark:text-purple-300">
                <TypingText text={`${edu.degree} em ${edu.course} | ${edu.year}`} delay={23500 + index * 1000} speed={25} />
              </p>
              <p className="text-gray-600 dark:text-purple-300 text-sm">
                <TypingText text={edu.location} delay={24000 + index * 1000} speed={25} />
              </p>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
            <TypingText text="PROJETOS DESTACADOS" delay={25000} speed={60} />
          </h3>
          {cvData.projects.slice(0, 2).map((project, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-bold text-gray-800 dark:text-white">
                <TypingText text={project.name} delay={26000 + index * 1500} speed={30} />
              </h4>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">
                <span>Tecnologias: </span>
                <TypingText text={project.technologies.join(', ')} delay={26500 + index * 1500} speed={20} />
              </p>
              <p className="text-gray-700 dark:text-purple-200 text-sm">
                <TypingText text={project.description} delay={27000 + index * 1500} speed={15} />
              </p>
            </div>
          ))}
        </section>

        {/* Keywords */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
            <TypingText text="PALAVRAS-CHAVE RELEVANTES PARA ATS:" delay={30000} speed={60} />
          </h3>
          <p className="text-gray-600 dark:text-purple-300 text-sm">
            <TypingText text={cvData.keywords.join(', ')} delay={31000} speed={10} />
          </p>
        </section>
      </div>
    </div>
  );
};