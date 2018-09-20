# Introduction to WebAssembly

WebAssembly (abbreviated Wasm) is a binary instruction format for a stack-based virtual machine. Wasm is designed as a portable target for compilation of high-level languages like C/C++/Rust, enabling deployment on the web for client and server applications.<sup>[[1]]</sup>

## Background

1. JavaScript performance is limited<sup>[[2]]</sup>  
    ![JS history](https://hacks.mozilla.org/files/2017/02/01-02-perf_graph10-500x412.png)
2. NaCl is not portable, and will be deprecated  
    [Goodbye PNaCl, Hello WebAssembly!](https://blog.chromium.org/2017/05/goodbye-pnacl-hello-webassembly.html)  
    [Tizen NaCl deprecated plan](http://wiki.vd.sec.samsung.net/display/SRCNJWEB/NaCl+Deprecate+Plan)

## History<sup>[[3]]</sup>

Vendor-specific precursor technologies are Google Native Client (NaCl) and asm.js.  
The initial implementation of WebAssembly support in browsers was based on the feature set of asm.js.  

Date|Event
------------ | -------------
2015.6.17|First announced.
2016.3.15|Demonstrated executing Unity's Angry Bots in Firefox, Chromium, Google Chrome, and Microsoft Edge.
2017.3|The design of the minimum viable product(MVP) was declared to be finished and the preview phase ended.
2017.9|Safari 11 was released with support.
2018.2|The WebAssembly Working Group published three public working drafts for the Core Specification, JavaScript Interface, and Web API.<sup>[[4]]</sup>

## Directly show

#### wasm in V8
![wasm in V8](https://github.com/maomao9003/wasm-note/raw/master/.res/WebAssembly_compile.png)
#### code
* C++ (.cpp)
    ``` c++
    int factorial(int n) {
    if (n == 0)
        return 1;
    else
        return n * factorial(n-1);
    }
    ```
* Binary (.wasm)
    ```
    20 00
    42 00
    51
    04 7e
    42 01
    05
    20 00
    20 00
    42 01
    7d
    10 00
    7e
    0b
    ```
* Text (.wat)
    ``` python
    get_local 0
    i64.const 0
    i64.eq
    if i64
        i64.const 1
    else
        get_local 0
        get_local 0
        i64.const 1
        i64.sub 
        call 0
        i64.mul
    end
    ```

## [WebAssembly High-Level Goals](https://webassembly.org/docs/high-level-goals/)

1.	Define a portable, size- and load-time-efficient binary format to serve as a compilation target which can be compiled to execute at native speed by taking advantage of common hardware capabilities available on a wide range of platforms, including mobile and IoT.
2.	Specify and implement incrementally:
    *	a __Minimum Viable Product (MVP)__ for the standard with __roughly the same functionality as asm.js__, primarily aimed at C/C++;
    *	additional features  , initially focused on key features like __threads__, __zero cost exceptions__, and __SIMD__, followed by additional features prioritized by feedback and experience, including support for languages other than C/C++.
3.	Design to execute within and integrate well with the existing Web platform:
    *	maintain the versionless, feature-tested and backwards-compatible evolution story of the Web;
    *	execute in the same semantic universe as JavaScript;
    *	allow synchronous calls to and from JavaScript;
    *	enforce the same-origin and permissions security policies;
    *	access browser functionality through the same Web APIs that are accessible to JavaScript; and
    *	define a human-editable text format that is convertible to and from the binary format, supporting View Source functionality.
4.	Design to support non-browser embeddings as well.
5.	Make a great platform:
    *	build a new LLVM backend for WebAssembly and an accompanying clang port (why LLVM first?);
    *	promote other compilers and tools targeting WebAssembly; and
    *	enable other useful tooling.

## Minimum Viable Product (MVP)

Support roughly same functionality as asm.js.  
[Detail](https://webassembly.org/docs/mvp/).

## Toolchain for C/C++

__[emscripten](http://kripken.github.io/emscripten-site/index.html)__   
> Emscripten is a toolchain for compiling to asm.js and WebAssembly, built using LLVM, that lets you run C and C++ on the web at near-native speed without plugins.  

__[Easy Guide for Compiling a New C/C++ Module to WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm)__

## WASM vs. NaCl vs. asm.js

* Realization  
    * asm.js consists of a strict subset of JavaScript.  
        * C++ -> Optimized JS  
    * NaCl running in a sandbox, calling PPAPI.
        * C++ -> binary running in sandbox
    * WebAssembly runing in virtual machine, use same enviroment with JS currently.
        * C++ -> binary running in virtual machine
* Performance
    * NaCl > PNaCl >= WebAssembly > asm.js
* Supported API
    * NaCl > WebAssembly >= asm.js
* Portable
    * WebAssembly = asm.js > NaCl
* Debug
    * WebAssembly >= asm.js > NaCl

## Supported status

Current Supported:
* C and C++ standard libraries
* emscripten.h
    * This API provides C++ support for capabilities that are specific to JavaScript or the browser environment
* SDL
* WEB API
    * html5.h
    * OpenGL and EGL
* multi-threaded execution with shared memory<sup>[[6]]</sup>
    ![multi-thread](https://github.com/maomao9003/wasm-note/raw/master/.res/WebAssembly_multi-thread.png)
* File System<sup>[[7]]</sup>  
    ![File System](http://kripken.github.io/emscripten-site/_images/FileSystemArchitecture.png)

Furture support(post-MVP)<sup>[[8]]</sup>:
* Exception handling
* GC - Directly calling DOM & WEB APIs
    ![dom operation](https://github.com/maomao9003/wasm-note/raw/master/.res/WebAssembly_dom_operation.png)
* dynamic linking
* SIMD
* etc.


[1]: https://webassembly.org/
[2]: https://hacks.mozilla.org/2017/02/a-cartoon-intro-to-webassembly/
[3]: https://en.wikipedia.org/wiki/WebAssembly#History
[4]: https://www.w3.org/blog/news/archives/6838
[5]: https://webassembly.org/docs/c-and-c++/
[6]: http://kripken.github.io/emscripten-site/docs/porting/pthreads.html
[7]: http://kripken.github.io/emscripten-site/docs/porting/files/index.html
[8]: https://webassembly.org/docs/future-features/
