import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Power, PowerOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/layout/AdminHeader';
import { useGetFormularios, useAtivarFormulario, useDesativarFormulario } from '@/hooks/useSurveyData';

const GerenciarFormularios = () => {
  const { toast } = useToast();
  const [novoTitulo, setNovoTitulo] = useState('');
  
  // Pegando 'formulario' (que é a sua lista) e 'loading' do seu hook
  const { formulario, loading } = useGetFormularios();
  const { ativarFormulario } = useAtivarFormulario();
  const {desativarFormulario} = useDesativarFormulario();
  
  // Criamos um estado local para gerenciar a lista e permitir mudanças de 'Ativo/Inativo' na tela
  const [listaLocal, setListaLocal] = useState<any[]>([]);

  // Quando o hook terminar de carregar, salvamos os dados no nosso estado local
  useEffect(() => {
    if (formulario) {
      setListaLocal(formulario);
    }
  }, [formulario]);

  const toggleFormularioStatus = async (id: number) => {
  // Guardamos o estado anterior para caso de erro na API
  const estadoAnterior = [...listaLocal];
  
  // Encontramos o formulário que foi clicado
  const formClicado = listaLocal.find(f => f.id === id);
  if (!formClicado) return;

  const acaoSeraAtivar = !formClicado.ativo;

  // 1. Atualização Otimista da UI
  setListaLocal(prev => 
    prev.map(f => {
      if (f.id === id) {
        return { ...f, ativo: acaoSeraAtivar };
      }
      // Se estamos ativando este, todos os outros DEVEM ser desativados
      if (acaoSeraAtivar) {
        return { ...f, ativo: false };
      }
      return f;
    })
  );

  try {
    // 2. Chamada da API baseada na ação
    if (acaoSeraAtivar) {
      await ativarFormulario(id);
    } else {
      await desativarFormulario(id);
    }

    toast({
      title: acaoSeraAtivar ? "Formulário Ativado" : "Formulário Desativado",
      description: `O formulário "${formClicado.titulo}" foi atualizado com sucesso.`,
    });
  } catch (err) {
    // 3. Reversão em caso de erro
    setListaLocal(estadoAnterior);
    toast({
      title: "Erro na sincronização",
      description: "Não foi possível salvar a alteração no servidor. Tente novamente.",
      variant: "destructive",
    });
  }
};

  const criarFormulario = () => {
    if (!novoTitulo.trim()) return;
    
    // Logica de criação (local por enquanto)
    const novo = {
      id: Date.now(),
      titulo: novoTitulo,
      ativo: false,
      created_at: new Date().toISOString()
    };
    
    setListaLocal([novo, ...listaLocal]);
    setNovoTitulo('');
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao painel
            </Link>
            <h1 className="text-3xl font-bold">Gerenciar Formulários</h1>
          </div>

          {/* Card de Criação */}
          <Card className="mb-8">
            <CardHeader><CardTitle>Novo Formulário</CardTitle></CardHeader>
            <CardContent className="flex gap-4">
              <Input 
                placeholder="Título..." 
                value={novoTitulo} 
                onChange={e => setNovoTitulo(e.target.value)} 
              />
              <Button onClick={criarFormulario}><Plus className="mr-2 h-4 w-4"/> Criar</Button>
            </CardContent>
          </Card>

          {/* Listagem */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
              listaLocal.map((item) => (
                <Card key={item.id} className={item.ativo ? "border-primary bg-primary/5" : ""}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{item.titulo}</h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {item.id} • Criado em: {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`s-${item.id}`} className="cursor-pointer">
                          {item.ativo ? (
                            <span className="text-green-600 flex items-center gap-1 text-sm font-bold">
                              <Power className="h-4 w-4" /> ATIVO
                            </span>
                          ) : (
                            <span className="text-muted-foreground flex items-center gap-1 text-sm">
                              <PowerOff className="h-4 w-4" /> INATIVO
                            </span>
                          )}
                        </Label>
                        <Switch 
                          id={`s-${item.id}`}
                          checked={item.ativo}
                          onCheckedChange={() => toggleFormularioStatus(item.id)}
                        />
                      </div>
                      
                      {/* Botão para ver auditoria deste form */}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/auditar`}>Ver Dados</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GerenciarFormularios;