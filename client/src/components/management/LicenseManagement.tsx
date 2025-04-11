import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search, ExternalLink, Key, Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Interface para licenças
interface License {
  id: number;
  contractId: number;
  name: string;
  type: string;
  key: string;
  expirationDate: string;
  quantity: number;
  status: "active" | "expired" | "pending";
  renewalType?: "client" | "internal" | "business";
  notes?: string;
}

interface LicenseManagementProps {
  contractId?: number;
}

export default function LicenseManagement({ contractId }: LicenseManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddLicenseOpen, setIsAddLicenseOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Carregar licenças quando o componente abrir
  useEffect(() => {
    if (contractId) {
      setLoading(true);
      
      // Simular carregamento de dados
      setTimeout(() => {
        const mockLicenses: License[] = [
          {
            id: 1,
            contractId: contractId,
            name: "Windows Server 2022",
            type: "Sistema Operacional",
            key: "WXYZ-ABCD-1234-5678-EFGH",
            expirationDate: "2025-12-31T23:59:59Z",
            quantity: 10,
            status: "active",
            renewalType: "client",
            notes: "Licenças para servidores virtuais"
          },
          {
            id: 2,
            contractId: contractId,
            name: "Microsoft 365",
            type: "Produtividade",
            key: "M365-ENTERPRISE-X123456",
            expirationDate: "2025-10-15T23:59:59Z",
            quantity: 50,
            status: "active",
            renewalType: "business"
          },
          {
            id: 3,
            contractId: contractId,
            name: "SQL Server 2022",
            type: "Banco de Dados",
            key: "SQL-ENT-ABCDEF-78901",
            expirationDate: "2024-12-31T23:59:59Z",
            quantity: 5,
            status: "active",
            renewalType: "internal"
          },
          {
            id: 4,
            contractId: contractId,
            name: "Antivírus Corporativo",
            type: "Segurança",
            key: "AV-CORP-XYZ78901234",
            expirationDate: "2025-01-15T23:59:59Z",
            quantity: 100,
            status: "active",
            renewalType: "client"
          }
        ];
        
        setLicenses(mockLicenses);
        setLoading(false);
      }, 500);
    }
  }, [contractId]);

  // Filtrar licenças com base no termo de pesquisa
  const filteredLicenses = licenses.filter(license => 
    license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular dias até o vencimento
  const getDaysUntilExpiration = (expirationDateStr: string) => {
    if (!expirationDateStr) return 0;
    
    const expirationDate = new Date(expirationDateStr);
    const currentDate = new Date("2025-04-10");
    
    const diffTime = expirationDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Visualizar detalhes da licença
  const handleViewDetails = (license: License) => {
    setSelectedLicense(license);
    setIsDetailsOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar licenças..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          className="w-full sm:w-auto bg-green-700 hover:bg-green-800"
          onClick={() => setIsAddLicenseOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Licença
        </Button>
      </div>

      {loading ? (
        <div className="py-10 text-center">Carregando licenças...</div>
      ) : licenses.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-slate-500 mb-4">Nenhuma licença cadastrada para este contrato.</p>
          <Button 
            className="bg-green-700 hover:bg-green-800"
            onClick={() => setIsAddLicenseOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Primeira Licença
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Nome</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Tipo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Chave</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Vencimento</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Quantidade</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Status</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLicenses.map((license) => {
                const daysUntilExpiration = getDaysUntilExpiration(license.expirationDate);
                let statusBadge;
                
                if (license.status === "expired" || daysUntilExpiration <= 0) {
                  statusBadge = <Badge className="bg-red-100 text-red-700">Vencida</Badge>;
                } else if (daysUntilExpiration <= 30) {
                  statusBadge = <Badge className="bg-orange-100 text-orange-700">Vence em breve</Badge>;
                } else if (license.status === "pending") {
                  statusBadge = <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>;
                } else {
                  statusBadge = <Badge className="bg-green-100 text-green-700">Ativa</Badge>;
                }
                
                return (
                  <TableRow key={license.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell className="font-medium">{license.name}</TableCell>
                    <TableCell>{license.type}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <span className="truncate max-w-[120px]">{license.key}</span>
                              <Key className="h-4 w-4 ml-1 text-slate-400" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{license.key}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {new Date(license.expirationDate).toLocaleDateString('pt-BR')}
                        {daysUntilExpiration <= 30 && daysUntilExpiration > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Calendar className="h-4 w-4 ml-1 text-orange-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Vence em {daysUntilExpiration} dias</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{license.quantity}</TableCell>
                    <TableCell>{statusBadge}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => handleViewDetails(license)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal para adicionar nova licença */}
      <Dialog open={isAddLicenseOpen} onOpenChange={setIsAddLicenseOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Licença</DialogTitle>
            <DialogDescription>
              Cadastre uma nova licença para este contrato.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Nome
              </label>
              <Input id="name" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Tipo
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="os">Sistema Operacional</SelectItem>
                  <SelectItem value="productivity">Produtividade</SelectItem>
                  <SelectItem value="database">Banco de Dados</SelectItem>
                  <SelectItem value="security">Segurança</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="key" className="text-right text-sm font-medium">
                Chave
              </label>
              <Input id="key" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="expiration" className="text-right text-sm font-medium">
                Vencimento
              </label>
              <Input id="expiration" type="date" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="quantity" className="text-right text-sm font-medium">
                Quantidade
              </label>
              <Input id="quantity" type="number" min="1" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="renewalType" className="text-right text-sm font-medium">
                Tipo de Renovação
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo de renovação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Cliente</SelectItem>
                  <SelectItem value="internal">Interna</SelectItem>
                  <SelectItem value="business">Negócio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right text-sm font-medium">
                Observações
              </label>
              <Input id="notes" className="col-span-3" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLicenseOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-green-700 hover:bg-green-800">
              Salvar Licença
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para visualizar detalhes da licença */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Licença</DialogTitle>
            <DialogDescription>
              Informações completas sobre a licença.
            </DialogDescription>
          </DialogHeader>

          {selectedLicense && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm font-medium text-slate-500">Nome:</div>
                <div className="col-span-2">{selectedLicense.name}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm font-medium text-slate-500">Tipo:</div>
                <div className="col-span-2">{selectedLicense.type}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm font-medium text-slate-500">Chave:</div>
                <div className="col-span-2 break-all">{selectedLicense.key}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm font-medium text-slate-500">Vencimento:</div>
                <div className="col-span-2">
                  {new Date(selectedLicense.expirationDate).toLocaleDateString('pt-BR')}
                  <span className="text-sm text-slate-500 ml-2">
                    {getDaysUntilExpiration(selectedLicense.expirationDate) <= 0
                      ? `(Vencida há ${Math.abs(getDaysUntilExpiration(selectedLicense.expirationDate))} dias)`
                      : `(Vence em ${getDaysUntilExpiration(selectedLicense.expirationDate)} dias)`}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm font-medium text-slate-500">Quantidade:</div>
                <div className="col-span-2">{selectedLicense.quantity} licenças</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm font-medium text-slate-500">Status:</div>
                <div className="col-span-2">
                  {selectedLicense.status === "active"
                    ? <Badge className="bg-green-100 text-green-700">Ativa</Badge>
                    : selectedLicense.status === "expired"
                    ? <Badge className="bg-red-100 text-red-700">Vencida</Badge>
                    : <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm font-medium text-slate-500">Tipo de Renovação:</div>
                <div className="col-span-2">
                  {selectedLicense.renewalType === "client"
                    ? "Cliente"
                    : selectedLicense.renewalType === "business"
                    ? "Negócio"
                    : selectedLicense.renewalType === "internal"
                    ? "Interna"
                    : "Não especificado"}
                </div>
              </div>
              
              {selectedLicense.notes && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-slate-500">Observações:</div>
                  <div className="col-span-2">{selectedLicense.notes}</div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsOpen(false)}
            >
              Fechar
            </Button>
            <Button className="bg-green-700 hover:bg-green-800">
              Editar Licença
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}