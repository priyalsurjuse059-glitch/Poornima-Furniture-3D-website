'use client';
import { Canvas } from '@react-three/fiber';
import { Bounds, Center, Environment, OrbitControls, useGLTF, Html } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import * as THREE from 'three';

function Model({ url, scale }: { url: string; scale: number }) {
 const gltf = useGLTF(url);
 useEffect(() => () => { gltf.scene.traverse((object) => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); const material = object.material; if (Array.isArray(material)) material.forEach(m => m.dispose()); else material.dispose(); } }); }, [gltf]);
 return <Center><primitive object={gltf.scene} scale={scale}/></Center>;
}
function ModelErrorFallback(){return <Html center><div style={{maxWidth:230,textAlign:'center',fontSize:12,color:'#5a5148',lineHeight:1.7,background:'#f7f3ed',padding:18}}>The 3D model could not be loaded. Please use the product images or enquire with the showroom.</div></Html>}
export function ProductModelScene({ modelUrl, productName, scale, resetKey }: { modelUrl: string; productName: string; scale: number; resetKey: number }) {
 return <Canvas camera={{position:[3,2.1,4],fov:40}} dpr={[1,1.75]} gl={{antialias:true,alpha:true}} shadows aria-label={`Interactive 3D model of ${productName}`}><color attach="background" args={['#eee7de']}/><ambientLight intensity={1.2}/><directionalLight position={[4,6,4]} intensity={2} castShadow/><Suspense fallback={<Html center><span style={{fontSize:12}}>Loading 3D model…</span></Html>}><Bounds fit clip observe margin={1.3}><Model url={modelUrl} scale={scale}/></Bounds><Environment preset="apartment"/></Suspense><gridHelper args={[8,16,'#d0c5b8','#e0d7cc']} position={[0,-.8,0]}/><OrbitControls key={resetKey} makeDefault enableDamping dampingFactor={.08} minDistance={1.2} maxDistance={8} enablePan={false}/></Canvas>;
}
