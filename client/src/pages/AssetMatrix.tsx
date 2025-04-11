import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  PlusCircle, 
  Server, 
  Shield, 
  Network, 
  HardDrive,
  Database,
  Router,
  Laptop,
  BarChart4,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AssetMatrixComponent from "@/components/management/AssetMatrix";
import LicenseRenewal from "@/components/management/LicenseRenewal";
import { useLocation } from "wouter";

export default function AssetMatrix() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("list");
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [location, setLocation] = useLocation();
  
  // Dados de exemplo dos ativos
  const assets = [
    {
      id: 1,
      name: "Servidor Web",
      type: "server",
      client: "Empresa ABC",
      clientId: 1,
      contractId: 101,
      ip: "192.168.1.10",
      status: "active",
      criticality: "high",
    },
    {
      id: 2,
      name: "Servidor DB",
      type: "server",
      client: "Empresa ABC",
      clientId: 1,
      contractId: 101,
      ip: "192.168.1.11",
      status: "active",
      criticality: "critical",
    },
    {
      id: 3,
      name: "Firewall",
      type: "firewall",
      client: "Tech Solutions",
      clientId: 2,
      contractId: 102,
      ip: "192.168.1.1",
      status: "active",
      criticality: "critical",
    },
    {
      id: 4,
      name: "Storage",
      type: "storage",
      client: "Empresa XYZ",
      clientId: 3,
      contractId: 103,
      ip: "192.168.1.20",
      status: "maintenance",
      criticality: "high",
    },
    {
      id: 5,
      name: "Switch Core",
      type: "network",
      client: "Global Services",
      clientId: 4,
      contractId: 104,
      ip: "192.168.1.2",
      status: "active",
      criticality: "high",
    },
  ];

  // Função para abrir a matriz de ativos
  const handleOpenMatrix = (assetId: number, assetType: string) => {
    setSelectedAsset(assetId);
    setSelectedAssetType(assetType);
    setIsMatrixOpen(true);
    setSelectedTab("matrix");
  };

  // Função para obter ícone baseado no tipo
  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case "server":
        return <Server className="h-5 w-5" />;
      case "firewall":
        return <Shield className="h-5 w-5" />;
      case "network":
        return <Network className="h-5 w-5" />;
      case "storage":
        return <HardDrive className="h-5 w-5" />;
      case "database":
        return <Database className="h-5 w-5" />;
      case "router":
        return <Router className="h-5 w-5" />;
      case "endpoint":
        return <Laptop className="h-5 w-5" />;
      default:
        return <Server className="h-5 w-5" />;
    }
  };

  // Retornar para a página de ativos principal
  const handleBackToAssets = () => {
    setLocation("/ativos");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar ativos..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBackToAssets}
          >
            Voltar para Ativos
          </Button>
          <Button 
            className="w-full sm:w-auto bg-green-700 hover:bg-green-800"
            onClick={() => {
              setSelectedAsset(null);
              setSelectedAssetType("server");
              setIsMatrixOpen(true);
              setSelectedTab("matrix");
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Ativo
          </Button>
        </div>
      </div>
      
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            <span>Lista de Ativos</span>
          </TabsTrigger>
          <TabsTrigger value="matrix" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Matriz de Ativos</span>
          </TabsTrigger>
          <TabsTrigger value="licenses" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Licenças</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Tab: Lista de Ativos */}
        <TabsContent value="list" className="space-y-4">
          <Card className="shadow-sm border border-slate-200">
            <CardHeader className="py-4 px-5 border-b border-slate-100 flex flex-row justify-between items-center">
              <div className="flex items-center space-x-2">
                <CardTitle>Lista de Ativos</CardTitle>
                <Badge variant="outline" className="ml-2">
                  {assets.length} ativos
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
              >
                Exportar
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-slate-200">
                      <TableHead className="text-xs text-slate-500 uppercase font-medium">ID</TableHead>
                      <TableHead className="text-xs text-slate-500 uppercase font-medium">Nome</TableHead>
                      <TableHead className="text-xs text-slate-500 uppercase font-medium">Tipo</TableHead>
                      <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                      <TableHead className="text-xs text-slate-500 uppercase font-medium">IP</TableHead>
                      <TableHead className="text-xs text-slate-500 uppercase font-medium">Criticidade</TableHead>
                      <TableHead className="text-xs text-slate-500 uppercase font-medium">Status</TableHead>
                      <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map(asset => (
                      <TableRow key={asset.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <TableCell className="font-medium">#{asset.id}</TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getAssetTypeIcon(asset.type)}
                            <span className="capitalize">{asset.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{asset.client}</TableCell>
                        <TableCell>{asset.ip}</TableCell>
                        <TableCell>
                          <Badge className={
                            asset.criticality === "critical" 
                              ? "bg-red-100 text-red-700" 
                              : asset.criticality === "high"
                              ? "bg-orange-100 text-orange-700"
                              : asset.criticality === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }>
                            {asset.criticality === "critical" 
                              ? "Crítica" 
                              : asset.criticality === "high"
                              ? "Alta"
                              : asset.criticality === "medium"
                              ? "Média"
                              : "Baixa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            asset.status === "active" 
                              ? "bg-green-100 text-green-700" 
                              : asset.status === "maintenance"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                          }>
                            {asset.status === "active" 
                              ? "Ativo" 
                              : asset.status === "maintenance"
                              ? "Manutenção"
                              : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    onClick={() => handleOpenMatrix(asset.id, asset.type)}
                                  >
                                    Matriz
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Ver matriz detalhada do ativo</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              Detalhes
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab: Matriz de Ativos */}
        <TabsContent value="matrix">
          <AssetMatrixComponent 
            assetId={selectedAsset || undefined}
            assetType={selectedAssetType || undefined}
            clientId={selectedAsset ? assets.find(a => a.id === selectedAsset)?.clientId : undefined}
            contractId={selectedAsset ? assets.find(a => a.id === selectedAsset)?.contractId : undefined}
            isEditing={selectedAsset !== null}
            onSave={(data) => {
              console.log("Matriz salva:", data);
              setSelectedTab("list");
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