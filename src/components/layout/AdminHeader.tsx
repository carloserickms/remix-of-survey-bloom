import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Settings, ChevronRight } from 'lucide-react';

const AdminHeader = () => {
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Admin', path: '/admin' }];
    
    if (paths.includes('formularios')) {
      breadcrumbs.push({ label: 'Formulários', path: '/admin/formularios' });
    }
    if (paths.includes('perguntas')) {
      breadcrumbs.push({ label: 'Perguntas', path: '/admin/perguntas' });
    }
    if (paths.includes('questoes')) {
      breadcrumbs.push({ label: 'Questões', path: '/admin/questoes' });
    }
    if (paths.includes('editar')) {
      breadcrumbs.push({ label: 'Editar', path: location.pathname });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="header-gradient text-primary-foreground py-4 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-display font-semibold text-lg hidden md:block">
                EBD Survey
              </span>
            </Link>
            
            <div className="flex items-center gap-1 text-sm text-primary-foreground/70">
              <Settings className="w-4 h-4" />
              <span>Administração</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.path} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="w-4 h-4 text-primary-foreground/50" />}
                <Link 
                  to={crumb.path}
                  className={`hover:text-primary-foreground transition-colors ${
                    index === breadcrumbs.length - 1 
                      ? 'text-primary-foreground font-medium' 
                      : 'text-primary-foreground/70'
                  }`}
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
