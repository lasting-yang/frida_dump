# frida_dump_so

```
> frida -U packagename -l dump_so.js
     ____
    / _  |   Frida 12.4.7 - A world-class dynamic instrumentation toolkit
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