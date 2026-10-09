import { describe, expect, it } from 'vitest';
import { enquirySchema, productInputSchema } from '../lib/validation';

describe('request validation',()=>{
 it('accepts a normal customer enquiry',()=>expect(enquirySchema.safeParse({name:'Asha Patil',phone:'+91 98765 43210',email:'asha@example.com',message:'Please share TV unit pricing.'}).success).toBe(true));
 it('rejects an invalid phone number',()=>expect(enquirySchema.safeParse({name:'Asha Patil',phone:'abc',message:'Please share TV unit pricing.'}).success).toBe(false));
 it('rejects an empty product slug',()=>expect(productInputSchema.safeParse({name:'New sofa',slug:'not a slug',price_on_request:true}).success).toBe(false));
 it('accepts a price-on-request product',()=>expect(productInputSchema.safeParse({name:'New sofa',slug:'new-sofa',price_on_request:true}).success).toBe(true));
});
