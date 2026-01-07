import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import AdminHeader from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCreateFormulario } from '@/hooks/useSurveyData';

const CriarFormulario = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createFormulario } = useCreateFormulario();
  
  const [titulo, setTitulo] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe o título do formulário.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await createFormulario(titulo.trim());
      setSuccess(true);
      setTitulo('');
      
      toast({
        title: 'Sucesso!',
        description: 'Formulário criado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o formulário.',
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
                Criar Formulário
              </h1>
              <p className="text-muted-foreground">
                Crie um novo formulário para a pesquisa de avaliação.
              </p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3 animate-scale-in">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                <p className="text-sm text-success font-medium">
                  Formulário criado com sucesso!
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-base font-medium">
                  Título do Formulário
                </Label>
                <Input
                  id="titulo"
                  type="text"
                  placeholder="Ex: Avaliação Trimestral EBD 2024"
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
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar formulário
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CriarFormulario;
