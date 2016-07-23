/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
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
