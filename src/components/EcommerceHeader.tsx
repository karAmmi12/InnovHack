import { Search, ShoppingCart, User, Menu, Heart, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";

const EcommerceHeader = () => {
  const { itemCount, lastAddedProduct } = useCart();
  const [showAnimation, setShowAnimation] = useState(false);
  const [prevCount, setPrevCount] = useState(itemCount);

  // Animate cart badge when item count changes
  useEffect(() => {
    if (itemCount > prevCount) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 600);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-gray-100 py-1.5 px-4">
        <div className="container mx-auto flex justify-between items-center text-xs text-gray-600">
          <span>Livraison gratuite dès 60€ d'achat</span>
          <div className="flex gap-4">
            <span>Aide</span>
            <span>Suivi de commande</span>
            <span>Magasins</span>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-xl text-blue-600 hidden sm:block">DECATHLON</span>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Rechercher un produit, un sport..."
                className="pl-10 pr-4 py-2.5 bg-gray-100 border-gray-200 rounded-full focus:bg-white"
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative text-gray-600 group">
              <ShoppingCart className={`w-5 h-5 transition-transform ${showAnimation ? 'scale-125' : ''}`} />
              <span 
                className={`absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center transition-all ${
                  showAnimation 
                    ? 'bg-green-500 scale-125 animate-bounce' 
                    : 'bg-red-500'
                }`}
              >
                {showAnimation ? <Check className="w-3 h-3" /> : itemCount + 3}
              </span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Cart Added Toast */}
      {lastAddedProduct && (
        <div className="absolute top-full right-4 mt-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in flex items-center gap-2 z-50">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Ajouté au panier !</span>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="bg-white border-t border-gray-100 hidden lg:block">
        <div className="container mx-auto px-4">
          <ul className="flex gap-8 py-3 text-sm font-medium text-gray-700">
            <li className="hover:text-blue-600 cursor-pointer">Sports</li>
            <li className="hover:text-blue-600 cursor-pointer">Randonnée</li>
            <li className="hover:text-blue-600 cursor-pointer">Running</li>
            <li className="hover:text-blue-600 cursor-pointer text-blue-600 font-semibold">Vélo</li>
            <li className="hover:text-blue-600 cursor-pointer">Fitness</li>
            <li className="hover:text-blue-600 cursor-pointer">Sports d'eau</li>
            <li className="hover:text-blue-600 cursor-pointer text-red-600 font-semibold">Promotions</li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default EcommerceHeader;
