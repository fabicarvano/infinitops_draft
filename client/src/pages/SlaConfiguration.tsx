import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SLAMatrixEditor } from "@/components/sla/SLAMatrixEditor";
import { AlertCircle, Info } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SlaConfiguration() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("sla-matrix");
  
  const handleSaveMatrices = (matrices: any) => {
    toast({
      title: "Configurações de SLA salvas",
      description: "As matrizes de SLA foram atualizadas com sucesso.",
      variant: "default",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configurações de SLA</h1>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Atenção</AlertTitle>
        <AlertDescription>
          Alterações nas matrizes de SLA afetarão os prazos de todos os chamados futuros.
          Chamados existentes não serão afetados por estas mudanças.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="sla-matrix" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="sla-matrix">Matrizes de SLA</TabsTrigger>
          <TabsTrigger value="business-hours">Horários de Atendimento</TabsTrigger>
          <TabsTrigger value="escalation-settings">Configurações de Escalonamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sla-matrix" className="space-y-6 pt-6">
          <SLAMatrixEditor onSave={handleSaveMatrices} />
        </TabsContent>
        
        <TabsContent value="business-hours" className="space-y-6 pt-6">
          <div className="bg-slate-50 p-8 rounded-lg text-center">
            <div className="w-12 h-12 rounded-full bg-slate-200 mx-auto flex items-center justify-center mb-4">
              <Info className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium">Configurações de Horário de Atendimento</h3>
            <p className="text-slate-600 mt-2 max-w-md mx-auto">
              Esta seção permitirá configurar os horários específicos de atendimento para cada tipo de contrato.
              Funcionalidade em desenvolvimento.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="escalation-settings" className="space-y-6 pt-6">
          <div className="bg-slate-50 p-8 rounded-lg text-center">
            <div className="w-12 h-12 rounded-full bg-slate-200 mx-auto flex items-center justify-center mb-4">
              <Info className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium">Configurações de Escalonamento Avançadas</h3>
            <p className="text-slate-600 mt-2 max-w-md mx-auto">
              Esta seção permitirá configurar regras avançadas de escalonamento, incluindo notificações
              automáticas e integrações com sistemas externos.
              Funcionalidade em desenvolvimento.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}