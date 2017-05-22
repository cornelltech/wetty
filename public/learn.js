//var socket = io(location.origin, {path: '/learn/socket.io'})


$(document).ready(function(){
  var currentFrame=0;  
  function getStatus() {
    $.get("/status" + currentFrame.toString(), {}, function(data){
      $("#status").html(data);
    });
  }
  $("#next").click(function() {
    currentFrame++;
    $.get("/content/frame" + currentFrame.toString(), {}, function(data){
      $("#content").html(data);
    });
  });
  $("#prev").click(function() {
    currentFrame--;
    $.get("/content/frame" + currentFrame.toString(), {}, function(data){
      $("#content").html(data);
    });
  });
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
