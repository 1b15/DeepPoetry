const socket = io({ rememberTransport: false, transports: ['websocket']});

socket.on('connect', () => {
  console.log('connected to server')
});

socket.on('charstream', (c) => {
  if(c === '%'){
    $("#generatedpoem").append('\n');
  }else{
    $("#generatedpoem").append(c);
  }
});

socket.on('badinput', (error) => {
  console.log(error)
  $('#poemtext').removeAttr('readonly');
  $('#poemtext').removeClass('hidden');
  $("#poemtext").val('');
  $('#poemtext').attr('placeholder', 'Bitte mit Worten inspirieren');
  $('#poemtext').focus();
  $("#generatedpoem").text('');
})