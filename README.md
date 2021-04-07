# frida_dump

## 1. 使用dump_module

### Android dump_so

```Text
> frida -U packagename -l dump_module.js
     ____
    / _  |   Frida 12.4.8 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at http://www.frida.re/docs/home/

[LGE AOSP on HammerHead::packagename]-> dump_so("name.so")
[name]: name.so
[base]: 0x99adf000
[size]: 0x2d4000
[path]: /data/app/packagename-2/lib/arm/name.so
[dump]: /data/user/0/packagename/files/name.so_0x99adf000_0x2d4000.so
undefined
[LGE AOSP on HammerHead::packagename]->
```
#### 修复dump的so

[https://github.com/F8LEFT/SoFixer](https://github.com/F8LEFT/SoFixer)


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
