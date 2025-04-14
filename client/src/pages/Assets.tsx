import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Server, 
  AlertTriangle, 
  ArrowUpRight, 
  TicketPlus, 
  Eye, 
  BarChart3, 
  Terminal, 
  Code 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AssetsCollapsibleList from "@/components/assets/AssetsCollapsibleList";
import { motion } from "framer-motion";

export default function Assets() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados de exemplo para ativos com alertas
  const assetsWithAlerts = [
    {
      id: 1, 
      name: "SRV-WEB-01", 
      type: "Servidor", 
      client: "Empresa ABC", 
      alertCount: 3, 
      criticality: "high",
      status: "active"
    },
    {
      id: 2, 
      name: "FW-MAIN-01", 
      type: "Firewall", 
      client: "Tech Solutions", 
      alertCount: 2, 
      criticality: "medium",
      status: "active"
    },
    {
      id: 3, 
      name: "DB-SQL-03", 
      type: "Banco de Dados", 
      client: "Empresa XYZ", 
      alertCount: 1, 
      criticality: "low",
      status: "active"
    },
    {
      id: 4, 
      name: "STORAGE-01", 
      type: "Storage", 
      client: "Global Services", 
      alertCount: 4, 
      criticality: "critical",
      status: "maintenance"
    },
  ];

  // Dados de exemplo para alertas recentes
  const recentAlerts = [
    {
      id: 101,
      asset: "SRV-WEB-01",
      client: "Empresa ABC",
      message: "CPU acima de 90%",
      severity: "critical",
      time: "12m atrás",
      ticketId: 1001
    },
    {
      id: 102,
      asset: "FW-MAIN-01",
      client: "Tech Solutions",
      message: "Pacotes descartados",
      severity: "medium",
      time: "25m atrás",
      ticketId: undefined
    },
    {
      id: 103,
      asset: "DB-SQL-03",
      client: "Empresa XYZ",
      message: "Lentidão em queries",
      severity: "medium",
      time: "43m atrás",
      ticketId: 1003
    },
    {
      id: 104,
      asset: "STORAGE-01",
      client: "Global Services",
      message: "Disco com erro de leitura",
      severity: "critical",
      time: "1h 5m atrás",
      ticketId: 1004
    },
  ];

  const getCriticalityBadge = (criticality: string) => {
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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-100 text-red-700">Crítico</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Médio</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-700">Baixo</Badge>;
      default:
        return <Badge className="bg-slate-100">Indefinido</Badge>;
    }
  };

  const handleGoToTicket = (ticketId?: number) => {
    if (ticketId) {
      alert(`Redirecionando para o chamado #${ticketId}`);
    } else {
      alert("Criando um novo chamado para este alerta");
    }
  };

  // Variantes de animação (mais sutis)
  const containerVariants = {
    hidden: { opacity: 0.9 }, // Começar quase visível
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01, // Reduzido ainda mais
        when: "beforeChildren",
        duration: 0.15 // Transição mais rápida
      }
    }
  };

  const itemVariants = {
    hidden: { y: 3, opacity: 0.8 }, // Valores ainda menores
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.15, // Duração ainda mais curta
        ease: "easeOut" 
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0.9, x: -1 }, // Valores mínimos
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.01, // Delay mínimo 
        duration: 0.1 // Duração muito curta
      }
    })
  };

  const buttonVariants = {
    hover: { scale: 1.01 }, // Reduzido para apenas 1% de aumento
    tap: { scale: 0.99 } // Reduzido para apenas 1% de diminuição
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" variants={itemVariants}>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar ativos..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.location.href = "/ativos/matriz"}
            >
              <Server className="mr-2 h-4 w-4" />
              Matriz de Ativos
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Lista Completa de Ativos (Colapsável) */}
      <motion.div className="mb-6" variants={itemVariants}>
        <AssetsCollapsibleList />
      </motion.div>

      {/* Ativos com mais alertas */}
      <motion.div 
        className="card overflow-hidden mb-6" 
        variants={itemVariants}
        initial={{ opacity: 0.9, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.15, ease: "easeOut" }}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0.9, x: -3 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08, duration: 0.15, ease: "easeOut" }}
          >
            <div className="bg-red-50 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="title text-lg">Ativos com Mais Alertas</h3>
          </motion.div>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
            >
              Ver todos
            </Button>
          </motion.div>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-[650px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Nome</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[100px]">Tipo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[120px]">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[90px]">Alertas</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[100px]">Criticidade</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right w-[140px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetsWithAlerts.map((asset, i) => (
                <motion.tr
                  key={asset.id}
                  custom={i}
                  variants={tableRowVariants}
                  className="border-b border-slate-100 hover:bg-slate-50"
                  initial="hidden"
                  animate="visible"
                  whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.3)" }}
                >
                  <TableCell className="font-medium truncate max-w-[150px] lg:max-w-none">{asset.name}</TableCell>
                  <TableCell className="truncate max-w-[100px] lg:max-w-none">{asset.type}</TableCell>
                  <TableCell className="truncate max-w-[120px] lg:max-w-none">{asset.client}</TableCell>
                  <TableCell>
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
                      {asset.alertCount} {asset.alertCount === 1 ? 'alerta' : 'alertas'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getCriticalityBadge(asset.criticality)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button 
                              className="h-8 w-8 rounded-md inline-flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Detalhes</span>
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver detalhes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              className="h-8 w-8 rounded-md inline-flex items-center justify-center text-green-600 hover:text-green-800 hover:bg-green-50"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <BarChart3 className="h-4 w-4" />
                              <span className="sr-only">Monitoramento</span>
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Dados de monitoramento (Zabbix)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              className="h-8 w-8 rounded-md inline-flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Code className="h-4 w-4" />
                              <span className="sr-only">Scripts</span>
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Scripts configurados (ping, traceroute, etc)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Últimos alertas gerados */}
      <motion.div 
        className="card overflow-hidden"
        variants={itemVariants}
        initial={{ opacity: 0.9, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.15, ease: "easeOut" }}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0.9, x: -3 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08, duration: 0.15, ease: "easeOut" }}
          >
            <div className="bg-yellow-50 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="title text-lg">Últimos Alertas Gerados</h3>
          </motion.div>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
            >
              Ver todos
            </Button>
          </motion.div>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-[650px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[120px]">Ativo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[120px]">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Mensagem</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[100px]">Severidade</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[90px]">Tempo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right w-[150px]">Chamado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAlerts.map((alert, i) => (
                <motion.tr
                  key={alert.id}
                  custom={i}
                  variants={tableRowVariants}
                  className="border-b border-slate-100 hover:bg-slate-50"
                  initial="hidden"
                  animate="visible"
                  whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.3)" }}
                >
                  <TableCell className="font-medium truncate max-w-[120px] lg:max-w-none">{alert.asset}</TableCell>
                  <TableCell className="truncate max-w-[120px] lg:max-w-none">{alert.client}</TableCell>
                  <TableCell className="truncate max-w-[180px] lg:max-w-none">{alert.message}</TableCell>
                  <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                  <TableCell>{alert.time}</TableCell>
                  <TableCell className="text-right">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button 
                        size="sm" 
                        variant={alert.ticketId ? "outline" : "default"}
                        className={
                          alert.ticketId 
                            ? "text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800" 
                            : "bg-green-700 hover:bg-green-800"
                        }
                        onClick={() => handleGoToTicket(alert.ticketId)}
                      >
                        {alert.ticketId ? (
                          <>
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                            Chamado #{alert.ticketId}
                          </>
                        ) : (
                          <>
                            <TicketPlus className="mr-1 h-4 w-4" />
                            Criar Chamado
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </motion.div>
  );
}
