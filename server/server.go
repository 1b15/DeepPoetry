package main

import (  
    "fmt"

    tf "github.com/tensorflow/tensorflow/tensorflow/go"
)

func main() {  
    // replace myModel and myTag with the appropriate exported names in the chestrays-keras-binary-classification.ipynb
    model, err := tf.LoadSavedModel("poetryModel", []string{"goTag"}, nil)

    if err != nil {
        fmt.Printf("Error loading saved model: %s\n", err.Error())
        return
    }

    defer model.Session.Close()

    tensor, _ := tf.NewTensor([1][35]float32{
        {5, 4, 38, 44, 53, 53, 1, 53, 48, 42, 47, 59, 1, 53, 60, 57, 1, 39, 40, 47, 51, 44, 53, 1, 60, 53, 43, 1, 21, 48, 46, 60, 57, 44, 53},})
    //start_string := "%$Wenn nicht nur Zahlen und Figuren"

    result, err := model.Session.Run(
        map[tf.Output]*tf.Tensor{
            model.Graph.Operation("inputLayer_input").Output(0): tensor,
        },
        []tf.Output{
            model.Graph.Operation("outputLayer/add").Output(0),
        },
        nil,
    )

    if err != nil {
        fmt.Printf("Error running the session with input, err: %s\n", err.Error())
        return
    }

    batch_predictions := result[0].Value().([][][]float32)
    predictions := batch_predictions[0]

    fmt.Printf("it works: %v", predictions)

    //fmt.Printf("Result value: %v \n", result[0].Value())

}