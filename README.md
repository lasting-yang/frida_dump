# frida_dump

## 1. dump android module

```
➜  frida_dump git:(master) ✗ python dump_so.py libc.so              
{'name': 'libc.so', 'base': '0xf2282000', 'size': 819200, 'path': '/apex/com.android.runtime/lib/bionic/libc.so'}
android/SoFixer32: 1 file pushed. 5.9 MB/s (91848 bytes in 0.015s)
libc.so.dump.so: 1 file pushed. 21.4 MB/s (819200 bytes in 0.036s)
adb shell /data/local/tmp/SoFixer -m 0xf2282000 -s /data/local/tmp/libc.so.dump.so -o /data/local/tmp/libc.so.dump.so.fix.so
[main_loop:87]start to rebuild elf file
[Load:69]dynamic segment have been found in loadable segment, argument baseso will be ignored.
[RebuildPhdr:25]=============LoadDynamicSectionFromBaseSource==========RebuildPhdr=========================
[RebuildPhdr:37]=====================RebuildPhdr End======================
[ReadSoInfo:549]=======================ReadSoInfo=========================
[ReadSoInfo:696]soname 
[ReadSoInfo:699]Unused DT entry: type 0x6ffffffb arg 0x00000001
[ReadSoInfo:599] rel (DT_REL) found at 15f20
[ReadSoInfo:603] rel_size (DT_RELSZ) 1703
[ReadSoInfo:699]Unused DT entry: type 0x6ffffffa arg 0x000005f5
[ReadSoInfo:591] plt_rel (DT_JMPREL) found at 19458
[ReadSoInfo:595] plt_rel_count (DT_PLTRELSZ) 617
[ReadSoInfo:584]symbol table found at 32ac
[ReadSoInfo:580]string table found at 10e58
[ReadSoInfo:699]Unused DT entry: type 0x6ffffef5 arg 0x0000a98c
[ReadSoInfo:629] constructors (DT_INIT_ARRAY) found at b5954
[ReadSoInfo:633] constructors (DT_INIT_ARRAYSZ) 4
[ReadSoInfo:637] destructors (DT_FINI_ARRAY) found at b3000
[ReadSoInfo:641] destructors (DT_FINI_ARRAYSZ) 2
[ReadSoInfo:699]Unused DT entry: type 0x6ffffff0 arg 0x00009b4c
[ReadSoInfo:699]Unused DT entry: type 0x6ffffffc arg 0x0000a860
[ReadSoInfo:699]Unused DT entry: type 0x6ffffffd arg 0x00000009
[ReadSoInfo:699]Unused DT entry: type 0x6ffffffe arg 0x0000a95c
[ReadSoInfo:699]Unused DT entry: type 0x6fffffff arg 0x00000001
[ReadSoInfo:703]=======================ReadSoInfo End=========================
[RebuildShdr:42]=======================RebuildShdr=========================
[RebuildShdr:536]=====================RebuildShdr End======================
[RebuildRelocs:783]=======================RebuildRelocs=========================
[RebuildRelocs:809]=======================RebuildRelocs End=======================
[RebuildFin:709]=======================try to finish file rebuild =========================
[RebuildFin:733]=======================End=========================
[main:123]Done!!!
/data/local/tmp/libc.so.dump.so.fix.so: 1 file pulled. 29.0 MB/s (819882 bytes in 0.027s)
libc.so_0xf2282000_819200_fix.so
```


### iOS  dump_ios_module

```Text
➜  frida_dump git:(master) ✗ frida -U app_name -l dump_module.js
     ____
    / _  |   Frida 14.2.13 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://www.frida.re/docs/home/

[iPhone::app_name]-> dump_ios_module("module_name")
[name]: module_name
[base]: 0x100778000
[size]: 0x2c08000
[path]: /private/var/containers/Bundle/Application/1085C5E3-B65D-4189-8733-BFC09255CB63/module_name.app/module_name
[dump]: /var/mobile/Containers/Data/Application/3891FB05-424B-4F77-9FA4-9640C11924AD/Documents/module_name_0x100778000_0x2c08000
[iPhone::app_name]->
```

## 2. 使用dump_dex

更新了查找DefineClass的函数签名

```Text
frida -U --no-pause -f packagename  -l dump_dex.js
     ____
    / _  |   Frida 12.4.8 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at http://www.frida.re/docs/home/
Spawned `packagename`. Resuming main thread!
[Google Pixel XL::packagename]-> [dlopen:] libart.so
_ZN3art11ClassLinker11DefineClassEPNS_6ThreadEPKcmNS_6HandleINS_6mirror11ClassLoaderEEERKNS_7DexFileERKNS9_8ClassDefE 0x7ac6dc4f74
[DefineClass:] 0x7ac6dc4f74
[dump dex]: /data/data/packagename/files/7aab800000_8341c4.dex
```
