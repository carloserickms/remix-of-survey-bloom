import { FileText, HelpCircle, ListChecks, Edit3 } from 'lucide-react';
import AdminHeader from '@/components/layout/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 animate-fade-in">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Administração de Formulários
            </h1>
            <p className="text-lg text-muted-foreground">
              Gerencie os formulários, perguntas e questões da pesquisa EBD.
            </p>
          </div>

          <div className="grid gap-4 md:gap-6">
            <AdminCard
              title="Criar Formulário"
              description="Crie um novo formulário de pesquisa para a Escola Bíblica Dominical."
              icon={FileText}
              to="/admin/formularios"
              variant="primary"
            />
            
            <AdminCard
              title="Criar Perguntas"
              description="Adicione novas perguntas aos formulários existentes."
              icon={HelpCircle}
              to="/admin/perguntas"
              variant="secondary"
            />
            
            <AdminCard
              title="Criar Questões"
              description="Configure as opções de resposta para cada pergunta (máximo 4)."
              icon={ListChecks}
              to="/admin/questoes"
              variant="success"
            />
            
            <AdminCard
              title="Editar Questões"
              description="Visualize e edite as questões existentes em cada pergunta."
              icon={Edit3}
              to="/admin/editar"
              variant="warning"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
