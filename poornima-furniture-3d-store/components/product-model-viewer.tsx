'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Box } from 'lucide-react';

const CanvasViewer = dynamic(() => import('@/components/product-model-scene').then(m => m.ProductModelScene), { ssr: false, loading: () => <div className="showroom-panel" style={{minHeight:320}}><div><div className="showroom-fallback-icon"><Box size={26}/></div><h2>Preparing the model…</h2><p>The interactive viewer will load when the 3D assets are ready.</p></div></div> });
export function ProductModelViewer({ modelUrl, productName }: { modelUrl: string; productName: string }) {
 const [scale, setScale] = useState(1); const [resetKey, setResetKey] = useState(0);
 return <div><div style={{height:390,background:'#eee7de',position:'relative',border:'1px solid var(--line)'}}><CanvasViewer modelUrl={modelUrl} productName={productName} scale={scale} resetKey={resetKey}/></div><div style={{display:'flex',gap:8,alignItems:'center',marginTop:10}}><button className="button button-outline" onClick={()=>setScale(s=>Math.max(.65,s-.15))} aria-label="Zoom out model"><ZoomOut size={15}/> Zoom out</button><button className="button button-outline" onClick={()=>setScale(s=>Math.min(1.7,s+.15))} aria-label="Zoom in model"><ZoomIn size={15}/> Zoom in</button><button className="button button-outline" onClick={()=>{setScale(1);setResetKey(k=>k+1)}}><RotateCcw size={15}/> Reset view</button></div></div>;
}
