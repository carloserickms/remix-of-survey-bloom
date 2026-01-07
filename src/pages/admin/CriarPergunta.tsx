import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
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
import { useCreatePergunta, useGetFormularios } from '@/hooks/useSurveyData';
import { useToast } from '@/hooks/use-toast';

const CriarPergunta = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formulario , loading: loadingFormularios } = useGetFormularios();

  const { createPergunta } = useCreatePergunta();

  const [titulo, setTitulo] = useState('');
  const [formularioId, setFormularioId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe o título da pergunta.',
        variant: 'destructive',
      });
      return;
    }

    if (!formularioId) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, selecione um formulário.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      // Simulating API call - replace with actual API call
      // await new Promise(resolve => setTimeout(resolve, 800));



      const novaPerguntaId = await createPergunta(formularioId, titulo);

      console.log('Nova pergunta criada com ID:', novaPerguntaId);

      toast({
        title: 'Pergunta criada!',
        description: 'Agora configure as 4 questões desta pergunta.',
      });

      // Redirect to create questions with the new pergunta ID
      navigate(`/admin/questoes?perguntaId=${novaPerguntaId.id}&titulo=${encodeURIComponent(titulo)}`);

    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a pergunta.',
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

          <div className="bg-card rounded-xl shadow-card p-6 md:p-8 animate-fade-in">
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Criar Pergunta
              </h1>
              <p className="text-muted-foreground">
                Adicione uma nova pergunta a um formulário existente.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="formulario" className="text-base font-medium">
                  Formulário
                </Label>
                <Select value={formularioId} onValueChange={setFormularioId}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder={loadingFormularios ? "Carregando..." : "Selecione um formulário"} />
                  </SelectTrigger>
                  <SelectContent>
                    {formulario != null && formulario.map((form) => (
                      <SelectItem key={form.id} value={String(form.id)}>
                        {form.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-base font-medium">
                  Título da Pergunta
                </Label>
                <Input
                  id="titulo"
                  type="text"
                  placeholder="Ex: Como você avalia a qualidade das lições?"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="h-12 text-base"
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
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Criar pergunta
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Após criar a pergunta, você será redirecionado para adicionar as 4 questões.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CriarPergunta;
