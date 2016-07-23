/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
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
