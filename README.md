# About this project

The [Closure Library](https://developers.google.com/closure/library) is an [open-source](https://github.com/google/closure-library), general-purpose Javascript library maintained by Google. 
The original library provides type safety using type annotations for Google's [Closure compiler](https://github.com/google/closure-compiler) using special comments like `/** @type {string} **/`. 
In addition, the original library has its own module system using `goog.require` / `goog.provide` / `goog.module` statements.

This project is a fork of the Closure library, but differs in the following ways:
- all Closure-specific "classes" were converted to regular ES6 classes.
- the `goog.require` / `goog.provide` statements have been converted to ES6 modules (`import` and `export` ) 
- we added `d.ts` files for the library, which allows the Typescript compiler to understand the type definitions inside the library.
- some parts of the library have been removed (e.g., `goog.graphics`, which was already deprecated).

With these changes, this library **can be used without the Closure compiler**.
It is also possible to use this fork in a Typescript project due to the added `d.ts` definition files.

# Releases

Releases are [published on npm](https://www.npmjs.com/package/ts-closure-library). 
