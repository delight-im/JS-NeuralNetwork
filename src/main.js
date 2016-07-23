/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

"use strict";

var NeuralNetwork = require("./NeuralNetwork.js");
var FeedforwardNeuralNetwork = require("./FeedforwardNeuralNetwork.js");

var ArcTangent = require("./activation/ArcTangent.js");
var BinaryStep = require("./activation/BinaryStep.js");
var GaussianFunction = require("./activation/GaussianFunction.js");
var HyperbolicTangent = require("./activation/HyperbolicTangent.js");
var Identity = require("./activation/Identity.js");
var LogisticFunction = require("./activation/LogisticFunction.js");
var RectifiedLinearUnit = require("./activation/RectifiedLinearUnit.js");
var SinusoidFunction = require("./activation/SinusoidFunction.js");

module.exports = {
	Type: {
		Feedforward: FeedforwardNeuralNetwork
	},
	Activation: {
		ArcTangent: ArcTangent,
		BinaryStep: BinaryStep,
		GaussianFunction: GaussianFunction,
		HyperbolicTangent: HyperbolicTangent,
		Identity: Identity,
		LogisticFunction: LogisticFunction,
		RectifiedLinearUnit: RectifiedLinearUnit,
		SinusoidFunction: SinusoidFunction
	}
};
