import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatMessage from "./ChatMessage";
import { ChatMessage as ChatMessageType, Product } from "@/types/product";
import productsData from "@/data/products.json";

interface ChatInterfaceProps {
  onProductsRecommended: (products: Product[]) => void;
  simulatedWeather: { condition: string; location: string } | null;
  initialMessage?: string;
  proactiveMessage?: string;
  contextInfo?: { weather: string; location: string };
}

const ChatInterface = ({ onProductsRecommended, simulatedWeather, initialMessage, proactiveMessage, contextInfo }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Contexte météo et position persistants (initialisés depuis la bannière si disponible)
  const [weatherContext, setWeatherContext] = useState<string>(contextInfo?.weather || "temps normal");
  const [locationContext, setLocationContext] = useState<string>(contextInfo?.location || "votre région");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with proactive message if provided
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      
      if (proactiveMessage) {
        setTimeout(() => {
          const aiMessage: ChatMessageType = {
            id: '1',
            role: 'assistant',
            content: proactiveMessage,
            timestamp: new Date(),
          };
          setMessages([aiMessage]);
        }, 300);
      } else {
        setMessages([{
          id: '1',
          role: 'assistant',
          content: `Bonjour ! 👋 Je suis Verronik, votre assistant équipement.\n\n**Contexte actuel :**\n📍 Position : **${locationContext}**\n🌤️ Météo : **${weatherContext}**\n\n💡 *Astuce : Mentionnez votre ville ("Je suis à Paris") ou la météo ("Il pleut") pour que je personnalise mes recommandations !*`,
          timestamp: new Date(),
        }]);
      }
    }
  }, [hasInitialized, proactiveMessage]);

  // Handle initial message from landing page
  useEffect(() => {
    if (initialMessage && !hasProcessedInitialMessage && hasInitialized) {
      setHasProcessedInitialMessage(true);
      setInput(initialMessage);
      setTimeout(() => {
        processMessage(initialMessage);
      }, 500);
    }
  }, [initialMessage, hasProcessedInitialMessage, hasInitialized]);

  // Handle simulated weather trigger
  useEffect(() => {
    if (simulatedWeather) {
      setWeatherContext(simulatedWeather.condition);
      setLocationContext(simulatedWeather.location);
    }
  }, [simulatedWeather]);

  // Sync context from banner (contextInfo prop)
  useEffect(() => {
    if (contextInfo) {
      setWeatherContext(contextInfo.weather);
      setLocationContext(contextInfo.location);
      console.log('🌤️ Contexte bannière synchronisé - Météo:', contextInfo.weather, '| Position:', contextInfo.location);
    }
  }, [contextInfo]);

  const processMessage = async (messageText: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Détection automatique du contexte météo et position
      const lowerInput = messageText.toLowerCase();
      
      // Détection de la météo dans le message actuel
      let currentWeather = weatherContext; // Utiliser le contexte existant par défaut
      if (lowerInput.includes('pluie') || lowerInput.includes('orage') || lowerInput.includes('humide')) {
        currentWeather = 'pluie';
        setWeatherContext('pluie');
      } else if (lowerInput.includes('froid') || lowerInput.includes('neige') || lowerInput.includes('hiver')) {
        currentWeather = 'froid';
        setWeatherContext('froid');
      } else if (lowerInput.includes('soleil') || lowerInput.includes('chaud') || lowerInput.includes('été')) {
        currentWeather = 'soleil';
        setWeatherContext('soleil');
      } else if (lowerInput.includes('vent') || lowerInput.includes('tempête')) {
        currentWeather = 'vent';
        setWeatherContext('vent');
      }
      
      // Détection de la localisation dans le message actuel
      let currentLocation = locationContext; // Utiliser le contexte existant par défaut
      const locationMatch = lowerInput.match(/à\s+([a-zàâäéèêëïîôùûüÿç\s-]+)/i);
      if (locationMatch) {
        currentLocation = locationMatch[1].trim();
        setLocationContext(currentLocation);
      }

      console.log('🌤️ Contexte utilisé - Météo:', currentWeather, '| Position:', currentLocation);

      // Ajouter un message système pour informer l'utilisateur du contexte détecté
      if (currentWeather !== weatherContext || currentLocation !== locationContext) {
        const contextUpdateMsg: ChatMessageType = {
          id: `context-${Date.now()}`,
          role: 'assistant',
          content: `✅ Contexte mis à jour : ${currentWeather !== weatherContext ? `🌤️ Météo: **${currentWeather}**` : ''} ${currentLocation !== locationContext ? `📍 Position: **${currentLocation}**` : ''}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, contextUpdateMsg]);
      }

      // Appel à l'IA avec le contexte détecté immédiatement
      const { askSportAI, getProductsByIds } = await import("@/lib/aiService");
      const aiResponse = await askSportAI(
        messageText, 
        currentWeather,
        currentLocation
      );
      
      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse?.reply || "Désolé, je n'ai pas pu traiter votre demande.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      
      if (aiResponse && aiResponse.recommended_ids) {
        const products = await getProductsByIds(aiResponse.recommended_ids);
        if (products && products.length > 0) {
          onProductsRecommended(products as Product[]);
        }
      }

    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Désolé, une erreur est survenue. Vérifiez la console pour plus de détails.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    processMessage(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-card">
        <div className="flex gap-3 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ex: "Je veux faire du vélo" (Contexte: ${weatherContext} à ${locationContext})`}
            className="min-h-[48px] max-h-[120px] resize-none bg-background border-border focus:border-primary"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
