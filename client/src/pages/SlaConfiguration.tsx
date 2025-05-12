import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronLeft, Save, Plus } from "lucide-react";

export default function SlaConfiguration() {
  const [openAdvancedModal, setOpenAdvancedModal] = useState(false);
  
  // Exemplos simplificados da matriz de SLA - será substituído pelo real SLAMatrixEditor
  const slaMatrix = [
    {
      contract: "Platinum",
      priorities: [
        { priority: "Crítica", firstResponse: "0.5h", resolution: "4h" },
        { priority: "Alta", firstResponse: "1h", resolution: "6h" },
        { priority: "Média", firstResponse: "2h", resolution: "12h" },
        { priority: "Baixa", firstResponse: "4h", resolution: "24h" },
      ]
    },
    {
      contract: "Premium",
      priorities: [
        { priority: "Crítica", firstResponse: "1h", resolution: "6h" },
        { priority: "Alta", firstResponse: "2h", resolution: "12h" },
        { priority: "Média", firstResponse: "4h", resolution: "24h" },
        { priority: "Baixa", firstResponse: "8h", resolution: "48h" },
      ]
    },
    {
      contract: "Standard",
      priorities: [
        { priority: "Crítica", firstResponse: "2h", resolution: "12h" },
        { priority: "Alta", firstResponse: "4h", resolution: "24h" },
        { priority: "Média", firstResponse: "8h", resolution: "48h" },
        { priority: "Baixa", firstResponse: "16h", resolution: "72h" },
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Configuração de SLA</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Nível
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700 px-6 py-4">
          <CardTitle className="text-xl">Matriz de SLA por Contrato</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {slaMatrix.map((contractSla) => (
              <div key={contractSla.contract} className="space-y-2">
                <h3 className="text-lg font-medium text-slate-200">{contractSla.contract}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-700 text-slate-200">
                        <th className="px-4 py-2 text-left">Prioridade</th>
                        <th className="px-4 py-2 text-left">Primeira Resposta</th>
                        <th className="px-4 py-2 text-left">Resolução</th>
                        <th className="px-4 py-2 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contractSla.priorities.map((priority) => (
                        <tr 
                          key={priority.priority} 
                          className="border-t border-slate-700 hover:bg-slate-750 transition-colors"
                        >
                          <td className="px-4 py-3 text-slate-200">{priority.priority}</td>
                          <td className="px-4 py-3">{priority.firstResponse}</td>
                          <td className="px-4 py-3">{priority.resolution}</td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="sm">Editar</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700 px-6 py-4">
          <CardTitle className="text-xl">Regras de Cálculo de SLA</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-slate-200 mb-2">Horário de Suporte</h3>
              <p className="text-slate-400 mb-4">
                Segunda a Sexta: 08:00 - 18:00<br />
                Sábado: 08:00 - 13:00<br />
                Domingo e Feriados: Fechado
              </p>
              <Button variant="outline" size="sm">Editar Horário</Button>
            </div>
            <div>
              <h3 className="font-medium text-slate-200 mb-2">Regras de Pausas</h3>
              <p className="text-slate-400 mb-4">
                • SLA é automaticamente pausado fora do horário de suporte<br />
                • SLA é pausado quando o status é "Aguardando Cliente"<br />
                • SLA é pausado manualmente por um técnico com justificativa
              </p>
              <Button variant="outline" size="sm">Editar Regras</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Todas as Alterações</Button>
      </div>
    </div>
  );
}