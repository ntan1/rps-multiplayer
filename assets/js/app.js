// todo: notification sounds
// todo: player queue
// todo: stricter input

$(document).ready(function () {

    // hide board till username selected
    $("#board").hide();

    // set username
    $(".submitUsername").on("click", function () {
        event.preventDefault();
        username = $(usernameBox).val();
        if (username !== "") {
            plRef.orderByChild("name").equalTo(username).once("value", function (player) {
                console.log(player.val());
                // check if username taken
                if (player.val() === null && playerCount < 2) {
                    $("#username-container").remove();
                    database.ref("players").child(username).set({
                        name: username,
                        choice: "",
                        stats: {
                            wins: 0,
                            losses: 0,
                            draws: 0
                        }
                    }, function () {
                        $("#board").show();
                    });
                } else if (playerCount >= 2) {
                    alert("Two players already in game ...");
                } else {
                    alert("username taken");
                }
            });
        }

        // remove from db on disconnect, needs to be in here for username
        plRef.child(username).onDisconnect().remove();
    });
    // add to queue if 2 people already there

    // database.ref("players").orderByChild("name").once("value", function (players) {
    //     players.forEach(function (player) {
    //         console.log(player.val());
    //     });
    // });

    // listen for choice changes in players
    plRef.on("value", function (players) {
        playerCount = Object.keys(players.val()).length;
        if (playerCount > 1) {
            players.forEach(function (player) {
                // check whether other player has chosen
                if (player.val().name !== username) {
                    if (player.val().choice !== "") {
                        if (choice != "") {
                            opChoice = player.val().choice;
                            $(opSelection).html(`<h3>${player.val().name} has picked ${player.val().choice}</h3>`);
                            checkWinner();
                            updateStats();
                            setTimeout(function () { reset() }, 2000);
                        } else {
                            $(opSelection).html(`<h3>${player.val().name} has picked, make your move</h3>`);
                        }
                    } else {
                        $(opSelection).html(`<h3>Waiting for ${player.val().name} to choose ...</h3>`);
                    }
                } else if (player.val().name === username) {
                    choice = player.val().choice;
                }
            });
        } else if (playerCount === 1) {
            $(opSelection).html(`<h3>Waiting for an opponent ...</h3>`);
        }
    });

    function checkWinner() {
        if (returnResult() === "win") {
            wins++;
            $(opSelection).append("<h3>You win!</h3>");
            console.log("you win!");
        } else if (returnResult() === "loss") {
            losses++;
            $(opSelection).append("<h3>You lose!</h3>");
            console.log("you lose!");
        } else {
            draws++;
            $(opSelection).append("<h3>Draw</h3>");
            console.log("draw");
        }
    }

    // check which hand won
    function returnResult() {
        if (choice === "rock") {
            switch (opChoice) {
                case "paper":
                    return "loss";
                case "scissors":
                    return "win";
                default:
                    return "draw"
            }
        } else if (choice === "paper") {
            switch (opChoice) {
                case "scissors":
                    return "loss";
                case "rock":
                    return "win";
                default:
                    return "draw"
            }
        } else if (choice === "scissors") {
            switch (opChoice) {
                case "rock":
                    return "loss";
                case "paper":
                    return "win";
                default:
                    return "draw"
            }
        }
    }

    function updateStats() {
        $("#wins").text(wins);
        $("#losses").text(losses);
        $("#draws").text(draws);
    }

    // reset player data
    function reset() {
        $(".selected").removeClass("selected");
        plRef.once("value", function (players) {
            players.forEach(function (player) {
                player.ref.update({
                    choice: "",
                    stats: {
                        wins: wins,
                        losses: losses,
                        draws: draws,
                    }
                });
            });
        });
    }

    // set player's choice
    $(".choice").on("click", function () {
        choice = $(this).data("choice");
        $(this).addClass("selected");
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
        console.log($(chatList).scrollTop());
        $(chatList).scrollTop($(chatList)[0].scrollHeight);
    });

    // clear chat box of previous messages on load
    msgRef.once("child_added", function (snapshot) {
        $("#messages").text("");
    });

});