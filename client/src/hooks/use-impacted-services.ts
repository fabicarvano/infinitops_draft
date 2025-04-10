import { useQuery } from "@tanstack/react-query";
import { ImpactedService } from "@/components/dashboard/ImpactedServices";

export const useImpactedServices = () => {
  return useQuery<{ services: ImpactedService[] }>({
    queryKey: ["/api/impacted-services"],
    initialData: {
      services: [
        {
          id: 1,
          name: "ERP Cloud",
          status: "critical",
          client: "Empresa ABC",
          impactedAssets: [
            {
              id: 101,
              name: "SRV-DB01",
              alertMessage: "Disco crítico (98%)"
            },
            {
              id: 102,
              name: "SRV-APP02",
              alertMessage: "Memória alta (92%)"
            }
          ]
        },
        {
          id: 2,
          name: "Sistema de E-commerce",
          status: "degraded",
          client: "Tech Solutions",
          impactedAssets: [
            {
              id: 201,
              name: "SRV-WEB02",
              alertMessage: "Serviço Apache indisponível"
            }
          ]
        },
        {
          id: 3,
          name: "Intranet Corporativa",
          status: "degraded",
          client: "Empresa XYZ",
          impactedAssets: [
            {
              id: 301,
              name: "NAS-BACKUP",
              alertMessage: "Falha no backup noturno"
            }
          ]
        }
      ]
    }
  });
};