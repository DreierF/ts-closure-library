/**
 * @fileoverview Utilities for manipulating arrays.
 */
/**
 * @type {boolean} If true, JSCompiler will use the native implementation of
 * array functions where appropriate (e.g., `Array#filter`) and remove the
 * unused pure JS implementation.
 */
export const ASSUME_NATIVE_FUNCTIONS: boolean;
/**
 * Inserts a value into a sorted array. The array is not modified if the
 * value is already present.
 * @param {ArrayLike<VALUE>} array The array to modify.
 * @param {?VALUE} value The object to insert.
 * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is ordered. Should take 2 arguments to
 *     compare, and return a negative number, zero, or a positive number
 *     depending on whether the first argument is less than, equal to, or
 *     greater than the second.
 * @return {boolean} True if an element was inserted.
 * @template VALUE
 */
export function binaryInsert<VALUE>(array: ArrayLike<VALUE>, value: VALUE | null, opt_compareFn?: ((arg0: VALUE, arg1: VALUE) => number) | undefined): boolean;
/**
 * Removes a value from a sorted array.
 * @param {!ArrayLike<VALUE>} array The array to modify.
 * @param {?VALUE} value The object to remove.
 * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is ordered. Should take 2 arguments to
 *     compare, and return a negative number, zero, or a positive number
 *     depending on whether the first argument is less than, equal to, or
 *     greater than the second.
 * @return {boolean} True if an element was removed.
 * @template VALUE
 */
export function binaryRemove<VALUE>(array: ArrayLike<VALUE>, value: VALUE | null, opt_compareFn?: ((arg0: VALUE, arg1: VALUE) => number) | undefined): boolean;
/**
 * Searches the specified array for the specified target using the binary
 * search algorithm.  If no opt_compareFn is specified, elements are compared
 * using <code>defaultCompare</code>, which compares the elements
 * using the built in < and > operators.  This will produce the expected
 * behavior for homogeneous arrays of String(s) and Number(s). The array
 * specified <b>must</b> be sorted in ascending order (as defined by the
 * comparison function).  If the array is not sorted, results are undefined.
 * If the array contains multiple instances of the specified target value, the
 * left-most instance will be found.
 *
 * Runtime: O(log n)
 *
 * @param {ArrayLike<VALUE>} arr The array to be searched.
 * @param {?TARGET} target The sought value.
 * @param {function(TARGET, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is ordered. Should take 2 arguments to
 *     compare, the target value and an element from your array, and return a
 *     negative number, zero, or a positive number depending on whether the
 *     first argument is less than, equal to, or greater than the second.
 * @return {number} Lowest index of the target value if found, otherwise
 *     (-(insertion point) - 1). The insertion point is where the value should
 *     be inserted into arr to preserve the sorted property.  Return value >= 0
 *     iff target is found.
 * @template TARGET, VALUE
 */
export function binarySearch<TARGET, VALUE>(arr: ArrayLike<VALUE>, target: TARGET | null, opt_compareFn?: ((arg0: TARGET, arg1: VALUE) => number) | undefined): number;
/**
 * Selects an index in the specified array using the binary search algorithm.
 * The evaluator receives an element and determines whether the desired index
 * is before, at, or after it.  The evaluator must be consistent (formally,
 * map(map(arr, evaluator, opt_obj), goog.math.sign)
 * must be monotonically non-increasing).
 *
 * Runtime: O(log n)
 *
 * @param {ArrayLike<VALUE>} arr The array to be searched.
 * @param {function(this:THIS, VALUE, number, ?): number} evaluator
 *     Evaluator function that receives 3 arguments (the element, the index and
 *     the array). Should return a negative number, zero, or a positive number
 *     depending on whether the desired index is before, at, or after the
 *     element passed to it.
 * @param {THIS=} opt_obj The object to be used as the value of 'this'
 *     within evaluator.
 * @return {number} Index of the leftmost element matched by the evaluator, if
 *     such exists; otherwise (-(insertion point) - 1). The insertion point is
 *     the index of the first element for which the evaluator returns negative,
 *     or arr.length if no such element exists. The return value is non-negative
 *     iff a match is found.
 * @template THIS, VALUE
 */
export function binarySelect<THIS, VALUE>(arr: ArrayLike<VALUE>, evaluator: (this: THIS, arg1: VALUE, arg2: number, arg3: unknown) => number, opt_obj?: THIS | undefined): number;
/**
 * Splits an array into disjoint buckets according to a splitting function.
 * @param {ArrayLike<T>} array The array.
 * @param {function(this:S, T, number, !ArrayLike<T>):?} sorter Function to
 *     call for every element.  This takes 3 arguments (the element, the index
 *     and the array) and must return a valid object key (a string, number,
 *     etc), or undefined, if that object should not be placed in a bucket.
 * @param {S=} opt_obj The object to be used as the value of 'this' within
 *     sorter.
 * @return {!Object<!Array<T>>} An object, with keys being all of the unique
 *     return values of sorter, and values being arrays containing the items for
 *     which the splitter returned that key.
 * @template T,S
 */
export function bucket<T, S>(array: ArrayLike<T>, sorter: (this: S, arg1: T, arg2: number, arg3: ArrayLike<T>) => unknown, opt_obj?: S | undefined): any;
/**
 * Clears the array.
 * @param {ArrayLike<?>} arr Array or array like object to clear.
 */
export function clear(arr: ArrayLike<unknown>): void;
/**
 * Does a shallow copy of an array.
 * @param {ArrayLike<T>|string} arr  Array or array-like object to
 *     clone.
 * @return {!Array<T>} Clone of the input array.
 * @template T
 */
export function clone<T>(arr: string | ArrayLike<T>): T[];
/**
 * 3-way array compare function.
 * @param {!ArrayLike<VALUE>} arr1 The first array to
 *     compare.
 * @param {!ArrayLike<VALUE>} arr2 The second array to
 *     compare.
 * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is to be ordered. Should take 2 arguments to
 *     compare, and return a negative number, zero, or a positive number
 *     depending on whether the first argument is less than, equal to, or
 *     greater than the second.
 * @return {number} Negative number, zero, or a positive number depending on
 *     whether the first argument is less than, equal to, or greater than the
 *     second.
 * @template VALUE
 */
export function compare3<VALUE>(arr1: ArrayLike<VALUE>, arr2: ArrayLike<VALUE>, opt_compareFn?: ((arg0: VALUE, arg1: VALUE) => number) | undefined): number;
/**
 * Returns a new array that is the result of joining the arguments.  If arrays
 * are passed then their items are added, however, if non-arrays are passed they
 * will be added to the return array as is.
 *
 * Note that ArrayLike objects will be added as is, rather than having their
 * items added.
 *
 * concat([1, 2], [3, 4]) -> [1, 2, 3, 4]
 * concat(0, [1, 2]) -> [0, 1, 2]
 * concat([1, 2], null) -> [1, 2, null]
 *
 * There is bug in all current versions of IE (6, 7 and 8) where arrays created
 * in an iframe become corrupted soon (not immediately) after the iframe is
 * destroyed. This is common if loading data via goog.net.IframeIo, for example.
 * This corruption only affects the concat method which will start throwing
 * Catastrophic Errors (#-2147418113).
 *
 * See http://endoflow.com/scratch/corrupted-arrays.html for a test case.
 *
 * Internally google.array should use this, so that all methods will continue to
 * work on these broken array objects.
 *
 * @param {...*} var_args Items to concatenate.  Arrays will have each item
 *     added, while primitives and objects will be added as is.
 * @return {!Array<?>} The new resultant array.
 * @deprecated Use Array.concat directly
 */
export function concat<T>(...args: T[][]): Array<T>;
export function concat<T>(...args: T[]): Array<T>;
export function concat<T>(array: T[], element: T): Array<T>;
export function concat(...args: any[]): Array<unknown>;
/**
 * Maps each element of the input array into zero or more elements of the output
 * array.
 *
 * @param {!ArrayLike<VALUE>|string} arr Array or array like object
 *     over which to iterate.
 * @param {function(this:THIS, VALUE, number, ?): !Array<RESULT>} f The function
 *     to call for every element. This function takes 3 arguments (the element,
 *     the index and the array) and should return an array. The result will be
 *     used to extend a new array.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within f.
 * @return {!Array<RESULT>} a new array with the concatenation of all arrays
 *     returned from f.
 * @template THIS, VALUE, RESULT
 */
export function concatMap<THIS, VALUE, RESULT>(arr: string | ArrayLike<VALUE>, f: (this: THIS, arg1: VALUE, arg2: number, arg3: unknown) => RESULT[], opt_obj?: THIS | undefined): RESULT[];
/**
 * Whether the array contains the given object.
 * @param {ArrayLike<?>|string} arr The array to test for the presence of the
 *     element.
 * @param {*} obj The object for which to test.
 * @return {boolean} true if obj is present.
 * @deprecated Use arr.includes(obj) instead
 */
export function contains(arr: ArrayLike<unknown> | string, obj: any): boolean;
/**
 * Returns a new array of elements from arr, based on the indexes of elements
 * provided by index_arr. For example, the result of index copying
 * ['a', 'b', 'c'] with index_arr [1,0,0,2] is ['b', 'a', 'a', 'c'].
 *
 * @param {!ArrayLike<T>} arr The array to get a indexed copy from.
 * @param {!ArrayLike<number>} index_arr An array of indexes to get from arr.
 * @return {!Array<T>} A new array of elements from arr in index_arr order.
 * @template T
 */
export function copyByIndex<T>(arr: ArrayLike<T>, index_arr: ArrayLike<number>): T[];
/**
 * Counts the array elements that fulfill the predicate, i.e. for which the
 * callback function returns true. Skips holes in the array.
 *
 * @param {!ArrayLike<T>|string} arr Array or array like object
 *     over which to iterate.
 * @param {function(this: S, T, number, ?): boolean} f The function to call for
 *     every element. Takes 3 arguments (the element, the index and the array).
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @return {number} The number of the matching elements.
 * @template T,S
 */
export function count<T, S>(arr: string | ArrayLike<T>, f: (this: S, arg1: T, arg2: number, arg3: unknown) => boolean, opt_obj?: S | undefined): number;
/**
 * Compares its two arguments for order, using the built in < and >
 * operators.
 * @param {?VALUE} a The first object to be compared.
 * @param {?VALUE} b The second object to be compared.
 * @return {number} A negative number, zero, or a positive number as the first
 *     argument is less than, equal to, or greater than the second,
 *     respectively.
 * @template VALUE
 */
export function defaultCompare<VALUE>(a: VALUE | null, b: VALUE | null): number;
/**
 * Compares its two arguments for equality, using the built in === operator.
 * @param {*} a The first object to compare.
 * @param {*} b The second object to compare.
 * @return {boolean} True if the two arguments are equal, false otherwise.
 */
export function defaultCompareEquality(a: any, b: any): boolean;
/**
 * Compares two arrays for equality. Two arrays are considered equal if they
 * have the same length and their corresponding elements are equal according to
 * the comparison function.
 *
 * @param {ArrayLike<?>} arr1 The first array to compare.
 * @param {ArrayLike<?>} arr2 The second array to compare.
 * @param {Function=} opt_equalsFn Optional comparison function.
 *     Should take 2 arguments to compare, and return true if the arguments
 *     are equal. Defaults to {@link defaultCompareEquality} which
 *     compares the elements using the built-in '===' operator.
 * @return {boolean} Whether the two arrays are equal.
 */
export function equals(arr1: ArrayLike<unknown>, arr2: ArrayLike<unknown>, opt_equalsFn?: Function | undefined): boolean;
/**
 * Call f for each element of an array. If all calls return true, every()
 * returns true. If any call returns false, every() returns false and
 * does not continue to check the remaining elements.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-every}
 *
 * @param {ArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {boolean} false if any element fails the test.
 * @template T,S
 * @deprecated Use Array.every directly
 */
export function every<T, S>(arr: string | ArrayLike<T>, f: ((this: S, arg1: T, arg2: number, arg3: unknown) => boolean) | null, opt_obj?: S | undefined): boolean;
/**
 * Extends an array with another array, element, or "array like" object.
 * This function operates 'in-place', it does not create a new Array.
 *
 * Example:
 * var a = [];
 * extend(a, [0, 1]);
 * a; // [0, 1]
 * extend(a, 2);
 * a; // [0, 1, 2]
 *
 * @param {Array<VALUE>} arr1  The array to modify.
 * @param {...(ArrayLike<VALUE>|VALUE)} var_args The elements or arrays of
 *     elements to add to arr1.
 * @template VALUE
 */
export function extend<VALUE>(arr1: VALUE[], ...args: (VALUE | ArrayLike<VALUE>)[]): void;
/**
 * Calls a function for each element in an array, and if the function returns
 * true adds the element to a new array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-filter}
 *
 * @param {ArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?):boolean} f The function to call for
 *     every element. This function
 *     takes 3 arguments (the element, the index and the array) and must
 *     return a Boolean. If the return value is true the element is added to the
 *     result array. If it is false the element is not included.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {!Array<T>} a new array in which only elements that passed the test
 *     are present.
 * @template T,S
 * @deprecated Use Array.filter directly
 */
export function filter<T, S>(arr: string | ArrayLike<T>, f: ((this: S, arg1: T, arg2: number, arg3: unknown) => boolean) | null, opt_obj?: S | undefined): T[];
/**
 * Search an array for the first element that satisfies a given condition and
 * return that element.
 * @param {ArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {T|null} The first array element that passes the test, or null if no
 *     element is found.
 * @template T,S
 * @deprecated Use arr.find(f) instead
 */
export function find<T, S>(arr: string | ArrayLike<T>, f: ((this: S, arg1: T, arg2: number, arg3: unknown) => boolean) | null, opt_obj?: S | undefined): T | null;
/**
 * Search an array for the first element that satisfies a given condition and
 * return its index.
 * @param {ArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The index of the first array element that passes the test,
 *     or -1 if no element is found.
 * @template T,S
 * @deprecated Use arr.findIndex(f) instead
 */
export function findIndex<T, S>(arr: string | ArrayLike<T>, f: ((this: S, arg1: T, arg2: number, arg3: unknown) => boolean) | null, opt_obj?: S | undefined): number;
/**
 * Search an array (in reverse order) for the last element that satisfies a
 * given condition and return its index.
 * @param {ArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The index of the last array element that passes the test,
 *     or -1 if no element is found.
 * @template T,S
 */
export function findIndexRight<T, S>(arr: string | ArrayLike<T>, f: ((this: S, arg1: T, arg2: number, arg3: unknown) => boolean) | null, opt_obj?: S | undefined): number;
/**
 * Search an array (in reverse order) for the last element that satisfies a
 * given condition and return that element.
 * @param {ArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {T|null} The last array element that passes the test, or null if no
 *     element is found.
 * @template T,S
 */
export function findRight<T, S>(arr: string | ArrayLike<T>, f: ((this: S, arg1: T, arg2: number, arg3: unknown) => boolean) | null, opt_obj?: S | undefined): T | null;
/**
 * Returns an array consisting of every argument with all arrays
 * expanded in-place recursively.
 *
 * @param {...*} var_args The values to flatten.
 * @return {!Array<?>} An array containing the flattened values.
 */
export function flatten(...args: any[]): Array<unknown>;
/**
 * Calls a function for each element in an array. Skips holes in the array.
 * See {@link http://tinyurl.com/developer-mozilla-org-array-foreach}
 *
 * @param {ArrayLike<T>|string} arr Array or array like object over
 *     which to iterate.
 * @param {?function(this: S, T, number, ?): ?} f The function to call for every
 *     element. This function takes 3 arguments (the element, the index and the
 *     array). The return value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @template T,S
 * @deprecated Use Array.forEach directly or for ... of loops
 */
export function forEach<T, S>(arr: string | ArrayLike<T>, f: ((this: S, arg1: T, arg2: number, arg3: unknown) => unknown) | null, opt_obj?: S | undefined): void;
/**
 * Calls a function for each element in an array, starting from the last
 * element rather than the first.
 *
 * @param {ArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this: S, T, number, ?): ?} f The function to call for every
 *     element. This function
 *     takes 3 arguments (the element, the index and the array). The return
 *     value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @template T,S
 */
export function forEachRight<T, S>(arr: string | ArrayLike<T>, f: ((this: S, arg1: T, arg2: number, arg3: unknown) => unknown) | null, opt_obj?: S | undefined): void;
/**
 * Returns the index of the first element of an array with a specified value, or
 * -1 if the element is not present in the array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-indexof}
 *
 * @param {ArrayLike<T>|string} arr The array to be searched.
 * @param {T} obj The object for which we are searching.
 * @param {number=} opt_fromIndex The index at which to start the search. If
 *     omitted the search starts at index 0.
 * @return {number} The index of the first matching array element.
 * @template T
 * @deprecated Use Array.indexOf directly
 */
export function indexOf<T>(arr: string | ArrayLike<T>, obj: T, opt_fromIndex?: number | undefined): number;
/**
 * Pushes an item into an array, if it's not already in the array.
 * @param {Array<T>} arr Array into which to insert the item.
 * @param {T} obj Value to add.
 * @template T
 */
export function insert<T>(arr: T[], obj: T): void;
/**
 * Inserts at the given index of the array, all elements of another array.
 * @param {ArrayLike<?>} arr The array to modify.
 * @param {ArrayLike<?>} elementsToAdd The array of elements to add.
 * @param {number=} opt_i The index at which to insert the object. If omitted,
 *      treated as 0. A negative index is counted from the end of the array.
 */
export function insertArrayAt(arr: ArrayLike<unknown>, elementsToAdd: ArrayLike<unknown>, opt_i?: number | undefined): void;
/**
 * Inserts an object at the given index of the array.
 * @param {ArrayLike<?>} arr The array to modify.
 * @param {*} obj The object to insert.
 * @param {number=} opt_i The index at which to insert the object. If omitted,
 *      treated as 0. A negative index is counted from the end of the array.
 */
export function insertAt(arr: ArrayLike<unknown>, obj: any, opt_i?: number | undefined): void;
/**
 * Inserts an object into an array before a specified object.
 * @param {Array<T>} arr The array to modify.
 * @param {T} obj The object to insert.
 * @param {T=} opt_obj2 The object before which obj should be inserted. If obj2
 *     is omitted or not found, obj is inserted at the end of the array.
 * @template T
 */
export function insertBefore<T>(arr: T[], obj: T, opt_obj2?: T | undefined, ...args: any[]): void;
/**
 * Compares its two arguments for inverse order, using the built in < and >
 * operators.
 * @param {?VALUE} a The first object to be compared.
 * @param {?VALUE} b The second object to be compared.
 * @return {number} A negative number, zero, or a positive number as the first
 *     argument is greater than, equal to, or less than the second,
 *     respectively.
 * @template VALUE
 */
export function inverseDefaultCompare<VALUE>(a: VALUE | null, b: VALUE | null): number;
/**
 * Whether the array is empty.
 * @param {ArrayLike<?>|string} arr The array to test.
 * @return {boolean} true if empty.
 */
export function isEmpty(arr: ArrayLike<unknown> | string): boolean;
/**
 * Tells if the array is sorted.
 * @param {!ArrayLike<T>} arr The array.
 * @param {?function(T,T):number=} opt_compareFn Function to compare the
 *     array elements.
 *     Should take 2 arguments to compare, and return a negative number, zero,
 *     or a positive number depending on whether the first argument is less
 *     than, equal to, or greater than the second.
 * @param {boolean=} opt_strict If true no equal elements are allowed.
 * @return {boolean} Whether the array is sorted.
 * @template T
 */
export function isSorted<T>(arr: ArrayLike<T>, opt_compareFn?: ((arg0: T, arg1: T) => number) | null | undefined, opt_strict?: boolean | undefined): boolean;
/**
 * Returns a new array that contains the contents of all the arrays passed.
 * @param {...!Array<T>} var_args
 * @return {!Array<T>}
 * @template T
 * @deprecated Use Array.concat directly
 */
export function join<T>(...args: T[][]): T[];
/**
 * Returns the last element in an array without removing it.
 * Same as peek.
 * @param {ArrayLike<T>|string} array The array.
 * @return {T} Last item in array.
 * @template T
 */
export function last<T>(array: string | ArrayLike<T>): T;
/**
 * Returns the index of the last element of an array with a specified value, or
 * -1 if the element is not present in the array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-lastindexof}
 *
 * @param {!ArrayLike<T>|string} arr The array to be searched.
 * @param {T} obj The object for which we are searching.
 * @param {?number=} opt_fromIndex The index at which to start the search. If
 *     omitted the search starts at the end of the array.
 * @return {number} The index of the last matching array element.
 * @template T
 * @deprecated Use Array.lastIndexOf directly
 */
export function lastIndexOf<T>(arr: string | ArrayLike<T>, obj: T, opt_fromIndex?: (number | null) | undefined): number;
/**
 * Calls a function for each element in an array and inserts the result into a
 * new array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-map}
 *
 * @param {ArrayLike<VALUE>|string} arr Array or array like object
 *     over which to iterate.
 * @param {function(this:THIS, VALUE, number, ?): RESULT} f The function to call
 *     for every element. This function takes 3 arguments (the element,
 *     the index and the array) and should return something. The result will be
 *     inserted into a new array.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within f.
 * @return {!Array<RESULT>} a new array with the results from f.
 * @template THIS, VALUE, RESULT
 * @deprecated Use Array.map directly
 */
export function map<THIS, VALUE, RESULT>(arr: string | ArrayLike<VALUE>, f: (this: THIS, arg1: VALUE, arg2: number, arg3: unknown) => RESULT, opt_obj?: THIS | undefined): RESULT[];
/**
 * Moves one item of an array to a new position keeping the order of the rest
 * of the items. Example use case: keeping a list of JavaScript objects
 * synchronized with the corresponding list of DOM elements after one of the
 * elements has been dragged to a new position.
 * @param {!ArrayLike<?>} arr The array to modify.
 * @param {number} fromIndex Index of the item to move between 0 and
 *     {@code arr.length - 1}.
 * @param {number} toIndex Target index between 0 and {@code arr.length - 1}.
 */
export function moveItem(arr: ArrayLike<unknown>, fromIndex: number, toIndex: number): void;
/**
 * Returns the last element in an array without removing it.
 * Same as last.
 * @param {ArrayLike<T>|string} array The array.
 * @return {T} Last item in array.
 * @template T
 */
export function peek<T>(array: string | ArrayLike<T>): T;
/**
 * Creates a range of numbers in an arithmetic progression.
 *
 * Range takes 1, 2, or 3 arguments:
 * <pre>
 * range(5) is the same as range(0, 5, 1) and produces [0, 1, 2, 3, 4]
 * range(2, 5) is the same as range(2, 5, 1) and produces [2, 3, 4]
 * range(-2, -5, -1) produces [-2, -3, -4]
 * range(-2, -5, 1) produces [], since stepping by 1 wouldn't ever reach -5.
 * </pre>
 *
 * @param {number} startOrEnd The starting value of the range if an end argument
 *     is provided. Otherwise, the start value is 0, and this is the end value.
 * @param {number=} opt_end The optional end value of the range.
 * @param {number=} opt_step The step size between range values. Defaults to 1
 *     if opt_step is undefined or 0.
 * @return {!Array<number>} An array of numbers for the requested range. May be
 *     an empty array if adding the step would not converge toward the end
 *     value.
 */
export function range(startOrEnd: number, opt_end?: number | undefined, opt_step?: number | undefined): Array<number>;
/**
 * Passes every element of an array into a function and accumulates the result.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-reduce}
 *
 * For example:
 * var a = [1, 2, 3, 4];
 * reduce(a, function(r, v, i, arr) {return r + v;}, 0);
 * returns 10
 *
 * @param {ArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {function(this:S, R, T, number, ?) : R} f The function to call for
 *     every element. This function
 *     takes 4 arguments (the function's previous result or the initial value,
 *     the value of the current array element, the current array index, and the
 *     array itself)
 *     function(previousValue, currentValue, index, array).
 * @param {?} val The initial value to pass into the function on the first call.
 * @param {S=} opt_obj  The object to be used as the value of 'this'
 *     within f.
 * @return {R} Result of evaluating f repeatedly across the values of the array.
 * @template T,S,R
 * @deprecated Use Array.reduce directly
 */
export function reduce<T, S, R>(arr: string | ArrayLike<T>, f: (this: S, arg1: R, arg2: T, arg3: number, arg4: unknown) => R, val: unknown, opt_obj?: S | undefined): R;
/**
 * Passes every element of an array into a function and accumulates the result,
 * starting from the last element and working towards the first.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-reduceright}
 *
 * For example:
 * var a = ['a', 'b', 'c'];
 * reduceRight(a, function(r, v, i, arr) {return r + v;}, '');
 * returns 'cba'
 *
 * @param {ArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, R, T, number, ?) : R} f The function to call for
 *     every element. This function
 *     takes 4 arguments (the function's previous result or the initial value,
 *     the value of the current array element, the current array index, and the
 *     array itself)
 *     function(previousValue, currentValue, index, array).
 * @param {?} val The initial value to pass into the function on the first call.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {R} Object returned as a result of evaluating f repeatedly across the
 *     values of the array.
 * @template T,S,R
 * @deprecated Use Array.reduceRight directly
 */
export function reduceRight<T, S, R>(arr: string | ArrayLike<T>, f: ((this: S, arg1: R, arg2: T, arg3: number, arg4: unknown) => R) | null, val: unknown, opt_obj?: S | undefined): R;
/**
 * Removes the first occurrence of a particular value from an array.
 * @param {ArrayLike<T>} arr Array from which to remove
 *     value.
 * @param {T} obj Object to remove.
 * @return {boolean} True if an element was removed.
 * @template T
 */
export function remove<T>(arr: ArrayLike<T>, obj: T): boolean;
/**
 * Removes all values that satisfy the given condition.
 * @param {ArrayLike<T>} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The number of items removed
 * @template T,S
 */
export function removeAllIf<T, S>(arr: ArrayLike<T>, f: ((this: S, arg1: T, arg2: number, arg3: unknown) => boolean) | null, opt_obj?: S | undefined): number;
/**
 * Removes from an array the element at index i
 * @param {ArrayLike<?>} arr Array or array like object from which to
 *     remove value.
 * @param {number} i The index to remove.
 * @return {boolean} True if an element was removed.
 */
export function removeAt(arr: ArrayLike<unknown>, i: number): boolean;
/**
 * Removes all duplicates from an array (retaining only the first
 * occurrence of each array element).  This function modifies the
 * array in place and doesn't change the order of the non-duplicate items.
 *
 * For objects, duplicates are identified as having the same unique ID as
 * defined by {@link google.getUid}.
 *
 * Alternatively you can specify a custom hash function that returns a unique
 * value for each item in the array it should consider unique.
 *
 * Runtime: N,
 * Worstcase space: 2N (no dupes)
 *
 * @param {ArrayLike<T>} arr The array from which to remove
 *     duplicates.
 * @param {Array=} opt_rv An optional array in which to return the results,
 *     instead of performing the removal inplace.  If specified, the original
 *     array will remain unchanged.
 * @param {function(T):string=} opt_hashFn An optional function to use to
 *     apply to every item in the array. This function should return a unique
 *     value for each item in the array it should consider unique.
 * @template T
 */
export function removeDuplicates<T>(arr: ArrayLike<T>, opt_rv?: Array | undefined, opt_hashFn?: ((arg0: T) => string) | undefined): void;
/**
 * Removes the first value that satisfies the given condition.
 * @param {ArrayLike<T>} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {boolean} True if an element was removed.
 * @template T,S
 */
export function removeIf<T, S>(arr: ArrayLike<T>, f: ((this: S, arg1: T, arg2: number, arg3: unknown) => boolean) | null, opt_obj?: S | undefined): boolean;
/**
 * Removes the last occurrence of a particular value from an array.
 * @param {!ArrayLike<T>} arr Array from which to remove value.
 * @param {T} obj Object to remove.
 * @return {boolean} True if an element was removed.
 * @template T
 */
export function removeLast<T>(arr: ArrayLike<T>, obj: T): boolean;
/**
 * Returns an array consisting of the given value repeated N times.
 *
 * @param {?VALUE} value The value to repeat.
 * @param {number} n The repeat count.
 * @return {!Array<VALUE>} An array with the repeated value.
 * @template VALUE
 */
export function repeat<VALUE>(value: VALUE | null, n: number): VALUE[];
/**
 * Rotates an array in-place. After calling this method, the element at
 * index i will be the element previously at index (i - n) %
 * array.length, for all values of i between 0 and array.length - 1,
 * inclusive.
 *
 * For example, suppose list comprises [t, a, n, k, s]. After invoking
 * rotate(array, 1) (or rotate(array, -4)), array will comprise [s, t, a, n, k].
 *
 * @param {!Array<T>} array The array to rotate.
 * @param {number} n The amount to rotate.
 * @return {!Array<T>} The array.
 * @template T
 */
export function rotate<T>(array: T[], n: number): T[];
/**
 * Shuffles the values in the specified array using the Fisher-Yates in-place
 * shuffle (also known as the Knuth Shuffle). By default, calls Math.random()
 * and so resets the state of that random number generator. Similarly, may reset
 * the state of any other specified random number generator.
 *
 * Runtime: O(n)
 *
 * @param {!Array<?>} arr The array to be shuffled.
 * @param {function():number=} opt_randFn Optional random function to use for
 *     shuffling.
 *     Takes no arguments, and returns a random number on the interval [0, 1).
 *     Defaults to Math.random() using JavaScript's built-in Math library.
 */
export function shuffle(arr: Array<unknown>, opt_randFn?: (() => number) | undefined): void;
/**
 * Returns a new array from a segment of an array. This is a generic version of
 * Array slice. This means that it might work on other objects similar to
 * arrays, such as the arguments object.
 *
 * @param {ArrayLike<T>|string} arr The array from
 * which to copy a segment.
 * @param {number} start The index of the first element to copy.
 * @param {number=} opt_end The index after the last element to copy.
 * @return {!Array<T>} A new array containing the specified segment of the
 *     original array.
 * @template T
 */
export function slice<T>(arr: string | ArrayLike<T>, start: number, opt_end?: number | undefined, ...args: any[]): T[];
/**
 * Calls f for each element of an array. If any call returns true, some()
 * returns true (without checking the remaining elements). If all calls
 * return false, some() returns false.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-some}
 *
 * @param {ArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj  The object to be used as the value of 'this'
 *     within f.
 * @return {boolean} true if any element passes the test.
 * @template T,S
 * @deprecated Use Array.some directly
 */
export function some<T, S>(arr: string | ArrayLike<T>, f: ((this: S, arg1: T, arg2: number, arg3: unknown) => boolean) | null, opt_obj?: S | undefined): boolean;
/**
 * Sorts the specified array into ascending order.  If no opt_compareFn is
 * specified, elements are compared using
 * <code>defaultCompare</code>, which compares the elements using
 * the built in < and > operators.  This will produce the expected behavior
 * for homogeneous arrays of String(s) and Number(s), unlike the native sort,
 * but will give unpredictable results for heterogeneous lists of strings and
 * numbers with different numbers of digits.
 *
 * This sort is not guaranteed to be stable.
 *
 * Runtime: Same as <code>Array.prototype.sort</code>
 *
 * @param {Array<T>} arr The array to be sorted.
 * @param {?function(T,T):number=} opt_compareFn Optional comparison
 *     function by which the
 *     array is to be ordered. Should take 2 arguments to compare, and return a
 *     negative number, zero, or a positive number depending on whether the
 *     first argument is less than, equal to, or greater than the second.
 * @template T
 * @deprecated Use arr.sort(opt_compareFn) instead
 */
export function sort<T>(arr: T[], opt_compareFn?: ((arg0: T, arg1: T) => number) | null | undefined): void;
/**
 * Sort the specified array into ascending order based on item keys
 * returned by the specified key function.
 * If no opt_compareFn is specified, the keys are compared in ascending order
 * using <code>defaultCompare</code>.
 *
 * Runtime: O(S(f(n)), where S is runtime of <code>sort</code>
 * and f(n) is runtime of the key function.
 *
 * @param {Array<T>} arr The array to be sorted.
 * @param {function(T): K} keyFn Function taking array element and returning
 *     a key used for sorting this element.
 * @param {?function(K, K): number=} opt_compareFn Optional comparison function
 *     by which the keys are to be ordered. Should take 2 arguments to compare,
 *     and return a negative number, zero, or a positive number depending on
 *     whether the first argument is less than, equal to, or greater than the
 *     second.
 * @template T,K
 */
export function sortByKey<T, K>(arr: T[], keyFn: (arg0: T) => K, opt_compareFn?: ((arg0: K, arg1: K) => number) | null | undefined): void;
/**
 * Sorts an array of objects by the specified object key and compare
 * function. If no compare function is provided, the key values are
 * compared in ascending order using <code>defaultCompare</code>.
 * This won't work for keys that get renamed by the compiler. So use
 * {'foo': 1, 'bar': 2} rather than {foo: 1, bar: 2}.
 * @param {Array<Object>} arr An array of objects to sort.
 * @param {string} key The object key to sort by.
 * @param {Function=} opt_compareFn The function to use to compare key
 *     values.
 */
export function sortObjectsByKey(arr: Array<any>, key: string, opt_compareFn?: Function | undefined): void;
/**
 * Adds or removes elements from an array. This is a generic version of Array
 * splice. This means that it might work on other objects similar to arrays,
 * such as the arguments object.
 *
 * @param {ArrayLike<T>} arr The array to modify.
 * @param {number|undefined} index The index at which to start changing the
 *     array. If not defined, treated as 0.
 * @param {number} howMany How many elements to remove (0 means no removal. A
 *     value below 0 is treated as zero and so is any other non number. Numbers
 *     are floored).
 * @param {...T} var_args Optional, additional elements to insert into the
 *     array.
 * @return {!Array<T>} the removed elements.
 * @template T
 */
export function splice<T>(arr: ArrayLike<T>, index: number | undefined, howMany: number, ...args: T[]): T[];
/**
 * Sorts the specified array into ascending order in a stable way.  If no
 * opt_compareFn is specified, elements are compared using
 * <code>defaultCompare</code>, which compares the elements using
 * the built in < and > operators.  This will produce the expected behavior
 * for homogeneous arrays of String(s) and Number(s).
 *
 * Runtime: Same as <code>Array.prototype.sort</code>, plus an additional
 * O(n) overhead of copying the array twice.
 *
 * @param {Array<T>} arr The array to be sorted.
 * @param {?function(T, T): number=} opt_compareFn Optional comparison function
 *     by which the array is to be ordered. Should take 2 arguments to compare,
 *     and return a negative number, zero, or a positive number depending on
 *     whether the first argument is less than, equal to, or greater than the
 *     second.
 * @template T
 */
export function stableSort<T>(arr: T[], opt_compareFn?: ((arg0: T, arg1: T) => number) | null | undefined): void;
/**
 * Converts an object to an array.
 * @param {ArrayLike<T>|string} object  The object to convert to an
 *     array.
 * @return {!Array<T>} The object converted into an array. If object has a
 *     length property, every property indexed with a non-negative number
 *     less than length will be included in the result. If object does not
 *     have a length property, an empty array will be returned.
 * @template T
 */
export function toArray<T>(object: string | ArrayLike<T>): T[];
/**
 * Creates a new object built from the provided array and the key-generation
 * function.
 * @param {ArrayLike<T>} arr Array or array like object over
 *     which to iterate whose elements will be the values in the new object.
 * @param {?function(this:S, T, number, ?) : string} keyFunc The function to
 *     call for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a string that will be used as the
 *     key for the element in the new object. If the function returns the same
 *     key for more than one element, the value for that key is
 *     implementation-defined.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within keyFunc.
 * @return {!Object<T>} The new object.
 * @template T,S
 */
export function toObject<T, S>(arr: ArrayLike<T>, keyFunc: ((this: S, arg1: T, arg2: number, arg3: unknown) => string) | null, opt_obj?: S | undefined): any;
/**
 * Creates a new array for which the element at position i is an array of the
 * ith element of the provided arrays.  The returned array will only be as long
 * as the shortest array provided; additional values are ignored.  For example,
 * the result of zipping [1, 2] and [3, 4, 5] is [[1,3], [2, 4]].
 *
 * This is similar to the zip() function in Python.  See {@link
 * http://docs.python.org/library/functions.html#zip}
 *
 * @param {...!ArrayLike<?>} var_args Arrays to be combined.
 * @return {!Array<!Array<?>>} A new array of arrays created from
 *     provided arrays.
 */
export function zip(...args: ArrayLike<any>[]): Array<Array<unknown>>;
