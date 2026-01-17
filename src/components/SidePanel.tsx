import { useState, useEffect } from "react";
import { X, MapPin, CloudRain, Sparkles, Sun, Cloud, Wind, Snowflake, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ChatInterface from "./ChatInterface";
import ProductsPanel from "./ProductsPanel";
import { Product } from "@/types/product";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Données météo simulées pour les 5 prochains jours
const weatherForecast = [
  { day: "Aujourd'hui", date: "17 jan", weather: "pluie", temp: 8, icon: CloudRain, color: "text-blue-300", probability: 75 },
  { day: "Demain", date: "18 jan", weather: "soleil", temp: 12, icon: Sun, color: "text-yellow-300", probability: 10 },
  { day: "Samedi", date: "19 jan", weather: "froid", temp: 2, icon: Snowflake, color: "text-cyan-300", probability: 40 },
  { day: "Dimanche", date: "20 jan", weather: "vent", temp: 6, icon: Wind, color: "text-gray-300", probability: 20 },
  { day: "Lundi", date: "21 jan", weather: "pluie", temp: 9, icon: CloudRain, color: "text-blue-300", probability: 85 },
];

const weatherLabels: Record<string, string> = {
  pluie: "Averses",
  soleil: "Ensoleillé", 
  froid: "Froid / Neige",
  vent: "Venteux",
  chaud: "Chaud"
};

const SidePanel = ({ isOpen, onClose }: SidePanelProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [showDaySelector, setShowDaySelector] = useState(false);
  
  // Position détectée (simulée mais cohérente)
  const detectedLocation = "Lyon";
  
  // Météo du jour sélectionné
  const selectedForecast = weatherForecast[selectedDayIndex];
  const WeatherIcon = selectedForecast.icon;

  const handleProductsRecommended = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setProducts([]);
    }
  }, [isOpen]);

  // Context info dynamique basé sur le jour sélectionné
  const contextInfo = {
    weather: selectedForecast.weather,
    location: detectedLocation
  };

  // Message proactif dynamique selon la météo
  const getProactiveMessage = () => {
    const { day, weather, temp } = selectedForecast;
    const dayText = day === "Aujourd'hui" ? "aujourd'hui" : day === "Demain" ? "demain" : day.toLowerCase();
    
    switch(weather) {
      case "pluie":
        return `Salut ! 👋 Je vois que tu regardes ces chaussures de running. Vu qu'il va pleuvoir ${dayText} sur ${detectedLocation} (${temp}°C), veux-tu que je te conseille la tenue idéale pour courir au sec ?`;
      case "soleil":
        return `Hello ! 👋 Tu regardes ces chaussures de running ? Super choix ! ${dayText.charAt(0).toUpperCase() + dayText.slice(1)} s'annonce ensoleillé sur ${detectedLocation} (${temp}°C) - parfait pour courir ! Tu veux des conseils pour une tenue légère ?`;
      case "froid":
        return `Salut ! 👋 Attention, il va faire froid ${dayText} sur ${detectedLocation} (${temp}°C) ! Pour ton running, je peux te conseiller une tenue thermique adaptée. Ça t'intéresse ?`;
      case "vent":
        return `Hello ! 👋 Je vois que tu prépares un running. ${dayText.charAt(0).toUpperCase() + dayText.slice(1)} sera venteux sur ${detectedLocation} (${temp}°C). Tu veux des conseils coupe-vent ?`;
      default:
        return `Salut ! 👋 Je suis là pour t'aider à choisir ton équipement pour ${dayText} à ${detectedLocation}. Qu'est-ce que tu prévois ?`;
    }
  };

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
                  <h2 className="font-semibold text-sm">Verronik</h2>
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
                    <span className="font-medium">{detectedLocation}</span>
                    <span className="text-blue-300 ml-1">(Détectée)</span>
                  </span>
                </div>
                
                {/* Sélecteur de jour cliquable */}
                <div className="relative">
                  <button
                    onClick={() => setShowDaySelector(!showDaySelector)}
                    className="flex items-center gap-2 hover:bg-white/10 rounded px-2 py-1 transition-colors"
                  >
                    <WeatherIcon className={`w-3.5 h-3.5 ${selectedForecast.color}`} />
                    <span>
                      <span className="text-blue-200">{selectedForecast.day} :</span>{" "}
                      <span className={`font-medium ${selectedForecast.color}`}>
                        {weatherLabels[selectedForecast.weather]} ({selectedForecast.probability}%)
                      </span>
                    </span>
                    <ChevronDown className={`w-3 h-3 text-blue-200 transition-transform ${showDaySelector ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown sélection du jour */}
                  {showDaySelector && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[200px]">
                      {weatherForecast.map((forecast, index) => {
                        const Icon = forecast.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedDayIndex(index);
                              setShowDaySelector(false);
                              setProducts([]); // Reset products when changing day
                            }}
                            className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                              index === selectedDayIndex ? 'bg-blue-50' : ''
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${forecast.weather === 'pluie' ? 'text-blue-500' : forecast.weather === 'soleil' ? 'text-yellow-500' : forecast.weather === 'froid' ? 'text-cyan-500' : 'text-gray-500'}`} />
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium text-gray-800">{forecast.day}</div>
                              <div className="text-xs text-gray-500">{forecast.date}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-700">{forecast.temp}°C</div>
                              <div className="text-xs text-gray-500">{weatherLabels[forecast.weather]}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Section */}
            <div className="flex-1 h-[45%] min-h-[250px]">
              <ChatInterface
                key={`chat-${selectedDayIndex}`}
                onProductsRecommended={handleProductsRecommended}
                simulatedWeather={null}
                proactiveMessage={getProactiveMessage()}
                contextInfo={contextInfo}
              />
            </div>

            {/* Products Section */}
            <div className="h-[55%] border-t border-gray-200">
              <ProductsPanel
                products={products}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SidePanel;
