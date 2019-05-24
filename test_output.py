import tensorflow as tf
tf.enable_eager_execution()

import numpy as np

#set correct vocab depending on dataset
vocab = ['\n', ' ', '!', '"', '$', '%', "'", '(', ')', ',', '-', '.', ':', ';', '>', '?', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '´', 'Ä', 'Ö', 'Ü', 'ß', 'ä', 'ö', 'ü', '–', '’']

char2idx = {u:i for i, u in enumerate(vocab)}
print(char2idx)
idx2char = np.array(vocab)

model = tf.keras.models.load_model('./model.h5')

def generate_text(model, start_string):
    # Number of characters to generate
    num_generate = 1000

    # Converting our start string to numbers (vectorizing)
    input_eval = [char2idx[s] for s in start_string]
    input_eval = tf.expand_dims(input_eval, 0)

    # Empty string to store our results
    text_generated = []

    # Low temperatures results in more predictable text.
    # Higher temperatures results in more surprising text.
    # Experiment to find the best setting.
    temperature = 1

    # Here batch size == 1
    model.reset_states()

    #LOOP
    predictions = model(input_eval)
    # remove the batch dimension
    predictions = tf.squeeze(predictions, 0)

    # using a multinomial distribution to predict the word returned by the model
    predictions = predictions / temperature
    #print(predictions)
    #print(tf.nn.softmax(predictions).numpy())
    predicted_id = tf.multinomial(predictions, num_samples=1)[-1, 0].numpy()
    # We pass the predicted word as the next input to the model
    # along with the previous hidden state
    print(predicted_id)
    input_eval = tf.expand_dims([predicted_id], 0)
    print(input_eval.numpy())

    text_generated.append(idx2char[predicted_id])

    return (start_string + ''.join(text_generated))

print(generate_text(model, start_string=u"%$Wenn nicht nur Zahlen und Figuren"))
