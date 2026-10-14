const fs=require('node:fs'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process'),Module=require('node:module'),path=require('node:path');
const {courses}=require('./content');
const old=spawnSync('git',['show','HEAD:content.js'],{encoding:'utf8',windowsHide:true});assert.equal(old.status,0,old.stderr);
const baseline=new Module(path.join(__dirname,'baseline.content.cjs'),module);baseline.filename=path.join(__dirname,'baseline.content.cjs');baseline.paths=module.paths;baseline._compile(old.stdout,baseline.filename);
let preserved=0;
for(const before of baseline.exports.courses){const after=courses.find(c=>c.id===before.id);assert.ok(after);assert.deepEqual(after.sections.slice(0,before.sections.length),before.sections);assert.deepEqual(after.questions.slice(0,before.questions.length),before.questions);preserved+=before.sections.length+before.questions.length;}
const python=process.env.PYTHON_EXE||'C:/Users/svvvs/AppData/Local/Microsoft/WindowsApps/py.exe';
const sql=`import sqlite3
c=sqlite3.connect(':memory:')
c.executescript('CREATE TABLE t(v); CREATE TABLE x(v); INSERT INTO x VALUES(1),(2),(3);')
assert c.execute('SELECT COUNT(*),SUM(v) FROM t').fetchall()==[(0,None)]
assert c.execute('SELECT v FROM x WHERE v NOT IN (1,NULL)').fetchall()==[]
print('2 new SQL examples passed')`;
const r=spawnSync(python,['-3','-c',sql],{encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr||String(r.error));
const subnet=(last,prefix)=>{const block=2**(32-prefix),base=Math.floor(last/block)*block;return [base,base+block-1,block-2];};
assert.deepEqual(subnet(130,26),[128,191,62]);assert.deepEqual(subnet(77,27),[64,95,30]);
let time=0;const arrivals=[0,1],bursts=[8,2],remaining=[...bursts],finished=[];
while(remaining.some(n=>n>0)){const ready=remaining.map((n,i)=>({n,i})).filter(p=>p.n>0&&arrivals[p.i]<=time).sort((a,b)=>a.n-b.n||a.i-b.i);if(!ready.length){time++;continue;}const i=ready[0].i;remaining[i]--;time++;if(!remaining[i])finished[i]=time;}
assert.deepEqual(finished,[10,3]);assert.equal(finished.reduce((s,t,i)=>s+t-arrivals[i]-bursts[i],0)/2,1);
assert.equal(courses.flatMap(c=>c.questions).length,191);assert.equal(courses.flatMap(c=>c.sections).length,182);
assert.equal((fs.readFileSync('plan.html','utf8').match(/class="day"/g)||[]).length,11);
console.log(`${preserved} existing concepts/questions preserved in order; new SQL, subnet and SRT calculations passed; 11-day schedule and totals checked. ${r.stdout.trim()}`);
