import { NextResponse } from 'next/server';
import { enquirySchema } from '@/lib/validation';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
const windows = new Map<string, { count: number; start: number }>();
function allowRequest(key: string) {
  const now = Date.now(); const current = windows.get(key);
  if (!current || now - current.start > 10 * 60 * 1000) { windows.set(key, { count: 1, start: now }); return true; }
  if (current.count >= 5) return false;
  current.count += 1; return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!allowRequest(ip)) return NextResponse.json({ error: 'Too many enquiries from this connection. Please try again later.' }, { status: 429 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Please submit valid form data.' }, { status: 400 }); }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Please check your name, phone number and message.', fields: parsed.error.flatten().fieldErrors }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true }); // bot honeypot; no database write
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('enquiries').insert({
      customer_name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      message: parsed.data.message,
      product_id: parsed.data.productId || null,
      status: 'new',
    });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'We could not save your enquiry just now. Please use the showroom contact option.' }, { status: 503 });
  }
}
