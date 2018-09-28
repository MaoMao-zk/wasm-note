#include "hello.h"
#include "thread.h"
#include <stdio.h>
#include <string.h>
#include <math.h>

#include <emscripten.h>

EM_JS(void, add_log, (const char* s), {
  add_log(Pointer_stringify(s));
});

extern int running_time;
extern "C" void update_runing_time(int);

void frame()
{
  static int before_time = 0;
  if(running_time != before_time)
  {
    before_time = running_time;
    update_runing_time(before_time);
  }
}

int main()
{
  printf("main.\n");
  emscripten_set_main_loop(frame, 60, 1);
  return 0;
}

int int_sqrt(int x)
{
  return sqrt(x);
}

float float_sqrt(float x)
{
  return sqrt(x);
}

void function1()
{
  printf("void function1() called!\n");
  emscripten_run_script("add_log('emscripten_run_script calling;');");
  EM_ASM(
      add_log("EM_ASM calling;"););
  add_log("EM_JS calling;");
  extern_log("Extern JS calling.\n");
}

char *str_reserve(char *s)
{
  char tmp;
  int len = strlen(s);
  for (int i = 0; i < len / 2; i++)
  {
    tmp = s[i];
    s[i] = s[len - 1 - i];
    s[len - 1 - i] = tmp;
  }
  return s;
}
