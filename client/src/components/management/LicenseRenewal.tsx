import { useState, useEffect } from "react";
import { 
  CalendarClock, 
  BadgeAlert, 
  FileCheck, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Inbox, 
  CheckCircle2,
  AlertCircle,
  User,
  Building,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Tipos para renovação de licenças
interface License {
  id: number;
  name: string;
  type: "hardware" | "software" | "subscription";
  vendor: string;
  client: string;
  contractId: number;
  expirationDate: string;
  renewalType: "client" | "internal" | "business";
  responsiblePerson: string;
  status: "active" | "pending" | "expired" | "renewed";
  notes?: string;
  lastRenewalDate?: string;
  cost?: number;
}

function calcularDiasParaExpirar(dataExpiracao: string): number {
  const dataAtual = new Date();
  const [dia, mes, ano] = dataExpiracao.split('/').map(Number);
  const dataExp = new Date(ano, mes - 1, dia); // Mês é 0-indexado em JS
  
  const diferenca = dataExp.getTime() - dataAtual.getTime();
  return Math.ceil(diferenca / (1000 * 3600 * 24));
}

interface LicenseRenewalProps {
  contractId?: number;
  clientId?: number;
}

export default function LicenseRenewal({ contractId, clientId }: LicenseRenewalProps) {
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false);
  const [renewalType, setRenewalType] = useState<"client" | "internal" | "business">("internal");
  const [renewalNotes, setRenewalNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Carregar licenças (simulação)
  useEffect(() => {
    // Em um ambiente real, esses dados viriam de uma API
    setTimeout(() => {
      const mockLicenses: License[] = [
        {
          id: 1001,
          name: "Windows Server 2022",
          type: "software",
          vendor: "Microsoft",
          client: "Empresa ABC",
          contractId: 101,
          expirationDate: "13/04/2025",
          renewalType: "internal",
          responsiblePerson: "Técnico 1",
          status: "active",
          lastRenewalDate: "13/04/2023",
          cost: 1200
        },
        {
          id: 1002,
          name: "SQL Server Enterprise",
          type: "software",
          vendor: "Microsoft",
          client: "Empresa ABC",
          contractId: 101,
          expirationDate: "10/06/2024",
          renewalType: "business",
          responsiblePerson: "Gerente Comercial",
          status: "active",
          lastRenewalDate: "10/06/2022",
          cost: 3500
        },
        {
          id: 1003,
          name: "FortiGate UTM Bundle",
          type: "hardware",
          vendor: "Fortinet",
          client: "Tech Solutions",
          contractId: 102,
          expirationDate: "14/03/2024",
          renewalType: "client",
          responsiblePerson: "Cliente",
          status: "expired",
          lastRenewalDate: "14/03/2022",
          cost: 1800
        },
        {
          id: 1004,
          name: "VMware vSphere",
          type: "software",
          vendor: "VMware",
          client: "Empresa XYZ",
          contractId: 103,
          expirationDate: "22/05/2024",
          renewalType: "internal",
          responsiblePerson: "Técnico 2",
          status: "pending",
          lastRenewalDate: "22/05/2022",
          cost: 2200
        },
        {
          id: 1005,
          name: "Office 365 Business",
          type: "subscription",
          vendor: "Microsoft",
          client: "Global Services",
          contractId: 104,
          expirationDate: "04/11/2023",
          renewalType: "business",
          responsiblePerson: "Gerente Comercial",
          status: "expired",
          lastRenewalDate: "04/11/2022",
          cost: 750
        },
        {
          id: 1006,
          name: "Veeam Backup & Replication",
          type: "software",
          vendor: "Veeam",
          client: "Data Systems",
          contractId: 105,
          expirationDate: "28/06/2024",
          renewalType: "internal",
          responsiblePerson: "Técnico 3",
          status: "active",
          lastRenewalDate: "28/06/2023",
          cost: 1600
        }
      ];
      
      // Filtrar por contrato ou cliente, se necessário
      let filteredLicenses = mockLicenses;
      
      if (contractId) {
        filteredLicenses = filteredLicenses.filter(license => license.contractId === contractId);
      }
      
      if (clientId) {
        // Em um cenário real, teríamos que buscar os contratos do cliente
        // e então filtrar as licenças por esses contratos
        const clientNameMap: Record<number, string> = {
          1: "Empresa ABC",
          2: "Tech Solutions",
          3: "Empresa XYZ",
          4: "Global Services",
          5: "Data Systems"
        };
        
        if (clientNameMap[clientId]) {
          filteredLicenses = filteredLicenses.filter(license => license.client === clientNameMap[clientId]);
        }
      }
      
      setLicenses(filteredLicenses);
      setIsLoading(false);
    }, 1000);
  }, [contractId, clientId]);

  // Aplicar filtros às licenças
  const filteredLicenses = licenses.filter(license => {
    const matchesStatus = filterStatus === "all" || license.status === filterStatus;
    const matchesType = filterType === "all" || license.type === filterType;
    return matchesStatus && matchesType;
  });

  // Abrir o diálogo de renovação
  const handleRenewalClick = (license: License) => {
    setSelectedLicense(license);
    setRenewalType(license.renewalType);
    setRenewalNotes("");
    setIsRenewalDialogOpen(true);
  };

  // Processar a renovação
  const handleRenewal = () => {
    if (!selectedLicense) return;
    
    // Em um cenário real, enviaríamos uma requisição para o backend
    console.log("Renovação de licença:", {
      licenseId: selectedLicense.id,
      renewalType,
      notes: renewalNotes,
      renewalDate: new Date().toISOString()
    });
    
    // Atualizar o estado localmente (simulação)
    const updatedLicenses = licenses.map(license => {
      if (license.id === selectedLicense.id) {
        // Calcular nova data de expiração (simulação: +1 ano)
        const [day, month, year] = license.expirationDate.split('/').map(Number);
        const newExpirationDate = new Date(year + 1, month - 1, day);
        const formattedNewExpDate = `${newExpirationDate.getDate().toString().padStart(2, '0')}/${
          (newExpirationDate.getMonth() + 1).toString().padStart(2, '0')
        }/${newExpirationDate.getFullYear()}`;
        
        return {
          ...license,
          status: "active" as const,
          lastRenewalDate: new Date().toLocaleDateString('pt-BR'),
          expirationDate: formattedNewExpDate,
          renewalType,
          notes: renewalNotes ? `${license.notes || ''}\n${renewalNotes}` : license.notes
        };
      }
      return license;
    });
    
    setLicenses(updatedLicenses);
    
    // Notificar o usuário
    toast({
      title: "Licença renovada com sucesso",
      description: `${selectedLicense.name} foi renovada até ${
        updatedLicenses.find(l => l.id === selectedLicense.id)?.expirationDate
      }.`,
    });
    
    // Fechar o diálogo
    setIsRenewalDialogOpen(false);
  };

  // Renderizar o indicador de status de renovação
  const renderStatusIndicator = (license: License) => {
    const diasParaExpirar = calcularDiasParaExpirar(license.expirationDate);
    
    if (license.status === "expired" || diasParaExpirar < 0) {
      return (
        <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Expirado
        </Badge>
      );
    }
    
    if (license.status === "renewed") {
      return (
        <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Renovado
        </Badge>
      );
    }
    
    if (license.status === "pending") {
      return (
        <Badge className="bg-amber-100 text-amber-700 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pendente
        </Badge>
      );
    }
    
    if (diasParaExpirar <= 30) {
      return (
        <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {diasParaExpirar} dias
        </Badge>
      );
    }
    
    if (diasParaExpirar <= 90) {
      return (
        <Badge className="bg-amber-100 text-amber-700 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {diasParaExpirar} dias
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {diasParaExpirar} dias
      </Badge>
    );
  };

  // Renderizar o indicador de responsável pela renovação
  const renderRenewalType = (type: License["renewalType"]) => {
    switch (type) {
      case "client":
        return (
          <Badge className="bg-blue-100 text-blue-700 flex items-center gap-1">
            <Building className="h-3 w-3" />
            Cliente
          </Badge>
        );
      case "internal":
        return (
          <Badge className="bg-purple-100 text-purple-700 flex items-center gap-1">
            <User className="h-3 w-3" />
            Interno
          </Badge>
        );
      case "business":
        return (
          <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Empresarial
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full shadow-sm border border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <CalendarClock className="h-5 w-5 mr-2" />
          Controle de Renovação de Licenças
        </CardTitle>
        <CardDescription>
          Gerencie renovações de licenças e softwares com alertas automáticos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-2xl font-bold">{licenses.length}</p>
                </div>
                <BadgeAlert className="h-8 w-8 text-slate-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-amber-700">Expira em 90 dias</p>
                  <p className="text-2xl font-bold">
                    {licenses.filter(l => {
                      const dias = calcularDiasParaExpirar(l.expirationDate);
                      return dias <= 90 && dias > 30;
                    }).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-red-700">Expira em 30 dias</p>
                  <p className="text-2xl font-bold">
                    {licenses.filter(l => {
                      const dias = calcularDiasParaExpirar(l.expirationDate);
                      return dias <= 30 && dias > 0;
                    }).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-green-700">Ativos</p>
                  <p className="text-2xl font-bold">
                    {licenses.filter(l => l.status === "active").length}
                  </p>
                </div>
                <FileCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-1 min-w-[150px]">
            <Select 
              value={filterStatus} 
              onValueChange={setFilterStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="expired">Expirados</SelectItem>
                <SelectItem value="renewed">Renovados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[150px]">
            <Select 
              value={filterType} 
              onValueChange={setFilterType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="hardware">Hardware</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="subscription">Assinatura</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            className="ml-auto"
            onClick={() => {
              setFilterStatus("all");
              setFilterType("all");
            }}
          >
            Limpar filtros
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-slate-500">Carregando licenças...</p>
          </div>
        ) : filteredLicenses.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <Inbox className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Nenhuma licença encontrada.</p>
            <p className="text-slate-400 text-sm">Tente remover os filtros ou adicione novas licenças.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.map(license => (
                  <TableRow key={license.id}>
                    <TableCell>
                      <div className="font-medium">{license.name}</div>
                      <div className="text-xs text-slate-500">{license.vendor}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {license.type === "hardware" && "Hardware"}
                        {license.type === "software" && "Software"}
                        {license.type === "subscription" && "Assinatura"}
                      </Badge>
                    </TableCell>
                    <TableCell>{license.client}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{license.expirationDate}</span>
                        {renderStatusIndicator(license)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{license.responsiblePerson}</span>
                        {renderRenewalType(license.renewalType)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        license.status === "active" ? "bg-green-100 text-green-700" :
                        license.status === "pending" ? "bg-amber-100 text-amber-700" :
                        license.status === "expired" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }>
                        {license.status === "active" && "Ativo"}
                        {license.status === "pending" && "Pendente"}
                        {license.status === "expired" && "Expirado"}
                        {license.status === "renewed" && "Renovado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRenewalClick(license)}
                            >
                              Renovar
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Iniciar processo de renovação</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      {/* Diálogo de Renovação */}
      <Dialog open={isRenewalDialogOpen} onOpenChange={setIsRenewalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Renovar Licença</DialogTitle>
            <DialogDescription>
              Preencha as informações para registrar a renovação desta licença.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLicense && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 items-start">
                <div>
                  <p className="text-sm font-medium mb-1">Licença</p>
                  <p className="text-base">{selectedLicense.name}</p>
                  <p className="text-xs text-slate-500">{selectedLicense.vendor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Cliente</p>
                  <p className="text-base">{selectedLicense.client}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Data de Expiração Atual</p>
                  <p className="text-base">{selectedLicense.expirationDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Nova Data de Expiração</p>
                  <p className="text-base font-medium text-green-700">
                    {(() => {
                      const [day, month, year] = selectedLicense.expirationDate.split('/').map(Number);
                      const newExpirationDate = new Date(year + 1, month - 1, day);
                      return `${newExpirationDate.getDate().toString().padStart(2, '0')}/${
                        (newExpirationDate.getMonth() + 1).toString().padStart(2, '0')
                      }/${newExpirationDate.getFullYear()}`;
                    })()}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Responsável pela Renovação
                </label>
                <Select 
                  value={renewalType} 
                  onValueChange={(value: any) => setRenewalType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Cliente</SelectItem>
                    <SelectItem value="internal">Interno (Técnico)</SelectItem>
                    <SelectItem value="business">Empresarial (Comercial)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Observações
                </label>
                <Input
                  value={renewalNotes}
                  onChange={(e) => setRenewalNotes(e.target.value)}
                  placeholder="Observações sobre a renovação..."
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              className="bg-green-700 hover:bg-green-800"
              onClick={handleRenewal}
            >
              Confirmar Renovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}