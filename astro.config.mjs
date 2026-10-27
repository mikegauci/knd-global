import {defineConfig} from 'astro/config';
export default defineConfig({site:'https://www.knd-global.eu',output:'static',trailingSlash:'always',build:{format:'directory'},compressHTML:true,devToolbar:{enabled:false}});
