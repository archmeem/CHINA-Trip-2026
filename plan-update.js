(function(){
  'use strict';
  var V='2026-09-01-evening-locks-v1';
  window.PLAN_VERSION=V;
  var byId={};(window.ITINERARY||[]).forEach(function(i){byId[i.id]=i;});
  function p(id,x){if(!byId[id])return;Object.keys(x).forEach(function(k){byId[id][k]=x[k];});}
  function add(x){if(!byId[x.id]){window.ITINERARY.push(x);byId[x.id]=x;}}

  p('i4',{name:'Open Dinner',nameZh:'晚餐自由安排',bookable:false,price:'Flexible',notes:'No fixed restaurant. Siji Minfu removed from the fixed plan.'});
  p('i5',{time:'07:10–~18:00',start:'07:10',defaultStatus:'booked',locked:true,notes:'Meet 07:10 at Exit E northwest of Dongsi subway station. Tour includes Mutianyu Great Wall → Summer Palace → Bird’s Nest + Water Cube at the end.'});
  p('i6',{optional:true,notes:'OPTIONAL depending on energy. Base plan is dinner + rest.'});
  p('i7',{time:'Evening',start:'17:30',name:'Tiananmen + Flag Lowering',nameZh:'天安门广场 + 降旗仪式',defaultStatus:'booked',optional:true,notes:'OPTIONAL because it conflicts with safe station timing. Reservation exists; skip if it risks the train.'});
  p('i8',{locked:true,notes:'20:29 overnight train. Train safety takes priority over optional evening activities.'});

  p('i9',{time:'11:30–Evening',start:'11:30',name:'GetYourGuide Xi’an Tour',nameZh:'西安一日游',type:'tour',locked:true,notes:'MASTER for Day 4: Terracotta Army → lunch → Xi’an City Wall → Great Wild Goose Pagoda → Muslim Quarter.'});
  p('i10',{time:'Tour sequence',name:'Great Wild Goose Pagoda',nameZh:'大雁塔',bookable:false,price:'Tour sequence',locked:true,notes:'KEEP as part of the GetYourGuide Day 4 tour.'});
  p('i11',{time:'Evening',locked:true,notes:'End of GetYourGuide tour / evening food walk.'});
  p('i12',{time:'11:25–14:30',start:'11:25',end:'14:30',locked:true,notes:'HSR Xi’an North → Chengdu East.'});
  p('i13',{time:'15:30–18:00',start:'15:30',end:'18:00',locked:true,notes:'Relaxed afternoon after Chengdu check-in.'});
  p('i15',{time:'12:10–13:35',start:'12:10',end:'13:35',locked:true});
  p('i16',{time:'16:00–18:00',start:'16:00',end:'18:00',locked:true});

  p('i17',{city:'Chengdu',cityZh:'成都',time:'11:35–13:00',start:'11:35',end:'13:00',name:'Chengdu → Zhangjiajie',nameZh:'成都 → 张家界',type:'flight',bookable:true,priority:'critical',price:'Booked',defaultStatus:'booked',locked:true,notes:'BOOKED / FIXED.'});
  p('i19',{time:'08:30–16:00',start:'08:30',end:'16:00',type:'tour',locked:true,notes:'Route inside the park is FLEXIBLE and will be set by the hotel/tour. Do not lock the internal sequence.'});
  p('i20',{time:'08:30–15:00',start:'08:30',end:'15:00',name:'Tianzi Mountain + Golden Whip Stream',nameZh:'天子山 + 金鞭溪',locked:true,notes:'KEEP according to the agreed Sep 13 plan.'});
  p('i22',{time:'10:00 entry',start:'10:00',defaultStatus:'booked',locked:true,notes:'Route A. Be at the entrance for 10:00 start.'});

  p('i24',{time:'After 14:13 if available',start:'14:30',name:'Guilin → Yangshuo by Li River Cruise',nameZh:'桂林 → 阳朔 漓江游船',type:'activity',price:'Pending availability',pending:true,optional:true,notes:'PREFERRED transfer if a suitable cruise ticket/service exists after train arrival. Otherwise use ground transfer.'});
  p('i27',{time:'09:00–12:00',start:'09:00',end:'12:00',locked:true,notes:'KEEP 09:00–12:00.'});
  p('i28',{time:'Cancelled',planStatus:'cancelled',active:false,price:'Cancelled',notes:'CANCELLED. Removed from active itinerary.'});
  p('i29',{time:'09:00–11:30',start:'09:00',end:'11:30',locked:true,notes:'KEEP 09:00–11:30.'});
  p('i30',{time:'14:00–17:00',start:'14:00',end:'17:00',locked:true,notes:'Ground transfer to Guilin Airport. Cruise preference applies to Sep 15 Guilin → Yangshuo, not this return.'});
  p('i36',{time:'20:00–21:00',start:'20:00',end:'21:00',price:'Booked',defaultStatus:'booked',locked:true,notes:'BOOKED / FIXED 20:00–21:00.'});
  p('i37',{time:'10:00–12:30',start:'10:00',end:'12:30',bookable:false,locked:true,notes:'Morning architecture / photos.'});
  p('i38',{time:'09:00–12:00',start:'09:00',end:'12:00',name:'Yu Garden + Yuyuan Bazaar',nameZh:'豫园 + 豫园商城',locked:true,notes:'Use the agreed Faizeh plan: full 09:00–12:00 block.'});
  p('i39',{time:'Removed',name:'SAGA — Old Plan',nameZh:'SAGA — 旧方案',planStatus:'cancelled',active:false,bookable:false,price:'Removed',notes:'Removed from the current plan.'});

  add({id:'d2-leave',city:'Beijing',cityZh:'北京',day:2,date:'2026-09-06',time:'06:25',start:'06:25',name:'Leave hotel for tour meeting point',nameZh:'从酒店前往集合点',type:'transfer',bookable:false,price:'Didi / taxi',locked:true,transport:'🚕',notes:'Target: Exit E northwest of Dongsi subway station. Be there by 07:10. 06:25 is buffered/provisional; verify exact hotel booking address.'});
  add({id:'d3-cctv',city:'Beijing',cityZh:'北京',day:3,date:'2026-09-07',time:'09:30',start:'09:30',name:'CCTV Headquarters — Exterior',nameZh:'中央电视台总部大楼（外观）',type:'attraction',bookable:false,price:'Free',locked:true,notes:'Architecture / exterior photos.'});
  add({id:'d3-qianmen',city:'Beijing',cityZh:'北京',day:3,date:'2026-09-07',time:'12:00–Afternoon',start:'12:00',end:'16:45',name:'Qianmen + Dashilan',nameZh:'前门 + 大栅栏',type:'area',bookable:false,price:'Free',locked:true,notes:'Stay in the area through the afternoon.'});
  add({id:'d3-station',city:'Beijing',cityZh:'北京',day:3,date:'2026-09-07',time:'Late afternoon',start:'17:30',name:'Return to hotel → Beijing West Station',nameZh:'返回酒店 → 北京西站',type:'transfer',bookable:false,price:'Taxi / Didi',locked:true,transport:'🚕',notes:'Train safety takes priority over the optional flag-lowering plan.'});
  add({id:'d4-wall',city:'Xi’an',cityZh:'西安',day:4,date:'2026-09-08',time:'Tour sequence',name:'Xi’an City Wall',nameZh:'西安城墙',type:'attraction',bookable:false,price:'Tour sequence',locked:true,notes:'Follow GetYourGuide tour timing.'});
  add({id:'d5-leave',city:'Xi’an',cityZh:'西安',day:5,date:'2026-09-09',time:'09:00',start:'09:00',name:'Leave hotel for Xi’an North Station',nameZh:'从酒店前往西安北站',type:'transfer',bookable:false,price:'Taxi / Didi',locked:true,notes:'Agreed hotel departure time.'});
  add({id:'d5-twin',city:'Chengdu',cityZh:'成都',day:5,date:'2026-09-09',time:'19:00–21:00',start:'19:00',end:'21:00',name:'Tianfu Twin Towers',nameZh:'天府双塔',type:'attraction',bookable:false,price:'Free exterior / area',locked:true,notes:'Moved to first Chengdu night. KEEP.'});
  add({id:'d6-jinli',city:'Chengdu',cityZh:'成都',day:6,date:'2026-09-10',time:'13:35–15:05',start:'13:35',end:'15:05',name:'Jinli Ancient Street',nameZh:'锦里古街',type:'area',bookable:true,priority:'recommended',price:'Ticket/booking held',defaultStatus:'booked',locked:true,notes:'KEEP. Expanded to 1.5 hours; ticket/booking already obtained.'});
  add({id:'d7-transfer',city:'Zhangjiajie',cityZh:'张家界',day:7,date:'2026-09-11',time:'13:00–14:00',start:'13:00',end:'14:00',name:'Airport → PeakMist Retreat',nameZh:'机场 → PeakMist Retreat',type:'transfer',bookable:false,price:'Didi / taxi',transport:'🚕',notes:'Transfer after booked flight.'});
  add({id:'d7-rest',city:'Zhangjiajie',cityZh:'张家界',day:7,date:'2026-09-11',time:'14:00–18:00',start:'14:00',end:'18:00',name:'Hotel + Rest',nameZh:'酒店休息',type:'area',bookable:false,price:'—',notes:'Light afternoon.'});
  add({id:'d10-checkout',city:'Zhangjiajie',cityZh:'张家界',day:10,date:'2026-09-14',time:'08:00',start:'08:00',name:'Check out PeakMist',nameZh:'退房',type:'hotel',bookable:false,price:'—',locked:true,notes:'08:00 checkout, then city/luggage transfer before Tianmen.'});
  add({id:'d11-ground',city:'Yangshuo',cityZh:'阳朔',day:11,date:'2026-09-15',time:'Fallback',name:'Guilin North → Yangshuo by road',nameZh:'桂林北 → 阳朔（陆路备选）',type:'transfer',bookable:false,price:'Didi / pre-arranged',optional:true,notes:'Fallback if the Li River cruise timing does not work.'});
  add({id:'d12-rest',city:'Yangshuo',cityZh:'阳朔',day:12,date:'2026-09-16',time:'12:00–15:00',start:'12:00',end:'15:00',name:'Resort Rest',nameZh:'酒店休息',type:'area',bookable:false,price:'—',notes:'Recovery block.'});
  add({id:'d12-sunset',city:'Yangshuo',cityZh:'阳朔',day:12,date:'2026-09-16',time:'17:00–18:30',start:'17:00',end:'18:30',name:'Yulong River / Gongnong Bridge Sunset',nameZh:'遇龙河 / 工农桥日落',type:'area',bookable:false,price:'Free',locked:true,notes:'Moved from Sep 15 to Sep 16 evening.'});
  add({id:'d12-beerfish',city:'Yangshuo',cityZh:'阳朔',day:12,date:'2026-09-16',time:'18:30–20:00',start:'18:30',end:'20:00',name:'Beer Fish Dinner',nameZh:'啤酒鱼晚餐',type:'restaurant',bookable:false,price:'Walk-in',notes:'Dinner before West Street.'});
  add({id:'d12-west',city:'Yangshuo',cityZh:'阳朔',day:12,date:'2026-09-16',time:'20:00 onward',start:'20:00',name:'West Street',nameZh:'西街',type:'area',bookable:false,price:'Free',locked:true,notes:'Start at 20:00.'});
  add({id:'d15-parkson',city:'Shanghai + Suzhou',cityZh:'上海 + 苏州',day:15,date:'2026-09-19',time:'13:00–17:00',start:'13:00',end:'17:00',name:'Parkson Youke — Value Shopping',nameZh:'百盛优客城市广场',type:'shopping',bookable:false,price:'Shopping',locked:true,notes:'Final agreed shopping block: 13:00–17:00.'});
  add({id:'d15-rest',city:'Shanghai + Suzhou',cityZh:'上海 + 苏州',day:15,date:'2026-09-19',time:'17:00–Evening',start:'17:00',name:'Hotel Rest + Dinner',nameZh:'酒店休息 + 晚餐',type:'area',bookable:false,price:'Flexible',notes:'Drop shopping and prepare for INS.'});
  add({id:'d15-ins',city:'Shanghai + Suzhou',cityZh:'上海 + 苏州',day:15,date:'2026-09-19',time:'Night',start:'20:30',name:'INS — Saturday Night',nameZh:'INS 新乐园（周六夜间）',type:'activity',bookable:false,price:'Verify entry / venue rules',locked:true,notes:'Night plan, not afternoon.'});
  add({id:'d16-french',city:'Shanghai + Suzhou',cityZh:'上海 + 苏州',day:16,date:'2026-09-20',time:'13:30–18:00',start:'13:30',end:'18:00',name:'Former French Concession',nameZh:'上海法租界历史街区',type:'area',bookable:false,price:'Free',locked:true,notes:'Xintiandi → Wukang Road → Anfu Road.'});
  add({id:'d17-shopping',city:'Shanghai + Suzhou',cityZh:'上海 + 苏州',day:17,date:'2026-09-21',time:'09:00–11:00',start:'09:00',end:'11:00',name:'East Nanjing Road + Shanghai First Food Mall',nameZh:'南京东路 + 上海第一食品商店',type:'shopping',bookable:false,price:'Shopping',locked:true,notes:'Final agreed morning block.'});
  add({id:'d17-prep',city:'Shanghai + Suzhou',cityZh:'上海 + 苏州',day:17,date:'2026-09-21',time:'11:00–13:00',start:'11:00',end:'13:00',name:'Departure Prep + Hotel Checkout',nameZh:'出发准备 + 退房',type:'hotel',bookable:false,price:'—',locked:true,notes:'Pack, checkout and start airport plan.'});

  window.ITINERARY.sort(function(a,b){return a.date.localeCompare(b.date)||Number(a.day||0)-Number(b.day||0)||String(a.start||a.time||'99:99').localeCompare(String(b.start||b.time||'99:99'));});

  /* One-time booking-state reconciliation for decisions explicitly confirmed on Sep 1. */
  try{
    var KEY='china-trip-2026-state',S=JSON.parse(localStorage.getItem(KEY)||'{}');
    var prior=S.__planVersion;
    if(prior!==V){
      window.ITINERARY.forEach(function(i){
        if(i.planStatus==='cancelled'){
          S[i.id]=S[i.id]||{};S[i.id].status='cancelled';S[i.id].updatedAt=new Date().toISOString();
        }else if(i.defaultStatus&&(!S[i.id]||!S[i.id].status||S[i.id].status==='not_booked')){
          S[i.id]=S[i.id]||{};S[i.id].status=i.defaultStatus;S[i.id].updatedAt=new Date().toISOString();
        }
      });
      S.__planVersion=V;localStorage.setItem(KEY,JSON.stringify(S));
    }
  }catch(e){console.warn('Plan migration skipped',e);}
}());
