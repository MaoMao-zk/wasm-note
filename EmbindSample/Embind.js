
// 0. Init
var element = document.getElementById('output');
if (element) element.value = ''; // clear browser cache

var output = {
    add_log: function(s) {
        element.value += s;
        element.value += '\n';
    }
}

var class_instance;
var Module = {
    onRuntimeInitialized: () => {
    }
}

var script = document.createElement('script');
script.src = "a.out.js";
script.async = true;
document.body.appendChild(script);

// 1. normal call
var b1 = document.getElementById('f1');
b1.onclick = () => {
    Module.normal_function();
}
// 2. class construct/destruct
var b31 = document.getElementById('f31');
b31.onclick = () => {
    class_instance = new Module.Class();
    value_changed();
}
var b32 = document.getElementById('f32');
b32.onclick = () => {
    class_instance.delete(); 
}

// 3. class call
function value_changed(){
    var a = parseInt(document.getElementById('i21').value);
    var b = parseInt(document.getElementById('i22').value);
    var c = class_instance.Add(a, b);
    document.getElementById('p2').textContent = c;
    console.log(`${a} + ${b} = ${c}`);
}
document.getElementById('i21').onchange = value_changed;
document.getElementById('i22').onchange = value_changed;

// 4. value_object & property
var b41 = document.getElementById('f41');
b41.onclick = () => {
    class_instance.person = {
        name : document.getElementById('i41').value,
        age : parseInt(document.getElementById('i42').value)
    }
}
var b42 = document.getElementById('f42');
b42.onclick = () => {
    output.add_log(`Get person info: name[${class_instance.person.name}] age[${class_instance.person.age}]`);
}