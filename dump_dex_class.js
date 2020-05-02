function get_self_process_name() {
    var openPtr = Module.getExportByName('libc.so', 'open');
    var open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);

    var readPtr = Module.getExportByName("libc.so", "read");
    var read = new NativeFunction(readPtr, "int", ["int", "pointer", "int"]);

    var closePtr = Module.getExportByName('libc.so', 'close');
    var close = new NativeFunction(closePtr, 'int', ['int']);

    var path = Memory.allocUtf8String("/proc/self/cmdline");
    var fd = open(path, 0);
    if (fd != -1) {
        var buffer = Memory.alloc(0x1000);

        var result = read(fd, buffer, 0x1000);
        close(fd);
        result = ptr(buffer).readCString();
        return result;
    }

    return "-1";
}

function load_all_class() {
    if (Java.available) {
        Java.perform(function () {

            var DexFileclass = Java.use("dalvik.system.DexFile");
            var BaseDexClassLoaderclass = Java.use("dalvik.system.BaseDexClassLoader");
            var DexPathListclass = Java.use("dalvik.system.DexPathList");

            Java.enumerateClassLoaders({
                onMatch: function (loader) {
                    try {
                        var basedexclassloaderobj = Java.cast(loader, BaseDexClassLoaderclass);
                        var pathList = basedexclassloaderobj.pathList.value;
                        var pathListobj = Java.cast(pathList, DexPathListclass)
                        var dexElements = pathListobj.dexElements.value;
                        for (var index in dexElements) {
                            var element = dexElements[index];
                            try {
                                var dexfile = element.dexFile.value;
                                var dexfileobj = Java.cast(dexfile, DexFileclass);
                                console.log("dexFile:", dexfileobj);
                                const classNames = [];
                                const enumeratorClassNames = dexfileobj.entries();
                                while (enumeratorClassNames.hasMoreElements()) {
                                    var className = enumeratorClassNames.nextElement().toString();
                                    classNames.push(className);
                                    try {
                                        loader.loadClass(className);
                                    } catch (error) {
                                        console.log("loadClass error:", error);
                                    }
                                }
                            } catch (error) {
                                console.log("dexfile error:", error);
                            }
                        }
                    } catch (error) {
                        console.log("loader error:", error);
                    }
                },
                onComplete: function () {

                }
            })
            console.log("load_all_class end.");
        });
    }
}
var dex_maps = {};

function print_dex_maps() {
    for (var dex in dex_maps) {
        console.log(dex, dex_maps[dex]);
    }
}

function dump_dex() {
    load_all_class();

    for (var base in dex_maps) {
        var size = dex_maps[base];
        console.log(base);

        var magic = ptr(base).readCString();
        if (magic.indexOf("dex") == 0) {
            var process_name = get_self_process_name();
            if (process_name != "-1") {
                var dex_path = "/data/data/" + process_name + "/files/" + base.toString(16) + "_" + size.toString(16) + ".dex";
                console.log("[find dex]:", dex_path);
                var fd = new File(dex_path, "wb");
                if (fd && fd != null) {
                    var dex_buffer = ptr(base).readByteArray(size);
                    fd.write(dex_buffer);
                    fd.flush();
                    fd.close();
                    console.log("[dump dex]:", dex_path);

                }
            }
        }
    }
}

function hook_dex() {
    var libart = Process.findModuleByName("libart.so");
    var addr_DefineClass = null;
    var symbols = libart.enumerateSymbols();
    for (var index = 0; index < symbols.length; index++) {
        var symbol = symbols[index];
        var symbol_name = symbol.name;
        //这个DefineClass的函数签名是Android9的
        //_ZN3art11ClassLinker11DefineClassEPNS_6ThreadEPKcmNS_6HandleINS_6mirror11ClassLoaderEEERKNS_7DexFileERKNS9_8ClassDefE
        if (symbol_name.indexOf("ClassLinker") >= 0 &&
            symbol_name.indexOf("DefineClass") >= 0 &&
            symbol_name.indexOf("Thread") >= 0 &&
            symbol_name.indexOf("DexFile") >= 0) {
            console.log(symbol_name, symbol.address);
            addr_DefineClass = symbol.address;
        }
    }

    console.log("[DefineClass:]", addr_DefineClass);
    if (addr_DefineClass) {
        Interceptor.attach(addr_DefineClass, {
            onEnter: function (args) {
                var dex_file = args[5];
                //ptr(dex_file).add(Process.pointerSize) is "const uint8_t* const begin_;"
                //ptr(dex_file).add(Process.pointerSize + Process.pointerSize) is "const size_t size_;"
                var base = ptr(dex_file).add(Process.pointerSize).readPointer();
                var size = ptr(dex_file).add(Process.pointerSize + Process.pointerSize).readUInt();

                if (dex_maps[base] == undefined) {
                    dex_maps[base] = size;
                    console.log("hook_dex:", base, size);
                }
            },
            onLeave: function (retval) {}
        });
    }

}

var is_hook_libart = false;

function hook_dlopen() {
    Interceptor.attach(Module.findExportByName(null, "dlopen"), {
        onEnter: function (args) {
            var pathptr = args[0];
            if (pathptr !== undefined && pathptr != null) {
                var path = ptr(pathptr).readCString();
                //console.log("dlopen:", path);
                if (path.indexOf("libart.so") >= 0) {
                    this.can_hook_libart = true;
                    console.log("[dlopen:]", path);
                }
            }
        },
        onLeave: function (retval) {
            if (this.can_hook_libart && !is_hook_libart) {
                hook_dex();
                is_hook_libart = true;
            }
        }
    })

    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"), {
        onEnter: function (args) {
            var pathptr = args[0];
            if (pathptr !== undefined && pathptr != null) {
                var path = ptr(pathptr).readCString();
                //console.log("android_dlopen_ext:", path);
                if (path.indexOf("libart.so") >= 0) {
                    this.can_hook_libart = true;
                    console.log("[android_dlopen_ext:]", path);
                }
            }
        },
        onLeave: function (retval) {
            if (this.can_hook_libart && !is_hook_libart) {
                hook_dex();
                is_hook_libart = true;
            }
        }
    });
}


setImmediate(hook_dex);