import React, { useState } from 'react';
import { Briefcase, Sparkles } from 'lucide-react';

interface JobDescriptionSectionProps {
  onJobDescriptionSubmit: (description: string) => void;
}

export const JobDescriptionSection: React.FC<JobDescriptionSectionProps> = ({
  onJobDescriptionSubmit
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setIsSubmitting(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onJobDescriptionSubmit(jobDescription);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-800 to-black bg-clip-text text-transparent mb-4">
          Descreva a Vaga dos Seus Sonhos
        </h2>
        <p className="text-xl text-gray-600 dark:text-purple-300">
          Cole a descrição da vaga ou conte-nos sobre a posição ideal
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute top-4 left-4 z-10">
            <Briefcase className="w-6 h-6 text-purple-500" />
          </div>
          
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Cole aqui a descrição da vaga ou descreva a posição que você busca. Inclua requisitos, responsabilidades e qualquer informação relevante..."
            className="w-full h-64 pl-14 pr-4 py-4 text-lg border-2 border-purple-200 dark:border-purple-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 resize-none bg-white dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-purple-300"
            required
          />
          
          <div className="absolute bottom-4 right-4 text-sm text-purple-400">
            {jobDescription.length} caracteres
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!jobDescription.trim() || isSubmitting}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-48"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Processando...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                Otimizar Currículo
              </>
            )}
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </button>
        </div>
      </form>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-black/20 rounded-2xl">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Análise Inteligente</h3>
          <p className="text-sm text-gray-600 dark:text-purple-300">
            Nossa IA analisa a vaga e identifica palavras-chave importantes
          </p>
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-black/10 dark:from-purple-900/20 dark:to-black/30 rounded-2xl">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Otimização ATS</h3>
          <p className="text-sm text-gray-600 dark:text-purple-300">
            Formata seu currículo para passar pelos sistemas de triagem
          </p>
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-black/10 to-purple-100 dark:from-black/30 dark:to-purple-900/20 rounded-2xl">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personalização</h3>
          <p className="text-sm text-gray-600 dark:text-purple-300">
            Adapta seu perfil para se destacar na vaga específica
          </p>
        </div>
      </div>
    </div>
  );
};