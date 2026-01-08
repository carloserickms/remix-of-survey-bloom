// Centralized API Configuration
// All endpoints are defined here for easy maintenance and backend integration

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-fdns.onrender.com/api/v1';

export const API_ENDPOINTS = {
  // Formulários
  GET_FORMULARIO_ATIVO: `${API_BASE_URL}/exibir_formularios`,
  GET_FORMULARIOS: `${API_BASE_URL}/exibir_todos_formularios`,
  CREATE_FORMULARIO: `${API_BASE_URL}/criar_formulario`,
  ATIVAR_FORMULARIO: `${API_BASE_URL}/ativar_formulario`,
  DESATIVAR_FORMULARIO: `${API_BASE_URL}/desativar_formulario`,
  
  // Perguntas
  GET_PERGUNTAS: (formularioId: string) => `${API_BASE_URL}/formularios/${formularioId}/perguntas`,
  CREATE_PERGUNTA: `${API_BASE_URL}/criar_pergunta`,
  
  // Questões
  GET_QUESTOES: (perguntaId: string) => `${API_BASE_URL}/perguntas/${perguntaId}/questoes`,
  CREATE_QUESTAO: `${API_BASE_URL}/criar_questao`,
  EDIT_QUESTAO: (questaoId: string) => `${API_BASE_URL}/questoes/${questaoId}`,
  DELETE_QUESTAO: (questaoId: string) => `${API_BASE_URL}/questoes/${questaoId}`,
  
  // Respostas
  ENVIAR_RESPOSTAS: `${API_BASE_URL}/responder_questao`,
  
  // Auditoria
  AUDITAR_FORMULARIO: (formularioId: string) => `${API_BASE_URL}/auditar_formulario`,
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
