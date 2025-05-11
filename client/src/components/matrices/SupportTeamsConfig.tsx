import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  PhoneCall, 
  Mail, 
  Clock, 
  Bell, 
  User, 
  Calendar, 
  Clock8, 
  CheckCircle2, 
  X
} from "lucide-react";

// Tipos para os dados de configuração
interface SupportTeam {
  name: string;
  email: string;
  phone: string;
  schedule: string;
  response_time: string;
  availability_type: "24x7" | "comercial" | "unificado" | "sem_equipe";
}

interface EmergencyContact {
  name: string;
  email: string;
  phone: string;
  instructions: string;
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
  emergencyContact?: EmergencyContact;
}

interface SupportTeamsConfigProps {
  initialData?: SupportTeamsData;
  onSave?: (data: SupportTeamsData) => void;
  readonly?: boolean;
}

// Opções para horários de disponibilidade
const scheduleOptions = [
  { value: "24x7", label: "24x7 (24 horas, todos os dias)" },
  { value: "8x5", label: "8x5 (Dias úteis, 8h às 17h)" },
  { value: "12x7", label: "12x7 (8h às 20h, todos os dias)" },
  { value: "custom", label: "Personalizado" }
];

// Opções para tempos de resposta
const responseTimeOptions = [
  { value: "15min", label: "15 minutos" },
  { value: "30min", label: "30 minutos" },
  { value: "1h", label: "1 hora" },
  { value: "2h", label: "2 horas" },
  { value: "4h", label: "4 horas" },
  { value: "8h", label: "8 horas" },
  { value: "24h", label: "24 horas" }
];

// Opções para tipos de disponibilidade
const availabilityTypeOptions = [
  { value: "24x7", label: "24x7 - Equipe dedicada 24 horas" },
  { value: "comercial", label: "Horário comercial" },
  { value: "unificado", label: "Plantão unificado para todos os níveis" },
  { value: "sem_equipe", label: "Sem equipe disponível" }
];

export default function SupportTeamsConfig({ 
  initialData,
  onSave,
  readonly = false
}: SupportTeamsConfigProps) {
  // Estado para os dados de configuração
  const [data, setData] = useState<SupportTeamsData>(initialData || {
    n1: {
      name: "Equipe de Suporte N1",
      email: "suporte.n1@empresa.com.br",
      phone: "(11) 5555-1111",
      schedule: "24x7",
      response_time: "15min",
      availability_type: "24x7"
    },
    n2: {
      name: "Equipe de Suporte N2",
      email: "suporte.n2@empresa.com.br",
      phone: "(11) 5555-2222",
      schedule: "8x5",
      response_time: "1h",
      availability_type: "comercial"
    },
    n3: {
      name: "Equipe de Suporte N3",
      email: "suporte.n3@empresa.com.br",
      phone: "(11) 5555-3333",
      schedule: "8x5",
      response_time: "4h",
      availability_type: "comercial"
    },
    unifiedSupport: {
      name: "Plantão Unificado",
      email: "plantao@empresa.com.br",
      phone: "(11) 99999-8888",
      schedule: "24x7"
    },
    emergencyContact: {
      name: "Centro de Operações",
      email: "emergencia@empresa.com.br",
      phone: "(11) 5555-9999",
      instructions: "Em caso de emergência, ligue para o número acima e informe o código do ativo."
    }
  });
  
  // Estado para rastrear aba ativa
  const [activeTab, setActiveTab] = useState("n1");
  
  // Função para atualizar valores de N1
  const updateN1 = (field: keyof SupportTeam, value: string) => {
    if (readonly) return;
    
    setData(prev => ({
      ...prev,
      n1: {
        ...(prev.n1 || {
          name: "",
          email: "",
          phone: "",
          schedule: "24x7",
          response_time: "15min",
          availability_type: "24x7"
        }),
        [field]: value
      }
    }));
  };
  
  // Função para atualizar valores de N2
  const updateN2 = (field: keyof SupportTeam, value: string) => {
    if (readonly) return;
    
    setData(prev => ({
      ...prev,
      n2: {
        ...(prev.n2 || {
          name: "",
          email: "",
          phone: "",
          schedule: "8x5",
          response_time: "1h",
          availability_type: "comercial"
        }),
        [field]: value
      }
    }));
  };
  
  // Função para atualizar valores de N3
  const updateN3 = (field: keyof SupportTeam, value: string) => {
    if (readonly) return;
    
    setData(prev => ({
      ...prev,
      n3: {
        ...(prev.n3 || {
          name: "",
          email: "",
          phone: "",
          schedule: "8x5",
          response_time: "4h",
          availability_type: "comercial"
        }),
        [field]: value
      }
    }));
  };
  
  // Função para atualizar valores de Plantão Unificado
  const updateUnifiedSupport = (field: keyof typeof data.unifiedSupport, value: string) => {
    if (readonly) return;
    
    setData(prev => ({
      ...prev,
      unifiedSupport: {
        ...(prev.unifiedSupport || {
          name: "",
          email: "",
          phone: "",
          schedule: "24x7"
        }),
        [field]: value
      }
    }));
  };
  
  // Função para atualizar valores de Contato de Emergência
  const updateEmergencyContact = (field: keyof EmergencyContact, value: string) => {
    if (readonly) return;
    
    setData(prev => ({
      ...prev,
      emergencyContact: {
        ...(prev.emergencyContact || {
          name: "",
          email: "",
          phone: "",
          instructions: ""
        }),
        [field]: value
      }
    }));
  };
  
  // Função para salvar os dados
  const handleSave = () => {
    if (onSave) {
      onSave(data);
    }
  };
  
  // Renderizar badge de disponibilidade
  const renderAvailabilityBadge = (type?: "24x7" | "comercial" | "unificado" | "sem_equipe") => {
    switch (type) {
      case "24x7":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <Clock className="h-3 w-3 mr-1" />
            Suporte 24x7
          </Badge>
        );
      case "comercial":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <Calendar className="h-3 w-3 mr-1" />
            Horário Comercial
          </Badge>
        );
      case "unificado":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            <User className="h-3 w-3 mr-1" />
            Plantão Unificado
          </Badge>
        );
      case "sem_equipe":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <X className="h-3 w-3 mr-1" />
            Sem Equipe Disponível
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Configuração de Equipes de Suporte</CardTitle>
          {!readonly && (
            <Button onClick={handleSave}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          )}
        </div>
        <CardDescription>
          Configure as equipes de suporte, horários de disponibilidade e tempos de resposta para cada nível.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="n1" className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">N1</Badge>
              <span>Suporte Básico</span>
            </TabsTrigger>
            <TabsTrigger value="n2" className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">N2</Badge>
              <span>Suporte Técnico</span>
            </TabsTrigger>
            <TabsTrigger value="n3" className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">N3</Badge>
              <span>Engenharia</span>
            </TabsTrigger>
            <TabsTrigger value="unified" className="flex items-center gap-2">
              <Badge className="bg-amber-100 text-amber-800">P</Badge>
              <span>Plantão</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">E</Badge>
              <span>Emergência</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Conteúdo da aba N1 */}
          <TabsContent value="n1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Nível 1 - Suporte Básico</CardTitle>
                {renderAvailabilityBadge(data.n1?.availability_type)}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="n1-name">Nome da Equipe</Label>
                    <Input 
                      id="n1-name" 
                      placeholder="Nome da equipe N1"
                      value={data.n1?.name || ""}
                      onChange={(e) => updateN1("name", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n1-availability">Tipo de Disponibilidade</Label>
                    <Select 
                      value={data.n1?.availability_type || "24x7"}
                      onValueChange={(value) => updateN1("availability_type", value as any)}
                      disabled={readonly}
                    >
                      <SelectTrigger id="n1-availability">
                        <SelectValue placeholder="Selecione o tipo de disponibilidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {availabilityTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n1-email">Email de Contato</Label>
                    <div className="flex">
                      <div className="bg-gray-100 p-2 rounded-l-md border border-r-0 border-gray-300">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input 
                        id="n1-email" 
                        placeholder="email@empresa.com.br"
                        className="rounded-l-none"
                        value={data.n1?.email || ""}
                        onChange={(e) => updateN1("email", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n1-phone">Telefone de Contato</Label>
                    <div className="flex">
                      <div className="bg-gray-100 p-2 rounded-l-md border border-r-0 border-gray-300">
                        <PhoneCall className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input 
                        id="n1-phone" 
                        placeholder="(00) 0000-0000"
                        className="rounded-l-none"
                        value={data.n1?.phone || ""}
                        onChange={(e) => updateN1("phone", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n1-schedule">Horário de Disponibilidade</Label>
                    <Select 
                      value={data.n1?.schedule || "24x7"}
                      onValueChange={(value) => updateN1("schedule", value)}
                      disabled={readonly}
                    >
                      <SelectTrigger id="n1-schedule">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {scheduleOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n1-response-time">Tempo de Resposta</Label>
                    <Select 
                      value={data.n1?.response_time || "15min"}
                      onValueChange={(value) => updateN1("response_time", value)}
                      disabled={readonly}
                    >
                      <SelectTrigger id="n1-response-time">
                        <SelectValue placeholder="Selecione o tempo de resposta" />
                      </SelectTrigger>
                      <SelectContent>
                        {responseTimeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-md mt-4">
                  <div className="flex items-start">
                    <Bell className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-blue-700">Sobre o Nível 1</h4>
                      <p className="text-sm text-blue-700">
                        A equipe de Nível 1 é responsável pelo primeiro atendimento, triagem, e 
                        resolução de problemas básicos. Defina um tempo de resposta curto para 
                        garantir um atendimento inicial rápido.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Conteúdo da aba N2 */}
          <TabsContent value="n2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Nível 2 - Suporte Técnico</CardTitle>
                {renderAvailabilityBadge(data.n2?.availability_type)}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="n2-name">Nome da Equipe</Label>
                    <Input 
                      id="n2-name" 
                      placeholder="Nome da equipe N2"
                      value={data.n2?.name || ""}
                      onChange={(e) => updateN2("name", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n2-availability">Tipo de Disponibilidade</Label>
                    <Select 
                      value={data.n2?.availability_type || "comercial"}
                      onValueChange={(value) => updateN2("availability_type", value as any)}
                      disabled={readonly}
                    >
                      <SelectTrigger id="n2-availability">
                        <SelectValue placeholder="Selecione o tipo de disponibilidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {availabilityTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n2-email">Email de Contato</Label>
                    <div className="flex">
                      <div className="bg-gray-100 p-2 rounded-l-md border border-r-0 border-gray-300">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input 
                        id="n2-email" 
                        placeholder="email@empresa.com.br"
                        className="rounded-l-none"
                        value={data.n2?.email || ""}
                        onChange={(e) => updateN2("email", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n2-phone">Telefone de Contato</Label>
                    <div className="flex">
                      <div className="bg-gray-100 p-2 rounded-l-md border border-r-0 border-gray-300">
                        <PhoneCall className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input 
                        id="n2-phone" 
                        placeholder="(00) 0000-0000"
                        className="rounded-l-none"
                        value={data.n2?.phone || ""}
                        onChange={(e) => updateN2("phone", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n2-schedule">Horário de Disponibilidade</Label>
                    <Select 
                      value={data.n2?.schedule || "8x5"}
                      onValueChange={(value) => updateN2("schedule", value)}
                      disabled={readonly}
                    >
                      <SelectTrigger id="n2-schedule">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {scheduleOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n2-response-time">Tempo de Resposta</Label>
                    <Select 
                      value={data.n2?.response_time || "1h"}
                      onValueChange={(value) => updateN2("response_time", value)}
                      disabled={readonly}
                    >
                      <SelectTrigger id="n2-response-time">
                        <SelectValue placeholder="Selecione o tempo de resposta" />
                      </SelectTrigger>
                      <SelectContent>
                        {responseTimeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-md mt-4">
                  <div className="flex items-start">
                    <Bell className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-green-700">Sobre o Nível 2</h4>
                      <p className="text-sm text-green-700">
                        A equipe de Nível 2 é especializada em problemas técnicos de média complexidade.
                        Geralmente é acionada após uma tentativa sem sucesso pelo Nível 1 ou para
                        problemas específicos de infraestrutura.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Conteúdo da aba N3 */}
          <TabsContent value="n3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Nível 3 - Engenharia Avançada</CardTitle>
                {renderAvailabilityBadge(data.n3?.availability_type)}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="n3-name">Nome da Equipe</Label>
                    <Input 
                      id="n3-name" 
                      placeholder="Nome da equipe N3"
                      value={data.n3?.name || ""}
                      onChange={(e) => updateN3("name", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n3-availability">Tipo de Disponibilidade</Label>
                    <Select 
                      value={data.n3?.availability_type || "comercial"}
                      onValueChange={(value) => updateN3("availability_type", value as any)}
                      disabled={readonly}
                    >
                      <SelectTrigger id="n3-availability">
                        <SelectValue placeholder="Selecione o tipo de disponibilidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {availabilityTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n3-email">Email de Contato</Label>
                    <div className="flex">
                      <div className="bg-gray-100 p-2 rounded-l-md border border-r-0 border-gray-300">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input 
                        id="n3-email" 
                        placeholder="email@empresa.com.br"
                        className="rounded-l-none"
                        value={data.n3?.email || ""}
                        onChange={(e) => updateN3("email", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n3-phone">Telefone de Contato</Label>
                    <div className="flex">
                      <div className="bg-gray-100 p-2 rounded-l-md border border-r-0 border-gray-300">
                        <PhoneCall className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input 
                        id="n3-phone" 
                        placeholder="(00) 0000-0000"
                        className="rounded-l-none"
                        value={data.n3?.phone || ""}
                        onChange={(e) => updateN3("phone", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n3-schedule">Horário de Disponibilidade</Label>
                    <Select 
                      value={data.n3?.schedule || "8x5"}
                      onValueChange={(value) => updateN3("schedule", value)}
                      disabled={readonly}
                    >
                      <SelectTrigger id="n3-schedule">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {scheduleOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="n3-response-time">Tempo de Resposta</Label>
                    <Select 
                      value={data.n3?.response_time || "4h"}
                      onValueChange={(value) => updateN3("response_time", value)}
                      disabled={readonly}
                    >
                      <SelectTrigger id="n3-response-time">
                        <SelectValue placeholder="Selecione o tempo de resposta" />
                      </SelectTrigger>
                      <SelectContent>
                        {responseTimeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-md mt-4">
                  <div className="flex items-start">
                    <Bell className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-purple-700">Sobre o Nível 3</h4>
                      <p className="text-sm text-purple-700">
                        A equipe de Nível 3 é composta por especialistas com conhecimento avançado
                        e é acionada apenas para problemas complexos ou críticos que não puderam
                        ser resolvidos pelos níveis anteriores.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Conteúdo da aba Plantão Unificado */}
          <TabsContent value="unified">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plantão Unificado</CardTitle>
                <CardDescription>
                  Configure informações de contato para o plantão unificado, que atende todos os níveis
                  de suporte fora do horário comercial ou em situações especiais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unified-name">Nome do Responsável</Label>
                    <Input 
                      id="unified-name" 
                      placeholder="Nome do plantonista"
                      value={data.unifiedSupport?.name || ""}
                      onChange={(e) => updateUnifiedSupport("name", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unified-schedule">Horário de Disponibilidade</Label>
                    <Select 
                      value={data.unifiedSupport?.schedule || "24x7"}
                      onValueChange={(value) => updateUnifiedSupport("schedule", value)}
                      disabled={readonly}
                    >
                      <SelectTrigger id="unified-schedule">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {scheduleOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unified-email">Email de Contato</Label>
                    <div className="flex">
                      <div className="bg-gray-100 p-2 rounded-l-md border border-r-0 border-gray-300">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input 
                        id="unified-email" 
                        placeholder="plantao@empresa.com.br"
                        className="rounded-l-none"
                        value={data.unifiedSupport?.email || ""}
                        onChange={(e) => updateUnifiedSupport("email", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unified-phone">Telefone de Plantão</Label>
                    <div className="flex">
                      <div className="bg-gray-100 p-2 rounded-l-md border border-r-0 border-gray-300">
                        <PhoneCall className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input 
                        id="unified-phone" 
                        placeholder="(00) 00000-0000"
                        className="rounded-l-none"
                        value={data.unifiedSupport?.phone || ""}
                        onChange={(e) => updateUnifiedSupport("phone", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-amber-50 rounded-md mt-4">
                  <div className="flex items-start">
                    <Clock8 className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-amber-700">Sobre o Plantão Unificado</h4>
                      <p className="text-sm text-amber-700">
                        O plantão unificado é uma alternativa para atendimento fora do horário comercial,
                        com um único profissional respondendo por todos os níveis de suporte.
                        Ideal para períodos noturnos, feriados ou finais de semana.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Conteúdo da aba Contatos de Emergência */}
          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contatos de Emergência</CardTitle>
                <CardDescription>
                  Configure informações de contato para situações de emergência quando nenhuma
                  equipe regular de suporte está disponível.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency-name">Nome do Contato</Label>
                    <Input 
                      id="emergency-name" 
                      placeholder="Nome do contato de emergência"
                      value={data.emergencyContact?.name || ""}
                      onChange={(e) => updateEmergencyContact("name", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergency-email">Email de Emergência</Label>
                    <div className="flex">
                      <div className="bg-gray-100 p-2 rounded-l-md border border-r-0 border-gray-300">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input 
                        id="emergency-email" 
                        placeholder="emergencia@empresa.com.br"
                        className="rounded-l-none"
                        value={data.emergencyContact?.email || ""}
                        onChange={(e) => updateEmergencyContact("email", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergency-phone">Telefone de Emergência</Label>
                    <div className="flex">
                      <div className="bg-gray-100 p-2 rounded-l-md border border-r-0 border-gray-300">
                        <PhoneCall className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input 
                        id="emergency-phone" 
                        placeholder="(00) 0000-0000"
                        className="rounded-l-none"
                        value={data.emergencyContact?.phone || ""}
                        onChange={(e) => updateEmergencyContact("phone", e.target.value)}
                        disabled={readonly}
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="emergency-instructions">Instruções de Emergência</Label>
                    <Input 
                      id="emergency-instructions" 
                      placeholder="Instruções para contato em caso de emergência"
                      value={data.emergencyContact?.instructions || ""}
                      onChange={(e) => updateEmergencyContact("instructions", e.target.value)}
                      disabled={readonly}
                    />
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded-md mt-4">
                  <div className="flex items-start">
                    <Bell className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-red-700">Sobre Contatos de Emergência</h4>
                      <p className="text-sm text-red-700">
                        Os contatos de emergência são utilizados em situações críticas quando 
                        nenhuma equipe regular está disponível. Certifique-se de fornecer instruções
                        claras sobre como proceder em emergências.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}