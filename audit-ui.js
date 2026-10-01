(() => {
 const assert=(value,message)=>{if(!value)throw Error(message);};
 const page=document.body.dataset.page;
 const checks=[];
 const test=(name,fn)=>{fn();checks.push(name);};
 test('no horizontal page overflow',()=>assert(document.documentElement.scrollWidth<=innerWidth,'horizontal overflow'));
 if(page==='c'){
  test('concept persistence',()=>{const el=document.querySelector('[data-done]');el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));assert(JSON.parse(localStorage.getItem('engineer-practical-2026-v1')).done['c-s0'],'not saved');});
  test('answer and wrong state',()=>{const el=document.querySelector('[data-answer]');el.value='9 9';el.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('details.solution').open=true;document.querySelector('[data-rate="wrong"]').click();const data=JSON.parse(localStorage.getItem('engineer-practical-2026-v1'));assert(data.answers['c-q0']==='9 9'&&data.ratings['c-q0']==='wrong','answer/rating missing');});
  test('search',()=>{document.querySelector('#search-toggle').click();const el=document.querySelector('#global-search');el.value='\uD3EC\uC778\uD130';el.dispatchEvent(new Event('input',{bubbles:true}));assert(document.querySelectorAll('#search-results a').length>0,'no search hits');document.querySelector('#search-toggle').click();});
 }
 if(page==='practice'){
  test('all questions loaded',()=>assert(document.querySelectorAll('.question').length===window.STUDY_QUESTIONS.length,'missing bank'));
  test('wrong filter',()=>{const s=document.querySelector('#filter-state');s.value='wrong';s.dispatchEvent(new Event('change',{bubbles:true}));assert(document.querySelectorAll('.question').length===1,'wrong filter count');assert(document.querySelector('.question').id==='c-q0','wrong item');});
  test('empty state',()=>{const s=document.querySelector('#filter-course');s.value='java';s.dispatchEvent(new Event('change',{bubbles:true}));assert(document.querySelector('.empty'),'missing empty state');});
 }
 if(page==='mock'){
  test('mock selection',()=>{document.querySelector('#start-mock').click();assert(document.querySelectorAll('.question').length===20,'not 20');assert(new Set([...document.querySelectorAll('.question')].map(x=>x.id)).size===20,'duplicates');assert(getComputedStyle(document.querySelector('.solution')).display==='none','answer not hidden');assert(document.querySelector('#timer').textContent==='150:00','timer');});
  test('submit and score',()=>{document.querySelector('#submit-mock').click();assert(!document.body.classList.contains('mock-active'),'still active');document.querySelector('details').open=true;document.querySelector('[data-rate="correct"]').click();assert(document.querySelector('#mock-results').textContent.includes('5\uC810'),'wrong score');});
 }
 return JSON.stringify({page,width:innerWidth,checks});
})();
