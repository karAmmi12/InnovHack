import { useState } from "react";
import { CartProvider } from "@/contexts/CartContext";
import EcommerceHeader from "@/components/EcommerceHeader";
import BikeProductPage from "@/components/BikeProductPage";
import FloatingAIButton from "@/components/FloatingAIButton";
import SidePanel from "@/components/SidePanel";

const Landing = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Simulated Decathlon E-commerce Site */}
        <EcommerceHeader />
        
        {/* Main Product Page (VTT) */}
        <BikeProductPage />
        
        {/* Floating AI Expert Button */}
        <FloatingAIButton 
          onClick={() => setIsPanelOpen(true)} 
          isOpen={isPanelOpen}
        />
        
        {/* AI Side Panel */}
        <SidePanel 
          isOpen={isPanelOpen} 
          onClose={() => setIsPanelOpen(false)}
        />

        {/* Integration Demo Label */}
        <div className="fixed top-20 left-4 z-30 bg-black/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Démo Widget Plug-and-Play
          </div>
        </div>
      </div>
    </CartProvider>
  );
};

export default Landing;
