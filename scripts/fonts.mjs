import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const css=execFileSync('curl',['-fLs','https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Ubuntu:wght@700&display=swap','-H','User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36']).toString();
let result='';let i=0;
for(const match of css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)){
 let rule=match[1],url=rule.match(/url\(([^)]+)\)/)[1];const name=rule.match(/font-family: '([^']+)'/)[1].toLowerCase()+'-'+rule.match(/font-weight: (\d+)/)[1]+'.woff2';
 fs.writeFileSync(`public/assets/${name}`,execFileSync('curl',['-fLs',url]));result+=rule.replace(url,`/assets/${name}`)+'\n';i++;
}
fs.writeFileSync('public/styles/fonts.css',result);console.log('Local WOFF2 faces',i);
