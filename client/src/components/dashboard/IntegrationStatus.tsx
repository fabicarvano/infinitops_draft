import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export interface Integration {
  id: number;
  name: string;
  type: string;
  status: "connected" | "disconnected" | "error";
  lastCheck: string;
}

interface IntegrationStatusProps {
  integrations: Integration[];
  loading: boolean;
}

export default function IntegrationStatus({ integrations, loading }: IntegrationStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "disconnected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "OK";
      case "disconnected":
        return "Sem conexão";
      case "error":
        return "Erro";
      default:
        return "Desconhecido";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "disconnected":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      case "error":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-200";
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="title text-lg">Status das Integrações</h3>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse h-12 bg-slate-100 rounded-md"></div>
            ))}
          </div>
        ) : integrations.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-slate-500">Nenhuma integração configurada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center mr-3">
                    <span className="font-medium">{integration.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-xs text-slate-500">{integration.type}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge className={getStatusColor(integration.status)}>
                    <span className="flex items-center">
                      {getStatusIcon(integration.status)}
                      <span className="ml-1">{getStatusText(integration.status)}</span>
                    </span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}