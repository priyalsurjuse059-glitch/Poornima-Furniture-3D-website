import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase-server';

const allowedTypes = new Set(['image/jpeg','image/png','image/webp','image/avif','model/gltf-binary','model/gltf+json']);
export async function POST(request:Request) {
  const {supabase,isAdmin}=await requireAdmin();
  if(!isAdmin)return NextResponse.json({error:'Administrator access required.'},{status:403});
  const form=await request.formData().catch(()=>null);
  if(!form)return NextResponse.json({error:'Invalid upload data.'},{status:400});
  const file=form.get('file');
  if(!(file instanceof File))return NextResponse.json({error:'Choose a file to upload.'},{status:422});
  if(!allowedTypes.has(file.type))return NextResponse.json({error:'Unsupported file type.'},{status:415});
  const isModel=file.type==='model/gltf-binary'||file.type==='model/gltf+json';
  const limit=isModel?25*1024*1024:12*1024*1024;
  if(file.size>limit)return NextResponse.json({error:`File is too large. Maximum size is ${Math.round(limit/1024/1024)} MB.`},{status:413});
  const cleanName=file.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g,'-').slice(-100)||'upload';
  const path=`${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}-${cleanName}`;
  const {data,error}=await supabase.storage.from('product-media').upload(path,file,{contentType:file.type,upsert:false});
  if(error)return NextResponse.json({error:'Upload failed. Check storage policy and bucket settings.'},{status:400});
  const {data:{publicUrl}}=supabase.storage.from('product-media').getPublicUrl(data.path);
  return NextResponse.json({path:data.path,url:publicUrl,contentType:file.type,size:file.size},{status:201});
}
