import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Server, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ImpactedService {
  id: number;
  name: string;
  status: "critical" | "degraded" | "operational";
  client: string;
  impactedAssets: {
    id: number;
    name: string;
    alertMessage: string;
  }[];
}

interface ImpactedServicesProps {
  services: ImpactedService[];
  loading: boolean;
}

export default function ImpactedServices({ services, loading }: ImpactedServicesProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge className="bg-red-100 text-red-700">Crítico</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-700">Degradado</Badge>;
      case "operational":
        return <Badge className="bg-green-100 text-green-700">Operacional</Badge>;
      default:
        return <Badge className="bg-slate-100">Desconhecido</Badge>;
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-red-50 p-2 rounded-lg mr-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="title text-lg">Serviços Impactados</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
        >
          Ver todos
        </Button>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse h-20 bg-slate-100 rounded-md"></div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-slate-500">Nenhum serviço impactado no momento</p>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {service.status === "critical" ? (
                        <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      ) : (
                        <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-xs text-slate-500">{service.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(service.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0 h-8 w-8"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-slate-50 p-3">
                  <div className="text-xs font-medium text-slate-500 mb-2">Ativos impactados:</div>
                  <div className="space-y-2">
                    {service.impactedAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center text-sm">
                        <Server className="h-3 w-3 text-slate-400 mr-2" />
                        <span className="font-medium mr-2">{asset.name}:</span>
                        <span className="text-slate-600">{asset.alertMessage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}