
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <iostream>

using namespace emscripten;

void add_log(std::string s)
{
    static val output = val::global("output");//.new_();
    output.call<void>("add_log", s);

    std::cout << "WASM LOG: "<< s << std::endl;
}

void normal_function()
{
    add_log("normal_function called.");
}

struct PersonRecord {
    std::string name;
    int age;
};

class Class
{
public:
    Class()
    {
        add_log("Class construct.");
    }
    ~Class()
    {
        add_log("Class destruct.");
    }
    int Add(int a, int b)
    {
        return a+b;
    }

    void SetPerson(PersonRecord p)
    {
        person.name = p.name;
        person.age = p.age;
    }
    PersonRecord GetPerson()
    {
        return person;
    }

    PersonRecord person;
private:
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

int main()
{
    add_log("wasm main function called.");
}