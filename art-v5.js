(function(){
  'use strict';
  var map={
    'beijing':'beijing','北京':'beijing',
    'xi’an':'xian','xian':'xian','西安':'xian',
    'chengdu':'chengdu','成都':'chengdu',
    'zhangjiajie':'zhangjiajie','张家界':'zhangjiajie',
    'yangshuo':'yangshuo','阳朔':'yangshuo',
    'suzhou':'suzhou','苏州':'suzhou',
    'shanghai':'shanghai','上海':'shanghai'
  };
  function slug(text){var t=(text||'').toLowerCase();for(var k in map)if(t.indexOf(k)!==-1)return map[k];return'';}
  function enhance(){
    var h=document.querySelector('#home .home-hero');
    if(h){
      var title=h.querySelector('h3'),p=h.querySelector('p');
      if(title)title.textContent='China Trip';
      if(p)p.textContent='A calm, visual home for the tools you need on the road.';
    }
    document.querySelectorAll('.cityhead').forEach(function(el){
      var s=slug(el.textContent);if(s)el.classList.add('cityhead--'+s);
    });
  }
  setTimeout(enhance,120);
  var mo=new MutationObserver(function(){setTimeout(enhance,20)});
  mo.observe(document.body,{subtree:true,childList:true});
  window.addEventListener('tripstatechange',enhance);
}());
