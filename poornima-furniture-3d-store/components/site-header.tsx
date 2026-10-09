'use client';
import Link from 'next/link';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const links = [{ href: '/catalogue', label: 'Collection' }, { href: '/showroom', label: '3D Showroom' }, { href: '/#story', label: 'Our Story' }, { href: '/#visit', label: 'Visit Us' }];
  return <header className="site-header"><Link className="brand" href="/" aria-label="Poornima Furniture home"><span className="brand-mark">P</span><span><strong>POORNIMA</strong><small>FURNITURE · NAGPUR</small></span></Link>
    <nav className={`desktop-nav ${open ? 'nav-open' : ''}`} aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav>
    <div className="header-actions"><Link href="/cart" className="icon-link" aria-label="Shopping cart"><ShoppingBag size={19} /><span>Cart</span></Link><button className="menu-toggle" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button></div>
  </header>;
}
