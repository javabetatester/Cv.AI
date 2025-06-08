import React, { useState } from 'react';

export const DebugSection: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testGroqConnection = async () => {
    setIsLoading(true);
    setTestResult('Testando...');

    try {
      // Verificar se a chave existe
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        setTestResult('❌ VITE_GROQ_API_KEY não encontrada no arquivo .env');
        return;
      }

      setTestResult(`✅ Chave encontrada: ${apiKey.substring(0, 20)}...`);

      // Teste básico da API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'user',
              content: 'Responda apenas: "API funcionando!"'
            }
          ],
          max_tokens: 50
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        setTestResult(`❌ Erro API (${response.status}): ${errorText}`);
        return;
      }

      const data = await response.json();
      setTestResult(`✅ API funcionando! Resposta: ${data.choices[0]?.message.content}`);

    } catch (error) {
      setTestResult(`❌ Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
        🔧 Debug: Teste da API Groq
      </h3>
      
      <button
        onClick={testGroqConnection}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {isLoading ? 'Testando...' : 'Testar Conexão Groq'}
      </button>

      {testResult && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4">
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Variáveis de ambiente:</strong></p>
        <p>VITE_GROQ_API_KEY: {import.meta.env.VITE_GROQ_API_KEY ? '✅ Configurada' : '❌ Não encontrada'}</p>
      </div>
    </div>
  );
};