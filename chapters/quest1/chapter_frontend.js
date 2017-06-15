    $.get("/quest1/start_proc", {}, function(data){
    });
    function checkCountdown() {
      $.get("/quest1/countdown", {}, function(data){
        $(".status").html("<h1><small>countdown: </small>" + data + "</h1>");
      });
    }
    var checkQuestStatusID;
    function checkQuestStatus() {
      $.get("/quest1/status", {}, function(data){
        if(data != 'continue'){
          if(data == 'fail'){
            alert("Oh no!!  The bomb has gone off.  Power is being lost!");
            clearInterval(checkQuestStatusID);
          } 
          if(data == 'success'){
            alert("Yay!!  The bomb has been stopped!");
            clearInterval(checkQuestStatusID);
          }
        }
      });
    }
    setInterval(checkCountdown, 1000);
    checkQuestStatusID = setInterval(checkQuestStatus, 1000);
