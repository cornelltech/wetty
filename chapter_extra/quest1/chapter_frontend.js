    $.get("/quest1/start_proc", {}, function(data){
    });
    function checkCountdown() {
      $.get("/quest1/countdown", {}, function(data){
        $(".status").html("<h1><small>countdown: </small>" + data + "</h1>");
      });
    }
    var checkQuestStatusID;
    var checkCountdownID;
    function checkQuestStatus() {
      $.get("/quest1/status", {}, function(data){
        if(data != 'continue'){
          if(data == 'fail'){
            clearInterval(checkCountdownID);
            $(".status").html('<iframe src="https://giphy.com/embed/13d2jHlSlxklVe" width="480" height="318" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/reaction-explosion-government-13d2jHlSlxklVe">via GIPHY</a></p>');
            clearInterval(checkQuestStatusID);
            theySay("Oh Nooooo!  We ran out of time!");
          } 
          if(data == 'success'){
            clearInterval(checkCountdownID);
            $(".status").html('<iframe src="https://giphy.com/embed/eoxomXXVL2S0E" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/internet-eoxomXXVL2S0E">via GIPHY</a></p>');
            clearInterval(checkQuestStatusID);
            theySay("Great work!!  We have saved the sector from loosing power!");
          }
        }
      });
    }
    checkCountdownID = setInterval(checkCountdown, 1000);
    checkQuestStatusID = setInterval(checkQuestStatus, 1000);
