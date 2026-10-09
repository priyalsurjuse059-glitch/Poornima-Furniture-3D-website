import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatINR } from '@/lib/cart';

export function ProductCard({ product }: { product: Product }) {
  const image = product.thumbnail_url || product.images?.[0];
  return <article className="product-card"><Link href={`/catalogue/${product.slug}`} className="product-image-wrap" aria-label={`View ${product.name}`}>
    {image ? <Image src={image} alt={product.name} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw" className="product-image" /> : <div className="image-placeholder"><span>PF</span><small>Product image to be added</small></div>}
    <span className="image-arrow"><ArrowUpRight size={18} /></span>
  </Link><div className="product-meta"><div><span className="product-category">{product.category?.name || 'Furniture'}</span><h3><Link href={`/catalogue/${product.slug}`}>{product.name}</Link></h3></div><p className="product-price">{product.price_on_request || product.price == null ? 'Price on request' : formatINR(product.sale_price ?? product.price)}</p></div><Link href={`/catalogue/${product.slug}`} className="text-link">Explore details <span>↗</span></Link></article>;
}
