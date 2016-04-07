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

var Prng = require("@delight-im/prng");
var Layer = require("./Layer.js");
var Identity = require("./activation/Identity.js");
var OutputLayer = require("./OutputLayer.js");
var HyperbolicTangent = require("./activation/HyperbolicTangent.js");

/**
 * Artificial neural network
 *
 * Neural networks take some input and try to predict the desired output
 *
 * A network can be applied to function approximation, regression analysis, classification, data processing, etc.
 *
 * When there is no hidden layer, this is called a "single-layer network", since the input layer is usually not counted
 *
 * More hidden layers allow for solutions to more complex problems, but such networks may be harder to manage and train
 *
 * If you don't know where to start, try a 2-layer or 3-layer neural network first (i.e. 1 or 2 hidden layers)
 *
 * When there are lots of hidden layers, e.g. 10 to 20, it's called "deep learning", but that may not be what you need
 *
 * The "knowledge" (or learned behavior) of a network is stored in its weights
 *
 * The response of a network is not generally analyzable so that a lot of trial and error may be required
 *
 * Parameters that can be experimented with are hidden layer depth and size and choice of activation function
 *
 * While universal approximators in theory, there is no guarantee of convergence for neural networks in practice
 *
 * @param {number} inputNeurons - the number of neurons to use in the input layer
 * @param {number[]} hiddenNeurons - the number of neurons to use per hidden layer
 * @param {number} outputNeurons - the number of neurons to use in the output layer
 * @param {Object} [options]
 * @param {number} [options.seed] - the seed to use for deterministic results
 * @param {number} [options.learningRate] - the learning rate to use
 * @param {ActivationFunction} [options.hiddenLayerActivationFunction] - the activation function for the hidden layer
 * @param {ActivationFunction} [options.outputLayerActivationFunction] - the activation function for the output layer
 * @constructor
 */
function NeuralNetwork(inputNeurons, hiddenNeurons, outputNeurons, options) {

	options = options || {};

	/**
	 * The layers that this network consists of
	 *
	 * @type {Layer[]|OutputLayer[]}
	 * @private
	 */
	this._layers = [];

	/**
	 * The seed of this network (if any)
	 *
	 * @type {number|undefined}
	 * @private
	 */
	this._seed = options.seed || undefined;

	var prng = new Prng(this._seed);

	options.hiddenLayerActivationFunction = options.hiddenLayerActivationFunction || new HyperbolicTangent();
	options.outputLayerActivationFunction = options.outputLayerActivationFunction || new HyperbolicTangent();

	// add the input layer
	this._layers.push(new Layer(inputNeurons, new Identity(), prng));

	// add the hidden layers
	for (var i = 0; i < hiddenNeurons.length; i++) {
		this._layers.push(new Layer(hiddenNeurons[i], options.hiddenLayerActivationFunction, prng));
	}

	// add the output layer
	this._layers.push(new OutputLayer(outputNeurons, options.outputLayerActivationFunction, prng));

	/**
	 * The current learning rate of this network
	 *
	 * @type {number}
	 * @private
	 */
	this._learningRate = options.learningRate || 0.3;

}

/**
 * Returns the network's output for the previously supplied input
 *
 * @return {number[]} the network's output
 * @private
 */
NeuralNetwork.prototype._getOutput = function () {
	var outputLayer = this.getOutputLayer();
	var outputLayerSize = outputLayer.getSize();

	var output = [];

	for (var i = 0; i < outputLayerSize; i++) {
		output.push(outputLayer.getNeuron(i).getActivation());
	}

	return output;
};

/**
 * Feeds the specified input into the network
 *
 * @param {number[]} input - the input to process
 * @private
 * @abstract
 */
NeuralNetwork.prototype._feed = function (input) {
	throw "Method not implemented in subclass `"+this.constructor.name+"`";
};

/**
 * Tries to predict the output from the specified input
 *
 * @param {number[]} input - the input to process
 * @return {number[]} the output predicted by this network
 */
NeuralNetwork.prototype.predict = function (input) {
	this._feed(input);

	return this._getOutput();
};

/**
 * Uses backpropagation to update deltas in all layers starting with the output layer
 *
 * @param {number[]} desiredOutput - the expected output
 * @private
 */
NeuralNetwork.prototype._backpropagate = function (desiredOutput) {
	// update the deltas in the output layer
	this.getOutputLayer().updateDeltas(desiredOutput);

	// for all hidden layers (in reverse order)
	for (var layerIndex = this._layers.length - 2; layerIndex > 0; layerIndex--) {
		// update the deltas
		this.getLayer(layerIndex).updateDeltas();
	}
};

/**
 * Updates the weights for all layers in this network
 *
 * @param {boolean} immediate - whether to update the weights immediately or defer the update until later
 * @private
 */
NeuralNetwork.prototype._updateWeightsInNetwork = function (immediate) {
	// for the input layer and all hidden layers
	for (var i = 0; i < this._layers.length - 1; i++) {
		// update the weights
		this._layers[i].updateWeightsInLayer(this._learningRate, immediate);
	}
};

/**
 * Releases all deferred weight updates
 *
 * @private
 */
NeuralNetwork.prototype._releaseWeightUpdatesInNetwork = function () {
	// for the input layer and all hidden layers
	for (var i = 0; i < this._layers.length - 1; i++) {
		// release all pending weight updates
		this._layers[i].releaseWeightUpdatesInLayer();
	}
};

/**
 * Trains the network using supervised online ("single-pattern") learning (as opposed to batch learning)
 *
 * Use online learning to supply individual training examples at a time
 *
 * All subsequent training examples will thus be run on a network that has already updated by changings its weights
 *
 * This is useful when data becomes available in a sequential order and is not available all at once
 *
 * The technique may also be used when train on the entire dataset is computationally too expensive
 *
 * @param {number[]} input - the input for an individual training example
 * @param {number[]} desiredOutput - the expected output for an individual training example
 * @return {number} the mean squared error
 */
NeuralNetwork.prototype.train = function (input, desiredOutput) {
	var outputLayer = this.getOutputLayer();

	// feed the training input into the network
	this._feed(input);
	// calculate and propagate back the errors from the output layer
	this._backpropagate(desiredOutput);
	// calculate the sum-squared error
	var sumSquaredError = outputLayer.calculateSumSquaredError(desiredOutput);
	// update the weights in this network
	this._updateWeightsInNetwork(true);

	// return the mean squared error
	return sumSquaredError / outputLayer.getSize();
};

/**
 * Trains the network using supervised batch ("all-at-once") learning (as opposed to online learning)
 *
 * Use batch learning to supply multiple training examples (i.e. the entire dataset) at once
 *
 * All training examples will be run on a network with the same weights per iteration
 *
 * This is the recommended technique if all training data is available apriori and it's computationally feasible
 *
 * @param {number[][]} inputs - the inputs per training example
 * @param {number[][]} desiredOutputs - the expected outputs per training example
 * @param {number} [iterations] - the maximum number of iterations to train
 * @param {number} [errorThreshold] - the desired error threshold that will cause training to be finished when reached
 * @return {number} the mean squared error
 */
NeuralNetwork.prototype.trainBatch = function (inputs, desiredOutputs, iterations, errorThreshold) {
	if (inputs.length !== desiredOutputs.length) {
		throw "Number of input patterns (`"+inputs.length+"`) and output patterns (`"+desiredOutputs.length+"`) must match";
	}

	iterations = iterations || 1;
	errorThreshold = errorThreshold || 0.005;

	var outputLayer = this.getOutputLayer();
	var outputLayerSize = outputLayer.getSize();
	var error = Number.POSITIVE_INFINITY;

	// until the maximum number of iterations or the desired error threshold has been reached (whichever comes first)
	for (var i = 0; i < iterations && error > errorThreshold; i++) {
		// reset the accumulated error
		error = 0;

		// for every training pattern
		for (var k = 0; k < inputs.length; k++) {
			// feed the training input into the network
			this._feed(inputs[k]);
			// calculate and propagate back the errors from the output layer
			this._backpropagate(desiredOutputs[k]);
			// update the weights in this network
			this._updateWeightsInNetwork(false);
			// accumulate the error
			error += outputLayer.calculateSumSquaredError(desiredOutputs[k]);
		}

		// turn the total sum-squared error into the mean squared error
		error /= inputs.length * outputLayerSize;

		this._releaseWeightUpdatesInNetwork();
	}

	// return the final mean squared error
	return error;
};

/** Resets the layers in this network */
NeuralNetwork.prototype.reset = function () {
	// for every layer
	for (var i = 0; i < this._layers.length; i++) {
		// reset the layer
		this._layers[i].reset();
	}
};

/**
 * Returns this network's learning rate
 *
 * @return {number} the current learning rate
 */
NeuralNetwork.prototype.getLearningRate = function () {
	return this._learningRate;
};

/**
 * Returns the number of layers in this network
 *
 * @return {Number} the number of layers
 */
NeuralNetwork.prototype.getNumberOfLayers = function () {
	return this._layers.length;
};

/**
 * Returns the layer at the specified index
 *
 * @param {number} index - the layer to return
 * @return {Layer|OutputLayer}
 */
NeuralNetwork.prototype.getLayer = function (index) {
	return this._layers[index];
};

/**
 * Returns the input layer for this network
 *
 * @return {Layer} the input layer
 */
NeuralNetwork.prototype.getInputLayer = function () {
	return this.getLayer(0);
};

/**
 * Returns the output layer for this network
 *
 * @return {OutputLayer} the output layer
 */
NeuralNetwork.prototype.getOutputLayer = function () {
	return this.getLayer(this._layers.length - 1);
};

NeuralNetwork.prototype.toJSON = function () {
	var layers = [];
	for (var i = 0; i < this._layers.length; i++) {
		layers.push(this._layers[i].toJSON());
	}

	return {
		"layers": layers,
		"learningRate": this._learningRate,
		"seed": this._seed
	}
};

module.exports = NeuralNetwork;
