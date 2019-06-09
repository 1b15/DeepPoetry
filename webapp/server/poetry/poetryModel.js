const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
var model;
var id2char; 
var i; 
var char2id; 

async function init(){
  model = await tf.loadLayersModel('file://server/poetry/model/model.json');
  id2char = ['\n', ' ', '!', '"', '$', '%', "'", '(', ')', ',', '-', '.', ':', ';', '>', '?', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '´', 'Ä', 'Ö', 'Ü', 'ß', 'ä', 'ö', 'ü', '–', '’'];
  i = 0;
  char2id = [];
  id2char.forEach(element => {
    char2id[element] = i;
    i++;
  });
}

async function fullPoem(s) {
  //input validation
  if(!validate_input(s)){
    socket.emit('badinput', 'badchar')
    return;
  }
  // initialize returned poem with beginning
  var poem = s;
  //%: end of verse, $: end of poem, beginning sequence for model
  const start_string = '%$'+s;
  //convert string to input tensor
  var input = tf.tensor([start_string.split('').map(x => char2id[x])]);
  for(var i = 0; i < 600; i++){
    var predictions = model.predict(input);
    predictions = tf.squeeze(predictions, 0);
    //scale logits for more reliable predictions
    for(var j = 0; j < predictions.length; j++){
      predictions[j] /= 0.8;
    }
    const mnomial = await tf.multinomial(predictions, 1).squeeze(1).array();
    const predicted_id = mnomial[mnomial.length - 1];
    const predicted_char = id2char[predicted_id]
    if(predicted_char==='$'){
      break;
    }
    poem += id2char[predicted_id];
    input = tf.tensor([[predicted_id]]);
  }
  return poem;
}

async function streamPoem(s, socket) {
  //input validation
  if(!validate_input(s)){
    socket.emit('badinput', 'badchar')
    return;
  }
  //%: end of verse, $: end of poem, beginning sequence for model
  const start_string = '%$'+s;
  //convert string to input tensor
  var input = tf.tensor([start_string.split('').map(x => char2id[x])]);
  
  //prediction loop
  var i = 0;
  var predicted_char = '';
  while( i < 500 || predicted_char != '\n'){
    //feed input into model
    var predictions = model.predict(input);
    //remove batch dimension
    predictions = tf.squeeze(predictions, 0);
    //scale logits for more reliable predictions
    for(var j = 0; j < predictions.length; j++){
      predictions[j] /= 0.8;
    }
    const mnomial = await tf.multinomial(predictions, 1).squeeze(1).array();
    const predicted_id = mnomial[mnomial.length - 1];
    predicted_char = id2char[predicted_id];
    socket.emit('charstream', predicted_char);
    await new Promise(res => setTimeout(res, 1));
    if(predicted_char==='$'){
      break;
    }
    input = tf.tensor([[predicted_id]]);
    i++;
  }
}

function validate_input(input) {
  var m = {}, uniquearr = []
  for (var i=0; i<input.length; i++) {
    var v = input[i];
    if (!m[v]) {
      uniquearr.push(v);
      m[v]=true;
    }
  }
  let result = true;
  uniquearr.forEach(function (item, index) {
    if(!id2char.includes(item)) {result = false;}
  });
  return result;
}

module.exports = {fullPoem, streamPoem, init};