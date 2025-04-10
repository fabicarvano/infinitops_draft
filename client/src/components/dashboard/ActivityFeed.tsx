import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, TicketIcon, AlertTriangle, User, Server } from "lucide-react";

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
          bgColor: "bg-primary-500/20", 
          iconColor: "text-primary-500" 
        };
      case "ticket_resolved":
        return { 
          icon: Check, 
          bgColor: "bg-emerald-500/20", 
          iconColor: "text-emerald-500" 
        };
      case "alert_generated":
        return { 
          icon: AlertTriangle, 
          bgColor: "bg-amber-500/20", 
          iconColor: "text-amber-500" 
        };
      case "ticket_assigned":
        return { 
          icon: User, 
          bgColor: "bg-primary-500/20", 
          iconColor: "text-primary-500" 
        };
      case "asset_added":
        return { 
          icon: Server, 
          bgColor: "bg-emerald-500/20", 
          iconColor: "text-emerald-500" 
        };
      default:
        return { 
          icon: TicketIcon, 
          bgColor: "bg-primary-500/20", 
          iconColor: "text-primary-500" 
        };
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "ticket_created":
        return (
          <p className="text-sm">
            Novo chamado <span className="font-medium">{activity.content.item}</span> aberto para{" "}
            <span className="font-medium">{activity.content.subject}</span>
          </p>
        );
      case "ticket_resolved":
        return (
          <p className="text-sm">
            Chamado <span className="font-medium">{activity.content.item}</span> resolvido por{" "}
            <span className="font-medium">{activity.content.subject}</span>
          </p>
        );
      case "alert_generated":
        return (
          <p className="text-sm">
            Alerta <span className="font-medium">{activity.content.item}</span> gerado para{" "}
            <span className="font-medium">{activity.content.subject}</span>
          </p>
        );
      case "ticket_assigned":
        return (
          <p className="text-sm">
            <span className="font-medium">{activity.content.subject}</span> assumiu o chamado{" "}
            <span className="font-medium">{activity.content.item}</span>
          </p>
        );
      case "asset_added":
        return (
          <p className="text-sm">
            Novo ativo <span className="font-medium">{activity.content.item}</span> adicionado para{" "}
            <span className="font-medium">{activity.content.subject}</span>
          </p>
        );
      default:
        return <p className="text-sm">Atividade desconhecida</p>;
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 h-full">
      <CardHeader className="border-b border-slate-700 px-4 py-3">
        <CardTitle className="text-base font-semibold">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100%-60px)] p-4">
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <p className="text-slate-400">Carregando atividades...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex justify-center py-4">
                <p className="text-slate-400">Nenhuma atividade recente</p>
              </div>
            ) : (
              activities.map((activity) => {
                const { icon: Icon, bgColor, iconColor } = getActivityIcon(activity.type);
                
                return (
                  <div key={activity.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full ${bgColor} flex items-center justify-center`}>
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
      </CardContent>
    </Card>
  );
}
