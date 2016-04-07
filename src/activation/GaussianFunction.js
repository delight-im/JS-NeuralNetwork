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
 * Gaussian function that can be used as an activation function
 *
 * The function is often used to model probability
 *
 * @constructor
 * @extends ActivationFunction
 */
function GaussianFunction() {

	// call the super class's constructor
	ActivationFunction.call(this);

	this.evaluate = function (x) {
		return Math.exp(-Math.pow(x, 2));
	};

	this.evaluateDerivative = function (x) {
		return -2 * x * this.evaluate(x);
	};

	this.getLowerBound = function () {
		return 0;
	};

	this.getUpperBound = function () {
		return 1;
	};

	this.isMonotonic = function () {
		return false;
	};

	this.isDerivativeMonotonic = function () {
		return false;
	};

	this.isCenteredAroundZero = function () {
		return false;
	};

}

// create a prototype that inherits from the super class's prototype
GaussianFunction.prototype = Object.create(ActivationFunction.prototype);
// fix the constructor pointer so that it doesn't point to the super class
GaussianFunction.prototype.constructor = GaussianFunction;

module.exports = GaussianFunction;
