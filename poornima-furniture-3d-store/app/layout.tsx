import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CartProvider } from '@/components/cart-provider';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Poornima Furniture | Thoughtful Furniture for Your Home', template: '%s | Poornima Furniture' },
  description: 'Explore sofas, beds, TV units and thoughtfully selected furniture at Poornima Furniture, Sutgirni, Hingna Road, Nagpur.',
  openGraph: { type: 'website', title: 'Poornima Furniture', description: 'Furniture that makes your space feel like home.' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><CartProvider><SiteHeader /><main>{children}</main><SiteFooter /></CartProvider></body></html>;
}
