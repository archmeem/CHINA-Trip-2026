(function(){
  'use strict';
  function apply(){
    if(!window.ITINERARY)return;
    window.ITINERARY.forEach(function(i){
      if(i.type==='train') i.leaveBuffer=180;   // leave 3 hours before train departure
      if(i.type==='flight') i.leaveBuffer=240; // leave 4 hours before flight departure
    });
  }
  apply();
  window.addEventListener('tripstatechange',apply);
}());
