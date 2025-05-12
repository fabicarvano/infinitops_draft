import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  Save, 
  Plus, 
  Trash2, 
  Clock, 
  CalendarDays, 
  Users,
  AlertTriangle
} from "lucide-react";

// Define tipos para o componente
type WeekdaySchedule = {
  enabled: boolean;
  startTime: string;
  endTime: string;
};

type TeamSchedule = {
  id: string;
  name: string;
  weekdays: WeekdaySchedule[];  // [dom, seg, ter, qua, qui, sex, sab]
  isOperational24x7: boolean;
};

interface Holiday {
  id: string;
  date: Date;
  name: string;
  isRecurringYearly: boolean;
}

interface SupportCalendarSettings {
  teams: TeamSchedule[];
  holidays: Holiday[];
  defaultTeamId: string;
}

const defaultSettings: SupportCalendarSettings = {
  teams: [
    {
      id: "support-team-1",
      name: "Suporte Nível 1",
      isOperational24x7: false,
      weekdays: [
        { enabled: false, startTime: "09:00", endTime: "18:00" }, // domingo
        { enabled: true, startTime: "08:00", endTime: "18:00" },  // segunda
        { enabled: true, startTime: "08:00", endTime: "18:00" },  // terça
        { enabled: true, startTime: "08:00", endTime: "18:00" },  // quarta
        { enabled: true, startTime: "08:00", endTime: "18:00" },  // quinta
        { enabled: true, startTime: "08:00", endTime: "18:00" },  // sexta
        { enabled: false, startTime: "09:00", endTime: "18:00" }  // sábado
      ]
    }
  ],
  holidays: [],
  defaultTeamId: "support-team-1"
};

export function SupportCalendarEditor() {
  const [settings, setSettings] = useState<SupportCalendarSettings>(defaultSettings);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(defaultSettings.defaultTeamId);
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [newHolidayName, setNewHolidayName] = useState<string>("");
  const [newHolidayDate, setNewHolidayDate] = useState<Date | undefined>(undefined);
  const [newHolidayRecurring, setNewHolidayRecurring] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<string>("teams");
  
  const { toast } = useToast();
  
  // Encontrar o time selecionado
  const selectedTeam = settings.teams.find(team => team.id === selectedTeamId) || settings.teams[0];
  
  // Adicionar um novo time
  const addTeam = () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Erro",
        description: "O nome da equipe não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }
    
    const newTeam: TeamSchedule = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      isOperational24x7: false,
      weekdays: [
        { enabled: false, startTime: "09:00", endTime: "18:00" }, // domingo
        { enabled: true, startTime: "08:00", endTime: "18:00" },  // segunda
        { enabled: true, startTime: "08:00", endTime: "18:00" },  // terça
        { enabled: true, startTime: "08:00", endTime: "18:00" },  // quarta
        { enabled: true, startTime: "08:00", endTime: "18:00" },  // quinta
        { enabled: true, startTime: "08:00", endTime: "18:00" },  // sexta
        { enabled: false, startTime: "09:00", endTime: "18:00" }  // sábado
      ]
    };
    
    setSettings({
      ...settings,
      teams: [...settings.teams, newTeam]
    });
    
    setSelectedTeamId(newTeam.id);
    setNewTeamName("");
    
    toast({
      title: "Equipe Adicionada",
      description: `A equipe "${newTeamName}" foi adicionada com sucesso.`
    });
  };
  
  // Remover um time
  const removeTeam = (teamId: string) => {
    if (settings.teams.length <= 1) {
      toast({
        title: "Erro",
        description: "Não é possível remover a única equipe existente.",
        variant: "destructive"
      });
      return;
    }
    
    const teamToRemove = settings.teams.find(team => team.id === teamId);
    if (!teamToRemove) return;
    
    setSettings({
      ...settings,
      teams: settings.teams.filter(team => team.id !== teamId),
      defaultTeamId: teamId === settings.defaultTeamId 
        ? settings.teams.find(t => t.id !== teamId)?.id || ""
        : settings.defaultTeamId
    });
    
    if (selectedTeamId === teamId) {
      setSelectedTeamId(settings.teams.find(t => t.id !== teamId)?.id || "");
    }
    
    toast({
      title: "Equipe Removida",
      description: `A equipe "${teamToRemove.name}" foi removida com sucesso.`
    });
  };
  
  // Atualizar configurações de um time
  const updateTeamSettings = (teamId: string, field: string, value: any) => {
    setSettings({
      ...settings,
      teams: settings.teams.map(team => {
        if (team.id === teamId) {
          return { ...team, [field]: value };
        }
        return team;
      })
    });
  };
  
  // Atualizar horário de um dia da semana
  const updateWeekdaySchedule = (teamId: string, dayIndex: number, field: keyof WeekdaySchedule, value: any) => {
    setSettings({
      ...settings,
      teams: settings.teams.map(team => {
        if (team.id === teamId) {
          const newWeekdays = [...team.weekdays];
          newWeekdays[dayIndex] = { ...newWeekdays[dayIndex], [field]: value };
          return { ...team, weekdays: newWeekdays };
        }
        return team;
      })
    });
  };
  
  // Adicionar um novo feriado
  const addHoliday = () => {
    if (!newHolidayName.trim() || !newHolidayDate) {
      toast({
        title: "Erro",
        description: "Nome e data do feriado são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const newHoliday: Holiday = {
      id: `holiday-${Date.now()}`,
      date: newHolidayDate,
      name: newHolidayName,
      isRecurringYearly: newHolidayRecurring
    };
    
    setSettings({
      ...settings,
      holidays: [...settings.holidays, newHoliday]
    });
    
    setNewHolidayName("");
    setNewHolidayDate(undefined);
    setNewHolidayRecurring(true);
    
    toast({
      title: "Feriado Adicionado",
      description: `O feriado "${newHolidayName}" foi adicionado com sucesso.`
    });
  };
  
  // Remover um feriado
  const removeHoliday = (holidayId: string) => {
    const holidayToRemove = settings.holidays.find(h => h.id === holidayId);
    if (!holidayToRemove) return;
    
    setSettings({
      ...settings,
      holidays: settings.holidays.filter(h => h.id !== holidayId)
    });
    
    toast({
      title: "Feriado Removido",
      description: `O feriado "${holidayToRemove.name}" foi removido com sucesso.`
    });
  };
  
  // Salvar todas as configurações
  const saveSettings = () => {
    // Aqui seria implementada a lógica para salvar no backend
    toast({
      title: "Configurações Salvas",
      description: "As configurações do calendário de suporte foram salvas com sucesso."
    });
  };
  
  // Obter nome do dia da semana
  const getDayName = (index: number): string => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return days[index];
  };
  
  // Formatar data
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Calendário de Suporte
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="teams" onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="teams" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Equipes de Suporte
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              Feriados
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams">
            <div className="space-y-6">
              {/* Seleção de Equipe */}
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="select-team" className="mb-2 block">Selecionar Equipe</Label>
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger id="select-team">
                      <SelectValue placeholder="Selecione uma equipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-px bg-slate-200 self-stretch mx-2"></div>
                
                <div className="flex-1">
                  <Label htmlFor="new-team-name" className="mb-2 block">Adicionar Nova Equipe</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="new-team-name"
                      placeholder="Nome da nova equipe"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                    />
                    <Button onClick={addTeam}>
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Configurações da Equipe Selecionada */}
              {selectedTeam && (
                <div className="space-y-6 bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{selectedTeam.name}</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeTeam(selectedTeam.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remover Equipe
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`24x7-${selectedTeam.id}`}
                      checked={selectedTeam.isOperational24x7}
                      onCheckedChange={(checked) => {
                        updateTeamSettings(selectedTeam.id, "isOperational24x7", checked);
                      }}
                    />
                    <div>
                      <Label htmlFor={`24x7-${selectedTeam.id}`}>Suporte 24x7</Label>
                      <p className="text-sm text-slate-500">
                        Equipe disponível 24 horas por dia, 7 dias por semana
                      </p>
                    </div>
                  </div>
                  
                  {!selectedTeam.isOperational24x7 && (
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-slate-500" />
                        Horário de Funcionamento
                      </h4>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Dia</TableHead>
                            <TableHead className="w-[100px]">Ativo</TableHead>
                            <TableHead>Horário de Início</TableHead>
                            <TableHead>Horário de Término</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTeam.weekdays.map((schedule, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{getDayName(index)}</TableCell>
                              <TableCell>
                                <Switch
                                  checked={schedule.enabled}
                                  onCheckedChange={(checked) => {
                                    updateWeekdaySchedule(selectedTeam.id, index, "enabled", checked);
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="time"
                                  value={schedule.startTime}
                                  onChange={(e) => {
                                    updateWeekdaySchedule(selectedTeam.id, index, "startTime", e.target.value);
                                  }}
                                  disabled={!schedule.enabled}
                                  className="w-32"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="time"
                                  value={schedule.endTime}
                                  onChange={(e) => {
                                    updateWeekdaySchedule(selectedTeam.id, index, "endTime", e.target.value);
                                  }}
                                  disabled={!schedule.enabled}
                                  className="w-32"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`default-team-${selectedTeam.id}`}
                      checked={settings.defaultTeamId === selectedTeam.id}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSettings({
                            ...settings,
                            defaultTeamId: selectedTeam.id
                          });
                        }
                      }}
                    />
                    <div>
                      <Label htmlFor={`default-team-${selectedTeam.id}`}>Definir como Equipe Padrão</Label>
                      <p className="text-sm text-slate-500">
                        Essa equipe será usada por padrão para cálculos de SLA
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="holidays">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Sobre os Feriados
                </h3>
                <p className="text-sm text-blue-700">
                  Os feriados cadastrados aqui serão considerados na contagem de SLA. Durante esses dias,
                  o SLA pode ser pausado ou ter prazos estendidos conforme as configurações globais.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Calendário e Adição de Feriados */}
                <div className="space-y-4">
                  <h4 className="font-medium">Adicionar Novo Feriado</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="holiday-name">Nome do Feriado</Label>
                    <Input
                      id="holiday-name"
                      placeholder="Ex: Natal, Ano Novo, etc."
                      value={newHolidayName}
                      onChange={(e) => setNewHolidayName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Data do Feriado</Label>
                    <div className="border rounded-md p-3">
                      <Calendar
                        mode="single"
                        selected={newHolidayDate}
                        onSelect={setNewHolidayDate}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="recurring-yearly"
                      checked={newHolidayRecurring}
                      onCheckedChange={setNewHolidayRecurring}
                    />
                    <div>
                      <Label htmlFor="recurring-yearly">Repetir Anualmente</Label>
                      <p className="text-sm text-slate-500">
                        O feriado se repete todos os anos na mesma data
                      </p>
                    </div>
                  </div>
                  
                  <Button onClick={addHoliday} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Feriado
                  </Button>
                </div>
                
                {/* Lista de Feriados */}
                <div className="space-y-4">
                  <h4 className="font-medium">Feriados Cadastrados</h4>
                  
                  {settings.holidays.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <CalendarDays className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                      <h3 className="font-medium text-slate-600">Nenhum Feriado Definido</h3>
                      <p className="text-slate-500 mt-1">
                        Adicione feriados para ajustar automaticamente os prazos de SLA.
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Recorrente</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {settings.holidays.map(holiday => (
                            <TableRow key={holiday.id}>
                              <TableCell className="font-medium">{holiday.name}</TableCell>
                              <TableCell>{formatDate(holiday.date)}</TableCell>
                              <TableCell>
                                {holiday.isRecurringYearly ? "Sim" : "Não"}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeHoliday(holiday.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}