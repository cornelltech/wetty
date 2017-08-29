    //$.get("/quest1/start_proc", {}, function(data){
    //});
    self.authService.makeAuthGetRequest("http://localhost:8000/quest1/api/start_proc").subscribe();
    var checkQuestStatusID;
    var checkCountdownID;

    function checkCountdown(){
      self.authService.makeAuthGetRequest("http://localhost:8000/quest1/api/countdown").subscribe( data => {
        self.statusHtml = "<h1><small>countdown: </small>" + data.data + "</h1>";
      });
    }
    function checkQuestStatus() {
      self.authService.makeAuthGetRequest("http://localhost:8000/quest1/api/status").subscribe( data => {
        if(data.data != 'continue'){
          if(data.data == 'fail'){
            clearInterval(checkCountdownID);
            self.statusHtml = '<iframe src="https://giphy.com/embed/13d2jHlSlxklVe" width="480" height="300" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>';
            clearInterval(checkQuestStatusID);
          } 
          if(data.data == 'success'){
            clearInterval(checkCountdownID);
            self.statusHtml = '<iframe src="https://giphy.com/embed/eoxomXXVL2S0E" width="480" height="300" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>';
            clearInterval(checkQuestStatusID);
          }
        }
      });
    }
    checkCountdownID = setInterval(checkCountdown, 1000);
    checkQuestStatusID = setInterval(checkQuestStatus, 1000);

    self.clearAllIntervals = function() {
      console.log("stop intervals!!");
      clearInterval(checkQuestStatusID);            
      clearInterval(checkCountdownID);
    }
        
    /*
    function checkCountdown() {
      $.get("/quest1/countdown", {}, function(data){
        $(".status").html("<h1><small>countdown: </small>" + data + "</h1>");
      });
    }
    */
