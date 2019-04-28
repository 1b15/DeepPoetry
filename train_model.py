import tensorflow as tf
tf.enable_eager_execution()

import numpy as np
import os
import time

text = open('./Crawler/novalis.txt', 'rt', encoding='utf-8').read()

print ('Length of text: {} characters'.format(len(text)))

# unique characters in the file
vocab = sorted(set(text))
print ('{} unique characters'.format(len(vocab)))
print(vocab)

char2idx = {u:i for i, u in enumerate(vocab)}
idx2char = np.array(vocab)

text_as_int = np.array([char2idx[c] for c in text])

# max length sequence
seq_length = 100
examples_per_epoch = len(text)//seq_length

# Create training examples / targets
char_dataset = tf.data.Dataset.from_tensor_slices(text_as_int)

sequences = char_dataset.batch(seq_length+1, drop_remainder=True)

def split_input_target(chunk):
    input_text = chunk[:-1]
    target_text = chunk[1:]
    return input_text, target_text

dataset = sequences.map(split_input_target)

# Batch size
BATCH_SIZE = 64
steps_per_epoch = examples_per_epoch//BATCH_SIZE

# Buffer size to shuffle the dataset
BUFFER_SIZE = 10000

dataset = dataset.shuffle(BUFFER_SIZE).batch(BATCH_SIZE, drop_remainder=True)

# Length of the vocabulary in chars
vocab_size = len(vocab)

# The embedding dimension
embedding_dim = 256

# Number of RNN units
rnn_units = 1024

rnn = tf.keras.layers.CuDNNGRU

def build_model(vocab_size, embedding_dim, rnn_units, batch_size):
  model = tf.keras.Sequential([
    tf.keras.layers.Embedding(vocab_size, embedding_dim,
                              batch_input_shape=[batch_size, None]),
    rnn(rnn_units,
        return_sequences=True,
        recurrent_initializer='glorot_uniform',
        stateful=True),
    tf.keras.layers.Dense(vocab_size)
  ])
  return model

model = build_model(
  vocab_size = len(vocab),
  embedding_dim=embedding_dim,
  rnn_units=rnn_units,
  batch_size=BATCH_SIZE)

def loss(labels, logits):
  return tf.keras.metrics.sparse_categorical_crossentropy(labels, logits)

optimizer = tf.train.AdamOptimizer()

model.compile(
    optimizer = optimizer,
    loss = loss)

# Directory where the checkpoints will be saved
checkpoint_dir = './training_checkpoints'

# Name of the checkpoint files
checkpoint_prefix = os.path.join(checkpoint_dir, "ckpt_{epoch}")

model.load_weights(tf.train.latest_checkpoint(checkpoint_dir))

for epoch in range(50):
    start = time.time()

    # initializing the hidden state at the start of every epoch
    # initally hidden is None
    hidden = model.reset_states()

    for (batch_n, (inp, target)) in enumerate(dataset):
        with tf.GradientTape() as tape:
            # feeding the hidden state back into the model
            predictions = model(inp)
            loss = tf.losses.sparse_softmax_cross_entropy(target, predictions)

        grads = tape.gradient(loss, model.trainable_variables)
        optimizer.apply_gradients(zip(grads, model.trainable_variables))

        if batch_n % 100 == 0:
            template = 'Epoch {} Batch {} Loss {:.4f}'
            print(template.format(epoch + 1, batch_n, loss))

    # saving (checkpoint) the model every 5 epochs
    if (epoch + 1) % 5 == 0:
        model.save_weights(checkpoint_prefix.format(epoch=epoch))

    print('Epoch {} Loss {:.4f}'.format(epoch + 1, loss))
    print('Time taken for 1 epoch {} sec\n'.format(time.time() - start))

model.save_weights(checkpoint_prefix.format(epoch=epoch))
model = build_model(vocab_size, embedding_dim, rnn_units, batch_size=1)
model.load_weights(tf.train.latest_checkpoint(checkpoint_dir))
model.save('./model.h5')