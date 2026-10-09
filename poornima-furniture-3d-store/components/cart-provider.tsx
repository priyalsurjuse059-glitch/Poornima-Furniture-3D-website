'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartLine } from '@/lib/types';
import { calculateCartTotal, cartHasEnquiryOnlyItems } from '@/lib/cart';

type CartContextValue = { lines: CartLine[]; hydrated: boolean; add: (line: CartLine) => void; remove: (id: string) => void; quantity: (id: string, q: number) => void; clear: () => void; total: number; hasEnquiry: boolean };
const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'poornima-cart-v1';
export function CartProvider({ children }: { children: ReactNode }) {
 const [lines,setLines] = useState<CartLine[]>([]); const [hydrated,setHydrated] = useState(false);
 useEffect(()=>{ try { const raw=localStorage.getItem(STORAGE_KEY); if(raw){ const parsed=JSON.parse(raw); if(Array.isArray(parsed)) setLines(parsed.filter((x)=>x && typeof x.productId==='string' && typeof x.name==='string' && Number.isInteger(x.quantity) && x.quantity>0).slice(0,100)); } } catch { localStorage.removeItem(STORAGE_KEY); } setHydrated(true); },[]);
 useEffect(()=>{ if(hydrated) localStorage.setItem(STORAGE_KEY,JSON.stringify(lines)); },[lines,hydrated]);
 const add=useCallback((line:CartLine)=>setLines(old=>{const found=old.find(x=>x.productId===line.productId); if(found)return old.map(x=>x.productId===line.productId?{...x,quantity:Math.min(99,x.quantity+line.quantity)}:x); return [...old,{...line,quantity:Math.max(1,Math.min(99,line.quantity))}];}),[]);
 const remove=useCallback((id:string)=>setLines(old=>old.filter(x=>x.productId!==id)),[]);
 const quantity=useCallback((id:string,q:number)=>setLines(old=>old.map(x=>x.productId===id?{...x,quantity:Math.max(1,Math.min(99,Math.floor(q)||1))}:x)),[]);
 const clear=useCallback(()=>setLines([]),[]);
 const value=useMemo(()=>({lines,hydrated,add,remove,quantity,clear,total:calculateCartTotal(lines),hasEnquiry:cartHasEnquiryOnlyItems(lines)}),[lines,hydrated,add,remove,quantity,clear]);
 return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart(){const c=useContext(CartContext);if(!c)throw new Error('useCart must be used inside CartProvider');return c;}
