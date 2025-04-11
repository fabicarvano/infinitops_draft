import { useState } from "react";
import { 
  Server,  
  HardDrive, 
  Router, 
  Network, 
  Shield, 
  Database, 
  Laptop, 
  Plus, 
  Save,
  X,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Tipos de dados para a matriz de ativos
interface MatrixField {
  id: string;
  name: string;
  value: string;
  required: boolean;
  type: "text" | "option" | "textarea" | "checkbox";
  options?: string[];
}

interface AssetTypeMatrix {
  id: string;
  name: string;
  icon: JSX.Element;
  fields: MatrixField[];
}

// Função para obter o ícone com base no tipo
const getTypeIcon = (type: string) => {
  switch (type) {
    case "server":
      return <Server className="h-5 w-5" />;
    case "storage":
      return <HardDrive className="h-5 w-5" />;
    case "network":
      return <Network className="h-5 w-5" />;
    case "router":
      return <Router className="h-5 w-5" />;
    case "firewall":
      return <Shield className="h-5 w-5" />;
    case "database":
      return <Database className="h-5 w-5" />;
    case "endpoint":
      return <Laptop className="h-5 w-5" />;
    default:
      return <Server className="h-5 w-5" />;
  }
};

// Dados iniciais das matrizes de ativos por tipo
const assetMatrices: AssetTypeMatrix[] = [
  {
    id: "server",
    name: "Servidor",
    icon: <Server className="h-5 w-5" />,
    fields: [
      { id: "hostname", name: "Hostname", value: "", required: true, type: "text" },
      { id: "ip_address", name: "Endereço IP", value: "", required: true, type: "text" },
      { id: "os", name: "Sistema Operacional", value: "", required: true, type: "text" },
      { id: "cpu", name: "CPU", value: "", required: true, type: "text" },
      { id: "ram", name: "Memória RAM", value: "", required: true, type: "text" },
      { id: "storage", name: "Armazenamento", value: "", required: true, type: "text" },
      { id: "location", name: "Localização", value: "", required: true, type: "text" },
      { id: "warranty", name: "Garantia", value: "", required: false, type: "text" },
      { id: "criticality", name: "Criticidade", value: "medium", required: true, type: "option", options: ["low", "medium", "high", "critical"] },
      { id: "backup", name: "Backup Ativo", value: "false", required: false, type: "checkbox" },
      { id: "notes", name: "Observações", value: "", required: false, type: "textarea" },
    ]
  },
  {
    id: "network",
    name: "Rede",
    icon: <Network className="h-5 w-5" />,
    fields: [
      { id: "hostname", name: "Hostname", value: "", required: true, type: "text" },
      { id: "ip_address", name: "Endereço IP", value: "", required: true, type: "text" },
      { id: "model", name: "Modelo", value: "", required: true, type: "text" },
      { id: "manufacturer", name: "Fabricante", value: "", required: true, type: "text" },
      { id: "ports", name: "Portas", value: "", required: true, type: "text" },
      { id: "firmware", name: "Versão de Firmware", value: "", required: false, type: "text" },
      { id: "location", name: "Localização", value: "", required: true, type: "text" },
      { id: "criticality", name: "Criticidade", value: "medium", required: true, type: "option", options: ["low", "medium", "high", "critical"] },
      { id: "notes", name: "Observações", value: "", required: false, type: "textarea" },
    ]
  },
  {
    id: "firewall",
    name: "Firewall",
    icon: <Shield className="h-5 w-5" />,
    fields: [
      { id: "hostname", name: "Hostname", value: "", required: true, type: "text" },
      { id: "ip_address", name: "Endereço IP", value: "", required: true, type: "text" },
      { id: "model", name: "Modelo", value: "", required: true, type: "text" },
      { id: "manufacturer", name: "Fabricante", value: "", required: true, type: "text" },
      { id: "firmware", name: "Versão de Firmware", value: "", required: true, type: "text" },
      { id: "vpn", name: "VPN Configurada", value: "false", required: false, type: "checkbox" },
      { id: "ha", name: "Alta Disponibilidade", value: "false", required: false, type: "checkbox" },
      { id: "location", name: "Localização", value: "", required: true, type: "text" },
      { id: "criticality", name: "Criticidade", value: "high", required: true, type: "option", options: ["low", "medium", "high", "critical"] },
      { id: "notes", name: "Observações", value: "", required: false, type: "textarea" },
    ]
  },
  {
    id: "storage",
    name: "Storage",
    icon: <HardDrive className="h-5 w-5" />,
    fields: [
      { id: "hostname", name: "Hostname", value: "", required: true, type: "text" },
      { id: "ip_address", name: "Endereço IP", value: "", required: true, type: "text" },
      { id: "model", name: "Modelo", value: "", required: true, type: "text" },
      { id: "capacity", name: "Capacidade Total", value: "", required: true, type: "text" },
      { id: "raid", name: "Configuração RAID", value: "", required: false, type: "text" },
      { id: "location", name: "Localização", value: "", required: true, type: "text" },
      { id: "criticality", name: "Criticidade", value: "high", required: true, type: "option", options: ["low", "medium", "high", "critical"] },
      { id: "backup", name: "Backup Ativo", value: "false", required: false, type: "checkbox" },
      { id: "notes", name: "Observações", value: "", required: false, type: "textarea" },
    ]
  }
];

interface AssetMatrixProps {
  assetId?: number;
  assetType?: string;
  clientId?: number;
  contractId?: number;
  onSave?: (data: any) => void;
  isEditing?: boolean;
}

export default function AssetMatrix({ 
  assetId, 
  assetType = "server", 
  clientId,
  contractId,
  onSave,
  isEditing = false
}: AssetMatrixProps) {
  const { toast } = useToast();
  const [selectedTabId, setSelectedTabId] = useState<string>(assetType);
  const [matrixData, setMatrixData] = useState<Record<string, MatrixField[]>>(
    assetMatrices.reduce((acc, matrix) => {
      acc[matrix.id] = [...matrix.fields];
      return acc;
    }, {} as Record<string, MatrixField[]>)
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler para alteração de valor nos campos
  const handleFieldChange = (tabId: string, fieldId: string, value: string) => {
    setMatrixData(prev => {
      const updatedFields = prev[tabId].map(field => {
        if (field.id === fieldId) {
          return { ...field, value };
        }
        return field;
      });
      
      return {
        ...prev,
        [tabId]: updatedFields
      };
    });
  };

  // Validação da matriz
  const validateMatrix = (tabId: string) => {
    const errors: string[] = [];
    
    matrixData[tabId].forEach(field => {
      if (field.required && !field.value) {
        errors.push(`O campo "${field.name}" é obrigatório.`);
      }
    });
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handler para salvar os dados da matriz
  const handleSave = () => {
    if (!validateMatrix(selectedTabId)) {
      toast({
        title: "Erro de validação",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simular envio para o servidor
    setTimeout(() => {
      console.log("Matriz de ativo salva:", {
        assetId,
        assetType: selectedTabId,
        clientId,
        contractId,
        matrixData: matrixData[selectedTabId],
      });
      
      toast({
        title: "Matriz salva com sucesso",
        description: "A matriz do ativo foi atualizada com sucesso.",
      });
      
      if (onSave) {
        onSave({
          assetType: selectedTabId,
          fields: matrixData[selectedTabId]
        });
      }
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="w-full shadow-sm border border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          {getTypeIcon(selectedTabId)}
          <span className="ml-2">Matriz de Ativos</span>
        </CardTitle>
        <CardDescription>
          Defina as características técnicas do ativo conforme o tipo selecionado.
          {isEditing ? " Edite os campos necessários." : " Todos os campos obrigatórios devem ser preenchidos."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedTabId} onValueChange={setSelectedTabId}>
          <TabsList className="mb-4 w-full grid grid-cols-2 sm:grid-cols-4">
            {assetMatrices.map(matrix => (
              <TabsTrigger key={matrix.id} value={matrix.id} className="flex items-center gap-1">
                {matrix.icon}
                <span className="hidden sm:inline">{matrix.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {assetMatrices.map(matrix => (
            <TabsContent key={matrix.id} value={matrix.id} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {matrixData[matrix.id].map(field => {
                  if (field.type === "textarea") return null;
                  
                  return (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="flex items-center">
                        {field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      
                      {field.type === "text" && (
                        <Input
                          id={field.id}
                          value={field.value}
                          onChange={(e) => handleFieldChange(matrix.id, field.id, e.target.value)}
                          placeholder={`Digite ${field.name.toLowerCase()}`}
                          className="w-full"
                        />
                      )}
                      
                      {field.type === "option" && field.options && (
                        <Select
                          value={field.value}
                          onValueChange={(value) => handleFieldChange(matrix.id, field.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Selecione ${field.name.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map(option => (
                              <SelectItem key={option} value={option}>
                                {option === "low" && "Baixa"}
                                {option === "medium" && "Média"}
                                {option === "high" && "Alta"}
                                {option === "critical" && "Crítica"}
                                {!["low", "medium", "high", "critical"].includes(option) && option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      {field.type === "checkbox" && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={field.id}
                            checked={field.value === "true"}
                            onCheckedChange={(checked) => 
                              handleFieldChange(matrix.id, field.id, checked ? "true" : "false")
                            }
                          />
                          <Label htmlFor={field.id} className="cursor-pointer">
                            {field.name}
                          </Label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Campos de textarea sempre ocupam a largura completa */}
              {matrixData[matrix.id].filter(field => field.type === "textarea").map(field => (
                <div key={field.id} className="space-y-2 mb-4">
                  <Label htmlFor={field.id} className="flex items-center">
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Textarea
                    id={field.id}
                    value={field.value}
                    onChange={(e) => handleFieldChange(matrix.id, field.id, e.target.value)}
                    placeholder={`Digite ${field.name.toLowerCase()}`}
                    className="w-full"
                    rows={3}
                  />
                </div>
              ))}
              
              {/* Exibir erros de validação */}
              {validationErrors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
                    <AlertTriangle className="h-4 w-4" /> 
                    <span>Corrija os seguintes erros:</span>
                  </div>
                  <ul className="list-disc ml-5 text-sm text-red-600">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Aviso de campos obrigatórios */}
              <div className="text-sm text-slate-500 mb-4 flex items-center">
                <span className="text-red-500 mr-1">*</span> Campos obrigatórios
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between pt-3 border-t border-slate-100">
        <Button variant="outline">
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        <Button
          className="bg-green-700 hover:bg-green-800"
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Salvando...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Matriz
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}