/*
 * Copyright (c) delight.im <info@delight.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

var Neuron = require("./Neuron.js");

/**
 * A layer that may be part of an artificial neural network
 *
 * @param {number} size - the number of neurons to use in this layer
 * @param {ActivationFunction} activationFunction - the activation function that this layer should use
 * @param {Prng} prng - the PRNG that this layer should use
 * @constructor
 */
function Layer(size, activationFunction, prng) {

	/**
	 * The list of neurons in this layer
	 *
	 * @type {Neuron[]}
	 * @private
	 */
	this._neurons = [];

	/**
	 * The activation function that this layer uses
	 *
	 * @type {ActivationFunction}
	 * @private
	 */
	this._activationFunction = activationFunction;

	/**
	 * The PRNG that this layer uses
	 *
	 * @type {Prng}
	 * @private
	 */
	this._prng = prng;

	// create the neurons for this layer
	for (var i = 0; i < size; i++) {
		this._neurons.push(this._createNeuron());
	}

}

/**
 * Creates a new neuron for this layer
 *
 * @return {Neuron} the new neuron
 * @private
 */
Layer.prototype._createNeuron = function () {
	return new Neuron(this);
};

/** Propagates the output of all neurons in this layer */
Layer.prototype.propagateAllNeurons = function () {
	// for every neuron
	for (var i = 0; i < this._neurons.length; i++) {
		// propagate the neuron's activation
		this._neurons[i].propagate();
	}
};

/** Resets the neurons in this layer */
Layer.prototype.reset = function () {
	// for every neuron
	for (var i = 0; i < this._neurons.length; i++) {
		// reset the neuron
		this._neurons[i].reset();
	}
};

/**
 * Returns the number of neurons in this layer
 *
 * @return {number} the number of neurons
 */
Layer.prototype.getSize = function () {
	return this._neurons.length;
};

/**
 * Returns the neuron at the specified index
 *
 * @param {number} index - the neuron to return
 * @return {Neuron|OutputNeuron} the neuron
 */
Layer.prototype.getNeuron = function (index) {
	return this._neurons[index];
};

/** Updates the deltas in this layer */
Layer.prototype.updateDeltas = function () {
	// for every neuron
	for (var i = 0; i < this._neurons.length; i++) {
		// update the delta
		this._neurons[i].updateDelta();
	}
};

/**
 * Updates the weights for all neurons in this layer
 *
 * @param {number} learningRate - the learning rate to use
 * @param {boolean} immediate - whether to update the weights immediately or defer the update until later
 */
Layer.prototype.updateWeightsInLayer = function (learningRate, immediate) {
	// for every neuron
	for (var i = 0; i < this._neurons.length; i++) {
		// update the weights
		this._neurons[i].updateWeightsAtConnections(learningRate, immediate);
	}
};

/** Releases all deferred weight updates */
Layer.prototype.releaseWeightUpdatesInLayer = function () {
	// for every neuron
	for (var i = 0; i < this._neurons.length; i++) {
		// release all pending weight updates
		this._neurons[i].releaseWeightUpdatesAtConnections();
	}
};

/**
 * Returns the activation function for this layer
 *
 * @return {ActivationFunction} the activation function used by this layer
 */
Layer.prototype.getActivationFunction = function () {
	return this._activationFunction;
};

/**
 * Returns the PRNG for this layer
 *
 * @return {Prng} the PRNG used by this layer
 */
Layer.prototype.getPrng = function () {
	return this._prng;
};

Layer.prototype.toJSON = function () {
	var neurons = [];
	for (var i = 0; i < this._neurons.length; i++) {
		neurons.push(this._neurons[i].toJSON());
	}

	return {
		"neurons": neurons,
		"activationFunction": this._activationFunction.toJSON()
	}
};

module.exports = Layer;
