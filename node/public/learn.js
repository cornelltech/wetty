//var socket = io(location.origin, {path: '/learn/socket.io'})

$(document).ready(function(){
  var currentFrame=0;  
  function getNextChat() {
    $.get("/chat/" + currentFrame.toString(), {}, function(data){
      theySay(data["chat"]);
      $(".bottom_wrapper").html("");
      data["questions"].forEach((question, index) => { 
        if(index == data["correct_question"]){
          createCorrectButton(index, question);
        } else {
          createButton(index, question);
        }
      });
			activateButtons();
    });
  }
  function createButton(index, question){
    $(".bottom_wrapper").append("<div class='question"+index+" send_message text'>" + question + "</div>");
  }
  function createCorrectButton(index, question){
    $(".bottom_wrapper").append("<div class='question"+index+" send_message text correct'>" + question + "</div>");
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
    $("div.text").not(".correct").click(function() {
      var regexp = /question(\d+)/
      var questionNumber = $(this).attr("class").match(regexp)[1] 
      iSay($(this).html());
      $.get("/chat/" + currentFrame.toString() + "/answer/" + questionNumber, {}, function(data){
        setTimeout(function() {
          return theySay(data);
        }, 1000);
      });
      $(this).hide();
    });
    $("div.text.correct").click(function() {
      currentFrame++;
      getNextChat();
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

  getNextChat();
  setInterval(getStatus, 1000);

  $.getScript('chapter_frontend.js', function() {
  });

});


