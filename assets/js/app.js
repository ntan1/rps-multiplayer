$(document).ready(function () {

    $(".choice").on("click", function () {
        let yourChoice = $(this).data("choice");
        database.ref().push();
        console.log(yourChoice);
        
    });

    $(".submitMessage").on("click", function (event) {
        event.preventDefault();
        if (checkInputs()) {
            let message = $(messageBox).val();
            let name = $(nameBox).val();
            let ts = moment().format('h:mm:ss a');
            $(messageBox).val("");
            database.ref("messages").push({
                name: name,
                message: message,
                ts: ts
            });
        }
    });

    // check input boxes not empty
    function checkInputs() {
        if ($(messageBox).val() !== "" && $(nameBox).val() !== "") {
            return true;
        }
        return false;
    }

    // append new message to chat box
    database.ref("messages").on("child_added", function (childsnapshot) {
        let oldMessages = "";
        if ($(chatList).text() !== "") {
            let oldMessages = $(chatList).text() + "\n";
        }
        $("#messages").text(`${oldMessages}${childsnapshot.val().ts} ${childsnapshot.val().name}: ${childsnapshot.val().message}`);
    });

    // clear chat box of previous messages on load
    database.ref("messages").once("child_added", function (snapshot) {
        $("#messages").text("");
    });

});