
all:glue.cpp WebIDL.cc
	emcc WebIDL.cc --post-js glue.js 

glue.cpp:WebIDL.idl
	python $(EMSDK)/emscripten/incoming/tools/webidl_binder.py WebIDL.idl glue

clean:
	rm -rf a.out.* glue.* parser.out WebIDLGrammar.pkl
