import { describe, expect, it } from 'vitest';
import { calculateCartTotal, cartHasEnquiryOnlyItems, formatINR } from '../lib/cart';
import type { CartLine } from '../lib/types';
const line=(overrides:Partial<CartLine>={}):CartLine=>({productId:'1',slug:'oak-bed',name:'Oak Bed',image:null,quantity:2,unitPrice:10000,priceOnRequest:false,...overrides});
describe('cart calculations',()=>{
 it('calculates subtotal from priced quantities',()=>expect(calculateCartTotal([line(),line({productId:'2',quantity:1,unitPrice:500})])).toBe(20500));
 it('does not count enquiry-only items as priced',()=>expect(calculateCartTotal([line(),line({productId:'2',priceOnRequest:true,unitPrice:null,quantity:3})])).toBe(20000));
 it('reports enquiry-only lines',()=>expect(cartHasEnquiryOnlyItems([line(),line({productId:'2',priceOnRequest:true,unitPrice:null})])).toBe(true));
 it('does not report enquiry when all prices are known',()=>expect(cartHasEnquiryOnlyItems([line()])).toBe(false));
 it('formats Indian Rupees',()=>expect(formatINR(15000)).toContain('15,000'));
});
