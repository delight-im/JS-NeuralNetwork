/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

"use strict";

var ActivationFunction = require("./ActivationFunction.js");

/**
 * Sinusoid function that can be used as an activation function
 *
 * @constructor
 * @extends ActivationFunction
 */
function SinusoidFunction() {

	// call the super class's constructor
	ActivationFunction.call(this);

	this.evaluate = function (x) {
		return Math.sin(x);
	};

	this.evaluateDerivative = function (x) {
		return Math.cos(x);
	};

	this.getLowerBound = function () {
		return -1;
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
		return true;
	};

}

// create a prototype that inherits from the super class's prototype
SinusoidFunction.prototype = Object.create(ActivationFunction.prototype);
// fix the constructor pointer so that it doesn't point to the super class
SinusoidFunction.prototype.constructor = SinusoidFunction;

module.exports = SinusoidFunction;
