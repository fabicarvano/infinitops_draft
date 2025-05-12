import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  MapPin, 
  Phone,
  Mail,
  User,
  Calendar,
  Clock,
  Info,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { Location } from '@shared/schema';

interface LocationDetailsProps {
  location: Location;
  onEdit?: () => void;
  onBack?: () => void;
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

const LocationDetails: React.FC<LocationDetailsProps> = ({ 
  location, 
  onEdit, 
  onBack 
}) => {
  const locationBadge = getLocationTypeBadge(location.location_type);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{location.name}</h2>
          <p className="text-gray-500">{location.description}</p>
        </div>
        <Badge className={`${locationBadge.color} text-white`}>
          {locationBadge.label}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações de Endereço */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {location.address ? (
              <>
                <p className="font-medium">{location.address}</p>
                <p>
                  {[
                    location.city,
                    location.state,
                    location.postal_code
                  ].filter(Boolean).join(', ')}
                </p>
                <p>{location.country}</p>
              </>
            ) : (
              <p className="text-gray-500 italic">Nenhum endereço cadastrado</p>
            )}
          </CardContent>
        </Card>
        
        {/* Contato Principal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" />
              Contato Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {location.primary_contact_name ? (
              <>
                <p className="font-medium">{location.primary_contact_name}</p>
                {location.primary_contact_email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <a 
                      href={`mailto:${location.primary_contact_email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {location.primary_contact_email}
                    </a>
                  </div>
                )}
                {location.primary_contact_phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{location.primary_contact_phone}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 italic">Nenhum contato principal cadastrado</p>
            )}
          </CardContent>
        </Card>
        
        {/* Contato de Emergência */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Contato de Emergência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {location.emergency_contact_name ? (
              <>
                <p className="font-medium">{location.emergency_contact_name}</p>
                {location.emergency_contact_email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <a 
                      href={`mailto:${location.emergency_contact_email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {location.emergency_contact_email}
                    </a>
                  </div>
                )}
                {location.emergency_contact_phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{location.emergency_contact_phone}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 italic">Nenhum contato de emergência cadastrado</p>
            )}
          </CardContent>
        </Card>
        
        {/* Suporte Local */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Suporte Local
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {location.has_onsite_support ? (
              <>
                <div className="flex items-center mb-2">
                  <Badge className="bg-green-500 text-white mr-2">Disponível</Badge>
                  {location.onsite_support_hours && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{location.onsite_support_hours}</span>
                    </div>
                  )}
                </div>
                {location.onsite_support_details && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Detalhes:</h4>
                    <p className="text-sm">{location.onsite_support_details}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center">
                <Badge className="bg-gray-200 text-gray-700 mr-2">Não Disponível</Badge>
                <span className="text-gray-500">Sem suporte local nesta localização</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        )}
        {onEdit && (
          <Button onClick={onEdit}>
            Editar Localização
          </Button>
        )}
      </div>
    </div>
  );
};

export default LocationDetails;