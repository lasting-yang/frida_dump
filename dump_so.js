rpc.exports = {
    findmodule: function(so_name) {
        var libso = Process.findModuleByName(so_name);
        return libso;
    },
    dumpmodule: function(so_name) {
        var libso = Process.findModuleByName(so_name);
        if (libso == null) {
            return -1;
        }
        Memory.protect(ptr(libso.base), libso.size, 'rwx');
        var libso_buffer = ptr(libso.base).readByteArray(libso.size);
        libso.buffer = libso_buffer;
        return libso_buffer;
    },
    allmodule: function() {
        return Process.enumerateModules()
    },
    arch: function() {
        return Process.arch;
    }
}