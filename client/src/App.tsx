import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Contracts from "@/pages/Contracts";
import Assets from "@/pages/Assets";
import AssetDetails from "@/pages/AssetDetails";
import AssetMatrix from "@/pages/AssetMatrix";
import Alerts from "@/pages/Alerts.new";
import Tickets from "@/pages/Tickets.new";
import Settings from "@/pages/Settings";
import SlaDemo from "@/pages/SlaDemo";
import SlaConfiguration from "@/pages/SlaConfiguration";
import BasicLayout from "@/components/layout/BasicLayout";
import { AnimatePresence, motion } from "framer-motion";

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/clientes" component={Clients} />
          <Route path="/contratos" component={Contracts} />
          <Route path="/ativos" component={Assets} />
          <Route path="/ativos/matriz" component={AssetMatrix} />
          <Route path="/ativos/:id" component={AssetDetails} />
          <Route path="/alertas" component={Alerts} />
          <Route path="/chamados" component={Tickets} />
          <Route path="/configuracoes" component={Settings} />
          <Route path="/sla-demo" component={SlaDemo} />
          <Route path="/sla-configuration" component={SlaConfiguration} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BasicLayout>
        <Router />
      </BasicLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
