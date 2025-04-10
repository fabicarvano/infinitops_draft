import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Contract {
  id: number;
  client: string;
  type: string;
  daysLeft: number;
  status: "critical" | "warning";
}

interface ContractsOverviewProps {
  contracts: Contract[];
  loading: boolean;
  expiringCount: number;
}

export default function ContractsOverview({ contracts, loading, expiringCount }: ContractsOverviewProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700 px-4 py-3">
        <CardTitle className="text-base font-semibold">Contratos e Renovações</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-slate-400">Carregando dados de contratos...</p>
          </div>
        ) : (
          <>
            {expiringCount > 0 && (
              <div className="bg-amber-500/10 text-amber-500 rounded-md p-3 mb-4 flex items-start">
                <AlertTriangle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {expiringCount} contratos expiram nos próximos 30 dias
                  </p>
                  <p className="text-xs mt-1">
                    Clientes: {contracts.slice(0, 5).map(c => c.client).join(", ")}
                    {contracts.length > 5 ? "..." : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {contracts.slice(0, 3).map((contract) => (
                <div key={contract.id} className="flex justify-between items-center p-3 bg-slate-900 rounded-md">
                  <div>
                    <p className="font-medium">{contract.client}</p>
                    <p className="text-xs text-slate-400">{contract.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      contract.status === "critical" ? "text-red-500" : "text-amber-500"
                    }`}>
                      {contract.daysLeft} dias
                    </p>
                    <p className="text-xs text-slate-400">Renovação</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Button variant="link" className="text-primary-500 text-sm hover:text-primary-400">
                Ver todos os contratos
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
