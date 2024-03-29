import * as object from './../object/object.js';
import * as structs from './structs.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Datastructure: Trie.
 *
 *
 * This file provides the implementation of a trie data structure.  A trie is a
 * data structure that stores key/value pairs in a prefix tree.  See:
 *     http://en.wikipedia.org/wiki/Trie
 */

/**
 * Class for a Trie datastructure.  Trie data structures are made out of trees
 * of Trie classes.
 *
 *     Trie or Object to initialize trie with.
 * @template VALUE
 */
class Trie {

  /**
   * Class for a Trie datastructure.  Trie data structures are made out of trees
   * of Trie classes.
   *
   * @param {Trie<VALUE>|Object<string, VALUE>=} opt_trie Optional
   *     Trie or Object to initialize trie with.
   * @template VALUE
   */
  constructor(opt_trie) {
    /**
     * This trie's value.  For the base trie, this will be the value of the
     * empty key, if defined.
     * @private {VALUE}
     */
    this.value_ = undefined;
  
    /**
     * This trie's child nodes.
     * @private {!Object<!Trie<VALUE>>}
     */
    this.childNodes_ = {};
  
    if (opt_trie) {
      this.setAll(opt_trie);
    }
  }

  /**
   * Sets the given key/value pair in the trie.  O(L), where L is the length
   * of the key.
   * @param {string} key The key.
   * @param {VALUE} value The value.
   */
  set(key, value) {
    this.setOrAdd_(key, value, false);
  };

  /**
   * Adds the given key/value pair in the trie.  Throw an exception if the key
   * already exists in the trie.  O(L), where L is the length of the key.
   * @param {string} key The key.
   * @param {VALUE} value The value.
   */
  add(key, value) {
    this.setOrAdd_(key, value, true);
  };

  /**
   * Helper function for set and add.  Adds the given key/value pair to
   * the trie, or, if the key already exists, sets the value of the key. If
   * opt_add is true, then throws an exception if the key already has a value in
   * the trie.  O(L), where L is the length of the key.
   * @param {string} key The key.
   * @param {VALUE} value The value.
   * @param {boolean=} opt_add Throw exception if key is already in the trie.
   * @private
   */
  setOrAdd_(key, value, opt_add) {
    var node = this;
    for (var characterPosition = 0; characterPosition < key.length;
         characterPosition++) {
      var currentCharacter = key.charAt(characterPosition);
      if (!node.childNodes_[currentCharacter]) {
        node.childNodes_[currentCharacter] = new Trie();
      }
      node = node.childNodes_[currentCharacter];
    }
    if (opt_add && node.value_ !== undefined) {
      throw new Error('The collection already contains the key "' + key + '"');
    } else {
      node.value_ = value;
    }
  };

  /**
   * Adds multiple key/value pairs from another Trie or Object.
   * O(N) where N is the number of nodes in the trie.
   * @param {!Object<string, VALUE>|!Trie<VALUE>} trie Object
   *     containing the data to add.
   */
  setAll(trie) {
    var keys = structs.getKeys(trie);
    var values = structs.getValues(trie);
  
    for (var i = 0; i < keys.length; i++) {
      this.set(keys[i], values[i]);
    }
  };

  /**
   * Traverse along the given path, returns the child node at ending.
   * Returns undefined if node for the path doesn't exist.
   * @param {string} path The path to traverse.
   * @return {!Trie<VALUE>|undefined}
   * @private
   */
  getChildNode_(path) {
    var node = this;
    for (var characterPosition = 0; characterPosition < path.length;
         characterPosition++) {
      var currentCharacter = path.charAt(characterPosition);
      node = node.childNodes_[currentCharacter];
      if (!node) {
        return undefined;
      }
    }
    return node;
  };

  /**
   * Retrieves a value from the trie given a key.  O(L), where L is the length of
   * the key.
   * @param {string} key The key to retrieve from the trie.
   * @return {VALUE|undefined} The value of the key in the trie, or undefined if
   *     the trie does not contain this key.
   */
  get(key) {
    var node = this.getChildNode_(key);
    return node ? node.value_ : undefined;
  };

  /**
   * Retrieves all values from the trie that correspond to prefixes of the given
   * input key. O(L), where L is the length of the key.
   *
   * @param {string} key The key to use for lookup. The given key as well as all
   *     prefixes of the key are retrieved.
   * @param {?number=} opt_keyStartIndex Optional position in key to start lookup
   *     from. Defaults to 0 if not specified.
   * @return {!Object<VALUE>} Map of end index of matching prefixes and
   *     corresponding values. Empty if no match found.  Note that the key is the
   *     index of the final character of the entry, rather than the length, so
   *     entries with a single character will clobber an empty-string entry with
   *     key '0'.
   */
  getKeyAndPrefixes(
      key, opt_keyStartIndex) {
    /** @type {!Trie<VALUE>} */
    var node = this;
    var matches = {};
    var characterPosition = opt_keyStartIndex || 0;
  
    if (node.value_ !== undefined) {
      matches[characterPosition] = node.value_;
    }
  
    for (; characterPosition < key.length; characterPosition++) {
      var currentCharacter = key.charAt(characterPosition);
      if (!(currentCharacter in node.childNodes_)) {
        break;
      }
      node = node.childNodes_[currentCharacter];
      if (/** @type {VALUE} */ (node.value_) !== undefined) {
        matches[characterPosition] = node.value_;
      }
    }
  
    return matches;
  };

  /**
   * Gets the values of the trie.  Not returned in any reliable order.  O(N) where
   * N is the number of nodes in the trie.  Calls getValuesInternal_.
   * @return {!Array<VALUE>} The values in the trie.
   */
  getValues() {
    var allValues = [];
    this.getValuesInternal_(allValues);
    return allValues;
  };

  /**
   * Gets the values of the trie.  Not returned in any reliable order.  O(N) where
   * N is the number of nodes in the trie.  Builds the values as it goes.
   * @param {!Array<VALUE>} allValues Array to place values into.
   * @private
   */
  getValuesInternal_(allValues) {
    if (this.value_ !== undefined) {
      allValues.push(this.value_);
    }
    for (var childNode in this.childNodes_) {
      this.childNodes_[childNode].getValuesInternal_(allValues);
    }
  };

  /**
   * Gets the keys of the trie.  Not returned in any reliable order.  O(N) where
   * N is the number of nodes in the trie (or prefix subtree).
   * @param {string=} opt_prefix Find only keys with this optional prefix.
   * @return {!Array<string>} The keys in the trie.
   */
  getKeys(opt_prefix) {
    var allKeys = [];
    if (opt_prefix) {
      // Traverse to the given prefix, then call getKeysInternal_ to dump the
      // keys below that point.
      var node = this;
      for (var characterPosition = 0; characterPosition < opt_prefix.length;
           characterPosition++) {
        var currentCharacter = opt_prefix.charAt(characterPosition);
        if (!node.childNodes_[currentCharacter]) {
          return [];
        }
        node = node.childNodes_[currentCharacter];
      }
      node.getKeysInternal_(opt_prefix, allKeys);
    } else {
      this.getKeysInternal_('', allKeys);
    }
    return allKeys;
  };

  /**
   * Private method to get keys from the trie.  Builds the keys as it goes.
   * @param {string} keySoFar The partial key (prefix) traversed so far.
   * @param {!Array<string>} allKeys The partially built array of keys seen so
   *     far.
   * @private
   */
  getKeysInternal_(keySoFar, allKeys) {
    if (this.value_ !== undefined) {
      allKeys.push(keySoFar);
    }
    for (var childNode in this.childNodes_) {
      this.childNodes_[childNode].getKeysInternal_(keySoFar + childNode, allKeys);
    }
  };

  /**
   * Checks to see if a certain key is in the trie.  O(L), where L is the length
   * of the key.
   * @param {string} key A key that may be in the trie.
   * @return {boolean} Whether the trie contains key.
   */
  containsKey(key) {
    return this.get(key) !== undefined;
  };

  /**
   * Checks to see if a certain prefix is in the trie. O(L), where L is the length
   * of the prefix.
   * @param {string} prefix A prefix that may be in the trie.
   * @return {boolean} Whether any key of the trie has the prefix.
   */
  containsPrefix(prefix) {
    // Empty string is any key's prefix.
    if (prefix.length == 0) {
      return !this.isEmpty();
    }
    return !!this.getChildNode_(prefix);
  };

  /**
   * Checks to see if a certain value is in the trie.  Worst case is O(N) where
   * N is the number of nodes in the trie.
   * @param {VALUE} value A value that may be in the trie.
   * @return {boolean} Whether the trie contains the value.
   */
  containsValue(value) {
    if (this.value_ === value) {
      return true;
    }
    for (var childNode in this.childNodes_) {
      if (this.childNodes_[childNode].containsValue(value)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Completely empties a trie of all keys and values.  ~O(1)
   */
  clear() {
    this.childNodes_ = {};
    this.value_ = undefined;
  };

  /**
   * Removes a key from the trie or throws an exception if the key is not in the
   * trie.  O(L), where L is the length of the key.
   * @param {string} key A key that should be removed from the trie.
   * @return {VALUE} The value whose key was removed.
   */
  remove(key) {
    var node = this;
    var parents = [];
    for (var characterPosition = 0; characterPosition < key.length;
         characterPosition++) {
      var currentCharacter = key.charAt(characterPosition);
      if (!node.childNodes_[currentCharacter]) {
        throw new Error('The collection does not have the key "' + key + '"');
      }
  
      // Archive the current parent and child name (key in childNodes_) so that
      // we may remove the following node and its parents if they are empty.
      parents.push([node, currentCharacter]);
  
      node = node.childNodes_[currentCharacter];
    }
    var oldValue = node.value_;
    delete node.value_;
  
    while (parents.length > 0) {
      var currentParentAndCharacter = parents.pop();
      var currentParent = currentParentAndCharacter[0];
      var currentCharacter = currentParentAndCharacter[1];
      if (currentParent.childNodes_[currentCharacter].isEmpty()) {
        // If the child is empty, then remove it.
        delete currentParent.childNodes_[currentCharacter];
      } else {
        // No point of traversing back any further, since we can't remove this
        // path.
        break;
      }
    }
    return oldValue;
  };

  /**
   * Clones a trie and returns a new trie.  O(N), where N is the number of nodes
   * in the trie.
   * @return {!Trie<VALUE>} A new Trie with the same
   *     key value pairs.
   */
  clone() {
    return new Trie(this);
  };

  /**
   * Returns the number of key value pairs in the trie.  O(N), where N is the
   * number of nodes in the trie.
   * TODO: This could be optimized by storing a weight (count below) in every
   * node.
   * @return {number} The number of pairs.
   */
  getCount() {
    return structs.getCount(this.getValues());
  };

  /**
   * Returns true if this trie contains no elements.  ~O(1).
   * @return {boolean} True iff this trie contains no elements.
   */
  isEmpty() {
    return this.value_ === undefined && object.isEmpty(this.childNodes_);
  };
}

export {Trie};