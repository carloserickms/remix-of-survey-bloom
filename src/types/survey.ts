// Types for the Survey System

export interface FormularioData{
  data: Formulario[];
}

export interface PerguntaData{
  data: Pergunta[];
}


export interface Formulario {
  id: string;
  titulo: string;
  ativo: boolean;
  created_at: string;
  perguntas?: Pergunta[];
}

export interface Pergunta {
  id: string;
  titulo: string;
  formularioId: string;
  questoes: Questao[];
  respostas_totais: number;
}

export interface Questao {
  id: string;
  titulo: string;
  perguntaId: string;
  icone?: string;
  cor?: 'green' | 'blue' | 'red' | 'gray';
  quantidade_respostas: number;
}

export interface Resposta {
  id: string;
}

export interface RespostaPayload {
  id: string;
  respostas: Resposta[];
}
