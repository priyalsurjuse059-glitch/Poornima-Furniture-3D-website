'use client';
import { useEffect } from 'react';
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){useEffect(()=>{console.error('Storefront route error',error)},[error]);return <section className="admin-gate section-shell"><div><span className="eyebrow">SOMETHING WENT WRONG</span><h1 style={{color:'var(--charcoal)',fontSize:44}}>Let's try that again.</h1><p>The page could not be loaded right now. Your cart is stored separately in this browser.</p><button className="button button-dark" onClick={reset}>Retry page</button></div></section>}
