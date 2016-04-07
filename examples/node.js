"use strict";

var NeuralNetwork = require("../src/main.js");

var network = new NeuralNetwork.Type.Feedforward(2, [ 4 ], 1, {
	seed: 501935,
	learningRate: 0.3,
	hiddenLayerActivationFunction: new NeuralNetwork.Activation.Identity(),
	outputLayerActivationFunction: new NeuralNetwork.Activation.Identity()
});

console.log("Predictions *before* training");
console.log(network.predict([ 0, 0 ]));
console.log(network.predict([ 0, 1 ]));
console.log(network.predict([ 1, 0 ]));
console.log(network.predict([ 1, 1 ]));

// training in batch mode
var error = network.trainBatch(
		[
			[ 0, 1 ],
			[ 1, 1 ]
		],
		[
			[ 0 ],
			[ 1 ]
		],
		5000,
		0.0001
);

console.log("----------");
console.log("error after training = "+error);
console.log("----------");

console.log("Predictions *after* training");
console.log(network.predict([ 0, 0 ]));
console.log(network.predict([ 0, 1 ]));
console.log(network.predict([ 1, 0 ]));
console.log(network.predict([ 1, 1 ]));
