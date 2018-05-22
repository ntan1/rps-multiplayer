$(document).ready(function() {

    $(".choice").on("click", function() {
        let yourChoice = $(this).data("choice");
        console.log(yourChoice);
    });

});