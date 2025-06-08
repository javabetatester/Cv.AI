import React, { useEffect, useState } from 'react';
import { Brain, Zap, Target, CheckCircle } from 'lucide-react';

interface ProcessingSectionProps {
  onComplete: () => void;
}

export const ProcessingSection: React.FC<ProcessingSectionProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: Brain,
      title: 'Analisando seu CV',
      description: 'Extraindo informações e experiências relevantes',
      duration: 2000
    },
    {
      icon: Target,
      title: 'Processando vaga',
      description: 'Identificando palavras-chave e requisitos importantes',
      duration: 1500
    },
    {
      icon: Zap,
      title: 'Otimizando conteúdo',
      description: 'Adaptando seu perfil para a vaga específica',
      duration: 2500
    },
    {
      icon: CheckCircle,
      title: 'Finalizando',
      description: 'Preparando seu novo currículo otimizado',
      duration: 1000
    }
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Update current step based on progress
      let cumulativeDuration = 0;
      for (let i = 0; i < steps.length; i++) {
        cumulativeDuration += steps[i].duration;
        if (elapsed <= cumulativeDuration) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <div className="mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-800 to-black bg-clip-text text-transparent mb-4">
          IA Trabalhando na Sua Otimização
        </h2>
        <p className="text-xl text-gray-600 dark:text-purple-300">
          Aguarde enquanto nossa inteligência artificial cria seu currículo perfeito
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-purple-800 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-lg font-semibold text-gray-700 dark:text-purple-300">
          {Math.round(progress)}% concluído
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div
              key={index}
              className={`flex items-center p-6 rounded-2xl transition-all duration-500 transform ${
                isActive
                  ? 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-black/30 scale-105 shadow-lg'
                  : isCompleted
                  ? 'bg-purple-50 dark:bg-purple-900/20'
                  : 'bg-gray-50 dark:bg-gray-800/50'
              }`}
            >
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full mr-6 transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-purple-800 animate-pulse'
                    : isCompleted
                    ? 'bg-purple-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <Icon
                  className={`w-8 h-8 ${
                    isActive || isCompleted ? 'text-white' : 'text-gray-500'
                  }`}
                />
              </div>
              
              <div className="text-left flex-1">
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isActive
                      ? 'text-purple-700 dark:text-purple-300'
                      : isCompleted
                      ? 'text-purple-700 dark:text-purple-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`${
                    isActive
                      ? 'text-gray-700 dark:text-purple-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.description}
                </p>
              </div>
              
              {isCompleted && (
                <CheckCircle className="w-8 h-8 text-purple-500 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-800 rounded-full animate-bounce opacity-20`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};