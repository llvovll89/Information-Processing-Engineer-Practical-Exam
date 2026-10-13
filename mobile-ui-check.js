(() => {
 const results=[];
 const doc=document,win=window,width=innerWidth,page=doc.body.dataset.page;
   if(doc.documentElement.scrollWidth>width)results.push({page,width,error:'overflow',actual:doc.documentElement.scrollWidth});
   if(width<=760){
    for(const el of doc.querySelectorAll('button,select,textarea,.lesson-route a,.mobile-dock a')){
     const r=el.getBoundingClientRect();
     if(r.width&&r.height&&win.getComputedStyle(el).visibility!=='hidden'&&r.height<44)results.push({page,width,error:'small touch target',text:el.textContent.trim(),height:r.height});
    }
   }
   if(!doc.querySelector('#reading-toggle'))results.push({page,width,error:'missing settings'});
 return {page,width,theme:doc.documentElement.dataset.theme,size:doc.documentElement.dataset.readingSize,results};
})();
