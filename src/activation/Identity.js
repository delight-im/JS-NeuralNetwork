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
 * Identity that can be used as an activation function
 *
 * This function is often used for the activation of the output layer only
 *
 * @constructor
 * @extends ActivationFunction
 */
function Identity() {

	// call the super class's constructor
	ActivationFunction.call(this);

	this.evaluate = function (x) {
		return x;
	};

	this.evaluateDerivative = function (x) {
		return 1;
	};

	this.getLowerBound = function () {
		return Number.NEGATIVE_INFINITY;
	};

	this.getUpperBound = function () {
		return Number.POSITIVE_INFINITY;
	};

	this.isMonotonic = function () {
		return true;
	};

	this.isDerivativeMonotonic = function () {
		return true;
	};

	this.isCenteredAroundZero = function () {
		return true;
	};

}

// create a prototype that inherits from the super class's prototype
Identity.prototype = Object.create(ActivationFunction.prototype);
// fix the constructor pointer so that it doesn't point to the super class
Identity.prototype.constructor = Identity;

module.exports = Identity;
