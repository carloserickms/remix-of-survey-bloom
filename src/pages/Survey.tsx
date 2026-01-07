import { useState, useCallback } from 'react';
import { ChevronRight, Send, Loader2, CheckCircle2 } from 'lucide-react';
import SurveyHeader from '@/components/layout/SurveyHeader';
import SurveyOptionCard from '@/components/survey/SurveyOptionCard';
import ProgressIndicator from '@/components/survey/ProgressIndicator';
import { Button } from '@/components/ui/button';
import { useFormularioAtivo, useEnviarRespostas } from '@/hooks/useSurveyData';

const Survey = () => {
  const { formulario, loading, error } = useFormularioAtivo();
  const { enviarRespostas, loading: enviando, success } = useEnviarRespostas();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  // Guardamos as respostas: Chave é o ID da pergunta, Valor é o ID da questão selecionada
  const [respostas, setRespostas] = useState<Record<string, any>>({});

  const perguntas = formulario?.perguntas || [];
  const perguntaAtual = perguntas[currentIndex];
  const totalPerguntas = perguntas.length;
  const isLastQuestion = currentIndex === totalPerguntas - 1;
  
  const respostaAtual = perguntaAtual ? respostas[perguntaAtual.id] : undefined;

  const handleSelectOption = useCallback((perguntaId: string | number, questaoId: string | number) => {
    setRespostas(prev => ({
      ...prev,
      [perguntaId]: questaoId
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < totalPerguntas - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, totalPerguntas]);

  const handleSubmit = useCallback(async () => {
    if (!formulario) return;
    
    // Transformamos o objeto de respostas em um array de objetos com a chave questaoId
    const listaParaEnviar = Object.values(respostas).map(qId => ({
      questaoId: qId
    }));
    
    await enviarRespostas(listaParaEnviar);
  }, [formulario, respostas, enviarRespostas]);

  // Estados de erro e loading (mantidos como no seu original, mas com nomes de campos corrigidos)
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  if (error || !formulario || perguntas.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border max-w-sm">
          <span className="text-4xl mb-4 block">📝</span>
          <h2 className="text-xl font-bold mb-2">Nenhuma pesquisa disponível</h2>
          <p className="text-muted-foreground">{error || 'Aguarde um novo formulário ser ativado.'}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Enviado com sucesso!</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Sua participação foi registrada. Obrigado por ajudar a melhorar nossa EBD!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SurveyHeader titulo={formulario.titulo} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressIndicator current={currentIndex + 1} total={totalPerguntas} />

        <div className="mt-12 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-black text-foreground mb-4">
              {perguntaAtual.titulo}
            </h2>
            <p className="text-muted-foreground italic">Selecione uma opção para continuar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {perguntaAtual.questoes?.map((questao: any, index: number) => (
              <SurveyOptionCard
                key={questao.id}
                questao={questao}
                index={index}
                isSelected={respostaAtual === questao.id}
                onSelect={() => handleSelectOption(perguntaAtual.id, questao.id)}
              />
            ))}
          </div>

          <div className="flex justify-center pt-8">
            {isLastQuestion ? (
              <Button 
                size="lg" 
                className="w-full md:w-64 h-14 text-lg font-bold" 
                onClick={handleSubmit}
                disabled={!respostaAtual || enviando}
              >
                {enviando ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-5 h-5" />}
                Finalizar Pesquisa
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="w-full md:w-64 h-14 text-lg font-bold" 
                onClick={handleNext}
                disabled={!respostaAtual}
              >
                Próxima Pergunta <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Survey;