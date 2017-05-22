//var socket = io(location.origin, {path: '/learn/socket.io'})


$(document).ready(function(){
  function getStatus() {
    $.get("/status", {}, function(data){
      $("#status").html("status is " + data);
    });
  }
  
  setInterval(getStatus, 1000);
});


//socket.on('connect', function() {
//});
//
//socket.on('output', function(data) {
//});
//
//socket.on('disconnect', function() {
//    console.log("learn/socket.io connection closed");
//});
