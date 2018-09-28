
//var sab = new SharedArrayBuffer(1024);

// 0. Init
var element = document.getElementById('output');
if (element) element.value = ''; // clear browser cache

function add_log(s) {
    element.value += s;
    element.value += '\n';
}


function int_sqrt(a) {abort(`int_sqrt is not intialized`);}
function float_sqrt(a) {abort(`int_sqrt is not intialized`);}
function str_reserve(a) {abort(`int_sqrt is not intialized`);}

var Module = {
    onRuntimeInitialized: () => {
        add_log("Initialized.\n");
        int_sqrt = Module.cwrap('int_sqrt', 'number', ['number']);
        float_sqrt = Module.cwrap('float_sqrt', 'number', ['number']);
        str_reserve = Module.cwrap('str_reserve', 'string', ['string']);
    }
}
/*
var memoryInitializer = 'a.out.js.mem';
memoryInitializer = Module['locateFile'] ? Module['locateFile'](memoryInitializer, '') : memoryInitializer;
Module['memoryInitializerRequestURL'] = memoryInitializer;
var meminitXHR = Module['memoryInitializerRequest'] = new XMLHttpRequest();
meminitXHR.open('GET', memoryInitializer, true);
meminitXHR.responseType = 'arraybuffer';
meminitXHR.send(null);*/

var script = document.createElement('script');
script.src = "a.out.js";
script.async = true;
document.body.appendChild(script);


// 1. normal call
var b1 = document.getElementById('f1');
b1.onclick = () => {
    var result = Module.ccall('function1', // name of C function 
                                    null, // return type
                                    null, // argument types
                                    null); // arguments
}

// 2. int_sqrt
var b2 = document.getElementById('f2');
b2.onclick = () => {
    var i2 = document.getElementById('i2');
    var x = i2.value;
    var y = int_sqrt(x);
    element.value += `int_sqrt(${x})=${y}\n`;
}

// 3. float_sqrt
var b3 = document.getElementById('f3');
b3.onclick = () => {
    var i3 = document.getElementById('i3');
    var x = i3.value;
    var y = float_sqrt(x);
    element.value += `float_sqrt(${x})=${y}\n`;
}

// 4. str_reserve
var b4 = document.getElementById('f4');
b4.onclick = () => {
    var i4 = document.getElementById('i4');
    var x = i4.value;
    var y = str_reserve(x);
    element.value += `str_reserve(${x})=${y}\n`;
}

// 5. thread
var b5 = document.getElementById('f5');
b5.onclick = () => {
    if(b5.textContent == "start"){
        _start_thread();
        b5.textContent = "stop";
    }
    else
    {
        _stop_thread();
        b5.textContent = "start";
    }
}
var b5_lock = document.getElementById('f5_lock');
b5_lock.onclick = () => {
    if(b5_lock.textContent == "lock"){
        _lock_thread();
        b5_lock.textContent = "unlock";
    }
    else
    {
        _unlock_thread();
        b5_lock.textContent = "lock";
    }
}