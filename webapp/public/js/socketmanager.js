const socket = io({ rememberTransport: false, transports: ['websocket']});

socket.on('charstream', (c) => {
  if(c === '%'){
    $('#generatedpoem').append('\n');
  }else if(c === '$'){
    $('#buttons').fadeIn('slow');
  }else{
    $('#generatedpoem').append(c);
  }
});

socket.on('badinput', (error) => {
  resetInput('Bitte mit Worten inspirieren');
})
