import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Link2, GitBranch, Bell } from "lucide-react";

export default function Settings() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700 px-6 py-4">
          <CardTitle className="text-xl">Configurações</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="users">
            <TabsList className="grid grid-cols-4 mb-6">
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
