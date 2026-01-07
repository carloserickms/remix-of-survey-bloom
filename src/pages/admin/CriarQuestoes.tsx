import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminHeader from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Questao } from '@/types/survey';
import { useCreateQuestao } from '@/hooks/useSurveyData';

const MAX_QUESTOES = 4;

const CriarQuestoes = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const {createQuestao} = useCreateQuestao();
  
  const perguntaId = searchParams.get('perguntaId');
  const perguntaTitulo = searchParams.get('titulo') || 'Pergunta sem título';
  
  const [titulo, setTitulo] = useState('');
  const [loading, setLoading] = useState(false);
  const [questoes, setQuestoes] = useState<Questao[]>([]);

  const questoesCount = questoes.length;
  const isComplete = questoesCount >= MAX_QUESTOES;

  const handleAddQuestao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe o título da questão.',
        variant: 'destructive',
      });
      return;
    }

    if (isComplete) {
      toast({
        title: 'Limite atingido',
        description: 'Esta pergunta já possui 4 questões.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Simulating API call
      await createQuestao(perguntaId || '', titulo.trim());
      
      const novaQuestao: Questao = {
        id: String(Date.now()),
        titulo: titulo.trim(),
        perguntaId: perguntaId || '',
      };
      
      setQuestoes(prev => [...prev, novaQuestao]);
      setTitulo('');
      
      if (questoesCount + 1 >= MAX_QUESTOES) {
        toast({
          title: 'Pergunta completa!',
          description: 'Todas as 4 questões foram adicionadas.',
        });
      } else {
        toast({
          title: 'Questão adicionada!',
          description: `Faltam ${MAX_QUESTOES - questoesCount - 1} questões.`,
        });
      }
      
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar a questão.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          {/* Alert banner */}
          <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warning">Atenção</p>
              <p className="text-sm text-muted-foreground">
                Esta pergunta exige exatamente 4 questões para funcionar corretamente.
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-card p-6 md:p-8 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Criar Questões
                </h1>
                <Badge 
                  variant={isComplete ? "default" : "secondary"}
                  className={isComplete ? "bg-success text-success-foreground" : ""}
                >
                  {questoesCount} / {MAX_QUESTOES}
                </Badge>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Pergunta:</p>
                <p className="font-medium text-foreground">{decodeURIComponent(perguntaTitulo)}</p>
              </div>
            </div>

            {isComplete ? (
              <div className="text-center py-8 animate-scale-in">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Pergunta configurada com sucesso!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Todas as 4 questões foram adicionadas.
                </p>
                <Button onClick={() => navigate('/admin')} variant="outline">
                  Voltar ao painel
                </Button>
              </div>
            ) : (
              <form onSubmit={handleAddQuestao} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-base font-medium">
                    Título da Questão {questoesCount + 1}
                  </Label>
                  <Input
                    id="titulo"
                    type="text"
                    placeholder="Ex: Excelente - Muito didático"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="h-12 text-base"
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full gap-2 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Adicionar questão
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* List of added questions */}
            {questoes.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-medium text-foreground mb-4">Questões adicionadas:</h3>
                <div className="space-y-2">
                  {questoes.map((q, index) => (
                    <div 
                      key={q.id}
                      className="p-3 bg-muted rounded-lg flex items-center gap-3 animate-fade-in"
                    >
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{q.titulo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CriarQuestoes;
