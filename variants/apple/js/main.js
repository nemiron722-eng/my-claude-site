(function(){
 const burger=document.getElementById('burger'),menu=document.getElementById('menu');
 if(burger&&menu){
  const toggle=open=>{menu.hidden=!open;burger.setAttribute('aria-expanded',String(open));burger.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')};
  burger.addEventListener('click',()=>toggle(menu.hidden));
  menu.addEventListener('click',e=>{if(e.target.closest('a'))toggle(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false)});
 }
 const form=document.getElementById('lead-form'),status=document.getElementById('form-status');
 if(form)form.addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(form),name=String(data.get('name')||'').trim(),contact=String(data.get('contact')||'').trim(),message=String(data.get('message')||'').trim();
  if(!name||!contact||!message){status.textContent='Заполните, пожалуйста, все поля.';return}
  const email=form.dataset.email;
  if(!email){status.textContent='Форма пока не подключена. Добавьте рабочий email в атрибут data-email формы.';return}
  const subject=encodeURIComponent('Запрос с сайта от '+name),body=encodeURIComponent('Имя: '+name+'\nКонтакт: '+contact+'\n\nЗадача:\n'+message);
  window.location.href='mailto:'+email+'?subject='+subject+'&body='+body;
  status.textContent='Открываю почтовую программу. Если письмо не открылось, напишите напрямую.';
 });
 // Rainbow letter trail: each glyph lights up under the pointer, then softly returns to black.
 const heroTitle=document.querySelector('.hero h1');
 if(heroTitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  let glyphIndex=0;
  const letters=[];
  const walker=document.createTreeWalker(heroTitle,NodeFilter.SHOW_TEXT);
  const textNodes=[];
  while(walker.nextNode())textNodes.push(walker.currentNode);
  textNodes.forEach(node=>{
   const fragment=document.createDocumentFragment();
   [...node.textContent].forEach(char=>{
    if(/\s/.test(char)){fragment.appendChild(document.createTextNode(char));return}
    const span=document.createElement('span');
    span.className='color-letter';
    span.textContent=char;
    const hue=(glyphIndex/Math.max(1,[...heroTitle.textContent.replace(/\s/g,'')].length-1))*300;
    span.style.setProperty('--letter-color','hsl('+hue+' 88% 55%)');
    glyphIndex++;
    fragment.appendChild(span);
    letters.push(span);
   });
   node.parentNode.replaceChild(fragment,node);
  });
  const timers=new WeakMap();
  heroTitle.addEventListener('pointermove',event=>{
   if(event.pointerType==='touch')return;
   const x=event.clientX,y=event.clientY;
   letters.forEach(letter=>{
    const rect=letter.getBoundingClientRect();
    const dx=x-(rect.left+rect.width/2),dy=y-(rect.top+rect.height/2);
    if(Math.hypot(dx,dy)<Math.max(25,rect.width*.8)){
     letter.classList.add('is-lit');
     clearTimeout(timers.get(letter));
     timers.set(letter,setTimeout(()=>letter.classList.remove('is-lit'),120));
    }
   });
  });
 }
 const dock=document.getElementById('mobile-cta'),contact=document.getElementById('contact');
 if(dock&&contact&&'IntersectionObserver'in window)new IntersectionObserver(entries=>dock.classList.toggle('is-hidden',entries[0].isIntersecting),{threshold:.15}).observe(contact);
})();