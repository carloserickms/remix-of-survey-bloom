import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CriarFormulario from "./pages/admin/CriarFormulario";
import CriarPergunta from "./pages/admin/CriarPergunta";
import CriarQuestoes from "./pages/admin/CriarQuestoes";
import EditarQuestoes from "./pages/admin/EditarQuestoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/formularios" element={<CriarFormulario />} />
          <Route path="/admin/perguntas" element={<CriarPergunta />} />
          <Route path="/admin/questoes" element={<CriarQuestoes />} />
          <Route path="/admin/editar" element={<EditarQuestoes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
