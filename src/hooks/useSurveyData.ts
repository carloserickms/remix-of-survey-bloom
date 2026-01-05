import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS, apiRequest } from '@/config/api';
import type { Formulario, Pergunta, Questao, Resposta, RespostaPayload } from '@/types/survey';

// Mock data for development (remove when connecting to real backend)
const mockFormulario: Formulario = {
  id: '1',
  titulo: 'Avaliação Trimestral EBD',
  ativo: true,
  criadoEm: new Date().toISOString(),
  perguntas: [
    {
      id: 'p1',
      titulo: 'Como você avalia a qualidade das lições apresentadas?',
      formularioId: '1',
      ordem: 1,
      questoes: [
        { id: 'q1', titulo: 'Excelente - Muito didático', perguntaId: 'p1', cor: 'green' },
        { id: 'q2', titulo: 'Bom - Aprendi bastante', perguntaId: 'p1', cor: 'blue' },
        { id: 'q3', titulo: 'Regular - Pode melhorar', perguntaId: 'p1', cor: 'gray' },
        { id: 'q4', titulo: 'Insatisfatório', perguntaId: 'p1', cor: 'red' },
      ],
    },
    {
      id: 'p2',
      titulo: 'O horário das aulas é adequado para você?',
      formularioId: '1',
      ordem: 2,
      questoes: [
        { id: 'q5', titulo: 'Sim, perfeito', perguntaId: 'p2', cor: 'green' },
        { id: 'q6', titulo: 'Sim, mas poderia ser mais cedo', perguntaId: 'p2', cor: 'blue' },
        { id: 'q7', titulo: 'Sim, mas poderia ser mais tarde', perguntaId: 'p2', cor: 'gray' },
        { id: 'q8', titulo: 'Não, é muito inconveniente', perguntaId: 'p2', cor: 'red' },
      ],
    },
    {
      id: 'p3',
      titulo: 'Como você avalia o material didático utilizado?',
      formularioId: '1',
      ordem: 3,
      questoes: [
        { id: 'q9', titulo: 'Excelente qualidade', perguntaId: 'p3', cor: 'green' },
        { id: 'q10', titulo: 'Boa qualidade', perguntaId: 'p3', cor: 'blue' },
        { id: 'q11', titulo: 'Qualidade regular', perguntaId: 'p3', cor: 'gray' },
        { id: 'q12', titulo: 'Precisa melhorar muito', perguntaId: 'p3', cor: 'red' },
      ],
    },
  ],
};

const mockFormularios: Formulario[] = [
  mockFormulario,
  { id: '2', titulo: 'Pesquisa de Satisfação 2024', ativo: false, criadoEm: '2024-01-15' },
  { id: '3', titulo: 'Avaliação de Professores', ativo: false, criadoEm: '2024-02-20' },
];

export const useFormularioAtivo = () => {
  const [formulario, setFormulario] = useState<Formulario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormulario = async () => {
      try {
        setLoading(true);
        // Uncomment when backend is ready:
        // const data = await apiRequest<Formulario>(API_ENDPOINTS.GET_FORMULARIO_ATIVO);
        // setFormulario(data);
        
        // Mock data for development:
        await new Promise(resolve => setTimeout(resolve, 800));
        setFormulario(mockFormulario);
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

export const useFormularios = () => {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFormularios = useCallback(async () => {
    try {
      setLoading(true);
      // Uncomment when backend is ready:
      // const data = await apiRequest<Formulario[]>(API_ENDPOINTS.GET_FORMULARIOS);
      // setFormularios(data);
      
      // Mock data for development:
      await new Promise(resolve => setTimeout(resolve, 500));
      setFormularios(mockFormularios);
    } catch (err) {
      setError('Erro ao carregar formulários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormularios();
  }, [fetchFormularios]);

  const createFormulario = async (titulo: string) => {
    try {
      // Uncomment when backend is ready:
      // const newFormulario = await apiRequest<Formulario>(API_ENDPOINTS.CREATE_FORMULARIO, {
      //   method: 'POST',
      //   body: JSON.stringify({ titulo }),
      // });
      
      // Mock for development:
      const newFormulario: Formulario = {
        id: String(Date.now()),
        titulo,
        ativo: false,
        criadoEm: new Date().toISOString(),
      };
      
      setFormularios(prev => [...prev, newFormulario]);
      return newFormulario;
    } catch (err) {
      throw new Error('Erro ao criar formulário');
    }
  };

  return { formularios, loading, error, createFormulario, refetch: fetchFormularios };
};

export const useEnviarRespostas = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviarRespostas = async (payload: RespostaPayload) => {
    try {
      setLoading(true);
      setError(null);
      
      // Uncomment when backend is ready:
      // await apiRequest(API_ENDPOINTS.ENVIAR_RESPOSTAS, {
      //   method: 'POST',
      //   body: JSON.stringify(payload),
      // });
      
      // Mock for development:
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Respostas enviadas:', payload);
      
      setSuccess(true);
    } catch (err) {
      setError('Erro ao enviar respostas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { enviarRespostas, loading, success, error, resetSuccess: () => setSuccess(false) };
};
