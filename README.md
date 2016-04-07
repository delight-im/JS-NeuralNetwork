# JS-NeuralNetwork

Neural networks in JavaScript. Well-documented and object-oriented.

## Installation

 * In the browser

   ```html
   <script type="text/javascript" src="dist/browser-bundle.min.js"></script>
   ```

 * In Node.js

   ```
   $ npm install @delight-im/neural-network
   ```

   and

   ```javascript
   var NeuralNetwork = require("@delight-im/neural-network");
   ```

## Usage

 * Creating a new instance

   * Neural network with 3 input neurons and 1 output neuron

     ```javascript
     var network = new NeuralNetwork.Type.Feedforward(3, [], 1);
     ```

   * Neural network with 4 input neurons, 3 hidden neurons and 2 output neurons

     ```javascript
     var network = new NeuralNetwork.Type.Feedforward(4, [ 3 ], 2);
     ```

   * Neural network with 6 input neurons, two hidden layers with 4 and 2 neurons, and 3 output neurons

     ```javascript
     var network = new NeuralNetwork.Type.Feedforward(6, [ 4, 2 ], 3);
     ```

 * Passing any number of additional options to the network

   ```javascript
   // pass an object containing the desired options as the fourth parameter
   var network = new NeuralNetwork.Type.Feedforward(3, [ 4 ], 1, {
       seed: 501935,
       learningRate: 0.3,
       hiddenLayerActivationFunction: new NeuralNetwork.Activation.HyperbolicTangent(),
       outputLayerActivationFunction: new NeuralNetwork.Activation.BinaryStep()
   });
   ```

 * Available activation functions

   ```javascript
   new NeuralNetwork.Activation.ArcTangent();
   new NeuralNetwork.Activation.BinaryStep();
   new NeuralNetwork.Activation.GaussianFunction();
   new NeuralNetwork.Activation.HyperbolicTangent();
   new NeuralNetwork.Activation.Identity();
   new NeuralNetwork.Activation.LogisticFunction();
   new NeuralNetwork.Activation.RectifiedLinearUnit();
   new NeuralNetwork.Activation.RectifiedLinearUnit(0.01);
   new NeuralNetwork.Activation.SinusoidFunction();
   ```

 * Training the network using supervised batch ("all-at-once") learning

   ```javascript
   // the first parameter is the array of inputs and the second parameter is the array of desired outputs
   // the third parameter is the optional number of iterations and the fourth parameter is the optional error threshold
   var error = network.trainBatch(
       [
           [0, 0, 1],
           [0, 1, 1],
           [1, 0, 1],
           [1, 1, 1]
       ],
       [
           [ 0 ],
           [ 1 ],
           [ 1 ],
           [ 0 ]
       ],
       60000,
       0.005
   );
   ```

 * Training the network using supervised online ("single-pattern") learning

   ```javascript
   // the first parameter is the input and the second parameter is the desired output
   var error = network.train([0, 0, 1], [ 0 ]);
   ```

 * Asking the network to predict some output from a supplied input pattern

   ```javascript
   // the single parameter is the input to process
   network.predict([ 0, 0, 1 ])
   ```

 * Saving the network with all its properties to a JSON string

   ```javascript
   var jsonStr = JSON.stringify(network);
   ```

 * Restoring the network with all its properties from a JSON string

   ```javascript
   var network = NeuralNetwork.Type.Feedforward.fromJson(jsonStr);
   ```

## Development

 * Prerequisites

   ```
   $ npm install -g uglify-js
   $ npm install -g browserify
   ```

 * Building the browser bundle

   ```
   $ browserify src/main.js --standalone NeuralNetwork > dist/browser-bundle.js
   $ uglifyjs dist/browser-bundle.js --compress --preamble "$(< src/header.js)" > dist/browser-bundle.min.js
   $ rm dist/browser-bundle.js
   ```

 * Running the Node.js examples

   ```
   $ node examples/node.js
   ```

## Contributing

All contributions are welcome! If you wish to contribute, please create an issue first so that your feature, problem or question can be discussed.

## License

```
Copyright (c) delight.im <info@delight.im>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
