# Thread supporting in WASM
## Current status

Current wasm support pthread based on __Web Worker & SharedArryBuffer__.

So multi-thread in wasm has __same limit with Web Worker__, and __need Web Engine support SharedArryBuffer__.

![multi-thread](https://github.com/maomao9003/wasm-note/raw/master/.res/WebAssembly_multi-thread.png)

Chrome & Chromium support WebAssembly Thread in M69:

* [Add flag to enable WebAssembly threads](https://chromium.googlesource.com/chromium/src/+/24c1e5ca3b5a6ad00eede404cfc535de30df5327)
* TODO: find the realize patch 

## Usage in emscripten

Emscripten has support for multithreading using the new SharedArrayBuffer capability in browsers. That API allows sharing memory between the main thread and web workers as well as atomic operations for synchronization, which enables Emscripten to implement support for the Pthreads (POSIX threads) API.

* Pass the compiler flag __-s USE_PTHREADS=1__ to enable pthread.
* An additional JavaScript file __pthread-main.js and xxx.js.mem will__ generated. Sometimes need set Module.locateFile(filename) to load these files.





Detail infomation and limitation: http://kripken.github.io/emscripten-site/docs/porting/pthreads.html




Sample:

https://raw.githubusercontent.com/maomao9003/wasm-note/master/SimpleSample/test.js # 5. Thread

https://raw.githubusercontent.com/maomao9003/wasm-note/master/SimpleSample/thread.cc

https://raw.githubusercontent.com/maomao9003/wasm-note/master/SimpleSample/hello.cc















