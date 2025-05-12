import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Gauge, 
  AlertTriangle, 
  HelpCircle, 
  Calendar, 
  Wrench,
  PercentCircle
} from "lucide-react";

interface AdjustmentSettings {
  criticalityAdjustment: {
    enabled: boolean;
    factors: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  maintenanceWindows: {
    pauseSla: boolean;
    notifyBeforeMaintenance: boolean;
    notificationHours: number;
  };
  holidayHandling: {
    excludeWeekends: boolean;
    excludeHolidays: boolean;
    extendDeadlinesAfterHolidays: boolean;
  };
}

const defaultSettings: AdjustmentSettings = {
  criticalityAdjustment: {
    enabled: true,
    factors: {
      critical: 0.5,  // 50% do tempo padrão
      high: 0.75,     // 75% do tempo padrão
      medium: 1.0,    // 100% do tempo padrão (sem ajuste)
      low: 1.25,      // 125% do tempo padrão
    }
  },
  maintenanceWindows: {
    pauseSla: true,
    notifyBeforeMaintenance: true,
    notificationHours: 24,
  },
  holidayHandling: {
    excludeWeekends: true,
    excludeHolidays: true,
    extendDeadlinesAfterHolidays: true,
  }
};

export function SLAAdjustmentSettings() {
  const [settings, setSettings] = useState<AdjustmentSettings>(defaultSettings);
  const { toast } = useToast();
  
  const handleSave = () => {
    // Aqui seria implementada a lógica para salvar no backend
    toast({
      title: "Configurações Salvas",
      description: "As configurações de ajuste de SLA foram salvas com sucesso."
    });
  };
  
  // Helper para atualizar um valor específico de forma aninhada
  const updateNestedValue = (obj: any, path: string[], value: any) => {
    const newObj = { ...obj };
    let current = newObj;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    return newObj;
  };
  
  // Atualizar configurações de criticidade
  const updateCriticalitySettings = (field: string, value: any) => {
    const path = field.split('.');
    const newSettings = updateNestedValue(settings, path, value);
    setSettings(newSettings);
  };
  
  // Formatadores
  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };
  
  const formatSliderTip = (value: number) => {
    if (value < 1) {
      return `${formatPercentage(value)} do tempo padrão (mais rápido)`;
    } else if (value > 1) {
      return `${formatPercentage(value)} do tempo padrão (mais lento)`;
    }
    return "Tempo padrão (sem ajuste)";
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Gauge className="mr-2 h-5 w-5" />
          Ajustes Dinâmicos de SLA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="criticality">
          <TabsList className="mb-4">
            <TabsTrigger value="criticality" className="flex items-center">
              <Gauge className="mr-2 h-4 w-4" />
              Ajustes por Criticidade
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center">
              <Wrench className="mr-2 h-4 w-4" />
              Janelas de Manutenção
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Feriados e Finais de Semana
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="criticality">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-criticality"
                    checked={settings.criticalityAdjustment.enabled}
                    onCheckedChange={(checked) => {
                      updateCriticalitySettings('criticalityAdjustment.enabled', checked);
                    }}
                  />
                  <Label htmlFor="enable-criticality">Ativar Ajustes por Criticidade</Label>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Os ajustes por criticidade permitem reduzir os tempos de SLA para ativos críticos
                        e aumentar para ativos menos críticos.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {settings.criticalityAdjustment.enabled && (
                <div className="space-y-6 bg-slate-50 p-4 rounded-lg">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
                    <div className="flex gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">Sobre Fatores de Ajuste</p>
                        <p className="mt-1">
                          Um fator menor que 1 (100%) reduz o tempo de SLA, tornando o prazo mais curto.
                          Um fator maior que 1 aumenta o tempo, dando mais prazo para resolução.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-red-500"></span>
                          Ativos Críticos
                        </Label>
                        <span className="text-sm font-medium">
                          {formatPercentage(settings.criticalityAdjustment.factors.critical)}
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Slider
                              value={[settings.criticalityAdjustment.factors.critical * 100]}
                              min={25}
                              max={200}
                              step={5}
                              onValueChange={(value) => {
                                updateCriticalitySettings('criticalityAdjustment.factors.critical', value[0] / 100);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {formatSliderTip(settings.criticalityAdjustment.factors.critical)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                          Ativos de Alta Prioridade
                        </Label>
                        <span className="text-sm font-medium">
                          {formatPercentage(settings.criticalityAdjustment.factors.high)}
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Slider
                              value={[settings.criticalityAdjustment.factors.high * 100]}
                              min={25}
                              max={200}
                              step={5}
                              onValueChange={(value) => {
                                updateCriticalitySettings('criticalityAdjustment.factors.high', value[0] / 100);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {formatSliderTip(settings.criticalityAdjustment.factors.high)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                          Ativos de Média Prioridade
                        </Label>
                        <span className="text-sm font-medium">
                          {formatPercentage(settings.criticalityAdjustment.factors.medium)}
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Slider
                              value={[settings.criticalityAdjustment.factors.medium * 100]}
                              min={25}
                              max={200}
                              step={5}
                              onValueChange={(value) => {
                                updateCriticalitySettings('criticalityAdjustment.factors.medium', value[0] / 100);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {formatSliderTip(settings.criticalityAdjustment.factors.medium)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-green-500"></span>
                          Ativos de Baixa Prioridade
                        </Label>
                        <span className="text-sm font-medium">
                          {formatPercentage(settings.criticalityAdjustment.factors.low)}
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Slider
                              value={[settings.criticalityAdjustment.factors.low * 100]}
                              min={25}
                              max={200}
                              step={5}
                              onValueChange={(value) => {
                                updateCriticalitySettings('criticalityAdjustment.factors.low', value[0] / 100);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {formatSliderTip(settings.criticalityAdjustment.factors.low)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-100 rounded-md">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <PercentCircle className="h-4 w-4 mr-1 text-slate-500" />
                      Exemplos de Ajuste
                    </h4>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>SLA padrão de 4 horas para resposta:</p>
                      <ul className="pl-5 space-y-1 list-disc">
                        <li>
                          Ativo crítico: {Math.round(4 * settings.criticalityAdjustment.factors.critical)} horas
                        </li>
                        <li>
                          Ativo de alta prioridade: {Math.round(4 * settings.criticalityAdjustment.factors.high)} horas
                        </li>
                        <li>
                          Ativo de média prioridade: {Math.round(4 * settings.criticalityAdjustment.factors.medium)} horas
                        </li>
                        <li>
                          Ativo de baixa prioridade: {Math.round(4 * settings.criticalityAdjustment.factors.low)} horas
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="maintenance">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Sobre Janelas de Manutenção</h3>
                <p className="text-sm text-blue-700">
                  As janelas de manutenção permitem suspender temporariamente os SLAs durante períodos de manutenção
                  programada. Isso evita que prazos sejam violados durante intervenções planejadas.
                </p>
              </div>
              
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pause-sla"
                    checked={settings.maintenanceWindows.pauseSla}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        maintenanceWindows: {
                          ...settings.maintenanceWindows,
                          pauseSla: checked
                        }
                      });
                    }}
                  />
                  <div>
                    <Label htmlFor="pause-sla">Pausar SLA Durante Manutenção</Label>
                    <p className="text-sm text-slate-500">
                      Interrompe a contagem de tempo de SLA durante janelas de manutenção
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notify-maintenance"
                    checked={settings.maintenanceWindows.notifyBeforeMaintenance}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        maintenanceWindows: {
                          ...settings.maintenanceWindows,
                          notifyBeforeMaintenance: checked
                        }
                      });
                    }}
                  />
                  <div>
                    <Label htmlFor="notify-maintenance">Notificar Antes da Manutenção</Label>
                    <p className="text-sm text-slate-500">
                      Envia notificações automáticas antes do início da manutenção
                    </p>
                  </div>
                </div>
                
                {settings.maintenanceWindows.notifyBeforeMaintenance && (
                  <div className="ml-7 space-y-2">
                    <Label htmlFor="notification-hours">Horas de Antecedência</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="notification-hours"
                        type="number"
                        min={1}
                        max={72}
                        value={settings.maintenanceWindows.notificationHours}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            maintenanceWindows: {
                              ...settings.maintenanceWindows,
                              notificationHours: parseInt(e.target.value) || 24
                            }
                          });
                        }}
                        className="w-24"
                      />
                      <span>horas</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Aqui seria adicionado um componente para agendar janelas de manutenção */}
            </div>
          </TabsContent>
          
          <TabsContent value="holidays">
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="exclude-weekends"
                    checked={settings.holidayHandling.excludeWeekends}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        holidayHandling: {
                          ...settings.holidayHandling,
                          excludeWeekends: checked
                        }
                      });
                    }}
                  />
                  <div>
                    <Label htmlFor="exclude-weekends">Excluir Finais de Semana</Label>
                    <p className="text-sm text-slate-500">
                      Pausa a contagem de SLA durante finais de semana
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="exclude-holidays"
                    checked={settings.holidayHandling.excludeHolidays}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        holidayHandling: {
                          ...settings.holidayHandling,
                          excludeHolidays: checked
                        }
                      });
                    }}
                  />
                  <div>
                    <Label htmlFor="exclude-holidays">Excluir Feriados</Label>
                    <p className="text-sm text-slate-500">
                      Pausa a contagem de SLA durante feriados nacionais e locais
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="extend-deadlines"
                    checked={settings.holidayHandling.extendDeadlinesAfterHolidays}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        holidayHandling: {
                          ...settings.holidayHandling,
                          extendDeadlinesAfterHolidays: checked
                        }
                      });
                    }}
                  />
                  <div>
                    <Label htmlFor="extend-deadlines">Estender Prazos Após Feriados</Label>
                    <p className="text-sm text-slate-500">
                      Quando um prazo cai em um feriado ou fim de semana, ele é automaticamente estendido para o próximo dia útil
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Aqui seria adicionado um componente para gerenciar calendário de feriados */}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}