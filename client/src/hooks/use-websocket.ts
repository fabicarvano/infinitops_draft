import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

export function useWebSocket() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  // Inicializar WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // Obter o protocolo (ws ou wss) e construir URL corretamente
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Usando pathname para garantir que a URL seja montada corretamente
        const hostname = window.location.host;
        const wsUrl = `${protocol}//${hostname}/ws`;
        console.log('Conectando ao WebSocket:', wsUrl);
        
        // Criar conexão WebSocket
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        // Manipuladores de eventos
        socket.onopen = () => {
          console.log('WebSocket conectado');
          setIsConnected(true);
          toast({
            title: 'Conexão estabelecida',
            description: 'Você está conectado ao servidor em tempo real',
            variant: 'default',
          });
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Mensagem recebida:', data);
            setLastMessage(data);
            setMessages((prev) => [...prev, data]);

            // Notificações para diferentes tipos de mensagens
            handleIncomingMessage(data);
          } catch (error) {
            console.error('Erro ao processar mensagem:', error);
          }
        };

        socket.onclose = () => {
          console.log('WebSocket desconectado');
          setIsConnected(false);
          setTimeout(() => {
            console.log('Tentando reconectar...');
            connectWebSocket();
          }, 3000); // Tentar reconectar após 3 segundos
        };

        socket.onerror = (error) => {
          console.error('Erro no WebSocket:', error);
          toast({
            title: 'Erro de conexão',
            description: 'Não foi possível conectar ao servidor em tempo real',
            variant: 'destructive',
          });
        };
      } catch (error) {
        console.error('Erro ao criar conexão WebSocket:', error);
      }
    };

    // Iniciar conexão
    connectWebSocket();

    // Cleanup ao desmontar o componente
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [toast]);

  // Enviar mensagem pelo WebSocket
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      return true;
    } else {
      console.error('WebSocket não está conectado');
      toast({
        title: 'Erro de comunicação',
        description: 'Não foi possível enviar a mensagem, tentando reconectar...',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Reconhecer um alerta (enviar comando de reconhecimento)
  const acknowledgeAlert = useCallback((alertId: number) => {
    const result = sendMessage({
      type: 'acknowledge_alert',
      alertId,
      timestamp: new Date().toISOString()
    });
    
    if (result) {
      console.log(`Enviando reconhecimento para alerta #${alertId}`);
    }
    
    return result;
  }, [sendMessage]);

  // Atualizar status de um chamado
  const updateTicketStatus = useCallback((ticketId: number, status: string) => {
    return sendMessage({
      type: 'ticket_update',
      ticketId,
      status,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  // Verificar conexão
  const checkConnection = useCallback(() => {
    return sendMessage({
      type: 'ping',
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  // Manipular mensagens recebidas
  const handleIncomingMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'new_alert':
        toast({
          title: 'Novo Alerta',
          description: `${message.alert.severity === 'critical' ? '🔴 CRÍTICO' : '🟠 Alerta'}: ${message.alert.message}`,
          variant: message.alert.severity === 'critical' ? 'destructive' : 'default',
        });
        break;
      
      case 'alert_updated':
        toast({
          title: 'Alerta Atualizado',
          description: `O alerta #${message.alertId} foi reconhecido`,
          variant: 'default',
        });
        break;
      
      case 'ticket_updated':
        toast({
          title: 'Chamado Atualizado',
          description: `Chamado #${message.ticketId} mudou para ${message.status}`,
          variant: 'default',
        });
        break;
      
      case 'vip_ticket':
        toast({
          title: '⭐ Chamado VIP',
          description: `Novo chamado VIP #${message.ticketId} aberto para ${message.client}`,
          variant: 'destructive',
          duration: 7000,
        });
        break;
        
      case 'error':
        toast({
          title: 'Erro',
          description: message.message,
          variant: 'destructive',
        });
        break;
    }
  };

  return {
    isConnected,
    lastMessage,
    messages,
    sendMessage,
    acknowledgeAlert,
    updateTicketStatus,
    checkConnection
  };
}