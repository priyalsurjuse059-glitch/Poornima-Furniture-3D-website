import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase-server';
import { productInputSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Product details are invalid.', fields: parsed.error.flatten().fieldErrors }, { status: 422 });
  const input = parsed.data;
  if (input.sale_price != null && input.price != null && input.sale_price > input.price) return NextResponse.json({ error: 'Sale price cannot exceed regular price.' }, { status: 422 });
  const { data, error } = await supabase.from('products').insert(input).select('*').single();
  if (error) {
    const status = error.code === '23505' ? 409 : 400;
    return NextResponse.json({ error: error.code === '23505' ? 'That product slug already exists.' : 'Could not create this product.' }, { status });
  }
  return NextResponse.json({ product: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  if (!body || typeof body !== 'object' || !('id' in body) || typeof (body as {id: unknown}).id !== 'string') return NextResponse.json({ error: 'A product id is required.' }, { status: 422 });
  const { id, ...raw } = body as Record<string, unknown>;
  const parsed = productInputSchema.partial().safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: 'Product details are invalid.', fields: parsed.error.flatten().fieldErrors }, { status: 422 });
  if (!Object.keys(parsed.data).length) return NextResponse.json({ error: 'Provide at least one field to update.' }, { status: 422 });
  const { data, error } = await supabase.from('products').update(parsed.data).eq('id', id).select('*').single();
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'That product slug already exists.' : 'Could not update this product.' }, { status: error.code === '23505' ? 409 : 400 });
  return NextResponse.json({ product: data });
}

export async function DELETE(request: Request) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'A product id is required.' }, { status: 422 });
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: 'Could not delete this product.' }, { status: 400 });
  return NextResponse.json({ ok: true });
}
