import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatMessage from "./ChatMessage";
import { ChatMessage as ChatMessageType, Product } from "@/types/product";

interface ChatInterfaceProps {
  onProductsRecommended: (products: Product[]) => void;
  simulatedWeather: { condition: string; location: string } | null;
  initialMessage?: string;
  proactiveMessage?: string;
}

const ChatInterface = ({ onProductsRecommended, simulatedWeather, initialMessage, proactiveMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        // Small delay to make it feel natural
        setTimeout(() => {
          const aiMessage: ChatMessageType = {
            id: '1',
            role: 'assistant',
            content: proactiveMessage,
            timestamp: new Date(),
          };
          setMessages([aiMessage]);
          
          // Auto-fetch rain products for VTT context
          fetchProductsForWeather('Pluie', 'Vélo');
        }, 800);
      } else {
        // Default greeting
        setMessages([{
          id: '1',
          role: 'assistant',
          content: "Bonjour ! 👋 Je suis votre assistant SportContext AI. Dites-moi quelle activité sportive vous prévoyez et les conditions météo, et je vous recommanderai l'équipement idéal !",
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
      // Auto-send after a short delay
      setTimeout(() => {
        processMessage(initialMessage);
      }, 500);
    }
  }, [initialMessage, hasProcessedInitialMessage, hasInitialized]);

  // Handle simulated weather trigger
  useEffect(() => {
    if (simulatedWeather) {
      handleSimulatedWeather(simulatedWeather);
    }
  }, [simulatedWeather]);

  const handleSimulatedWeather = async (weather: { condition: string; location: string }) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: `🌧️ [Simulation Météo] Orage prévu à ${weather.location}. Quels équipements me recommandez-vous pour une randonnée ?`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const assistantMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `⚡ Alerte météo : Orage prévu à ${weather.location} !\n\nPour votre randonnée sous ces conditions difficiles, je vous recommande particulièrement :\n\n• **Protection imperméable** - Veste Gore-Tex indispensable\n• **Chaussures étanches** - Semelles adhérentes pour terrain humide\n• **Pantalon technique** - Avec coutures étanches\n\nJ'ai sélectionné les meilleurs produits adaptés à la pluie et à la randonnée. Consultez le panneau de droite ! 👉`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);

    // Trigger product recommendation fetch
    fetchProductsForWeather('Pluie', 'Randonnée');
  };

  const fetchProductsForWeather = async (weatherTag: string, category: string) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .contains('weather_tags', [weatherTag])
        .eq('category', category)
        .order('stock_level', { ascending: false });

      if (error) throw error;
      if (data) {
        onProductsRecommended(data as Product[]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

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

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Detect keywords and recommend products
    const lowerInput = messageText.toLowerCase();
    let weatherTag = '';
    let category = '';
    let responseText = '';

    if (lowerInput.includes('pluie') || lowerInput.includes('orage') || lowerInput.includes('humide')) {
      weatherTag = 'Pluie';
      responseText = '🌧️ Je détecte des conditions pluvieuses ! ';
    } else if (lowerInput.includes('froid') || lowerInput.includes('neige') || lowerInput.includes('hiver')) {
      weatherTag = 'Froid';
      responseText = '❄️ Conditions froides détectées ! ';
    } else if (lowerInput.includes('soleil') || lowerInput.includes('chaud') || lowerInput.includes('été')) {
      weatherTag = 'Soleil';
      responseText = '☀️ Temps ensoleillé ! ';
    } else if (lowerInput.includes('vent') || lowerInput.includes('tempête')) {
      weatherTag = 'Vent';
      responseText = '💨 Conditions venteuses ! ';
    }

    if (lowerInput.includes('randonnée') || lowerInput.includes('marche') || lowerInput.includes('trek')) {
      category = 'Randonnée';
      responseText += 'Pour votre randonnée, ';
    } else if (lowerInput.includes('vélo') || lowerInput.includes('cyclisme')) {
      category = 'Vélo';
      responseText += 'Pour votre sortie vélo, ';
    } else if (lowerInput.includes('running') || lowerInput.includes('course') || lowerInput.includes('jogging')) {
      category = 'Running';
      responseText += 'Pour votre course, ';
    }

    if (weatherTag && category) {
      responseText += `j'ai trouvé des équipements parfaitement adaptés. Consultez mes recommandations dans le panneau latéral ! 👉`;
      fetchProductsForWeather(weatherTag, category);
    } else if (weatherTag || category) {
      responseText += `pouvez-vous me préciser ${!category ? "l'activité sportive" : "les conditions météo"} pour des recommandations plus précises ?`;
    } else {
      responseText = "Je comprends votre demande ! Pour vous recommander l'équipement idéal, dites-moi :\n\n• **L'activité** : Randonnée, Vélo, Running...\n• **La météo** : Pluie, Soleil, Froid, Vent...\n\nPar exemple : \"Je prévois une randonnée sous la pluie\"";
    }

    const assistantMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
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
      {/* Chat Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground">SportContext AI</h2>
            <p className="text-xs text-muted-foreground">Assistant équipement sportif</p>
          </div>
        </div>
      </div>

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
            placeholder="Décrivez votre activité et les conditions météo..."
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
