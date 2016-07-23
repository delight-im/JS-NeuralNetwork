/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

"use strict";

var Neuron = require("./Neuron.js");

/**
 * An artificial output neuron that may be part of a layer in an artificial neural network
 *
 * @param {Layer} layer - the layer that this neuron belongs to
 * @constructor
 * @extends Neuron
 */
function OutputNeuron(layer) {

	// call the super class's constructor
	Neuron.call(this, layer);

}

// create a prototype that inherits from the super class's prototype
OutputNeuron.prototype = Object.create(Neuron.prototype);
// fix the constructor pointer so that it doesn't point to the super class
OutputNeuron.prototype.constructor = OutputNeuron;

/**
 * Calculates the error of this neuron from the desired output as specified
 *
 * @param {number} desiredOutput - the desired output for this neuron
 * @return {number} the error of this neuron
 */
OutputNeuron.prototype.calculateError = function (desiredOutput) {
	// return the difference between the desired output and the actual output
	return desiredOutput - this.getActivation();
};

/**
 * Updates the delta of this neuron using the expected output of this neuron
 *
 * @param {number} desiredOutput - the expected output of this neuron
 */
OutputNeuron.prototype.updateDelta = function (desiredOutput) {
	this._delta = this.getLayer().getActivationFunction().evaluateDerivative(this._input) * this.calculateError(desiredOutput);
};

module.exports = OutputNeuron;
