import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import * as goog_functions from './../functions/functions.js';
import * as google from './../google.js';
import * as math from './../math/math.js';
// Copyright 2007 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Python style iteration utilities.
 */

/**
 * @typedef {{length:number}|{__iterator__}}
 */
let Iterable;

/**
 * Singleton Error object that is used to terminate iterations.
 * @const {!Error}
 */
let StopIteration = ('StopIteration' in window) ?
    // For script engines that support legacy iterators.
    window['StopIteration'] :
    {message: 'StopIteration', stack: ''};

/**
 * Class/interface for iterators.  An iterator needs to implement a `next`
 * method and it needs to throw a `StopIteration` when the
 * iteration passes beyond the end.  Iterators have no `hasNext` method.
 * It is recommended to always use the helper functions to iterate over the
 * iterator or in case you are only targeting JavaScript 1.7 for in loops.
 * @template VALUE
 */
class Iterator {

  /**
   * Class/interface for iterators.  An iterator needs to implement a `next`
   * method and it needs to throw a `StopIteration` when the
   * iteration passes beyond the end.  Iterators have no `hasNext` method.
   * It is recommended to always use the helper functions to iterate over the
   * iterator or in case you are only targeting JavaScript 1.7 for in loops.
   * @template VALUE
   */
  constructor() {}

  /**
   * Returns the next value of the iteration.  This will throw the object
   * {@see StopIteration} when the iteration passes the end.
   * @return {VALUE} Any object or value.
   */
  next() {
    throw StopIteration;
  };

  /**
   * Returns the `Iterator` object itself.  This is used to implement
   * the iterator protocol in JavaScript 1.7
   * @param {boolean=} opt_keys  Whether to return the keys or values. Default is
   *     to only return the values.  This is being used by the for-in loop (true)
   *     and the for-each-in loop (false).  Even though the param gives a hint
   *     about what the iterator will return there is no guarantee that it will
   *     return the keys when true is passed.
   * @return {!Iterator<VALUE>} The object itself.
   */
  __iterator__(opt_keys) {
    return this;
  };
}

/**
 * Returns an iterator that knows how to iterate over the values in the object.
 * @param {Iterator<VALUE>|Iterable} iterable  If the
 *     object is an iterator it will be returned as is.  If the object has an
 *     `__iterator__` method that will be called to get the value
 *     iterator.  If the object is an array-like object we create an iterator
 *     for that.
 * @return {!Iterator<VALUE>} An iterator that knows how to iterate
 *     over the values in `iterable`.
 * @template VALUE
 */
function toIterator(iterable) {
  if (iterable instanceof Iterator) {
    return iterable;
  }
  if (typeof iterable.__iterator__ == 'function') {
    return /** @type {{__iterator__:function(this:?, boolean=)}} */ (iterable)
        .__iterator__(false);
  }
  if (google.isArrayLike(iterable)) {
    var like = /** @type {!IArrayLike<number|string>} */ (iterable);
    var i = 0;
    var newIter = new Iterator;
    newIter.next = function() {
      while (true) {
        if (i >= like.length) {
          throw StopIteration;
        }
        // Don't include deleted elements.
        if (!(i in like)) {
          i++;
          continue;
        }
        return like[i++];
      }
    };
    return newIter;
  }

  // TODO(arv): Should we fall back on goog.structs.getValues()?
  throw new Error('Not implemented');
};

/**
 * Calls a function for each element in the iterator with the element of the
 * iterator passed as argument.
 *
 * @param {Iterator<VALUE>|Iterable} iterable  The iterator
 *     to iterate over. If the iterable is an object `toIterator` will be
 *     called on it.
 * @param {function(this:THIS,VALUE,?,!Iterator<VALUE>)} f
 *     The function to call for every element.  This function takes 3 arguments
 *     (the element, undefined, and the iterator) and the return value is
 *     irrelevant.  The reason for passing undefined as the second argument is
 *     so that the same function can be used in {@see googarray.forEach} as
 *     well as others.  The third parameter is of type "number" for
 *     arraylike objects, undefined, otherwise.
 * @param {THIS=} opt_obj  The object to be used as the value of 'this' within
 *     `f`.
 * @template THIS, VALUE
 */
function forEach(iterable, f, opt_obj) {
  if (google.isArrayLike(iterable)) {

    try {
      // NOTES: this passes the index number to the second parameter
      // of the callback contrary to the documentation above.
      googarray.forEach(
          /** @type {IArrayLike<?>} */ (iterable), f, opt_obj);
    } catch (ex) {
      if (ex !== StopIteration) {
        throw ex;
      }
    }
  } else {
    iterable = toIterator(iterable);

    try {
      while (true) {
        f.call(opt_obj, iterable.next(), undefined, iterable);
      }
    } catch (ex) {
      if (ex !== StopIteration) {
        throw ex;
      }
    }
  }
};

/**
 * Calls a function for every element in the iterator, and if the function
 * returns true adds the element to a new iterator.
 *
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     to iterate over.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every element. This function takes 3 arguments
 *     (the element, undefined, and the iterator) and should return a boolean.
 *     If the return value is true the element will be included in the returned
 *     iterator.  If it is false the element is not included.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {!Iterator<VALUE>} A new iterator in which only elements
 *     that passed the test are present.
 * @template THIS, VALUE
 */
function filter(iterable, f, opt_obj) {
  var iterator = toIterator(iterable);
  var newIter = new Iterator;
  newIter.next = function() {
    while (true) {
      var val = iterator.next();
      if (f.call(opt_obj, val, undefined, iterator)) {
        return val;
      }
    }
  };
  return newIter;
};

/**
 * Calls a function for every element in the iterator, and if the function
 * returns false adds the element to a new iterator.
 *
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     to iterate over.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every element. This function takes 3 arguments
 *     (the element, undefined, and the iterator) and should return a boolean.
 *     If the return value is false the element will be included in the returned
 *     iterator.  If it is true the element is not included.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {!Iterator<VALUE>} A new iterator in which only elements
 *     that did not pass the test are present.
 * @template THIS, VALUE
 */
function filterFalse(iterable, f, opt_obj) {
  return filter(iterable, goog_functions.not(f), opt_obj);
};

/**
 * Creates a new iterator that returns the values in a range.  This function
 * can take 1, 2 or 3 arguments:
 * <pre>
 * range(5) same as range(0, 5, 1)
 * range(2, 5) same as range(2, 5, 1)
 * </pre>
 *
 * @param {number} startOrStop  The stop value if only one argument is provided.
 *     The start value if 2 or more arguments are provided.  If only one
 *     argument is used the start value is 0.
 * @param {number=} opt_stop  The stop value.  If left out then the first
 *     argument is used as the stop value.
 * @param {number=} opt_step  The number to increment with between each call to
 *     next.  This can be negative.
 * @return {!Iterator<number>} A new iterator that returns the values
 *     in the range.
 */
function range(startOrStop, opt_stop, opt_step) {
  var start = 0;
  var stop = startOrStop;
  var step = opt_step || 1;
  if (arguments.length > 1) {
    start = startOrStop;
    stop = +opt_stop;
  }
  if (step == 0) {
    throw new Error('Range step argument must not be zero');
  }

  var newIter = new Iterator;
  newIter.next = function() {
    if (step > 0 && start >= stop || step < 0 && start <= stop) {
      throw StopIteration;
    }
    var rv = start;
    start += step;
    return rv;
  };
  return newIter;
};

/**
 * Joins the values in a iterator with a delimiter.
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     to get the values from.
 * @param {string} deliminator  The text to put between the values.
 * @return {string} The joined value string.
 * @template VALUE
 */
function join(iterable, deliminator) {
  return toArray(iterable).join(deliminator);
};

/**
 * For every element in the iterator call a function and return a new iterator
 * with that value.
 *
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterator to iterate over.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):RESULT} f
 *     The function to call for every element.  This function takes 3 arguments
 *     (the element, undefined, and the iterator) and should return a new value.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {!Iterator<RESULT>} A new iterator that returns the
 *     results of applying the function to each element in the original
 *     iterator.
 * @template THIS, VALUE, RESULT
 */
function map(iterable, f, opt_obj) {
  var iterator = toIterator(iterable);
  var newIter = new Iterator;
  newIter.next = function() {
    var val = iterator.next();
    return f.call(opt_obj, val, undefined, iterator);
  };
  return newIter;
};

/**
 * Passes every element of an iterator into a function and accumulates the
 * result.
 *
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     to iterate over.
 * @param {function(this:THIS,VALUE,VALUE):VALUE} f The function to call for
 *     every element. This function takes 2 arguments (the function's previous
 *     result or the initial value, and the value of the current element).
 *     function(previousValue, currentElement) : newValue.
 * @param {VALUE} val The initial value to pass into the function on the first
 *     call.
 * @param {THIS=} opt_obj  The object to be used as the value of 'this' within
 *     f.
 * @return {VALUE} Result of evaluating f repeatedly across the values of
 *     the iterator.
 * @template THIS, VALUE
 */
function reduce(iterable, f, val, opt_obj) {
  var rval = val;
  forEach(
      iterable, function(val) { rval = f.call(opt_obj, rval, val); });
  return rval;
};

/**
 * Goes through the values in the iterator. Calls f for each of these, and if
 * any of them returns true, this returns true (without checking the rest). If
 * all return false this will return false.
 *
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     object.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every value. This function takes 3 arguments
 *     (the value, undefined, and the iterator) and should return a boolean.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {boolean} true if any value passes the test.
 * @template THIS, VALUE
 */
function some(iterable, f, opt_obj) {
  iterable = toIterator(iterable);

  try {
    while (true) {
      if (f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return true;
      }
    }
  } catch (ex) {
    if (ex !== StopIteration) {
      throw ex;
    }
  }
  return false;
};

/**
 * Goes through the values in the iterator. Calls f for each of these and if any
 * of them returns false this returns false (without checking the rest). If all
 * return true this will return true.
 *
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     object.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every value. This function takes 3 arguments
 *     (the value, undefined, and the iterator) and should return a boolean.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {boolean} true if every value passes the test.
 * @template THIS, VALUE
 */
function every(iterable, f, opt_obj) {
  iterable = toIterator(iterable);

  try {
    while (true) {
      if (!f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return false;
      }
    }
  } catch (ex) {
    if (ex !== StopIteration) {
      throw ex;
    }
  }
  return true;
};

/**
 * Takes zero or more iterables and returns one iterator that will iterate over
 * them in the order chained.
 * @param {...!Iterator<VALUE>|!Iterable} var_args Any
 *     number of iterable objects.
 * @return {!Iterator<VALUE>} Returns a new iterator that will
 *     iterate over all the given iterables' contents.
 * @template VALUE
 */
function chain(var_args) {
  return chainFromIterable(arguments);
};

/**
 * Takes a single iterable containing zero or more iterables and returns one
 * iterator that will iterate over each one in the order given.
 * @see https://goo.gl/5NRp5d
 * @param {Iterator<?>|Iterable} iterable The iterable of
 *     iterables to chain.
 * @return {!Iterator<VALUE>} Returns a new iterator that will
 *     iterate over all the contents of the iterables contained within
 *     `iterable`.
 * @template VALUE
 */
function chainFromIterable(iterable) {
  var iterator = toIterator(iterable);
  var iter = new Iterator();
  var current = null;

  iter.next = function() {
    while (true) {
      if (current == null) {
        var it = iterator.next();
        current = toIterator(it);
      }
      try {
        return current.next();
      } catch (ex) {
        if (ex !== StopIteration) {
          throw ex;
        }
        current = null;
      }
    }
  };

  return iter;
};

/**
 * Builds a new iterator that iterates over the original, but skips elements as
 * long as a supplied function returns true.
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     object.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every value. This function takes 3 arguments
 *     (the value, undefined, and the iterator) and should return a boolean.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {!Iterator<VALUE>} A new iterator that drops elements from
 *     the original iterator as long as `f` is true.
 * @template THIS, VALUE
 */
function dropWhile(iterable, f, opt_obj) {
  var iterator = toIterator(iterable);
  var newIter = new Iterator;
  var dropping = true;
  newIter.next = function() {
    while (true) {
      var val = iterator.next();
      if (dropping && f.call(opt_obj, val, undefined, iterator)) {
        continue;
      } else {
        dropping = false;
      }
      return val;
    }
  };
  return newIter;
};

/**
 * Builds a new iterator that iterates over the original, but only as long as a
 * supplied function returns true.
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     object.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every value. This function takes 3 arguments
 *     (the value, undefined, and the iterator) and should return a boolean.
 * @param {THIS=} opt_obj This is used as the 'this' object in f when called.
 * @return {!Iterator<VALUE>} A new iterator that keeps elements in
 *     the original iterator as long as the function is true.
 * @template THIS, VALUE
 */
function takeWhile(iterable, f, opt_obj) {
  var iterator = toIterator(iterable);
  var iter = new Iterator();
  iter.next = function() {
    var val = iterator.next();
    if (f.call(opt_obj, val, undefined, iterator)) {
      return val;
    }
    throw StopIteration;
  };
  return iter;
};

/**
 * Converts the iterator to an array
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     to convert to an array.
 * @return {!Array<VALUE>} An array of the elements the iterator iterates over.
 * @template VALUE
 */
function toArray(iterable) {
  // Fast path for array-like.
  if (google.isArrayLike(iterable)) {
    return googarray.toArray(/** @type {!IArrayLike<?>} */ (iterable));
  }
  iterable = toIterator(iterable);
  var array = [];
  forEach(iterable, function(val) { array.push(val); });
  return array;
};

/**
 * Iterates over two iterables and returns true if they contain the same
 * sequence of elements and have the same length.
 * @param {!Iterator<VALUE>|!Iterable} iterable1 The first
 *     iterable object.
 * @param {!Iterator<VALUE>|!Iterable} iterable2 The second
 *     iterable object.
 * @param {function(VALUE,VALUE):boolean=} opt_equalsFn Optional comparison
 *     function.
 *     Should take two arguments to compare, and return true if the arguments
 *     are equal. Defaults to {@link googarray.defaultCompareEquality} which
 *     compares the elements using the built-in '===' operator.
 * @return {boolean} true if the iterables contain the same sequence of elements
 *     and have the same length.
 * @template VALUE
 */
function equals(iterable1, iterable2, opt_equalsFn) {
  var fillValue = {};
  var pairs = zipLongest(fillValue, iterable1, iterable2);
  var equalsFn = opt_equalsFn || googarray.defaultCompareEquality;
  return every(
      pairs, function(pair) { return equalsFn(pair[0], pair[1]); });
};

/**
 * Advances the iterator to the next position, returning the given default value
 * instead of throwing an exception if the iterator has no more entries.
 * @param {Iterator<VALUE>|Iterable} iterable The iterable
 *     object.
 * @param {VALUE} defaultValue The value to return if the iterator is empty.
 * @return {VALUE} The next item in the iteration, or defaultValue if the
 *     iterator was empty.
 * @template VALUE
 */
function nextOrValue(iterable, defaultValue) {
  try {
    return toIterator(iterable).next();
  } catch (e) {
    if (e != StopIteration) {
      throw e;
    }
    return defaultValue;
  }
};

/**
 * Cartesian product of zero or more sets.  Gives an iterator that gives every
 * combination of one element chosen from each set.  For example,
 * ([1, 2], [3, 4]) gives ([1, 3], [1, 4], [2, 3], [2, 4]).
 * @see http://docs.python.org/library/itertools.html#itertools.product
 * @param {...!IArrayLike<VALUE>} var_args Zero or more sets, as
 *     arrays.
 * @return {!Iterator<!Array<VALUE>>} An iterator that gives each
 *     n-tuple (as an array).
 * @template VALUE
 */
function product(var_args) {
  var someArrayEmpty =
      googarray.some(arguments, function(arr) { return !arr.length; });

  // An empty set in a cartesian product gives an empty set.
  if (someArrayEmpty || !arguments.length) {
    return new Iterator();
  }

  var iter = new Iterator();
  var arrays = arguments;

  // The first indices are [0, 0, ...]
  /** @type {?Array<number>} */
  var indicies = googarray.repeat(0, arrays.length);

  iter.next = function() {

    if (indicies) {
      var retVal = googarray.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex];
      });

      // Generate the next-largest indices for the next call.
      // Increase the rightmost index. If it goes over, increase the next
      // rightmost (like carry-over addition).
      for (var i = indicies.length - 1; i >= 0; i--) {
        // Assertion prevents compiler warning below.
        asserts.assert(indicies);
        if (indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break;
        }

        // We're at the last indices (the last element of every array), so
        // the iteration is over on the next call.
        if (i == 0) {
          indicies = null;
          break;
        }
        // Reset the index in this column and loop back to increment the
        // next one.
        indicies[i] = 0;
      }
      return retVal;
    }

    throw StopIteration;
  };

  return iter;
};

/**
 * Create an iterator to cycle over the iterable's elements indefinitely.
 * For example, ([1, 2, 3]) would return : 1, 2, 3, 1, 2, 3, ...
 * @see: http://docs.python.org/library/itertools.html#itertools.cycle.
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable object.
 * @return {!Iterator<VALUE>} An iterator that iterates indefinitely
 *     over the values in `iterable`.
 * @template VALUE
 */
function cycle(iterable) {
  var baseIterator = toIterator(iterable);

  // We maintain a cache to store the iterable elements as we iterate
  // over them. The cache is used to return elements once we have
  // iterated over the iterable once.
  var cache = [];
  var cacheIndex = 0;

  var iter = new Iterator();

  // This flag is set after the iterable is iterated over once
  var useCache = false;

  iter.next = function() {
    var returnElement = null;

    // Pull elements off the original iterator if not using cache
    if (!useCache) {
      try {
        // Return the element from the iterable
        returnElement = baseIterator.next();
        cache.push(returnElement);
        return returnElement;
      } catch (e) {
        // If an exception other than StopIteration is thrown
        // or if there are no elements to iterate over (the iterable was empty)
        // throw an exception
        if (e != StopIteration || googarray.isEmpty(cache)) {
          throw e;
        }
        // set useCache to true after we know that a 'StopIteration' exception
        // was thrown and the cache is not empty (to handle the 'empty iterable'
        // use case)
        useCache = true;
      }
    }

    returnElement = cache[cacheIndex];
    cacheIndex = (cacheIndex + 1) % cache.length;

    return returnElement;
  };

  return iter;
};

/**
 * Creates an iterator that counts indefinitely from a starting value.
 * @see http://docs.python.org/2/library/itertools.html#itertools.count
 * @param {number=} opt_start The starting value. Default is 0.
 * @param {number=} opt_step The number to increment with between each call to
 *     next. Negative and floating point numbers are allowed. Default is 1.
 * @return {!Iterator<number>} A new iterator that returns the values
 *     in the series.
 */
function count(opt_start, opt_step) {
  var counter = opt_start || 0;
  var step = (opt_step !== undefined) ? opt_step : 1;
  var iter = new Iterator();

  iter.next = function() {
    var returnValue = counter;
    counter += step;
    return returnValue;
  };

  return iter;
};

/**
 * Creates an iterator that returns the same object or value repeatedly.
 * @param {VALUE} value Any object or value to repeat.
 * @return {!Iterator<VALUE>} A new iterator that returns the
 *     repeated value.
 * @template VALUE
 */
function repeat(value) {
  var iter = new Iterator();

  iter.next = goog_functions.constant(value);

  return iter;
};

/**
 * Creates an iterator that returns running totals from the numbers in
 * `iterable`. For example, the array {@code [1, 2, 3, 4, 5]} yields
 * {@code 1 -> 3 -> 6 -> 10 -> 15}.
 * @see http://docs.python.org/3.2/library/itertools.html#itertools.accumulate
 * @param {!Iterator<number>|!Iterable} iterable The
 *     iterable of numbers to accumulate.
 * @return {!Iterator<number>} A new iterator that returns the
 *     numbers in the series.
 */
function accumulate(iterable) {
  var iterator = toIterator(iterable);
  var total = 0;
  var iter = new Iterator();

  iter.next = function() {
    total += iterator.next();
    return total;
  };

  return iter;
};

/**
 * Creates an iterator that returns arrays containing the ith elements from the
 * provided iterables. The returned arrays will be the same size as the number
 * of iterables given in `var_args`. Once the shortest iterable is
 * exhausted, subsequent calls to `next()` will throw
 * `StopIteration`.
 * @see http://docs.python.org/2/library/itertools.html#itertools.izip
 * @param {...!Iterator<VALUE>|!Iterable} var_args Any
 *     number of iterable objects.
 * @return {!Iterator<!Array<VALUE>>} A new iterator that returns
 *     arrays of elements from the provided iterables.
 * @template VALUE
 */
function zip(var_args) {
  var args = arguments;
  var iter = new Iterator();

  if (args.length > 0) {
    var iterators = googarray.map(args, toIterator);
    iter.next = function() {
      var arr = googarray.map(iterators, function(it) { return it.next(); });
      return arr;
    };
  }

  return iter;
};

/**
 * Creates an iterator that returns arrays containing the ith elements from the
 * provided iterables. The returned arrays will be the same size as the number
 * of iterables given in `var_args`. Shorter iterables will be extended
 * with `fillValue`. Once the longest iterable is exhausted, subsequent
 * calls to `next()` will throw `StopIteration`.
 * @see http://docs.python.org/2/library/itertools.html#itertools.izip_longest
 * @param {VALUE} fillValue The object or value used to fill shorter iterables.
 * @param {...!Iterator<VALUE>|!Iterable} var_args Any
 *     number of iterable objects.
 * @return {!Iterator<!Array<VALUE>>} A new iterator that returns
 *     arrays of elements from the provided iterables.
 * @template VALUE
 */
function zipLongest(fillValue, var_args) {
  var args = googarray.slice(arguments, 1);
  var iter = new Iterator();

  if (args.length > 0) {
    var iterators = googarray.map(args, toIterator);

    iter.next = function() {
      var iteratorsHaveValues = false;  // false when all iterators are empty.
      var arr = googarray.map(iterators, function(it) {
        var returnValue;
        try {
          returnValue = it.next();
          // Iterator had a value, so we've not exhausted the iterators.
          // Set flag accordingly.
          iteratorsHaveValues = true;
        } catch (ex) {
          if (ex !== StopIteration) {
            throw ex;
          }
          returnValue = fillValue;
        }
        return returnValue;
      });

      if (!iteratorsHaveValues) {
        throw StopIteration;
      }
      return arr;
    };
  }

  return iter;
};

/**
 * Creates an iterator that filters `iterable` based on a series of
 * `selectors`. On each call to `next()`, one item is taken from
 * both the `iterable` and `selectors` iterators. If the item from
 * `selectors` evaluates to true, the item from `iterable` is given.
 * Otherwise, it is skipped. Once either `iterable` or `selectors`
 * is exhausted, subsequent calls to `next()` will throw
 * `StopIteration`.
 * @see http://docs.python.org/2/library/itertools.html#itertools.compress
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to filter.
 * @param {!Iterator<VALUE>|!Iterable} selectors An
 *     iterable of items to be evaluated in a boolean context to determine if
 *     the corresponding element in `iterable` should be included in the
 *     result.
 * @return {!Iterator<VALUE>} A new iterator that returns the
 *     filtered values.
 * @template VALUE
 */
function compress(iterable, selectors) {
  var selectorIterator = toIterator(selectors);

  return filter(
      iterable, function() { return !!selectorIterator.next(); });
};

/**
 * Implements the `groupBy` iterator.
 *     iterable to group.
 *     determining the key value for each group in the `iterable`. Default
 *     is the identity function.
 * @extends {Iterator<!Array<?>>}
 * @template KEY, VALUE
 * @private
 */
class GroupByIterator_ extends Iterator {

  /**
   * Implements the `groupBy` iterator.
   * @param {!Iterator<VALUE>|!Iterable} iterable The
   *     iterable to group.
   * @param {function(VALUE): KEY=} opt_keyFunc  Optional function for
   *     determining the key value for each group in the `iterable`. Default
   *     is the identity function.
   * @template KEY, VALUE
   * @private
   */
  constructor(iterable, opt_keyFunc) {
  
    super();
  
    /**
     * The iterable to group, coerced to an iterator.
     * @type {!Iterator}
     */
    this.iterator = toIterator(iterable);
  
    /**
     * A function for determining the key value for each element in the iterable.
     * If no function is provided, the identity function is used and returns the
     * element unchanged.
     * @type {function(VALUE): KEY}
     */
    this.keyFunc = opt_keyFunc || goog_functions.identity;
  
    /**
     * The target key for determining the start of a group.
     * @type {KEY}
     */
    this.targetKey;
  
    /**
     * The current key visited during iteration.
     * @type {KEY}
     */
    this.currentKey;
  
    /**
     * The current value being added to the group.
     * @type {VALUE}
     */
    this.currentValue;
  }

  /** @override */
  next() {
    while (this.currentKey == this.targetKey) {
      this.currentValue = this.iterator.next();  // Exits on StopIteration
      this.currentKey = this.keyFunc(this.currentValue);
    }
    this.targetKey = this.currentKey;
    return [this.currentKey, this.groupItems_(this.targetKey)];
  };

  /**
   * Performs the grouping of objects using the given key.
   * @param {KEY} targetKey  The target key object for the group.
   * @return {!Array<VALUE>} An array of grouped objects.
   * @private
   */
  groupItems_(targetKey) {
    var arr = [];
    while (this.currentKey == targetKey) {
      arr.push(this.currentValue);
      try {
        this.currentValue = this.iterator.next();
      } catch (ex) {
        if (ex !== StopIteration) {
          throw ex;
        }
        break;
      }
      this.currentKey = this.keyFunc(this.currentValue);
    }
    return arr;
  };
}

/**
 * Creates an iterator that returns arrays containing elements from the
 * `iterable` grouped by a key value. For iterables with repeated
 * elements (i.e. sorted according to a particular key function), this function
 * has a `uniq`-like effect. For example, grouping the array:
 * {@code [A, B, B, C, C, A]} produces
 * {@code [A, [A]], [B, [B, B]], [C, [C, C]], [A, [A]]}.
 * @see http://docs.python.org/2/library/itertools.html#itertools.groupby
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to group.
 * @param {function(VALUE): KEY=} opt_keyFunc  Optional function for
 *     determining the key value for each group in the `iterable`. Default
 *     is the identity function.
 * @return {!Iterator<!Array<?>>} A new iterator that returns
 *     arrays of consecutive key and groups.
 * @template KEY, VALUE
 */
function groupBy(iterable, opt_keyFunc) {
  return new GroupByIterator_(iterable, opt_keyFunc);
};

/**
 * Gives an iterator that gives the result of calling the given function
 * <code>f</code> with the arguments taken from the next element from
 * <code>iterable</code> (the elements are expected to also be iterables).
 *
 * Similar to {@see map} but allows the function to accept multiple
 * arguments from the iterable.
 *
 * @param {!Iterator<?>|!Iterable} iterable The iterable of
 *     iterables to iterate over.
 * @param {function(this:THIS,...*):RESULT} f The function to call for every
 *     element.  This function takes N+2 arguments, where N represents the
 *     number of items from the next element of the iterable. The two
 *     additional arguments passed to the function are undefined and the
 *     iterator itself. The function should return a new value.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {!Iterator<RESULT>} A new iterator that returns the
 *     results of applying the function to each element in the original
 *     iterator.
 * @template THIS, RESULT
 */
function starMap(iterable, f, opt_obj) {
  var iterator = toIterator(iterable);
  var iter = new Iterator();

  iter.next = function() {
    var args = toArray(iterator.next());
    return f.apply(opt_obj, googarray.concat(args, undefined, iterator));
  };

  return iter;
};

/**
 * Returns an array of iterators each of which can iterate over the values in
 * `iterable` without advancing the others.
 * @see http://docs.python.org/2/library/itertools.html#itertools.tee
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to tee.
 * @param {number=} opt_num  The number of iterators to create. Default is 2.
 * @return {!Array<Iterator<VALUE>>} An array of iterators.
 * @template VALUE
 */
function tee(iterable, opt_num) {
  var iterator = toIterator(iterable);
  var num = (typeof opt_num === 'number') ? opt_num : 2;
  var buffers =
      googarray.map(googarray.range(num), function() { return []; });

  function addNextIteratorValueToBuffers() {
    var val = iterator.next();
    googarray.forEach(buffers, function(buffer) { buffer.push(val); });
  };

  function createIterator(buffer) {
    // Each tee'd iterator has an associated buffer (initially empty). When a
    // tee'd iterator's buffer is empty, it calls
    // addNextIteratorValueToBuffers(), adding the next value to all tee'd
    // iterators' buffers, and then returns that value. This allows each
    // iterator to be advanced independently.
    var iter = new Iterator();

    iter.next = function() {
      if (googarray.isEmpty(buffer)) {
        addNextIteratorValueToBuffers();
      }
      asserts.assert(!googarray.isEmpty(buffer));
      return buffer.shift();
    };

    return iter;
  };

  return googarray.map(buffers, createIterator);
};

/**
 * Creates an iterator that returns arrays containing a count and an element
 * obtained from the given `iterable`.
 * @see http://docs.python.org/2/library/functions.html#enumerate
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to enumerate.
 * @param {number=} opt_start  Optional starting value. Default is 0.
 * @return {!Iterator<!Array<?>>} A new iterator containing
 *     count/item pairs.
 * @template VALUE
 */
function enumerate(iterable, opt_start) {
  return zip(count(opt_start), iterable);
};

/**
 * Creates an iterator that returns the first `limitSize` elements from an
 * iterable. If this number is greater than the number of elements in the
 * iterable, all the elements are returned.
 * @see http://goo.gl/V0sihp Inspired by the limit iterator in Guava.
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to limit.
 * @param {number} limitSize  The maximum number of elements to return.
 * @return {!Iterator<VALUE>} A new iterator containing
 *     `limitSize` elements.
 * @template VALUE
 */
function limit(iterable, limitSize) {
  asserts.assert(math.isInt(limitSize) && limitSize >= 0);

  var iterator = toIterator(iterable);

  var iter = new Iterator();
  var remaining = limitSize;

  iter.next = function() {
    if (remaining-- > 0) {
      return iterator.next();
    }
    throw StopIteration;
  };

  return iter;
};

/**
 * Creates an iterator that is advanced `count` steps ahead. Consumed
 * values are silently discarded. If `count` is greater than the number
 * of elements in `iterable`, an empty iterator is returned. Subsequent
 * calls to `next()` will throw `StopIteration`.
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to consume.
 * @param {number} count  The number of elements to consume from the iterator.
 * @return {!Iterator<VALUE>} An iterator advanced zero or more steps
 *     ahead.
 * @template VALUE
 */
function consume(iterable, count) {
  asserts.assert(math.isInt(count) && count >= 0);

  var iterator = toIterator(iterable);

  while (count-- > 0) {
    nextOrValue(iterator, null);
  }

  return iterator;
};

/**
 * Creates an iterator that returns a range of elements from an iterable.
 * Similar to {@see googarray.slice} but does not support negative indexes.
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to slice.
 * @param {number} start  The index of the first element to return.
 * @param {number=} opt_end  The index after the last element to return. If
 *     defined, must be greater than or equal to `start`.
 * @return {!Iterator<VALUE>} A new iterator containing a slice of
 *     the original.
 * @template VALUE
 */
function slice(iterable, start, opt_end) {
  asserts.assert(math.isInt(start) && start >= 0);

  var iterator = consume(iterable, start);

  if (typeof opt_end === 'number') {
    asserts.assert(math.isInt(opt_end) && opt_end >= start);
    iterator = limit(iterator, opt_end - start /* limitSize */);
  }

  return iterator;
};

/**
 * Checks an array for duplicate elements.
 * @param {?IArrayLike<VALUE>} arr The array to check for
 *     duplicates.
 * @return {boolean} True, if the array contains duplicates, false otherwise.
 * @private
 * @template VALUE
 */
// TODO(user): Consider moving this into googarray as a public function.
function hasDuplicates_(arr) {
  var deduped = [];
  googarray.removeDuplicates(arr, deduped);
  return arr.length != deduped.length;
};

/**
 * Creates an iterator that returns permutations of elements in
 * `iterable`.
 *
 * Permutations are obtained by taking the Cartesian product of
 * `opt_length` iterables and filtering out those with repeated
 * elements. For example, the permutations of {@code [1,2,3]} are
 * {@code [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]}.
 * @see http://docs.python.org/2/library/itertools.html#itertools.permutations
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable from which to generate permutations.
 * @param {number=} opt_length Length of each permutation. If omitted, defaults
 *     to the length of `iterable`.
 * @return {!Iterator<!Array<VALUE>>} A new iterator containing the
 *     permutations of `iterable`.
 * @template VALUE
 */
function permutations(iterable, opt_length) {
  var elements = toArray(iterable);
  var length = (typeof opt_length === 'number') ? opt_length : elements.length;

  var sets = googarray.repeat(elements, length);
  var productVar = product.apply(undefined, sets);

  return filter(
      productVar, function(arr) { return !hasDuplicates_(arr); });
};

/**
 * Creates an iterator that returns combinations of elements from
 * `iterable`.
 *
 * Combinations are obtained by taking the {@see permutations} of
 * `iterable` and filtering those whose elements appear in the order they
 * are encountered in `iterable`. For example, the 3-length combinations
 * of {@code [0,1,2,3]} are {@code [[0,1,2], [0,1,3], [0,2,3], [1,2,3]]}.
 * @see http://docs.python.org/2/library/itertools.html#itertools.combinations
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable from which to generate combinations.
 * @param {number} length The length of each combination.
 * @return {!Iterator<!Array<VALUE>>} A new iterator containing
 *     combinations from the `iterable`.
 * @template VALUE
 */
function combinations(iterable, length) {
  var elements = toArray(iterable);
  var indexes = range(elements.length);
  var indexIterator = permutations(indexes, length);
  // sortedIndexIterator will now give arrays of with the given length that
  // indicate what indexes into "elements" should be returned on each iteration.
  var sortedIndexIterator = filter(
      indexIterator, function(arr) { return googarray.isSorted(arr); });

  var iter = new Iterator();

  function getIndexFromElements(index) { return elements[index]; }

  iter.next = function() {
    return googarray.map(sortedIndexIterator.next(), getIndexFromElements);
  };

  return iter;
};

/**
 * Creates an iterator that returns combinations of elements from
 * `iterable`, with repeated elements possible.
 *
 * Combinations are obtained by taking the Cartesian product of `length`
 * iterables and filtering those whose elements appear in the order they are
 * encountered in `iterable`. For example, the 2-length combinations of
 * {@code [1,2,3]} are {@code [[1,1], [1,2], [1,3], [2,2], [2,3], [3,3]]}.
 * @see https://goo.gl/C0yXe4
 * @see https://goo.gl/djOCsk
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to combine.
 * @param {number} length The length of each combination.
 * @return {!Iterator<!Array<VALUE>>} A new iterator containing
 *     combinations from the `iterable`.
 * @template VALUE
 */
function combinationsWithReplacement(iterable, length) {
  var elements = toArray(iterable);
  var indexes = googarray.range(elements.length);
  var sets = googarray.repeat(indexes, length);
  var indexIterator = product.apply(undefined, sets);
  // sortedIndexIterator will now give arrays of with the given length that
  // indicate what indexes into "elements" should be returned on each iteration.
  var sortedIndexIterator = filter(
      indexIterator, function(arr) { return googarray.isSorted(arr); });

  var iter = new Iterator();

  function getIndexFromElements(index) { return elements[index]; }

  iter.next = function() {
    return googarray.map(
        /** @type {!Array<number>} */
        (sortedIndexIterator.next()), getIndexFromElements);
  };

  return iter;
};

export {Iterable, Iterator, StopIteration, accumulate, chain, chainFromIterable, combinations, combinationsWithReplacement, compress, consume, count, cycle, dropWhile, enumerate, equals, every, filter, filterFalse, forEach, groupBy, join, limit, map, nextOrValue, permutations, product, range, reduce, repeat, slice, some, starMap, takeWhile, tee, toArray, toIterator, zip, zipLongest};