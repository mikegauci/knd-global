// One-time migration utility. The built site never contacts WordPress.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';
import sharp from 'sharp';
import crypto from 'node:crypto';
const input='migration/source';
const pages=JSON.parse(fs.readFileSync(`${input}/pages.json`));
const assets=new Map();
function curl(url){return execFileSync('curl',['-fLs','--retry','2','--max-time','60',url],{maxBuffer:40*1024*1024});}
async function asset(raw){
 let url=raw.replaceAll('&amp;','&').replace('https://executive.kenmorefx.com/','https://www.knd-global.eu/');
 if(assets.has(url))return assets.get(url);
 const ext=path.extname(new URL(url).pathname).toLowerCase();
 const name=path.basename(new URL(url).pathname,ext).replace(/[^a-z0-9-]/gi,'-')+'-'+crypto.createHash('sha256').update(url).digest('hex').slice(0,8);
 let buf=curl(url);let dest=`/assets/${name}${ext}`;
 if(['.jpg','.jpeg','.png'].includes(ext)){
  const meta=await sharp(buf).metadata();const width=Math.min(meta.width,1920);
  dest=`/assets/${name}.webp`;await sharp(buf).resize({width,withoutEnlargement:true}).webp({quality:82}).toFile(`public${dest}`);
  const variants=[];
  for(const w of [...new Set([320,640,960,1280,width].filter(w=>w<=width))]){
   const d=`/assets/${name}-${w}.webp`;await sharp(buf).resize({width:w,withoutEnlargement:true}).webp({quality:80}).toFile(`public${d}`);variants.push(`${d} ${w}w`);
  }
  assets.set(url,{src:dest,srcset:variants.join(', '),width:meta.width,height:meta.height});
 }else{fs.writeFileSync(`public${dest}`,buf);assets.set(url,{src:dest});}
 return assets.get(url);
}
async function localCSS(css){
 const urls=[...css.matchAll(/url\(\s*["']?(https?:[^)'"\s]+)["']?\s*\)/g)].map(m=>m[1]);
 for(const url of new Set(urls)){try{const a=await asset(url);css=css.replaceAll(url,a.src)}catch(e){console.error('Asset failed',url);throw e}}
 return css.replace(/\/\*[\s\S]*?\*\//g,'');
}
async function clean(html){
 const $=load(html,null,false);
 $('script,style').remove();
 $('[data-cfemail]').each((_,el)=>{$(el).replaceWith('<a href="mailto:info@knd-global.com">info@knd-global.com</a>')});
 $('[itemscope],[itemtype],[itemid]').removeAttr('itemscope').removeAttr('itemtype').removeAttr('itemid');
 $('a').each((_,el)=>{const a=$(el),href=a.attr('href')||'';if(/^https?:\/\/(www\.)?knd-global\.eu/.test(href))a.attr('href',new URL(href).pathname.replace('/en/about-us-2/','/en/about-us/'));});
 for(const el of $('img').toArray()){
  const im=$(el),src=im.attr('src');if(!src||src.startsWith('data:'))continue;
  const a=await asset(src);im.attr({src:a.src,srcset:a.srcset||'',sizes:im.attr('sizes')?.replace('auto, ','')||'(max-width: 767px) 100vw, 50vw',width:a.width,height:a.height,decoding:'async',loading:'lazy'});
  if(im.hasClass('custom-logo')||im.closest('figure').find('img').attr('src')?.includes('logo'))im.attr('alt','KND Global');
 }
 $('svg').attr({'aria-hidden':'true',focusable:'false'});
 $('iframe').attr({title:'KND Global location in Luqa, Malta',loading:'lazy'});
 for(const v of $('video').toArray()){
  const video=$(v);const a=await asset(video.find('source').attr('src'));video.attr({autoplay:'',loop:'',muted:'',playsinline:'',preload:'metadata',poster:'/assets/hero-poster-mobile.webp','aria-hidden':'true'});video.find('source').attr('src',a.src);
 }
 return $.html();
}
const home=load(fs.readFileSync(`${input}/2.html`,'utf8'));
let base='';
for(const link of home('link[rel=stylesheet]').toArray()){
 const url=home(link).attr('href');if(url.includes('uag-css-'))continue;
 if(url.includes('fonts.googleapis'))continue;
 base+='\n'+await localCSS(curl(url).toString());
}
// Keep the original theme's visual rules as ordinary, local CSS (no theme runtime).
for(const st of home('style').toArray()){
 const id=home(st).attr('id')||'';if(/emoji|core-block-supports/.test(id))continue;base+='\n'+home(st).html();
}
base=await localCSS(base);fs.writeFileSync('public/styles/design.css',base);
const result=[];
for(const p of pages){
 const $=load(fs.readFileSync(`${input}/${p.id}.html`,'utf8'));
 const sheet=$('link[rel=stylesheet]').toArray().map(e=>$(e).attr('href')).find(x=>x.includes('uag-css-'));
 let css=await localCSS(curl(sheet).toString());
 css+='\n'+($('#core-block-supports-inline-css').html()||'');
 fs.writeFileSync(`public/styles/page-${p.id}.css`,css);
 const route=new URL(p.link).pathname;
 result.push({id:p.id,path:route,lang:route.startsWith('/en/')?'en':'it',title:p.title.rendered,html:await clean(p.content.rendered)});
}
let footer=await clean(home('footer').prop('outerHTML'));
const f=load(footer,null,false);f('.pll-parent-menu-item').remove();
fs.writeFileSync('src/content/footer.html',f.html());
fs.writeFileSync('src/content/pages.json',JSON.stringify(result,null,2));
fs.writeFileSync('migration/assets.json',JSON.stringify(Object.fromEntries(assets),null,2));
console.log(`Imported ${result.length} pages and ${assets.size} local assets.`);
