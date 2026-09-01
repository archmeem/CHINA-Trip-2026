(function(){
  'use strict';

  var STATE_KEY='china-trip-2026-state';
  var FIREBASE_SCRIPTS=[
    'https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore-compat.js'
  ];
  var firebaseConfig={
    apiKey:'AIzaSyAczJEFvdTYXkSlp1ehWaJj7xDMiLtjLuw',
    authDomain:'china-trip-2026-2aee7-acc8.firebaseapp.com',
    projectId:'china-trip-2026-2aee7',
    storageBucket:'china-trip-2026-2aee7.firebasestorage.app',
    messagingSenderId:'135533018442',
    appId:'1:135533018442:web:4ab291db0ad8168a7195b3'
  };

  var nativeSetItem=localStorage.setItem.bind(localStorage);
  var applyingCloudState=false;
  var firebaseStarted=false;
  var loadingFirebase=false;
  var auth=null,db=null,provider=null,stateRef=null,stopStateListener=null;

  function parse(value){
    try{return JSON.parse(value||'{}');}catch(e){return {};}
  }
  function clone(obj){
    try{return JSON.parse(JSON.stringify(obj||{}));}catch(e){return {};}
  }
  function objectTime(value){
    if(!value||typeof value!=='object'||!value.updatedAt)return 0;
    var t=Date.parse(value.updatedAt);
    return isFinite(t)?t:0;
  }
  function same(a,b){
    try{return JSON.stringify(a)===JSON.stringify(b);}catch(e){return false;}
  }
  function stampLocalWrite(value){
    var prev=parse(localStorage.getItem(STATE_KEY)||'{}');
    var next=parse(value);
    var meta=clone(prev.__syncMeta||{});
    var incoming=next.__syncMeta||{};
    var k;
    for(k in incoming)if(Object.prototype.hasOwnProperty.call(incoming,k))meta[k]=incoming[k];
    var now=Date.now();
    var keys={};
    for(k in prev)if(k!=='__syncMeta')keys[k]=1;
    for(k in next)if(k!=='__syncMeta')keys[k]=1;
    for(k in keys){
      if(!same(prev[k],next[k]))meta[k]=now;
    }
    next.__syncMeta=meta;
    return JSON.stringify(next);
  }

  localStorage.setItem=function(key,value){
    if(key!==STATE_KEY){nativeSetItem(key,value);return;}
    var stored=applyingCloudState?value:stampLocalWrite(value);
    nativeSetItem(key,stored);
    if(!applyingCloudState&&auth&&auth.currentUser&&stateRef){
      writeCloudState(stored).catch(function(err){console.warn('Cloud sync deferred:',err&&err.message?err.message:err);});
    }
  };

  function mergeTripState(localValue,cloudValue){
    var local=parse(localValue),cloud=parse(cloudValue),merged={},meta={},keys={},k;
    var lm=local.__syncMeta||{},cm=cloud.__syncMeta||{};
    for(k in local)if(k!=='__syncMeta')keys[k]=1;
    for(k in cloud)if(k!=='__syncMeta')keys[k]=1;
    for(k in keys){
      var l=local[k],c=cloud[k];
      if(typeof l==='undefined'){merged[k]=c;meta[k]=cm[k]||objectTime(c)||0;continue;}
      if(typeof c==='undefined'){merged[k]=l;meta[k]=lm[k]||objectTime(l)||0;continue;}
      var lt=objectTime(l)||Number(lm[k]||0);
      var ct=objectTime(c)||Number(cm[k]||0);
      if(lt||ct){
        if(lt>ct){merged[k]=l;meta[k]=lt;}
        else{merged[k]=c;meta[k]=ct;}
      }else{
        merged[k]=c;
        meta[k]=0;
      }
    }
    merged.__syncMeta=meta;
    return JSON.stringify(merged);
  }

  function addSyncBadge(text,kind){
    var id='syncStatusBadge';
    var badge=document.getElementById(id);
    if(!badge){
      badge=document.createElement('div');
      badge.id=id;
      badge.style.position='fixed';
      badge.style.left='12px';
      badge.style.top='12px';
      badge.style.zIndex='9998';
      badge.style.padding='6px 9px';
      badge.style.borderRadius='999px';
      badge.style.fontSize='10px';
      badge.style.fontWeight='800';
      badge.style.boxShadow='0 3px 12px rgba(0,0,0,.08)';
      document.body.appendChild(badge);
    }
    badge.textContent=text;
    if(kind==='ok'){badge.style.background='#deece4';badge.style.color='#143a31';}
    else if(kind==='offline'){badge.style.background='#f5ead6';badge.style.color='#7d5318';}
    else{badge.style.background='#ece8df';badge.style.color='#5f675f';}
  }

  function updateConnectivityBadge(){
    if(!navigator.onLine)addSyncBadge('Offline · saved on device','offline');
    else if(auth&&auth.currentUser)addSyncBadge('Synced','ok');
    else addSyncBadge('Device copy ready','neutral');
  }

  function loadScript(src){
    return new Promise(function(resolve,reject){
      var s=document.createElement('script');
      var done=false;
      var timer=setTimeout(function(){
        if(done)return;done=true;s.remove();reject(new Error('timeout'));
      },7000);
      s.src=src;
      s.async=true;
      s.onload=function(){if(done)return;done=true;clearTimeout(timer);resolve();};
      s.onerror=function(){if(done)return;done=true;clearTimeout(timer);reject(new Error('blocked'))};
      document.head.appendChild(s);
    });
  }

  function showLoginButton(){
    if(document.getElementById('firebaseLogin')||!auth)return;
    var btn=document.createElement('button');
    btn.id='firebaseLogin';
    btn.textContent='Sign in to Sync';
    btn.style.position='fixed';
    btn.style.top='12px';
    btn.style.right='12px';
    btn.style.zIndex='9999';
    btn.style.padding='9px 14px';
    btn.style.borderRadius='20px';
    btn.style.border='0';
    btn.style.background='#173f36';
    btn.style.color='white';
    btn.style.fontWeight='600';
    btn.onclick=function(){
      auth.signInWithPopup(provider).catch(function(err){alert('Google sign-in failed: '+err.message);});
    };
    document.body.appendChild(btn);
  }

  function writeCloudState(value){
    if(!auth||!auth.currentUser||!stateRef)return Promise.resolve();
    return stateRef.set({
      value:value,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy:auth.currentUser.email
    },{merge:true});
  }

  function reconcileInitialState(){
    return stateRef.get().then(function(snap){
      var localValue=localStorage.getItem(STATE_KEY)||'{}';
      if(!snap.exists||!snap.data().value){
        if(localValue!=='{}')return writeCloudState(localValue).then(function(){return false;});
        return false;
      }
      var cloudValue=snap.data().value;
      var mergedValue=mergeTripState(localValue,cloudValue);
      var tasks=[];
      if(mergedValue!==cloudValue)tasks.push(writeCloudState(mergedValue));
      return Promise.all(tasks).then(function(){
        if(mergedValue!==localValue){
          applyingCloudState=true;nativeSetItem(STATE_KEY,mergedValue);applyingCloudState=false;return true;
        }
        return false;
      });
    });
  }

  function startRealtimeStateListener(){
    if(stopStateListener)stopStateListener();
    stopStateListener=stateRef.onSnapshot(function(snap){
      if(!snap.exists||!snap.data().value)return;
      var cloudValue=snap.data().value;
      var localValue=localStorage.getItem(STATE_KEY)||'{}';
      var mergedValue=mergeTripState(localValue,cloudValue);
      if(mergedValue!==cloudValue&&auth.currentUser){
        writeCloudState(mergedValue).catch(function(){});
      }
      if(mergedValue!==localValue){
        applyingCloudState=true;nativeSetItem(STATE_KEY,mergedValue);applyingCloudState=false;
        location.reload();
      }
      updateConnectivityBadge();
    },function(){
      addSyncBadge('Offline · saved on device','offline');
    });
  }

  function bootFirebase(){
    if(firebaseStarted||typeof firebase==='undefined')return;
    firebaseStarted=true;
    try{
      firebase.initializeApp(firebaseConfig);
      auth=firebase.auth();
      db=firebase.firestore();
      provider=new firebase.auth.GoogleAuthProvider();
      stateRef=db.collection('shared').doc('trip-state');
      auth.onAuthStateChanged(function(user){
        if(!user){
          if(stopStateListener){stopStateListener();stopStateListener=null;}
          showLoginButton();updateConnectivityBadge();return;
        }
        var loginBtn=document.getElementById('firebaseLogin');if(loginBtn)loginBtn.remove();
        reconcileInitialState().then(function(changed){
          updateConnectivityBadge();
          if(changed){location.reload();return;}
          startRealtimeStateListener();
        }).catch(function(){
          addSyncBadge('Offline · saved on device','offline');
        });
      });
    }catch(e){
      firebaseStarted=false;
      addSyncBadge('Offline · saved on device','offline');
    }
  }

  function ensureFirebaseSync(){
    if(firebaseStarted||loadingFirebase||!navigator.onLine)return;
    if(typeof firebase!=='undefined'){bootFirebase();return;}
    loadingFirebase=true;
    var p=Promise.resolve();
    FIREBASE_SCRIPTS.forEach(function(src){p=p.then(function(){return loadScript(src);});});
    p.then(function(){loadingFirebase=false;bootFirebase();}).catch(function(){
      loadingFirebase=false;
      addSyncBadge('Offline · saved on device','offline');
    });
  }

  window.addEventListener('online',function(){updateConnectivityBadge();ensureFirebaseSync();});
  window.addEventListener('offline',updateConnectivityBadge);
  updateConnectivityBadge();
  ensureFirebaseSync();
}());