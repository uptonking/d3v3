# note-js

## convention
- 模块化开发不推荐使用css和html，可以都写在js中

## tool

- webpack
    - 前端资源模块化管理和打包工具  
    - 通过 loader 的转换，任何形式的资源都可以视作模块，比如 CommonJs 模块、 AMD 模块、 ES6 模块、CSS、图片、 JSON、Coffeescript、 LESS 等
    - 4个核心概念
        - entry  
        webpack创建应用程序所有依赖的关系图(dependency graph)，图的起点被称之为入口起点(entry point)。入口起点告诉 webpack 从哪里开始，并根据依赖关系图确定需要打包的内容。可以将应用程序的入口起点认为是根上下文(contextual root) 或 app 第一个启动文件。
        - output  
        告诉 webpack 在哪里打包应用程序，webpack 的 output 属性描述了如何处理归拢在一起的代码(bundled code)。  
        通过 output.filename 和 output.path 属性，来告诉 webpack bundle 的名称，以及我们想要生成(emit)到哪里。
        - loader  
        loader用于对模块的源代码进行转换，loader可以使你在 import 或"加载"模块时预处理文件      
        定义 loader 时，要定义在 module.rules 中，loader 有两个目标：          
        test: 识别出(identify)应该被对应的 loader 进行转换(transform)的那些文件。  
        use: 转换这些文件，从而使其能够被添加到依赖图中（并且最终添加到 bundle 中）
        - plugins  
        插件目的在于解决 loader 无法实现的其他功能
        
    

- js模块化 CommonJS、AMD、UMD  
    - CommonJS NodeJS  
    `var $ = require('jquery');`   
    `module.exports = myFunc;`   
    - AMD requirejs、dojo   
    `require(['math'], function (math) { math.add(2, 3); });`  
    `define(['jquery'], function ($) { return myFunc; });`  
    - UMD  
    ```
       (function (root, factory) {
                if (typeof define === 'function' && define.amd) {
                    // AMD
                    define(['jquery'], factory);
                } else if (typeof exports === 'object') {
                    // Node, CommonJS之类的
                    module.exports = factory(require('jquery'));
                } else {
                    // 浏览器全局变量(root 即 window)
                    root.returnExports = factory(root.jQuery);
                }
            }(this, function ($) {
                //    方法
                function myFunc(){};
    
                //    暴露公共方法
                return myFunc;
            }));
    ```
    - CMD seajs
    - es6
    
- UMD的实现很简单： 
 
    1. 先判断是否支持Node.js模块格式（exports是否存在），存在则使用Node.js模块格式。
    2. 再判断是否支持AMD（define是否存在），存在则使用AMD方式加载模块。
    3. 前两个都不存在，则将模块公开到全局（window或global）。

- js自执行函数  
因为JavaScript里括号()里面不能包含语句，用括号将函数括住，解析器在解析function关键字的时候，会将相应的代码解析成function表达式，而不是function声明。
```
// 下面2个括弧()都会立即执行
( function () { /* code */ }() ); // 推荐使用这个  
( function () { /* code */ }) (); // 但是这个也是可以用的  

// 由于括弧()和JS的&&，异或，逗号等操作符是在函数表达式和函数声明上消除歧义的
// 所以一旦解析器知道其中一个已经是表达式了，其它的也都默认为表达式了
// 不过，请注意下一章节的内容解释
var i = function () { return 10; } ();
true && function () { /* code */ } ();
0, function () { /* code */ } ();

// 如果你不在意返回值，或者不怕难以阅读
// 你甚至可以在function前面加一元操作符号
!function () { /* code */ } ();
~function () { /* code */ } ();
-function () { /* code */ } ();
+function () { /* code */ } ();

// 还有一个情况，使用new关键字,也可以用，但我不确定它的效率
new function () { /* code */ }
new function () { /* code */ } () // 如果需要传递参数，只需要加上括弧()
```

## js-lib
- core-js  
为es5、es6提供polyfill
