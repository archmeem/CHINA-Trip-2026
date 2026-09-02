(function(){
  'use strict';
  var COLORS={'Beijing':'#7a1f2b','Xi’an':'#9a6b22','Chengdu':'#202522','Zhangjiajie':'#356655','Yangshuo':'#3f7f69','Shanghai + Suzhou':'#18345f'};
  function pretty(d){return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(d+'T00:00:00Z'));}
  function ico(t){return({train:'🚄',flight:'✈️',attraction:'🏯',show:'🎭',activity:'🛶',transfer:'🚕',restaurant:'🍽️',hotel:'🏨',shopping:'🛍️',tour:'🚌',area:'📍',arrival:'📍'})[t]||'📍';}
  function renderTrip(){
    var root=document.getElementById('timelineList');if(!root)return;
    var list=(window.ITINERARY||[]).filter(function(i){return i.active!==false;});
    var cities=[];list.forEach(function(i){if(cities.indexOf(i.city)<0)cities.push(i.city);});
    var out='';
    cities.forEach(function(c){
      var a=list.filter(function(i){return i.city===c;}).sort(function(x,y){return x.date.localeCompare(y.date)||Number(x.day)-Number(y.day)||String(x.start||x.time).localeCompare(String(y.start||y.time));});
      var last=0;out+='<div class="cityhead" style="background:'+(COLORS[c]||'#143a31')+'"><span>'+c+'</span><span class="zh">'+(a[0]&&a[0].cityZh||'')+'</span></div>';
      a.forEach(function(i){
        if(i.day!==last){out+='<div class="day-label">DAY '+i.day+' — '+pretty(i.date)+'</div>';last=i.day;}
        var tags=(i.optional?'<span class="pill blue">Optional</span>':'')+(i.pending?'<span class="pill amber">Pending</span>':'')+(i.locked?'<span class="pill green">Fixed</span>':'');
        out+='<div class="timeline"><div class="time">'+i.time+'</div><div><div class="title">'+ico(i.type)+' '+i.name+'</div><div class="zh">'+(i.nameZh||'')+'</div><div class="meta">'+(i.price||'')+' '+tags+'</div>'+(i.notes?'<div class="muted">'+i.notes+'</div>':'')+'</div></div>';
      });
    });
    root.innerHTML=out;
  }
  window.timeline=renderTrip;
  renderTrip();
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-v="timeline"]');if(b)setTimeout(renderTrip,0);});
}());
