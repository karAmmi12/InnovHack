import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Check, Flame } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Simulate a brief delay for the animation
    setTimeout(() => {
      addToCart(product);
      setIsAdding(false);
      setJustAdded(true);
      
      // Reset after showing success
      setTimeout(() => {
        setJustAdded(false);
      }, 1500);
    }, 300);
  };

  const isLowStock = product.stock_level > 0 && product.stock_level <= 5;
  const isOutOfStock = product.stock_level === 0;

  const weatherColors: Record<string, string> = {
    'Pluie': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Froid': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    'Soleil': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Vent': 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  };

  return (
    <div 
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200 animate-slide-in-right"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Product Image */}
      <div className="relative h-28 overflow-hidden bg-gray-50">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {product.weather_tags.map((tag) => (
            <Badge key={tag} className={`text-xs border ${weatherColors[tag] || 'bg-blue-500/10 text-blue-600'}`}>
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Low Stock Urgency */}
        {isLowStock && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
              <Flame className="w-3 h-3" />
              <span>Plus que {product.stock_level} en stock !</span>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 space-y-2">
        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">
          {product.name}
        </h4>
        
        <p className="text-xs text-gray-500 line-clamp-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-blue-600">
            {product.price.toFixed(2)}€
          </span>
          {!isLowStock && !isOutOfStock && (
            <span className="text-xs text-green-600 font-medium">En stock</span>
          )}
          {isOutOfStock && (
            <span className="text-xs text-red-500 font-medium">Rupture</span>
          )}
        </div>

        <Button 
          size="sm" 
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
          className={`w-full mt-2 rounded-lg font-medium transition-all duration-300 ${
            justAdded 
              ? 'bg-green-500 hover:bg-green-500 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isAdding ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Ajout...
            </span>
          ) : justAdded ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Ajouté !
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Ajouter au panier
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
