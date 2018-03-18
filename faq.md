# faq

- d3.js与d3.min.js区别  
d3.js是完整无改变的源代码，d3.min.js是压缩过后的，进行过变量名替换
```
d3.csv('data.csv',
        function(d) {
          return {
            key: d.state,
            value: +d.value
          };
        }, function(d){
          console.log( d );
          // code to generate chart goes here
        });
```
使用官方提供的两者无区别
自己编译d3.js会报错，报错的部分是数学公式的特殊字符，如pi,e
自己编译的d3.min.js不会报错
