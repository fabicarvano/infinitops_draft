import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Assets from "@/pages/Assets";
import Alerts from "@/pages/Alerts";
import Tickets from "@/pages/Tickets";
import Settings from "@/pages/Settings";
import MainLayout from "@/components/layout/MainLayout";
import { SidebarProvider } from "@/hooks/use-sidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/clientes" component={Clients} />
      <Route path="/ativos" component={Assets} />
      <Route path="/alertas" component={Alerts} />
      <Route path="/chamados" component={Tickets} />
      <Route path="/configuracoes" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <MainLayout>
          <Router />
        </MainLayout>
      </SidebarProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
