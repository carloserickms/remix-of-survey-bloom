import { useState, useCallback } from 'react';
import { ChevronRight, Send, Loader2, CheckCircle2 } from 'lucide-react';
import SurveyHeader from '@/components/layout/SurveyHeader';
import SurveyOptionCard from '@/components/survey/SurveyOptionCard';
import ProgressIndicator from '@/components/survey/ProgressIndicator';
import { Button } from '@/components/ui/button';
import { useFormularioAtivo, useEnviarRespostas } from '@/hooks/useSurveyData';
import type { Resposta } from '@/types/survey';

const Survey = () => {
  const { formulario, loading, error } = useFormularioAtivo();
  const { enviarRespostas, loading: enviando, success } = useEnviarRespostas();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostas, setRespostas] = useState<Map<string, Resposta>>(new Map());

  const perguntas = formulario?.perguntas || [];
  const perguntaAtual = perguntas[currentIndex];
  const totalPerguntas = perguntas.length;
  const isLastQuestion = currentIndex === totalPerguntas - 1;
  
  const respostaAtual = perguntaAtual ? respostas.get(perguntaAtual.id) : undefined;

  const handleSelectOption = useCallback((perguntaId: string, questaoId: string) => {
    setRespostas(prev => {
      const newMap = new Map(prev);
      newMap.set(perguntaId, { perguntaId, questaoId });
      return newMap;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < totalPerguntas - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, totalPerguntas]);

  const handleSubmit = useCallback(async () => {
    if (!formulario) return;
    
    const payload = {
      formularioId: formulario.id,
      respostas: Array.from(respostas.values()),
    };
    
    await enviarRespostas(payload);
  }, [formulario, respostas, enviarRespostas]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando pesquisa...</p>
        </div>
      </div>
    );
  }

  if (error || !formulario) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 bg-card rounded-xl shadow-card max-w-md animate-fade-in">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="font-display text-xl font-semibold mb-2">Ops!</h2>
          <p className="text-muted-foreground">
            {error || 'Não há nenhuma pesquisa ativa no momento.'}
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <SurveyHeader titulo={formulario.titulo} />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center p-8 bg-card rounded-xl shadow-card max-w-md animate-scale-in">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Obrigado!
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Suas respostas foram enviadas com sucesso. Agradecemos sua participação na avaliação da Escola Bíblica Dominical.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SurveyHeader titulo={formulario.titulo} />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Progress */}
        <div className="mb-10 animate-fade-in">
          <ProgressIndicator current={currentIndex + 1} total={totalPerguntas} />
        </div>

        {/* Question */}
        <div className="max-w-3xl mx-auto" key={perguntaAtual?.id}>
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
              {perguntaAtual?.titulo}
            </h2>
            <p className="text-muted-foreground">
              Clique em uma das opções para responder.
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10">
            {perguntaAtual?.questoes.map((questao, index) => (
              <div 
                key={questao.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <SurveyOptionCard
                  questao={questao}
                  index={index}
                  isSelected={respostaAtual?.questaoId === questao.id}
                  onSelect={() => handleSelectOption(perguntaAtual.id, questao.id)}
                />
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
            {isLastQuestion ? (
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!respostaAtual || enviando}
                className="px-8 gap-2 font-semibold"
              >
                {enviando ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar respostas
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!respostaAtual}
                className="px-8 gap-2 font-semibold"
              >
                Próxima pergunta
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Survey;
