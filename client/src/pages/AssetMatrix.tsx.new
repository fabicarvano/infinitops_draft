import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Server } from "lucide-react";
import { useLocation } from "wouter";
import AssetMatrixComponent from "@/components/management/AssetMatrix";
import LicenseRenewal from "@/components/management/LicenseRenewal";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";

export default function AssetMatrix() {
  const [selectedTab, setSelectedTab] = useState("matrix");
  const [location, setLocation] = useLocation();

  // Retornar para a página de ativos principal
  const handleBackToAssets = () => {
    setLocation("/ativos");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Matriz de Ativos</h2>
        <Button
          variant="outline"
          onClick={handleBackToAssets}
        >
          Voltar para Ativos
        </Button>
      </div>
      
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="matrix" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Matriz de Ativos</span>
          </TabsTrigger>
          <TabsTrigger value="licenses" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Licenças</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Tab: Matriz de Ativos */}
        <TabsContent value="matrix">
          <AssetMatrixComponent 
            onSave={(data) => {
              console.log("Matriz salva:", data);
            }}
          />
        </TabsContent>
        
        {/* Tab: Licenças */}
        <TabsContent value="licenses">
          <LicenseRenewal />
        </TabsContent>
      </Tabs>
    </div>
  );
}