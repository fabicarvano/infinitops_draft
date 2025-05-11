import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  ArrowDown, 
  ArrowRight, 
  Clock, 
  BellRing, 
  CheckCircle2,
  Save,
  AlertTriangle,
  Edit2,
  RefreshCw,
  Users,
  X
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Tipos para a configuração de escalação
interface EscalationRule {
  id: string;
  level: string; // "N1", "N2", "N3"
  maxWaitTime: number; // Em minutos
  severityThreshold: string; // "low", "medium", "high", "critical"
  businessCriticalityThreshold: number; // 0-5
  notificationChannels: string[]; // ["email", "sms", "whatsapp"]
  notificationMessage?: string;
  enabled: boolean;
}

interface EscalationRulesConfigProps {
  initialRules?: EscalationRule[];
  onSave?: (rules: EscalationRule[]) => void;
  readonly?: boolean;
}

// Níveis de suporte
const supportLevels = [
  { value: "N1", label: "Nível 1 (Suporte Básico)" },
  { value: "N2", label: "Nível 2 (Suporte Técnico)" },
  { value: "N3", label: "Nível 3 (Engenharia Avançada)" }
];

// Limiares de severidade
const severityThresholds = [
  { value: "low", label: "Baixa", color: "bg-blue-100 text-blue-800" },
  { value: "medium", label: "Média", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "Alta", color: "bg-orange-100 text-orange-800" },
  { value: "critical", label: "Crítica", color: "bg-red-100 text-red-800" }
];

// Canais de notificação
const notificationChannels = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "teams", label: "Microsoft Teams" }
];

// Regras predefinidas
const defaultRules: EscalationRule[] = [
  {
    id: "rule-1",
    level: "N1",
    maxWaitTime: 15,
    severityThreshold: "high",
    businessCriticalityThreshold: 3,
    notificationChannels: ["email"],
    notificationMessage: "Alerta pendente há mais de 15 minutos sem ação.",
    enabled: true
  },
  {
    id: "rule-2",
    level: "N2",
    maxWaitTime: 30,
    severityThreshold: "critical",
    businessCriticalityThreshold: 4,
    notificationChannels: ["email", "sms"],
    notificationMessage: "Alerta crítico pendente há mais de 30 minutos. Escalando para N2.",
    enabled: true
  },
  {
    id: "rule-3",
    level: "N3",
    maxWaitTime: 60,
    severityThreshold: "critical",
    businessCriticalityThreshold: 5,
    notificationChannels: ["email", "sms", "whatsapp"],
    notificationMessage: "URGENTE: Alerta crítico pendente há mais de 1 hora. Escalando para N3.",
    enabled: true
  }
];

export default function EscalationRulesConfig({
  initialRules,
  onSave,
  readonly = false
}: EscalationRulesConfigProps) {
  // Estado para as regras de escalação
  const [rules, setRules] = useState<EscalationRule[]>(initialRules || defaultRules);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  
  // Estado para a regra temporária sendo editada
  const [tempRule, setTempRule] = useState<EscalationRule | null>(null);
  
  // Iniciar a edição de uma regra
  const startEditing = (ruleId: string) => {
    if (readonly) return;
    
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    
    setEditingRule(ruleId);
    setTempRule({ ...rule });
  };
  
  // Salvar a edição de uma regra
  const saveEditing = () => {
    if (!editingRule || !tempRule || readonly) return;
    
    setRules(prev => 
      prev.map(rule => 
        rule.id === editingRule ? tempRule : rule
      )
    );
    
    setEditingRule(null);
    setTempRule(null);
  };
  
  // Cancelar a edição
  const cancelEditing = () => {
    setEditingRule(null);
    setTempRule(null);
  };
  
  // Adicionar nova regra
  const handleAddRule = () => {
    if (readonly) return;
    
    const newRule: EscalationRule = {
      id: `rule-${Date.now()}`,
      level: "N1",
      maxWaitTime: 15,
      severityThreshold: "medium",
      businessCriticalityThreshold: 3,
      notificationChannels: ["email"],
      notificationMessage: "Alerta pendente há tempo definido. Verificar.",
      enabled: true
    };
    
    setRules(prev => [...prev, newRule]);
    startEditing(newRule.id);
  };
  
  // Remover regra
  const handleRemoveRule = (ruleId: string) => {
    if (readonly) return;
    
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
    
    if (editingRule === ruleId) {
      setEditingRule(null);
      setTempRule(null);
    }
  };
  
  // Alternar o estado de ativação de uma regra
  const toggleRuleEnabled = (ruleId: string) => {
    if (readonly) return;
    
    setRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };
  
  // Atualizar os canais de notificação de uma regra temporária
  const toggleNotificationChannel = (channel: string) => {
    if (!tempRule || readonly) return;
    
    const hasChannel = tempRule.notificationChannels.includes(channel);
    
    setTempRule({
      ...tempRule,
      notificationChannels: hasChannel
        ? tempRule.notificationChannels.filter(c => c !== channel)
        : [...tempRule.notificationChannels, channel]
    });
  };
  
  // Atualizar um campo da regra temporária
  const updateTempRule = (field: keyof EscalationRule, value: any) => {
    if (!tempRule || readonly) return;
    
    setTempRule({
      ...tempRule,
      [field]: value
    });
  };
  
  // Renderizar o badge da severidade
  const renderSeverityBadge = (severity: string) => {
    const severityInfo = severityThresholds.find(s => s.value === severity);
    if (!severityInfo) return null;
    
    return (
      <Badge className={severityInfo.color}>
        {severityInfo.label}
      </Badge>
    );
  };
  
  // Renderizar o badge de nível
  const renderLevelBadge = (level: string) => {
    switch (level) {
      case "N1":
        return <Badge className="bg-blue-100 text-blue-800">Nível 1</Badge>;
      case "N2":
        return <Badge className="bg-green-100 text-green-800">Nível 2</Badge>;
      case "N3":
        return <Badge className="bg-purple-100 text-purple-800">Nível 3</Badge>;
      default:
        return null;
    }
  };
  
  // Renderizar os canais de notificação
  const renderNotificationChannels = (channels: string[]) => {
    if (channels.length === 0) return "Nenhum";
    
    return channels.map(channel => {
      const channelInfo = notificationChannels.find(c => c.value === channel);
      return channelInfo?.label || channel;
    }).join(", ");
  };
  
  // Salvar todas as regras
  const handleSaveAllRules = () => {
    if (onSave) {
      onSave(rules);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Regras de Escalação</span>
          {!readonly && (
            <Button onClick={handleSaveAllRules}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Regras
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Configure as regras de escalação automática para diferentes níveis de severidade e criticidade.
          Estas regras determinam quando e como os alertas são escalados para níveis superiores de suporte.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Tabela de regras de escalação */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Ativo</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Condições</TableHead>
                <TableHead>Notificações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id} className={!rule.enabled ? "opacity-60" : ""}>
                  <TableCell>
                    <Switch 
                      checked={rule.enabled} 
                      onCheckedChange={() => toggleRuleEnabled(rule.id)}
                      disabled={readonly}
                    />
                  </TableCell>
                  <TableCell>
                    {renderLevelBadge(rule.level)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{rule.maxWaitTime} minutos</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1 text-gray-500" />
                        <span>Severidade: {renderSeverityBadge(rule.severityThreshold)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <RefreshCw className="h-4 w-4 mr-1 text-gray-500" />
                        <span>Criticidade de negócio: ≥ {rule.businessCriticalityThreshold}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <BellRing className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{renderNotificationChannels(rule.notificationChannels)}</span>
                      </div>
                      {rule.notificationMessage && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="text-sm text-left text-gray-500 italic cursor-help underline decoration-dotted">
                              Ver mensagem...
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-md">
                              <p>{rule.notificationMessage}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {!readonly && (
                      <div className="flex justify-end space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => startEditing(rule.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover regra</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover esta regra de escalação?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleRemoveRule(rule.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {!readonly && (
            <Button 
              variant="outline" 
              className="w-full border-dashed border-gray-300 hover:border-gray-400"
              onClick={handleAddRule}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Nova Regra
            </Button>
          )}
          
          {/* Formulário de edição de regra */}
          {editingRule && tempRule && (
            <Card className="mt-6 border-blue-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Editar Regra de Escalação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rule-level">Nível de Suporte</Label>
                    <Select 
                      value={tempRule.level}
                      onValueChange={(value) => updateTempRule("level", value)}
                    >
                      <SelectTrigger id="rule-level">
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rule-max-wait">Tempo Máximo de Espera (minutos)</Label>
                    <Input 
                      id="rule-max-wait" 
                      type="number" 
                      min={1}
                      value={tempRule.maxWaitTime}
                      onChange={(e) => updateTempRule("maxWaitTime", parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rule-severity">Limiar de Severidade</Label>
                    <Select 
                      value={tempRule.severityThreshold}
                      onValueChange={(value) => updateTempRule("severityThreshold", value)}
                    >
                      <SelectTrigger id="rule-severity">
                        <SelectValue placeholder="Selecione a severidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {severityThresholds.map(severity => (
                          <SelectItem key={severity.value} value={severity.value}>
                            {severity.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rule-criticality">Limiar de Criticidade de Negócio</Label>
                    <Select 
                      value={tempRule.businessCriticalityThreshold.toString()}
                      onValueChange={(value) => updateTempRule("businessCriticalityThreshold", parseInt(value))}
                    >
                      <SelectTrigger id="rule-criticality">
                        <SelectValue placeholder="Selecione a criticidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5].map(level => (
                          <SelectItem key={level} value={level.toString()}>
                            {level === 0 ? "Sem impacto (0)" : 
                             level === 5 ? "Crítico (5)" : 
                             `Nível ${level}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label>Canais de Notificação</Label>
                    <div className="flex flex-wrap gap-2">
                      {notificationChannels.map(channel => (
                        <Badge 
                          key={channel.value}
                          className={`cursor-pointer ${
                            tempRule.notificationChannels.includes(channel.value) 
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200" 
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                          onClick={() => toggleNotificationChannel(channel.value)}
                        >
                          {channel.label}
                          {tempRule.notificationChannels.includes(channel.value) && (
                            <CheckCircle2 className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="rule-message">Mensagem de Notificação</Label>
                    <Textarea 
                      id="rule-message" 
                      placeholder="Mensagem a ser enviada nas notificações"
                      value={tempRule.notificationMessage || ""}
                      onChange={(e) => updateTempRule("notificationMessage", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={cancelEditing}>
                  Cancelar
                </Button>
                <Button onClick={saveEditing}>
                  Salvar Alterações
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </CardContent>
      
      {/* Seção de informações sobre escalação */}
      <CardFooter className="flex flex-col pt-2 pb-6">
        <div className="bg-blue-50 p-4 rounded-md w-full">
          <h4 className="font-medium text-blue-700 mb-2 flex items-center">
            <Users className="h-5 w-5 mr-1" />
            Como Funciona a Escalação
          </h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              As regras de escalação automatizam o processo de elevação de um alerta para 
              níveis mais altos de suporte quando determinadas condições são atendidas.
            </p>
            <div className="flex items-center space-x-2 pl-2 mt-1">
              <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-700 font-medium">1</div>
              <p>Um alerta é gerado e aguarda ação do nível especificado</p>
            </div>
            <div className="flex items-center space-x-2 pl-2">
              <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-700 font-medium">2</div>
              <p>Se o tempo de espera for excedido, a severidade e criticidade são verificadas</p>
            </div>
            <div className="flex items-center space-x-2 pl-2">
              <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-700 font-medium">3</div>
              <p>Se as condições forem atendidas, o alerta é escalado e as notificações são enviadas</p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}