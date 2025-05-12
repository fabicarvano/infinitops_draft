import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Clock, AlertTriangle, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SLATimeDefinition {
  responseTime: number;
  resolutionTime: number;
  responseTimeUnit: "minutos" | "horas" | "dias";
  resolutionTimeUnit: "minutos" | "horas" | "dias";
}

interface CustomSLATimes {
  critical: SLATimeDefinition;
  high: SLATimeDefinition;
  medium: SLATimeDefinition;
  low: SLATimeDefinition;
}

interface CustomSLASettings {
  name: string;
  times: CustomSLATimes;
  businessHours: boolean;
  workingDays: boolean[];  // [dom, seg, ter, qua, qui, sex, sab]
  workingHoursStart: string;
  workingHoursEnd: string;
  adjustForHolidays: boolean;
}

const defaultSLASettings: CustomSLASettings = {
  name: "SLA Personalizado",
  times: {
    critical: {
      responseTime: 30,
      resolutionTime: 4,
      responseTimeUnit: "minutos",
      resolutionTimeUnit: "horas"
    },
    high: {
      responseTime: 1,
      resolutionTime: 8,
      responseTimeUnit: "horas",
      resolutionTimeUnit: "horas"
    },
    medium: {
      responseTime: 4,
      resolutionTime: 24,
      responseTimeUnit: "horas",
      resolutionTimeUnit: "horas"
    },
    low: {
      responseTime: 8,
      resolutionTime: 48,
      responseTimeUnit: "horas",
      resolutionTimeUnit: "horas"
    }
  },
  businessHours: true,
  workingDays: [false, true, true, true, true, true, false], // seg-sex
  workingHoursStart: "08:00",
  workingHoursEnd: "18:00",
  adjustForHolidays: true
};

interface CustomSLAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSettings?: Partial<CustomSLASettings>;
  onSave: (settings: CustomSLASettings) => void;
}

export function CustomSLAModal({
  open,
  onOpenChange,
  initialSettings,
  onSave
}: CustomSLAModalProps) {
  const [settings, setSettings] = useState<CustomSLASettings>({
    ...defaultSLASettings,
    ...initialSettings
  });
  
  const { toast } = useToast();
  
  const handleSave = () => {
    if (!settings.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do SLA personalizado é obrigatório.",
        variant: "destructive"
      });
      return;
    }
    
    onSave(settings);
    toast({
      title: "SLA Personalizado Salvo",
      description: "As configurações de SLA personalizado foram salvas com sucesso."
    });
  };
  
  const updateTimeSettings = (
    priority: "critical" | "high" | "medium" | "low",
    field: keyof SLATimeDefinition,
    value: any
  ) => {
    setSettings({
      ...settings,
      times: {
        ...settings.times,
        [priority]: {
          ...settings.times[priority],
          [field]: value
        }
      }
    });
  };
  
  const toggleWorkingDay = (dayIndex: number) => {
    const newWorkingDays = [...settings.workingDays];
    newWorkingDays[dayIndex] = !newWorkingDays[dayIndex];
    
    setSettings({
      ...settings,
      workingDays: newWorkingDays
    });
  };
  
  const getDayName = (index: number): string => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return days[index];
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Configuração de SLA Personalizado</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="times" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="times" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Tempos de Atendimento
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Horário de Funcionamento
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="times">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sla-name">Nome do SLA Personalizado</Label>
                <Input
                  id="sla-name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  placeholder="Ex: SLA Cliente VIP"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Tempos por Prioridade</h3>
                  <div className="inline-flex items-center text-sm text-slate-500">
                    <HelpCircle className="h-4 w-4 mr-1" />
                    <span>Defina os tempos para cada nível de prioridade</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium flex items-center mb-3">
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 mr-2">
                      Crítica
                    </Badge>
                    <span>Prioridade Crítica</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tempo de Primeira Resposta</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={settings.times.critical.responseTime}
                          onChange={(e) => updateTimeSettings("critical", "responseTime", parseInt(e.target.value))}
                          className="w-24"
                        />
                        <Select
                          value={settings.times.critical.responseTimeUnit}
                          onValueChange={(value: any) => updateTimeSettings("critical", "responseTimeUnit", value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutos">Minutos</SelectItem>
                            <SelectItem value="horas">Horas</SelectItem>
                            <SelectItem value="dias">Dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tempo de Resolução</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={settings.times.critical.resolutionTime}
                          onChange={(e) => updateTimeSettings("critical", "resolutionTime", parseInt(e.target.value))}
                          className="w-24"
                        />
                        <Select
                          value={settings.times.critical.resolutionTimeUnit}
                          onValueChange={(value: any) => updateTimeSettings("critical", "resolutionTimeUnit", value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutos">Minutos</SelectItem>
                            <SelectItem value="horas">Horas</SelectItem>
                            <SelectItem value="dias">Dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium flex items-center mb-3">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 mr-2">
                      Alta
                    </Badge>
                    <span>Prioridade Alta</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tempo de Primeira Resposta</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={settings.times.high.responseTime}
                          onChange={(e) => updateTimeSettings("high", "responseTime", parseInt(e.target.value))}
                          className="w-24"
                        />
                        <Select
                          value={settings.times.high.responseTimeUnit}
                          onValueChange={(value: any) => updateTimeSettings("high", "responseTimeUnit", value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutos">Minutos</SelectItem>
                            <SelectItem value="horas">Horas</SelectItem>
                            <SelectItem value="dias">Dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tempo de Resolução</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={settings.times.high.resolutionTime}
                          onChange={(e) => updateTimeSettings("high", "resolutionTime", parseInt(e.target.value))}
                          className="w-24"
                        />
                        <Select
                          value={settings.times.high.resolutionTimeUnit}
                          onValueChange={(value: any) => updateTimeSettings("high", "resolutionTimeUnit", value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutos">Minutos</SelectItem>
                            <SelectItem value="horas">Horas</SelectItem>
                            <SelectItem value="dias">Dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium flex items-center mb-3">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 mr-2">
                      Média
                    </Badge>
                    <span>Prioridade Média</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tempo de Primeira Resposta</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={settings.times.medium.responseTime}
                          onChange={(e) => updateTimeSettings("medium", "responseTime", parseInt(e.target.value))}
                          className="w-24"
                        />
                        <Select
                          value={settings.times.medium.responseTimeUnit}
                          onValueChange={(value: any) => updateTimeSettings("medium", "responseTimeUnit", value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutos">Minutos</SelectItem>
                            <SelectItem value="horas">Horas</SelectItem>
                            <SelectItem value="dias">Dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tempo de Resolução</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={settings.times.medium.resolutionTime}
                          onChange={(e) => updateTimeSettings("medium", "resolutionTime", parseInt(e.target.value))}
                          className="w-24"
                        />
                        <Select
                          value={settings.times.medium.resolutionTimeUnit}
                          onValueChange={(value: any) => updateTimeSettings("medium", "resolutionTimeUnit", value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutos">Minutos</SelectItem>
                            <SelectItem value="horas">Horas</SelectItem>
                            <SelectItem value="dias">Dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium flex items-center mb-3">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 mr-2">
                      Baixa
                    </Badge>
                    <span>Prioridade Baixa</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tempo de Primeira Resposta</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={settings.times.low.responseTime}
                          onChange={(e) => updateTimeSettings("low", "responseTime", parseInt(e.target.value))}
                          className="w-24"
                        />
                        <Select
                          value={settings.times.low.responseTimeUnit}
                          onValueChange={(value: any) => updateTimeSettings("low", "responseTimeUnit", value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutos">Minutos</SelectItem>
                            <SelectItem value="horas">Horas</SelectItem>
                            <SelectItem value="dias">Dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tempo de Resolução</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={settings.times.low.resolutionTime}
                          onChange={(e) => updateTimeSettings("low", "resolutionTime", parseInt(e.target.value))}
                          className="w-24"
                        />
                        <Select
                          value={settings.times.low.resolutionTimeUnit}
                          onValueChange={(value: any) => updateTimeSettings("low", "resolutionTimeUnit", value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutos">Minutos</SelectItem>
                            <SelectItem value="horas">Horas</SelectItem>
                            <SelectItem value="dias">Dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="business-hours"
                  checked={settings.businessHours}
                  onCheckedChange={(checked) => setSettings({ ...settings, businessHours: checked })}
                />
                <Label htmlFor="business-hours">Aplicar Apenas em Horário Comercial</Label>
              </div>
              
              {settings.businessHours && (
                <>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                    <h4 className="font-medium">Dias de Funcionamento</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {settings.workingDays.map((isWorkingDay, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${index}`}
                            checked={isWorkingDay}
                            onCheckedChange={() => toggleWorkingDay(index)}
                          />
                          <Label htmlFor={`day-${index}`} className="cursor-pointer">
                            {getDayName(index)}
                          </Label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="working-hours-start">Hora de Início</Label>
                        <Input
                          id="working-hours-start"
                          type="time"
                          value={settings.workingHoursStart}
                          onChange={(e) => setSettings({ ...settings, workingHoursStart: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="working-hours-end">Hora de Término</Label>
                        <Input
                          id="working-hours-end"
                          type="time"
                          value={settings.workingHoursEnd}
                          onChange={(e) => setSettings({ ...settings, workingHoursEnd: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="adjust-holidays"
                      checked={settings.adjustForHolidays}
                      onCheckedChange={(checked) => setSettings({ ...settings, adjustForHolidays: checked })}
                    />
                    <div>
                      <Label htmlFor="adjust-holidays">Ajustar para Feriados</Label>
                      <p className="text-sm text-slate-500">
                        Quando ativado, os contadores de SLA são pausados durante feriados.
                      </p>
                    </div>
                  </div>
                </>
              )}
              
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Observação sobre Horário Comercial</p>
                    <p className="mt-1">
                      Quando o horário comercial está ativado, os contadores de SLA são pausados automaticamente 
                      fora do horário de funcionamento e serão retomados quando o próximo período de trabalho começar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configuração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}