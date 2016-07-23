/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

"use strict";

/**
 * A connection to another neuron in an artificial neural network
 *
 * @constructor
 * @param {Neuron} targetNeuron - the neuron that is the target of this connection
 * @param {number} initialWeight - the initial weight of this connection
 */
function Connection(targetNeuron, initialWeight) {

	/**
	 * The neuron that is the target of this connection
	 *
	 * @type {Neuron}
	 * @private
	 */
	this._targetNeuron = targetNeuron;

	/**
	 * The current weight of this connection
	 *
	 * @type {number}
	 * @private
	 */
	this._weight = initialWeight;

	/**
	 * Accumulates all weight updates that are deferred until later
	 *
	 * @type {number}
	 * @private
	 */
	this._weightUpdatePending = 0;

}

/**
 * Returns the neuron that is the target of this connection
 *
 * @return {Neuron} the target neuron
 */
Connection.prototype.getTargetNeuron = function () {
	return this._targetNeuron;
};

/**
 * Returns the current weight of this connection
 *
 * @return {number} the current weight
 */
Connection.prototype.getWeight = function () {
	return this._weight;
};

/**
 * Increases the current weight of this connection by the specified value
 *
 * @param {number} addend - the value to increase this weight by
 * @param {boolean} immediate - whether to update the weights immediately or defer the update until later
 */
Connection.prototype.updateWeight = function (addend, immediate) {
	if (immediate) {
		this._weight += addend;
	}
	else {
		this._weightUpdatePending += addend;
	}
};

/** Releases all deferred weight updates */
Connection.prototype.releaseWeightUpdates = function () {
	// update the weights with the deferred changes
	this._weight += this._weightUpdatePending;
	// reset the accumulated changes
	this._weightUpdatePending = 0;
};

/**
 * Returns the delta of this connection's target neuron scaled by this connection's weight
 *
 * @return {number} the weighted delta
 */
Connection.prototype.getWeightedDelta = function () {
	return this._targetNeuron.getDelta() * this._weight;
};

Connection.prototype.toJSON = function () {
	return {
		"weight": this._weight
	};
};

module.exports = Connection;
