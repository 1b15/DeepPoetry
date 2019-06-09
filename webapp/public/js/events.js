$(function() {
    $("#poemtext").keypress(function (e) {
        if(e.which == 13) {
            $('#poemtext').attr('readonly','readonly');
            $('#poemtext').addClass("hidden");
            $("#generatedpoem").text($(this).val());
            socket.emit('poemcall', $(this).val());
            e.preventDefault();
        }
    });
});

$(document).ready(calculateFont);
$(window).resize(calculateFont);

function calculateFont() {
    $('#poemtext').css('font-size', Math.min(innerHeight, innerWidth)/500 + 0.5 + 'em');
    $('#generatedpoem').css('font-size', Math.min(innerHeight, innerWidth)/500 + 0.5 + 'em');
    console.log('resized');
}