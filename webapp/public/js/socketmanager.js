const socket = io({ rememberTransport: false, transports: ['websocket']});

socket.on('connect', () => {
  console.log('connected to server')
});

socket.on('charstream', (c) => {
    console.log('receiving...')
    if(c === '%'){
      $("#generatedpoem").append('\n');
    }else{
      $("#generatedpoem").append(c);
    }
});