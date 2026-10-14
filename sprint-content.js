// 2026-10-14: append only, keeping existing section/question storage IDs stable.
module.exports = (courses, sources) => {
 const refs = {
  java: ['Oracle Java 메서드 재정의·숨김', 'https://docs.oracle.com/javase/tutorial/java/IandI/override.html'],
  python: ['Python 3.14 제어 흐름', 'https://docs.python.org/3.14/tutorial/controlflow.html'],
  sql: ['PostgreSQL 18 비교와 NULL', 'https://www.postgresql.org/docs/18/functions-comparisons.html'],
  database: ['PostgreSQL 18 트랜잭션 격리', 'https://www.postgresql.org/docs/18/transaction-iso.html'],
  security: ['OWASP CSRF', 'https://owasp.org/www-community/attacks/csrf'],
  network: ['IETF RFC 4632 CIDR', 'https://www.rfc-editor.org/rfc/rfc4632'],
  os: ['OSTEP CPU 스케줄링', 'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf'],
  c: ['C11 위원회 초안 N1570 §6.5.6·6.7.6.2', 'https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf'],
  design: ['Scrum Guide 공식 가이드', 'https://scrumguides.org/scrum-guide.html'],
  integration: ['IETF RFC 9110 HTTP 의미론', 'https://www.rfc-editor.org/rfc/rfc9110.html']
 };
 for(const [id,[name,url]] of Object.entries(refs)) sources.push({id:'review-1014-'+id,name,url,type:'2026.10.14 재확인',note:'해당 개념의 근거 문서. 시험 출제 여부나 비중을 예측하는 자료가 아닙니다. 해설과 예제는 직접 작성했습니다.'});
 const add=(id,title,body,must,trap,prompt,answer,code='',steps=[])=>courses.find(c=>c.id===id).sections.push({title,body,must,trap,code,steps,recall:{prompt,answer},source:refs[id]});
 const q=(id,title,prompt,answer,explanation,code='',level='응용',runCode)=>courses.find(c=>c.id===id).questions.push({title,prompt,answer,explanation,code,level,...(runCode?{runCode}:{})});
 add('c','배열 포인터와 포인터 배열 최종 구별','int (*p)[3]은 정수 3개짜리 배열을 가리키는 포인터다. int *p[3]은 정수 포인터 3개를 담는 배열이다. 선언의 괄호를 먼저 읽는다. 2차원 배열 a를 가리키는 p에서 p+1은 다음 행, (*p)+1은 현재 행의 다음 원소다.','int a[2][3]; int (*p)[3]=a; p[1][2]는 a[1][2].','sizeof(int)를 4바이트로 고정하지 않는다. 문자열 끝의 널 문자와 숫자 0도 구별한다.','a={{1,2,3},{4,5,6}}에서 *(*(p+1)+1)은?','5. p+1은 두 번째 행, +1은 그 행의 두 번째 원소다.','int a[2][3]={{1,2,3},{4,5,6}};\nint (*p)[3]=a;\nprintf("%d", *(*(p+1)+1));');
 add('java','필드·static·인스턴스 메서드 판정표','상위 타입 변수에 하위 객체를 담았을 때 필드 접근과 static 메서드 선택은 참조 변수의 선언 타입을 기준으로 한다. 재정의된 인스턴스 메서드는 실제 객체 타입으로 결정한다. 오버로딩 후보 선택은 컴파일 시 인자 타입에 따른다.','A x = new B(): x.field와 x.staticMethod()는 A, 재정의된 x.method()는 B.','static 메서드를 객체로 호출할 수는 있어도 다형적 오버라이딩이 되지는 않는다.','상위 참조가 하위 객체를 가리킬 때 모든 멤버가 하위 것으로 선택되는가?','아니다. 필드와 static 숨김은 선언 타입, 재정의 인스턴스 메서드는 실제 타입이다.');
 add('python','기본 인자와 반복 리스트 공유','함수의 기본 인자 식은 함수 정의 시 평가된다. 기본 인자로 만든 가변 리스트는 호출 사이에 재사용될 수 있다. [[0]*2]*2는 내부 리스트 하나를 두 번 참조한다. 행마다 독립된 리스트가 필요하면 컴프리헨션으로 만든다.','기본 인자 []는 호출마다 새로 만들어지지 않는다. [[0]*2 for _ in range(2)]는 행이 독립적이다.','리스트의 바깥쪽만 복사해도 내부 객체 참조는 공유될 수 있다.','a=[[0]*2]*2; a[0][1]=7 이후 a는?','[[0, 7], [0, 7]]. 두 행이 같은 내부 리스트를 가리킨다.','def f(a=[]):\n    a.append(1)\n    return len(a)\nprint(f(), f())\na = [[0]*2]*2\na[0][1] = 7\nprint(a)');
 add('sql','빈 집합·NULL·COUNT 마지막 점검','NOT IN 목록에 NULL이 있고 일치값이 없으면 조건은 UNKNOWN이 되어 WHERE를 통과하지 못한다. 빈 집합에 대한 ALL은 참, ANY는 거짓이다. COUNT(*)는 행을 세고 COUNT(열)은 NULL을 제외한다. 비어 있는 집합의 COUNT는 0이며 SUM은 NULL이다.','WHERE는 TRUE만 남긴다. FALSE와 UNKNOWN은 모두 제외한다.','ANY·ALL은 문제의 DBMS 문법을 따른다. PostgreSQL 배열용 ANY와 표준 서브쿼리 표기를 혼동하지 않는다.','3 NOT IN (1,NULL)은 TRUE인가?','UNKNOWN이다. 3<>1 AND 3<>NULL에서 두 번째가 UNKNOWN이므로 WHERE에서 제외된다.');
 add('database','격리 수준의 표준과 구현 차이','Dirty Read는 미커밋 값 읽기, Non-repeatable Read는 같은 행의 재조회 값 변경, Phantom Read는 같은 검색 조건의 행 집합 변경이다. 표준 최소 보장 기준으로 Read Committed는 Dirty Read를 막고 Repeatable Read는 앞의 두 현상을 막는다. Serializable은 직렬 실행과 같은 효과를 보장한다.','표준 Repeatable Read는 Phantom을 허용할 수 있으나 PostgreSQL 구현에서는 막는다.','문제가 특정 DBMS를 명시하면 그 구현을 따른다. 이론 표와 실제 구현을 같은 것으로 단정하지 않는다.','같은 조건 SELECT를 다시 실행했더니 새 행이 생겼다. 현상 이름은?','Phantom Read(팬텀 읽기). 기존 행 값의 변화인 Non-repeatable Read와 구별한다.');
 add('os','선점 계산에서 도착·완료·응답 분리','반환시간은 완료-도착, 대기시간은 반환-CPU 실행시간, 응답시간은 최초 실행 시작-도착이다. SRT는 새 프로세스가 도착할 때 현재 남은 시간과 비교한다. 동률이면 문제의 우선순위 조건을 따른다.','SRT는 최초 실행시간이 아니라 매 시점의 남은 실행시간으로 선택한다.','응답시간과 반환시간은 다르다. I/O 없이 CPU burst만 있는 계산인지 먼저 확인한다.','P1(도착0,실행8), P2(도착1,실행2)를 SRT로 실행하면 평균 대기시간은?','1. P1은 0~1, P2는 1~3, P1은 3~10. 대기는 P1=2, P2=0이다.','', ['0~1: P1 실행. P2가 도착할 때 P1의 남은 시간은 7이다.','1~3: 더 짧은 P2 실행 후 완료.','3~10: P1 완료. 반환시간 P1=10, P2=2. 대기는 2와 0, 평균 1.']);
 add('network','서브넷 범위를 블록으로 검산','일반 IPv4 서브넷에서 /p의 주소 수는 2^(32-p)이다. /27이면 32개씩 끊고 /26이면 64개씩 끊는다. 주소가 속한 블록의 첫 주소가 네트워크, 마지막 주소가 브로드캐스트다.','192.168.10.130/26: 네트워크 .128, 브로드캐스트 .191, 통상 사용 호스트 .129~.190(62개).','호스트 수=주소 수-2는 일반 서브넷 규칙이다. /31 지점 간 연결과 /32 단일 주소는 별도 조건을 따른다.','192.168.10.77/27의 네트워크와 브로드캐스트는?','192.168.10.64 / 192.168.10.95. 77은 64~95 블록에 속한다.');
 add('security','공격명을 쓰기 전에 실행 주체 확인','XSS는 악성 스크립트가 사용자의 브라우저에서 실행되는 공격이다. CSRF는 로그인된 사용자의 브라우저가 의도하지 않은 요청을 보내게 한다. SQL Injection은 입력이 SQL 구문으로 해석되게 하며, SSRF는 서버가 공격자가 의도한 대상에 요청하도록 만든다.','브라우저 스크립트=XSS, 사용자 권한 요청=CSRF, DB 질의 변조=SQLi, 서버의 대리 요청=SSRF.','XSS 방어는 문맥에 맞는 출력 인코딩·안전한 DOM API, SQLi 방어는 매개변수화 질의다. CSRF 토큰만으로 XSS를 해결하지 못한다.','서버의 URL 가져오기 기능을 악용해 내부 관리 주소에 요청한다. 공격은?','SSRF. 요청의 실행 주체가 서버다.');
 add('design','스크럼 리뷰·회고와 책임 구별','스프린트 리뷰는 결과와 목표 진척을 이해관계자와 살펴보고 다음 적응을 논의한다. 회고는 팀의 협업·과정·도구를 돌아보고 효과와 품질을 높이는 개선을 계획한다. Product Owner는 가치 극대화와 Product Backlog의 효과적인 관리에 책임이 있다.','리뷰는 제품 결과와 적응, 회고는 팀의 작업 방식 개선.','Daily Scrum을 관리자의 업무 보고 시간으로 정의하지 않는다. Sprint Review를 단순 승인 게이트로 외우지 않는다.','협업 방식과 도구를 돌아보고 다음 스프린트의 개선을 정하는 이벤트는?','Sprint Retrospective(스프린트 회고).');
 add('integration','안전성과 멱등성 답안 구별','안전한 메서드는 클라이언트가 서버 상태 변경을 요청하지 않는 의미다. 멱등성은 같은 요청을 여러 번 했을 때 서버에 의도된 효과가 한 번과 같다는 뜻이다. GET은 안전하고 멱등이며 PUT·DELETE는 멱등이지만 안전하지 않다.','GET·HEAD는 안전/멱등, PUT·DELETE는 멱등, POST는 일반적으로 멱등 보장이 없다.','DELETE를 반복해서 응답 코드가 달라져도 의도된 서버 효과가 같으면 멱등이다.','DELETE의 첫 응답은 204, 다음은 404이면 멱등성이 깨졌는가?','아니다. 멱등성은 응답 코드의 동일성이 아니라 의도된 서버 효과로 판단한다.');
 q('c','행 포인터 한 칸','출력 결과를 쓰시오.','5','p+1은 다음 행, 그 행에서 +1한 원소는 5다.','int a[2][3]={{1,2,3},{4,5,6}};\nint (*p)[3]=a;\nprintf("%d", *(*(p+1)+1));');
 q('c','문자열 크기와 길이','널 종료 문자열 s의 sizeof s와 strlen(s)를 순서대로 쓰시오.','4 3','배열은 A,B,C,널 문자 4칸이고 strlen은 널 앞의 문자 3개를 센다. sizeof(char)는 1이다.','char s[]="ABC";\nprintf("%zu %zu", sizeof s, strlen(s));');
 const j='class A { int n=1; static String s(){return "A";} String f(){return "A";} }\nclass B extends A { int n=2; static String s(){return "B";} String f(){return "B";} }\n// main 내부\nA x=new B();\nSystem.out.print(x.n+" "+x.s()+" "+x.f());';
 q('java','선언 타입과 실제 타입 혼합','출력 결과를 쓰시오.','1 A B','필드 n과 static s는 선언 타입 A, 인스턴스 f는 실제 객체 B 기준이다.',j,'응용',j.replace('// main 내부','class Main { public static void main(String[] args){')+'}}');
 q('python','기본 인자 재사용','출력 결과를 쓰시오.','1 2','기본 리스트는 함수 정의 시 한 번 생성되어 두 호출에서 재사용된다.','def f(a=[]):\n    a.append(1)\n    return len(a)\nprint(f(), f())');
 q('python','반복한 행의 별칭','출력 결과를 쓰시오.','[[0, 7], [0, 7]]','바깥 리스트의 두 칸은 같은 내부 리스트를 가리킨다.','a = [[0]*2]*2\na[0][1] = 7\nprint(a)');
 q('sql','NULL이 든 제외 목록','x가 1,2,3인 테이블에서 WHERE x NOT IN (1,NULL)이 남기는 행 수는?','0','1은 FALSE, 2·3은 UNKNOWN이므로 TRUE가 없다.');
 q('sql','빈 테이블의 집계','빈 테이블 t(v)에서 SELECT COUNT(*), SUM(v) FROM t 결과는?','0, NULL','GROUP BY 없는 전체 집계는 한 행을 반환한다. COUNT는 0, SUM은 NULL이다.');
 q('database','격리 현상 판별','아직 COMMIT하지 않은 다른 트랜잭션의 변경값을 읽었다. 현상 이름은?','Dirty Read','미커밋 값 읽기인 오손 읽기다.');
 q('database','후보키 최소성','R(A,B,C)에서 A→B, B→C이고 다른 종속은 주어지지 않았다. 후보키는?','A','A의 폐포는 A,B,C이고 A를 더 줄일 수 없다. B는 A를 결정하지 못한다.');
 q('os','응답과 대기 구별','도착0, 최초 실행3, CPU 실행4, 완료10인 프로세스의 응답·반환·대기시간은? I/O는 없다.','3, 10, 6','응답=3-0, 반환=10-0, 대기=10-0-4. 최초 시작까지의 시간만이 대기는 아니다.');
 q('os','SRT 재계산','P1(도착0,실행8), P2(도착1,실행2). SRT의 평균 대기시간은? 문맥 교환 비용은 0이다.','1','실행 순서는 P1(0~1),P2(1~3),P1(3~10). 대기 2와 0의 평균은 1.');
 q('network','/26 블록 찾기','192.168.10.130/26의 네트워크 주소와 브로드캐스트 주소는?','192.168.10.128, 192.168.10.191','블록 크기는 64이며 130은 128~191 구간에 속한다.');
 q('network','필요 호스트에서 역산','일반 IPv4 서브넷에서 호스트 50대를 수용하는 가장 긴 프리픽스는?','/26','2^5-2=30은 부족, 2^6-2=62는 충분. 호스트 비트 6이므로 /26.');
 q('security','요청 실행 주체','서버가 전달받은 URL을 읽는 기능을 악용해 내부 서비스로 요청을 보냈다. 공격명을 쓰시오.','SSRF','서버가 대리 요청하므로 Server-Side Request Forgery다.');
 q('security','로그인 권한의 악용','로그인된 피해자가 외부 페이지를 방문하자 브라우저가 의도하지 않은 계정 변경 요청을 보냈다. 공격명은?','CSRF','인증된 사용자의 브라우저에 요청을 보내게 하는 공격이다. 악성 스크립트 실행 자체가 핵심인 XSS와 구별한다.');
 q('design','리뷰와 회고','팀이 협업 과정과 도구를 돌아보고 개선을 계획했다. 스크럼 이벤트는?','Sprint Retrospective','스프린트 회고다. 결과와 다음 적응을 이해관계자와 살피는 Sprint Review와 구별한다.');
 q('design','패턴 의도 구별','알림 대상 객체 목록을 관리하다 상태 변경 시 등록 객체에 통지한다. 패턴명은?','Observer','일대다 의존 관계에서 상태 변경을 관찰자에게 알리는 행위 패턴이다.');
 q('testing','결정과 조건 분리','if (A || B)에서 입력 (T,F),(F,F) 두 개로 결정 커버리지와 조건 커버리지를 모두 충족하는가? A와 B는 독립 불리언 변수다.','결정은 충족, 조건은 미충족','결정 결과는 T/F가 모두 나온다. B는 입력에서 F뿐이고 단락 실행 기준으로도 T를 실행하지 못한다.');
 q('testing','회귀 테스트의 목적','오류 수정 후 기존의 정상 기능이 손상되지 않았는지 확인하는 테스트는?','회귀 테스트','수정한 결함 자체의 해결을 확인하는 확인 테스트(재테스트)와 구별한다.');
 q('integration','멱등성의 대상','DELETE를 반복했더니 204 다음 404가 반환됐다. 이것만으로 멱등성을 위반했다고 할 수 있는가?','아니오','의도된 서버 효과가 한 번과 같은지가 기준이다. 응답 코드가 같아야 하는 것은 아니다.');
 q('integration','복구 시점과 시간','허용 데이터 손실 시점은 15분, 서비스 복구 목표 시간은 2시간이다. 각 지표는?','RPO=15분, RTO=2시간','RPO는 복구 시점 목표로 데이터 손실 허용 범위, RTO는 복구 시간 목표다.');
};
