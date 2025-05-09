import { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
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
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

// Schema de validação para o formulário de contrato
const contractFormSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres",
  }),
  client_id: z.string({
    required_error: "Cliente é obrigatório.",
  }),
  start_date: z.date({
    required_error: "Data de início é obrigatória.",
  }),
  end_date: z.date({
    required_error: "Data de término é obrigatória.",
  }),
  // Campo de tipo de renovação removido, será vinculado ao cadastro de licenças
  technical_contact: z.string().min(3, {
    message: "Responsável técnico é obrigatório.",
  }),
  commercial_contact: z.string().min(3, {
    message: "Responsável comercial é obrigatório.",
  }),
  service_level: z.enum(["standard", "premium", "vip"], {
    required_error: "Nível de serviço é obrigatório.",
  }),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

interface Client {
  id: number;
  name: string;
}

interface ContractFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContractCreated?: (contract: ContractFormValues) => void;
  clientId?: number; // Novo parâmetro para receber o ID do cliente pré-selecionado
  onClientActivated?: (clientId: number) => void; // Novo callback para ativar o cliente
}

export default function ContractForm({ open, onOpenChange, onContractCreated, clientId, onClientActivated }: ContractFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  // Carregar lista de clientes (simulação)
  useEffect(() => {
    // Em um ambiente real, isso viria de uma chamada de API
    setClients([
      { id: 1, name: "Empresa ABC" },
      { id: 2, name: "Tech Solutions" },
      { id: 3, name: "Empresa XYZ" },
      { id: 4, name: "Global Services" },
      { id: 5, name: "Data Systems" },
    ]);
  }, []);

  // Formulário com valores padrão
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      name: "",
      client_id: clientId ? clientId.toString() : "",
      start_date: new Date(),
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 12)), // 12 meses
      technical_contact: "",
      commercial_contact: "",
      service_level: "standard",
      description: "",
      status: "pending",
    },
  });

  // Função chamada ao submeter o formulário
  async function onSubmit(values: ContractFormValues) {
    setIsSubmitting(true);
    
    try {
      // Simulação de envio para o servidor
      console.log("Criando contrato:", values);
      
      // Esperar um pouco para simular o processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se o ID do cliente está disponível para ativação
      const selectedClientId = values.client_id ? parseInt(values.client_id) : undefined;
      
      // Ativar o cliente automaticamente
      if (selectedClientId && onClientActivated) {
        console.log("Ativando cliente:", selectedClientId);
        // Em um app real, aqui faríamos uma chamada para atualizar o status no servidor
        onClientActivated(selectedClientId);
      }
      
      // Notificar sucesso
      toast({
        title: "Contrato criado com sucesso",
        description: `${values.name} foi adicionado ao sistema.${selectedClientId ? " O cliente foi ativado automaticamente." : ""}`,
      });
      
      // Resetar o formulário
      form.reset();
      
      // Fechar o modal
      onOpenChange(false);
      
      // Callback para o componente pai
      if (onContractCreated) {
        onContractCreated(values);
      }
    } catch (error) {
      console.error("Erro ao criar contrato:", error);
      toast({
        title: "Erro ao criar contrato",
        description: "Ocorreu um erro ao criar o contrato. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="sm:max-w-[600px] z-50 bg-white shadow-lg border">
        <DialogHeader>
          <DialogTitle>Novo Contrato</DialogTitle>
          <DialogDescription>
            Preencha as informações para cadastrar um novo contrato.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome do Contrato */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Contrato</FormLabel>
                    <FormControl>
                      <Input placeholder="Suporte 24x7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Cliente */}
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Data de Início */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Data de Término */}
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Término</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* O campo Tipo de Renovação foi removido, será vinculado ao cadastro de licenças */}
              
              {/* Nível de Serviço */}
              <FormField
                control={form.control}
                name="service_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Serviço</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Responsável Técnico */}
              <FormField
                control={form.control}
                name="technical_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável Técnico</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do responsável técnico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Responsável Comercial */}
              <FormField
                control={form.control}
                name="commercial_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável Comercial</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do responsável comercial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Descrição / Escopo */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição / Escopo Técnico</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detalhes do escopo técnico do contrato" 
                      className="resize-none h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    O escopo técnico é obrigatório antes de ativar um contrato
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-green-700 hover:bg-green-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar Contrato"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}