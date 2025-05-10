import { useState, useEffect } from "react";
import { 
  Server, 
  FileSearch,
  Edit,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface AssetMatrixContract {
  id: number;
  contractName: string;
  client: string;
  assetCount: number;
  createdAt: string;
  updatedAt: string;
}

interface AssetMatrixTableProps {
  contractId?: number | null;
  isEditing?: boolean;
  shouldOpenEditor?: boolean;
}

// Dados de exemplo de matrizes vinculadas a contratos
const matrixContractsData: AssetMatrixContract[] = [
  {
    id: 1,
    contractName: "Contrato de Suporte Técnico",
    client: "Acme Corporation",
    assetCount: 12,
    createdAt: "2025-02-15T10:30:00Z",
    updatedAt: "2025-04-05T14:45:00Z"
  },
  {
    id: 2,
    contractName: "Contrato de Infraestrutura",
    client: "Tech Solutions",
    assetCount: 8,
    createdAt: "2025-01-23T09:15:00Z",
    updatedAt: "2025-04-10T11:20:00Z"
  },
  {
    id: 3,
    contractName: "Contrato de Servidores Cloud",
    client: "Global Services",
    assetCount: 15,
    createdAt: "2025-03-08T13:40:00Z",
    updatedAt: "2025-04-12T16:30:00Z"
  },
  {
    id: 4,
    contractName: "Contrato de Serviços Gerenciados",
    client: "Empresa XYZ",
    assetCount: 6,
    createdAt: "2025-03-20T11:10:00Z",
    updatedAt: "2025-04-08T09:25:00Z"
  }
];

// Função para formatar datas
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export default function AssetMatrixTable({ 
  contractId, 
  isEditing = false, 
  shouldOpenEditor = false 
}: AssetMatrixTableProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(shouldOpenEditor);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(contractId || null);
  const { toast } = useToast();
  
  // Efeito para tratar mudanças nas propriedades
  useEffect(() => {
    if (contractId && shouldOpenEditor) {
      setSelectedContractId(contractId);
      setOpenDialog(true);
      
      // Notificar o usuário
      toast({
        title: isEditing ? "Editar Matriz de Ativos" : "Cadastrar Nova Matriz",
        description: `${isEditing ? "Atualizando" : "Criando"} matriz para o contrato #${contractId}.`,
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
    }
  }, [contractId, shouldOpenEditor, isEditing, toast]);
  
  // Filtrar contratos com base no termo de busca
  const filteredContracts = matrixContractsData.filter(contract => 
    contract.contractName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Variantes de animação
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center gap-4">
        <div className="w-full sm:w-80 relative">
          <Input
            placeholder="Buscar por contrato ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <FileSearch className="h-4 w-4" />
          </div>
        </div>
        
        {/* Adicionar matriz manualmente quando não vem de contrato */}
        {!contractId && (
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setOpenDialog(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Nova Matriz</span>
          </Button>
        )}
      </motion.div>

      {/* Modal de criação/edição da matriz de ativos */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-green-600" />
              {isEditing 
                ? "Atualizar Matriz de Ativos" 
                : "Cadastrar Nova Matriz de Ativos"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Contrato</h4>
              <Select defaultValue={selectedContractId?.toString() || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um contrato" />
                </SelectTrigger>
                <SelectContent>
                  {matrixContractsData.map(contract => (
                    <SelectItem 
                      key={contract.id} 
                      value={contract.id.toString()}
                    >
                      {contract.contractName} - {contract.client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Total de Ativos</h4>
              <Input 
                type="number" 
                min="1" 
                max="999"
                placeholder="Número de ativos" 
                className="w-full" 
                defaultValue={isEditing ? "8" : ""}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-base font-medium mb-3">Ativos Incluídos na Matriz</h4>
            <Table className="border rounded-md">
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs w-14">#</TableHead>
                  <TableHead className="text-xs">Nome do Ativo</TableHead>
                  <TableHead className="text-xs">Tipo</TableHead>
                  <TableHead className="text-xs">Criticidade</TableHead>
                  <TableHead className="text-xs text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isEditing ? (
                  // Dados de exemplo para edição
                  [...Array(4)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        Servidor {['Web', 'DB', 'App', 'Mail'][index]}
                      </TableCell>
                      <TableCell>{['Físico', 'Virtual', 'Cloud', 'On-premise'][index]}</TableCell>
                      <TableCell>
                        <Badge 
                          className={[
                            "bg-red-100 text-red-700", 
                            "bg-orange-100 text-orange-700",
                            "bg-yellow-100 text-yellow-700",
                            "bg-green-100 text-green-700"
                          ][index]}
                        >
                          {['Crítico', 'Alto', 'Médio', 'Baixo'][index]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          Ativo
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                      Adicione ativos usando o botão abaixo
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Ativo
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    // Aqui seria feita a lógica de salvar a matriz
                    // Exemplo simples:
                    toast({
                      title: "Matriz de ativos salva",
                      description: "A matriz de ativos foi salva com sucesso.",
                      className: "bg-green-50 border-green-200 text-green-800",
                    });
                    setOpenDialog(false);
                  }}
                >
                  {isEditing ? "Atualizar" : "Cadastrar"} Matriz
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Server className="h-5 w-5 mr-2" />
              Matrizes de Ativos por Contrato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[650px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-200">
                    <TableHead className="text-xs text-slate-500 uppercase font-medium">Contrato</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase font-medium w-[120px] text-center">Nº Ativos</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase font-medium w-[120px]">Data Inclusão</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase font-medium w-[140px]">Última Atualização</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase font-medium w-[120px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow 
                      key={contract.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <TableCell className="font-medium">{contract.contractName}</TableCell>
                      <TableCell>{contract.client}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-blue-100 text-blue-700">
                          {contract.assetCount}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(contract.createdAt)}</TableCell>
                      <TableCell>{formatDate(contract.updatedAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                  onClick={() => {
                                    setSelectedContractId(contract.id);
                                    setIsEditing(true);
                                    setOpenDialog(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Editar Matriz</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar Matriz</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                  <FileSearch className="h-4 w-4" />
                                  <span className="sr-only">Detalhes da Matriz</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Detalhes da Matriz</p>
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
            
            {filteredContracts.length === 0 && (
              <div className="text-center py-6 text-slate-500">
                Nenhuma matriz de ativo encontrada para o termo buscado.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}