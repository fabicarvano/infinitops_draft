import React, { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import LocationForm from './LocationForm';
import { Location } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  location?: Location;
  afterSave?: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  clientId,
  location,
  afterSave,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = !!location?.id;
  
  // Mutação para salvar localização
  const saveLocationMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        // Se estiver editando, envia PUT request
        return apiRequest(`/api/locations/${location.id}`, 'PUT', data);
      } else {
        // Senão, envia POST request para criar nova localização
        return apiRequest('/api/locations', 'POST', data);
      }
    },
    onSuccess: () => {
      // Invalidar cache para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['/api/locations'] });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/locations', 'by-client', clientId] 
      });
      
      // Mostrar toast de sucesso
      toast({
        title: isEditing ? 'Localização atualizada' : 'Localização criada',
        description: isEditing
          ? `A localização "${location.name}" foi atualizada com sucesso.`
          : 'Nova localização criada com sucesso.',
      });
      
      // Fechar modal
      onClose();
      
      // Executar callback opcional
      if (afterSave) {
        afterSave();
      }
    },
    onError: (error: any) => {
      // Mostrar toast de erro
      toast({
        title: 'Erro ao salvar localização',
        description: error.message || 'Ocorreu um erro ao salvar a localização.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });
  
  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    saveLocationMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Editar Localização: ${location.name}` : 'Nova Localização'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize os detalhes da localização existente.'
              : 'Preencha os detalhes para criar uma nova localização.'}
          </DialogDescription>
        </DialogHeader>
        
        <LocationForm
          initialData={location}
          clientId={clientId}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;