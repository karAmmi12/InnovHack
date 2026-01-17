import { useState, useEffect } from "react";
import { X, MapPin, CloudRain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ChatInterface from "./ChatInterface";
import ProductsPanel from "./ProductsPanel";
import { Product } from "@/types/product";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidePanel = ({ isOpen, onClose }: SidePanelProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [simulatedWeather, setSimulatedWeather] = useState<{ condition: string; location: string } | null>(null);

  const handleProductsRecommended = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const handleSimulateWeather = () => {
    setSimulatedWeather({ condition: 'Pluie', location: 'Lyon' });
    setTimeout(() => setSimulatedWeather(null), 100);
  };

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setProducts([]);
    }
  }, [isOpen]);

  // Proactive message configuration
  const proactiveMessage = "Salut ! 👋 Je vois que tu regardes ce VTT. Vu qu'il va pleuvoir demain sur Lyon, veux-tu que je te montre les équipements en stock pour rester au sec pendant ta sortie ?";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[480px] p-0 bg-white border-l shadow-2xl"
      >
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700">
            {/* Close button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-blue-500/30">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm">Expert IA SportContext</h2>
                  <p className="text-xs text-white/70">Conseiller équipement</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Contextual Status Banner */}
            <div className="px-4 py-3 bg-blue-700/50">
              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-200" />
                  <span>
                    <span className="text-blue-200">Position :</span>{" "}
                    <span className="font-medium">Lyon</span>
                    <span className="text-blue-300 ml-1">(Détectée)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="w-3.5 h-3.5 text-blue-200" />
                  <span>
                    <span className="text-blue-200">Demain :</span>{" "}
                    <span className="font-medium text-yellow-300">Averses (80%)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Section */}
            <div className="flex-1 h-[45%] min-h-[250px]">
              <ChatInterface
                onProductsRecommended={handleProductsRecommended}
                simulatedWeather={simulatedWeather}
                proactiveMessage={proactiveMessage}
              />
            </div>

            {/* Products Section */}
            <div className="h-[55%] border-t border-gray-200">
              <ProductsPanel
                products={products}
                onSimulateWeather={handleSimulateWeather}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SidePanel;
