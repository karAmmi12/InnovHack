import { ChevronRight } from "lucide-react";

const EcommerceContent = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Équipez-vous pour l'aventure
          </h1>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Découvrez notre sélection d'équipements sportifs pour toutes vos activités outdoor
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Voir les nouveautés
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Nos catégories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Randonnée', emoji: '🥾', color: 'from-green-500 to-emerald-600' },
            { name: 'Running', emoji: '🏃', color: 'from-orange-500 to-red-500' },
            { name: 'Vélo', emoji: '🚴', color: 'from-blue-500 to-indigo-600' },
            { name: 'Sports d\'hiver', emoji: '⛷️', color: 'from-cyan-500 to-blue-600' },
          ].map((cat) => (
            <div 
              key={cat.name}
              className={`bg-gradient-to-br ${cat.color} rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform shadow-lg`}
            >
              <span className="text-4xl mb-3 block">{cat.emoji}</span>
              <h3 className="font-semibold text-lg">{cat.name}</h3>
              <ChevronRight className="w-5 h-5 mt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid Placeholder */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Meilleures ventes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">📦</span>
              </div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
                <div className="h-5 bg-blue-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Demo Label */}
      <div className="fixed top-4 left-4 z-40 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Démo Integration Plug-and-Play
        </div>
      </div>
    </div>
  );
};

export default EcommerceContent;
