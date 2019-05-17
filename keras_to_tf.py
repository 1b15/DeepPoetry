import numpy as np
import tensorflow as tf
from keras import backend as K
from keras import Sequential
from keras.layers import Embedding, Dense, GRU
from keras.initializers import glorot_uniform as glorot_uniform

#set correct vocab depending on dataset
vocab = ['\n', ' ', '!', '"', '$', '%', "'", '(', ')', ',', '-', '.', ':', ';', '>', '?', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '´', 'Ä', 'Ö', 'Ü', 'ß', 'ä', 'ö', 'ü', '–', '’']

char2idx = {u:i for i, u in enumerate(vocab)}
idx2char = np.array(vocab)

# Batch size
BATCH_SIZE = 1

# The embedding dimension
embedding_dim = 256

# Number of RNN units
rnn_units = 1024

sess = tf.Session()  
K.set_session(sess)  
model = Sequential()
model.add(Embedding(len(vocab), embedding_dim, batch_input_shape=[BATCH_SIZE, None], name="inputLayer"))
model.add(GRU(rnn_units, return_sequences=True, recurrent_initializer=glorot_uniform(), recurrent_activation='sigmoid', stateful=True))
model.add(Dense(len(vocab), name="outputLayer"))

def loss(labels, logits):
  return tf.keras.metrics.sparse_categorical_crossentropy(labels, logits)

model.compile(loss=loss, optimizer=tf.train.AdamOptimizer())

print([n.name for n in tf.get_default_graph().as_graph_def().node])

model.load_weights('./model.h5')

# Use TF to save the graph model instead of Keras save model to load it in Golang
builder = tf.saved_model.builder.SavedModelBuilder("poetryModel")
# Tag the model, required for Go
builder.add_meta_graph_and_variables(sess, ["goTag"])
builder.save()
sess.close()