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
