package main

import (  
    "fmt"
    "math"
    "math/rand"
    "time"

    tf "github.com/tensorflow/tensorflow/tensorflow/go"
)

func init() {
    rand.Seed(time.Now().UTC().UnixNano())
}
  
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

    var probabilities [35][76]float64
    for i:=0; i < len(predictions); i++ {
        sum := float64(0)
        for j:=0; j < 76; j++ {
            sum += math.Exp(float64(predictions[i][j]))
        }
        for j:=0; j < 76; j++ {
            probabilities[i][j] = math.Exp(float64(predictions[i][j]))/sum
        }
    }

    prob_sum := float64(0)
    r := rand.Float64()
    p := probabilities[len(probabilities)-1]
    var predicted_id int
    for i:=0; i < len(p); i++ {
        prob_sum += p[i]
        if prob_sum >= r {
            predicted_id = i
            break
        }
    }
    fmt.Printf("%v\n", r)
    fmt.Printf("%v\n", predicted_id)
    fmt.Printf("%v\n", p[predicted_id])

    //fmt.Printf("SOFTMAX: %v \n", softmax[0])

    //fmt.Printf("Result value: %v \n", result[0].Value())

}