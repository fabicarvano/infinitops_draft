import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  Phone,
  Mail,
  User,
  Clock,
  Info,
  AlertTriangle
} from "lucide-react";

interface LocationCardProps {
  location: {
    id: number;
    name: string;
    description?: string;
    location_type: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    primary_contact_name?: string;
    primary_contact_email?: string;
    primary_contact_phone?: string;
    emergency_contact_name?: string;
    emergency_contact_email?: string;
    emergency_contact_phone?: string;
    has_onsite_support?: boolean;
    onsite_support_hours?: string;
    onsite_support_details?: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

// Função para obter o rótulo e cor do tipo de localização
const getLocationTypeBadge = (locationType: string) => {
  switch (locationType.toLowerCase()) {
    case 'matriz':
      return { label: 'Matriz', color: 'bg-blue-500' };
    case 'filial':
      return { label: 'Filial', color: 'bg-green-500' };
    case 'datacenter':
      return { label: 'Data Center', color: 'bg-purple-500' };
    case 'escritório':
      return { label: 'Escritório', color: 'bg-orange-500' };
    default:
      return { label: locationType, color: 'bg-gray-500' };
  }
};

export const LocationCard: React.FC<LocationCardProps> = ({ 
  location, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const locationBadge = getLocationTypeBadge(location.location_type);
  
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{location.name}</CardTitle>
            <CardDescription>{location.description}</CardDescription>
          </div>
          <Badge className={`${locationBadge.color} text-white`}>
            {locationBadge.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        {(location.address || location.city || location.state) && (
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm">{location.address}</p>
              <p className="text-sm">
                {[location.city, location.state, location.postal_code]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          </div>
        )}
        
        {location.primary_contact_name && (
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="text-sm">{location.primary_contact_name}</span>
            {location.primary_contact_phone && (
              <div className="flex items-center ml-2">
                <Phone className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm">{location.primary_contact_phone}</span>
              </div>
            )}
          </div>
        )}
        
        {location.has_onsite_support && (
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">Suporte Local Disponível</span>
            {location.onsite_support_hours && (
              <div className="flex items-center ml-2">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm">{location.onsite_support_hours}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-end gap-2">
        {onViewDetails && (
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            Detalhes
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            Editar
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Excluir
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LocationCard;