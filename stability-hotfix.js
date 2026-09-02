(function(){
  'use strict';
  var nativeSetInterval=window.setInterval.bind(window);
  window.setInterval=function(fn,ms){
    if(ms===60000){
      var now=new Date();
      var chinaDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
      if(chinaDate<'2026-09-05'||chinaDate>'2026-09-21') return 0;
    }
    return nativeSetInterval(fn,ms);
  };
}());