import type { Metadata } from 'next';
import { CatalogueClient } from '@/components/catalogue-client';
import { getCatalogueData } from '@/lib/store-data';

export const metadata: Metadata = { title: 'Furniture Collection', description: 'Explore sofas, beds, TV units and furniture at Poornima Furniture, Nagpur.' };
export default async function CataloguePage() {
  const { products, categories, configured } = await getCatalogueData();
  return <><section className="page-header"><div className="section-shell"><span className="eyebrow">THE COLLECTION</span><h1>Find your <em>favourite.</em></h1><p>Considered pieces for the spaces you live in every day. Find a style, compare details, and enquire about what feels right.</p></div></section><section className="catalogue-section section-shell"><CatalogueClient initialProducts={products} categories={categories} configured={configured} /></section></>;
}
