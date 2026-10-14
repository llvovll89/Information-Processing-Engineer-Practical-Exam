(async()=>{
 const results=[],failures=[],assert=(ok,msg)=>{if(!ok)throw Error(msg);};
 const pages=['index','plan','cheatsheet','basics','c','java','python','sql','database','design','testing','network','os','security','integration','practice','mock','sources','rounds'];
 const storageKey='engineer-practical-2026-v1',original=localStorage.getItem(storageKey);
 localStorage.setItem(storageKey,JSON.stringify({version:1,done:{},answers:{},ratings:{}}));
 const frame=document.createElement('iframe');frame.style.cssText='position:fixed;left:0;top:0;height:900px;border:0;z-index:200;background:white';document.body.append(frame);
 try{
 for(const width of [320,390,768,1440]){
  frame.style.width=width+'px';
  for(const page of pages){
   window.QA_PROGRESS={width,page,completed:results.length};
   await new Promise((resolve,reject)=>{frame.onload=resolve;frame.onerror=reject;frame.src=page+'.html';});
   const w=frame.contentWindow,d=frame.contentDocument;await d.fonts.ready;
   assert(d.documentElement.scrollWidth<=width,`${page} ${width}: overflow ${d.documentElement.scrollWidth}`);
   assert(d.querySelector('link[href="sprint.css"]'),page+': stylesheet missing');
   const odd=d.body.innerText.match(/[\u2013\u2014]/g);if(odd)failures.push(page+': em dash');
   if(width===390&&page==='plan'){
    const full=d.querySelector('[data-budget=full]');full.click();assert([...d.querySelectorAll('.extended-task')].every(x=>!x.hidden),'full mode');
    d.querySelector('[data-budget=short]').click();assert([...d.querySelectorAll('.extended-task')].every(x=>x.hidden),'short mode');
    const done=d.querySelector('[data-done]');done.checked=true;done.dispatchEvent(new w.Event('change',{bubbles:true}));
    assert(JSON.parse(w.localStorage.getItem('engineer-practical-2026-v1')).done['sprint-day-0'],'plan persistence');
   }
   if(width===390&&page==='cheatsheet'){
    d.querySelector('[data-recall-mode=test]').click();assert([...d.querySelectorAll('.summary-rules')].every(x=>x.hidden),'answers hidden');
    assert([...d.querySelectorAll('.summary-all')].every(x=>x.hidden),'full answers hidden');
    const answer=d.querySelector('.summary-recall details');answer.open=true;assert(answer.querySelector('p').textContent.length>0,'reveal answer');
    d.querySelector('[data-recall-mode=read]').click();assert([...d.querySelectorAll('.summary-rules')].every(x=>!x.hidden),'reading restored');
    w.document.documentElement.dataset.readingSize='larger';assert(d.documentElement.scrollWidth<=width,'large text overflow');
   }
   if(width===768&&page==='index'){
    assert(d.querySelector('#dashboard-progress').textContent.includes('1/11'),'plan counted separately: '+d.querySelector('#dashboard-progress').textContent+' / '+w.localStorage.getItem('engineer-practical-2026-v1'));
    const backup={version:1,done:{'sprint-day-9':true,'c-s0':true,'plan-0':true},answers:{'c-q0':'backup answer'},ratings:{'c-q0':'wrong'}};
    const file=new w.File([JSON.stringify(backup)],'qa-backup.json',{type:'application/json'}),dt=new w.DataTransfer();dt.items.add(file);
    const input=d.querySelector('#import-progress');input.files=dt.files;input.dispatchEvent(new w.Event('change',{bubbles:true}));
    await new Promise(resolve=>setTimeout(resolve,100));
    const saved=JSON.parse(w.localStorage.getItem('engineer-practical-2026-v1'));
    assert(saved.done['sprint-day-9']&&saved.done['plan-0']&&saved.answers['c-q0']==='backup answer','backup import preserves old and new IDs');
    assert(d.querySelector('#dashboard-progress').textContent.includes('2/11'),'backup plan count');
   }
   results.push(`${page}:${width}`);
  }
 }
 return {layouts:results.length,failures,checks:['76 layouts','all styles loaded','plan modes and persistence','recall hide/reveal','large text'],results};
 }finally{frame.remove();if(original===null)localStorage.removeItem(storageKey);else localStorage.setItem(storageKey,original);}
})()
