const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'.artifacts');fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const http=require('http');
 const server=http.createServer((req,res)=>{const file=path.join(ROOT,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'})[ext]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
 await new Promise(resolve=>server.listen(8765,'127.0.0.1',resolve));
 const browser=await chromium.launch({...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}),headless:true,args:['--no-sandbox']});
 const results={scope:'Local Chromium against complete new pages. Old PDF retained on GitHub but unlinked; printable HTML resume tested. No live-site or cross-browser certification.',layouts:[],checks:[]};
 const errors=[];
 for(const width of [320,390,768,1024,1440]){
  const ctx=await browser.newContext({viewport:{width,height:900}});const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  for(const file of ['index.html','vulnscan.html','page-pulse.html','resume.html']){
   await page.goto('http://127.0.0.1:8765/'+file);
   for (const image of await page.locator('img').all()) { await image.scrollIntoViewIfNeeded(); await image.evaluate(el => el.decode()); }
   await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
   const audit=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('h1').length,brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).length,hiddenContent:[...document.querySelectorAll('main section')].some(x=>getComputedStyle(x).opacity==='0'),canonical:document.querySelector('link[rel="canonical"]').href}));
   results.layouts.push({file,width,...audit});
   if(audit.overflow||audit.h1!==1||audit.brokenImages||audit.hiddenContent)throw Error('Layout check failed '+JSON.stringify({file,width,...audit}));
   if(file==='index.html'&&width===1440)await page.screenshot({path:path.join(OUT,'desktop.png')});
   if(file==='index.html'&&width===390)await page.screenshot({path:path.join(OUT,'mobile.png')});
  }
  await ctx.close();
 }
 results.checks.push('Three topology route links and no topology overflow at five widths');
 const ctx=await browser.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8765/');
 await p.locator('.mobile-nav summary').focus();await p.keyboard.press('Enter');if(!await p.locator('.mobile-nav').evaluate(e=>e.open))throw Error('Menu failed to open');await p.keyboard.press('Escape');if(await p.locator('.mobile-nav').evaluate(e=>e.open))throw Error('Escape failed');if(!await p.locator('.mobile-nav summary').evaluate(e=>e===document.activeElement))throw Error('Focus not restored');results.checks.push('Keyboard Enter/Escape and focus return pass');
 await p.locator('.mobile-nav summary').click();await p.locator('.mobile-nav a[href="#work"]').click();if(await p.locator('.mobile-nav').evaluate(e=>e.open))throw Error('Link does not close menu');results.checks.push('Selecting mobile navigation link closes disclosure');
 await p.locator('#work').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(OUT,'work-mobile.png')});await ctx.close();
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const n=await nojs.newPage();await n.goto('http://127.0.0.1:8765/');await n.locator('.mobile-nav summary').click();if(!await n.locator('.mobile-nav a[href="#work"]').isVisible())throw Error('No JS menu hidden');if(!await n.locator('#work').isVisible())throw Error('No JS content hidden');if(!await n.locator('.topology-fallback').isVisible())throw Error('No JS topology fallback hidden');results.checks.push('JavaScript-disabled native navigation, content, and topology SVG pass');await nojs.close();
 const keyboard=await browser.newContext({viewport:{width:1024,height:900}});const k=await keyboard.newPage();k.on('pageerror',e=>errors.push(e.message));await k.goto('http://127.0.0.1:8765/');const route=k.locator('.topology-index [data-route="page-pulse"]');await route.focus();if(!(await k.locator('#topology-caption').textContent()).includes('URL → fetch'))throw Error('Keyboard topology caption failed');await route.hover();await k.mouse.move(0,0);if(!(await k.locator('#topology-caption').textContent()).includes('URL → fetch'))throw Error('Mouseleave cleared focused route');results.checks.push('Keyboard focus updates caption and survives mouseleave');await keyboard.close();
 const importFailure=await browser.newContext({viewport:{width:1024,height:900}});const i=await importFailure.newPage();await i.route('https://cdn.jsdelivr.net/**',route=>route.abort());await i.goto('http://127.0.0.1:8765/');await i.waitForTimeout(100);if(!await i.locator('.topology-fallback').isVisible()||await i.locator('.evidence-topology').evaluate(e=>e.classList.contains('is-webgl')))throw Error('Import failure did not retain SVG');results.checks.push('Three.js import failure retains SVG fallback');await importFailure.close();
 const webglFailure=await browser.newContext({viewport:{width:1024,height:900}});await webglFailure.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /^webgl2?$/.test(type)?null:original.call(this,type,...args)}});const w=await webglFailure.newPage();await w.goto('http://127.0.0.1:8765/');if(!await w.locator('.topology-fallback').isVisible()||await w.locator('.evidence-topology').evaluate(e=>e.classList.contains('is-webgl')))throw Error('WebGL failure did not retain SVG');results.checks.push('WebGL capability failure retains SVG fallback');await webglFailure.close();
 const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:900}});const r=await reduced.newPage();await r.goto('http://127.0.0.1:8765/');const motion=await r.evaluate(()=>({scroll:getComputedStyle(document.documentElement).scrollBehavior,animations:document.getAnimations().length}));if(motion.scroll!=='auto'||motion.animations)throw Error('Reduced motion failed');results.checks.push('Reduced motion: no active animations and automatic scroll');await reduced.close();
 results.consoleErrors=errors;if(errors.length)throw Error(errors.join('\n'));results.checks.push('No uncaught JavaScript errors across all pages');
 fs.writeFileSync(path.join(OUT,'qa-results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
