import { useState } from "react";
import { CloudRain, MapPin, Sparkles, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductsPanelProps {
  products: Product[];
  onSimulateWeather: () => void;
}

const ProductsPanel = ({ products, onSimulateWeather }: ProductsPanelProps) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Panel Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Équipements Recommandés</h3>
          </div>
          {products.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {products.length} produit{products.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {/* Weather Simulation Button */}
        <Button
          onClick={onSimulateWeather}
          variant="outline"
          size="sm"
          className="w-full gap-2 border-blue-200 hover:bg-blue-50 hover:border-blue-400 text-gray-700 group text-xs h-8"
        >
          <CloudRain className="w-3.5 h-3.5 text-blue-500 group-hover:animate-bounce" />
          <span>Simuler météo : Averses à Lyon</span>
          <MapPin className="w-3 h-3 text-gray-400" />
        </Button>
      </div>

      {/* Products List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Package className="w-7 h-7 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-800 mb-1 text-sm">Aucune recommandation</h4>
              <p className="text-xs text-gray-500 max-w-[200px]">
                Posez une question à l'assistant ou simulez une météo pour voir des produits adaptés.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProductsPanel;
