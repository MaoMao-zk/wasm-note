#include "WebIDL.h"
#include "glue.cpp"

#include <emscripten.h>
#include <iostream>


void add_log(std::string s)
{
    EM_ASM_INT({
      output.add_log(Pointer_stringify($0));
    }, s.c_str());

    std::cout << "WASM LOG: "<< s << std::endl;
}

Class::Class()
{
    add_log("Class construct.");
    person = nullptr;
}

Class::~Class()
{
    add_log("Class destruct.");
    if(person != nullptr)
    {
        delete person;
        person = nullptr;
    }
}

int Class::Add(int a, int b)
{
    return a+b;
}

