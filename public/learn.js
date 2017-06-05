//var socket = io(location.origin, {path: '/learn/socket.io'})


$(document).ready(function(){
  var currentFrame=0;  
  function getNextChat() {
    $.get("/chat/" + currentFrame.toString(), {}, function(data){
      theySay(data["chat"]);
      $(".bottom_wrapper").html("");
      data["questions"].forEach((question, index) => { 
        createButton(index, question);
      });
			activateButtons();
    });
  }
  function createButton(index, question){
    $(".bottom_wrapper").append("<div class='question"+index+" send_message text'>" + question + "</div>");
  }
  function iSay(content){
    sendMessage(content, 'right');
  }
  function theySay(content){
    sendMessage(content, 'left');
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
    $("div.text").click(function() {
      var regexp = /question(\d+)/
      var questionNumber = $(this).attr("class").match(regexp)[1] 
      iSay($(this).html());
      $.get("/chat/" + currentFrame.toString() + "/answer/" + questionNumber, {}, function(data){
        theySay(data);
      });
      $(this).hide();
    });
  }

  var Message;
  Message = function (arg) {
      this.text = arg.text, this.message_side = arg.message_side;
      this.draw = function (_this) {
          return function () {
              var $message;
              $message = $($('.message_template').clone().html());
              $message.addClass(_this.message_side).find('.text').html(_this.text);
              $('.messages').append($message);
              return setTimeout(function () {
                  return $message.addClass('appeared');
              }, 0);
          };
      }(this);
      return this;
  }

  function sendMessage(text, message_side) {
      var $messages, message;
      if (text.trim() === '') {
          return;
      }
      $messages = $('.messages');
      message = new Message({
          text: text,
          message_side: message_side
      });
      message.draw();
      return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
  };
  //sendMessage('Hello Philip! :)', 'left');
  //setTimeout(function () {
  //    return sendMessage('Hi Sandy! How are you?', 'right');
  //}, 1000);
  //return setTimeout(function () {
  //    return sendMessage('I\'m fine, thank you!', 'left');
  //}, 2000);

  getNextChat();
  setInterval(getStatus, 1000);
});


