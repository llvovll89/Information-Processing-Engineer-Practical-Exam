(() => {
 'use strict';
 const KEY='engineer-practical-2026-v1';
 const empty=()=>({version:1,done:{},answers:{},ratings:{}});
 let state=empty(),saveAvailable=true;
 try {const parsed=JSON.parse(localStorage.getItem(KEY)||'null');if(parsed&&parsed.version===1)state={...empty(),...parsed};}catch{saveAvailable=false;}
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let toastTimer;
 const toast=msg=>{const t=$('.toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3500);};
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{if(saveAvailable)toast('브라우저 저장이 제한되어 있습니다. 홈에서 기록을 백업하세요.');saveAvailable=false;}};
 const doneCount=id=>Object.keys(state.done).filter(k=>k.startsWith(id+'-s')&&state.done[k]).length;
 function refresh(){
  $$('[data-done]').forEach(el=>el.checked=Boolean(state.done[el.dataset.done]));
  $$('[data-answer]').forEach(el=>{if(document.activeElement!==el)el.value=state.answers[el.dataset.answer]||'';});
  const ratingFor=id=>mockQuestions.some(q=>q.id===id)?mockRatings[id]:state.ratings[id];
  $$('[data-state]').forEach(el=>{const v=ratingFor(el.dataset.state)||'new';el.dataset.value=v;el.textContent={new:'미풀이',correct:'맞혔어요',wrong:'다시 풀래요'}[v];});
  $$('[data-rate]').forEach(el=>el.setAttribute('aria-pressed',String(ratingFor(el.dataset.id)===el.dataset.rate)));
  $$('[data-course-progress]').forEach(el=>{const c=window.STUDY_COURSES.find(c=>c.id===el.dataset.courseProgress);if(c)el.textContent=`개념 체크 ${doneCount(c.id)}/${c.sections}`;});
  $$('[data-course]').forEach(el=>{const n=doneCount(el.dataset.course);el.textContent=n?`${n}개` : '';});
  if($('#dashboard-progress')){const learned=Object.keys(state.done).filter(k=>!k.startsWith('plan-')&&state.done[k]).length;const completeDays=Object.keys(state.done).filter(k=>k.startsWith('plan-')&&state.done[k]).length;const vals=Object.values(state.ratings);$('#dashboard-progress').innerHTML=`<strong>개념 ${learned}개 체크</strong><p>계획 ${completeDays}/33일 · 맞힌 문제 ${vals.filter(x=>x==='correct').length}개 · 다시 풀 문제 ${vals.filter(x=>x==='wrong').length}개</p>`;}
  updateMockScore();
 }
 document.addEventListener('change',e=>{const el=e.target;if(el.matches('[data-done]')){state.done[el.dataset.done]=el.checked;save();refresh();}});
 document.addEventListener('input',e=>{if(e.target.matches('[data-answer]')){state.answers[e.target.dataset.answer]=e.target.value;save();}});
 document.addEventListener('click',e=>{const el=e.target.closest('[data-rate]');if(!el)return;if(el.dataset.rate==='clear')delete state.ratings[el.dataset.id];else state.ratings[el.dataset.id]=el.dataset.rate;if(submitted&&mockQuestions.some(q=>q.id===el.dataset.id)){if(el.dataset.rate==='clear')delete mockRatings[el.dataset.id];else mockRatings[el.dataset.id]=el.dataset.rate;}save();refresh();toast(el.dataset.rate==='clear'?'풀이 상태를 해제했습니다.':'풀이 상태를 저장했습니다.');});
 const setMobileMenu=open=>{
  document.body.classList.toggle('nav-open',open);
  $('.mobile-toggle')?.setAttribute('aria-expanded',String(open));
  const sidebar=$('.sidebar');
  if(sidebar&&matchMedia('(max-width:760px)').matches){sidebar.inert=!open;sidebar.setAttribute('aria-hidden',String(!open));}
  const scrim=$('.nav-scrim');
  if(scrim)scrim.hidden=!open;
  if(open)$('.mobile-close')?.focus();
 };
 $('.mobile-toggle')?.addEventListener('click',()=>setMobileMenu(true));
 $('.dock-menu')?.addEventListener('click',()=>setMobileMenu(true));
 $('.mobile-close')?.addEventListener('click',()=>setMobileMenu(false));
 $('.nav-scrim')?.addEventListener('click',()=>setMobileMenu(false));
 $('#navigation')?.addEventListener('click',e=>{if(e.target.closest('a'))setMobileMenu(false);});
 const syncMobileMenu=()=>{const sidebar=$('.sidebar');if(!sidebar)return;if(matchMedia('(max-width:760px)').matches)setMobileMenu(document.body.classList.contains('nav-open'));else{document.body.classList.remove('nav-open');sidebar.inert=false;sidebar.removeAttribute('aria-hidden');$('.nav-scrim').hidden=true;}};
 addEventListener('resize',syncMobileMenu,{passive:true});
 syncMobileMenu();
 $('#print-page')?.addEventListener('click',()=>window.print());
 $('#import-button')?.addEventListener('click',()=>$('#import-progress').click());
 let printClosed=[];
 window.addEventListener('beforeprint',()=>{if(document.body.classList.contains('mock-active'))return;printClosed=$$('details:not([open])');printClosed.forEach(d=>d.open=true);});
 window.addEventListener('afterprint',()=>{printClosed.forEach(d=>d.open=false);printClosed=[];});
 const toggleSearch=()=>{const p=$('#search-panel');p.hidden=!p.hidden;$('#search-toggle').setAttribute('aria-expanded',String(!p.hidden));if(!p.hidden)$('#global-search').focus();};
 $('#search-toggle')?.addEventListener('click',toggleSearch);
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.target.matches('input,textarea,select')&&!e.target.isContentEditable){e.preventDefault();if($('#search-panel').hidden)toggleSearch();else $('#global-search').focus();}if(e.key==='Escape'&&document.body.classList.contains('nav-open')){setMobileMenu(false);$('.mobile-toggle')?.focus();return;}if(e.key==='Escape'&&!$('#search-panel').hidden){toggleSearch();$('#search-toggle').focus();}});
 $('#global-search')?.addEventListener('input',e=>{const term=e.target.value.trim().toLocaleLowerCase();const result=$('#search-results');if(!term){result.innerHTML='';return;}const found=window.STUDY_SEARCH.filter(x=>(x.title+' '+x.course+' '+x.text).toLocaleLowerCase().includes(term));result.innerHTML=`<p class="muted">${found.length}개 검색 결과${found.length>30?' · 처음 30개 표시':''}</p>`+found.slice(0,30).map(x=>`<a href="${esc(x.url)}"><strong>${esc(x.title)}</strong><small>${esc(x.course)} · ${esc(x.text.slice(0,90))}…</small></a>`).join('');});
 $('#export-progress')?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='실기-학습기록-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('학습 기록 백업 파일을 저장합니다.');});
 $('#import-progress')?.addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>2e6)throw Error('too large');const data=JSON.parse(await f.text());if(data.version!==1||!data.done||!data.answers||!data.ratings)throw Error('format');const imported=empty();const validId=x=>/^[a-z]+-(?:s|q)\d+$/.test(x)||/^plan-\d+$/.test(x);for(const [k,v] of Object.entries(data.done))if(validId(k)&&typeof v==='boolean')imported.done[k]=v;for(const [k,v] of Object.entries(data.answers))if(validId(k)&&typeof v==='string')imported.answers[k]=v.slice(0,20000);for(const [k,v] of Object.entries(data.ratings))if(validId(k)&&['correct','wrong'].includes(v))imported.ratings[k]=v;state.done={...state.done,...imported.done};state.answers={...state.answers,...imported.answers};state.ratings={...state.ratings,...imported.ratings};save();refresh();toast('백업 기록을 현재 기록에 합쳤습니다. 같은 항목은 백업 값으로 갱신했습니다.');}catch{toast('올바른 학습 기록 JSON 파일을 선택해 주세요.');}e.target.value='';});
 const renderQ=(q,i,mock=false)=>`<article class="question" id="${q.id}" data-q="${q.id}"><div class="question-meta"><span>${esc(q.courseTitle)} · ${esc(q.level)} · 창작 ${String(i+1).padStart(2,'0')}</span><span class="q-state" data-state="${q.id}">미풀이</span></div><h3>${esc(q.title)}</h3><p>${esc(q.prompt)}</p>${q.code?`<pre tabindex="0" role="group" aria-label="코드 예제"><code>${esc(q.code)}</code></pre>`:''}<label class="answer-label" for="answer-${q.id}">내 답안</label><textarea id="answer-${q.id}" ${mock?'data-mock-answer':'data-answer'}="${q.id}" rows="2" placeholder="실행하지 말고 먼저 답을 적어보세요."></textarea><details class="solution"><summary>정답과 풀이 확인</summary><div><p class="answer"><strong>정답</strong><span>${esc(q.answer).replace(/\n/g,'<br>')}</span></p><p>${esc(q.explanation)}</p><div class="rating"><span>해설과 비교해 직접 채점</span><button data-rate="correct" data-id="${q.id}">맞혔어요</button><button data-rate="wrong" data-id="${q.id}">다시 풀래요</button><button data-rate="clear" data-id="${q.id}">기록 해제</button></div></div></details></article>`;
 const shuffled=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
 let order=[];
 function renderBank(){if(!$('#question-bank'))return;const course=$('#filter-course').value,status=$('#filter-state').value,level=$('#filter-level').value;const filtered=order.filter(q=>(course==='all'||q.course===course)&&(level==='all'||q.level===level)&&(status==='all'||(state.ratings[q.id]||'new')===status));$('#question-count').textContent=`${filtered.length}문제 · 해설을 확인한 뒤 맞혔어요 / 다시 풀래요를 선택하세요.`;$('#question-bank').innerHTML=filtered.length?filtered.map((q,i)=>renderQ(q,i)).join(''):'<div class="empty"><h2>해당하는 문제가 없습니다.</h2><p>필터를 바꾸거나 다른 과목에서 학습을 시작하세요.</p></div>';refresh();}
 ['filter-course','filter-state','filter-level'].forEach(id=>$('#'+id)?.addEventListener('change',renderBank));
 $('#shuffle')?.addEventListener('click',()=>{order=shuffled(order);renderBank();toast('현재 문제 순서를 섞었습니다.');});
 let mockQuestions=[],deadline=0,tick=null,submitted=false,mockRatings={};
 function updateMockScore(){if(!submitted||!$('#mock-results'))return;const correct=mockQuestions.filter(q=>mockRatings[q.id]==='correct').length;const graded=Object.keys(mockRatings).length;$('#mock-results').innerHTML=`<strong>자기 채점 ${graded}/20문항 · 현재 ${correct*5}점</strong><p>맞힌 문제 ${correct}개. 각 해설 아래에서 채점하세요. 미채점 항목은 점수에 포함되지 않습니다.</p>`;}
 function submitMock(auto=false){if(!mockQuestions.length||submitted)return;submitted=true;clearInterval(tick);document.body.classList.remove('mock-active');$$('[data-mock-answer]').forEach(el=>state.answers[el.dataset.mockAnswer]=el.value);save();$('#submit-mock').disabled=true;$('#start-mock').disabled=false;$('#start-mock').textContent='새 20문항 시작';$('#mock-status').textContent=auto?'시간이 끝났습니다. 해설과 비교해 채점하세요.':'제출했습니다. 해설과 비교해 채점하세요.';$('#mock-results').hidden=false;refresh();}
 $('#submit-mock')?.addEventListener('click',()=>submitMock());
 $('#start-mock')?.addEventListener('click',()=>{if(!window.STUDY_QUESTIONS)return;mockQuestions=[];mockRatings={};for(const [id,n] of [['c',3],['java',3],['python',2],['sql',3]])mockQuestions.push(...shuffled(window.STUDY_QUESTIONS.filter(q=>q.course===id)).slice(0,n));const ids=['database','design','testing','network','os','security','integration'];ids.forEach(id=>mockQuestions.push(shuffled(window.STUDY_QUESTIONS.filter(q=>q.course===id))[0]));const selected=new Set(mockQuestions.map(q=>q.id));mockQuestions.push(...shuffled(window.STUDY_QUESTIONS.filter(q=>ids.includes(q.course)&&!selected.has(q.id))).slice(0,2));mockQuestions=shuffled(mockQuestions);submitted=false;deadline=Date.now()+150*60*1000;$('#mock-questions').innerHTML=mockQuestions.map((q,i)=>renderQ(q,i,true)).join('');$('#mock-results').hidden=true;document.body.classList.add('mock-active');$('#submit-mock').disabled=false;$('#start-mock').disabled=true;$('#mock-status').textContent='진행 중 · 새로고침하면 이 모의 연습은 초기화됩니다.';const update=()=>{const remain=Math.max(0,Math.ceil((deadline-Date.now())/1000));$('#timer').textContent=String(Math.floor(remain/60)).padStart(2,'0')+':'+String(remain%60).padStart(2,'0');if(!remain)submitMock(true);};clearInterval(tick);update();tick=setInterval(update,1000);});
 window.addEventListener('beforeunload',e=>{if(document.body.classList.contains('mock-active')){e.preventDefault();e.returnValue='';}});
 const initQuestions=()=>{order=window.STUDY_QUESTIONS||[];const course=new URLSearchParams(location.search).get('course');if($('#filter-course')&&window.STUDY_COURSES.some(c=>c.id===course))$('#filter-course').value=course;renderBank();};
 window.addEventListener('questions-ready',initQuestions);
 if(window.STUDY_QUESTIONS)initQuestions();
 refresh();
 if(!saveAvailable)toast('브라우저 저장을 사용할 수 없습니다. 학습 후 홈에서 기록을 백업하세요.');
})();


