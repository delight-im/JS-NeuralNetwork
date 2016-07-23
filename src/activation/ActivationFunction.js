/*
 * JS-NeuralNetwork (https://github.com/delight-im/JS-NeuralNetwork)
 * Copyright (c) delight.im (https://www.delight.im/)
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

"use strict";

/**
 * Activation function for an artificial neural network
 *
 * An activation function is applied on a neuron and determines its activation based on its weighted inputs
 *
 * The main factor in deciding which activation function to use is usually the range of the function
 *
 * The hyperbolic tangent and the Rectified Linear Unit (ReLU) are the most commonly used functions
 *
 * @constructor
 */
function ActivationFunction() {

	/**
	 * Evaluates the function at the specified point
	 *
	 * @abstract
	 * @param {number} x - the point to evaluate the function at
	 * @return {number} the function value
	 */
	this.evaluate = function (x) {
		throw "Method not implemented in subclass `"+this.constructor.name+"`";
	};

	/**
	 * Evaluates the derivative of the function at the specified point
	 *
	 * @abstract
	 * @param {number} x - the point to evaluate the derivative at
	 * @return {number} the derivative's function value
	 */
	this.evaluateDerivative = function (x) {
		throw "Method not implemented in subclass `"+this.constructor.name+"`";
	};

	/**
	 * Returns the least possible value of this function
	 *
	 * @abstract
	 * @return {number} the lower bound
	 */
	this.getLowerBound = function () {
		throw "Method not implemented in subclass `"+this.constructor.name+"`";
	};

	/**
	 * Returns the greatest possible value of this function
	 *
	 * @abstract
	 * @return {number} the upper bound
	 */
	this.getUpperBound = function () {
		throw "Method not implemented in subclass `"+this.constructor.name+"`";
	};

	/**
	 * Returns whether this function is monotonic
	 *
	 * @abstract
	 * @return {boolean} whether the function is monotonic
	 */
	this.isMonotonic = function () {
		throw "Method not implemented in subclass `"+this.constructor.name+"`";
	};

	/**
	 * Returns whether this function's derivative is monotonic
	 *
	 * @abstract
	 * @return {boolean} whether the function's derivative is monotonic
	 */
	this.isDerivativeMonotonic = function () {
		throw "Method not implemented in subclass `"+this.constructor.name+"`";
	};

	/**
	 * Returns whether the graph of this function is very close to the origin
	 *
	 * @abstract
	 * @return {boolean} whether the graph is centered around `(0,0)`
	 */
	this.isCenteredAroundZero = function () {
		throw "Method not implemented in subclass `"+this.constructor.name+"`";
	};

}

ActivationFunction.prototype.toJSON = function () {
	return this.constructor.name;
};

module.exports = ActivationFunction;
