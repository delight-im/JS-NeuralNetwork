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

var NeuralNetwork = require("./NeuralNetwork.js");
var Neuron = require("./Neuron.js");

var ArcTangent = require("./activation/ArcTangent.js");
var BinaryStep = require("./activation/BinaryStep.js");
var GaussianFunction = require("./activation/GaussianFunction.js");
var HyperbolicTangent = require("./activation/HyperbolicTangent.js");
var Identity = require("./activation/Identity.js");
var LogisticFunction = require("./activation/LogisticFunction.js");
var RectifiedLinearUnit = require("./activation/RectifiedLinearUnit.js");
var SinusoidFunction = require("./activation/SinusoidFunction.js");

/**
 * Artificial feedforward neural network using a directed acyclic graph as its graph
 *
 * All information travels only forward, i.e. from the input nodes, through the optional hidden nodes, to the output nodes
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
 * @extends NeuralNetwork
 */
function FeedforwardNeuralNetwork(inputNeurons, hiddenNeurons, outputNeurons, options) {

	// call the super class's constructor
	NeuralNetwork.call(this, inputNeurons, hiddenNeurons, outputNeurons, options);

	this._createConnections();

}

// create a prototype that inherits from the super class's prototype
FeedforwardNeuralNetwork.prototype = Object.create(NeuralNetwork.prototype);
// fix the constructor pointer so that it doesn't point to the super class
FeedforwardNeuralNetwork.prototype.constructor = FeedforwardNeuralNetwork;

/**
 * Feeds the specified input into the network
 *
 * @param {number[]} input - the input to process
 * @private
 */
FeedforwardNeuralNetwork.prototype._feed = function (input) {
	// prepare the network for the new input
	this.reset();

	// get the input layer
	var inputLayer = this.getInputLayer();

	var inputLayerSize = inputLayer.getSize();

	// validate the size of the supplied input
	if (input.length !== inputLayerSize) {
		throw "Size of input layer (`"+inputLayerSize+"`) and supplied input (`"+input.length+"`) must match";
	}

	var neuron;

	// for every neuron in the input layer
	for (var i = 0; i < inputLayerSize; i++) {
		neuron = inputLayer.getNeuron(i);

		// feed the input into the neuron
		neuron.feed(input[i]);
	}

	var numLayers = this.getNumberOfLayers();

	// for every layer
	for (var k = 0; k < numLayers; k++) {
		// propagate the activation
		this.getLayer(k).propagateAllNeurons();
	}
};

/**
 * Creates the connections between the layers of this network so that they represent a fully-connected network
 *
 * @private
 */
FeedforwardNeuralNetwork.prototype._createConnections = function () {
	var numLayers = this.getNumberOfLayers();
	var previousLayer;
	var previousLayerSize;
	var currentLayer;
	var currentLayerSize;

	// for every layer except for the input layer
	for (var i = 1; i < numLayers; i++) {
		previousLayer = this.getLayer(i - 1);
		previousLayerSize = previousLayer.getSize();
		currentLayer = this.getLayer(i);
		currentLayerSize = currentLayer.getSize();

		// for every neuron in the previous layer
		for (var k = 0; k < previousLayerSize; k++) {
			// for every neuron in the current layer
			for (var m = 0; m < currentLayerSize; m++) {
				// connect the previous layer's neuron to the current layer's neuron
				previousLayer.getNeuron(k).connectTo(currentLayer.getNeuron(m));
			}
		}
	}
};

/**
 * Restores a neural network instance from the supplied JSON string
 *
 * @param {string} jsonString - the JSON string to restore from
 * @return {FeedforwardNeuralNetwork} the restored network instance
 */
FeedforwardNeuralNetwork.fromJson = function (jsonString) {
	function flattenArray(arr) {
		return arr.reduce(function(a, b) {
			return a.concat(b);
		}, []);
	}

	function createWeightsListFromLayer(layerObj) {
		return flattenArray(layerObj.neurons.map(function (each) {
			return each.connections.map(function (each) {
				return each.weight;
			});
		}));
	}

	function createActivationFunctionFromName(name) {
		switch (name) {
			case "ArcTangent":
				return new ArcTangent();
			case "BinaryStep":
				return new BinaryStep();
			case "GaussianFunction":
				return new GaussianFunction();
			case "HyperbolicTangent":
				return new HyperbolicTangent();
			case "Identity":
				return new Identity();
			case "LogisticFunction":
				return new LogisticFunction();
			case "RectifiedLinearUnit":
				return new RectifiedLinearUnit();
			case "SinusoidFunction":
				return new SinusoidFunction();
			default:
				throw "Undefined activation function `"+name+"`";
		}
	}

	var data = JSON.parse(jsonString);

	var inputLayer = data.layers.shift();
	var outputLayer = data.layers.pop();
	var hiddenLayers = data.layers;

	var inputNeurons = inputLayer.neurons.length;
	var hiddenNeurons = hiddenLayers.map(function (each) {
		return each.neurons.length;
	});
	var outputNeurons = outputLayer.neurons.length;

	var inputWeights = createWeightsListFromLayer(inputLayer);
	var outputWeights = createWeightsListFromLayer(outputLayer);

	var hiddenWeights = [];
	for (var i = 0; i < hiddenLayers.length; i++) {
		hiddenWeights.push(createWeightsListFromLayer(hiddenLayers[i]));
	}
	hiddenWeights = flattenArray(hiddenWeights);

	var allWeights = inputWeights.concat(hiddenWeights, outputWeights);

	var hiddenLayerActivationFunction = (hiddenLayers.length > 0) ? hiddenLayers[0].activationFunction : "Identity";

	Neuron.preDefinedWeights = allWeights;

	return new FeedforwardNeuralNetwork(inputNeurons, hiddenNeurons, outputNeurons, {
		seed: data.seed,
		learningRate: data.learningRate,
		hiddenLayerActivationFunction: createActivationFunctionFromName(hiddenLayerActivationFunction),
		outputLayerActivationFunction: createActivationFunctionFromName(outputLayer.activationFunction)
	});
};

module.exports = FeedforwardNeuralNetwork;
