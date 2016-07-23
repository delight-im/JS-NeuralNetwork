/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

"use strict";

var ActivationFunction = require("./ActivationFunction.js");

/**
 * Binary step that can be used as an activation function
 *
 * The function is often used for binary classifiers
 *
 * @constructor
 * @extends ActivationFunction
 */
function BinaryStep() {

	// call the super class's constructor
	ActivationFunction.call(this);

	this.evaluate = function (x) {
		if (x < 0) {
			return 0;
		}
		else {
			return 1;
		}
	};

	this.evaluateDerivative = function (x) {
		if (x !== 0) {
			return 0;
		}
		else {
			return Number.NaN;
		}
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
BinaryStep.prototype = Object.create(ActivationFunction.prototype);
// fix the constructor pointer so that it doesn't point to the super class
BinaryStep.prototype.constructor = BinaryStep;

module.exports = BinaryStep;
