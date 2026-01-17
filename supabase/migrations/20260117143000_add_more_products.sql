-- Update existing products to have weather_tags array
UPDATE public.products 
SET weather_tags = ARRAY['Pluie']::TEXT[]
WHERE name IN ('Veste Gore-Tex Pro Alpine', 'Pantalon Imperméable Storm', 'Chaussures Trail Grip Max');

UPDATE public.products 
SET weather_tags = ARRAY['Froid']::TEXT[]
WHERE name IN ('Doudoune Ultra Light', 'Gants Thermiques Pro', 'Bonnet Technique Merinos');

UPDATE public.products 
SET weather_tags = ARRAY['Soleil']::TEXT[]
WHERE name IN ('Lunettes Solaires Sport', 'Casquette Running UV');

UPDATE public.products 
SET weather_tags = ARRAY['Vent']::TEXT[]
WHERE name IN ('Coupe-vent Aero', 'Maillot Vélo Windbreaker');

-- Insert 5 more products to reach 15 total
INSERT INTO public.products (name, category, price, weather_tags, stock_level, description, image_url) VALUES
  ('Veste Softshell Alpine', 'Randonnée', 159.99, ARRAY['Vent', 'Froid']::TEXT[], 14, 'Veste polyvalente coupe-vent et chaude. Stretch 4 directions pour mobilité maximale.', 'https://images.unsplash.com/photo-1525450824786-227cbef70703?w=400'),
  ('Chaussures Running Aero', 'Running', 139.99, ARRAY['Soleil', 'Vent']::TEXT[], 28, 'Chaussures ultra-légères avec mesh respirant et amorti réactif.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
  ('Sac à Dos Hydratation 15L', 'Randonnée', 89.99, ARRAY['Soleil']::TEXT[], 12, 'Sac technique avec poche à eau 2L. Dos ventilé et ceinture ajustable.', 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400'),
  ('Pantalon Vélo Thermique', 'Vélo', 119.99, ARRAY['Froid', 'Pluie']::TEXT[], 9, 'Collant cycliste avec doublure thermique et membrane déperlante.', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400'),
  ('Poncho Randonnée Ultra-Light', 'Randonnée', 49.99, ARRAY['Pluie', 'Vent']::TEXT[], 35, 'Poncho imperméable ultra-compact. Se range dans sa propre poche.', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400');
