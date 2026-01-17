import { useState, useEffect } from "react";
import { X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ChatInterface from "./ChatInterface";
import ProductsPanel from "./ProductsPanel";
import { Product } from "@/types/product";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'modal' | 'slide';
}

const ChatModal = ({ isOpen, onClose, mode }: ChatModalProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [simulatedWeather, setSimulatedWeather] = useState<{ condition: string; location: string } | null>(null);

  const handleProductsRecommended = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const handleSimulateWeather = () => {
    setSimulatedWeather({ condition: 'Orage', location: 'Chamonix' });
    setTimeout(() => setSimulatedWeather(null), 100);
  };

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setProducts([]);
    }
  }, [isOpen]);

  if (mode === 'slide') {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:w-[90vw] sm:max-w-[800px] p-0 bg-background">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-blue-600 to-cyan-500">
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl">🤖</span>
                <div>
                  <h2 className="font-semibold">SportContext AI</h2>
                  <p className="text-xs text-white/80">Votre conseiller équipement</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="flex-1 lg:w-2/3 h-[50vh] lg:h-full">
                <ChatInterface
                  onProductsRecommended={handleProductsRecommended}
                  simulatedWeather={simulatedWeather}
                />
              </div>
              <div className="lg:w-1/3 h-[40vh] lg:h-full border-t lg:border-t-0 lg:border-l border-border">
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
  }

  // Modal mode
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-background rounded-2xl shadow-2xl w-[95vw] max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="flex items-center gap-3 text-white">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="font-display font-semibold text-lg">SportContext AI</h2>
              <p className="text-sm text-white/80">Assistant équipement intelligent</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/20">
              <Minimize2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 lg:w-2/3 h-[50%] lg:h-full">
            <ChatInterface
              onProductsRecommended={handleProductsRecommended}
              simulatedWeather={simulatedWeather}
            />
          </div>
          <div className="lg:w-1/3 h-[50%] lg:h-full border-t lg:border-t-0">
            <ProductsPanel
              products={products}
              onSimulateWeather={handleSimulateWeather}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
