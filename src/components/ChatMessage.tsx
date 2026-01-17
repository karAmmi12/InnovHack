import { ChatMessage as ChatMessageType } from "@/types/product";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div 
      className={cn(
        "flex gap-3 animate-fade-in",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div 
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-card",
          isAssistant 
            ? "bg-card border border-border rounded-tl-sm" 
            : "bg-gradient-primary text-primary-foreground rounded-tr-sm"
        )}
      >
        <p className={cn(
          "text-sm leading-relaxed whitespace-pre-wrap",
          isAssistant ? "text-foreground" : "text-primary-foreground"
        )}>
          {message.content}
        </p>
        <span className={cn(
          "text-[10px] mt-1 block",
          isAssistant ? "text-muted-foreground" : "text-primary-foreground/70"
        )}>
          {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {!isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
