$(function() {
    $("#poemtext").keypress(function (e) {
        if(e.which == 13) {
            $('input[type="text"], textarea').attr('readonly','readonly');
            $(this).val("abc");
            e.preventDefault();
        }
    });
});
