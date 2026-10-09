export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string | null;
  category?: Pick<Category, 'name' | 'slug'> | null;
  price: number | null;
  sale_price: number | null;
  price_on_request: boolean;
  images: string[];
  thumbnail_url: string | null;
  materials: string[];
  finishes: string[];
  dimensions: Record<string, string> | null;
  availability: 'available' | 'made_to_order' | 'unavailable';
  customization: string | null;
  featured: boolean;
  published: boolean;
  model_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type CartLine = { productId: string; slug: string; name: string; image: string | null; quantity: number; unitPrice: number | null; priceOnRequest: boolean };
