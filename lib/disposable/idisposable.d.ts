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
 * @interface
 */
export function IDisposable(): void;
