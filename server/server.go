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
    id2char := []rune{'\n', ' ', '!', '"', '$', '%', 39, '(', ')', ',', '-', '.', ':', ';', '>', '?', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '´', 'Ä', 'Ö', 'Ü', 'ß', 'ä', 'ö', 'ü', '–', '’'}
    char2id := make(map[rune]float32)
    for i:=0; i<len(id2char); i++{
        char2id[id2char[i]] = float32(i)
    }
    temperature := float32(0.8)
    start_string := "%$Wenn nicht nur Zahlen und Figuren"
    generated_text := start_string

    start_runes := []rune(start_string)
    start_floats := make([][]float32, 1)
    start_floats[0] = make([]float32, len(start_runes))
    for i:=0; i<len(start_runes); i++ {
        start_floats[0][i] = char2id[start_runes[i]]
    }
    tensor, _ := tf.NewTensor(start_floats)

    //MODEL INITIALIZATION
    model, err := tf.LoadSavedModel("poetryModel", []string{"goTag"}, nil)

    if err != nil {
        fmt.Printf("Error loading saved model: %s\n", err.Error())
        return
    }

    defer model.Session.Close()

    pr, err := model.Session.NewPartialRun(
        []tf.Output{ model.Graph.Operation("inputLayer_input").Output(0), },
        []tf.Output{ model.Graph.Operation("outputLayer/add").Output(0), },
        []*tf.Operation{ model.Graph.Operation("outputLayer/add") },
    )
    if err != nil {
        panic(err)
    }

    for len(generated_text) < 1000 {
        fmt.Printf("%v", pr)

        //MODEL PREDICTIONS, ~100ms for initial predictions (35 length start string)
        result, err := pr.Run(
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
    
        //LOGITS TO CHAR PREDICTION
        predictions := batch_predictions[0]
    
        //apply temperature
        for i:=0; i < len(predictions); i++ {
            for j:=0; j < len(id2char); j++ {
                predictions[i][j] = predictions[i][j]/temperature
            }
        }
    
        //initialize 2d slice
        probabilities := make([][]float64, tensor.Shape()[1])
        for i:=0; i < int(tensor.Shape()[1]); i++{
            probabilities[i] = make([]float64, len(id2char))
        }
    
        //apply softmax
        for i:=0; i < len(predictions); i++ {
            sum := float64(0)
            for j:=0; j < len(id2char); j++ {
                sum += math.Exp(float64(predictions[i][j]))
            }
            for j:=0; j < len(id2char); j++ {
                probabilities[i][j] = math.Exp(float64(predictions[i][j]))/sum
            }
        }
    
        //random char id from probabilities
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

        //append char to generated text
        generated_text = generated_text + string(id2char[predicted_id])

        //set predicted char to be model input
        tensor, _ = tf.NewTensor([][]float32{{ float32(predicted_id) }})

        //symbol for poem end
        if id2char[predicted_id] == '$' { break }
    }

    fmt.Printf("%v\n", generated_text)
    
}