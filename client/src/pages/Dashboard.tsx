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

  return (
    <div>
      {/* Stats Overview - apenas Alertas Críticos e Chamados Abertos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {statsLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="animate-pulse h-32 rounded-lg bg-slate-100"></div>
          ))
        ) : (
          filteredStatCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))
        )}
      </div>

      {/* Chamados Recentes & Status Integrações */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 xl:col-span-2">
          <TicketsTable 
            tickets={recentTicketsData?.tickets || []} 
            loading={recentTicketsLoading} 
          />
        </div>
        <div className="col-span-1">
          <IntegrationStatus 
            integrations={integrationsData?.integrations || []} 
            loading={integrationsLoading} 
          />
        </div>
      </div>

      {/* Serviços Impactados */}
      <div className="mb-8">
        <ImpactedServices
          services={impactedServicesData?.services || []}
          loading={impactedServicesLoading}
        />
      </div>

      {/* Chamados com SLA próximo & Feed de Atividades */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 xl:col-span-2">
          <TicketsTable 
            tickets={slaTicketsData?.tickets || []} 
            loading={slaTicketsLoading}
            slaExpiring={true}
          />
        </div>
        <div className="col-span-1">
          <ActivityFeed 
            activities={activities || []} 
            loading={activitiesLoading} 
          />
        </div>
      </div>

      {/* Alertas & Performance SLA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertTable 
          alerts={alerts || []} 
          loading={alertsLoading} 
        />
        <SLAPerformance 
          metrics={slaData?.metrics || []} 
          chartData={slaData?.chartData || []} 
          loading={slaLoading} 
        />
      </div>
    </div>
  );
}
