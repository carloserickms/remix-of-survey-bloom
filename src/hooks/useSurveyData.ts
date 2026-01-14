import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS, apiRequest } from '@/config/api';
import type { enviarQuestao, Formulario, FormularioData, Pergunta, PerguntaData, Questao, Resposta, RespostaPayload } from '@/types/survey';
import { exitCode } from 'process';

// Mock data for development (remove when connecting to real backend)
// const mockFormulario: Formulario = {
//   id: '1',
//   titulo: 'Avaliação Trimestral EBD',
//   ativo: true,
//   criadoEm: new Date().toISOString(),
//   perguntas: [
//     {
//       id: 'p1',
//       titulo: 'Como você avalia a qualidade das lições apresentadas?',
//       formularioId: '1',
//       ordem: 1,
//       questoes: [
//         { id: 'q1', titulo: 'Excelente - Muito didático', perguntaId: 'p1', cor: 'green' },
//         { id: 'q2', titulo: 'Bom - Aprendi bastante', perguntaId: 'p1', cor: 'blue' },
//         { id: 'q3', titulo: 'Regular - Pode melhorar', perguntaId: 'p1', cor: 'gray' },
//         { id: 'q4', titulo: 'Insatisfatório', perguntaId: 'p1', cor: 'red' },
//       ],
//     },
//     {
//       id: 'p2',
//       titulo: 'O horário das aulas é adequado para você?',
//       formularioId: '1',
//       ordem: 2,
//       questoes: [
//         { id: 'q5', titulo: 'Sim, perfeito', perguntaId: 'p2', cor: 'green' },
//         { id: 'q6', titulo: 'Sim, mas poderia ser mais cedo', perguntaId: 'p2', cor: 'blue' },
//         { id: 'q7', titulo: 'Sim, mas poderia ser mais tarde', perguntaId: 'p2', cor: 'gray' },
//         { id: 'q8', titulo: 'Não, é muito inconveniente', perguntaId: 'p2', cor: 'red' },
//       ],
//     },
//     {
//       id: 'p3',
//       titulo: 'Como você avalia o material didático utilizado?',
//       formularioId: '1',
//       ordem: 3,
//       questoes: [
//         { id: 'q9', titulo: 'Excelente qualidade', perguntaId: 'p3', cor: 'green' },
//         { id: 'q10', titulo: 'Boa qualidade', perguntaId: 'p3', cor: 'blue' },
//         { id: 'q11', titulo: 'Qualidade regular', perguntaId: 'p3', cor: 'gray' },
//         { id: 'q12', titulo: 'Precisa melhorar muito', perguntaId: 'p3', cor: 'red' },
//       ],
//     },
//   ],
// };

// const mockFormularios: Formulario[] = [
//   // mockFormulario,
//   { id: '2', titulo: 'Pesquisa de Satisfação 2024', ativo: false, criadoEm: '2024-01-15' },
//   { id: '3', titulo: 'Avaliação de Professores', ativo: false, criadoEm: '2024-02-20' },
// ];

export const useFormularioAtivo = () => {
  const [formulario, setFormulario] = useState<Formulario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormulario = async () => {
      try {
        setLoading(true);
        // Uncomment when backend is ready:
        const data = await apiRequest<FormularioData>(API_ENDPOINTS.GET_FORMULARIO_ATIVO);
        console.log('Formulario ativo recebido:', data);
        setFormulario(data.data[0]);
        // Mock data for development:
        // await new Promise(resolve => setTimeout(resolve, 800));
        // setFormulario(mockFormulario);
      } catch (err) {
        setError('Erro ao carregar formulário');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulario();
  }, []);

  return { formulario, loading, error };
};

export const useGetPerguntas = () => {
  const [perguntas, setPerguntas] = useState<Pergunta[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerguntas = async () => {
      try {
        setLoading(true);
        // Uncomment when backend is ready:
        const data = await apiRequest<Pergunta[]>(API_ENDPOINTS.GET_PERGUNTAS);
        console.log('Perguntas recebidas:', data);
        setPerguntas(data)
        // Mock data for development:
        // await new Promise(resolve => setTimeout(resolve, 800));
        // setPerguntas(mockPerguntas);
      } catch (err) {
        setError('Erro ao carregar perguntas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerguntas();
  }, []);

  return { perguntas, loading, error };
}

export const useGetFormularios = () => {
  const [formulario, setFormulario] = useState<Formulario[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormulario = async () => {
      try {
        setLoading(true);
        // Chamada real para sua API
        const response = await apiRequest<FormularioData>(API_ENDPOINTS.GET_FORMULARIOS);
        
        console.log('Formulario ativo recebido:', response);

        // Verificação de segurança: a API retorna { data: [...] }
        if (response && response.data && response.data.length > 0) {
          setFormulario(response.data);
        } else {
          setError('Nenhum formulário ativo encontrado.');
        }
      } catch (err) {
        setError('Erro ao comunicar com o servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulario();
  }, []);

  return { formulario, loading, error };
};


export const useCreateFormulario = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createFormulario = async (titulo: string) => {
    try {
      setIsCreating(true);
      const newFormulario = await apiRequest<Formulario>(API_ENDPOINTS.CREATE_FORMULARIO, {
        method: 'POST',
        body: JSON.stringify({ titulo }),
      });
      return newFormulario;
    } catch (err) {
      throw new Error('Erro ao criar formulário');
    } finally {
      setIsCreating(false);
    }
  };

  return { createFormulario, isCreating };
};


export const useEnviarRespostas = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviarRespostas = async (respostas: { questaoId: number | string }[]) => {
    try {
      setLoading(true);
      setError(null);

      // Criamos um array de promessas para enviar todas simultaneamente
      const promises = respostas.map(resp => 
        apiRequest(API_ENDPOINTS.ENVIAR_RESPOSTAS, { // endpoint: /api/v1/responder_questao
          method: 'POST',
          body: JSON.stringify({ id: resp.questaoId }), // O backend espera {"id": ...}
        })
      );

      // Aguarda todas as requisições terminarem
      await Promise.all(promises);

      setSuccess(true);
    } catch (err) {
      console.error('Erro ao enviar respostas:', err);
      setError('Erro ao processar uma ou mais respostas.');
    } finally {
      setLoading(false);
    }
  };

  return { enviarRespostas, loading, success, error, resetSuccess: () => setSuccess(false) };
};

export const useCreatePergunta = () => {
  const createPergunta = async (formulario_id: string, titulo: string): Promise<Pergunta> => {
    try {
      const newPergunta = await apiRequest<Pergunta>(API_ENDPOINTS.CREATE_PERGUNTA, {
        method: 'POST',
        body: JSON.stringify({ formulario_id, titulo }),
      });

      console.log('Pergunta criada:', newPergunta);

      return newPergunta;
    } catch (err) {
      throw new Error('Erro ao criar pergunta');
    }
  };

  return { createPergunta };
}

export const useCreateQuestao = () => {
  const createQuestao = async (pergunta_id: string, titulo: string): Promise<Questao> => {
    try {
      const newQuestao = await apiRequest<Questao>(API_ENDPOINTS.CREATE_QUESTAO, {
        method: 'POST',
        body: JSON.stringify({ pergunta_id, titulo }),
      });

      console.log('Questão criada:', newQuestao);

      return newQuestao;
    } catch (err) {
      throw new Error('Erro ao criar questão');
    }
  };

  return { createQuestao };
}

export const useAtivarFormulario = () => {
  const ativarFormulario = async (id: number): Promise<void> => {
    try {
      await apiRequest(API_ENDPOINTS.ATIVAR_FORMULARIO, {
        method: 'POST',
        body: JSON.stringify({ id }),
      });

      console.log('Formulário ativado:', id);
    } catch (err) {
      throw new Error('Erro ao ativar formulário');
    }
  };

  return { ativarFormulario };
}

export const useDesativarFormulario = () => {
  const desativarFormulario = async (id: number): Promise<void> => {
    try {
      await apiRequest(API_ENDPOINTS.DESATIVAR_FORMULARIO, {
        method: 'POST',
        body: JSON.stringify({ id }),
      });

      console.log('Formulário desativado:', id);
    } catch (err) {
      throw new Error('Erro ao desativar formulário');
    }
  };

  return { desativarFormulario };
}

export const useEditarQuestao = () => {
  const editarQuestao = async (questao: enviarQuestao): Promise<void> => {
    try {
      await apiRequest(API_ENDPOINTS.EDIT_QUESTAO, {
        headers: {
          'Content-Type': 'application/json',
      },
        method: 'POST',
        body: JSON.stringify(questao),
      });

      console.log('Questão editada:', questao);
    } catch (err) {
      throw new Error('Erro ao editar questão');
    }
  };

  return { editarQuestao };
}
