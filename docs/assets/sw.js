if(!self.define){let e,t={};const n=(n,i)=>(n=new URL(n+".js",i).href,t[n]||new Promise((t=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=t,document.head.appendChild(e)}else e=n,importScripts(n),t()})).then((()=>{let e=t[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,r)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(t[s])return;let o={};const l=e=>n(e,s),c={module:{uri:s},exports:o,require:l};t[s]=Promise.all(i.map((e=>c[e]||l(e)))).then((e=>(r(...e),o)))}}define(["./workbox-f51ab5e4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"entry.3a6fe73c.css",revision:null},{url:"manifest.webmanifest",revision:"a8a3220998667d7a235c0ea117820117"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
