/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

"use strict";

var ActivationFunction = require("./ActivationFunction.js");

/**
 * Logistic function, a sigmoid function, that can be used as an activation function
 *
 * The range of this function is often regarded as a desirable property
 *
 * The function is typically used to model probability
 *
 * Saturation for very low and very high values is a problem as the gradient used during backpropagation vanishes
 *
 * The output of this function not being zero-centered is why the hyperbolic tangent is usually preferred
 *
 * @constructor
 * @extends ActivationFunction
 */
function LogisticFunction() {

	// call the super class's constructor
	ActivationFunction.call(this);

	this.evaluate = function (x) {
		return 1 / (1 + Math.exp(-x));
	};

	this.evaluateDerivative = function (x) {
		return this.evaluate(x) * (1 - this.evaluate(x));
	};

	this.getLowerBound = function () {
		return 0;
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
		return false;
	};

}

// create a prototype that inherits from the super class's prototype
LogisticFunction.prototype = Object.create(ActivationFunction.prototype);
// fix the constructor pointer so that it doesn't point to the super class
LogisticFunction.prototype.constructor = LogisticFunction;

module.exports = LogisticFunction;
