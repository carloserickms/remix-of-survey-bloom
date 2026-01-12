import { Check, Smile, Meh, Frown, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Questao } from '@/types/survey';

interface SurveyOptionCardProps {
  questao: Questao;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const colorVariants = ['green', 'blue', 'gray', 'red'] as const;
const icons = [Smile, ThumbsUp, Meh, Frown];

const SurveyOptionCard = ({ questao, index, isSelected, onSelect }: SurveyOptionCardProps) => {
  const colorVariant = questao.cor || colorVariants[index % 4];
  const IconComponent = icons[index % 4];

  const colorClasses = {
    green: 'survey-option-green',
    blue: 'survey-option-blue',
    gray: 'survey-option-gray',
    red: 'survey-option-red',
  };

  const iconColorClasses = {
    green: 'text-survey-green',
    blue: 'text-survey-blue',
    gray: 'text-survey-gray',
    red: 'text-survey-red',
  };

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative p-6 md:p-8 rounded-2xl cursor-pointer transition-all duration-300",
        "flex flex-col items-center justify-center gap-4 min-h-[140px] md:min-h-[180px]",
        "option-shadow hover:option-shadow-hover hover:scale-[1.02] active:scale-[0.98]",
        colorClasses[colorVariant],
        isSelected && 'selected'
      )}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-scale-in">
          <Check className="w-4 h-4 text-success-foreground" />
        </div>
      )}
      
      <div className={cn("transition-transform duration-300", isSelected && "scale-110")}>
        {/* <IconComponent className={cn("w-10 h-10 md:w-12 md:h-12", iconColorClasses[colorVariant])} /> */}
      </div>
      
      <span className={cn(
        "text-center  font-medium text-2xl leading-snug",
        isSelected ? "text-foreground" : "text-foreground/80"
      )}>
        {questao.titulo}
      </span>
    </button>
  );
};

export default SurveyOptionCard;
