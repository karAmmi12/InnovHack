import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWidgetProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatWidget = ({ isOpen, onClick }: ChatWidgetProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      <Button
        onClick={onClick}
        className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-700 hover:bg-gray-800 rotate-0' 
            : 'bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 animate-bounce hover:animate-none'
        }`}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
      </Button>
      
      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-20 right-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Expert IA disponible
          </div>
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-3 h-3 bg-gray-900" />
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
