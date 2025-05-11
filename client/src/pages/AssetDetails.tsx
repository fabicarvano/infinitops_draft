import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Server,
  ArrowLeft,
  Settings,
  Clock,
  AlertTriangle,
  Tag,
  Building,
  FileText,
  ChevronRight
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator, 
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { AssetMonitoringPanel } from "@/components/monitoring/AssetMonitoringPanel";
import { motion } from "framer-motion";

interface AssetDetails {
  id: number;
  name: string;
  type: string;
  client_id: number;
  client_name: string;
  contract_id: number;
  contract_name: string;
  status: "active" | "inactive" | "maintenance";
  description?: string;
  monitoring_tool?: string;
  monitoring_url?: string;
  criticality?: "critical" | "high" | "medium" | "low";
  created_at: string;
  updated_at: string;
}

export default function AssetDetails() {
  const [, params] = useRoute("/ativos/:id");
  const assetId = params?.id ? parseInt(params.id) : 0;
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Buscar dados do ativo
  const { data: asset, isLoading, isError } = useQuery({
    queryKey: ["/api/assets", assetId],
    queryFn: async () => {
      // Em uma implementação real, isso buscaria do backend
      // Por enquanto, retornamos dados simulados
      const mockData: AssetDetails = {
        id: assetId,
        name: assetId === 1 ? "SRV-WEB-01" : 
              assetId === 2 ? "FW-MAIN-01" : 
              assetId === 3 ? "DB-SQL-03" : 
              assetId === 4 ? "STORAGE-01" : `ASSET-${assetId}`,
        type: assetId === 1 ? "Servidor" : 
              assetId === 2 ? "Firewall" : 
              assetId === 3 ? "Banco de Dados" : 
              assetId === 4 ? "Storage" : "Equipamento",
        client_id: 1,
        client_name: "Empresa ABC",
        contract_id: 101,
        contract_name: "Contrato de Suporte Técnico",
        status: "active",
        description: "Servidor de produção para aplicação web",
        monitoring_tool: "Zabbix",
        monitoring_url: "https://zabbix.example.com",
        criticality: "high",
        created_at: "2025-01-15T10:30:00Z",
        updated_at: "2025-04-10T14:45:00Z"
      };
      
      return mockData;
    }
  });

  // Funções auxiliares  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Ativo</Badge>;
      case "inactive":
        return <Badge className="bg-slate-100 text-slate-700">Inativo</Badge>;
      case "maintenance":
        return <Badge className="bg-blue-100 text-blue-700">Em Manutenção</Badge>;
      default:
        return <Badge className="bg-slate-100">Indefinido</Badge>;
    }
  };

  const getCriticalityBadge = (criticality?: string) => {
    switch (criticality) {
      case "critical":
        return <Badge className="bg-red-100 text-red-700">Crítico</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-700">Alto</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Médio</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-700">Baixo</Badge>;
      default:
        return <Badge className="bg-slate-100">Indefinido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + 
      date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Verificar se o ativo não existe
  if (!isLoading && !asset) {
    return (
      <div className="py-10 text-center">
        <div className="mb-6">
          <Server className="h-12 w-12 mx-auto text-slate-300" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Ativo não encontrado</h1>
        <p className="text-slate-500 mb-6">
          O ativo com ID {assetId} não foi encontrado no sistema.
        </p>
        <Link to="/ativos">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Lista de Ativos
          </Button>
        </Link>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0.9 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 5, opacity: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Breadcrumbs */}
      <motion.div variants={itemVariants}>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/ativos">Ativos</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>{asset?.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Cabeçalho */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Server className="mr-2 h-6 w-6 text-blue-600" />
            {asset?.name}
            <div className="ml-3">
              {getStatusBadge(asset?.status || "")}
            </div>
          </h1>
          <p className="text-slate-500 mt-1">
            {asset?.type} • {asset?.client_name} • {getCriticalityBadge(asset?.criticality)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/ativos">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <Link to={`/alertas?search=${encodeURIComponent(asset?.name || '')}`}>
            <Button variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Ver Alertas
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Tabs e conteúdo */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Painel de Detalhes */}
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Detalhes do Ativo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">Nome</h3>
                        <p className="mt-1">{asset?.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">Tipo</h3>
                        <p className="mt-1">{asset?.type}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">Cliente</h3>
                        <p className="mt-1">{asset?.client_name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">Contrato</h3>
                        <p className="mt-1">{asset?.contract_name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">Status</h3>
                        <p className="mt-1">{getStatusBadge(asset?.status || "")}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">Criticidade</h3>
                        <p className="mt-1">{getCriticalityBadge(asset?.criticality)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Descrição</h3>
                      <p className="mt-1">{asset?.description || "Sem descrição"}</p>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Criado em: {formatDate(asset?.created_at || "")}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Atualizado em: {formatDate(asset?.updated_at || "")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Painel de Informações Rápidas */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-blue-600" />
                    Informações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">ID do Sistema</h3>
                      <p className="mt-1 font-mono text-sm">{asset?.id}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Sistema de Monitoramento</h3>
                      <p className="mt-1">{asset?.monitoring_tool || "Não configurado"}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex justify-between">
                        <Link to={`/alertas?search=${encodeURIComponent(asset?.name || '')}`}>
                          <Button variant="outline" size="sm">
                            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                            Alertas
                          </Button>
                        </Link>
                        
                        <Link to={`/chamados?search=${encodeURIComponent(asset?.name || '')}`}>
                          <Button variant="outline" size="sm">
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            Chamados
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Painel de Monitoramento - a integração principal */}
            <AssetMonitoringPanel assetId={assetId} />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico do Ativo</CardTitle>
                <CardDescription>
                  Histórico completo de alterações, alertas e chamados relacionados a este ativo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Clock className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                  <p>O histórico detalhado será implementado em breve.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Ativo</CardTitle>
                <CardDescription>
                  Opções de configuração específicas para este ativo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Settings className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                  <p>As configurações avançadas serão implementadas em breve.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}