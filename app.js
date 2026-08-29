const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY='china-trip-2026-state', DB='china-trip-2026-files', CHINA_TZ='Asia/Shanghai';
let S=JSON.parse(localStorage.getItem(KEY)||'{}'), cur=null;
const st=id=>S[id]||(S[id]={status:'not_booked'});
const CITY_COLORS={
  'Beijing':'#294f68','Xi’an':'#8c4b46','Chengdu':'#4f765b','Zhangjiajie':'#5a7253','Yangshuo':'#7b6950','Shanghai + Suzhou':'#555c7b'
};
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function before(d,n){let x=new Date(d+'T00:00:00Z');x.setUTCDate(x.getUTCDate()-n);return x.toISOString().slice(0,10)}
function od(i){let s=st(i.id);return s.openDate||s.manualOpenDate||i.manualOpenDate||(i.bookingWindowDays?before(i.date,i.bookingWindowDays):null)}
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:CHINA_TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function pretty(d){return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(d+'T00:00:00Z'))}
function daysUntil(d){return Math.ceil((new Date(d+'T00:00:00Z')-new Date(today()+'T00:00:00Z'))/86400000)}
function ico(t){return({train:'🚆',flight:'✈️',attraction:'🏯',show:'🎭',activity:'🛶',transfer:'🚕',restaurant:'🍽️',hotel:'🏨',shopping:'🛍️',tour:'🚌',area:'📍',arrival:'📍'})[t]||'🎟️'}
function status(i){
  let s=st(i.id).status;
  if(['booked','confirmed','cancelled'].includes(s)) return s;
  if(!i.bookable) return 'info';
  let o=od(i),t=today();
  if(!o) return 'open';
  if(t>=o) return 'open';
  return daysUntil(o)<=3?'soon':'not_open';
}
function pill(x){let m={booked:['Booked','green'],confirmed:['Confirmed','blue'],cancelled:['Cancelled',''],open:['Book now','red'],soon:['Opens soon','amber'],not_open:['Not open yet',''],info:['No booking','']},a=m[x]||[x,''];return `<span class="pill ${a[1]}">${a[0]}</span>`}
function openCountdown(i){
  const o=od(i); if(!o) return '';
  const d=daysUntil(o);
  if(d>1) return `${d} days`; if(d===1) return 'Tomorrow'; if(d===0) return 'Today'; return 'Open';
}
function card(i,mini=false){
  let s=st(i.id),o=od(i),x=status(i),color=CITY_COLORS[i.city]||'#d9d2c6';
  const weather=i.weather?'<span class="pill blue">🌦 Weather</span>':'';
  const pass=i.passport?'<span class="pill">Passport</span>':'';
  const openTag=o?`<span class="pill ${x==='open'?'red':x==='soon'?'amber':''}">${x==='open'?'Opened':`Opens ${pretty(o)}`}${x==='soon'?` · ${openCountdown(i)}`:''}</span>`:'';
  const ticket=s.fileName?`<span class="pill green">📎 Ticket attached</span>`:'';
  return `<div class="card" style="--city:${color}">
    <div class="cardtop"><div><div class="title">${ico(i.type)} ${i.name}</div><div class="zh">${i.nameZh||''}</div><div class="meta">Day ${i.day} · ${pretty(i.date)} · ${i.time}</div></div>${pill(x)}</div>
    <div class="pills"><span class="pill">${i.city} · ${i.cityZh}</span>${i.price?`<span class="pill">${i.price}</span>`:''}${openTag}${weather}${pass}${ticket}</div>
    ${mini?'':`<div class="muted">${s.notes||i.notes||''}</div>`}
    ${i.bookable?`<div class="card-actions"><button class="${x==='open'&&!['booked','confirmed'].includes(s.status)?'primary':''} edit" data-id="${i.id}">${['booked','confirmed'].includes(s.status)?'Manage booking':'Manage / Mark booked'}</button></div>`:''}
  </div>`;
}
function dash(){
  let t=today(); $('#today').textContent=pretty(t);
  let d=daysUntil('2026-09-05');
  $('#countdown').textContent=d>1?`${d} days\nto trip`:d===1?'Tomorrow\ntrip starts':d===0?'Trip starts\ntoday':'Trip\nunderway';
  let B=ITINERARY.filter(i=>i.bookable),book=B.filter(i=>['booked','confirmed'].includes(st(i.id).status)).length,
      open=B.filter(i=>status(i)==='open'&&!['booked','confirmed'].includes(st(i.id).status)).length,
      soon=B.filter(i=>status(i)==='soon').length,files=B.filter(i=>st(i.id).fileName).length,
      missing=B.filter(i=>['booked','confirmed'].includes(st(i.id).status)&&!st(i.id).fileName).length;
  const pct=B.length?Math.round(book/B.length*100):0;
  $('#progressText').textContent=pct+'%'; $('#progressBar').style.width=pct+'%';
  $('#progressBooked').textContent=`${book} booked`; $('#progressRemaining').textContent=`${B.length-book} remaining`;
  $('#stats').innerHTML=[['Bookable',B.length],['Booked',book],['Open now',open],['Opening soon',soon],['Tickets',files],['Missing docs',missing]].map(x=>`<div class="stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('');
  let bt=B.filter(i=>status(i)==='open'&&!['booked','confirmed'].includes(st(i.id).status)).sort((a,b)=>(od(a)||'').localeCompare(od(b)||''));
  $('#bookToday').innerHTML=bt.length?bt.map(i=>card(i,true)).join(''):'<div class="empty">✓ Nothing new needs booking today.</div>';
  let sn=B.filter(i=>['soon','not_open'].includes(status(i))).sort((a,b)=>(od(a)||'9999').localeCompare(od(b)||'9999')).slice(0,8);
  $('#soon').innerHTML=sn.length?sn.map(i=>card(i,true)).join(''):'<div class="empty">No upcoming booking windows.</div>';
  let mt=B.filter(i=>['booked','confirmed'].includes(st(i.id).status)&&!st(i.id).fileName).sort((a,b)=>a.date.localeCompare(b.date));
  $('#missingTickets').innerHTML=mt.length?mt.slice(0,6).map(i=>card(i,true)).join(''):'<div class="empty">✓ No booked items are missing ticket files.</div>';
  wireCards();
}
function timeline(){
  let out='';
  for(let c of [...new Set(ITINERARY.map(i=>i.city))]){
    let a=ITINERARY.filter(i=>i.city===c).sort((x,y)=>x.date.localeCompare(y.date)),last=0;
    out+=`<div class="cityhead" style="background:${CITY_COLORS[c]||'#143a31'}"><span>${c}</span><span class="zh">${a[0].cityZh}</span></div>`;
    for(let i of a){
      if(i.day!==last){out+=`<div class="day-label">DAY ${i.day} — ${pretty(i.date)}</div>`;last=i.day}
      out+=`<div class="timeline"><div class="time">${i.time}</div><div><div class="title">${ico(i.type)} ${i.name}</div><div class="zh">${i.nameZh}</div><div class="meta">${i.price||''}${i.bookable?' · '+pill(status(i)):''}</div></div></div>`;
    }
  }
  $('#timelineList').innerHTML=out;
}
function bookings(){
  let q=$('#q').value.toLowerCase(),c=$('#city').value,sf=$('#statusFilter').value;
  let a=ITINERARY.filter(i=>i.bookable&&(!c||i.city===c)&&(!sf||status(i)===sf)&&(!q||(i.name+' '+i.nameZh+' '+i.city+' '+i.cityZh).toLowerCase().includes(q)))
    .sort((x,y)=>x.date.localeCompare(y.date)||String(x.time).localeCompare(String(y.time)));
  $('#bookingList').innerHTML=a.length?a.map(i=>card(i)).join(''):'<div class="empty">No matching bookings.</div>';
  wireCards();
}
function wireCards(){ $$('.edit').forEach(b=>b.onclick=()=>openDlg(b.dataset.id)); }
function openDlg(id){
  cur=id;let i=ITINERARY.find(x=>x.id===id),s=st(id);
  $('#dcity').textContent=i.city+' · '+i.cityZh; $('#dname').textContent=i.name; $('#dzh').textContent=i.nameZh;
  $('#status').value=s.status||'not_booked'; $('#price').value=s.price||''; $('#platform').value=s.platform||''; $('#confirm').value=s.confirm||'';
  $('#seat').value=s.seat||''; $('#openDate').value=s.openDate||s.manualOpenDate||''; $('#notes').value=s.notes||i.notes||''; $('#file').value=''; $('#dlg').showModal();
}
function odb(){return new Promise((r,j)=>{let q=indexedDB.open(DB,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('f'))q.result.createObjectStore('f')};q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)})}
async function put(id,f){let d=await odb();return new Promise((r,j)=>{let t=d.transaction('f','readwrite');t.objectStore('f').put(f,id);t.oncomplete=r;t.onerror=()=>j(t.error)})}
async function get(id){let d=await odb();return new Promise((r,j)=>{let q=d.transaction('f','readonly').objectStore('f').get(id);q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)})}
async function tickets(){
  let a=ITINERARY.filter(i=>st(i.id).fileName).sort((x,y)=>x.date.localeCompare(y.date));
  $('#ticketList').innerHTML=a.length?a.map(i=>`<div class="card ticket-card" style="--city:${CITY_COLORS[i.city]||'#d9d2c6'}"><div><div class="title">${ico(i.type)} ${i.name}</div><div class="zh">${i.nameZh}</div><div class="meta">${pretty(i.date)} · ${st(i.id).fileName}</div></div><button class="secondary view" data-id="${i.id}">View</button></div>`).join(''):'<div class="empty">No tickets uploaded yet. Add them from any booking card.</div>';
  $$('.view').forEach(b=>b.onclick=async()=>{let f=await get(b.dataset.id);if(f)window.open(URL.createObjectURL(f),'_blank')});
}
function cal(){
  let e=[];ITINERARY.filter(i=>i.bookable).forEach(i=>{if(od(i))e.push([od(i),'open',i]);e.push([i.date,'travel',i])});e.sort((a,b)=>a[0].localeCompare(b[0]));let g={};e.forEach(x=>(g[x[0]]??=[]).push(x));
  $('#calList').innerHTML=Object.entries(g).map(([d,a])=>`<div class="calendar-day"><div class="calendar-date">${pretty(d)}</div>${a.map(x=>`<div class="calendar-entry"><div class="meta">${x[1]==='open'?'🔴 Booking opens':'🔵 Travel / activity'} — <strong>${x[2].name}</strong></div><div class="zh">${x[2].nameZh}</div></div>`).join('')}</div>`).join('');
}
function all(){dash();timeline();bookings();tickets();cal()}
$('#form').onsubmit=async e=>{
  e.preventDefault();let s=st(cur);s.status=$('#status').value;s.price=$('#price').value;s.platform=$('#platform').value;s.confirm=$('#confirm').value;s.seat=$('#seat').value;s.openDate=$('#openDate').value;s.notes=$('#notes').value;
  let f=$('#file').files[0];if(f){await put(cur,f);s.fileName=f.name;s.fileType=f.type}s.updatedAt=new Date().toISOString();save();$('#dlg').close();all();
};
$('#close').onclick=()=>$('#dlg').close();
$('#markBooked').onclick=()=>{$('#status').value='booked'}; $('#markConfirmed').onclick=()=>{$('#status').value='confirmed'};
$('#ics').onclick=()=>{
  let i=ITINERARY.find(x=>x.id===cur),d=od(i);if(!d)return alert('Set a booking-open date first.');
  const ymd=d.replaceAll('-','');
  let txt=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//China Trip 2026//Booking Manager//EN\r\nBEGIN:VEVENT\r\nUID:${i.id}@china-trip-2026\r\nDTSTART;TZID=Asia/Shanghai:${ymd}T080000\r\nSUMMARY:BOOK TODAY — ${i.name}\r\nDESCRIPTION:${i.city} | Visit ${i.date} ${i.time} | ${i.notes||''}\r\nBEGIN:VALARM\r\nTRIGGER:-PT0M\r\nACTION:DISPLAY\r\nDESCRIPTION:Booking opens today — ${i.name}\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/calendar'}));a.download=i.id+'-booking-reminder.ics';a.click();
};
for(let c of [...new Set(ITINERARY.map(i=>i.city))]) $('#city').insertAdjacentHTML('beforeend',`<option>${c}</option>`);
$('#q').oninput=bookings; $('#city').onchange=bookings; $('#statusFilter').onchange=bookings;
$$('.bottom-nav button').forEach(b=>b.onclick=()=>{$$('.bottom-nav button').forEach(x=>x.classList.remove('on'));b.classList.add('on');$$('.view').forEach(x=>x.classList.remove('active'));$('#'+b.dataset.v).classList.add('active');if(b.dataset.v==='tickets')tickets()});
all();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
