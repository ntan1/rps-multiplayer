$(document).ready(function() {

    $(".choice").on("click", function() {
        let yourChoice = $(this).data("choice");
        database.ref().push();
        console.log(yourChoice);

    });

    $(".submitMessage").on("click", function(event) {
        event.preventDefault();
        let message = $("#message").val();
        let name = $("#name").val();
        database.ref("messages").push({
            name: name,
            message: message
        });
    });

    database.ref("messages").on("child_added", function(snapshot) {
        console.log(snapshot.val());
        let oldMessages = $("#messages").text();
        $("#messages").text(`${oldMessages}\n${snapshot.val().name}: ${snapshot.val().message}`)
    });

});