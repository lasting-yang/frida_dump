function dump_so(so_name) {
    if (Java.available) {
        Java.perform(function () {
            var currentApplication = Java.use("android.app.ActivityThread").currentApplication();
            var dir = currentApplication.getApplicationContext().getFilesDir().getPath();
            var libso = Process.getModuleByName(so_name);
            console.log("[name]:", libso.name);
            console.log("[base]:", libso.base);
            console.log("[size]:", ptr(libso.size));
            console.log("[path]:", libso.path);
            var file_path = dir + "/" + libso.name + "_" + libso.base + "_" + ptr(libso.size) + ".so";
            var file_handle = new File(file_path, "wb");
            if (file_handle && file_handle != null) {
                Memory.protect(ptr(libso.base), libso.size, 'rwx');
                var libso_buffer = ptr(libso.base).readByteArray(libso.size);
                file_handle.write(libso_buffer);
                file_handle.flush();
                file_handle.close();
                console.log("[dump]:", file_path);
            }
        });
    }
}

function getDocumentDirectory() {
    if (ObjC.available) {
        var address = Module.findExportByName('Foundation', 'NSSearchPathForDirectoriesInDomains')
        var NSSearchPathForDirectoriesInDomains = new NativeFunction(address, 'pointer', ['int', 'int', 'int'])
        var dirs = ObjC.Object(NSSearchPathForDirectoriesInDomains(9, 1, 1))
        var doc_dir = dirs.objectAtIndex_(0).toString();
        return doc_dir;
    }
}

function dump_ios_module(module_name) {
    if (ObjC.available) {
        var doc_dir = getDocumentDirectory();
        var module = Process.getModuleByName(module_name);
        console.log("[name]:", module.name);
        console.log("[base]:", module.base);
        console.log("[size]:", ptr(module.size));
        console.log("[path]:", module.path);

        var file_path = doc_dir + "/" + module.name + "_" + module.base + "_" + ptr(module.size);
        var file_handle = new File(file_path, "wb");
        if (file_handle && file_handle != null) {
            Memory.protect(ptr(module.base), module.size, 'rwx');
            var module_buffer = ptr(module.base).readByteArray(module.size);
            file_handle.write(module_buffer);
            file_handle.flush();
            file_handle.close();
            console.log("[dump]:", file_path);
        }
    }
}