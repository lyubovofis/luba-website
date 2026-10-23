const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('quiz-test/index.html', 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
const source = scripts.find(s => s[2].includes('const quizState ='))[2];
function fixture() {
  const nodes = new Map();
  const selected = [];
  function node(id) {
    if (!nodes.has(id)) nodes.set(id, {id, value:'', textContent:'', innerHTML:'', style:{}, disabled:true,
      classList:{values:new Set(),add(x){this.values.add(x)},remove(x){this.values.delete(x)}},
      addEventListener(){}});
    return nodes.get(id);
  }
  for (let i=1;i<=9;i++) {
    const section = node('step'+i);
    section.cards = [];
    section.querySelectorAll = () => section.cards;
    section.querySelector = selector => selector === 'h2' ? {textContent:'Вопрос '+i} : section.cards.find(c=>c.classList.values.has('selected'))?.label;
    for (const [value,block] of [['first','fear'],['second','guilt']]) {
      const card = node('card'+i+value);
      card.dataset = {value,block}; card.label={textContent:`Ответ ${i} ${value}`};
      card.closest = ()=>section; section.cards.push(card); selected.push(card);
    }
  }
  node('incomeSlider').value='2000'; node('desiredSlider').value='5000';
  const document = {addEventListener(){},getElementById:node,querySelectorAll(selector){
    if(selector==='.option-card') return selected;
    if(selector==='.option-card.selected') return selected.filter(c=>c.classList.values.has('selected'));
    if(selector==='.progress-step') return [];
    throw Error('Unexpected selector '+selector);
  }};
  const context=vm.createContext({document,window:{},console,Date,encodeURIComponent,confirm:()=>false});
  vm.runInContext(source,context);
  vm.runInContext('setupEventListeners()',context);
  return {node,context,run:code=>vm.runInContext(code,context)};
}
test('every inline executable script parses; no database submission or false sent claim',()=>{
  for(const [,attrs,code] of scripts) if(!/application\/ld\+json|src\s*=/.test(attrs)) new vm.Script(code);
  assert.doesNotMatch(html,/supabase|submitQuiz|saveResults|Результаты отправлены|fbq\('track', 'Lead'|CompleteRegistration/i);
  assert.doesNotMatch(html, /id="(?:whatsapp|email)"/);
});
test('optional name and all seven answers prepare identical encoded drafts without sending',()=>{
  const f=fixture();
  for(const i of [1,2,3,4,6,7]) { f.context.event={currentTarget:f.node('card'+i+'first')}; f.run('handleOptionSelect(event)'); }
  f.run('validateAndShowResult()');
  assert.equal(f.run('quizState.currentStep'),9);
  assert.equal(f.run('quizState.answers.name'),'');
  const text=f.node('quizMessage').value;
  assert.equal((text.match(/^\d\. /gm)||[]).length,7);
  assert.match(text,/€2000.*€5000/);
  assert.match(text,/15-минутную/);
  for(const [id,host,path] of [['quizWhatsApp','wa.me','/34654420334'],['quizTelegram','t.me','/LyubovUA']]) {
    const url=new URL(f.node(id).href); assert.equal(url.host,host);assert.equal(url.pathname,path);assert.equal(url.searchParams.get('text'),text);
  }
  f.node('name').value='  Анна & Мария + €  ';
  f.run('validateAndShowResult()');
  assert.match(new URL(f.node('quizWhatsApp').href).searchParams.get('text'),/Анна & Мария \+ €/);
});
test('returning to a question replaces its score instead of accumulating stale answers',()=>{
  const f=fixture();
  for(const card of ['card1first','card2first','card1second','card1second']) {
    f.context.event={currentTarget:f.node(card)};f.run('handleOptionSelect(event)');
  }
  assert.equal(f.run('quizState.blocks.fear'),1);
  assert.equal(f.run('quizState.blocks.guilt'),1);
  assert.equal(f.run('quizState.answers.q1'),'second');
  f.run('nextStep(1); prevStep(2)');
  assert.equal(f.node('btn1').disabled,false);
});
