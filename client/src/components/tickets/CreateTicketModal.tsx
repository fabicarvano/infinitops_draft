import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Server, Building, FileText } from "lucide-react";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketData) => void;
  alertId?: number;
  alertInfo?: {
    id: number;
    message: string;
    severity: string;
    asset: {
      id: number;
      name: string;
      type: string;
    };
    client: {
      id: number;
      name: string;
    };
  };
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority: string;
  assetId: number;
  clientId: number;
  alertId?: number;
}

export function CreateTicketModal({
  isOpen,
  onClose,
  onSubmit,
  alertId,
  alertInfo,
}: CreateTicketModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assetId, setAssetId] = useState<number | undefined>(undefined);
  const [clientId, setClientId] = useState<number | undefined>(undefined);

  // Resetar o formulário quando o modal abrir ou a informação do alerta mudar
  useEffect(() => {
    if (isOpen) {
      if (alertInfo) {
        setTitle(`Chamado: ${alertInfo.message}`);
        setDescription(`Chamado gerado a partir do alerta #${alertInfo.id}\n\nMensagem: ${alertInfo.message}\nSeveridade: ${alertInfo.severity}`);
        setPriority(mapAlertSeverityToPriority(alertInfo.severity));
        setAssetId(alertInfo.asset.id);
        setClientId(alertInfo.client.id);
      } else {
        // Limpar formulário se não tiver info de alerta
        setTitle("");
        setDescription("");
        setPriority("medium");
        setAssetId(undefined);
        setClientId(undefined);
      }
    }
  }, [isOpen, alertInfo]);

  const mapAlertSeverityToPriority = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "critical";
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "medium";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !priority || !assetId || !clientId) {
      return;
    }

    onSubmit({
      title,
      description,
      priority,
      assetId,
      clientId,
      alertId,
    });
  };

  // Lista de clientes de exemplo
  const clients = [
    { id: 1, name: "Empresa ABC" },
    { id: 2, name: "Empresa XYZ" },
    { id: 3, name: "Empresa DEF" },
    { id: 4, name: "Empresa GHI" },
    { id: 5, name: "Empresa JKL" },
  ];

  // Lista de ativos de exemplo
  const assets = [
    { id: 1, name: "SRV-WEB-01", type: "Servidor", clientId: 1 },
    { id: 2, name: "FW-MAIN-01", type: "Firewall", clientId: 2 },
    { id: 3, name: "DB-SQL-03", type: "Banco de Dados", clientId: 3 },
    { id: 4, name: "STORAGE-01", type: "Storage", clientId: 4 },
    { id: 5, name: "SW-FLOOR-02", type: "Switch", clientId: 5 },
  ];

  // Filtrar ativos pelo cliente selecionado
  const filteredAssets = clientId
    ? assets.filter((asset) => asset.clientId === clientId)
    : assets;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-[70vw] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {alertId ? "Criar Chamado a partir de Alerta" : "Criar Novo Chamado"}
          </DialogTitle>
          <DialogDescription>
            {alertId
              ? "Preencha os detalhes para criar um chamado baseado no alerta selecionado."
              : "Preencha os detalhes para criar um novo chamado."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Cliente */}
          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Select
              value={clientId?.toString()}
              onValueChange={(value) => setClientId(parseInt(value))}
              disabled={!!alertInfo}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-slate-500" />
                  <SelectValue placeholder="Selecione um cliente" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ativo */}
          <div className="space-y-2">
            <Label htmlFor="asset">Ativo</Label>
            <Select
              value={assetId?.toString()}
              onValueChange={(value) => setAssetId(parseInt(value))}
              disabled={!!alertInfo}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Server className="h-4 w-4 mr-2 text-slate-500" />
                  <SelectValue placeholder="Selecione um ativo" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {filteredAssets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id.toString()}>
                    {asset.name} ({asset.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do chamado"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o problema em detalhes"
              className="min-h-[200px]"
              required
            />
          </div>

          {/* Prioridade */}
          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value)}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-slate-500" />
                  <SelectValue placeholder="Selecione a prioridade" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Crítico</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="low">Baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button type="submit">Criar Chamado</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}