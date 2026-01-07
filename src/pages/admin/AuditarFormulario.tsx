import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Users, BarChart3, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { useGetFormularios } from "@/hooks/useSurveyData";

const AuditarFormulario = () => {
  const { id: urlId } = useParams();
  const { formulario: listaFormularios, loading, error } = useGetFormularios();
  const [formularioAtivo, setFormularioAtivo] = useState<any | null>(null);

  useEffect(() => {
    if (listaFormularios && listaFormularios.length > 0) {
      // Procura pelo campo "id" conforme seu JSON
      const inicial = listaFormularios.find(f => String(f.id) === String(urlId)) 
                    || listaFormularios[0];
      setFormularioAtivo(inicial);
    }
  }, [listaFormularios, urlId]);

  // Função para calcular o total de respostas de uma pergunta
  const calcularTotalRespostas = (questoes: any[]) => {
    return questoes.reduce((acc, curr) => acc + (curr.quantidade_respostas || 0), 0);
  };

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const getBarColor = (index: number) => {
    const colors = ["bg-primary", "bg-emerald-500", "bg-amber-500", "bg-violet-500", "bg-rose-500"];
    return colors[index % colors.length];
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = listaFormularios?.find(f => String(f.id) === e.target.value);
    if (selected) setFormularioAtivo(selected);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground font-medium">Carregando dados...</p>
    </div>
  );

  if (error || !listaFormularios) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <p className="text-muted-foreground">{error || "Nenhum dado encontrado"}</p>
      <Link to="/admin" className="mt-4 text-primary hover:underline">Voltar ao painel</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <Link to="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Painel Geral
            </Link>

            <div className="relative w-full md:w-80">
              <select
                value={formularioAtivo?.id || ""}
                onChange={handleSelectChange}
                className="w-full appearance-none bg-background border border-border rounded-lg px-4 py-2.5 pr-10 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
              >
                {listaFormularios.map((f) => (
                  <option key={f.id} value={f.id}>{f.titulo}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Auditoria de Respostas</h1>
              <p className="text-muted-foreground text-sm">Visualizando dados em tempo real</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {formularioAtivo && (
          <div className="space-y-8">
            {/* Card de Informação do Form */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex items-center gap-6">
              <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-muted items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold capitalize">{formularioAtivo.titulo}</h2>
                <div className="flex flex-wrap gap-4 mt-2">
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">ID: {formularioAtivo.id}</span>
                  <span className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" /> {formularioAtivo.perguntas?.length || 0} Perguntas Totais
                  </span>
                </div>
              </div>
            </div>

            {/* Grid de Perguntas */}
            <div className="grid gap-6">
              {formularioAtivo.perguntas?.map((pergunta: any, pIdx: number) => {
                const total = calcularTotalRespostas(pergunta.questoes);
                
                return (
                  <div key={pergunta.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-muted/20 px-6 py-4 border-b border-border flex justify-between items-center">
                      <h3 className="font-bold text-lg text-foreground/90">
                        {pIdx + 1}. {pergunta.titulo}
                      </h3>
                      <div className="text-right">
                        <span className="block text-xs uppercase tracking-wider text-muted-foreground font-bold">Total</span>
                        <span className="text-lg font-black text-primary">{total}</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {pergunta.questoes.length > 0 ? (
                        pergunta.questoes.map((q: any, qIdx: number) => {
                          const perc = getPercentage(q.quantidade_respostas, total);
                          return (
                            <div key={q.id} className="relative">
                              <div className="flex justify-between text-sm font-bold mb-2">
                                <span className="text-foreground/80">{q.titulo}</span>
                                <span className="text-muted-foreground">{q.quantidade_respostas} ({perc}%)</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(qIdx)}`}
                                  style={{ width: `${perc}%` }}
                                />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-4 text-center border-2 border-dashed border-muted rounded-xl">
                          <p className="text-muted-foreground text-sm italic">Esta pergunta ainda não possui opções de resposta ou votos.</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AuditarFormulario;