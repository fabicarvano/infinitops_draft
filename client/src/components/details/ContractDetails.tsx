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
  FileText, 
  Building2, 
  Calendar, 
  Users, 
  Clock, 
  Shield,
  ServerCrash,
  ShieldCheck
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
import { Separator } from "@/components/ui/separator";
import LicenseManagement from "@/components/management/LicenseManagement";

// Interface para os dados do contrato
interface ContractData {
  id: number;
  name: string;
  clientId: number;
  clientName: string;
  description?: string;
  status: "active" | "inactive" | "pending";
  startDate: string;
  endDate: string;
  serviceLevel: "standard" | "premium" | "vip";
  technicalContact?: string;
  commercialContact?: string;
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
  const [assetCount, setAssetCount] = useState(5);
  const [openTickets, setOpenTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("detalhes");

  // Calcular dias até o vencimento
  const getDaysUntilExpiration = (endDateStr: string) => {
    if (!endDateStr) return 0;
    
    // Formato de data ISO
    const endDate = new Date(endDateStr);
    const currentDate = new Date("2025-04-10");
    
    const diffTime = endDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Carregar dados do contrato quando o componente abrir
  useEffect(() => {
    if (open && contractId) {
      setLoading(true);
      
      // Simular carregamento de dados
      setTimeout(() => {
        setContract({
          id: contractId,
          name: "Suporte 24x7",
          clientId: 1,
          clientName: "Tech Solutions",
          description: "Contrato de suporte técnico 24x7 com tempo de resposta garantido.",
          status: "active",
          startDate: "2024-04-10T00:00:00Z",
          endDate: "2025-04-13T23:59:59Z",
          serviceLevel: "vip",
          technicalContact: "Roberto Almeida",
          commercialContact: "Patrícia Souza",
          createdAt: "2024-04-05T10:30:00Z",
          updatedAt: "2025-04-10T14:45:00Z"
        });
        setLoading(false);
      }, 500);
    } else {
      setContract(null);
    }
  }, [open, contractId]);

  if (!contract && !loading) {
    return null;
  }

  // Determine o status com base nos dias até o vencimento
  const daysUntilExpiration = contract ? getDaysUntilExpiration(contract.endDate) : 0;
  let statusBadge;
  let statusText;

  if (daysUntilExpiration <= 0) {
    statusBadge = <Badge className="ml-3 bg-red-100 text-red-700">Vencido</Badge>;
    statusText = `Vencido há ${Math.abs(daysUntilExpiration)} ${Math.abs(daysUntilExpiration) === 1 ? 'dia' : 'dias'}`;
  } else if (daysUntilExpiration <= 30) {
    statusBadge = <Badge className="ml-3 bg-orange-100 text-orange-700">Vence em breve</Badge>;
    statusText = `Vence em ${daysUntilExpiration} ${daysUntilExpiration === 1 ? 'dia' : 'dias'}`;
  } else {
    statusBadge = <Badge className="ml-3 bg-green-100 text-green-700">Ativo</Badge>;
    statusText = `Vence em ${daysUntilExpiration} dias`;
  }

  // Determine a badge para o nível de serviço
  let serviceLevelBadge;
  if (contract?.serviceLevel === "vip") {
    serviceLevelBadge = <Badge className="bg-purple-100 text-purple-700">VIP</Badge>;
  } else if (contract?.serviceLevel === "premium") {
    serviceLevelBadge = <Badge className="bg-blue-100 text-blue-700">Premium</Badge>;
  } else {
    serviceLevelBadge = <Badge className="bg-slate-100 text-slate-700">Standard</Badge>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5 text-green-600" />
            {loading ? "Carregando..." : contract?.name}
            {!loading && statusBadge}
          </DialogTitle>
          <DialogDescription>
            Detalhes e informações do contrato.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center">Carregando informações do contrato...</div>
        ) : (
          <>
            <Tabs defaultValue="detalhes" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="detalhes">Detalhes do Contrato</TabsTrigger>
                <TabsTrigger value="licencas">Gerenciar Licenças</TabsTrigger>
              </TabsList>
              
              <TabsContent value="detalhes" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">ATIVOS</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{assetCount}</div>
                      <p className="text-xs text-slate-500 mt-1">4 ativos, 1 em manutenção</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">CHAMADOS</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{openTickets}</div>
                      <p className="text-xs text-slate-500 mt-1">1 em andamento</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">NÍVEL</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{contract?.serviceLevel.toUpperCase()}</div>
                      <p className="text-xs text-slate-500 mt-1">
                        {contract?.serviceLevel === "vip" ? "Máxima prioridade" : 
                         contract?.serviceLevel === "premium" ? "Prioridade alta" : 
                         "Prioridade normal"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h3 className="text-base font-semibold">Informações Gerais</h3>
                      
                      <div className="flex items-start space-x-3">
                        <Building2 className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-slate-700">Cliente</div>
                          <div>{contract?.clientName}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-slate-700">Período</div>
                          <div>
                            {new Date(contract?.startDate || "").toLocaleDateString('pt-BR')} a {new Date(contract?.endDate || "").toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-sm text-slate-500 mt-1">{statusText}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-slate-700">Nível de Serviço</div>
                          <div className="flex items-center">{serviceLevelBadge}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-base font-semibold">Contatos</h3>
                      
                      <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-slate-700">Contato Comercial</div>
                          <div>{contract?.commercialContact || "Não informado"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <ServerCrash className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-slate-700">Contato Técnico</div>
                          <div>{contract?.technicalContact || "Não informado"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm text-slate-700">Contrato desde</div>
                          <div>{new Date(contract?.createdAt || "").toLocaleDateString('pt-BR')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {contract?.description && (
                    <div className="pt-4 border-t border-slate-100">
                      <h3 className="text-base font-semibold mb-2">Descrição</h3>
                      <p className="text-sm text-slate-600">{contract.description}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-base font-semibold mb-3 flex items-center">
                      <ShieldCheck className="mr-2 h-5 w-5 text-slate-500" />
                      SLA e Obrigações
                    </h3>
                    
                    <div className="text-sm space-y-2">
                      <p className="text-slate-600"><span className="font-medium">Tempo de Resposta:</span> {contract?.serviceLevel === "vip" ? "15 minutos" : contract?.serviceLevel === "premium" ? "1 hora" : "4 horas"}</p>
                      <p className="text-slate-600"><span className="font-medium">Tempo de Resolução:</span> {contract?.serviceLevel === "vip" ? "4 horas" : contract?.serviceLevel === "premium" ? "8 horas" : "24 horas"}</p>
                      <p className="text-slate-600"><span className="font-medium">Disponibilidade:</span> {contract?.serviceLevel === "vip" ? "99.9%" : contract?.serviceLevel === "premium" ? "99.5%" : "99%"}</p>
                    </div>
                  </div>
                </div>

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
              </TabsContent>
              
              <TabsContent value="licencas" className="pt-4">
                <LicenseManagement contractId={contract?.id} />
                
                <DialogFooter className="mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                  >
                    Fechar
                  </Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}