import { Sparkles, ChevronRight } from "lucide-react";

interface AIBannerProps {
  onClick: () => void;
}

const AIBanner = ({ onClick }: AIBannerProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-4 cursor-pointer hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 group"
    >
      <div className="container mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 animate-pulse">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium text-sm sm:text-base">
            Besoin d'aide pour choisir votre équipement selon la météo ? 
          </span>
        </div>
        <button className="flex items-center gap-1 bg-white/20 hover:bg-white/30 rounded-full px-4 py-1.5 text-sm font-semibold transition-all backdrop-blur-sm">
          Demandez à notre expert IA
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default AIBanner;
