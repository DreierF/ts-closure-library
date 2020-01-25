/**
 * @fileoverview Definition of the disposable interface.  A disposable object
 * has a dispose method to to clean up references and resources.
 */
/**
 * Interface for a disposable object.  If a instance requires cleanup
 * (references COM objects, DOM nodes, or other disposable objects), it should
 * implement this interface (it may subclass google.Disposable).
 * @interface
 */
export function IDisposable(): void;
