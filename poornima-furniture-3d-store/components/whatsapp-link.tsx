'use client';
import { MessageCircle } from 'lucide-react';

export function WhatsAppLink({ message = 'Hello, I would like to know more about furniture at Poornima Furniture.' , label = 'Enquire on WhatsApp' }: { message?: string; label?: string }) {
  const phone = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP?.replace(/\D/g, '');
  const href = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : null;
  if (!href) return <a className="button button-outline" href="mailto:?subject=Furniture%20enquiry&body=${encodeURIComponent(message)}"><MessageCircle size={17} /> {label} by email</a>;
  return <a className="button button-dark" href={href} target="_blank" rel="noreferrer"><MessageCircle size={17} /> {label}</a>;
}
