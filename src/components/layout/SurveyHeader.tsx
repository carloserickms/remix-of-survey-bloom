import { BookOpen } from 'lucide-react';

interface SurveyHeaderProps {
  titulo?: string;
}

const SurveyHeader = ({ titulo = "Pesquisa de avaliação da Escola Bíblica Dominical" }: SurveyHeaderProps) => {
  return (
    <header className="header-gradient text-primary-foreground py-6 px-4 md:px-8">
      <div className="container mx-auto flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-primary-foreground/10 rounded-xl backdrop-blur-sm">
          <BookOpen className="w-7 h-7" />
        </div>
        <div>
          <h1 className="font-display text-xl md:text-2xl font-bold leading-tight">
            {titulo}
          </h1>
          <p className="text-primary-foreground/70 text-sm mt-0.5">
            Sua opinião é muito importante para nós
          </p>
        </div>
      </div>
    </header>
  );
};

export default SurveyHeader;
