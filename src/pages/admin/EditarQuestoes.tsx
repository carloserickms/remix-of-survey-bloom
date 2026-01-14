import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Trash2, Loader2, ArrowLeft, Edit2 } from 'lucide-react';
import AdminHeader from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import type { enviarQuestao, Pergunta, Questao } from '@/types/survey';
import { useEditarQuestao, useGetPerguntas } from '@/hooks/useSurveyData';

// Mock data
// const mockPerguntas: Pergunta[] = [
//   {
//     id: 'p1',
//     titulo: 'Como você avalia a qualidade das lições apresentadas?',
//     formularioId: '1',
//     ordem: 1,
//     questoes: [
//       { id: 'q1', titulo: 'Excelente - Muito didático', perguntaId: 'p1' },
//       { id: 'q2', titulo: 'Bom - Aprendi bastante', perguntaId: 'p1' },
//       { id: 'q3', titulo: 'Regular - Pode melhorar', perguntaId: 'p1' },
//       { id: 'q4', titulo: 'Insatisfatório', perguntaId: 'p1' },
//     ],
//   },
//   {
//     id: 'p2',
//     titulo: 'O horário das aulas é adequado para você?',
//     formularioId: '1',
//     ordem: 2,
//     questoes: [
//       { id: 'q5', titulo: 'Sim, perfeito', perguntaId: 'p2' },
//       { id: 'q6', titulo: 'Sim, mas poderia ser mais cedo', perguntaId: 'p2' },
//       { id: 'q7', titulo: 'Sim, mas poderia ser mais tarde', perguntaId: 'p2' },
//       { id: 'q8', titulo: 'Não, é muito inconveniente', perguntaId: 'p2' },
//     ],
//   },
// ];

const EditarQuestoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { perguntas, loading } = useGetPerguntas();
  const { editarQuestao } = useEditarQuestao();
  const [selectedPerguntaId, setSelectedPerguntaId] = useState('');
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  console.log('Perguntas:', perguntas);

  const selectedPergunta = perguntas?.find(pergunta => pergunta.id === selectedPerguntaId);

  useEffect(() => {
    if (selectedPergunta) {
      setQuestoes(selectedPergunta.questoes);
    } else {
      setQuestoes([]);
    }
  }, [selectedPergunta]);

  const handleEdit = (questao: Questao) => {
    setEditingId(questao.id);
    setEditValue(questao.titulo);
  };

  const handleSave = async (questaoId: string) => {
    if (!editValue.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'O título da questão não pode estar vazio.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(questaoId);

      // Simulating API call
      // await new Promise(resolve => setTimeout(resolve, 500));

      const payload : enviarQuestao = {
        id: questaoId,
        titulo: editValue.trim(),
      };

      await editarQuestao(payload);

      setQuestoes(prev =>
        prev.map(q =>
          q.id === questaoId ? { ...q, titulo: editValue.trim() } : q
        )
      );

      setEditingId(null);
      setEditValue('');

      toast({
        title: 'Salvo!',
        description: 'Questão atualizada com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a questão.',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (questaoId: string) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setQuestoes(prev => prev.filter(q => q.id !== questaoId));

      toast({
        title: 'Excluído!',
        description: 'Questão removida com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a questão.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <div className="bg-card rounded-xl shadow-card p-6 md:p-8 animate-fade-in">
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Editar Questões
              </h1>
              <p className="text-muted-foreground">
                Selecione uma pergunta para visualizar e editar suas questões.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pergunta" className="text-base font-medium">
                  Selecionar Pergunta
                </Label>
                <Select value={selectedPerguntaId} onValueChange={setSelectedPerguntaId}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Selecione uma pergunta" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                        <div>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Carregando...

                        </div>
                        
                    ) : (
                      perguntas.map(pergunta => (
                        <SelectItem key={pergunta.id} value={pergunta.id}>
                          {pergunta.titulo} ({pergunta.respostas_totais} respostas)
                        </SelectItem> 
                      ))
                    )
                  }
                  </SelectContent>
                </Select>
              </div>

              {selectedPerguntaId && questoes.length > 0 && (
                <div className="pt-6 border-t space-y-4 animate-fade-in">
                  <h3 className="font-medium text-foreground">
                    Questões ({questoes.length})
                  </h3>

                  {questoes.map((questao, index) => (
                    <div
                      key={questao.id}
                      className="p-4 bg-muted rounded-lg animate-fade-in"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </span>

                        {editingId === questao.id ? (
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                        ) : (
                          <span className="flex-1 text-foreground">
                            {questao.titulo}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        {editingId === questao.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancel}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSave(questao.id)}
                              disabled={saving === questao.id}
                              className="gap-1"
                            >
                              {saving === questao.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                              Salvar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(questao)}
                              className="gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Excluir
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir questão?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. A questão será removida permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(questao.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedPerguntaId && questoes.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  Nenhuma questão encontrada para esta pergunta.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditarQuestoes;
