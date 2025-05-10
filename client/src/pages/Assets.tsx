import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Server, 
  AlertTriangle, 
  AlertOctagon,
  ArrowUpRight, 
  TicketPlus, 
  Eye, 
  BarChart3, 
  Terminal, 
  Code,
  ExternalLink,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import AssetsCollapsibleList from "@/components/assets/AssetsCollapsibleList";
import { motion } from "framer-motion";
import { Link } from "wouter";

// Tipos para o status do asset e alertas
type AssetStatus = "active" | "inactive" | "maintenance";
type AlertStatus = "open" | "acknowledged" | "resolved";
type AlertSeverity = "critical" | "high" | "medium" | "low";

// Tipo para os dados de alerta mais completo
interface AssetAlert {
  id: number;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  time: string;
  ticketId?: number;
  isPending: boolean;
  pendingSince?: string;
}

// Tipo para os tickets/chamados
interface Ticket {
  id: number;
  assetId: number;
  title: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
}

export default function Assets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssetTickets, setSelectedAssetTickets] = useState<Ticket[]>([]);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [selectedAssetName, setSelectedAssetName] = useState("");

  // Dados de exemplo para chamados
  const tickets: Ticket[] = [
    { id: 1001, assetId: 1, title: "CPU alto em servidor web", status: "open", createdAt: "2025-05-09T12:30:00Z" },
    { id: 1002, assetId: 1, title: "Memória alta em servidor web", status: "in_progress", createdAt: "2025-05-09T14:45:00Z" },
    { id: 1003, assetId: 3, title: "Lentidão em queries do banco", status: "open", createdAt: "2025-05-09T16:20:00Z" },
    { id: 1004, assetId: 4, title: "Erro de leitura em disco", status: "open", createdAt: "2025-05-09T18:10:00Z" },
    { id: 1005, assetId: 2, title: "Falha em conexão redundante", status: "open", createdAt: "2025-05-10T08:25:00Z" },
    { id: 1006, assetId: 1, title: "Erro em processo de backup", status: "open", createdAt: "2025-05-10T09:15:00Z" },
    { id: 1007, assetId: 4, title: "Alerta de temperatura no storage", status: "open", createdAt: "2025-05-10T10:05:00Z" },
    { id: 1008, assetId: 3, title: "Espaço em disco crítico", status: "open", createdAt: "2025-05-10T10:30:00Z" },
  ];

  // Função para contar chamados abertos por ativo
  const countOpenTickets = (assetId: number) => {
    return tickets.filter(ticket => ticket.assetId === assetId && ['open', 'in_progress'].includes(ticket.status)).length;
  };

  // Função para buscar chamados por ativo
  const getTicketsByAsset = (assetId: number) => {
    return tickets.filter(ticket => ticket.assetId === assetId && ['open', 'in_progress'].includes(ticket.status));
  };

  // Função para abrir o diálogo de chamados
  const handleShowTickets = (assetId: number, assetName: string) => {
    const assetTickets = getTicketsByAsset(assetId);
    setSelectedAssetTickets(assetTickets);
    setSelectedAssetName(assetName);
    setIsTicketDialogOpen(true);
  };

  // Dados de exemplo para ativos com alertas
  const assetsWithAlerts = [
    {
      id: 1, 
      name: "SRV-WEB-01", 
      type: "Servidor", 
      client: "Empresa ABC", 
      alertCount: 3, 
      ticketCount: countOpenTickets(1),
      criticality: "high",
      status: "active" as AssetStatus,
      hasOpenTicket: true,
      hasPendingAlerts: true,
      pendingSince: "5", // 5 minutos
    },
    {
      id: 2, 
      name: "FW-MAIN-01", 
      type: "Firewall", 
      client: "Tech Solutions", 
      alertCount: 2,
      ticketCount: countOpenTickets(2),
      criticality: "medium",
      status: "active" as AssetStatus,
      hasOpenTicket: false,
      hasPendingAlerts: true,
      pendingSince: "2", // 2 minutos
    },
    {
      id: 3, 
      name: "DB-SQL-03", 
      type: "Banco de Dados", 
      client: "Empresa XYZ", 
      alertCount: 1,
      ticketCount: countOpenTickets(3),
      criticality: "low",
      status: "active" as AssetStatus,
      hasOpenTicket: false,
      hasPendingAlerts: false,
      pendingSince: undefined,
    },
    {
      id: 4, 
      name: "STORAGE-01", 
      type: "Storage", 
      client: "Global Services", 
      alertCount: 4,
      ticketCount: countOpenTickets(4),
      criticality: "critical",
      status: "maintenance" as AssetStatus,
      hasOpenTicket: true,
      hasPendingAlerts: true,
      pendingSince: "12", // 12 minutos
    },
  ];
  
  // Ordenar os ativos com base no número de chamados (do maior para o menor)
  const sortedAssetsWithAlerts = [...assetsWithAlerts].sort((a, b) => b.ticketCount - a.ticketCount);

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
      case "high":
        return <Badge className="bg-orange-100 text-orange-700">Alto</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Médio</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-700">Baixo</Badge>;
      default:
        return <Badge className="bg-slate-100">Indefinido</Badge>;
    }
  };

  const getStatusBadge = (status: AssetStatus) => {
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

  const getAlertStatusBadge = (hasOpenTicket: boolean, hasPendingAlerts: boolean) => {
    if (hasOpenTicket) {
      return <Badge className="bg-yellow-100 text-yellow-700">Aberto</Badge>;
    } else if (hasPendingAlerts) {
      return <Badge className="bg-blue-100 text-blue-700">Pendente</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-700">Normal</Badge>;
    }
  };

  const getPendingAlertTimeBadge = (pendingSince?: string) => {
    if (!pendingSince) return null;
    
    const minutes = parseInt(pendingSince);
    
    if (minutes >= 10) {
      return <Badge className="bg-red-100 text-red-700">+10min</Badge>;
    } else if (minutes >= 5) {
      return <Badge className="bg-orange-100 text-orange-700">+5min</Badge>;
    } else if (minutes >= 2) {
      return <Badge className="bg-yellow-100 text-yellow-700">+2min</Badge>;
    } else if (minutes >= 1) {
      return <Badge className="bg-blue-100 text-blue-700">+1min</Badge>;
    }
    
    return null;
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



      {/* Últimos Alertas Gerados */}
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
            <div className="bg-orange-50 p-2 rounded-lg mr-3">
              <AlertOctagon className="h-5 w-5 text-orange-600" />
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
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[100px]">Tipo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[180px]">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[75px]">Alertas</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium w-[90px]">Chamados</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right w-[90px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssetsWithAlerts.map((asset, i) => (
                <motion.tr
                  key={asset.id}
                  custom={i}
                  variants={tableRowVariants}
                  className="border-b border-slate-100 hover:bg-slate-50"
                  initial="hidden"
                  animate="visible"
                  whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.3)" }}
                >
                  <TableCell className="font-medium truncate max-w-[120px] lg:max-w-none">{asset.name}</TableCell>
                  <TableCell className="truncate max-w-[100px] lg:max-w-none">{asset.type}</TableCell>
                  <TableCell className="truncate max-w-[180px] lg:max-w-none">{asset.client}</TableCell>
                  <TableCell>
                    <Badge className="bg-slate-100 text-slate-700">{asset.alertCount}</Badge>
                  </TableCell>
                  <TableCell>
                    {asset.ticketCount > 0 ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-3 py-1 h-7 text-yellow-700 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:text-yellow-800"
                        onClick={() => handleShowTickets(asset.id, asset.name)}
                      >
                        {asset.ticketCount}
                      </Button>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-700">0</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="px-2 text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                        asChild
                      >
                        <Link to={`/alertas?asset=${asset.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
      
      {/* Dialog para listar chamados */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chamados para {selectedAssetName}</DialogTitle>
            <DialogDescription>
              Chamados abertos associados a este ativo.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-200">
                  <TableHead className="text-xs text-slate-500 uppercase font-medium w-[90px]">Chamado</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Título</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium w-[90px]">Status</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium text-right w-[60px]">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedAssetTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell className="font-medium">#{ticket.id}</TableCell>
                    <TableCell className="truncate max-w-[180px]">{ticket.title}</TableCell>
                    <TableCell>
                      {ticket.status === "open" ? (
                        <Badge className="bg-yellow-100 text-yellow-700">Aberto</Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-700">Em Andamento</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2 text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                        onClick={() => {
                          setIsTicketDialogOpen(false);
                          handleGoToTicket(ticket.id);
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsTicketDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
