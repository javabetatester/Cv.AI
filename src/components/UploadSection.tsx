import React, { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { UploadedFile } from '../types';

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
  uploadedFile: UploadedFile | null;
  onRemoveFile: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onFileUpload,
  uploadedFile,
  onRemoveFile
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      onFileUpload(pdfFile);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const formatFileSize = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-800 to-black bg-clip-text text-transparent mb-4">
          Faça Upload do seu CV do LinkedIn
        </h2>
        <p className="text-xl text-gray-600 dark:text-purple-300">
          Arraste e solte seu arquivo PDF ou clique para selecionar
        </p>
      </div>

      {!uploadedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
            isDragging
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105'
              : 'border-purple-300 dark:border-purple-600 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="space-y-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
              isDragging 
                ? 'bg-purple-100 dark:bg-purple-800 scale-110' 
                : 'bg-purple-50 dark:bg-purple-900 group-hover:bg-purple-100 dark:group-hover:bg-purple-800'
            }`}>
              <Upload className={`w-12 h-12 transition-colors duration-300 ${
                isDragging 
                  ? 'text-purple-600' 
                  : 'text-purple-400 group-hover:text-purple-500'
              }`} />
            </div>
            
            <div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Solte seu arquivo PDF aqui
              </p>
              <p className="text-gray-500 dark:text-purple-300">
                ou <span className="text-purple-600 font-medium">clique para selecionar</span>
              </p>
            </div>
            
            <div className="text-sm text-gray-400 space-y-1">
              <p>Formatos aceitos: PDF</p>
              <p>Tamanho máximo: 10MB</p>
            </div>
          </div>
          
          <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
            isDragging ? 'bg-gradient-to-r from-purple-600/10 to-black/10' : 'opacity-0'
          }`} />
        </div>
      ) : (
        <div className="bg-white dark:bg-black/50 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-purple-300">
                  {uploadedFile.size}
                </p>
              </div>
            </div>
            
            <button
              onClick={onRemoveFile}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};