// 출력 코드 외의 SQL·계산 예제를 독립적인 실행/계산으로 확인한다.
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const python=process.env.PYTHON_EXE||'C:/Users/svvvs/AppData/Local/Microsoft/WindowsApps/py.exe';
const sql=`import sqlite3
c=sqlite3.connect(':memory:')
c.executescript("CREATE TABLE emp(dept,salary); INSERT INTO emp VALUES('A',10),('A',30),('B',20); CREATE TABLE A(id);INSERT INTO A VALUES(1),(2),(3);CREATE TABLE B(id,status);INSERT INTO B VALUES(1,'Y'),(NULL,'N');CREATE TABLE scores(id,score);INSERT INTO scores VALUES(1,90),(2,90),(3,80);")
assert c.execute('SELECT dept,AVG(salary) FROM emp WHERE salary>=20 GROUP BY dept HAVING AVG(salary)>25 ORDER BY dept').fetchall()==[('A',30.0)]
assert c.execute('SELECT id FROM A WHERE id NOT IN (SELECT id FROM B)').fetchall()==[]
assert c.execute('SELECT id FROM A WHERE NOT EXISTS(SELECT 1 FROM B WHERE B.id=A.id) ORDER BY id').fetchall()==[(2,),(3,)]
assert c.execute('SELECT RANK() OVER(ORDER BY score DESC),DENSE_RANK() OVER(ORDER BY score DESC) FROM scores ORDER BY score DESC,id').fetchall()==[(1,1),(1,1),(3,2)]
assert c.execute("SELECT A.id,B.status FROM A LEFT JOIN B ON A.id=B.id AND B.status='Y' ORDER BY A.id").fetchall()==[(1,'Y'),(2,None),(3,None)]
print('5 additional SQL checks passed')`;
const r=spawnSync(python,['-3','-c',sql],{encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr);
function faults(refs,size,policy){const frames=[],last=new Map();let misses=0;refs.forEach((p,i)=>{if(!frames.includes(p)){misses++;if(frames.length===size){const victim=policy==='FIFO'?0:frames.reduce((best,v,j)=>last.get(v)<last.get(frames[best])?j:best,0);frames.splice(victim,1);}frames.push(p);}last.set(p,i);});return misses;}
assert.equal(faults([1,2,3,1,4,2],3,'FIFO'),4);assert.equal(faults([1,2,3,1,4,2],3,'LRU'),5);
const ip=192*2**24+168*2**16+5*256+77,block=2**(32-23),base=Math.floor(ip/block)*block;
const dotted=n=>[24,16,8,0].map(s=>Math.floor(n/2**s)%256).join('.');
assert.equal(dotted(base),'192.168.4.0');assert.equal(dotted(base+block-1),'192.168.5.255');assert.equal(block-2,510);
function rr(bursts,q){const remaining=[...bursts],queue=bursts.map((_,i)=>i),end=[];let time=0;while(queue.length){const i=queue.shift(),slice=Math.min(q,remaining[i]);time+=slice;remaining[i]-=slice;if(remaining[i])queue.push(i);else end[i]=time;}return end;}
assert.deepEqual(rr([5,3],2),[8,7]);assert.equal(((8-5)+(7-3))/2,3.5);
let dividend=parseInt('1101000',2),divisor=parseInt('1011',2);for(let i=6;i>=3;i--)if(dividend&(1<<i))dividend^=divisor<<(i-3);assert.equal(dividend,1);
assert.equal(5*1024+(2500%1024),5572);
console.log(r.stdout.trim()+'; 9 checks for page replacement, subnet, RR, CRC and address translation passed.');
