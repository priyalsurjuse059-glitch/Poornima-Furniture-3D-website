'use client';
import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import type { Product } from '@/lib/types';
export function CartAddButton({ product, quantity = 1 }: { product: Product; quantity?: number }) {
 const {add}=useCart();const [added,setAdded]=useState(false);
 return <button className="button button-dark" onClick={()=>{const enquiryOnly=product.price_on_request||product.price===null;add({productId:product.id,slug:product.slug,name:product.name,image:product.thumbnail_url||product.images?.[0]||null,quantity,unitPrice:enquiryOnly?null:(product.sale_price??product.price),priceOnRequest:enquiryOnly});setAdded(true);setTimeout(()=>setAdded(false),1800)}}>{added?<Check size={16}/>:<ShoppingBag size={16}/>} {added?'Added to cart':(product.price_on_request||product.price===null?'Add to enquiry list':'Add to cart')}</button>;
}
