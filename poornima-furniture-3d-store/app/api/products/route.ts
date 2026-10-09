import { NextResponse } from 'next/server';
import { getSupabase, hasSupabaseConfig } from '@/lib/supabase';

export async function GET(request: Request) {
  if (!hasSupabaseConfig()) return NextResponse.json({ error: 'Catalogue is not configured yet.' }, { status: 503 });
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim().slice(0, 100);
  const category = url.searchParams.get('category')?.trim().slice(0, 100);
  const page = Math.max(1, Math.min(1000, Number(url.searchParams.get('page') || 1)));
  const pageSize = Math.max(1, Math.min(48, Number(url.searchParams.get('limit') || 12)));
  try {
    const supabase = getSupabase();
    let requestQuery = supabase.from('products').select('*, category:categories(name,slug)', { count: 'exact' }).eq('published', true);
    if (query) requestQuery = requestQuery.ilike('name', `%${query.replace(/[%_,]/g, ' ')}%`);
    if (category) {
      const { data: categoryRow } = await supabase.from('categories').select('id').eq('slug', category).eq('published', true).maybeSingle();
      if (!categoryRow) return NextResponse.json({ products: [], total: 0, page, pageSize });
      requestQuery = requestQuery.eq('category_id', categoryRow.id);
    }
    const { data, count, error } = await requestQuery.order('created_at', { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);
    if (error) throw error;
    return NextResponse.json({ products: data || [], total: count || 0, page, pageSize }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch {
    return NextResponse.json({ error: 'Unable to load products right now.' }, { status: 500 });
  }
}
