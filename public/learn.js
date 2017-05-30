//var socket = io(location.origin, {path: '/learn/socket.io'})


$(document).ready(function(){
  var currentFrame=0;  
  function getNextChat() {
    $.get("/chat/" + currentFrame.toString(), {}, function(data){
      theySay(data["chat"]);
      $(".chatButtons").html("");
      data["questions"].forEach((question, index) => { 
        createButton(index, question);
      });
			activateButtons();
    });

  }
  function createButton(index, question){
    $(".chatButtons").append("<button class='question"+index+"'>" + question + "</button>");
  }
  function iSay(content){
    $(".chatDialog").append("<div class='userSays'>Me: " + content + "</div>");
    scrollToBottom();
  }
  function theySay(content){
    $(".chatDialog").append("<div class='serverSays'>Them: " + content + "</div>");
    scrollToBottom();
  }
  function scrollToBottom(){
    $(".chatDialog").scrollTop($(".chatDialog").height());
  }



  function getStatus() {
    $.get("/status/" + currentFrame.toString(), {}, function(data){
      if( data === "true" ){
        currentFrame++;
        getNextChat();
      }
    });
  }
  function activateButtons(){
    $("button").click(function() {
      var regexp = /question(\d+)/
      var questionNumber = $(this).attr("class").match(regexp)[1] 
      iSay($(this).html());
      $.get("/chat/" + currentFrame.toString() + "/answer/" + questionNumber, {}, function(data){
        theySay(data);
      });
      $(this).hide();
    });
  }

  getNextChat();
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
