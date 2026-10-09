import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight, MoveUpRight } from 'lucide-react';
import { Reveal } from '@/components/reveal';
import { ProductCard } from '@/components/product-card';
import { WhatsAppLink } from '@/components/whatsapp-link';
import { hasSupabaseConfig, getSupabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';

const collections = [
  { title: 'Living room', slug: 'sofas', eyebrow: '01 / LIVING', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1100&q=85', description: 'A softer place to land.' },
  { title: 'Bedroom', slug: 'beds', eyebrow: '02 / REST', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1100&q=85', description: 'Make room for slow mornings.' },
  { title: 'TV units', slug: 'tv-units', eyebrow: '03 / DETAILS', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1100&q=85', description: 'Bring the whole room together.' },
  { title: 'Dining', slug: 'dining', eyebrow: '04 / TOGETHER', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85', description: 'For meals that turn into memories.' },
];

async function getFeaturedProducts(): Promise<Product[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const supabase = getSupabase();
    const { data } = await supabase.from('products').select('*, category:categories(name,slug)').eq('published', true).eq('featured', true).order('created_at', { ascending: false }).limit(4);
    return (data || []) as Product[];
  } catch { return []; }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();
  return <>
    <section className="hero"><div className="hero-image"><Image src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=90" alt="Warm, considered living room with contemporary furniture" fill priority sizes="100vw" className="cover-image" /></div><div className="hero-overlay" />
      <div className="hero-content"><span className="eyebrow light-eyebrow"><span className="status-dot" /> FURNITURE FOR THE WAY YOU LIVE</span><h1>Make room for<br /><em>what matters.</em></h1><p>Thoughtful furniture, warm materials, and pieces that feel at home in your home.</p><div className="hero-actions"><Link className="button button-ivory" href="/catalogue">Explore collection <ArrowUpRight size={17} /></Link><Link className="hero-text-link" href="/#visit">Visit our showroom <ArrowDownRight size={17} /></Link></div></div>
      <div className="hero-index"><span>01 — 04</span><span>POORNIMA FURNITURE · NAGPUR</span></div><div className="hero-scroll"><span className="scroll-line" /> SCROLL TO DISCOVER</div>
    </section>
    <section className="intro-section section-shell"><Reveal><span className="eyebrow">A HOME, WELL CONSIDERED</span><div className="intro-grid"><h2>Good furniture doesn't just fill a room.<br /><em>It makes it yours.</em></h2><div className="intro-copy"><p>From the first coffee of the day to evenings that stretch a little longer, the right pieces make everyday life feel a little more like home.</p><Link href="/catalogue" className="text-link">Find your piece <ArrowUpRight size={16} /></Link></div></div></Reveal></section>
    <section className="collections-section section-shell"><div className="section-heading"><div><span className="eyebrow">EXPLORE BY SPACE</span><h2>Pieces for every <em>corner.</em></h2></div><Link className="text-link" href="/catalogue">View all furniture <ArrowUpRight size={16} /></Link></div><div className="collection-grid">{collections.map((item, i) => <Reveal key={item.slug} delay={i * .07}><Link href={`/catalogue?category=${item.slug}`} className={`collection-card collection-${i}`}><div className="collection-photo"><Image src={item.image} alt={`${item.title} furniture inspiration`} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 25vw" /></div><div className="collection-shade" /><div className="collection-content"><span className="eyebrow light-eyebrow">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.description}</p></div><span className="collection-arrow"><ArrowUpRight /></span></Link></Reveal>)}</div></section>
    <section className="featured-section"><div className="section-shell"><div className="section-heading"><div><span className="eyebrow">A CLOSER LOOK</span><h2>Selected <em>favourites.</em></h2></div><Link className="text-link" href="/catalogue">Browse the collection <ArrowUpRight size={16} /></Link></div>{products.length ? <div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} />)}</div> : <div className="catalogue-empty"><span className="empty-mark">P.</span><div><h3>Your next favourite starts here.</h3><p>Our featured pieces will appear here as the catalogue is added. Explore the collection or ask the showroom about a piece you have in mind.</p><div className="inline-actions"><Link className="button button-dark" href="/catalogue">Explore catalogue <ArrowRight size={16} /></Link><WhatsAppLink /></div></div></div>}</div></section>
    <section className="showroom-banner"><div className="showroom-art"><Image src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85" alt="Sunlit, contemporary interior with natural materials" fill sizes="100vw" /></div><div className="showroom-wash" /><div className="showroom-copy section-shell"><Reveal><span className="eyebrow light-eyebrow">SEE IT FROM A DIFFERENT ANGLE</span><h2>Some pieces deserve<br />a <em>closer look.</em></h2><p>Explore our interactive 3D viewer when a product model is available, or browse the collection at your own pace.</p><Link href="/showroom" className="button button-ivory">Enter the 3D showroom <MoveUpRight size={17} /></Link></Reveal></div></section>
    <section className="story-section section-shell" id="story"><div className="story-photo"><Image src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85" alt="Natural wood, soft fabric and calm interior details" fill sizes="(max-width: 750px) 100vw, 48vw" /></div><div className="story-copy"><Reveal><span className="eyebrow">THE POORNIMA APPROACH</span><h2>Made for the moments<br />that make a <em>home.</em></h2><p>Furniture is personal. It is the sofa everyone gathers on, the table where stories are shared, the quiet corner that is only yours.</p><p>At Poornima Furniture, we invite you to explore styles, compare finishes and visit us in person to find pieces that fit your space and the way you live.</p><Link href="/catalogue" className="text-link">Explore the collection <ArrowUpRight size={16} /></Link></Reveal></div></section>
    <section className="visit-section" id="visit"><div className="visit-inner section-shell"><div><span className="eyebrow">COME BY, TAKE A LOOK</span><h2>See it in person.<br /><em>Feel the difference.</em></h2><p>Sometimes the best way to choose furniture is to sit down, look closer, and picture it at home.</p></div><div className="visit-card"><span className="visit-number">01 / THE SHOWROOM</span><h3>Poornima Furniture</h3><p>Sutgirni, Hingna Road,<br />Nagpur, Maharashtra, India</p><div className="visit-actions"><a className="button button-dark" href="https://www.google.com/maps/search/?api=1&query=Sutgirni%2C%20Hingna%20Road%2C%20Nagpur" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16} /></a><WhatsAppLink label="Ask us a question" /></div><small>Phone number and opening hours can be added in site settings.</small></div></div></section>
  </>;
}
