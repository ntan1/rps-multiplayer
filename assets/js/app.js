$(document).ready(function () {

    // set username
    $(".submitUsername").on("click", function () {
        event.preventDefault();
        username = $(usernameBox).val();
        if (username !== "") {
            username = $(usernameBox).val();
            $("#username-container").remove();
            database.ref(`players/${username}`).set({
                name: username,
                choice: "",
                stats: {
                    wins: 0,
                    losses: 0,
                    draws: 0
                }
            }, function () {
            });
        }

        // remove from db on disconnect, needs to be in here for username
        plRef.child(username).onDisconnect().remove()
            .then(function () {
                console.log(`${username} has left`);
            })
            .catch(function (error) {
                console.log(`Remove failed: ${error.message}`);
            });
    });
    // update active player count

    // database.ref("players").orderByChild("name").once("value", function (players) {
    //     players.forEach(function (player) {
    //         console.log(player.val());
    //     });
    // });


    // listen for choice changes in players
    plRef.on("value", function () {

    });

    // set player's choice
    $(".choice").on("click", function () {
        let choice = $(this).data("choice");
        plRef.child(username).once("value", function (player) {
            player.ref.update({ choice: choice });
        });
    });

    // send message
    $(".submitMessage").on("click", function (event) {
        event.preventDefault();
        if (checkInputs()) {
            let message = $(messageBox).val();
            let ts = moment().format('h:mm:ss a');
            $(messageBox).val("");
            msgRef.push({
                name: username,
                message: message,
                ts: ts
            });
        }
    });

    // check input boxes not empty
    function checkInputs() {
        if ($(messageBox).val() !== "" && username !== "") {
            return true;
        }
        return false;
    }

    // append new message to chat box
    msgRef.on("child_added", function (childsnapshot) {
        if ($(chatList).text() !== "") {
            var oldMessages = $(chatList).text() + "\n";
        } else {
            var oldMessages = "";
        }
        $("#messages").text(`${oldMessages}${childsnapshot.val().ts} ${childsnapshot.val().name}: ${childsnapshot.val().message}`);
    });

    // clear chat box of previous messages on load
    msgRef.once("child_added", function (snapshot) {
        $("#messages").text("");
    });

});