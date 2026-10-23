const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
test('homepage inline scripts parse, including deferred tracker bootstraps',()=>{
 for(const [,attrs,code] of scripts)if(!/application\/ld\+json|src\s*=/.test(attrs))new vm.Script(code);
});
test('analytics network work waits for load and a painted frame while preserving its destination',()=>{
 const callbacks=[],frames=[],loaded=[];
 const document={head:{appendChild:node=>loaded.push(node.src)},createElement:()=>({})};
 const window={addEventListener:(name,callback,options)=>{assert.equal(name,'load');assert.equal(options.once,true);callbacks.push(callback)}};
 const context=vm.createContext({window,document,requestAnimationFrame:cb=>frames.push(cb)});
 const bootstrap=scripts.find(s=>s[2].includes('function afterFirstPaint'))[2];
 vm.runInContext(bootstrap,context);assert.equal(loaded.length,0);
 callbacks.forEach(cb=>cb());assert.equal(loaded.length,0);
 frames.shift()();assert.equal(loaded.length,0);
 frames.shift()();assert.deepEqual(loaded,['https://www.googletagmanager.com/gtag/js?id=G-ZWF15D45V8']);
});
