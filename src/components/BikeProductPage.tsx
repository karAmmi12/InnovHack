import { Star, Heart, Truck, RotateCcw, Shield, ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const BikeProductPage = () => {
  const [selectedSize, setSelectedSize] = useState("42");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer">Accueil</span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-blue-600 cursor-pointer">Running</span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-blue-600 cursor-pointer">Chaussures</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800 font-medium">Kiprun KS 900</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm aspect-square flex items-center justify-center relative overflow-hidden group">
              {/* Product image */}
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop" 
                alt="Kiprun KS 900"
                className="w-full h-full object-contain rounded-xl"
              />
              <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                -25% SOLDES
              </Badge>
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                <Heart className="w-6 h-6" />
              </Button>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-lg bg-white shadow-sm flex-shrink-0 cursor-pointer border-2 ${
                    i === 1 ? 'border-blue-600' : 'border-transparent'
                  } hover:border-blue-400 transition-colors flex items-center justify-center`}
                >
                  <span className="text-2xl">👟</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-blue-600 font-medium mb-1">KIPRUN</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Chaussures Running Kiprun KS 900
              </h1>
              
              {/* Ratings */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">4.2/5 (127 avis)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-blue-600">149,00 €</span>
                <span className="text-xl text-gray-400 line-through">199,00 €</span>
              </div>
              <p className="text-green-600 font-medium text-sm">
                ✓ Économisez 50,00 € avec nos SOLDES
              </p>
              <p className="text-gray-500 text-sm">Ou 3x 49,67€ sans frais</p>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Pointure</span>
                <button className="text-blue-600 text-sm hover:underline">Guide des tailles</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['39', '40', '41', '42', '43', '44', '45'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-600 hover:border-blue-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-800">Quantité</span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <Button className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold">
                Ajouter au panier
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-2">
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="bg-green-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-green-700">
                <Truck className="w-5 h-5" />
                <div>
                  <p className="font-medium">Livraison gratuite</p>
                  <p className="text-sm text-green-600">Estimée le 22-24 janvier</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <RotateCcw className="w-5 h-5" />
                <span className="text-sm">Retour gratuit sous 365 jours</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Garantie 2 ans pièces et main d'œuvre</span>
              </div>
            </div>

            {/* Store Availability */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Disponibilité en magasin</p>
                  <p className="text-sm text-green-600">✓ En stock à Lyon Part-Dieu</p>
                </div>
                <Button variant="link" className="text-blue-600">
                  Voir les magasins
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description du produit</h2>
          <p className="text-gray-600 leading-relaxed">
            La Kiprun KS 900 est conçue pour les coureurs réguliers recherchant confort et performance. 
            Sa semelle intermédiaire en mousse Kalensole offre un amorti dynamique et un retour d'énergie optimal.
            Idéale pour les entraînements quotidiens et les compétitions sur route.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-800">Amorti</p>
              <p className="text-gray-600 text-sm">Mousse Kalensole haute densité</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-800">Drop</p>
              <p className="text-gray-600 text-sm">8 mm</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-800">Poids</p>
              <p className="text-gray-600 text-sm">280 g (pointure 42)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeProductPage;
