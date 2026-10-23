const fs=require('fs'),path=require('path');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..','nepal-spice');
let html=fs.readFileSync(path.join(root,'login.html'),'utf8');
html=html.replace(/<link rel="stylesheet"[^>]*>/,"")
 .replace(/<script src="login\.js"><\/script>/,()=>"<script>"+fs.readFileSync(path.join(root,'login.js'),'utf8')+"</scr"+"ipt>");
const {webcrypto}=require('crypto');
const dom=new JSDOM(html,{url:'http://localhost/login.html',runScripts:'dangerously',pretendToBeVisual:true,
 beforeParse(w){ try{Object.defineProperty(w,'crypto',{value:webcrypto,configurable:true});}catch(e){} }});
const w=dom.window,d=w.document;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let pass=0,fail=0; const check=(n,c)=>{c?(pass++,console.log('  ok  '+n)):(fail++,console.log('  FAIL '+n));};
(async()=>{
 await sleep(100);
 // register
 d.getElementById('toggleMode').click();
 check('register mode title', d.getElementById('formTitle').textContent==='Create Account');
 d.getElementById('name').value='Tester';
 d.getElementById('password').value='demo-pass-123';
 d.getElementById('password').dispatchEvent(new w.Event('input',{bubbles:true}));
 check('meter visible in register', d.getElementById('meterWrap').hidden===false);
 d.getElementById('confirmPassword').value='demo-pass-123';
 d.getElementById('accountForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
 await sleep(60);
 const acc=JSON.parse(w.localStorage.getItem('nepalSpiceAccountsV1')||'{}');
 check('account stored with salt+hash', acc.tester && acc.tester.salt && acc.tester.hash && acc.tester.hash.length===64);
 check('no plaintext password stored', JSON.stringify(acc).indexOf('demo-pass-123')===-1);
 check('success message', d.getElementById('loginMessage').textContent.length>3);
 // wrong password
 d.getElementById('password').value='wrong-wrong-1';
 d.getElementById('accountForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
 await sleep(60);
 check('wrong password rejected', d.getElementById('loginError').textContent.includes('Incorrect'));
 // correct login
 d.getElementById('password').value='demo-pass-123';
 d.getElementById('accountForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
 await sleep(60);
 check('session set', w.sessionStorage.getItem('demoLoggedIn')==='yes' && w.sessionStorage.getItem('customerName')==='Tester');
 // eye toggle
 d.getElementById('eyeBtn').click();
 check('eye toggles type', d.getElementById('password').type==='text');
 console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail?1:0);
})().catch(e=>{console.error('CRASH',e);process.exit(1);});
