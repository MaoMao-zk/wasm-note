# Connecting C++ and JavaScript

Emscripten provides numerous methods to connect and interact between JavaScript and compiled C or C++.  

Here only some easy usage. Detail in http://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html  

- Call compiled C functions from normal JavaScript:
    - [Using ccall or cwrap](#1-1).
    - [Using direct function calls (faster but more complicated)](#1-2).
- Call compiled C++ classes from JavaScript using bindings created with:
    - *Embind or WebIDL-Binder[TODO]*
- Call JavaScript functions from C/C++:
    - [Using emscripten_run_script()](#3-1).
    - [Using EM_JS() (faster)](#3-2).
    - [Using EM_ASM() (faster)](#3-3).
    - [Using a C API implemented in JavaScript](#3-4).
    - *As function pointers from C.[TODO]*
    - *Using the Embind val class.[TODO]*
- *Access compiled code memory from JavaScript.[TODO]*
- *Affect execution behaviour.[TODO]*
- *Access environment variables.[TODO]*

## Call compiled C functions from normal JavaScript

Simple sample to declare int_sqrt:

``` C++
#include <math.h>

extern "C" {

int int_sqrt(int x) {
  return sqrt(x);
}

}
```

When use emcc/em++ compile code, should add **-s EXPORTED_FUNCTIONS='["_int_sqrt"]'** to export int_sqrt.

<h3 id="1-1"> Call compiled C/C++ code “directly” from JavaScript </h3>

To call the method directly, you will need to use the full name as it appears in the generated code. This will be the same as the original C function, but with a leading '_'.  

The param and return value of int_sqrt is Integer, so it's easy to calling directly.  
It will be complicated, if your param is not Integer and Float. But don't worry, emscripten provide [preamble.js](http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html) for easy converting(likes: Pointer_stringify can convert char* to string). And :

<h3 id="1-2"> Calling compiled C functions from JavaScript using ccall/cwrap </h3>

The easiest way to call compiled C functions from JavaScript is to use ccall() or cwrap().  
Not need param conversion if use ccall/cwrap.  
To use ccall/cwrap, should add **-s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'** option.  

ccall() calls a compiled C function with specified parameters and returns the result.  

``` JS
// Call C from JavaScript
var result = Module.ccall( 'int_sqrt',  // name of C function
                           'number',    // return type
                           ['number'],  // argument types
                           [28]);       // arguments

// result is 5
```
while cwrap() “wraps” a compiled C function and returns a JavaScript function you can call normally. cwrap() is therefore more useful if you plan to call a compiled function a number of times.

``` JS
int_sqrt = Module.cwrap('int_sqrt', 'number', ['number'])
int_sqrt(12)
int_sqrt(28)
```

## Call JavaScript functions from C/C++
<h3 id="3-1"> Using emscripten_run_script() </h3>

**emscripten_run_script()** is same with **eval()**. Transfer JS Code through param:  

``` C++
emscripten_run_script("add_log('emscripten_run_script calling;');");
```

<h3 id="3-2"> Using EM_JS() </h3>

EM_JS is used to declare JavaScript functions from inside a C file.

``` C++
EM_JS(void, em_add_log, (const char* s), {
    add_log(Pointer_stringify(s));
});
----------------------------------------------------
em_add_log("EM_JS calling;");
```

<h3 id="3-3"> Using EM_ASM() </h3>

EM_ASM is used in a similar manner to inline assembly code.

```C++
EM_ASM(
    add_log("EM_ASM calling;"););
```

There are **EM_ASM_XXX** MACRO can be used transfer params, detail in ref: [em_asm.h included in <emscripten.h>](https://github.com/kripken/emscripten/blob/incoming/system/include/emscripten/em_asm.h)

<h3 id="3-4"> Using a C API implemented in JavaScript </h3>

It is possible to implement a C API in JavaScript! This is the approach used in many of Emscripten’s libraries, like SDL1 and OpenGL.  

In C/C++ code, decorating with extern to mark the methods:  
``` C++
extern "C" {

extern void extern_log(const char* );

}
```

Implement extern_log in [library.js](https://github.com/kripken/emscripten/blob/master/src/library.js), or implement in your own js library file as below:  
``` JS
mergeInto(LibraryManager.library, {
    extern_log: function (s) {
        var element = document.getElementById('output');
        element.value += Pointer_stringify(s);
        element.value += '\n';
    },
  });
```
When compile C/C++ code, use emcc option **--js-library** specify your own js library.  

There are some limits in library files, see [detail](http://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#javascript-limits-in-library-files).

