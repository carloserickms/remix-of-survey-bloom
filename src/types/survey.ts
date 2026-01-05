// Types for the Survey System

export interface Formulario {
  id: string;
  titulo: string;
  ativo: boolean;
  criadoEm: string;
  perguntas?: Pergunta[];
}

export interface Pergunta {
  id: string;
  titulo: string;
  formularioId: string;
  ordem: number;
  questoes: Questao[];
}

export interface Questao {
  id: string;
  titulo: string;
  perguntaId: string;
  icone?: string;
  cor?: 'green' | 'blue' | 'red' | 'gray';
}

export interface Resposta {
  perguntaId: string;
  questaoId: string;
}

export interface RespostaPayload {
  formularioId: string;
  respostas: Resposta[];
}
