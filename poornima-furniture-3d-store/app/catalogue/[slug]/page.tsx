import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Ruler, Box } from 'lucide-react';
import { getCatalogueData } from '@/lib/store-data';
import { formatINR } from '@/lib/cart';
import { WhatsAppLink } from '@/components/whatsapp-link';
import { ProductCard } from '@/components/product-card';
import { ProductGallery } from '@/components/product-gallery';
import { ProductModelViewer } from '@/components/product-model-viewer';
import { CartAddButton } from '@/components/cart-add-button';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
 const { slug } = await params; const { products } = await getCatalogueData(); const product = products.find(p => p.slug === slug);
 if (!product) return { title: 'Furniture Details' };
 return { title: product.seo_title || product.name, description: product.seo_description || product.description || `Explore ${product.name} at Poornima Furniture, Nagpur.`, openGraph: { title: product.name, images: product.images?.slice(0, 3) } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params; const { products } = await getCatalogueData(); const product = products.find(p => p.slug === slug); if (!product) notFound();
 const message = `Hello Poornima Furniture, I'm interested in ${product.name}. Product: ${process.env.NEXT_PUBLIC_SITE_URL || ''}/catalogue/${product.slug}`;
 const related = products.filter(p => p.id !== product.id && (p.category_id === product.category_id || p.featured)).slice(0, 4);
 const specs: [string, string][] = [['Availability', product.availability === 'made_to_order' ? 'Made to order' : product.availability === 'unavailable' ? 'Currently unavailable' : 'Available'], ...(product.materials?.length ? [['Materials', product.materials.join(', ')] as [string,string]] : []), ...(product.finishes?.length ? [['Finishes', product.finishes.join(', ')] as [string,string]] : []), ...Object.entries(product.dimensions || {}).map(([k,v]) => [k, v] as [string,string]), ...(product.customization ? [['Customization', product.customization] as [string,string]] : [])];
 return <><section className="page-header"><div className="section-shell"><Link href="/catalogue" className="text-link"><ArrowLeft size={15}/> Back to collection</Link><div style={{marginTop:22}} className="eyebrow">{product.category?.name || 'FURNITURE'} / PRODUCT DETAILS</div></div></section><section className="product-layout section-shell"><div className="product-gallery"><ProductGallery name={product.name} images={product.images?.length ? product.images : product.thumbnail_url ? [product.thumbnail_url] : []}/>{product.model_url ? <div><div className="eyebrow" style={{margin:'20px 0 10px'}}>INTERACTIVE MODEL</div><ProductModelViewer modelUrl={product.model_url} productName={product.name}/></div> : <div className="form-message"><Box size={15} style={{verticalAlign:'middle',marginRight:6}}/>An interactive 3D model is not available for this piece yet.</div>}</div><div className="product-info"><div className="breadcrumbs">Home / Collection / {product.category?.name || 'Furniture'}</div><span className="eyebrow">{product.featured ? 'SELECTED PIECE' : 'POORNIMA COLLECTION'}</span><h1>{product.name}</h1><p className="product-detail-price">{product.price_on_request || product.price == null ? 'Price on request' : formatINR(product.sale_price ?? product.price)}{product.sale_price != null && product.price != null && <span style={{color:'var(--muted)',fontSize:12,textDecoration:'line-through',marginLeft:10}}>{formatINR(product.price)}</span>}</p><p className="product-description">{product.description || 'Ask our showroom team for more information about this piece, available finishes, dimensions and customization options.'}</p>{specs.length>0 && <div className="spec-list">{specs.map(([label,value])=><div className="spec-row" key={label}><span>{label}</span><span>{value}</span></div>)}</div>}<div className="detail-actions"><CartAddButton product={product}/><WhatsAppLink message={message} label="Enquire about this piece"/><Link className="button button-outline" href="/#visit">Visit showroom <ArrowUpRight size={16}/></Link></div><p style={{fontSize:10,color:'var(--muted)',marginTop:20}}>Final pricing and availability are confirmed by the showroom. No online payment is collected on this page.</p></div></section>{related.length>0&&<section className="related-section"><div className="section-shell"><div className="section-heading"><div><span className="eyebrow">YOU MAY ALSO LIKE</span><h2>More to <em>discover.</em></h2></div><Link href="/catalogue" className="text-link">View collection <ArrowUpRight size={15}/></Link></div><div className="product-grid">{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></div></section>}</>;
}
