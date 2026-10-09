import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Package, MessageSquareText, ShoppingCart, Settings2 } from 'lucide-react';
import { requireAdmin } from '@/lib/supabase-server';
import { AdminDashboard } from '@/components/admin-dashboard';

export const metadata = { title: 'Admin Dashboard' };
export default async function AdminPage() {
 const { supabase, user, isAdmin } = await requireAdmin();
 if (!user) redirect('/admin/login');
 if (!isAdmin) return <section className="admin-gate section-shell"><div><div className="showroom-fallback-icon"><ShieldCheck/></div><span className="eyebrow">RESTRICTED AREA</span><h1>Administrator access required.</h1><p>This account is signed in but is not authorized to manage the showroom. Ask an existing administrator to grant access.</p><Link className="button button-outline" href="/">Return to storefront</Link></div></section>;
 const [products,enquiries,orders] = await Promise.all([
  supabase.from('products').select('id,published', {count:'exact',head:true}),
  supabase.from('enquiries').select('id', {count:'exact',head:true}),
  supabase.from('orders').select('id', {count:'exact',head:true}),
 ]);
 const {data:productRows}=await supabase.from('products').select('*,category:categories(name,slug)').order('created_at',{ascending:false}).limit(100);
 const {data:enquiryRows}=await supabase.from('enquiries').select('id,customer_name,phone,email,message,status,created_at,product:products(name)').order('created_at',{ascending:false}).limit(50);
 return <section className="admin-shell section-shell"><div className="admin-top"><div><span className="eyebrow">POORNIMA FURNITURE / CONTROL ROOM</span><h1 style={{fontSize:42,margin:'12px 0'}}>Welcome back.</h1><p style={{color:'var(--muted)',fontSize:12,margin:0}}>Signed in as {user.email}</p></div><Link href="/" className="button button-outline">View storefront ↗</Link></div><div className="product-grid" style={{marginBottom:40}}><div className="visit-card"><Package/><p className="product-category">TOTAL PRODUCTS</p><h2 style={{fontFamily:'var(--serif)',fontSize:34,margin:0}}>{products.count||0}</h2></div><div className="visit-card"><MessageSquareText/><p className="product-category">ENQUIRIES</p><h2 style={{fontFamily:'var(--serif)',fontSize:34,margin:0}}>{enquiries.count||0}</h2></div><div className="visit-card"><ShoppingCart/><p className="product-category">ORDERS</p><h2 style={{fontFamily:'var(--serif)',fontSize:34,margin:0}}>{orders.count||0}</h2></div><div className="visit-card"><Settings2/><p className="product-category">CONFIGURATION</p><h2 style={{fontFamily:'var(--serif)',fontSize:22,margin:0}}>Owner setup</h2></div></div><AdminDashboard products={productRows||[]} enquiries={enquiryRows||[]}/></section>;
}
