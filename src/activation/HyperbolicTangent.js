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

var ActivationFunction = require("./ActivationFunction.js");

/**
 * HyperbolicTangent (also `tanh`), a sigmoid function, that can be used as an activation function
 *
 * This function is basically a scaled version of the logistic function, centered around zero
 *
 * Saturation for very low and very high values is a problem as the gradient used during backpropagation vanishes
 *
 * @constructor
 * @extends ActivationFunction
 */
function HyperbolicTangent() {

	// call the super class's constructor
	ActivationFunction.call(this);

	this.evaluate = function (x) {
		return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
	};

	this.evaluateDerivative = function (x) {
		return 1 - Math.pow(this.evaluate(x), 2);
	};

	this.getLowerBound = function () {
		return -1;
	};

	this.getUpperBound = function () {
		return 1;
	};

	this.isMonotonic = function () {
		return true;
	};

	this.isDerivativeMonotonic = function () {
		return false;
	};

	this.isCenteredAroundZero = function () {
		return true;
	};

}

// create a prototype that inherits from the super class's prototype
HyperbolicTangent.prototype = Object.create(ActivationFunction.prototype);
// fix the constructor pointer so that it doesn't point to the super class
HyperbolicTangent.prototype.constructor = HyperbolicTangent;

module.exports = HyperbolicTangent;
