import { useStatistics } from "@/hooks/use-statistics";
import { useAlerts } from "@/hooks/use-alerts";
import { useActivities } from "@/hooks/use-activities";
import { useSLA } from "@/hooks/use-sla";
import { useIntegrations } from "@/hooks/use-integrations";
import { useTickets } from "@/hooks/use-tickets";
import { useImpactedServices } from "@/hooks/use-impacted-services";
import StatCard from "@/components/dashboard/StatCard";
import AlertTable from "@/components/dashboard/AlertTable";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import SLAPerformance from "@/components/dashboard/SLAPerformance";
import IntegrationStatus from "@/components/dashboard/IntegrationStatus";
import TicketsTable from "@/components/dashboard/TicketsTable";
import ImpactedServices from "@/components/dashboard/ImpactedServices";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { statCards: allStatCards, isLoading: statsLoading } = useStatistics();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: activities, isLoading: activitiesLoading } = useActivities();
  const { data: slaData, isLoading: slaLoading } = useSLA();
  const { data: integrationsData, isLoading: integrationsLoading } = useIntegrations();
  const { data: recentTicketsData, isLoading: recentTicketsLoading } = useTickets("recent");
  const { data: slaTicketsData, isLoading: slaTicketsLoading } = useTickets("sla-expiring");
  const { data: impactedServicesData, isLoading: impactedServicesLoading } = useImpactedServices();
  
  // Filtrar apenas os cards de alertas críticos e chamados abertos
  const filteredStatCards = allStatCards.filter(card => 
    card.title === "Alertas Críticos" || card.title === "Chamados Abertos"
  );

  // Variantes de animações para os componentes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Stats Overview - apenas Alertas Críticos e Chamados Abertos */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" variants={itemVariants}>
        {statsLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <motion.div 
              key={index} 
              className="animate-pulse h-32 rounded-lg bg-slate-100"
            />
          ))
        ) : (
          filteredStatCards.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Chamados Recentes & Status Integrações */}
      <motion.div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
        <motion.div 
          className="col-span-1 xl:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <TicketsTable 
            tickets={recentTicketsData?.tickets || []} 
            loading={recentTicketsLoading} 
          />
        </motion.div>
        <motion.div 
          className="col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <IntegrationStatus 
            integrations={integrationsData?.integrations || []} 
            loading={integrationsLoading} 
          />
        </motion.div>
      </motion.div>

      {/* Serviços Impactados */}
      <motion.div 
        className="mb-8" 
        variants={itemVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <ImpactedServices
          services={impactedServicesData?.services || []}
          loading={impactedServicesLoading}
        />
      </motion.div>

      {/* Chamados com SLA próximo & Feed de Atividades */}
      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8" 
        variants={itemVariants}
      >
        <motion.div 
          className="col-span-1 xl:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <TicketsTable 
            tickets={slaTicketsData?.tickets || []} 
            loading={slaTicketsLoading}
            slaExpiring={true}
          />
        </motion.div>
        <motion.div 
          className="col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <ActivityFeed 
            activities={activities || []} 
            loading={activitiesLoading} 
          />
        </motion.div>
      </motion.div>

      {/* Alertas & Performance SLA */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6" 
        variants={itemVariants}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <AlertTable 
            alerts={alerts || []} 
            loading={alertsLoading} 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <SLAPerformance 
            metrics={slaData?.metrics || []} 
            chartData={slaData?.chartData || []} 
            loading={slaLoading} 
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
