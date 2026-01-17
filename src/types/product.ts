export interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  weather_tags: string[];
  stock_level: number;
  description: string | null;
  image_url: string | null;
  created_at?: string;
}
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  products?: Product[];
}
