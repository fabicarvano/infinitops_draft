/**
 * Serviço para integração com ferramentas de monitoramento
 * Este serviço centraliza as funções de comunicação com sistemas de monitoramento
 * externos como Zabbix, Nagios, etc.
 */

// Interface para dados de métricas básicas de monitoramento
export interface MonitoringMetrics {
  cpu?: {
    usage: number;
    trend: 'up' | 'down' | 'stable';
    history?: number[];
  };
  memory?: {
    total: number;
    used: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
  disk?: {
    total: number;
    used: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
  network?: {
    inbound: number;
    outbound: number;
    errors: number;
  };
  uptime?: number;
  lastCheck?: string;
  problemDuration?: number;
  relatedIssues?: number;
}

// Interface para detalhes de um alerta no sistema de monitoramento
export interface MonitoringAlert {
  id: string;
  severity: 'information' | 'warning' | 'average' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  startTime: string;
  description: string;
  hostName: string;
  metrics?: MonitoringMetrics;
  monitoringUrl?: string;
}

// Interface para representar um snapshot do estado de um ativo
export interface AssetMonitoringState {
  assetId: number;
  assetName: string;
  status: 'up' | 'warning' | 'down' | 'maintenance' | 'unknown';
  lastUpdated: string;
  metrics: MonitoringMetrics;
  activeAlerts: MonitoringAlert[];
  monitoringSystem: {
    name: string;
    url: string;
    assetUrl: string;
  };
}

// Cache para evitar muitas requisições ao sistema de monitoramento
const metricsCache = new Map<number, { data: AssetMonitoringState, timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minuto em milissegundos

/**
 * Serviço principal de monitoramento
 */
export class MonitoringService {
  /**
   * Obtém os dados de monitoramento para um ativo específico
   * 
   * @param assetId ID do ativo no sistema CCO
   * @param forceRefresh Se verdadeiro, ignora o cache e busca dados atualizados
   * @returns Dados de monitoramento do ativo ou undefined se não disponível
   */
  static async getAssetMonitoringState(assetId: number, forceRefresh = false): Promise<AssetMonitoringState | undefined> {
    // Verificar cache primeiro, se não forçar atualização
    if (!forceRefresh) {
      const cached = metricsCache.get(assetId);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return cached.data;
      }
    }
    
    try {
      // Em uma implementação real, isso faria uma chamada para a API do sistema de monitoramento
      // Por enquanto, simularemos usando dados do ativo do nosso sistema
      
      // Buscar dados do ativo (matriz de ativos)
      const assetResponse = await fetch(`/api/assets/${assetId}`);
      if (!assetResponse.ok) {
        console.error(`Erro ao buscar dados do ativo: ${assetResponse.statusText}`);
        return undefined;
      }
      
      const asset = await assetResponse.json();
      
      // Verificar se o ativo tem configuração de monitoramento
      if (!asset.monitoring_tool || !asset.monitoring_url) {
        console.warn(`Ativo ${assetId} não tem configuração de monitoramento`);
        return undefined;
      }
      
      // Em uma implementação real, usaríamos asset.monitoring_url para buscar dados
      // do sistema de monitoramento externo
      
      // Por enquanto, retornamos um objeto simulado com dados básicos
      // Estes dados seriam obtidos da API do sistema de monitoramento
      const monitoringData: AssetMonitoringState = {
        assetId,
        assetName: asset.name,
        status: 'up', // Isso viria do sistema de monitoramento
        lastUpdated: new Date().toISOString(),
        metrics: {
          cpu: {
            usage: 45,
            trend: 'stable',
            history: [42, 44, 47, 45, 43, 45]
          },
          memory: {
            total: 16384, // MB
            used: 8192,   // MB
            percentage: 50,
            trend: 'up'
          },
          disk: {
            total: 1024000, // MB
            used: 768000,   // MB
            percentage: 75,
            trend: 'up'
          },
          uptime: 864000, // 10 dias em segundos
          lastCheck: new Date().toISOString(),
          relatedIssues: 0
        },
        activeAlerts: [],
        monitoringSystem: {
          name: asset.monitoring_tool,
          url: asset.monitoring_url,
          assetUrl: `${asset.monitoring_url}/host/${assetId}` // Isso seria construído conforme o sistema
        }
      };
      
      // Armazenar no cache
      metricsCache.set(assetId, {
        data: monitoringData,
        timestamp: Date.now()
      });
      
      return monitoringData;
    } catch (error) {
      console.error("Erro ao buscar dados de monitoramento:", error);
      return undefined;
    }
  }
  
  /**
   * Obtém os dados de monitoramento para um alerta específico
   * 
   * @param alertId ID do alerta no sistema CCO
   * @returns Dados enriquecidos do alerta ou undefined se não disponível
   */
  static async getAlertMonitoringData(alertId: number): Promise<MonitoringAlert | undefined> {
    try {
      // Buscar dados do alerta
      const alertResponse = await fetch(`/api/alerts/${alertId}`);
      if (!alertResponse.ok) {
        console.error(`Erro ao buscar dados do alerta: ${alertResponse.statusText}`);
        return undefined;
      }
      
      const alert = await alertResponse.json();
      
      // Buscar dados do ativo associado ao alerta
      const assetState = await this.getAssetMonitoringState(alert.asset_id);
      if (!assetState) {
        return undefined;
      }
      
      // Construir objeto de alerta com dados de monitoramento
      const monitoringAlert: MonitoringAlert = {
        id: alertId.toString(),
        severity: this.mapSeverityToMonitoring(alert.severity),
        status: this.mapStatusToMonitoring(alert.status),
        startTime: alert.created_at,
        description: alert.description,
        hostName: assetState.assetName,
        metrics: assetState.metrics,
        monitoringUrl: assetState.monitoringSystem?.assetUrl
      };
      
      return monitoringAlert;
    } catch (error) {
      console.error("Erro ao buscar dados de monitoramento para alerta:", error);
      return undefined;
    }
  }
  
  /**
   * Mapeia a severidade do sistema CCO para o formato do monitoramento
   */
  private static mapSeverityToMonitoring(ccpSeverity: string): 'information' | 'warning' | 'average' | 'high' | 'critical' {
    const map: {[key: string]: 'information' | 'warning' | 'average' | 'high' | 'critical'} = {
      'baixa': 'information',
      'media': 'warning',
      'alta': 'average',
      'critica': 'critical'
    };
    
    return map[ccpSeverity.toLowerCase()] || 'warning';
  }
  
  /**
   * Mapeia o status do sistema CCO para o formato do monitoramento
   */
  private static mapStatusToMonitoring(ccoStatus: string): 'active' | 'acknowledged' | 'resolved' {
    const map: {[key: string]: 'active' | 'acknowledged' | 'resolved'} = {
      'aberto': 'active',
      'pendente': 'active',
      'reconhecido': 'acknowledged',
      'resolvido': 'resolved'
    };
    
    return map[ccoStatus.toLowerCase()] || 'active';
  }
}

export default MonitoringService;