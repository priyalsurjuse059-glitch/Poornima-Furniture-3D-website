import { z } from 'zod';

export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[+\d\s()-]{8,20}$/),
  email: z.union([z.string().trim().email().max(254), z.literal('')]).optional(),
  message: z.string().trim().min(5).max(3000),
  productId: z.string().uuid().optional().or(z.literal('')),
  website: z.string().max(0).optional(), // honeypot field
});

export const productInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(10000).nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  price: z.number().nonnegative().nullable().optional(),
  sale_price: z.number().nonnegative().nullable().optional(),
  price_on_request: z.boolean().default(true),
  images: z.array(z.string().url()).max(20).default([]),
  thumbnail_url: z.string().url().nullable().optional(),
  materials: z.array(z.string().trim().max(80)).max(30).default([]),
  finishes: z.array(z.string().trim().max(80)).max(30).default([]),
  dimensions: z.record(z.string(), z.string().max(120)).nullable().optional(),
  availability: z.enum(['available', 'made_to_order', 'unavailable']).default('available'),
  customization: z.string().max(3000).nullable().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  model_url: z.string().url().nullable().optional(),
  seo_title: z.string().max(70).nullable().optional(),
  seo_description: z.string().max(170).nullable().optional(),
});
