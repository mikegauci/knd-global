import fs from 'node:fs';
import os from 'node:os';
export const teamId='team_Oacq94DcLo9uLc6c3p1afop5';
export function env(){return Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(x=>x.includes('=')&&!x.startsWith('#')).map(x=>{const i=x.indexOf('=');return[x.slice(0,i).trim(),x.slice(i+1).trim().replace(/^(['"])(.*)\1$/,'$2')]}));}
export async function vercel(endpoint,options={}){
 const {token}=JSON.parse(fs.readFileSync(`${os.homedir()}/Library/Application Support/com.vercel.cli/auth.json`,'utf8'));
 const r=await fetch(`https://api.vercel.com${endpoint}${endpoint.includes('?')?'&':'?'}teamId=${teamId}`,{...options,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json',...options.headers}});
 const x=await r.json();if(!r.ok)throw Error(JSON.stringify(x));return x;
}
export async function cloudflare(endpoint,options={}){
 const token=env().CLOUDFLARE_API_TOKEN;if(!token)throw Error('Add CLOUDFLARE_API_TOKEN to .env');
 const r=await fetch(`https://api.cloudflare.com/client/v4${endpoint}`,{...options,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'}});const x=await r.json();if(!x.success)throw Error(JSON.stringify(x.errors));return x.result;
}
