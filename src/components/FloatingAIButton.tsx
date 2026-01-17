import { Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingAIButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const FloatingAIButton = ({ onClick, isOpen }: FloatingAIButtonProps) => {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-72 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Verronik disponible</p>
            <p className="text-xs text-gray-500 mt-1">
              Besoin de conseils pour votre running demain ? Je peux vous aider !
            </p>
          </div>
        </div>
        {/* Arrow */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45" />
      </div>

      {/* Main Button */}
      <Button
        onClick={onClick}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
      >
        <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
      </Button>

      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20 pointer-events-none" />
    </div>
  );
};

export default FloatingAIButton;
