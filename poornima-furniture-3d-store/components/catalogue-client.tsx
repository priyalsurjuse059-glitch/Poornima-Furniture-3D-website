'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Category, Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';

export function CatalogueClient({ initialProducts, categories, configured }: { initialProducts: Product[]; categories: Category[]; configured: boolean }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [availability, setAvailability] = useState('all');
  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selected = initialProducts.filter(p => {
      const matchesQuery = !q || [p.name, p.description || '', p.category?.name || '', ...(p.materials || [])].join(' ').toLowerCase().includes(q);
      const matchesCategory = category === 'all' || p.category?.slug === category;
      const matchesAvailability = availability === 'all' || p.availability === availability;
      return matchesQuery && matchesCategory && matchesAvailability;
    });
    if (sort === 'price-low') return selected.sort((a, b) => (a.sale_price ?? a.price ?? Number.MAX_SAFE_INTEGER) - (b.sale_price ?? b.price ?? Number.MAX_SAFE_INTEGER));
    if (sort === 'price-high') return selected.sort((a, b) => (b.sale_price ?? b.price ?? -1) - (a.sale_price ?? a.price ?? -1));
    if (sort === 'name') return selected.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'featured') return selected.sort((a, b) => Number(b.featured) - Number(a.featured));
    return selected;
  }, [initialProducts, query, category, sort, availability]);

  return <><div className="catalogue-toolbar"><div className="filter-controls"><label className="sr-only" htmlFor="catalogue-search">Search furniture</label><div style={{position:'relative',display:'flex',alignItems:'center'}}><Search size={16} style={{position:'absolute',left:12,color:'var(--muted)'}}/><input id="catalogue-search" className="input" style={{paddingLeft:37}} placeholder="Search furniture…" value={query} onChange={e=>setQuery(e.target.value)} /></div><label className="sr-only" htmlFor="category-filter">Category</label><select id="category-filter" className="select" value={category} onChange={e=>setCategory(e.target.value)}><option value="all">All categories</option>{categories.map(c=><option key={c.id} value={c.slug}>{c.name}</option>)}</select><label className="sr-only" htmlFor="availability-filter">Availability</label><select id="availability-filter" className="select" value={availability} onChange={e=>setAvailability(e.target.value)}><option value="all">Any availability</option><option value="available">Available</option><option value="made_to_order">Made to order</option></select><label className="sr-only" htmlFor="sort-filter">Sort products</label><select id="sort-filter" className="select" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured first</option><option value="name">Name A–Z</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div><span className="result-count"><SlidersHorizontal size={13} style={{verticalAlign:'middle',marginRight:6}}/>{products.length} pieces</span></div>
    {products.length ? <div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><h2>{initialProducts.length ? 'Nothing quite matches.' : 'A collection in the making.'}</h2><p>{initialProducts.length ? 'Try another search or remove a filter.' : !configured ? 'The live catalogue will appear after Supabase is configured. You can still contact the showroom about furniture.' : 'Products will appear here after they are added and published in the admin dashboard.'}</p>{initialProducts.length ? <button className="button button-outline" onClick={()=>{setQuery('');setCategory('all');setAvailability('all');setSort('featured')}}>Clear filters</button> : <Link href="/#visit" className="button button-dark">Visit the showroom</Link>}</div>}</>;
}
