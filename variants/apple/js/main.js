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
 const dock=document.getElementById('mobile-cta'),contact=document.getElementById('contact');
 if(dock&&contact&&'IntersectionObserver'in window)new IntersectionObserver(entries=>dock.classList.toggle('is-hidden',entries[0].isIntersecting),{threshold:.15}).observe(contact);
})();