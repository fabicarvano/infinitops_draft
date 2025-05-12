import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { User, Link2, GitBranch, Bell, Clock, Settings2 } from "lucide-react";

export default function Settings() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700 px-6 py-4">
          <CardTitle className="text-xl">Configurações</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="users">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="users" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Usuários</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center">
                <Link2 className="mr-2 h-4 w-4" />
                <span>Integrações</span>
              </TabsTrigger>
              <TabsTrigger value="automations" className="flex items-center">
                <GitBranch className="mr-2 h-4 w-4" />
                <span>Automações</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="sla" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>SLA</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <div className="flex items-center justify-center h-64">
                <p className="text-slate-400">
                  Configurações de Usuários em desenvolvimento...
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="integrations">
              <div className="flex items-center justify-center h-64">
                <p className="text-slate-400">
                  Configurações de Integrações em desenvolvimento...
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="automations">
              <div className="flex items-center justify-center h-64">
                <p className="text-slate-400">
                  Configurações de Automações em desenvolvimento...
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="flex items-center justify-center h-64">
                <p className="text-slate-400">
                  Configurações de Notificações em desenvolvimento...
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="sla">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-emerald-500" />
                        Matriz de SLA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 mb-4">
                        Configure os tempos de resposta e resolução para cada nível de prioridade e tipo de contrato.
                      </p>
                      <Link href="/sla-configuration">
                        <Button variant="outline" className="w-full">
                          Configurar Matriz de SLA
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Settings2 className="mr-2 h-5 w-5 text-amber-500" />
                        Calendário de Suporte
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 mb-4">
                        Defina os horários de funcionamento e dias úteis para cálculos de SLA e disponibilidade.
                      </p>
                      <Button variant="outline" className="w-full">
                        Configurar Calendário
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <GitBranch className="mr-2 h-5 w-5 text-blue-500" />
                        Regras de Escalonamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 mb-4">
                        Configure as regras de escalonamento para diferentes níveis de criticidade e contratos.
                      </p>
                      <Button variant="outline" className="w-full">
                        Configurar Escalonamento
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Configurações Avançadas de SLA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400 mb-4">
                      Estas configurações afetam diretamente o cálculo de SLA e os prazos em todos os chamados. Alterações aqui exigem permissões de administrador.
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Button variant="outline" className="w-full">
                        Ajustes de Criticidade
                      </Button>
                      <Button variant="outline" className="w-full">
                        Gerenciar Feriados
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
