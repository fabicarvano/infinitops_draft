import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Eye, EyeOff, Clock, Send } from "lucide-react";

// Tipos simplificados
export type CommentType = "internal" | "external";
export type UserRole = "operator" | "technician" | "manager" | "admin";

interface TicketComment {
  id: number;
  ticketId: number;
  userId: number;
  userName: string;
  userRole: UserRole;
  userAvatar?: string;
  content: string;
  type: CommentType;
  createdAt: string;
}

interface CommentSectionProps {
  ticketId: number;
  comments: TicketComment[];
  currentUserId: number;
  currentUserName: string;
  currentUserRole: UserRole;
  currentUserAvatar?: string;
  onAddComment?: (ticketId: number, content: string, type: CommentType) => void;
  className?: string;
}

export function CommentSection({
  ticketId,
  comments = [],
  currentUserId,
  currentUserName,
  currentUserRole,
  currentUserAvatar,
  onAddComment,
  className = ""
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [commentType, setCommentType] = useState<CommentType>("external");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  // Função para adicionar um novo comentário
  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Erro",
        description: "O comentário não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulação de uma chamada de API
    setTimeout(() => {
      if (onAddComment) {
        onAddComment(ticketId, newComment, commentType);
      }
      
      toast({
        title: "Comentário Adicionado",
        description: `Seu comentário foi adicionado com sucesso.`
      });
      
      setNewComment("");
      setIsSubmitting(false);
    }, 500);
  };
  
  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };
  
  // Obter iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Função para obter a cor do cargo
  const getRoleBadgeStyles = (role: UserRole) => {
    switch (role) {
      case "operator":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "technician":
        return "bg-green-100 text-green-800 border-green-200";
      case "manager":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };
  
  // Função para obter o nome do cargo em português
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case "operator":
        return "Operador";
      case "technician":
        return "Técnico";
      case "manager":
        return "Gerente";
      case "admin":
        return "Administrador";
      default:
        return role;
    }
  };
  
  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-slate-500" />
        <h3 className="text-lg font-medium">Comentários</h3>
        <Badge variant="outline" className="ml-2">
          {comments.length}
        </Badge>
      </div>
      
      {/* Lista de comentários */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <MessageSquare className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <h3 className="font-medium text-slate-600">Nenhum comentário</h3>
            <p className="text-slate-500 mt-1">
              Este chamado ainda não possui comentários.
            </p>
          </div>
        ) : (
          comments.map(comment => (
            <div 
              key={comment.id} 
              className={`p-4 rounded-lg ${
                comment.type === "internal" 
                  ? "bg-slate-50 border border-slate-200" 
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Avatar>
                    {comment.userAvatar ? (
                      <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                    ) : (
                      <AvatarFallback>{getInitials(comment.userName)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.userName}</span>
                      <Badge variant="outline" className={getRoleBadgeStyles(comment.userRole)}>
                        {getRoleName(comment.userRole)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={comment.type === "internal" 
                  ? "bg-purple-100 text-purple-800 border-purple-200"
                  : "bg-green-100 text-green-800 border-green-200"
                }>
                  <div className="flex items-center gap-1">
                    {comment.type === "internal" ? (
                      <>
                        <EyeOff className="h-3 w-3" />
                        <span>Interno</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3" />
                        <span>Público</span>
                      </>
                    )}
                  </div>
                </Badge>
              </div>
              
              <div className="ml-10 text-sm whitespace-pre-wrap">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>
      
      <Separator className="my-4" />
      
      {/* Formulário de novo comentário */}
      <div className="space-y-3">
        <Textarea
          placeholder="Adicione um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] resize-y"
        />
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="comment-type"
              checked={commentType === "internal"}
              onCheckedChange={(checked) => {
                setCommentType(checked ? "internal" : "external");
              }}
            />
            <Label htmlFor="comment-type" className="flex items-center gap-1">
              {commentType === "internal" ? (
                <>
                  <EyeOff className="h-4 w-4 text-purple-500" />
                  <span>Comentário interno</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 text-green-500" />
                  <span>Comentário público</span>
                </>
              )}
            </Label>
          </div>
          
          <Button 
            onClick={handleAddComment} 
            disabled={isSubmitting || !newComment.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar
          </Button>
        </div>
        
        {commentType === "internal" && (
          <p className="text-xs text-slate-500 italic">
            Comentários internos são visíveis apenas para a equipe de suporte, não para o cliente.
          </p>
        )}
      </div>
    </div>
  );
}