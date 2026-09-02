(function(){
  'use strict';
  var a=window.ITINERARY||[],m={};a.forEach(function(i){m[i.id]=i;});
  function p(id,x){if(!m[id])return;Object.keys(x).forEach(function(k){m[id][k]=x[k];});}
  function add(x){if(!m[x.id]){a.push(x);m[x.id]=x;}}

  /* Booking / hotel locks already confirmed. */
  p('bj-hotel-yard',{defaultStatus:'booked',locked:true});
  p('i18',{defaultStatus:'booked',locked:true});
  p('i21',{defaultStatus:'booked',locked:true});
  p('i25',{defaultStatus:'booked',locked:true});
  p('i31',{start:'21:45',end:'00:15',defaultStatus:'booked',locked:true,price:'Booked',notes:'Booked 21:45 → 00:15 (+1).'});

  /* Add machine-readable start times so TODAY cannot skip important plans. */
  p('i1',{start:'10:25',type:'arrival',noLeave:true});
  p('i2',{start:'14:00',end:'16:00'});
  p('i3',{start:'16:00'});
  p('i8',{start:'20:29',locked:true});
  p('i14',{start:'08:25',end:'11:15'});
  p('i23',{start:'07:12',end:'14:13',locked:true});
  p('i26',{start:'19:15',end:'21:00'});
  p('i32',{start:'10:00',locked:true});
  p('i33',{start:'11:00',end:'12:30'});
  p('i34',{start:'12:35',end:'13:45'});
  p('i35',{time:'Late afternoon',start:'17:30',locked:true,notes:'Return early enough for the booked 20:00 Huangpu cruise.'});

  /* Current agreed Shanghai plan. */
  p('i40',{time:'Removed',name:'4DX / ScreenX — Old Plan',nameZh:'4DX / ScreenX — 旧方案',active:false,bookable:false,planStatus:'cancelled',price:'Removed',notes:'Removed from the current agreed plan.'});
  p('i41',{time:'09:00–11:00',start:'09:00',end:'11:00',name:'East Nanjing Road + Shanghai First Food Mall',nameZh:'南京东路 + 上海第一食品商店',locked:true,notes:'Final agreed morning shopping block.'});
  p('i42',{time:'After 13:00',start:'13:00',locked:true,notes:'Hotel → PVG after checkout/prep. Allow a conservative international-flight buffer.'});
  if(m['d15-ins'])p('d15-ins',{time:'Night · exact time TBD',start:'20:30',locked:false,notes:'Saturday-night plan. 20:30 is only a provisional ordering time in TODAY; exact entry time is not locked.'});

  /* Avoid duplicate Day 17 shopping item added by the first reconciliation pass. */
  if(m['d17-shopping'])m['d17-shopping'].active=false;
  add({id:'d17-flight-pvg-hkg',city:'Shanghai + Suzhou',cityZh:'上海 + 苏州',day:17,date:'2026-09-21',time:'16:55–19:45',start:'16:55',end:'19:45',name:'Shanghai PVG → Hong Kong',nameZh:'上海浦东 → 香港',type:'flight',bookable:true,priority:'critical',price:'Booked / verify',locked:true,notes:'International departure leg.'});
  add({id:'d17-flight-hkg-yvr',city:'Shanghai + Suzhou',cityZh:'上海 + 苏州',day:17,date:'2026-09-21',time:'22:55 → Vancouver',start:'22:55',name:'Hong Kong → Vancouver',nameZh:'香港 → 温哥华',type:'flight',bookable:true,priority:'critical',price:'Booked / verify',locked:true,notes:'Connection in Hong Kong; Vancouver arrival is Sep 21 local time.'});
  a.sort(function(x,y){return x.date.localeCompare(y.date)||Number(x.day||0)-Number(y.day||0)||String(x.start||x.time||'99:99').localeCompare(String(y.start||y.time||'99:99'));});

  try{
    var K='china-trip-2026-state',S=JSON.parse(localStorage.getItem(K)||'{}');
    ['bj-hotel-yard','i18','i21','i25','i31'].forEach(function(id){S[id]=S[id]||{};if(!S[id].status||S[id].status==='not_booked')S[id].status='booked';});
    ['i28','i39','i40'].forEach(function(id){S[id]=S[id]||{};S[id].status='cancelled';});
    localStorage.setItem(K,JSON.stringify(S));
  }catch(e){}
}());