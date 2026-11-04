(function(){
  document.documentElement.classList.add('js');
  var calm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* услуги: превью меняется вместе с выбранной услугой */
  var items=document.querySelectorAll('.svc-item'),chip=document.getElementById('svc-chip');
  items.forEach(function(b,i){
    function sel(){
      if(b.getAttribute('aria-selected')==='true')return;
      items.forEach(function(x){x.setAttribute('aria-selected','false')});
      b.setAttribute('aria-selected','true');
      chip.textContent='0'+(i+1)+' · '+b.getAttribute('data-label');
      var pv=chip.parentNode,im=b.getAttribute('data-img');
      pv.className=pv.className.replace(/\bi-\S+|\bno-img\b/g,'').replace(/\s+/g,' ').trim()+(im?' i-'+im:' no-img');
      pv.style.backgroundPosition=b.getAttribute('data-pos')||'center';
      document.getElementById('svc-soon').hidden=!!im;
      pv.classList.remove('swap');void pv.offsetWidth;pv.classList.add('swap');
    }
    b.addEventListener('click',sel);b.addEventListener('mouseenter',sel);b.addEventListener('focus',sel);
  });

  function onView(el,fn){
    if(!('IntersectionObserver' in window)){fn();return}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.disconnect();fn()}})},{threshold:.3});
    io.observe(el);
  }

  /* шаги процесса */
  var steps=document.querySelector('.steps');
  if(steps)onView(steps,function(){steps.classList.add('in')});

  /* цифры: счётчик от 0 до значения */
  function countUp(box){
    box.querySelectorAll('.num').forEach(function(b){
      var m=b.textContent.match(/^(\d+)(.*)$/);if(!m)return;
      var to=+m[1],sfx=m[2],t0=null;b.textContent='0'+sfx;
      function tick(t){if(t0===null)t0=t;var k=Math.min((t-t0)/900,1),e=1-Math.pow(1-k,3);b.textContent=Math.round(to*e)+sfx;if(k<1)requestAnimationFrame(tick)}
      requestAnimationFrame(tick);
      setTimeout(function(){b.textContent=m[0]},1100);
    });
  }
  if(!calm)document.querySelectorAll('.hero-stats,.bento').forEach(function(box){onView(box,function(){countUp(box)})});

  /* меню на телефоне */
  var bg=document.getElementById('burger'),mn=document.getElementById('menu');
  if(bg&&mn){
    var setMenu=function(o){mn.hidden=!o;bg.setAttribute('aria-expanded',o?'true':'false')};
    bg.addEventListener('click',function(){setMenu(mn.hidden)});
    mn.addEventListener('click',function(e){if(e.target.tagName==='A')setMenu(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
  }

  /* нижняя кнопка на телефоне прячется у блока контактов */
  var dock=document.getElementById('dock'),ct=document.getElementById('contact');
  if(dock&&ct&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){dock.classList.toggle('off',es[0].isIntersecting)},{threshold:.15}).observe(ct);
  }

  /* «Показать ещё» в кейсах */
  var mb=document.getElementById('more-btn'),mr=document.getElementById('more');
  if(mb&&mr)mb.addEventListener('click',function(){
    var open=mr.hidden;mr.hidden=!open;
    mb.setAttribute('aria-expanded',open?'true':'false');
    mb.textContent=open?'Скрыть':'Показать ещё 3 работы';
  });

  /* лента логотипов: копия для бесшовной прокрутки */
  var lt=document.querySelector('.logo-track');
  if(lt){
    if(calm){lt.parentNode.classList.add('calm')}
    else{Array.prototype.slice.call(lt.children).forEach(function(li){
      var c=li.cloneNode(true);c.setAttribute('aria-hidden','true');
      var im=c.querySelector('img');im.alt='';im.removeAttribute('loading');lt.appendChild(c);
    })}
  }

  /* копирование почты */
  var cb=document.getElementById('copy-mail'),st=document.getElementById('copy-state');
  if(cb)cb.addEventListener('click',function(){
    var t=cb.getAttribute('data-text');
    function ok(){st.textContent='Скопировано';setTimeout(function(){st.textContent='Скопировать'},1800)}
    try{navigator.clipboard.writeText(t).then(ok,function(){st.textContent='Выделите и скопируйте'})}catch(e){st.textContent='Выделите и скопируйте'}
  });
})();
