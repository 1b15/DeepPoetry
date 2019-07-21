# DeepPoetry

A simple TF Keras model trained on ~200k characters of German poetry from the romantic era that will generate a poem based on initial input.

Try it out yourself: `docker run -p <your port>:3000 -d 1b15/deep-poetry`

The Docker image runs the model in a Node.JS server with a cute frontend.

For copyright reasons, I didn't include any training data in this repo, but you will find a BeautifulSoup-based web crawler that prints out a lot of it.
Also, you can find the trained model in the root directory and at /webapp/server/poetry/model .
