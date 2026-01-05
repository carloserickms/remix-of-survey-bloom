import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

const AdminCard = ({ title, description, icon: Icon, to, variant = 'primary' }: AdminCardProps) => {
  const variantClasses = {
    primary: 'hover:border-primary/30 [&_.icon-wrapper]:bg-primary/10 [&_.icon-wrapper]:text-primary',
    secondary: 'hover:border-accent/30 [&_.icon-wrapper]:bg-accent/10 [&_.icon-wrapper]:text-accent',
    success: 'hover:border-success/30 [&_.icon-wrapper]:bg-success/10 [&_.icon-wrapper]:text-success',
    warning: 'hover:border-warning/30 [&_.icon-wrapper]:bg-warning/10 [&_.icon-wrapper]:text-warning',
  };

  return (
    <Link
      to={to}
      className={cn(
        "block p-6 bg-card rounded-xl border-2 border-transparent",
        "shadow-card hover:shadow-card-hover transition-all duration-300",
        "hover:scale-[1.02] active:scale-[0.98]",
        "group",
        variantClasses[variant]
      )}
    >
      <div className="flex items-start gap-4">
        <div className="icon-wrapper w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-display font-semibold text-lg text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AdminCard;
