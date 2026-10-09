import { getSupabase, hasSupabaseConfig } from '@/lib/supabase';
import type { Category, Product } from '@/lib/types';

export async function getCatalogueData(): Promise<{ products: Product[]; categories: Category[]; configured: boolean }> {
  if (!hasSupabaseConfig()) return { products: [], categories: [], configured: false };
  try {
    const supabase = getSupabase();
    const [{ data: products }, { data: categories }] = await Promise.all([
      supabase.from('products').select('*, category:categories(name,slug)').eq('published', true).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('published', true).order('display_order'),
    ]);
    return { products: (products || []) as Product[], categories: (categories || []) as Category[], configured: true };
  } catch { return { products: [], categories: [], configured: true }; }
}
