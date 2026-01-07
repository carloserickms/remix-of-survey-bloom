import { BookOpen } from 'lucide-react';

interface SurveyHeaderProps {
  titulo?: string;
}

const SurveyHeader = ({ titulo = "Pesquisa de Avaliação da Escola Bíblica Dominical" }: SurveyHeaderProps) => {
  return (
    <header className="header-gradient text-white py-6 px-4 md:px-8 border-b border-white/10 shadow-lg">
      <div className="container mx-auto flex items-center gap-4">
        {/* Container da Logo com Fallback */}
        <div className="flex items-center justify-center w-14 h-14 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shrink-0 overflow-hidden">
          <img 
            src="/logoIBMO.png" 
            alt="Logo IBMO" 
            className="w-full h-full object-contain p-1 bg-white"
            onError={(e) => {
              // Se a imagem falhar, mostra o ícone do Lucide como fallback
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('flex-col');
            }}
          />
          {/* Ícone caso a imagem não carregue */}
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-lg md:text-2xl font-extrabold leading-tight tracking-tight capitalize">
            {titulo.toLowerCase()}
          </h1>
          <p className="text-white/80 text-xs md:text-sm mt-1 font-medium italic">
            Sua opinião é fundamental para o crescimento da nossa EBD
          </p>
        </div>
      </div>
    </header>
  );
};

export default SurveyHeader;