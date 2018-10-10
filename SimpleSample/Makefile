
all:
	em++ hello.cc thread.cc --std=c++11  -s USE_PTHREADS=1 --js-library extern_to_C.js -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  -s EXPORTED_FUNCTIONS='["_function1", "_int_sqrt", "_main", "_float_sqrt", "_str_reserve", "_start_thread", "_stop_thread", "_lock_thread", "_unlock_thread"]'

clean:
	rm -rf a.out.* pthread-main.js
