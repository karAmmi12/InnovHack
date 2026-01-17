import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/ChatInterface";
import ProductsPanel from "@/components/ProductsPanel";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const location = useLocation();
  const initialMessage = (location.state as { initialMessage?: string })?.initialMessage;
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [simulatedWeather, setSimulatedWeather] = useState<{ condition: string; location: string } | null>(null);

  // Charger quelques produits au démarrage
  useEffect(() => {
    const loadInitialProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(5);
      
      if (data && !error) {
        setRecommendedProducts(data as Product[]);
      }
    };
    loadInitialProducts();
  }, []);

  const handleSimulateWeather = async () => {
    setSimulatedWeather({ condition: 'Orage', location: 'Chamonix' });
    
    // Charger les produits avec weather_tag "Pluie" et category "Randonnée"
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .contains('weather_tags', ['Pluie'])
      .eq('category', 'Randonnée');
    
    if (data && !error) {
      setRecommendedProducts(data as Product[]);
    }
    
    setTimeout(() => setSimulatedWeather(null), 100);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-14 bg-card border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">SportContext AI</span>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Section - 70% */}
        <div className="w-full lg:w-[70%] flex flex-col">
          <ChatInterface 
            onProductsRecommended={setRecommendedProducts}
            simulatedWeather={simulatedWeather}
            initialMessage={initialMessage}
          />
        </div>

        {/* Products Panel - 30% */}
        <div className="hidden lg:flex lg:w-[30%] flex-col">
          <ProductsPanel 
            products={recommendedProducts}
            onSimulateWeather={handleSimulateWeather}
          />
        </div>
      </div>

      {/* Mobile Products Panel Toggle - Only visible on mobile when products exist */}
      {recommendedProducts.length > 0 && (
        <div className="lg:hidden fixed bottom-20 right-4">
          <Button 
            className="rounded-full w-14 h-14 bg-gradient-primary shadow-glow animate-pulse-glow"
            onClick={() => {/* Could add mobile drawer here */}}
          >
            <span className="text-lg font-bold">{recommendedProducts.length}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Chat;
