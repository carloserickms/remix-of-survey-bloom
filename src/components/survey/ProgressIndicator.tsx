interface ProgressIndicatorProps {
  current: number;
  total: number;
}

const ProgressIndicator = ({ current, total }: ProgressIndicatorProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Pergunta {current} de {total}
        </span>
        <span className="text-sm font-semibold text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index < current 
                ? 'bg-primary' 
                : index === current - 1 
                  ? 'bg-primary animate-pulse-gentle' 
                  : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
