    $.get("/quest1/start_proc", {}, function(data){
    });
    function checkCountdown() {
      $.get("/quest1/countdown", {}, function(data){
        $(".status").html("<h1><small>countdown: </small>" + data + "</h1>");
      });
    }
    setInterval(checkCountdown, 1000);
