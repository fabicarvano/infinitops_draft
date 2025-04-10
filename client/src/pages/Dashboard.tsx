import { useStatistics } from "@/hooks/use-statistics";
import { useAlerts } from "@/hooks/use-alerts";
import { useActivities } from "@/hooks/use-activities";
import { useSLA } from "@/hooks/use-sla";
import { useContracts } from "@/hooks/use-contracts";
import StatCard from "@/components/dashboard/StatCard";
import AlertTable from "@/components/dashboard/AlertTable";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import SLAPerformance from "@/components/dashboard/SLAPerformance";
import ContractsOverview from "@/components/dashboard/ContractsOverview";

export default function Dashboard() {
  const { statCards, isLoading: statsLoading } = useStatistics();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: activities, isLoading: activitiesLoading } = useActivities();
  const { data: slaData, isLoading: slaLoading } = useSLA();
  const { data: contractsData, isLoading: contractsLoading } = useContracts();

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-slate-800 animate-pulse h-32 rounded-lg"></div>
          ))
        ) : (
          statCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))
        )}
      </div>

      {/* Alert Status & Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 xl:col-span-2">
          <AlertTable 
            alerts={alerts || []} 
            loading={alertsLoading} 
          />
        </div>
        <div className="col-span-1">
          <ActivityFeed 
            activities={activities || []} 
            loading={activitiesLoading} 
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SLAPerformance 
          metrics={slaData?.metrics || []} 
          chartData={slaData?.chartData || []} 
          loading={slaLoading} 
        />
        <ContractsOverview 
          contracts={contractsData?.contracts || []} 
          expiringCount={contractsData?.expiringCount || 0} 
          loading={contractsLoading} 
        />
      </div>
    </div>
  );
}
