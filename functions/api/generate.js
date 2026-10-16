const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
export async function onRequest({request,env}){
 if(!['GET','POST'].includes(request.method))return reply({error:'Method not allowed'},405);
 if(!env.STUDIO_ACCESS_KEY||!env.REPLICATE_API_TOKEN||!env.REPLICATE_MODEL)return reply({error:'AI generation is not configured. Set STUDIO_ACCESS_KEY, REPLICATE_API_TOKEN, and REPLICATE_MODEL in Cloudflare.'},503);
 if(request.headers.get('authorization')!=='Bearer '+env.STUDIO_ACCESS_KEY)return reply({error:'Invalid studio access key.'},401);
 const headers={'Authorization':'Bearer '+env.REPLICATE_API_TOKEN,'Content-Type':'application/json'};
 try{
  let url='https://api.replicate.com/v1/predictions',options={headers};
  if(request.method==='GET'){
   const id=new URL(request.url).searchParams.get('id');if(!id||!/^[a-zA-Z0-9_-]{1,100}$/.test(id))return reply({error:'Invalid generation ID'},400);url+='/'+id;
  }else{
   const declared=Number(request.headers.get('content-length'));if(declared>6000000)return reply({error:'Request too large'},413);
   const text=await request.text();if(text.length>6000000)return reply({error:'Request too large'},413);
   let body;try{body=JSON.parse(text)}catch{return reply({error:'Invalid JSON'},400)}
   if(typeof body.prompt!=='string'||!body.prompt.trim()||body.prompt.length>2500)return reply({error:'Enter a prompt under 2500 characters'},400);
   if(!/^[\w-]+\/[\w.-]+$/.test(env.REPLICATE_MODEL))return reply({error:'Configure REPLICATE_MODEL as owner/model'},503);
   const input={prompt:body.prompt};
   if(body.image){if(typeof body.image!=='string'||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(body.image))return reply({error:'Invalid reference image'},400);const imageKey=env.REPLICATE_IMAGE_INPUT||'first_frame_image';if(!/^[a-zA-Z][\w]{0,60}$/.test(imageKey)||['prompt','__proto__','constructor','prototype'].includes(imageKey))return reply({error:'Invalid image input configuration'},503);input[imageKey]=body.image}
   url='https://api.replicate.com/v1/models/'+env.REPLICATE_MODEL+'/predictions';options={headers,method:'POST',body:JSON.stringify({input})};
  }
  const r=await fetch(url,{...options,signal:AbortSignal.timeout(30000)});if(!r.ok)return reply({error:r.status===401?'Provider authentication failed. Check the server token.':r.status===402?'Provider billing is required.':r.status===429?'Provider rate limit reached. Try again later.':'Provider rejected the request. Check model availability and input schema.'},502);
  const j=await r.json();return reply({id:j.id,status:j.status,output:j.output??null,error:j.error?'Provider generation failed. Check the provider dashboard.':null});
 }catch{return reply({error:'Generation provider could not be reached. Try again later.'},502)}
}
