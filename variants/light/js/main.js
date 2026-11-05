(function(){
  document.documentElement.classList.add('js');
  var calm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onView(el,fn){
    if(!('IntersectionObserver' in window)){fn();return}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.disconnect();fn()}})},{threshold:.3});
    io.observe(el);
  }

  /* услуги: стрелки прокрутки появляются, только если карточки не помещаются */
  var sc=document.getElementById('svc-cards'),sp=document.getElementById('svc-prev'),sn=document.getElementById('svc-next'),sa=document.querySelector('.svc-nav');
  if(sc&&sa&&sp&&sn){
    var upd=function(){sa.hidden=sc.scrollWidth<=sc.clientWidth+4};
    upd();window.addEventListener('resize',upd);
    var go=function(d){var c=sc.querySelector('.svc-card');sc.scrollBy({left:d*(c.offsetWidth+16),behavior:calm?'auto':'smooth'})};
    sp.addEventListener('click',function(){go(-1)});sn.addEventListener('click',function(){go(1)});
  }

  /* плавное появление блоков при прокрутке */
  if(!calm&&'IntersectionObserver' in window){
    var rio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('.sec-head,.svc-head,.svc-card,.work,.step,.card,.b,.about-dark,.statement-card,.cta-card,.formats-head,.logos').forEach(function(el){
      var i=el.parentNode?Array.prototype.indexOf.call(el.parentNode.children,el):0;
      el.style.setProperty('--d',Math.min(i,5)*70+'ms');el.classList.add('rv');rio.observe(el);
    });
  }

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
  if(!calm)document.querySelectorAll('.hero-stats,.bento,.about-stats').forEach(function(box){onView(box,function(){countUp(box)})});

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

  /* копирование почты */
  var cb=document.getElementById('copy-mail'),st=document.getElementById('copy-state');
  if(cb)cb.addEventListener('click',function(){
    var t=cb.getAttribute('data-text');
    function ok(){st.textContent='Скопировано';setTimeout(function(){st.textContent='Скопировать'},1800)}
    try{navigator.clipboard.writeText(t).then(ok,function(){st.textContent='Выделите и скопируйте'})}catch(e){st.textContent='Выделите и скопируйте'}
  });
  /* форма обратной связи: если указан data-endpoint (например, Formspree), отправляет туда; иначе открывает письмо */
  var lf=document.getElementById('lead-form'),fs=document.getElementById('form-status');
  if(lf)lf.addEventListener('submit',function(e){
    e.preventDefault();
    var d=new FormData(lf),name=d.get('name'),contact=d.get('contact'),msg=d.get('message');
    var mail=(cb&&cb.getAttribute('data-text'))||'',ep=lf.getAttribute('data-endpoint');
    if(ep){
      fs.textContent='Отправляю…';
      fetch(ep,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({name:name,contact:contact,message:msg})})
        .then(function(r){if(!r.ok)throw 0;lf.reset();fs.textContent='Спасибо, заявка отправлена.'})
        .catch(function(){fs.textContent='Не удалось отправить. Напишите на '+mail})
    }else{
      var body='Имя: '+name+'\nКонтакт: '+contact+'\n\n'+msg;
      window.location.href='mailto:'+mail+'?subject='+encodeURIComponent('Заявка с сайта: '+name)+'&body='+encodeURIComponent(body);
      fs.textContent='Открыл письмо в вашей почтовой программе. Если оно не открылось, напишите на '+mail;
    }
  });
})();
