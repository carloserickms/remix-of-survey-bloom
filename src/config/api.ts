// Centralized API Configuration
// All endpoints are defined here for easy maintenance and backend integration

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Formulários
  GET_FORMULARIO_ATIVO: `${API_BASE_URL}/formularios/ativo`,
  GET_FORMULARIOS: `${API_BASE_URL}/formularios`,
  CREATE_FORMULARIO: `${API_BASE_URL}/formularios`,
  
  // Perguntas
  GET_PERGUNTAS: (formularioId: string) => `${API_BASE_URL}/formularios/${formularioId}/perguntas`,
  CREATE_PERGUNTA: `${API_BASE_URL}/perguntas`,
  
  // Questões
  GET_QUESTOES: (perguntaId: string) => `${API_BASE_URL}/perguntas/${perguntaId}/questoes`,
  CREATE_QUESTAO: `${API_BASE_URL}/questoes`,
  EDIT_QUESTAO: (questaoId: string) => `${API_BASE_URL}/questoes/${questaoId}`,
  DELETE_QUESTAO: (questaoId: string) => `${API_BASE_URL}/questoes/${questaoId}`,
  
  // Respostas
  ENVIAR_RESPOSTAS: `${API_BASE_URL}/respostas`,
  
  // Auditoria
  AUDITAR_FORMULARIO: (formularioId: string) => `${API_BASE_URL}/formularios/${formularioId}/auditoria`,
} as const;

// API Helper functions
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
