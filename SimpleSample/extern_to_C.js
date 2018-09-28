
mergeInto(LibraryManager.library, {
    extern_log: function (s) {
        var element = document.getElementById('output');
        element.value += Pointer_stringify(s);
        element.value += '\n';
    },
    update_runing_time: function (s) {
        var element = document.getElementById('r5');
        element.textContent = `Running ${s}ms`;
    },
  });

