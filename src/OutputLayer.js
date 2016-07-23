/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

"use strict";

var Layer = require("./Layer.js");
var OutputNeuron = require("./OutputNeuron.js");

/**
 * An output layer that may be part of an artificial neural network
 *
 * @param {number} size - the number of neurons to use in this layer
 * @param {ActivationFunction} activationFunction - the activation function that this layer should use
 * @param {Prng} prng - the PRNG that this layer should use
 * @constructor
 * @extends Layer
 */
function OutputLayer(size, activationFunction, prng) {

	// call the super class's constructor
	Layer.call(this, size, activationFunction, prng);

}

// create a prototype that inherits from the super class's prototype
OutputLayer.prototype = Object.create(Layer.prototype);
// fix the constructor pointer so that it doesn't point to the super class
OutputLayer.prototype.constructor = OutputLayer;

/**
 * Creates a new neuron for this layer
 *
 * @return {OutputNeuron} the new neuron
 * @private
 */
OutputLayer.prototype._createNeuron = function () {
	return new OutputNeuron(this);
};

/**
 * Updates the deltas in this layer
 *
 * @param {number[]} desiredOutput - the desired output of this layer
 */
OutputLayer.prototype.updateDeltas = function (desiredOutput) {
	var numNeurons = this.getSize();

	if (desiredOutput.length !== numNeurons) {
		throw "Size of desired output (`"+desiredOutput.length+"`) and number of output neurons (`"+numNeurons+"`) must match";
	}

	// for every neuron
	for (var i = 0; i < numNeurons; i++) {
		// update the delta
		this.getNeuron(i).updateDelta(desiredOutput[i]);
	}
};

/**
 * Calculates the sum of the squares of all errors in this layer
 *
 * @param {number[]} desiredOutput - the desired output of this layer
 * @return {number} the sum-squared error of this layer
 */
OutputLayer.prototype.calculateSumSquaredError = function (desiredOutput) {
	// get the number of output neurons
	var numOutputs = this.getSize();

	// prepare a variable to accumulate the squared errors
	var squaredErrors = 0;

	var error;

	// for each output neuron
	for (var i = 0; i < numOutputs; i++) {
		// calculate the error of the individual neuron
		error = this.getNeuron(i).calculateError(desiredOutput[i]);
		// add the square of the individual error to the sum
		squaredErrors += Math.pow(error, 2);
	}

	// return the sum-squared error
	return squaredErrors;
};

module.exports = OutputLayer;
