$(function() {
    $("#poemtext").keypress(function (e) {
        if(e.which == 13) {
            $('input[type="text"], textarea').attr('readonly','readonly');
            $(this).addClass("hidden");
            $("#generatedpoem").text($(this).val());
            socket.emit('poemcall', $(this).val());
            //$("#generatedpoem").text($(this).val() + "And nodding by the fire, take down this book,\nAnd slowly read, and dream of the soft look\nYour eyes had once, and of their shadows deep;\n\nHow many loved your moments of glad grace,\nAnd loved your beauty with love false or true,\nBut one man loved the pilgrim soul in you,\nAnd loved the sorrows of your changing face;\n\nAnd bending down beside the glowing bars,\nMurmur, a little sadly, how Love fled\nAnd paced upon the mountains overhead\nAnd hid his face amid a crowd of stars.");
            e.preventDefault();
        }
    });
});
