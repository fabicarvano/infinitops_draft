import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Location } from '@shared/schema';
import { insertLocationSchema } from '@shared/schema';

// Estendendo o schema com validações adicionais
const locationFormSchema = insertLocationSchema
  .extend({
    name: z.string().min(3, {
      message: 'O nome da localização deve ter pelo menos 3 caracteres',
    }),
    location_type: z.string().min(1, {
      message: 'Selecione um tipo de localização',
    }),
  })
  .omit({ client_id: true });

// Tipo para o formulário
type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  initialData?: Partial<Location>;
  clientId: number;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({
  initialData,
  clientId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  // Definir formulário com validação
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      location_type: initialData?.location_type || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      country: initialData?.country || 'Brasil',
      postal_code: initialData?.postal_code || '',
      primary_contact_name: initialData?.primary_contact_name || '',
      primary_contact_email: initialData?.primary_contact_email || '',
      primary_contact_phone: initialData?.primary_contact_phone || '',
      emergency_contact_name: initialData?.emergency_contact_name || '',
      emergency_contact_email: initialData?.emergency_contact_email || '',
      emergency_contact_phone: initialData?.emergency_contact_phone || '',
      has_onsite_support: initialData?.has_onsite_support || false,
      onsite_support_hours: initialData?.onsite_support_hours || '',
      onsite_support_details: initialData?.onsite_support_details || '',
    },
  });

  // Handler para submissão do formulário
  const handleSubmit = (values: LocationFormValues) => {
    // Adicionar o client_id aos dados
    const locationData = {
      ...values,
      client_id: clientId,
    };
    
    // Se tiver um ID, está editando uma localização existente
    if (initialData?.id) {
      locationData.id = initialData.id;
    }
    
    onSubmit(locationData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome e Tipo */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Localização*</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da localização" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Localização*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="matriz">Matriz</SelectItem>
                    <SelectItem value="filial">Filial</SelectItem>
                    <SelectItem value="datacenter">Data Center</SelectItem>
                    <SelectItem value="escritório">Escritório</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Descrição */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descrição da localização"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Endereço */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Endereço completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="UF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="CEP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contato Principal */}
          <h3 className="text-lg font-semibold col-span-1 md:col-span-2">Contato Principal</h3>
          
          <FormField
            control={form.control}
            name="primary_contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Contato</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="primary_contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="primary_contact_email"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contato de Emergência */}
          <h3 className="text-lg font-semibold col-span-1 md:col-span-2">Contato de Emergência</h3>
          
          <FormField
            control={form.control}
            name="emergency_contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Contato</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="emergency_contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="emergency_contact_email"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Suporte Local */}
          <h3 className="text-lg font-semibold">Suporte no Local</h3>
          
          <FormField
            control={form.control}
            name="has_onsite_support"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Possui suporte técnico no local</FormLabel>
                  <FormDescription>
                    Marque esta opção se esta localização possui equipe de suporte técnico no local
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          {form.watch('has_onsite_support') && (
            <>
              <FormField
                control={form.control}
                name="onsite_support_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Disponibilidade</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: 8x5 (9h às 18h) ou 24x7" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="onsite_support_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalhes do Suporte</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informações adicionais sobre o suporte no local"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : initialData?.id ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LocationForm;