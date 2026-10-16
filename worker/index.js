import {onRequest as ai} from '../functions/api/ai.js';
import {onRequest as generate} from '../functions/api/generate.js';
export default {
 async fetch(request,env,ctx){
  const path=new URL(request.url).pathname;
  if(path==='/api/ai')return ai({request,env,waitUntil:ctx.waitUntil.bind(ctx)});
  if(path==='/api/generate')return generate({request,env,waitUntil:ctx.waitUntil.bind(ctx)});
  if(path.startsWith('/api/'))return Response.json({error:'API route not found'},{status:404});
  return env.ASSETS.fetch(request);
 }
};
