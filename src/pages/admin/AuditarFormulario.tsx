import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Users, BarChart3 } from "lucide-react";

// Dados de exemplo baseados na estrutura fornecida
const mockData = {
  data: {
    formulario_id: 1,
    perguntas: [
      {
        pergunta_id: 1,
        questoes: [
          {
            quantidade_respostas: 3,
            questao_id: 1,
            questão: "Sempre frequento",
          },
          {
            quantidade_respostas: 2,
            questao_id: 2,
            questão: "Frequento às vezes",
          },
          {
            quantidade_respostas: 4,
            questao_id: 3,
            questão: "Raramente frequento",
          },
          {
            quantidade_respostas: 5,
            questao_id: 4,
            questão: "Não tenho condições de ir",
          },
        ],
        respostas_totais: 14,
        titulo: "Qual sua frequência na EBD?",
      },
      {
        pergunta_id: 2,
        questoes: [
          {
            quantidade_respostas: 6,
            questao_id: 5,
            questão: "Muito satisfeito",
          },
          {
            quantidade_respostas: 4,
            questao_id: 6,
            questão: "Satisfeito",
          },
          {
            quantidade_respostas: 3,
            questao_id: 7,
            questão: "Pouco satisfeito",
          },
          {
            quantidade_respostas: 1,
            questao_id: 8,
            questão: "Insatisfeito",
          },
        ],
        respostas_totais: 14,
        titulo: "Como você avalia o conteúdo das aulas?",
      },
    ],
    titulo: "Perguntas para EBD",
  },
  status: "ok",
};

const AuditarFormulario = () => {
  const { id } = useParams();
  const formulario = mockData.data;

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const getBarColor = (index: number) => {
    const colors = [
      "bg-primary",
      "bg-green-500",
      "bg-orange-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao painel
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Auditar Formulário</h1>
              <p className="text-muted-foreground">
                Visualize as respostas e estatísticas do formulário
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Informações do Formulário */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground capitalize">
                {formulario.titulo}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  ID: {formulario.formulario_id}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formulario.perguntas.length} pergunta(s)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Perguntas */}
        <div className="space-y-6">
          {formulario.perguntas.map((pergunta, perguntaIndex) => (
            <div
              key={pergunta.pergunta_id}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              {/* Cabeçalho da Pergunta */}
              <div className="bg-muted/50 px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    {perguntaIndex + 1}. {pergunta.titulo}
                  </h3>
                  <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    {pergunta.respostas_totais} respostas
                  </span>
                </div>
              </div>

              {/* Opções/Questões */}
              <div className="p-6 space-y-4">
                {pergunta.questoes.map((questao, questaoIndex) => {
                  const percentage = getPercentage(
                    questao.quantidade_respostas,
                    pergunta.respostas_totais
                  );

                  return (
                    <div key={questao.questao_id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium">
                          {questao.questão}
                        </span>
                        <span className="text-muted-foreground">
                          {questao.quantidade_respostas} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                            questaoIndex
                          )}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumo */}
              <div className="bg-muted/30 px-6 py-3 border-t border-border">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>ID da Pergunta: {pergunta.pergunta_id}</span>
                  <span>Total de opções: {pergunta.questoes.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AuditarFormulario;
