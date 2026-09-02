(function(){
  'use strict';
  var RUN_KEY='china-trip-2026-daily-state';
  var CHINA_TZ='Asia/Shanghai';
  var run={};try{run=JSON.parse(localStorage.getItem(RUN_KEY)||'{}');}catch(e){run={};}
  function saveRun(){localStorage.setItem(RUN_KEY,JSON.stringify(run));}
  function chinaParts(){
    var p=new Intl.DateTimeFormat('en-CA',{timeZone:CHINA_TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
    var o={};p.forEach(function(x){if(x.type!=='literal')o[x.type]=x.value;});
    return {date:o.year+'-'+o.month+'-'+o.day,mins:Number(o.hour)*60+Number(o.minute),clock:o.hour+':'+o.minute};
  }
  function min(s){if(!s||!/^[0-2]?\d:[0-5]\d$/.test(s))return null;var a=s.split(':').map(Number);return a[0]*60+a[1];}
  function hm(m){m=(m+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
  function icon(t){return({train:'🚄',flight:'✈️',attraction:'🏯',show:'🎭',activity:'🛶',transfer:'🚕',restaurant:'🍽️',hotel:'🏨',shopping:'🛍️',tour:'🚌',area:'🚶',arrival:'📍'})[t]||'📍';}
  function cityTheme(c){return({'Beijing':'beijing','Xi’an':'xian','Chengdu':'chengdu','Zhangjiajie':'zhangjiajie','Yangshuo':'yangshuo','Shanghai + Suzhou':'shanghai'})[c]||'beijing';}
  function activeItems(){return (window.ITINERARY||[]).filter(function(i){return i.active!==false;});}
  function dayItems(date){return activeItems().filter(function(i){return i.date===date;}).sort(function(a,b){var am=min(a.start)||9999,bm=min(b.start)||9999;return am-bm||String(a.time).localeCompare(String(b.time));});}
  function currentTripDay(date){var a=activeItems().filter(function(i){return i.date===date;});return a.length?a[0].day:null;}
  function travelBuffer(i){if(i.leaveBuffer!=null)return i.leaveBuffer;if(i.type==='flight')return 150;if(i.type==='train')return 90;if(i.type==='tour')return 35;if(i.type==='attraction'||i.type==='activity')return 30;if(i.type==='transfer')return 10;return 20;}
  function leaveBy(i){var m=min(i.start);return m==null?'—':hm(m-travelBuffer(i));}
  function stateFor(i){return run[i.id]||{};}
  function statusPill(i){var s=stateFor(i);if(s.skipped)return '<span class="today-pill muted-pill">Skipped</span>';if(s.done)return '<span class="today-pill done-pill">Done</span>';if(i.optional)return '<span class="today-pill optional-pill">Optional</span>';if(i.pending)return '<span class="today-pill pending-pill">Pending</span>';if(i.locked)return '<span class="today-pill lock-pill">Fixed</span>';return '';}
  function chooseNow(a,now){
    var usable=a.filter(function(i){return min(i.start)!=null&&!stateFor(i).skipped;});
    if(!usable.length)return {now:a[0]||null,next:a[1]||null};
    var idx=-1;for(var k=0;k<usable.length;k++){if(min(usable[k].start)<=now)idx=k;}
    if(idx<0)return {now:null,next:usable[0]};
    return {now:usable[idx],next:usable[idx+1]||null};
  }
  function stage(next,nowItem,mins){
    if(next){var d=min(next.start)-mins;if(d>60)return 'READY';if(d>15)return 'PREPARE';if(d>=0)return 'LEAVE SOON';}
    if(nowItem)return 'NOW';return 'WRAP UP';
  }
  function actionButtons(i){if(!i)return '';
    return '<div class="today-actions">'+
      '<button class="ta done" data-act="done" data-id="'+i.id+'">✓ Done</button>'+
      '<button class="ta" data-act="skip" data-id="'+i.id+'">Skip</button>'+
      '<button class="ta late" data-act="late" data-id="'+i.id+'">Running Late</button>'+
      '</div>';
  }
  function driverButtons(i){if(!i)return '';
    var q=encodeURIComponent(i.nameZh||i.name);
    return '<div class="quick-strip"><button class="driver-btn" data-driver="'+i.id+'">🇨🇳 SHOW TO DRIVER</button><button class="copy-btn" data-copy="'+i.id+'">Copy 中文</button><a class="amap-btn" href="https://uri.amap.com/search?keyword='+q+'" target="_blank" rel="noopener">Amap ↗</a></div>';
  }
  function mainCard(i,label,nowM){if(!i)return '<div class="assistant-empty">No timed item here.</div>';
    var sm=min(i.start),delta=sm==null?null:sm-nowM;
    return '<article class="focus-card">'+
      '<div class="focus-kicker">'+label+' '+statusPill(i)+'</div>'+
      '<div class="focus-main"><div class="focus-icon">'+icon(i.type)+'</div><div><h2>'+i.name+'</h2><div class="focus-zh">'+(i.nameZh||'')+'</div></div></div>'+
      '<div class="focus-grid"><div><small>TIME</small><b>'+i.time+'</b></div><div><small>LEAVE BY</small><b>'+leaveBy(i)+'</b></div><div><small>TRANSPORT</small><b>'+(i.transport||icon(i.type))+'</b></div></div>'+
      (i.notes?'<p class="focus-note">'+i.notes+'</p>':'')+
      driverButtons(i)+actionButtons(i)+
      '</article>';
  }
  function timeline(a,nowM){return a.map(function(i){var s=stateFor(i),m=min(i.start),past=m!=null&&m<nowM;return '<div class="day-row '+(s.done?'is-done ':'')+(s.skipped?'is-skip ':'')+(past?'is-past ':'')+'"><div class="day-time">'+i.time+'</div><div class="day-dot">'+icon(i.type)+'</div><div class="day-copy"><strong>'+i.name+'</strong><span>'+(i.nameZh||'')+'</span></div>'+statusPill(i)+'</div>';}).join('');}
  function tomorrow(date){var d=new Date(date+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+1);var ds=d.toISOString().slice(0,10),a=dayItems(ds),first=a.find(function(i){return min(i.start)!=null;});if(!a.length)return '';
    return '<div class="tomorrow-card"><div class="tiny-label">TOMORROW BRIEF</div><h3>Day '+a[0].day+' · '+a[0].city+' <span>'+a[0].cityZh+'</span></h3><div class="tomorrow-grid"><div><small>FIRST PLAN</small><b>'+(first?first.time:'Flexible')+'</b></div><div><small>LEAVE BY</small><b>'+(first?leaveBy(first):'—')+'</b></div><div><small>FIXED ITEMS</small><b>'+a.filter(function(i){return i.locked;}).length+'</b></div></div></div>';
  }
  function preTrip(date){var first='2026-09-05';if(date<first)return '<div class="pretrip"><div class="tiny-label">UP NEXT</div><h2>China starts Sep 5</h2><p>Your final itinerary and booking list are synced to the Sep 1 decisions. Today view will switch automatically when the trip starts.</p></div>';return ''}
  function render(){
    var host=document.getElementById('dailyAssistant');if(!host)return;
    var cp=chinaParts(),a=dayItems(cp.date),day=currentTripDay(cp.date);
    if(!a.length){host.innerHTML=preTrip(cp.date)||'<div class="pretrip"><div class="tiny-label">TRIP STATUS</div><h2>China Trip complete</h2><p>The full itinerary remains available under Trip.</p></div>';return;}
    var pick=chooseNow(a,cp.mins),stg=stage(pick.next,pick.now,cp.mins),city=a[0].city;
    host.className='daily-assistant theme-'+cityTheme(city)+(run.travelMode?' travel-mode':'');
    var focus=pick.now||pick.next;
    var next=pick.now?pick.next:(pick.next&&a[a.indexOf(pick.next)+1]);
    var lateNote=run.lateAt&&Date.now()-run.lateAt<6*3600000?'<div class="late-banner">⚠ Running late mode: protect fixed transport first; optional items can be skipped.</div>':'';
    host.innerHTML='<div class="assistant-hero"><div><div class="tiny-label">DAY '+day+' · '+cp.date+' · CHINA TIME '+cp.clock+'</div><h1>'+city+' <span>'+a[0].cityZh+'</span></h1><div class="stage-chip">'+stg+'</div></div><button id="travelMode" class="travel-toggle">'+(run.travelMode?'Exit Travel Mode':'Travel Mode')+'</button></div>'+lateNote+
      '<div class="now-next"><div>'+mainCard(focus,pick.now?'NOW':'NEXT',cp.mins)+'</div>'+(next?'<div class="next-mini"><div class="tiny-label">NEXT</div><div class="next-line"><span>'+icon(next.type)+'</span><div><strong>'+next.name+'</strong><small>'+next.time+' · leave '+leaveBy(next)+'</small></div></div></div>':'')+'</div>'+ 
      '<div class="day-section"><div class="day-section-head"><h3>Today Timeline</h3><span>'+a.length+' items</span></div>'+timeline(a,cp.mins)+'</div>'+tomorrow(cp.date);
    wire();
  }
  function wire(){
    var tm=document.getElementById('travelMode');if(tm)tm.onclick=function(){run.travelMode=!run.travelMode;saveRun();render();};
    document.querySelectorAll('[data-act]').forEach(function(b){b.onclick=function(){var id=b.dataset.id,act=b.dataset.act;run[id]=run[id]||{};if(act==='done'){run[id].done=!run[id].done;run[id].skipped=false;}if(act==='skip'){run[id].skipped=!run[id].skipped;run[id].done=false;}if(act==='late'){run.lateAt=Date.now();}saveRun();render();};});
    document.querySelectorAll('[data-driver]').forEach(function(b){b.onclick=function(){var i=ITINERARY.find(function(x){return x.id===b.dataset.driver;});if(!i)return;var old=document.getElementById('driverSheet');if(old)old.remove();var d=document.createElement('div');d.id='driverSheet';d.className='driver-sheet';d.innerHTML='<button class="driver-close">×</button><div class="driver-label">请带我去 / PLEASE TAKE ME TO</div><div class="driver-zh">'+(i.nameZh||i.name)+'</div><div class="driver-en">'+i.name+'</div>'+(i.notes?'<div class="driver-note">'+i.notes+'</div>':'');document.body.appendChild(d);d.querySelector('.driver-close').onclick=function(){d.remove();};};});
    document.querySelectorAll('[data-copy]').forEach(function(b){b.onclick=function(){var i=ITINERARY.find(function(x){return x.id===b.dataset.copy;});if(!i)return;navigator.clipboard&&navigator.clipboard.writeText(i.nameZh||i.name);b.textContent='Copied ✓';setTimeout(function(){b.textContent='Copy 中文';},1200);};});
  }
  function setupHome(){
    var dash=document.getElementById('dashboard');if(!dash)return;
    Array.prototype.slice.call(dash.children).forEach(function(x){x.classList.add('legacy-dashboard');});
    var host=document.createElement('div');host.id='dailyAssistant';host.className='daily-assistant';dash.insertBefore(host,dash.firstChild);render();
  }
  function setupNav(){
    var nav=document.querySelector('.bottom-nav');if(!nav)return;
    if(!document.getElementById('more')){var more=document.createElement('section');more.id='more';more.className='view';more.innerHTML='<div class="page-head"><div><div class="eyebrow">MORE</div><h2>Trip Tools</h2><p>Reservations and booking deadlines.</p></div></div><div class="more-grid"><button data-open-view="bookings"><b>✓</b><span>Bookings</span><small>Manage reservations & status</small></button><button data-open-view="calendar"><b>◫</b><span>Booking Calendar</span><small>Opening dates & deadlines</small></button></div>';document.querySelector('main').appendChild(more);}
    nav.innerHTML='<button data-v="dashboard" class="on"><b>◉</b><span>Today</span></button><button data-v="timeline"><b>🗓</b><span>Trip</span></button><button data-v="tickets"><b>🎟</b><span>Tickets</span></button><button data-v="checklist"><b>✓</b><span>Checklist</span></button><button data-v="more"><b>•••</b><span>More</span></button>';
    function go(id,navId){document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});var x=document.getElementById(id);if(x)x.classList.add('active');nav.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.dataset.v===(navId||id));});if(id==='tickets'&&window.tickets)tickets();window.scrollTo(0,0);}
    nav.querySelectorAll('button').forEach(function(b){b.onclick=function(){go(b.dataset.v);};});
    document.querySelectorAll('[data-open-view]').forEach(function(b){b.onclick=function(){go(b.dataset.openView,'more');};});
  }
  function setupHeader(){var h=document.querySelector('.topbar h1');if(h)h.textContent='China Trip Assistant';var p=document.querySelector('.topbar p');if(p)p.textContent='Sep 5–21 · Offline-ready';}
  setupHeader();setupHome();setupNav();
  setInterval(render,60000);
}());
