-- Drop the old column and add the new array column
ALTER TABLE public.products DROP COLUMN IF EXISTS weather_tag;
ALTER TABLE public.products ADD COLUMN weather_tags TEXT[] NOT NULL DEFAULT '{}';

-- Add an index for better performance on array searches
CREATE INDEX IF NOT EXISTS idx_products_weather_tags ON public.products USING GIN(weather_tags);