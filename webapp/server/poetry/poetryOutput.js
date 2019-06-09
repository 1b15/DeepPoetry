import {initModel, validateInput, generateChar} from './poetryUtils.js';

async function streamPoem(s, socket) {  
  //input validation
  if(!validateInput(s)){
    socket.emit('badinput', 'badchar');
    return;
  }

  var [model, input] = await initModel(s);

  //prediction loop
  var i = 0;
  var predicted_char = '';
  //end poem after 500 words with complete verse if no natural end
  while( i < 500 || (predicted_char != '\n' && predicted_char != ',')){
    //emits next character on sleep
    socket.emit('charstream', predicted_char);
    await new Promise(res => setTimeout(res, 1));

    //end of poem condition
    if(predicted_char==='$'){
      return;
    }

    //generate next char
    [input, predicted_char] = await generateChar(model, input);
    i++;
  }
  //emit end of poem
  socket.emit('charstream', '\n\n$');
}

async function fullPoem(s) {
  //input validation
  if(!validateInput(s)){
    return 'Bad Input';
  }

  var [model, input] = await initModel(s);

  // initialize returned poem with beginning
  var poem = s;
  //prediction loop
  var i = 0;
  var predicted_char = '';
  //end poem after 500 words with complete verse if no natural end
  while( i < 500 || (predicted_char != '\n' && predicted_char != ',')){
    [input, predicted_char] = await generateChar(model, input);
    if(predicted_char==='$'){
      break;
    }else if(predicted_char==='%'){
      predicted_char = '\n';
    }
    poem += predicted_char;
    i++;
  }
  return poem;
}

module.exports = {fullPoem, streamPoem};