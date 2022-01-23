// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Definition of the disposable interface.  A disposable object
 * has a dispose method to to clean up references and resources.
 */

/**
 * Interface for a disposable object.  If a instance requires cleanup, it should
 * implement this interface (it may subclass google.Disposable).
 *
 * Examples of cleanup that can be done in `dispose` method:
 * 1. Remove event listeners.
 * 2. Cancel timers (setTimeout, setInterval, google.Timer).
 * 3. Call `dispose` on other disposable objects hold by current object.
 * 4. Close connections (e.g. WebSockets).
 *
 * Note that it's not required to delete properties (e.g. DOM nodes) or set them
 * to null as garbage collector will collect them assuming that references to
 * current object will be lost after it is disposed.
 *
 * See also http://go/mdn/JavaScript/Memory_Management.
 *
 * @record
 */
function IDisposable() {};

/**
 * Disposes of the object and its resources.
 * @return {void} Nothing.
 */
IDisposable.prototype.dispose;

/**
 * @return {boolean} Whether the object has been disposed of.
 */
IDisposable.prototype.isDisposed;

export {IDisposable};