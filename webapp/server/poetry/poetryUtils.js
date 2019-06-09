const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

var id2char = ['\n', ' ', '!', '"', '$', '%', "'", '(', ')', ',', '-', '.', ':', ';', '>', '?', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '´', 'Ä', 'Ö', 'Ü', 'ß', 'ä', 'ö', 'ü', '–', '’'];
var i = 0;
var char2id = [];
id2char.forEach(element => {
  char2id[element] = i;
  i++;
});

//initializes model and initial input
async function initModel(s){
  const model = await tf.loadLayersModel('file://server/poetry/model/model.json');
  //%: end of verse, $: end of poem, beginning sequence for model
  const start_string = '%$'+s;
  //convert string to input tensor
  var input = tf.tensor([start_string.split('').map(x => char2id[x])]);
  return [model, input];
}

//checks if every char in input is in id2char
function validateInput(input) {
  var m = {}, uniquearr = [];
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

async function generateChar(model, input){
  //feed input into model
  var predictions = model.predict(input);
  //remove batch dimension
  predictions = tf.squeeze(predictions, 0);
  //scale logits for more reliable predictions
  for(var j = 0; j < predictions.length; j++){
    predictions[j] /= 0.8;
  }
  //multinomial distribution to predict char from logits
  const mnomial = await tf.multinomial(predictions, 1).squeeze(1).array();
  //take last char of prediction array
  const predicted_id = mnomial[mnomial.length - 1];
  const predicted_char = id2char[predicted_id];
  
  //feed output back into prediction loop
  input = tf.tensor([[predicted_id]]);

  return [input, predicted_char];
}

module.exports = {initModel, validateInput, generateChar};