(function () {
  'use strict';

  var KEY = 'china-trip-2026-state';
  var PRIORITY = {
    urgent: ['Urgent', 'red', 0],
    before: ['Before Departure', 'amber', 1],
    pack: ['Pack', 'blue', 2],
    optional: ['Optional', '', 3],
    notnecessary: ['Not Necessary', '', 4]
  };
  var TIMELINE = {
    today: ['Today', 0],
    '2-3': ['2–3 Days Before', 1],
    daybefore: ['Day Before', 2],
    departure: ['Departure Day', 3]
  };
  var CATEGORIES = [
    'Documents & Travel', 'Money & Payment', 'Phone & Internet', 'Electronics',
    'Clothing & Packing', 'Toiletries', 'Medication & Health', 'Before Leaving Home'
  ];
  var RAW = [
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
  ];
  var DEFAULTS = [];
  var i;
  for (i = 0; i < RAW.length; i++) {
    DEFAULTS.push({
      id: RAW[i][0], title: RAW[i][1], category: RAW[i][2], priority: RAW[i][3],
      timeline: RAW[i][4], assignee: RAW[i][5], custom: false
    });
  }

  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function merge(a, b) {
    var out = {}, k;
    for (k in a) if (own(a, k)) out[k] = a[k];
    for (k in b) if (own(b, k)) out[k] = b[k];
    return out;
  }
  function escapeHtml(value) {
    var s = value == null ? '' : String(value);
    return s.replace(/[&<>\'\"]/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];
    });
  }
  function readTrip() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function context() {
    var trip = readTrip();
    if (!trip.__checklist || typeof trip.__checklist !== 'object') {
      trip.__checklist = {items:{}, custom:[], filter:'All', mode:'list'};
    }
    if (!trip.__checklist.items) trip.__checklist.items = {};
    if (!trip.__checklist.custom) trip.__checklist.custom = [];
    if (!trip.__checklist.filter) trip.__checklist.filter = 'All';
    if (!trip.__checklist.mode) trip.__checklist.mode = 'list';
    return {trip: trip, state: trip.__checklist};
  }
  function writeContext(ctx) {
    try { S = ctx.trip; } catch (e) {}
    localStorage.setItem(KEY, JSON.stringify(ctx.trip));
  }
  function allItems() {
    var ctx = context(), out = [], n, base, changes;
    for (n = 0; n < DEFAULTS.length; n++) {
      base = DEFAULTS[n];
      changes = ctx.state.items[base.id] || {};
      out.push(merge(base, changes));
    }
    for (n = 0; n < ctx.state.custom.length; n++) {
      base = ctx.state.custom[n];
      changes = ctx.state.items[base.id] || {};
      out.push(merge(base, changes));
    }
    return out.filter(function (x) { return !x.deleted; });
  }
  function sortItems(a, b) {
    var pa = (PRIORITY[a.priority] || PRIORITY.notnecessary)[2];
    var pb = (PRIORITY[b.priority] || PRIORITY.notnecessary)[2];
    var ta = (TIMELINE[a.timeline] || TIMELINE.today)[1];
    var tb = (TIMELINE[b.timeline] || TIMELINE.today)[1];
    if (pa !== pb) return pa - pb;
    if (ta !== tb) return ta - tb;
    return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
  }

  function ensureStyles() {
    if (document.getElementById('checklistCss')) return;
    var s = document.createElement('style');
    s.id = 'checklistCss';
    s.type = 'text/css';
    s.innerHTML = [
      '.bottom-nav{grid-template-columns:repeat(6,1fr)}',
      '.cl-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}',
      '.cl-head h2{font-size:28px;margin:2px 0}.cl-head p{margin:3px 0;color:var(--muted);font-size:12px}',
      '.cl-add{background:var(--green);color:#fff}',
      '.cl-ready{background:#143a31;color:#fff;border-radius:22px;padding:17px;margin-bottom:12px}',
      '.cl-ready-top{display:flex;justify-content:space-between;align-items:end}.cl-pct{font-size:30px;font-weight:900}',
      '.cl-ready .progress-track{background:rgba(255,255,255,.18)}.cl-ready .progress-track div{background:#fff}',
      '.cl-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:11px}',
      '.cl-metrics div{background:rgba(255,255,255,.1);border-radius:12px;padding:9px}.cl-metrics b{display:block;font-size:17px}.cl-metrics span{font-size:9px;opacity:.8}',
      '.cl-tabs,.cl-filter{display:flex;gap:6px;overflow:auto}.cl-tabs{margin:10px 0}.cl-filter{margin:8px 0 16px}',
      '.cl-tabs button,.cl-filter button{white-space:nowrap;padding:8px 10px;font-size:10.5px}.cl-tabs .on,.cl-filter .on{background:var(--green);color:#fff}',
      '.cl-next{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:14px;margin-bottom:16px}.cl-next h3{margin:0 0 8px}',
      '.cl-next-row{padding:8px 0;border-top:1px solid var(--line)}.cl-next-row:first-of-type{border-top:0}.cl-next-row small{display:block;color:var(--muted);margin-top:2px}',
      '.cl-note{font-size:10px;color:var(--muted);margin:8px 2px 0}',
      '.cl-cat{margin:18px 0 8px;font-size:11px;font-weight:900;color:var(--green2);text-transform:uppercase;letter-spacing:.05em}',
      '.cl-item{display:grid;grid-template-columns:28px 1fr auto;gap:9px;align-items:start;background:var(--card);border:1px solid var(--line);border-radius:15px;padding:11px;margin-bottom:7px}',
      '.cl-item.done{opacity:.55}.cl-item.done .cl-title{text-decoration:line-through}',
      '.cl-check{width:22px;height:22px;margin:1px 0 0}.cl-title{font-size:13px;font-weight:850}.cl-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}.cl-edit{padding:6px 8px;font-size:10px}',
      '.cl-overlay{display:none;position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.45);z-index:99999;padding:20px;overflow:auto}.cl-overlay.on{display:block}',
      '.cl-panel{max-width:540px;margin:4vh auto;background:var(--card);border-radius:18px;padding:18px}.cl-panel label{display:block;margin-top:10px}.cl-panel input,.cl-panel select{width:100%}',
      '.cl-actions{display:grid;grid-template-columns:1fr 2fr;gap:8px;margin-top:14px}.cl-delete{background:var(--redbg);color:var(--red)}',
      '@media(max-width:430px){.bottom-nav button span{font-size:8.5px}.bottom-nav button b{font-size:16px}.cl-head{align-items:center}.cl-add{padding:9px}.cl-metrics div{padding:8px 6px}}'
    ].join('');
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  function ensureEditor() {
    if (document.getElementById('clOverlay')) return;
    var overlay = document.createElement('div');
    var options = '', n;
    for (n = 0; n < CATEGORIES.length; n++) options += '<option>' + escapeHtml(CATEGORIES[n]) + '</option>';
    overlay.id = 'clOverlay';
    overlay.className = 'cl-overlay';
    overlay.innerHTML = '<div class="cl-panel"><form id="clForm">' +
      '<div class="dialog-top"><div><div class="eyebrow">TRAVEL CHECKLIST</div><h2 id="clFormTitle">Add item</h2></div><button type="button" id="clClose">×</button></div>' +
      '<input type="hidden" id="clId">' +
      '<label>Item<input id="clTitle" required maxlength="100"></label>' +
      '<label>Category<select id="clCategory">' + options + '</select></label>' +
      '<label>Priority<select id="clPriority"><option value="urgent">Urgent</option><option value="before">Before Departure</option><option value="pack">Pack</option><option value="optional">Optional</option><option value="notnecessary">Not Necessary</option></select></label>' +
      '<label>Preparation Timeline<select id="clTimeline"><option value="today">Today</option><option value="2-3">2–3 Days Before</option><option value="daybefore">Day Before</option><option value="departure">Departure Day</option></select></label>' +
      '<label>Assigned to<select id="clAssignee"><option>Me</option><option>Faezeh</option><option>Both</option></select></label>' +
      '<div class="cl-actions"><button type="button" class="cl-delete" id="clDelete">Delete</button><button class="primary">Save item</button></div>' +
      '</form></div>';
    document.body.appendChild(overlay);
    document.getElementById('clClose').onclick = closeEditor;
    document.getElementById('clForm').onsubmit = function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      saveEditor();
      return false;
    };
    document.getElementById('clDelete').onclick = deleteEditorItem;
    overlay.onclick = function (ev) { if (ev.target === overlay) closeEditor(); };
  }

  function itemHtml(item) {
    var p = PRIORITY[item.priority] || PRIORITY.notnecessary;
    var t = TIMELINE[item.timeline] || TIMELINE.today;
    return '<div class="cl-item ' + (item.done ? 'done' : '') + '" data-id="' + escapeHtml(item.id) + '">' +
      '<input class="cl-check" type="checkbox" ' + (item.done ? 'checked' : '') + ' aria-label="Complete ' + escapeHtml(item.title) + '">' +
      '<div><div class="cl-title">' + escapeHtml(item.title) + '</div><div class="cl-tags">' +
      '<span class="pill ' + p[1] + '">' + p[0] + '</span><span class="pill">' + t[0] + '</span><span>' + escapeHtml(item.assignee) + '</span></div></div>' +
      '<button class="cl-edit" type="button">Edit</button></div>';
  }

  function render() {
    var root = document.getElementById('checklistRoot');
    if (!root) return;
    var ctx = context();
    var all = allItems();
    var essential = all.filter(function (x) { return x.priority !== 'notnecessary'; });
    var completed = essential.filter(function (x) { return !!x.done; }).length;
    var remaining = essential.length - completed;
    var pct = essential.length ? Math.round(completed * 100 / essential.length) : 100;
    var urgent = essential.filter(function (x) { return !x.done && x.priority === 'urgent'; }).length;
    var filter = ctx.state.filter || 'All';
    var mode = ctx.state.mode || 'list';
    var visible = all.filter(function (x) { return filter === 'All' || x.assignee === filter; });
    var body = '', n, j, list, key;

    if (mode === 'timeline') {
      var keys = ['today', '2-3', 'daybefore', 'departure'];
      for (n = 0; n < keys.length; n++) {
        key = keys[n];
        list = visible.filter((function (k) { return function (x) { return x.timeline === k; }; })(key)).sort(sortItems);
        if (list.length) {
          body += '<div class="cl-cat">' + TIMELINE[key][0] + '</div>';
          for (j = 0; j < list.length; j++) body += itemHtml(list[j]);
        }
      }
    } else {
      for (n = 0; n < CATEGORIES.length; n++) {
        key = CATEGORIES[n];
        list = visible.filter((function (c) { return function (x) { return x.category === c; }; })(key)).sort(sortItems);
        if (list.length) {
          body += '<div class="cl-cat">' + escapeHtml(key) + '</div>';
          for (j = 0; j < list.length; j++) body += itemHtml(list[j]);
        }
      }
    }

    var next = all.filter(function (x) { return !x.done && x.priority !== 'notnecessary'; }).sort(sortItems).slice(0, 5);
    var nextHtml = '';
    for (n = 0; n < next.length; n++) {
      nextHtml += '<div class="cl-next-row"><strong>' + (n + 1) + '. ' + escapeHtml(next[n].title) + '</strong><small>' +
        PRIORITY[next[n].priority][0] + ' · ' + TIMELINE[next[n].timeline][0] + ' · ' + escapeHtml(next[n].assignee) + '</small></div>';
    }
    if (!nextHtml) nextHtml = '<div class="empty">✓ Nothing left.</div>';

    var filters = ['All', 'Me', 'Faezeh', 'Both'];
    var filterHtml = '';
    for (n = 0; n < filters.length; n++) {
      filterHtml += '<button type="button" data-filter="' + filters[n] + '" class="' + (filter === filters[n] ? 'on' : '') + '">' + filters[n] + '</button>';
    }

    var nn = all.filter(function (x) { return x.priority === 'notnecessary'; }).length;
    root.innerHTML = '<div class="cl-head"><div><div class="eyebrow">PRE-TRIP PREPARATION</div><h2>Travel Checklist</h2><p>Shared preparation list for Me, Faezeh and Both.</p></div><button type="button" class="cl-add">＋ Add</button></div>' +
      '<div class="cl-ready"><div class="cl-ready-top"><b>TRIP READINESS</b><span class="cl-pct">' + pct + '%</span></div><div class="progress-track"><div style="width:' + pct + '%"></div></div>' +
      '<div class="cl-metrics"><div><b>' + completed + '</b><span>Completed</span></div><div><b>' + remaining + '</b><span>Remaining</span></div><div><b>' + urgent + '</b><span>Urgent left</span></div></div></div>' +
      '<div class="cl-tabs"><button type="button" data-mode="list" class="' + (mode === 'list' ? 'on' : '') + '">Checklist</button><button type="button" data-mode="timeline" class="' + (mode === 'timeline' ? 'on' : '') + '">Preparation Timeline</button></div>' +
      '<div class="cl-filter">' + filterHtml + '</div>' +
      '<div class="cl-next"><h3>Next Up</h3>' + nextHtml + '</div>' +
      (nn ? '<div class="cl-note">Not Necessary items stay visible but do not affect Trip Readiness.</div>' : '') +
      (body || '<div class="empty">No checklist items match this filter.</div>');

    root.querySelector('.cl-add').onclick = function () { openEditor(null); };
    var tabs = root.querySelectorAll('.cl-tabs button');
    for (n = 0; n < tabs.length; n++) tabs[n].onclick = function () {
      var c = context(); c.state.mode = this.getAttribute('data-mode'); writeContext(c); render();
    };
    var filterButtons = root.querySelectorAll('.cl-filter button');
    for (n = 0; n < filterButtons.length; n++) filterButtons[n].onclick = function () {
      var c = context(); c.state.filter = this.getAttribute('data-filter'); writeContext(c); render();
    };
    var rows = root.querySelectorAll('.cl-item');
    for (n = 0; n < rows.length; n++) bindRow(rows[n]);
  }

  function bindRow(row) {
    var id = row.getAttribute('data-id');
    row.querySelector('.cl-check').onchange = function () {
      var c = context();
      c.state.items[id] = merge(c.state.items[id] || {}, {done: this.checked});
      writeContext(c); render();
    };
    row.querySelector('.cl-edit').onclick = function () { openEditor(id); };
  }

  function findItem(id) {
    var a = allItems(), n;
    for (n = 0; n < a.length; n++) if (a[n].id === id) return a[n];
    return null;
  }
  function openEditor(id) {
    ensureEditor();
    var item = id ? findItem(id) : null;
    document.getElementById('clFormTitle').textContent = item ? 'Edit item' : 'Add item';
    document.getElementById('clId').value = item ? item.id : '';
    document.getElementById('clTitle').value = item ? item.title : '';
    document.getElementById('clCategory').value = item ? item.category : CATEGORIES[0];
    document.getElementById('clPriority').value = item ? item.priority : 'before';
    document.getElementById('clTimeline').value = item ? item.timeline : 'today';
    document.getElementById('clAssignee').value = item ? item.assignee : 'Both';
    document.getElementById('clDelete').style.display = item ? 'block' : 'none';
    document.getElementById('clOverlay').className = 'cl-overlay on';
  }
  function closeEditor() { document.getElementById('clOverlay').className = 'cl-overlay'; }
  function saveEditor() {
    var id = document.getElementById('clId').value;
    var title = document.getElementById('clTitle').value.replace(/^\s+|\s+$/g, '');
    if (!title) return;
    var values = {
      title: title,
      category: document.getElementById('clCategory').value,
      priority: document.getElementById('clPriority').value,
      timeline: document.getElementById('clTimeline').value,
      assignee: document.getElementById('clAssignee').value
    };
    var c = context();
    if (id) {
      c.state.items[id] = merge(c.state.items[id] || {}, values);
    } else {
      values.id = 'custom-' + new Date().getTime().toString(36);
      values.done = false;
      values.custom = true;
      c.state.custom.push(values);
    }
    writeContext(c); closeEditor(); render();
  }
  function deleteEditorItem() {
    var id = document.getElementById('clId').value;
    if (!id || !window.confirm('Delete this checklist item?')) return;
    var c = context(), n, idx = -1;
    for (n = 0; n < c.state.custom.length; n++) if (c.state.custom[n].id === id) { idx = n; break; }
    if (idx >= 0) c.state.custom.splice(idx, 1);
    else c.state.items[id] = merge(c.state.items[id] || {}, {deleted: true});
    writeContext(c); closeEditor(); render();
  }

  function start() {
    var root = document.getElementById('checklistRoot');
    if (!root) return;
    ensureStyles();
    ensureEditor();
    render();
    window.CHINA_TRIP_CHECKLIST_READY = true;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}());
