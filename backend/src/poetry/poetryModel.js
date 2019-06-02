const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
var model;
var id2char; 
var i; 
var char2id; 

async function init(){
  model = await tf.loadLayersModel('file://src/poetry/model/model.json');
  id2char = ['\n', ' ', '!', '"', '$', '%', "'", '(', ')', ',', '-', '.', ':', ';', '>', '?', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '´', 'Ä', 'Ö', 'Ü', 'ß', 'ä', 'ö', 'ü', '–', '’'];
  i = 0;
  char2id = [];
  id2char.forEach(element => {
    char2id[element] = i;
    i++;
  });
}

async function fullPoem(s) {
  // initialize returned poem with beginning
  var poem = s;
  //%: end of verse, $: end of poem, beginning sequence for model
  const start_string = '%$'+s;
  //convert string to input tensor
  var input = tf.tensor([start_string.split('').map(x => char2id[x])]);
  //TODO: choose max i
  for(var i = 0; i < 1000; i++){
    var predictions = model.predict(input);
    predictions = tf.squeeze(predictions, 0);
    //todo: add temperature
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

module.exports = {fullPoem, init};