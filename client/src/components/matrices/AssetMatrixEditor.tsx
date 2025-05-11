import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Database,
  FilePlus,
  HardDrive,
  Network,
  Save,
  Server,
  Shield,
  User,
  Users,
  BarChart3,
  Clock,
  Bell
} from "lucide-react";
import CriticalityMatrix from "./CriticalityMatrix";
import SupportTeamsConfig from "./SupportTeamsConfig";
import EscalationRulesConfig from "./EscalationRulesConfig";

// Tipos para o componente
interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
    business_criticality: number;
    description?: string;
  }[];
}

interface SupportTeam {
  name: string;
  email: string;
  phone: string;
  schedule: string;
  response_time: string;
  availability_type: "24x7" | "comercial" | "unificado" | "sem_equipe";
}

interface SupportTeamsData {
  n1?: SupportTeam;
  n2?: SupportTeam;
  n3?: SupportTeam;
  unifiedSupport?: {
    name: string;
    email: string;
    phone: string;
    schedule: string;
  };
  emergencyContact?: {
    name: string;
    email: string;
    phone: string;
    instructions: string;
  };
}

interface EscalationRule {
  id: string;
  level: string;
  maxWaitTime: number;
  severityThreshold: string;
  businessCriticalityThreshold: number;
  notificationChannels: string[];
  notificationMessage?: string;
  enabled: boolean;
}

interface AssetMatrixData {
  id?: number;
  contract_id: number;
  name: string;
  description?: string;
  
  // Dados da matriz de criticidade (armazenado como JSON stringificado)
  criticality_matrix?: string;
  
  // Dados das equipes de suporte (armazenados em campos específicos)
  support_n1_name?: string;
  support_n1_email?: string;
  support_n1_phone?: string;
  support_n1_schedule?: string;
  support_n1_response_time?: string;
  support_n1_availability_type?: string;
  
  support_n2_name?: string;
  support_n2_email?: string;
  support_n2_phone?: string;
  support_n2_schedule?: string;
  support_n2_response_time?: string;
  support_n2_availability_type?: string;
  
  support_n3_name?: string;
  support_n3_email?: string;
  support_n3_phone?: string;
  support_n3_schedule?: string;
  support_n3_response_time?: string;
  support_n3_availability_type?: string;
  
  unified_support_name?: string;
  unified_support_email?: string;
  unified_support_phone?: string;
  unified_support_schedule?: string;
  
  emergency_contact_name?: string;
  emergency_contact_email?: string;
  emergency_contact_phone?: string;
  emergency_instructions?: string;
  
  // Dados de negócio
  asset_owner_name?: string;
  asset_owner_email?: string;
  asset_owner_phone?: string;
  asset_owner_department?: string;
  
  business_contact_name?: string;
  business_contact_email?: string;
  business_contact_phone?: string;
  business_contact_hours?: string;
  business_contact_position?: string;
  
  // Dados de monitoramento
  monitoring_tool?: string;
  monitoring_url?: string;
  
  // Dados de atendimento presencial
  onsite_support_available?: boolean;
  onsite_support_address?: string;
  onsite_support_contact?: string;
  onsite_support_schedule?: string;
  
  // Regras de escalação (armazenado como JSON stringificado)
  escalation_rules?: string;
}

interface AssetMatrixEditorProps {
  initialData?: AssetMatrixData;
  contractId: number;
  contractName?: string;
  onSave?: (data: AssetMatrixData) => void;
  onCancel?: () => void;
  readonly?: boolean;
}

export default function AssetMatrixEditor({
  initialData,
  contractId,
  contractName = "Contrato",
  onSave,
  onCancel,
  readonly = false
}: AssetMatrixEditorProps) {
  // Estado principal
  const [data, setData] = useState<AssetMatrixData>(initialData || {
    contract_id: contractId,
    name: `Matriz de Ativos - ${contractName}`,
    description: `Matriz de ativos para o contrato ${contractName}`,
  });
  
  // Estado para cada seção da matriz
  const [activeTab, setActiveTab] = useState("general");
  const [criticalityMatrix, setCriticalityMatrix] = useState<{ categories: Category[] }>(
    initialData?.criticality_matrix 
      ? JSON.parse(initialData.criticality_matrix) 
      : { categories: [] }
  );
  const [supportTeams, setSupportTeams] = useState<SupportTeamsData>(
    initialData ? {
      n1: initialData.support_n1_name ? {
        name: initialData.support_n1_name,
        email: initialData.support_n1_email || "",
        phone: initialData.support_n1_phone || "",
        schedule: initialData.support_n1_schedule || "24x7",
        response_time: initialData.support_n1_response_time || "15min",
        availability_type: initialData.support_n1_availability_type as any || "24x7"
      } : undefined,
      n2: initialData.support_n2_name ? {
        name: initialData.support_n2_name,
        email: initialData.support_n2_email || "",
        phone: initialData.support_n2_phone || "",
        schedule: initialData.support_n2_schedule || "8x5",
        response_time: initialData.support_n2_response_time || "1h",
        availability_type: initialData.support_n2_availability_type as any || "comercial"
      } : undefined,
      n3: initialData.support_n3_name ? {
        name: initialData.support_n3_name,
        email: initialData.support_n3_email || "",
        phone: initialData.support_n3_phone || "",
        schedule: initialData.support_n3_schedule || "8x5",
        response_time: initialData.support_n3_response_time || "4h",
        availability_type: initialData.support_n3_availability_type as any || "comercial"
      } : undefined,
      unifiedSupport: initialData.unified_support_name ? {
        name: initialData.unified_support_name,
        email: initialData.unified_support_email || "",
        phone: initialData.unified_support_phone || "",
        schedule: initialData.unified_support_schedule || "24x7"
      } : undefined,
      emergencyContact: initialData.emergency_contact_name ? {
        name: initialData.emergency_contact_name,
        email: initialData.emergency_contact_email || "",
        phone: initialData.emergency_contact_phone || "",
        instructions: initialData.emergency_instructions || ""
      } : undefined
    } : {}
  );
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>(
    initialData?.escalation_rules 
      ? JSON.parse(initialData.escalation_rules) 
      : []
  );
  
  // Atualizar dados gerais
  const updateGeneralData = (field: keyof AssetMatrixData, value: any) => {
    if (readonly) return;
    
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Atualizar dados de contato de negócio
  const updateBusinessContact = (field: string, value: any) => {
    if (readonly) return;
    
    setData(prev => ({
      ...prev,
      [`business_contact_${field}`]: value
    }));
  };
  
  // Atualizar dados de dono do ativo
  const updateAssetOwner = (field: string, value: any) => {
    if (readonly) return;
    
    setData(prev => ({
      ...prev,
      [`asset_owner_${field}`]: value
    }));
  };
  
  // Atualizar dados de monitoramento
  const updateMonitoring = (field: string, value: any) => {
    if (readonly) return;
    
    setData(prev => ({
      ...prev,
      [`monitoring_${field}`]: value
    }));
  };
  
  // Atualizar dados de suporte presencial
  const updateOnsiteSupport = (field: string, value: any) => {
    if (readonly) return;
    
    setData(prev => ({
      ...prev,
      [`onsite_support_${field}`]: value
    }));
  };
  
  // Salvar a matriz de criticidade
  const handleSaveCriticalityMatrix = (matrix: { categories: Category[] }) => {
    setCriticalityMatrix(matrix);
  };
  
  // Salvar as equipes de suporte
  const handleSaveSupportTeams = (teams: SupportTeamsData) => {
    setSupportTeams(teams);
  };
  
  // Salvar as regras de escalação
  const handleSaveEscalationRules = (rules: EscalationRule[]) => {
    setEscalationRules(rules);
  };
  
  // Salvar toda a matriz e enviá-la para o backend
  const handleSaveMatrix = () => {
    // Converter os dados estruturados em formato compatível com o backend
    const matrixData: AssetMatrixData = {
      ...data,
      contract_id: contractId,
      
      // Converter matriz de criticidade para JSON
      criticality_matrix: JSON.stringify(criticalityMatrix),
      
      // Mapear dados de equipes para campos individuais
      ...(supportTeams.n1 && {
        support_n1_name: supportTeams.n1.name,
        support_n1_email: supportTeams.n1.email,
        support_n1_phone: supportTeams.n1.phone,
        support_n1_schedule: supportTeams.n1.schedule,
        support_n1_response_time: supportTeams.n1.response_time,
        support_n1_availability_type: supportTeams.n1.availability_type
      }),
      
      ...(supportTeams.n2 && {
        support_n2_name: supportTeams.n2.name,
        support_n2_email: supportTeams.n2.email,
        support_n2_phone: supportTeams.n2.phone,
        support_n2_schedule: supportTeams.n2.schedule,
        support_n2_response_time: supportTeams.n2.response_time,
        support_n2_availability_type: supportTeams.n2.availability_type
      }),
      
      ...(supportTeams.n3 && {
        support_n3_name: supportTeams.n3.name,
        support_n3_email: supportTeams.n3.email,
        support_n3_phone: supportTeams.n3.phone,
        support_n3_schedule: supportTeams.n3.schedule,
        support_n3_response_time: supportTeams.n3.response_time,
        support_n3_availability_type: supportTeams.n3.availability_type
      }),
      
      ...(supportTeams.unifiedSupport && {
        unified_support_name: supportTeams.unifiedSupport.name,
        unified_support_email: supportTeams.unifiedSupport.email,
        unified_support_phone: supportTeams.unifiedSupport.phone,
        unified_support_schedule: supportTeams.unifiedSupport.schedule
      }),
      
      ...(supportTeams.emergencyContact && {
        emergency_contact_name: supportTeams.emergencyContact.name,
        emergency_contact_email: supportTeams.emergencyContact.email,
        emergency_contact_phone: supportTeams.emergencyContact.phone,
        emergency_instructions: supportTeams.emergencyContact.instructions
      }),
      
      // Converter regras de escalação para JSON
      escalation_rules: JSON.stringify(escalationRules)
    };
    
    if (onSave) {
      onSave(matrixData);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col overflow-hidden">
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold">
                {readonly ? "Visualizar" : initialData ? "Editar" : "Nova"} Matriz de Ativos
              </h2>
              <p className="text-gray-500">
                Contrato: {contractName} (ID: {contractId})
              </p>
            </div>
            
            {!readonly && (
              <div className="flex space-x-2">
                {onCancel && (
                  <Button 
                    variant="outline" 
                    onClick={onCancel}
                  >
                    Cancelar
                  </Button>
                )}
                <Button 
                  variant="default" 
                  onClick={handleSaveMatrix}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Matriz
                </Button>
              </div>
            )}
          </div>
          
          {/* Alerta de dicas para preenchimento */}
          {!readonly && (
            <div className="bg-blue-50 p-3 rounded-md flex items-start mb-4">
              <AlertTriangle className="text-blue-600 h-5 w-5 mt-0.5 mr-2 shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Dicas para preenchimento da matriz:</p>
                <ul className="list-disc list-inside ml-1 mt-1">
                  <li>Preencha as categorias e criticidades para todos os tipos de ativos relevantes</li>
                  <li>Configure os contatos de suporte de acordo com o SLA do contrato</li>
                  <li>Defina os responsáveis de negócio para situações que exigem aprovação</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            <span>Dados Gerais</span>
          </TabsTrigger>
          <TabsTrigger value="criticality" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Matriz de Criticidade</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Equipes de Suporte</span>
          </TabsTrigger>
          <TabsTrigger value="escalation" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Regras de Escalação</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Aba de Dados Gerais */}
        <TabsContent value="general" className="flex-1 overflow-auto pb-8">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-medium mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="matrix-name">Nome da Matriz</Label>
                    <Input 
                      id="matrix-name" 
                      placeholder="Nome da matriz de ativos"
                      value={data.name}
                      onChange={(e) => updateGeneralData("name", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label htmlFor="matrix-description">Descrição</Label>
                    <Textarea 
                      id="matrix-description" 
                      placeholder="Descrição detalhada da matriz de ativos"
                      value={data.description || ""}
                      onChange={(e) => updateGeneralData("description", e.target.value)}
                      disabled={readonly}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              {/* Dados do Dono do Ativo */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Dono do Ativo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="asset-owner-name">Nome</Label>
                    <Input 
                      id="asset-owner-name" 
                      placeholder="Nome do responsável técnico"
                      value={data.asset_owner_name || ""}
                      onChange={(e) => updateAssetOwner("name", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="asset-owner-department">Departamento</Label>
                    <Input 
                      id="asset-owner-department" 
                      placeholder="Departamento/Setor"
                      value={data.asset_owner_department || ""}
                      onChange={(e) => updateAssetOwner("department", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="asset-owner-email">Email</Label>
                    <Input 
                      id="asset-owner-email" 
                      placeholder="Email de contato"
                      value={data.asset_owner_email || ""}
                      onChange={(e) => updateAssetOwner("email", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="asset-owner-phone">Telefone</Label>
                    <Input 
                      id="asset-owner-phone" 
                      placeholder="Telefone de contato"
                      value={data.asset_owner_phone || ""}
                      onChange={(e) => updateAssetOwner("phone", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                </div>
              </div>
              
              {/* Dados do Responsável de Negócio */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Responsável de Negócio
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="business-contact-name">Nome</Label>
                    <Input 
                      id="business-contact-name" 
                      placeholder="Nome do responsável de negócio"
                      value={data.business_contact_name || ""}
                      onChange={(e) => updateBusinessContact("name", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-contact-position">Cargo/Função</Label>
                    <Input 
                      id="business-contact-position" 
                      placeholder="Cargo ou função"
                      value={data.business_contact_position || ""}
                      onChange={(e) => updateBusinessContact("position", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-contact-email">Email</Label>
                    <Input 
                      id="business-contact-email" 
                      placeholder="Email de contato"
                      value={data.business_contact_email || ""}
                      onChange={(e) => updateBusinessContact("email", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-contact-phone">Telefone</Label>
                    <Input 
                      id="business-contact-phone" 
                      placeholder="Telefone de contato"
                      value={data.business_contact_phone || ""}
                      onChange={(e) => updateBusinessContact("phone", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-contact-hours">Horário para Contato</Label>
                    <Input 
                      id="business-contact-hours" 
                      placeholder="Ex: Dias úteis, 9h às 18h"
                      value={data.business_contact_hours || ""}
                      onChange={(e) => updateBusinessContact("hours", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                </div>
              </div>
              
              {/* Monitoramento e Suporte */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ferramenta de Monitoramento */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Database className="h-5 w-5 mr-2 text-purple-600" />
                    Monitoramento
                  </h3>
                  <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                    <div className="space-y-2">
                      <Label htmlFor="monitoring-tool">Ferramenta de Monitoramento</Label>
                      <Input 
                        id="monitoring-tool" 
                        placeholder="Ex: Zabbix, Nagios, etc."
                        value={data.monitoring_tool || ""}
                        onChange={(e) => updateMonitoring("tool", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="monitoring-url">URL de Acesso</Label>
                      <Input 
                        id="monitoring-url" 
                        placeholder="URL da ferramenta de monitoramento"
                        value={data.monitoring_url || ""}
                        onChange={(e) => updateMonitoring("url", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Suporte Presencial */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <HardDrive className="h-5 w-5 mr-2 text-red-600" />
                    Suporte Presencial
                  </h3>
                  <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="onsite-support-available">Disponível:</Label>
                      <input
                        type="checkbox"
                        id="onsite-support-available"
                        checked={data.onsite_support_available || false}
                        onChange={(e) => updateOnsiteSupport("available", e.target.checked)}
                        disabled={readonly}
                        className="h-4 w-4"
                      />
                    </div>
                    
                    {(data.onsite_support_available || false) && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="onsite-support-address">Endereço</Label>
                          <Input 
                            id="onsite-support-address" 
                            placeholder="Endereço para atendimento presencial"
                            value={data.onsite_support_address || ""}
                            onChange={(e) => updateOnsiteSupport("address", e.target.value)}
                            disabled={readonly}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="onsite-support-contact">Contato Local</Label>
                          <Input 
                            id="onsite-support-contact" 
                            placeholder="Nome e telefone do contato local"
                            value={data.onsite_support_contact || ""}
                            onChange={(e) => updateOnsiteSupport("contact", e.target.value)}
                            disabled={readonly}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="onsite-support-schedule">Horário de Funcionamento</Label>
                          <Input 
                            id="onsite-support-schedule" 
                            placeholder="Ex: Seg-Sex, 8h às 18h"
                            value={data.onsite_support_schedule || ""}
                            onChange={(e) => updateOnsiteSupport("schedule", e.target.value)}
                            disabled={readonly}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba de Matriz de Criticidade */}
        <TabsContent value="criticality" className="flex-1 overflow-auto pb-8">
          <CriticalityMatrix
            initialMatrix={criticalityMatrix}
            onSave={handleSaveCriticalityMatrix}
            readonly={readonly}
          />
        </TabsContent>
        
        {/* Aba de Equipes de Suporte */}
        <TabsContent value="support" className="flex-1 overflow-auto pb-8">
          <SupportTeamsConfig
            initialData={supportTeams}
            onSave={handleSaveSupportTeams}
            readonly={readonly}
          />
        </TabsContent>
        
        {/* Aba de Regras de Escalação */}
        <TabsContent value="escalation" className="flex-1 overflow-auto pb-8">
          <EscalationRulesConfig
            initialRules={escalationRules}
            onSave={handleSaveEscalationRules}
            readonly={readonly}
          />
        </TabsContent>
      </Tabs>
      
      {!readonly && (
        <div className="flex justify-end mt-6">
          {onCancel && (
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="mr-2"
            >
              Cancelar
            </Button>
          )}
          <Button 
            variant="default" 
            onClick={handleSaveMatrix}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Matriz
          </Button>
        </div>
      )}
    </div>
  );
}