import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileSignature, 
  Building2, 
  Calendar, 
  User, 
  Clock, 
  ServerCog,
  Users,
  BarChart,
  AlertCircle,
  Ticket,
  CalendarClock
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import LicenseManagement from "@/components/management/LicenseManagement";

// Interface para os dados do contrato
interface ContractData {
  id: number;
  name: string;
  clientId: number;
  clientName: string;
  status: "active" | "inactive" | "pending";
  startDate: string;
  endDate: string;
  technicalContact?: string;
  commercialContact?: string;
  serviceLevel: "standard" | "premium" | "vip";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContractDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId?: number;
}

export default function ContractDetails({ open, onOpenChange, contractId }: ContractDetailsProps) {
  // Em um app real, isso seria carregado de uma API
  const [contract, setContract] = useState<ContractData | null>(null);
  const [assetCount, setAssetCount] = useState(4);
  const [openTickets, setOpenTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Carregar dados do contrato quando o componente abrir
  useEffect(() => {
    if (open && contractId) {
      setLoading(true);
      
      // Simular carregamento de dados
      setTimeout(() => {
        setContract({
          id: contractId,
          name: "Suporte Premium 24x7",
          clientId: 1,
          clientName: "Tech Solutions",
          status: "active",
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          technicalContact: "Rodrigo Oliveira",
          commercialContact: "Ana Carolina Silva",
          serviceLevel: "premium",
          description: "Contrato de suporte para todos os servidores e firewalls da empresa, com atendimento 24x7 e SLA de 2 horas para resposta a incidentes críticos.",
          createdAt: "2024-12-15T10:30:00Z",
          updatedAt: "2025-01-01T14:45:00Z"
        });
        setLoading(false);
      }, 500);
    } else {
      setContract(null);
    }
  }, [open, contractId]);

  // Obter estilo do badge do nível de serviço
  const getServiceLevelBadge = (level: string) => {
    switch (level) {
      case "vip":
        return <Badge className="bg-purple-100 text-purple-700">VIP</Badge>;
      case "premium":
        return <Badge className="bg-blue-100 text-blue-700">Premium</Badge>;
      case "standard":
        return <Badge className="bg-slate-100 text-slate-700">Standard</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">Standard</Badge>;
    }
  };

  // Obter estilo do badge de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Ativo</Badge>;
      case "inactive":
        return <Badge className="bg-slate-100 text-slate-700">Inativo</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">Indefinido</Badge>;
    }
  };

  // Dias até a expiração
  const getDaysUntilExpiration = (dateString: string): number => {
    const expirationDate = new Date(dateString);
    const today = new Date();
    
    // Reset do horário para comparação apenas por data
    expirationDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Verificar se precisa de alerta de expiração
  const getExpirationAlert = (endDate: string) => {
    const daysUntilExpiration = getDaysUntilExpiration(endDate);
    
    if (daysUntilExpiration <= 30) {
      return (
        <div className="flex items-center space-x-2 text-sm text-red-600 mt-1">
          <AlertCircle className="h-4 w-4" />
          <span>
            {daysUntilExpiration <= 0 
              ? `Contrato vencido há ${Math.abs(daysUntilExpiration)} dias` 
              : `Contrato vence em ${daysUntilExpiration} dias`}
          </span>
        </div>
      );
    }
    return null;
  };

  if (!contract && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <FileSignature className="mr-2 h-5 w-5 text-green-600" />
            {loading ? "Carregando..." : contract?.name}
            <div className="flex items-center ml-3 space-x-2">
              {contract?.status && getStatusBadge(contract.status)}
              {contract?.serviceLevel && getServiceLevelBadge(contract.serviceLevel)}
            </div>
          </DialogTitle>
          <DialogDescription>
            Detalhes completos do contrato e licenças associadas.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center">Carregando informações do contrato...</div>
        ) : (
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="details" className="flex items-center">
                <FileSignature className="mr-2 h-4 w-4" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="licenses" className="flex items-center">
                <CalendarClock className="mr-2 h-4 w-4" />
                Licenças
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">CLIENTE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">{contract?.clientName}</div>
                    <div className="flex items-center mt-2">
                      <Building2 className="h-4 w-4 text-slate-500 mr-1" />
                      <span className="text-xs text-slate-500">ID do cliente: {contract?.clientId}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">ATIVOS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{assetCount}</div>
                    <div className="flex items-center mt-2">
                      <ServerCog className="h-4 w-4 text-slate-500 mr-1" />
                      <span className="text-xs text-slate-500">Sob gerenciamento</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">CHAMADOS ABERTOS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{openTickets}</div>
                    <div className="flex items-center mt-2">
                      <Ticket className="h-4 w-4 text-slate-500 mr-1" />
                      <span className="text-xs text-slate-500">Associado a este contrato</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold">Informações do Contrato</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-slate-700">Período de Vigência</div>
                          <div>{contract?.startDate} a {contract?.endDate}</div>
                          {contract?.endDate && getExpirationAlert(contract.endDate)}
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-slate-700">Responsável Técnico</div>
                          <div>{contract?.technicalContact || "Não informado"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-slate-700">Responsável Comercial</div>
                          <div>{contract?.commercialContact || "Não informado"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-slate-700">Última Atualização</div>
                          <div>{new Date(contract?.updatedAt || "").toLocaleDateString('pt-BR')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold">Escopo</h3>
                    <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                      <p className="text-sm whitespace-pre-line">
                        {contract?.description || "Sem descrição de escopo."}
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <h3 className="text-base font-semibold mb-2">SLA</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Tempo de resposta (crítico):</span>
                          <span className="font-medium">2 horas</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Tempo de resposta (normal):</span>
                          <span className="font-medium">8 horas</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Disponibilidade esperada:</span>
                          <span className="font-medium">99.9%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="licenses">
              <LicenseManagement contractId={contractId} />
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
          <Button className="bg-green-700 hover:bg-green-800">
            Editar Contrato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}