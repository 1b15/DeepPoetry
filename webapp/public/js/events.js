$(document).ready(calculateFont);
$(window).resize(calculateFont);

$(function() {
    $('#poemtext').keypress(function (e) {
        if(e.which == 13) {
            $('#poemtext').attr('readonly','readonly');
            $('#poemtext').addClass('hidden');
            $('#generatedpoem').text($(this).val());
            socket.emit('poemcall', $(this).val());
            e.preventDefault();
        }
    });
});

function calculateFont() {
    $('#poemtext').css('font-size', Math.min(innerHeight, innerWidth)/500 + 0.3 + 'em');
    $('#generatedpoem').css('font-size', Math.min(innerHeight, innerWidth)/500 + 0.3 + 'em');
    $('button').css('font-size', Math.min(innerHeight, innerWidth)/500 + 0.3 + 'em');
}

function resetInput(placeholder) {
    $('#poemtext').removeAttr('readonly');
    $('#poemtext').removeClass('hidden');
    $('#poemtext').val('');
    $('#poemtext').attr('placeholder', placeholder);
    $('#poemtext').attr('size', $('#poemtext').attr('placeholder').length);
    $('#poemtext').focus();
    $('#generatedpoem').text('');
    $('#buttons').hide();
}