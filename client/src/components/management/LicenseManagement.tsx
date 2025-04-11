import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarClock, 
  Plus, 
  Download, 
  FileText, 
  AlertCircle, 
  AlertTriangle,
  CheckCircle2,
  Trash2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface License {
  id: number;
  name: string;
  contractId: number;
  productName: string;
  expirationDate: string;
  renewalType: "client" | "internal" | "business";
  quantity: number;
  status: "active" | "expired" | "expiring_soon";
}

interface LicenseManagementProps {
  contractId?: number;
}

export default function LicenseManagement({ contractId }: LicenseManagementProps) {
  const [licenses, setLicenses] = useState<License[]>([
    {
      id: 1,
      name: "Windows Server 2022",
      contractId: contractId || 1,
      productName: "Windows Server 2022 Standard",
      expirationDate: "2025-10-15",
      renewalType: "internal",
      quantity: 8,
      status: "active"
    },
    {
      id: 2,
      name: "SQL Server 2022",
      contractId: contractId || 1,
      productName: "SQL Server 2022 Enterprise",
      expirationDate: "2025-05-10",
      renewalType: "client",
      quantity: 1,
      status: "expiring_soon"
    },
    {
      id: 3,
      name: "Office 365",
      contractId: contractId || 1,
      productName: "Microsoft 365 E3",
      expirationDate: "2025-01-20",
      renewalType: "business",
      quantity: 25,
      status: "active"
    },
    {
      id: 4,
      name: "Antivírus Empresarial",
      contractId: contractId || 1,
      productName: "Kaspersky Endpoint Security",
      expirationDate: "2024-12-05",
      renewalType: "internal",
      quantity: 30,
      status: "expired"
    }
  ]);

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

  // Formatar contador de renovação
  const formatRenewalCounter = (dateString: string): string => {
    const days = getDaysUntilExpiration(dateString);
    
    if (days < 0) {
      return `Vencido há ${Math.abs(days)} ${Math.abs(days) === 1 ? 'dia' : 'dias'}`;
    } else if (days === 0) {
      return "Vence hoje";
    } else {
      return `${days} ${days === 1 ? 'dia' : 'dias'} para vencer`;
    }
  };

  // Ícone de alerta baseado na data de vencimento
  const getRenewalIcon = (dateString: string) => {
    const days = getDaysUntilExpiration(dateString);
    
    if (days < 0) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    } else if (days <= 30) {
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    } else {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  // Obter badge de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Ativa</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-700">Expirada</Badge>;
      case "expiring_soon":
        return <Badge className="bg-orange-100 text-orange-700">Expirando em breve</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">Indefinido</Badge>;
    }
  };

  // Obter texto de tipo de renovação
  const getRenewalTypeText = (type: string) => {
    switch (type) {
      case "client":
        return "Cliente";
      case "internal":
        return "Interna";
      case "business":
        return "Empresarial";
      default:
        return "Não definido";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold flex items-center">
          <CalendarClock className="mr-2 h-5 w-5 text-green-600" />
          Licenças e Renovações
        </h2>
        <Button className="bg-green-700 hover:bg-green-800">
          <Plus className="mr-2 h-4 w-4" />
          Nova Licença
        </Button>
      </div>

      {licenses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <FileText className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma licença cadastrada</h3>
              <p className="mt-1 text-sm text-slate-500">
                Não há licenças associadas a este contrato.
              </p>
              <Button className="mt-4 bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Licença
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50">
                <TableHead className="font-medium">Licença</TableHead>
                <TableHead className="font-medium">Produto</TableHead>
                <TableHead className="font-medium">Qtd.</TableHead>
                <TableHead className="font-medium">Renovação</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Vencimento</TableHead>
                <TableHead className="font-medium text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((license) => (
                <TableRow key={license.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{license.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{license.productName}</TableCell>
                  <TableCell>{license.quantity}</TableCell>
                  <TableCell>{getRenewalTypeText(license.renewalType)}</TableCell>
                  <TableCell>{getStatusBadge(license.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{license.expirationDate}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {getRenewalIcon(license.expirationDate)}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{formatRenewalCounter(license.expirationDate)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4 text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Baixar documentação</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remover licença</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}