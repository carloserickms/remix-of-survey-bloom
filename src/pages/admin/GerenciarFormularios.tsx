import { useState } from 'react';
import { ArrowLeft, Plus, Power, PowerOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/layout/AdminHeader';

interface Formulario {
  id: number;
  titulo: string;
  ativo: boolean;
  criadoEm: string;
}

const GerenciarFormularios = () => {
  const { toast } = useToast();
  const [novoTitulo, setNovoTitulo] = useState('');
  const [formularios, setFormularios] = useState<Formulario[]>([
    { id: 1, titulo: 'Perguntas para EBD', ativo: true, criadoEm: '2024-01-15' },
    { id: 2, titulo: 'Avaliação Trimestral', ativo: false, criadoEm: '2024-02-20' },
    { id: 3, titulo: 'Pesquisa de Satisfação', ativo: false, criadoEm: '2024-03-10' },
  ]);

  const toggleFormularioStatus = (id: number) => {
    setFormularios(prev => 
      prev.map(form => {
        if (form.id === id) {
          const novoStatus = !form.ativo;
          toast({
            title: novoStatus ? 'Formulário ativado' : 'Formulário desativado',
            description: `"${form.titulo}" foi ${novoStatus ? 'ativado' : 'desativado'} com sucesso.`,
          });
          return { ...form, ativo: novoStatus };
        }
        // Se ativar um formulário, desativar os outros (apenas um pode estar ativo)
        if (!form.ativo) return form;
        return { ...form, ativo: false };
      })
    );
  };

  const criarFormulario = () => {
    if (!novoTitulo.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite um título para o formulário.',
        variant: 'destructive',
      });
      return;
    }

    const novoFormulario: Formulario = {
      id: Date.now(),
      titulo: novoTitulo,
      ativo: false,
      criadoEm: new Date().toISOString().split('T')[0],
    };

    setFormularios(prev => [...prev, novoFormulario]);
    setNovoTitulo('');
    
    toast({
      title: 'Formulário criado',
      description: `"${novoTitulo}" foi criado com sucesso.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao painel
            </Link>
            
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Gerenciar Formulários
            </h1>
            <p className="text-muted-foreground">
              Crie novos formulários e controle quais estão ativos para receber respostas.
            </p>
          </div>

          {/* Criar novo formulário */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Criar Novo Formulário
              </CardTitle>
              <CardDescription>
                Adicione um novo formulário de pesquisa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="titulo">Título do Formulário</Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Pesquisa EBD 2024"
                    value={novoTitulo}
                    onChange={(e) => setNovoTitulo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && criarFormulario()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={criarFormulario}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de formulários */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Formulários Existentes</h2>
            
            {formularios.map((formulario) => (
              <Card 
                key={formulario.id} 
                className={`transition-all ${formulario.ativo ? 'border-primary bg-primary/5' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{formulario.titulo}</h3>
                        {formulario.ativo && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                            <Power className="h-3 w-3" />
                            Ativo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Criado em: {new Date(formulario.criadoEm).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`switch-${formulario.id}`} className="text-sm text-muted-foreground">
                          {formulario.ativo ? (
                            <span className="flex items-center gap-1 text-success">
                              <Power className="h-4 w-4" />
                              Ativo
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <PowerOff className="h-4 w-4" />
                              Inativo
                            </span>
                          )}
                        </Label>
                        <Switch
                          id={`switch-${formulario.id}`}
                          checked={formulario.ativo}
                          onCheckedChange={() => toggleFormularioStatus(formulario.id)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {formularios.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Nenhum formulário criado ainda.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GerenciarFormularios;
