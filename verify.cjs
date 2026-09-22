const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const {courses}=require('./content');
const dir=path.join(process.env.TEMP||__dirname,'exam-study-verify-0922');fs.mkdirSync(dir,{recursive:true});
let checks=0;
const pages=fs.readdirSync(__dirname).filter(f=>f.endsWith('.html'));
for(const page of pages){const html=fs.readFileSync(page,'utf8');const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,page+' duplicate IDs');for(const m of html.matchAll(/href="([^"?#]+\.html)(?:#([^"]+))?"/g)){if(m[1].startsWith('http'))continue;assert.ok(fs.existsSync(m[1]),page+' missing '+m[1]);if(m[2])assert.ok(fs.readFileSync(m[1],'utf8').includes('id="'+m[2]+'"'),page+' missing anchor '+m[0]);}checks++;}
const python=process.env.PYTHON_EXE||'C:/Users/svvvs/AppData/Local/Microsoft/WindowsApps/py.exe';
const pyQuestions=courses.find(c=>c.id==='python').questions;
for(let i=0;i<pyQuestions.length;i++){const q=pyQuestions[i];const run=spawnSync(python,['-3','-c',q.code],{encoding:'utf8',windowsHide:true});if(run.error)throw run.error;assert.equal(run.status,0,run.stderr);assert.equal(run.stdout.trim().replace(/\r/g,''),q.answer,'Python '+i);checks++;}
const javaQuestions=courses.find(c=>c.id==='java').questions;
const bodies=javaQuestions.map((q,i)=>{
 if(i===1)return q.code;
 if(i===2)return q.code+'\nclass Main {public static void main(String[] args){new C();}}';
 if(i===3||i===11){const [defs,main]=q.code.split('// main 내부');return defs+'\nclass Main {public static void main(String[] args){'+main+'}}';}
 if(i===4||i===6){const [methods,main]=q.code.split('// main 내부');return 'class Main {'+methods+' public static void main(String[] args){'+main+'}}';}
 if(i===9)return 'class Main {'+q.code+' public static void main(String[] args){System.out.print(f(5));}}';
 if(i===10)return q.code+'\nclass Main {public static void main(String[] args){new C();}}';
 return 'class Main {public static void main(String[] args){'+q.code+'}}';
});
const javac='C:/Program Files/Eclipse Adoptium/jdk-21.0.10.7-hotspot/bin/javac.exe';
const java='C:/Program Files/Eclipse Adoptium/jdk-21.0.10.7-hotspot/bin/java.exe';
for(let i=0;i<bodies.length;i++){const caseDir=path.join(dir,'java-'+i);fs.mkdirSync(caseDir,{recursive:true});const file=path.join(caseDir,'Main.java');fs.writeFileSync(file,bodies[i]);const compile=spawnSync(javac,['-encoding','UTF-8','-d',caseDir,file],{encoding:'utf8',windowsHide:true});if(compile.error)throw compile.error;assert.equal(compile.status,0,compile.stderr);const run=spawnSync(java,['-cp',caseDir,'Main'],{encoding:'utf8',windowsHide:true});assert.equal(run.status,0,run.stderr);assert.equal(run.stdout.trim(),javaQuestions[i].answer,'Java '+i);checks++;}
const sql=`import sqlite3\nc=sqlite3.connect(':memory:')\nc.executescript('CREATE TABLE t(v); INSERT INTO t VALUES(10),(NULL),(10),(20); CREATE TABLE A(id); INSERT INTO A VALUES(1),(2),(3); CREATE TABLE B(aid); INSERT INTO B VALUES(1),(1),(3); CREATE TABLE emp(id,dept,salary); INSERT INTO emp VALUES(1,"A",10),(2,"A",30),(3,"B",20);')\nassert c.execute('SELECT COUNT(*),COUNT(v),COUNT(DISTINCT v) FROM t').fetchone()==(4,3,2)\nassert len(c.execute('SELECT * FROM A LEFT JOIN B ON A.id=B.aid').fetchall())==4\nassert len(c.execute('SELECT * FROM A LEFT JOIN B ON A.id=B.aid WHERE B.aid IS NOT NULL').fetchall())==3\nassert c.execute('SELECT e.id FROM emp e WHERE e.salary>(SELECT AVG(x.salary) FROM emp x WHERE x.dept=e.dept) ORDER BY e.id').fetchall()==[(2,)]\nprint('SQL 4 checks passed')`;
const sqlRun=spawnSync(python,['-3','-c',sql],{encoding:'utf8',windowsHide:true});assert.equal(sqlRun.status,0,sqlRun.stderr);checks+=4;
assert.equal(new Date('2026-10-25T00:00:00Z').getUTCDay(),0);assert.equal((Date.parse('2026-10-25')-Date.parse('2026-09-22'))/86400000,33);checks+=2;
console.log(`${checks} checks passed: ${pages.length} HTML link/anchor checks, 12 Python, 12 Java, 4 SQL, 2 date checks. C examples manually traced; no C compiler used.`);


