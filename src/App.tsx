import React, { useState } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { UploadSection } from './components/UploadSection';
import { JobDescriptionSection } from './components/JobDescriptionSection';
import { ProcessingSection } from './components/ProcessingSection';
import { CVSection } from './components/CVSection';
import { AIService } from './services/aiService';
import { PDFGenerator } from './utils/pdfGenerator';
import { Step, UploadedFile, CVData } from './types';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [darkMode, setDarkMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (file: File) => {
    const uploadedFile: UploadedFile = {
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    };
    setUploadedFile(uploadedFile);
    setError(''); // Limpa erros anteriores
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError('');
  };

  const handleNextStep = () => {
    if (currentStep === 'upload' && uploadedFile) {
      setCurrentStep('job-description');
    }
  };

  const handleJobDescriptionSubmit = async (description: string) => {
    setJobDescription(description);
    setCurrentStep('processing');
  };

  const handleProcessingComplete = async () => {
    if (!uploadedFile) {
      setError('Arquivo não encontrado. Por favor, faça upload novamente.');
      setCurrentStep('upload');
      return;
    }

    try {
      console.log('🚀 Iniciando otimização do CV...');
      setError('');
      
      const optimizedCV = await AIService.optimizeCV(uploadedFile.file, jobDescription);
      
      setCvData(optimizedCV);
      setCurrentStep('result');
      console.log('✅ CV otimizado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(`Falha na otimização: ${errorMessage}`);
      
      // Volta para a etapa anterior
      setCurrentStep('job-description');
    }
  };

  const handleDownload = () => {
    if (cvData) {
      PDFGenerator.generatePDF(cvData);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setJobDescription('');
    setCvData(null);
    setError('');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-black' : 'bg-gradient-to-br from-purple-50 via-black/5 to-purple-100'
    }`}>
      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-purple-200 dark:border-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  CV Optimizer AI
                </h1>
                <p className="text-sm text-gray-500 dark:text-purple-300">
                  Powered by Artificial Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-purple-600" />
                ) : (
                  <Moon className="w-5 h-5 text-purple-700" />
                )}
              </button>

              {currentStep !== 'upload' && (
                <button
                  onClick={handleStartOver}
                  className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 transition-colors duration-200"
                >
                  Começar Novamente
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Erro no Processamento
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[
              { key: 'upload', label: 'Upload' },
              { key: 'job-description', label: 'Vaga' },
              { key: 'processing', label: 'Processando' },
              { key: 'result', label: 'Resultado' }
            ].map((step, index) => {
              const isActive = currentStep === step.key;
              const isCompleted = ['upload', 'job-description', 'processing', 'result'].indexOf(currentStep) > index;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white scale-110'
                        : isCompleted
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isActive
                        ? 'text-purple-600 dark:text-purple-400'
                        : isCompleted
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {index < 3 && (
                    <div
                      className={`w-12 h-0.5 mx-4 transition-colors duration-300 ${
                        isCompleted ? 'bg-purple-400' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="transition-all duration-500 transform">
          {currentStep === 'upload' && (
            <div className="space-y-8">
              <UploadSection
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFile}
                onRemoveFile={handleRemoveFile}
              />
              
              {uploadedFile && (
                <div className="flex justify-center">
                  <button
                    onClick={handleNextStep}
                    className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Continuar →
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'job-description' && (
            <JobDescriptionSection onJobDescriptionSubmit={handleJobDescriptionSubmit} />
          )}

          {currentStep === 'processing' && (
            <ProcessingSection onComplete={handleProcessingComplete} />
          )}

          {currentStep === 'result' && cvData && (
            <CVSection cvData={cvData} onDownload={handleDownload} />
          )}
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-800 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-black dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}

export default App;