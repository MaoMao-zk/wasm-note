# Connecting C++ and JavaScript

Emscripten provides numerous methods to connect and interact between JavaScript and compiled C or C++.  

Here only some easy usage. Detail in http://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html  

- Call compiled C functions from normal JavaScript:
    - [Using ccall or cwrap](#1-1).
    - [Using direct function calls (faster but more complicated)](#1-2).
- Call compiled C++ classes from JavaScript using bindings created with:
    - [Embind](#2-1).
    - [WebIDL-Binder](#2-2).
- Call JavaScript functions from C/C++:
    - [Using emscripten_run_script()](#3-1).
    - [Using EM_JS() (faster)](#3-2).
    - [Using EM_ASM() (faster)](#3-3).
    - [Using a C API implemented in JavaScript](#3-4).
    - *As function pointers from C.[TODO]*
    - [Using the Embind val class](#3-6).
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

## Call compiled C++ classes from JavaScript using bindings created with Embind and WebIDL-Binder

JavaScript can call C++ interface using Embind and WebIDL-Binder. Detail can reference [Embind](http://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/embind.html#embind) and [WebIDL-Binder](http://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/WebIDL-Binder.html#webidl-binder);  
Here is a simple introduction:  

<h3 id="2-1"> Embind </h3>

Embind provide a easy way to support JS calling C++ interface, and has support for binding most C++ constructs, including those introduced in C++11 and C++14.  

**How to use**:  
* include "emscripten/bind.h" header file
* use EMSCRIPTEN_BINDINGS block for export Class, Object, Function, Enum and etc.
* build with bind option:
    >emcc --bind -o quick_example.js quick_example.cpp
* Module.xxx in JS can be used directly

Firstly, let'e see **C++ side**:
``` C++
    #include <emscripten/bind.h>

    using namespace emscripten;

    void normal_function();

    struct PersonRecord {
        std::string name;
        int age;
    };

    class Class
    {
    public:
        Class();
        ~Class();
        int Add(int a, int b);

        PersonRecord person;
    };

    EMSCRIPTEN_BINDINGS(my_module)
    {
        function("normal_function", &normal_function);

        value_object<PersonRecord>("PersonRecord")
            .field("name", &PersonRecord::name)
            .field("age", &PersonRecord::age)
            ;

        class_<Class>("Class")
            .constructor<>()
            .function("Add", &Class::Add)
            .property("person", &Class::person)
            // TODO: setter & getter not works
            //.property("person", &Class::GetPerson, &Class::SetPerson)
            ;
    }
```
In EMSCRIPTEN_BINDINGS block, we can use ***function()*** expose a function, use ***class_<>()*** expose a class, use ***value_object<>()*** expose a strcut as a object in JS, and others. Detail can reference [bind.h](http://kripken.github.io/emscripten-site/docs/api_reference/bind.h.html).  

When export class, can use ***.constructor***, ***.function***, ***.property*** and others.   
**property** has mutlti usage, above sample shows expose a public variables ***person*** directly. There is an other way through setter and getter function likes _".property("person", &Class::GetPerson, &Class::SetPerson)"_, but there will be build error, need further check.

Then, the **JS side**:
``` JS
    Module.normal_function();

    var class_instance = new Module.Class();

    var c = class_instance.Add(a, b);

    class_instance.person = {
        name : document.getElementById('i41').value,
        age : parseInt(document.getElementById('i42').value)
    }
    console.log(`Get person info: name[${class_instance.person.name}] age[${class_instance.person.age}]`);

    class_instance.delete(); 
```
Very easy to use, especially object.  
Only thing you need to take care, need call ***delete*** to free the C++ instance.

There are many other usage: Embind, likes enum, const, smart pointer, even deriving C++ class in JS. You can learn for it in [Emscripten websit](http://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/embind.html#embind).

<h3 id="2-2"> WebIDL-Binder</h3>

WebIDL Binder provide a diffrent way. You can write a WebIDL file, and use WebIDL Binder tool generate glue code of C++ and JS.  

**How to use**:
* Write a WebIDL file. (WebIDL is a kind interface describtion file, and it's in W3C standard. https://www.w3.org/TR/WebIDL/)
  ``` java
    interface PersonRecord {
        attribute  DOMString name;
        attribute  long age;
    };

    interface Class {
        void Class();
        long Add(long a, long b);
        attribute PersonRecord person;
    };
  ```
* generate glue code(will generate glue.cpp and glue.js)
  ``` shell
  python $(EMSDK)/emscripten/incoming/tools/webidl_binder.py WebIDL.idl glue
  ```
* Write(maybe can generate?) a header file
  ``` C++
    struct PersonRecord {
        char* name;
        int age;
    };

    class Class
    {
    public:
        Class();
        ~Class();
        int Add(int a, int b);

        PersonRecord* person;
    };

  ```
* Realize interface(include header file first, then include glue cpp file)
  ```C++
    #include "WebIDL.h"
    #include "glue.cpp"

    Class::Class()
    {
        person = nullptr;
    }

    Class::~Class()
    {
    }

    int Class::Add(int a, int b)
    {
        return a+b;
    }
  ```
* Build with post-js option
  ``` shell
  emcc WebIDL.cc --post-js glue.js 
  ```
* Module.xxx in JS can be used directly
  ``` JS
    var class_instance = new Module.Class();

    var c = class_instance.Add(a, b);

    class_instance.person = {
        name : document.getElementById('i41').value,
        age : parseInt(document.getElementById('i42').value)
    }
    console.log(`Get person info: name[${class_instance.person.name}] age[${class_instance.person.age}]`);

    Module.destroy(class_instance);
  ```

Diffrence with Embind:
* WebIDL-Binder only support a sub-set of C++ that can be expressed in WebIDL
* [Diriving C++ base class in JS is more simple](http://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/WebIDL-Binder.html#sub-classing-c-base-classes-in-javascript-jsimplementation)
* free C++ instance is diff, need calling _Module.destroy(obj)_ and frop all references to the object

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

<h3 id="3-6"> Using the Embind val class </h3>

Here is a very simple example to call JS function through Embin val class. Detail in [Emscripten site](http://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/embind.html#using-val-to-transliterate-javascript-to-c).

* define a global object in JS
    ``` JS
        var output = {
            add_log: function(s) {
                element.value += s;
                element.value += '\n';
            }
        }
    ```
* C++
  * include _emscripten/val.h_
  * get object reference _val::global("output")_ (use .new_() if you want to create a instance)
  * calling function _output.call<void>("add_log", s);_
  ``` C++
    #include <emscripten/val.h>

    using namespace emscripten;

    val output = val::global("output");//.new_();
    output.call<void>("add_log", s);
  ```