import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Save, Clock, Users, UserCog, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Tipos para as regras de escalonamento
type SupportLevel = "N1" | "N2" | "N3" | "Especialista" | "Gerente" | "Diretor";
type EscalationType = "internal" | "customer";
type TimeUnit = "minutos" | "horas" | "dias";

interface EscalationRule {
  id: number;
  slaPercentage: number;
  timeElapsed?: number;
  timeUnit?: TimeUnit;
  targetLevel: SupportLevel;
  notifyEmails?: string[];
  notifySms?: string[];
  message?: string;
  isActive: boolean;
}

interface ClientEscalationRule {
  id: number;
  waitingDays: number;
  action: "email" | "sms" | "call" | "auto_close";
  message?: string;
  isActive: boolean;
}

interface EscalationMatrix {
  serviceLevel: "platinum" | "premium" | "standard" | "custom";
  internalRules: EscalationRule[];
  customerRules: ClientEscalationRule[];
}

export function EscalationMatrixEditor() {
  // Estado para armazenar a matriz de escalonamento atual
  const [matrices, setMatrices] = useState<EscalationMatrix[]>([
    {
      serviceLevel: "platinum",
      internalRules: [],
      customerRules: []
    },
    {
      serviceLevel: "premium",
      internalRules: [],
      customerRules: []
    },
    {
      serviceLevel: "standard",
      internalRules: [],
      customerRules: []
    }
  ]);
  
  const [selectedLevel, setSelectedLevel] = useState<"platinum" | "premium" | "standard">("platinum");
  const [selectedTab, setSelectedTab] = useState<"internal" | "customer">("internal");
  const { toast } = useToast();
  
  // Funções para manipular as regras
  const addInternalRule = () => {
    const matrix = matrices.find(m => m.serviceLevel === selectedLevel);
    if (!matrix) return;
    
    const newRule: EscalationRule = {
      id: Date.now(),
      slaPercentage: 50,
      targetLevel: "N2",
      isActive: true
    };
    
    const updatedMatrices = matrices.map(m => {
      if (m.serviceLevel === selectedLevel) {
        return {
          ...m,
          internalRules: [...m.internalRules, newRule]
        };
      }
      return m;
    });
    
    setMatrices(updatedMatrices);
  };
  
  const addCustomerRule = () => {
    const matrix = matrices.find(m => m.serviceLevel === selectedLevel);
    if (!matrix) return;
    
    const newRule: ClientEscalationRule = {
      id: Date.now(),
      waitingDays: 3,
      action: "email",
      isActive: true
    };
    
    const updatedMatrices = matrices.map(m => {
      if (m.serviceLevel === selectedLevel) {
        return {
          ...m,
          customerRules: [...m.customerRules, newRule]
        };
      }
      return m;
    });
    
    setMatrices(updatedMatrices);
  };
  
  const updateInternalRule = (ruleId: number, updates: Partial<EscalationRule>) => {
    const updatedMatrices = matrices.map(m => {
      if (m.serviceLevel === selectedLevel) {
        return {
          ...m,
          internalRules: m.internalRules.map(rule => 
            rule.id === ruleId ? { ...rule, ...updates } : rule
          )
        };
      }
      return m;
    });
    
    setMatrices(updatedMatrices);
  };
  
  const updateCustomerRule = (ruleId: number, updates: Partial<ClientEscalationRule>) => {
    const updatedMatrices = matrices.map(m => {
      if (m.serviceLevel === selectedLevel) {
        return {
          ...m,
          customerRules: m.customerRules.map(rule => 
            rule.id === ruleId ? { ...rule, ...updates } : rule
          )
        };
      }
      return m;
    });
    
    setMatrices(updatedMatrices);
  };
  
  const deleteInternalRule = (ruleId: number) => {
    const updatedMatrices = matrices.map(m => {
      if (m.serviceLevel === selectedLevel) {
        return {
          ...m,
          internalRules: m.internalRules.filter(rule => rule.id !== ruleId)
        };
      }
      return m;
    });
    
    setMatrices(updatedMatrices);
  };
  
  const deleteCustomerRule = (ruleId: number) => {
    const updatedMatrices = matrices.map(m => {
      if (m.serviceLevel === selectedLevel) {
        return {
          ...m,
          customerRules: m.customerRules.filter(rule => rule.id !== ruleId)
        };
      }
      return m;
    });
    
    setMatrices(updatedMatrices);
  };
  
  const saveMatrices = () => {
    // Aqui seria implementada a lógica para salvar no backend
    toast({
      title: "Matriz de Escalonamento Salva",
      description: "As configurações de escalonamento foram salvas com sucesso."
    });
  };
  
  // Obter a matriz atual com base no nível selecionado
  const currentMatrix = matrices.find(m => m.serviceLevel === selectedLevel);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Matriz de Escalonamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="service-level" className="mb-2 block">Nível de Serviço</Label>
          <Select value={selectedLevel} onValueChange={(value: any) => setSelectedLevel(value)}>
            <SelectTrigger id="service-level">
              <SelectValue placeholder="Selecione o nível de serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="internal" onValueChange={(value: any) => setSelectedTab(value)}>
          <TabsList className="mb-4">
            <TabsTrigger value="internal" className="flex items-center">
              <UserCog className="mr-2 h-4 w-4" />
              Escalonamento Interno
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Escalonamento para Cliente
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="internal">
            {currentMatrix?.internalRules.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <AlertCircle className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <h3 className="font-medium text-slate-600">Nenhuma Regra Definida</h3>
                <p className="text-slate-500 mt-1">
                  Adicione regras de escalonamento interno para definir quando e como os chamados serão escalados.
                </p>
                <Button variant="outline" className="mt-4" onClick={addInternalRule}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Regra
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>% do SLA</TableHead>
                      <TableHead>Nível Alvo</TableHead>
                      <TableHead>Notificações</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMatrix?.internalRules.map(rule => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={rule.slaPercentage} 
                            onChange={(e) => updateInternalRule(rule.id, { slaPercentage: parseInt(e.target.value) })}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={rule.targetLevel} 
                            onValueChange={(value: any) => updateInternalRule(rule.id, { targetLevel: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="N1">N1 - Suporte Básico</SelectItem>
                              <SelectItem value="N2">N2 - Suporte Técnico</SelectItem>
                              <SelectItem value="N3">N3 - Especialista</SelectItem>
                              <SelectItem value="Gerente">Gerente</SelectItem>
                              <SelectItem value="Diretor">Diretor</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Switch 
                            checked={rule.isActive} 
                            onCheckedChange={(checked) => updateInternalRule(rule.id, { isActive: checked })}
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteInternalRule(rule.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={addInternalRule}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Regra
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="customer">
            {currentMatrix?.customerRules.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <AlertCircle className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <h3 className="font-medium text-slate-600">Nenhuma Regra Definida</h3>
                <p className="text-slate-500 mt-1">
                  Adicione regras de escalonamento para cliente para definir ações quando um chamado está aguardando resposta do cliente.
                </p>
                <Button variant="outline" className="mt-4" onClick={addCustomerRule}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Regra
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dias Aguardando</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Mensagem</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMatrix?.customerRules.map(rule => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={rule.waitingDays} 
                            onChange={(e) => updateCustomerRule(rule.id, { waitingDays: parseInt(e.target.value) })}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={rule.action} 
                            onValueChange={(value: any) => updateCustomerRule(rule.id, { action: value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="call">Ligação</SelectItem>
                              <SelectItem value="auto_close">Fechar Automaticamente</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input 
                            value={rule.message || ''}
                            onChange={(e) => updateCustomerRule(rule.id, { message: e.target.value })}
                            placeholder="Mensagem de lembrete..."
                          />
                        </TableCell>
                        <TableCell>
                          <Switch 
                            checked={rule.isActive} 
                            onCheckedChange={(checked) => updateCustomerRule(rule.id, { isActive: checked })}
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteCustomerRule(rule.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={addCustomerRule}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Regra
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={saveMatrices}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}