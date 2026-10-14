const fs=require('node:fs');
const report=JSON.parse(fs.readFileSync('sprint-lighthouse.json','utf8'));
console.log(JSON.stringify({scores:Object.fromEntries(Object.entries(report.categories).map(([k,v])=>[k,Math.round(v.score*100)])),LCP:report.audits['largest-contentful-paint'].displayValue,CLS:report.audits['cumulative-layout-shift'].displayValue,runtimeError:report.runtimeError,consoleErrors:report.audits['errors-in-console'].details?.items},null,2));
