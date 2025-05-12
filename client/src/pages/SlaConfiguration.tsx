import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SLAMatrixEditor } from "@/components/sla/SLAMatrixEditor";
import { EscalationMatrixEditor } from "@/components/sla/EscalationMatrixEditor";
import { SLAAdjustmentSettings } from "@/components/sla/SLAAdjustmentSettings";
import { SupportCalendarEditor } from "@/components/sla/SupportCalendarEditor";
import { Gauge, Clock, Layers, Calendar, ArrowUpCircle } from "lucide-react";

export default function SlaConfiguration() {
  const [activeTab, setActiveTab] = useState("sla-matrix");
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurações de SLA</h1>
        <p className="text-slate-500">
          Configure as matrizes de SLA, regras de escalonamento e ajustes dinâmicos de prazo
        </p>
      </div>
      
      <Tabs 
        defaultValue="sla-matrix" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-8 w-full justify-start">
          <TabsTrigger value="sla-matrix" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>Matriz de SLA</span>
          </TabsTrigger>
          <TabsTrigger value="escalation" className="flex items-center">
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            <span>Escalonamento</span>
          </TabsTrigger>
          <TabsTrigger value="adjustment" className="flex items-center">
            <Gauge className="mr-2 h-4 w-4" />
            <span>Ajustes Dinâmicos</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendário de Suporte</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sla-matrix" className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Layers className="mr-2 h-5 w-5 text-blue-600" />
              Matriz de Níveis de Serviço
            </h2>
            <p className="text-slate-500 mb-6">
              Configure os tempos de resposta e resolução para cada nível de serviço e prioridade.
              Estas configurações serão aplicadas automaticamente aos chamados conforme o contrato do cliente.
            </p>
            
            <SLAMatrixEditor />
          </div>
        </TabsContent>
        
        <TabsContent value="escalation" className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ArrowUpCircle className="mr-2 h-5 w-5 text-blue-600" />
              Matriz de Escalonamento
            </h2>
            <p className="text-slate-500 mb-6">
              Configure as regras de escalonamento automático para cada nível de suporte.
              Defina quando um chamado deve ser escalado e para qual nível.
            </p>
            
            <EscalationMatrixEditor />
          </div>
        </TabsContent>
        
        <TabsContent value="adjustment" className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Gauge className="mr-2 h-5 w-5 text-blue-600" />
              Ajustes Dinâmicos de SLA
            </h2>
            <p className="text-slate-500 mb-6">
              Configure os fatores de ajuste para criticidade de negócio, janelas de manutenção
              e tratamento de feriados e finais de semana.
            </p>
            
            <SLAAdjustmentSettings />
          </div>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              Calendário de Suporte
            </h2>
            <p className="text-slate-500 mb-6">
              Configure o horário de funcionamento de cada equipe de suporte e defina
              feriados que afetarão o cálculo de prazos de SLA.
            </p>
            
            <SupportCalendarEditor />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}