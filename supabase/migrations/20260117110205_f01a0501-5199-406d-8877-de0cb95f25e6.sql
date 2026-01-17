-- Create products table for sports catalog
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  weather_tag TEXT NOT NULL,
  stock_level INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (products are public catalog)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Insert sample products data
INSERT INTO public.products (name, category, price, weather_tag, stock_level, description, image_url) VALUES
  ('Veste Gore-Tex Pro Alpine', 'Randonnée', 289.99, 'Pluie', 12, 'Protection imperméable ultime avec membrane Gore-Tex 3 couches. Respirante et coupe-vent.', 'https://images.unsplash.com/photo-1544923246-77307dd628b9?w=400'),
  ('Pantalon Imperméable Storm', 'Randonnée', 149.99, 'Pluie', 8, 'Pantalon technique avec coutures étanches et ventilation latérale.', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400'),
  ('Chaussures Trail Grip Max', 'Randonnée', 179.99, 'Pluie', 15, 'Adhérence maximale sur terrain humide. Semelle Vibram et membrane waterproof.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
  ('Doudoune Ultra Light', 'Randonnée', 199.99, 'Froid', 6, 'Isolation thermique légère en duvet 800 cuin. Compressible et packable.', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'),
  ('Gants Thermiques Pro', 'Randonnée', 49.99, 'Froid', 25, 'Gants techniques avec doublure thermique et grip silicone.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'),
  ('Lunettes Solaires Sport', 'Running', 89.99, 'Soleil', 20, 'Protection UV400 avec verres polarisés et monture légère.', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'),
  ('Casquette Running UV', 'Running', 34.99, 'Soleil', 30, 'Tissu anti-UV et ultra-respirant. Séchage rapide.', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400'),
  ('Coupe-vent Aero', 'Vélo', 129.99, 'Vent', 10, 'Coupe-vent cycliste ultra-léger avec dos mesh respirant.', 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=400'),
  ('Maillot Vélo Windbreaker', 'Vélo', 89.99, 'Vent', 18, 'Maillot technique avec protection vent avant et respirabilité dos.', 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400'),
  ('Bonnet Technique Merinos', 'Randonnée', 39.99, 'Froid', 22, 'Laine mérinos thermorégulatrice et anti-odeur naturelle.', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400');