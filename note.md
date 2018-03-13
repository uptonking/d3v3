# note-d3

## summary

- 核心api
    - data()
    - transition()
    - enter()
    - 
- attr()用于设置DOM属性，style()用于设置css样式  
    - 添加样式1 selection.attr('class','title')  
    - 添加样式2 selection.style('width',240px)
    - 添加样式3 selection.classed('title',true)

- d3绘图套路
```
 svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr()
```
- Mike Bostock的外边距约定 http://bl.ocks.org/mbostock/3019563
- 比例尺3部分
    - 轴线
    - 刻度线
    - 文本标签
- transtion()默认插值间隔是250ms
    - duration() ms
    - ease() 
    - delay() ms
- 数据更新
    - 数量不变，值变化
    - 数量变少
    - 数量变多
- 剪切路径
会将svg边界上和边界外的元素超出svg矩形的部分隐藏
