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

var Connection = require("./Connection.js");

/**
 * An artificial neuron that may be part of a layer in an artificial neural network
 *
 * @param {Layer} layer - the layer that this neuron belongs to
 * @constructor
 */
function Neuron(layer) {

	/**
	 * The current input of this neuron
	 *
	 * @type {number}
	 * @private
	 */
	this._input = 0;

	/**
	 * The current activation of this neuron
	 *
	 * @type {number}
	 * @private
	 */
	this._activation = 0;

	/**
	 * The current error of this neuron scaled by the confidence it showed in predicting its output
	 *
	 * @type {number}
	 * @private
	 */
	this._delta = 0;

	/**
	 * The layer that this neuron belongs to
	 *
	 * @type {Layer}
	 * @private
	 */
	this._layer = layer;

	/**
	 * The list of outgoing connections from this neuron
	 *
	 * @type {Connection[]}
	 * @private
	 */
	this._connections = [];

}

/**
 * Returns the current activation of this neuron
 *
 * @return {number} the activation
 */
Neuron.prototype.getActivation = function () {
	return this._activation;
};

/**
 * Returns the current delta of this neuron
 *
 * @return {number}
 */
Neuron.prototype.getDelta = function () {
	return this._delta;
};

/**
 * Returns the current input of this neuron
 *
 * @return {number} the input
 */
Neuron.prototype.getInput = function () {
	return this._input;
};

/**
 * Returns the outgoing connection at the specified index
 *
 * @param {number} index - the connection to return
 * @return {Connection} the connection
 */
Neuron.prototype.getConnection = function (index) {
	return this._connections[index];
};

/** Resets this neuron */
Neuron.prototype.reset = function () {
	this._input = 0;
	this._activation = 0;
};

/** Propagates the activation from this neuron to the connected neurons */
Neuron.prototype.propagate = function () {
	// determine this neuron's activation
	this._activation = this._layer.getActivationFunction().evaluate(this._input);

	var connection;

	// for every connection from this neuron
	for (var i = 0; i < this._connections.length; i++) {
		connection = this._connections[i];

		connection.getTargetNeuron().feed(this._activation * connection.getWeight());
	}
};

/**
 * Feeds the specified value into this neuron
 *
 * @param {number} value - the value to add to this neuron's input
 */
Neuron.prototype.feed = function (value) {
	this._input += value;
};

/**
 * Adds a new connection to the other neuron that is specified
 *
 * @param {Neuron} targetNeuron - the other neuron to connect to
 */
Neuron.prototype.connectTo = function (targetNeuron) {
	var initialWeight;
	if (Neuron.preDefinedWeights.length) {
		// use the next pre-defined weight
		initialWeight = Neuron.preDefinedWeights.pop();
	}
	else {
		// initialize the weight randomly with a mean of zero
		initialWeight = this._layer.getPrng().getRandomFloat(0, 0.3) - 0.15;
	}

	this._connections.push(new Connection(targetNeuron, initialWeight));
};

/**
 * Returns the layer that this neuron belongs to
 *
 * @return {Layer} the layer
 */
Neuron.prototype.getLayer = function () {
	return this._layer;
};

/**
 * Calculates the error of this neuron
 *
 * @return {number} the error of this neuron
 */
Neuron.prototype.calculateError = function () {
	// prepare a variable for the error to be accumulated
	var error = 0;

	// for every connection
	for (var i = 0; i < this._connections.length; i++) {
		// accumulate the error by adding the weighted delta from the connection
		error += this._connections[i].getWeightedDelta();
	}

	// return the accumulated error
	return error;
};

/** Updates the delta of this neuron */
Neuron.prototype.updateDelta = function () {
	this._delta = this._layer.getActivationFunction().evaluateDerivative(this._input) * this.calculateError();
};

/**
 * Updates all weights for this neuron
 *
 * @param {number} learningRate - the learning rate to use
 * @param {boolean} immediate - whether to update the weights immediately or defer the update until later
 */
Neuron.prototype.updateWeightsAtConnections = function (learningRate, immediate) {
	var update;

	// for every connection
	for (var i = 0; i < this._connections.length; i++) {
		// calculate the product of the learning rate and the negative gradient
		update = learningRate * this._connections[i].getTargetNeuron().getDelta() * this.getActivation();
		// update the weight to move in the direction of a minimum of the error function
		this._connections[i].updateWeight(update, immediate);
	}
};

/** Releases all deferred weight updates */
Neuron.prototype.releaseWeightUpdatesAtConnections = function () {
	// for every connection
	for (var i = 0; i < this._connections.length; i++) {
		// release all pending weight updates
		this._connections[i].releaseWeightUpdates();
	}
};

Neuron.prototype.toJSON = function () {
	var connections = [];
	for (var i = 0; i < this._connections.length; i++) {
		connections.push(this._connections[i].toJSON());
	}

	return {
		"connections": connections
	}
};

Neuron.preDefinedWeights = [];

module.exports = Neuron;
