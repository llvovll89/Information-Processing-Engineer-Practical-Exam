const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs=text=>String(text).split('\n').filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('');
function details(s) {
 const comparison=s.table ? `<div class="lesson-table" tabindex="0" role="region" aria-label="${esc(s.title)} 비교표"><table><caption>${esc(s.title)} · 한눈에 비교</caption><thead><tr>${s.table.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(row=>`<tr>${row.map((cell,i)=>i===0?`<th scope="row">${esc(cell)}</th>`:`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
 const steps=s.steps?.length ? `<div class="worked-example"><h3>과정으로 이해하기</h3><ol>${s.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></div>`:'';
 const recall=s.recall ? `<div class="recall"><h3>답을 가리고 확인</h3><p>${esc(s.recall.prompt)}</p><details><summary>확인 답안 보기</summary>${paragraphs(s.recall.answer)}</details></div>`:'';
 return comparison+steps+recall;
}
function guide(c) {
 return `<section class="lesson-guide"><span class="tag">기초부터 실전까지</span><h2>${esc(c.learningPath.title)}</h2><p>${esc(c.learningPath.text)}</p><div class="lesson-route"><a href="#section-${c.learningPath.start}">① 기초·상세 설명</a><a href="#section-0">② 핵심 개념 정리</a><a href="#exercises">③ 단원 문제 풀이</a><a href="practice.html?course=${c.id}">④ 문제은행 반복</a></div><details><summary>추가된 상세 학습 ${c.sections.length-c.originalSections}개 펼쳐보기</summary><ul>${c.sections.slice(c.originalSections).map((s,i)=>`<li><a href="#section-${c.originalSections+i}">${esc(s.title)}</a></li>`).join('')}</ul></details></section>`;
}
module.exports={paragraphs,details,guide};
