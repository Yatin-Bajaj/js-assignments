'use strict';

/**********************************************************************************************
 *                                                                                            *
 * Plese read the following tutorial before implementing tasks:                               *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions                    *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function  *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments      *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures                           *
 *                                                                                            *
 **********************************************************************************************/


/**
 * Returns the functions composition of two specified functions f(x) and g(x).
 * The result of compose is to be a function of one argument, (lets call the argument x),
 * which works like applying function f to the result of applying function g to x, i.e.
 *  getComposition(f,g)(x) = f(g(x))
 *
 * @param {Function} f
 * @param {Function} g
 * @return {Function}
 *
 * @example
 *   getComposition(Math.sin, Math.asin)(x) => Math.sin(Math.acos(x))
 *
 */
function getComposition(f, g) {
    return function (x) {
        return f(g(x))
    }
}

/**
 * Returns the math power function with the specified exponent
 *
 * @param {number} exponent
 * @return {Function}
 *
 * @example
 *   var power2 = getPowerFunction(2); // => x^2
 *   power2(2) => 4
 *   power2(4) => 16
 *
 *   var power05 = getPowerFunction(0.5); // => x^0.5
 *   power05(4) => 2
 *   power05(16) => 4
 *
 */
function getPowerFunction(exponent) {
    return function (X) {
        return X ** exponent;
    }
}


/**
 * Returns the polynom function of one argument based on specified coefficients.
 * See: https://en.wikipedia.org/wiki/Polynomial#Definition
 *
 * @params {integer}
 * @return {Function}
 *
 * @example
 *   getPolynom(2,3,5) => y = 2*x^2 + 3*x + 5
 *   getPolynom(1,-3)  => y = x - 3
 *   getPolynom(8)     => y = 8
 *   getPolynom()      => null
 */

function getPolynom() {
    const arg = Array.from(arguments);
    if (arguments.length === 3) {
        return function (x) {
            return ((arg[0] * (x ** 2)) + (arg[1] * x) + arg[2])
        }
    }

    if (arguments.length === 2) {
        return function (x) {
            return ((arg[0] * x) + arg[1])
        }
    }

    if (arguments.length === 1) {
        return function (x) {
            return (arg[0]);
        }
    }
    return null;


}


/**
 * Memoizes passed function and returns function
 * which invoked first time calls the passed function and then always returns cached result.
 *
 * @params {Function} func - function to memoize
 * @return {Function} memoized function
 *
 * @example
 *   var memoizer = memoize(() => Math.random());
 *   memoizer() => some random number  (first run, evaluates the result of Math.random())
 *   memoizer() => the same random number  (second run, returns the previous cached result)
 *   ...
 *   memoizer() => the same random number  (next run, returns the previous cached result)
 */
function memoize(func) {
    let count = true;
    let result;
    return function () {
        if (count) {
            count = false;
            result = func();
            return result;
        } else {
            return result;
        }
    }
}


/**
 * Returns the function trying to call the passed function and if it throws,
 * retrying it specified number of attempts.
 *
 * @param {Function} func
 * @param {number} attempts
 * @return {Function}
 *
 * @example
 * var attempt = 0, retryer = retry(() => {
 *      if (++attempt % 2) throw new Error('test');
 *      else return attempt;
 * }, 2);
 * retryer() => 2
 */

function retry(func, attempts) {
    return function () {
        for (let index = 1; index <= attempts; index++) {
            try {
                return func.apply(this, arguments);
            } catch (err) {
               if(index === attempts){
                return attempts;
               }
            }
        }
    }   
}

// Example to use above logic
function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}

const retryDivide = retry(divide, 3);

console.log(retryDivide(10, 0)); // return 3 (Number of attempts)
console.log(retryDivide(10, 2)); // returns 5

/**
 * Returns the logging wrapper for the specified method,
 * Logger has to log the start and end of calling the specified function.
 * Logger has to log the arguments of invoked function.
 * The fromat of output log is:
 * <function name>(<arg1>, <arg2>,...,<argN>) starts
 * <function name>(<arg1>, <arg2>,...,<argN>) ends
 *
 *
 * @param {Function} func
 * @param {Function} logFunc - function to output log with single string argument
 * @return {Function}
 *
 * @example
 *
 * var cosLogger = logger(Math.cos, console.log);
 * var result = cosLogger(Math.PI));     // -1
 *
 * log from console.log:
 * cos(3.141592653589793) starts
 * cos(3.141592653589793) ends
 *
 */
function logger(func, logFunc) {
    return function () {
        var arr = [].slice.call(arguments);
        var str = JSON.stringify(arr);
        //console.log(str);
        str = str.slice(1, -1);
        str = func.name + '(' + str + ')';
        logFunc(str + " starts");
        var res = func.apply(this, arr);
        logFunc(str + " ends");
        return res;
    }

}


/**
 * Return the function with partial applied arguments
 *
 * @param {Function} fn
 * @return {Function}
 *
 * @example
 *   var fn = function(x1,x2,x3,x4) { return  x1 + x2 + x3 + x4; };
 *   partialUsingArguments(fn, 'a')('b','c','d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b')('c','d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b','c')('d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b','c','d')() => 'abcd'
 */
function partialUsingArguments(fn) {
    let arr = []
    if (arguments.length > 1) {
        for (let index = 1; index < arguments.length; index++) {
            arr.push(arguments[index])
        }
    }
    return function (...args) {
        args.forEach(item => arr.push(item));
        var result = arr.reduce((prev, curr) => prev + curr, "");
        return result;
    }
}
var fn = function (x1, x2, x3, x4) { return x1 + x2 + x3 + x4; };
console.log(partialUsingArguments(fn, 'a')('b', 'c', 'd'))
console.log(partialUsingArguments(fn, 'a', 'b')('c', 'd'))
console.log(partialUsingArguments(fn, 'a', 'b', 'c', 'd')())
/**
 * Returns the id generator function that returns next integer starting from specified number every time when invoking.
 *
 * @param {Number} startFrom
 * @return {Function}
 *
 * @example
 *   var getId4 = getIdGenerator(4);
 *   var getId10 = gerIdGenerator(10);
 *   getId4() => 4
 *   getId10() => 10
 *   getId4() => 5
 *   getId4() => 6
 *   getId4() => 7
 *   getId10() => 11
 */
function getIdGeneratorFunction(startFrom) {

    // return function* generator() {
    //     while (true) {
    //         yield (++startFrom)
    //     }
    // }

    return function(){
        return startFrom++;
    }
    
}


module.exports = {
    getComposition: getComposition,
    getPowerFunction: getPowerFunction,
    getPolynom: getPolynom,
    memoize: memoize,
    retry: retry,
    logger: logger,
    partialUsingArguments: partialUsingArguments,
    getIdGeneratorFunction: getIdGeneratorFunction,
};
