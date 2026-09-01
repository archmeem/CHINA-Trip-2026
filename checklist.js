(() => {
  const PRIORITY = {
    urgent: ['Urgent', 'red', 0],
    before: ['Before Departure', 'amber', 1],
    pack: ['Pack', 'blue', 2],
    optional: ['Optional', '', 3],
    notnecessary: ['Not Necessary', '', 4]
  };
  const TIMELINE = {
    today: ['Today', 0],
    '2-3': ['2–3 Days Before', 1],
    daybefore: ['Day Before', 2],
    departure: ['Departure Day', 3]
  };
  const CATEGORIES = [
    'Documents & Travel','Money & Payment','Phone & Internet','Electronics',
    'Clothing & Packing','Toiletries','Medication & Health','Before Leaving Home'
  ];

  const DEFAULTS = [
    ['passports','Passports','Documents & Travel','urgent','today','Both'],
    ['flights','Flight confirmations','Documents & Travel','urgent','today','Both'],
    ['hotels','Hotel reservations','Documents & Travel','before','today','Both'],
    ['trains','Train tickets','Documents & Travel','before','today','Both'],
    ['attractions','Attraction tickets','Documents & Travel','before','2-3','Both'],
    ['insurance','Travel insurance','Documents & Travel','urgent','today','Both'],
    ['emergency','Emergency contact information','Documents & Travel','before','2-3','Both'],
    ['doc-copies','Offline copies/screenshots of important documents','Documents & Travel','before','2-3','Both'],
    ['china-entry','Check China entry requirements / arrival forms','Documents & Travel','urgent','today','Both'],

    ['credit-cards','Credit cards','Money & Payment','pack','daybefore','Both'],
    ['debit-card','Debit card','Money & Payment','pack','daybefore','Both'],
    ['cash','Emergency cash','Money & Payment','before','2-3','Both'],
    ['alipay','Alipay setup','Money & Payment','urgent','today','Both'],
    ['wechat-pay','WeChat Pay setup','Money & Payment','urgent','today','Both'],
    ['foreign-pay','Confirm cards work for foreign transactions','Money & Payment','before','today','Both'],
    ['backup-pay','Backup payment method','Money & Payment','before','2-3','Both'],

    ['esim','eSIM / roaming ready','Phone & Internet','urgent','today','Both'],
    ['vpn','VPN ready if needed','Phone & Internet','before','2-3','Both'],
    ['offline-maps','Offline maps downloaded where useful','Phone & Internet','before','2-3','Both'],
    ['china-map','Chinese map/navigation app','Phone & Internet','before','2-3','Both'],
    ['didi','Didi installed and ready','Phone & Internet','before','2-3','Both'],
    ['translate','Translation app + offline language pack','Phone & Internet','before','2-3','Both'],
    ['airline-apps','Airline apps','Phone & Internet','before','2-3','Both'],
    ['booking-apps','Train / booking apps','Phone & Internet','before','2-3','Both'],
    ['offline-confirmations','Important confirmations available offline','Phone & Internet','before','daybefore','Both'],

    ['phones','2 phones','Electronics','pack','daybefore','Both'],
    ['phone-cables','Phone charging cables','Electronics','pack','daybefore','Both'],
    ['adapters','China power adapters','Electronics','urgent','today','Both'],
    ['power-bank','Power bank','Electronics','pack','daybefore','Both'],
    ['headphones','Headphones','Electronics','pack','daybefore','Me'],
    ['camera','Camera / gimbal','Electronics','pack','daybefore','Me'],
    ['extra-cables','Required charging cables','Electronics','pack','daybefore','Both'],

    ['shirts','Shirts / T-shirts','Clothing & Packing','pack','2-3','Both'],
    ['pants','Pants','Clothing & Packing','pack','2-3','Both'],
    ['underwear','Underwear','Clothing & Packing','pack','2-3','Both'],
    ['socks','Socks','Clothing & Packing','pack','2-3','Both'],
    ['light-jacket','Light jacket','Clothing & Packing','pack','2-3','Both'],
    ['rain','Compact rain protection','Clothing & Packing','pack','2-3','Both'],
    ['sleepwear','Sleepwear','Clothing & Packing','pack','2-3','Both'],
    ['shoes','Maximum 2 pairs of shoes','Clothing & Packing','pack','2-3','Both'],
    ['sunglasses','Sunglasses','Clothing & Packing','pack','daybefore','Both'],
    ['hat','Hat if useful','Clothing & Packing','optional','daybefore','Both'],
    ['day-bag','Small day bag','Clothing & Packing','pack','2-3','Both'],

    ['toothbrush','Toothbrush + toothpaste','Toiletries','pack','2-3','Both'],
    ['deodorant','Deodorant','Toiletries','pack','2-3','Both'],
    ['skin-care','Compact skincare / sunscreen','Toiletries','pack','2-3','Both'],
    ['razor','Razor / grooming essentials','Toiletries','pack','2-3','Me'],
    ['liquids','Carry-on liquids within airline limits','Toiletries','before','daybefore','Both'],

    ['regular-meds','Regular medication','Medication & Health','urgent','today','Both'],
    ['pantoprazole','Pantoprazole','Medication & Health','pack','daybefore','Me'],
    ['melatonin','Melatonin','Medication & Health','optional','daybefore','Me'],
    ['basic-meds','Basic travel medication','Medication & Health','pack','2-3','Both'],
    ['medical-docs','Prescription / medical documentation when appropriate','Medication & Health','before','2-3','Both'],

    ['charge-devices','Charge all devices','Before Leaving Home','urgent','daybefore','Both'],
    ['download-docs','Download final offline documents','Before Leaving Home','urgent','daybefore','Both'],
    ['flight-status','Check flight status','Before Leaving Home','urgent','departure','Both'],
    ['check-in','Complete online check-in','Before Leaving Home','urgent','daybefore','Both'],
    ['weather','Check destination weather','Before Leaving Home','before','daybefore','Both'],
    ['garbage','Empty garbage','Before Leaving Home','before','departure','Both'],
    ['windows','Check windows and doors','Before Leaving Home','urgent','departure','Both'],
    ['appliances','Turn off unnecessary appliances','Before Leaving Home','before','departure','Both'],
    ['final-check','Final passport / wallet / phone check','Before Leaving Home','urgent','departure','Both']
  ].map(x => ({id:x[0], title:x[1], category:x[2], priority:x[3], timeline:x[4], assignee:x[5], custom:false}));

  function state(){
    if (!S.__checklist || typeof S.__checklist !== 'object') S.__checklist = {items:{}, custom:[], filter:'All', mode:'list'};
    S.__checklist.items ||= {};
    S.__checklist.custom ||= [];
    return S.__checklist;
  }
  function merged(item){ return {...item, ...(state().items[item.id] || {})}; }
  function allItems(){ return [...DEFAULTS, ...state().custom].map(merged).filter(x => !x.deleted); }
  function persist(){ save(); renderChecklist(); }
  function esc(s=''){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function priorityRank(i){ return (PRIORITY[i.priority] || PRIORITY.notnecessary)[2]; }
  function itemSort(a,b){
    const pa=priorityRank(a), pb=priorityRank(b);
    const ta=(TIMELINE[a.timeline] || TIMELINE.today)[1], tb=(TIMELINE[b.timeline] || TIMELINE.today)[1];
    return pa-pb || ta-tb || a.title.localeCompare(b.title);
  }

  function injectUI(){
    if (!document.getElementById('checklist')) {
      const sec = document.createElement('section');
      sec.id = 'checklist'; sec.className = 'view';
      sec.innerHTML = '<div id="checklistRoot"></div>';
      document.querySelector('main').appendChild(sec);
    }
    if (!document.querySelector('.bottom-nav [data-v="checklist"]')) {
      const btn = document.createElement('button');
      btn.dataset.v='checklist'; btn.innerHTML='<b>☑</b><span>Checklist</span>';
      document.querySelector('.bottom-nav').appendChild(btn);
      btn.onclick=()=>{
        document.querySelectorAll('.bottom-nav button').forEach(x=>x.classList.remove('on'));
        btn.classList.add('on');
        document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
        document.getElementById('checklist').classList.add('active');
        renderChecklist();
      };
    }
    if (!document.getElementById('checklistDlg')) {
      const d=document.createElement('dialog'); d.id='checklistDlg';
      d.innerHTML=`<form id="checklistForm">
        <div class="dialog-top"><div><div class="eyebrow">TRAVEL CHECKLIST</div><h2 id="clFormTitle">Add item</h2></div><button class="close-btn" type="button" id="clClose">×</button></div>
        <input type="hidden" id="clId">
        <label>Item<input id="clTitle" required maxlength="100"></label>
        <div class="grid">
          <label>Category<select id="clCategory">${CATEGORIES.map(c=>`<option>${c}</option>`).join('')}</select></label>
          <label>Priority<select id="clPriority"><option value="urgent">Urgent</option><option value="before">Before Departure</option><option value="pack">Pack</option><option value="optional">Optional</option><option value="notnecessary">Not Necessary</option></select></label>
          <label>Preparation timeline<select id="clTimeline"><option value="today">Today</option><option value="2-3">2–3 Days Before</option><option value="daybefore">Day Before</option><option value="departure">Departure Day</option></select></label>
          <label>Assigned to<select id="clAssignee"><option>Me</option><option>Faezeh</option><option>Both</option></select></label>
        </div>
        <div class="cl-form-actions"><button type="button" class="cl-delete" id="clDelete">Delete</button><button class="primary">Save item</button></div>
      </form>`;
      document.body.appendChild(d);
      d.querySelector('#clClose').onclick=()=>d.close();
      d.querySelector('#checklistForm').onsubmit=e=>{e.preventDefault(); saveItem();};
      d.querySelector('#clDelete').onclick=deleteItem;
    }
    injectStyles();
  }

  function injectStyles(){
    if(document.getElementById('checklistStyles')) return;
    const s=document.createElement('style'); s.id='checklistStyles';
    s.textContent=`
      .bottom-nav{grid-template-columns:repeat(6,1fr)}
      .cl-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin:4px 1px 12px}.cl-head h2{font-size:28px;margin:2px 0;letter-spacing:-.035em}.cl-head p{margin:3px 0 0;color:var(--muted);font-size:12px}.cl-add{white-space:nowrap;background:var(--green);color:white}
      .cl-readiness{background:linear-gradient(135deg,#143a31,#245247);color:white;border-radius:22px;padding:17px;margin-bottom:12px}.cl-readiness-top{display:flex;justify-content:space-between;align-items:end}.cl-readiness-top b{font-size:12px;letter-spacing:.08em}.cl-percent{font-size:30px;font-weight:900}.cl-readiness .progress-track{background:rgba(255,255,255,.18)}.cl-readiness .progress-track div{background:#fff}.cl-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:11px}.cl-metric{background:rgba(255,255,255,.1);border-radius:12px;padding:9px}.cl-metric b{display:block;font-size:17px}.cl-metric span{font-size:9px;opacity:.8;text-transform:uppercase}
      .cl-tabs,.cl-filter{display:flex;gap:6px;overflow:auto;padding-bottom:2px}.cl-tabs{margin:10px 0}.cl-tabs button,.cl-filter button{white-space:nowrap;padding:8px 10px;font-size:10.5px}.cl-tabs .on,.cl-filter .on{background:var(--green);color:white}.cl-filter{margin:8px 0 16px}
      .cl-next{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:14px;margin-bottom:16px}.cl-next h3{margin:0 0 8px;font-size:16px}.cl-next-row{display:flex;gap:10px;align-items:center;padding:8px 0;border-top:1px solid var(--line)}.cl-next-row:first-of-type{border-top:0}.cl-next-num{width:24px;height:24px;display:grid;place-items:center;border-radius:50%;background:#e5ece8;font-size:10px;font-weight:900;flex:0 0 auto}.cl-next-row strong{font-size:12px}.cl-next-row small{display:block;color:var(--muted);margin-top:2px}
      .cl-category{margin:18px 0 8px;font-size:11px;font-weight:900;letter-spacing:.06em;color:var(--green2);text-transform:uppercase}.cl-item{display:grid;grid-template-columns:28px 1fr auto;gap:9px;align-items:start;background:var(--card);border:1px solid var(--line);border-radius:15px;padding:11px;margin-bottom:7px}.cl-item.done{opacity:.55}.cl-item.done .cl-title{text-decoration:line-through}.cl-check{appearance:none;width:22px;height:22px;margin:1px 0 0;border:2px solid #aeb9b3;border-radius:7px;background:white;display:grid;place-items:center}.cl-check:checked{background:var(--green);border-color:var(--green)}.cl-check:checked:after{content:'✓';color:white;font-weight:900;font-size:14px}.cl-title{font-size:13px;font-weight:850}.cl-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}.cl-edit{padding:6px 8px;font-size:10px;background:#efebe3}.cl-assignee{font-size:9.5px;font-weight:800;color:#60796f}.cl-timeline-block{margin:0 0 18px}.cl-timeline-head{position:sticky;top:86px;z-index:3;background:var(--bg);padding:11px 2px 6px;font-size:14px;font-weight:900}.cl-form-actions{display:grid;grid-template-columns:1fr 2fr;gap:8px;margin-top:14px}.cl-delete{background:var(--redbg);color:var(--red)}#checklistForm{padding:18px}#checklistForm>label{margin-top:12px}
      @media(max-width:430px){.bottom-nav button span{font-size:8.5px}.bottom-nav button b{font-size:16px}.cl-head{align-items:center}.cl-add{padding:9px}.cl-metrics{grid-template-columns:repeat(3,1fr)}.cl-metric{padding:8px 6px}.cl-item{grid-template-columns:27px 1fr auto}}
    `;
    document.head.appendChild(s);
  }

  function filtered(){
    const f=state().filter || 'All';
    return allItems().filter(i=>f==='All' || i.assignee===f);
  }
  function itemHTML(i){
    const p=PRIORITY[i.priority]||PRIORITY.notnecessary, t=TIMELINE[i.timeline]||TIMELINE.today;
    return `<div class="cl-item ${i.done?'done':''}" data-id="${esc(i.id)}">
      <input class="cl-check" type="checkbox" ${i.done?'checked':''} aria-label="Complete ${esc(i.title)}">
      <div><div class="cl-title">${esc(i.title)}</div><div class="cl-tags"><span class="pill ${p[1]}">${p[0]}</span><span class="pill">${t[0]}</span><span class="cl-assignee">${esc(i.assignee)}</span></div></div>
      <button class="cl-edit" type="button">Edit</button>
    </div>`;
  }
  function nextUp(items){
    return items.filter(i=>!i.done && i.priority!=='notnecessary').sort(itemSort).slice(0,5);
  }

  function renderChecklist(){
    injectUI();
    const root=document.getElementById('checklistRoot'); if(!root) return;
    const items=filtered(), all=allItems(), active=all.filter(i=>i.priority!=='notnecessary');
    const done=active.filter(i=>i.done).length, remaining=active.length-done;
    const pct=active.length?Math.round(done/active.length*100):100;
    const urgent=active.filter(i=>!i.done&&i.priority==='urgent').length;
    const mode=state().mode||'list';
    const next=nextUp(items);
    let body='';
    if(mode==='list'){
      body=CATEGORIES.map(cat=>{
        const a=items.filter(i=>i.category===cat).sort(itemSort); if(!a.length) return '';
        return `<div class="cl-category">${esc(cat)}</div>${a.map(itemHTML).join('')}`;
      }).join('');
      const other=items.filter(i=>!CATEGORIES.includes(i.category)).sort(itemSort);
      if(other.length) body+=`<div class="cl-category">Other</div>${other.map(itemHTML).join('')}`;
    } else {
      body=Object.entries(TIMELINE).map(([key,v])=>{
        const a=items.filter(i=>i.timeline===key); if(!a.length)return '';
        return `<div class="cl-timeline-block"><div class="cl-timeline-head">${v[0]}</div>${a.sort(itemSort).map(itemHTML).join('')}</div>`;
      }).join('');
    }
    root.innerHTML=`
      <div class="cl-head"><div><div class="eyebrow">PRE-TRIP PREPARATION</div><h2>Travel Checklist</h2><p>Shared preparation list for Me, Faezeh and Both.</p></div><button class="cl-add">＋ Add</button></div>
      <div class="cl-readiness"><div class="cl-readiness-top"><b>TRIP READINESS</b><span class="cl-percent">${pct}%</span></div><div class="progress-track"><div style="width:${pct}%"></div></div><div class="cl-metrics"><div class="cl-metric"><b>${done}</b><span>Completed</span></div><div class="cl-metric"><b>${remaining}</b><span>Remaining</span></div><div class="cl-metric"><b>${urgent}</b><span>Urgent left</span></div></div></div>
      <div class="cl-tabs"><button data-mode="list" class="${mode==='list'?'on':''}">Checklist</button><button data-mode="timeline" class="${mode==='timeline'?'on':''}">Preparation Timeline</button></div>
      <div class="cl-filter">${['All','Me','Faezeh','Both'].map(f=>`<button data-filter="${f}" class="${state().filter===f || (!state().filter&&f==='All')?'on':''}">${f}</button>`).join('')}</div>
      <div class="cl-next"><h3>Next Up</h3>${next.length?next.map((i,n)=>`<div class="cl-next-row"><span class="cl-next-num">${n+1}</span><div><strong>${esc(i.title)}</strong><small>${PRIORITY[i.priority][0]} · ${TIMELINE[i.timeline][0]} · ${esc(i.assignee)}</small></div></div>`).join(''):'<div class="empty">✓ Nothing left in this view.</div>'}</div>
      ${body || '<div class="empty">No checklist items match this filter.</div>'}`;

    root.querySelector('.cl-add').onclick=()=>openEditor();
    root.querySelectorAll('.cl-tabs button').forEach(b=>b.onclick=()=>{state().mode=b.dataset.mode;save();renderChecklist();});
    root.querySelectorAll('.cl-filter button').forEach(b=>b.onclick=()=>{state().filter=b.dataset.filter;save();renderChecklist();});
    root.querySelectorAll('.cl-item').forEach(row=>{
      row.querySelector('.cl-check').onchange=e=>{const id=row.dataset.id; state().items[id]={...(state().items[id]||{}),done:e.target.checked};persist();};
      row.querySelector('.cl-edit').onclick=()=>openEditor(row.dataset.id);
    });
  }

  function openEditor(id=null){
    const d=document.getElementById('checklistDlg'), del=d.querySelector('#clDelete');
    let i=id?allItems().find(x=>x.id===id):null;
    d.querySelector('#clFormTitle').textContent=i?'Edit item':'Add item';
    d.querySelector('#clId').value=i?.id||'';
    d.querySelector('#clTitle').value=i?.title||'';
    d.querySelector('#clCategory').value=i?.category||CATEGORIES[0];
    d.querySelector('#clPriority').value=i?.priority||'before';
    d.querySelector('#clTimeline').value=i?.timeline||'today';
    d.querySelector('#clAssignee').value=i?.assignee||'Both';
    del.style.display=i?'block':'none';
    d.showModal();
  }
  function saveItem(){
    const d=document.getElementById('checklistDlg'), id=d.querySelector('#clId').value;
    const obj={
      title:d.querySelector('#clTitle').value.trim(), category:d.querySelector('#clCategory').value,
      priority:d.querySelector('#clPriority').value, timeline:d.querySelector('#clTimeline').value,
      assignee:d.querySelector('#clAssignee').value
    };
    if(!obj.title) return;
    if(id){ state().items[id]={...(state().items[id]||{}),...obj}; }
    else {
      const nid='custom-'+Date.now().toString(36);
      state().custom.push({id:nid,...obj,done:false,custom:true});
    }
    save(); d.close(); renderChecklist();
  }
  function deleteItem(){
    const d=document.getElementById('checklistDlg'), id=d.querySelector('#clId').value; if(!id)return;
    if(!confirm('Delete this checklist item?')) return;
    const customIndex=state().custom.findIndex(x=>x.id===id);
    if(customIndex>=0) state().custom.splice(customIndex,1);
    else state().items[id]={...(state().items[id]||{}),deleted:true};
    save(); d.close(); renderChecklist();
  }

  injectUI();
  renderChecklist();
})();