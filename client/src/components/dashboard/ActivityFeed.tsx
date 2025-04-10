import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, TicketIcon, AlertTriangle, User, Server, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ActivityType = "ticket_created" | "ticket_resolved" | "alert_generated" | "ticket_assigned" | "asset_added";

interface Activity {
  id: number;
  type: ActivityType;
  content: {
    item: string;
    subject: string;
  };
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  loading: boolean;
}

export default function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "ticket_created":
        return { 
          icon: TicketIcon, 
          bgColor: "bg-blue-50", 
          iconColor: "text-blue-600" 
        };
      case "ticket_resolved":
        return { 
          icon: Check, 
          bgColor: "bg-green-50", 
          iconColor: "text-green-600" 
        };
      case "alert_generated":
        return { 
          icon: AlertTriangle, 
          bgColor: "bg-red-50", 
          iconColor: "text-red-600" 
        };
      case "ticket_assigned":
        return { 
          icon: User, 
          bgColor: "bg-indigo-50", 
          iconColor: "text-indigo-600" 
        };
      case "asset_added":
        return { 
          icon: Server, 
          bgColor: "bg-green-50", 
          iconColor: "text-green-600" 
        };
      default:
        return { 
          icon: TicketIcon, 
          bgColor: "bg-blue-50", 
          iconColor: "text-blue-600" 
        };
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "ticket_created":
        return (
          <p className="text-sm text-slate-700">
            Novo chamado <span className="font-medium text-slate-800">{activity.content.item}</span> aberto para{" "}
            <span className="font-medium text-slate-800">{activity.content.subject}</span>
          </p>
        );
      case "ticket_resolved":
        return (
          <p className="text-sm text-slate-700">
            Chamado <span className="font-medium text-slate-800">{activity.content.item}</span> resolvido por{" "}
            <span className="font-medium text-slate-800">{activity.content.subject}</span>
          </p>
        );
      case "alert_generated":
        return (
          <p className="text-sm text-slate-700">
            Alerta <span className="font-medium text-slate-800">{activity.content.item}</span> gerado para{" "}
            <span className="font-medium text-slate-800">{activity.content.subject}</span>
          </p>
        );
      case "ticket_assigned":
        return (
          <p className="text-sm text-slate-700">
            <span className="font-medium text-slate-800">{activity.content.subject}</span> assumiu o chamado{" "}
            <span className="font-medium text-slate-800">{activity.content.item}</span>
          </p>
        );
      case "asset_added":
        return (
          <p className="text-sm text-slate-700">
            Novo ativo <span className="font-medium text-slate-800">{activity.content.item}</span> adicionado para{" "}
            <span className="font-medium text-slate-800">{activity.content.subject}</span>
          </p>
        );
      default:
        return <p className="text-sm text-slate-700">Atividade desconhecida</p>;
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="title text-lg">Atividades Recentes</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-green-700 hover:text-green-800 hover:bg-green-50 -mr-2"
        >
          Ver todas
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full px-5 py-4">
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <p className="caption">Carregando atividades...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex justify-center py-4">
                <p className="caption">Nenhuma atividade recente</p>
              </div>
            ) : (
              activities.map((activity) => {
                const { icon: Icon, bgColor, iconColor } = getActivityIcon(activity.type);
                
                return (
                  <div key={activity.id} className="flex space-x-3 pb-4 border-b border-slate-100 last:border-0">
                    <div className="flex-shrink-0">
                      <div className={`h-9 w-9 rounded-xl shadow-sm ${bgColor} flex items-center justify-center`}>
                        <Icon className={`${iconColor} h-4 w-4`} />
                      </div>
                    </div>
                    <div>
                      {getActivityText(activity)}
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
