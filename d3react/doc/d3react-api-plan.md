# d3react-api
d3react库的api设计 

## 图表通用配置项

所有配置项作为一个大object，尽量减少嵌套

- series
保存可视化直接可用的数据，不保存样式配置
```js
{
    name:"dataset-name",
    data:[]
}  
```   
  
- all  
    - hidden
    - position 
    
    - px
    - py

- plot  
    - color
    - bgColor
    
    - width
    - height
    - fullWidth
    - padding
    - margin
    
    - border: borderColor,borderWidth
    
    - allowSelect
    - type: pie,line,bar,scatter
    - cursor
    - animate

- title 标题
    - h1
    - h2
    
    - html
    - text
    - subtext
    - align: l,r,c

- tooltip 提示
    - html
    - mode
    - offset
    - shared
    - enterable
    
    - formatter
    - trigger: mouse, click
    - guideLine
    
- legend 图例
    - orient
    - align: l,r,c
    - verticalAlign: middle
    - data
    - title
    - itemGap
    - itemStyle: width
    - allowChecked
    - singleChecked
    - multiChecked
    - marker
    - event: onClick,onHover
    - html
    - slidable
    - collapsable
    
- xAxis yAxis  轴
    - type: categories
    - data
    - name
    - stroke
    
    - label: orient,style
    - tick: orient,style,count
    
    - gap
    - splitArea
    - inverse
    - offset

- animation
    - duration
    - ease
    - delay
    - onStart
    - onComplete
    
- grid
    - orient
    - lineStyle
    - hideFirst
    - hideLast
    
    - start
    - end

- brush  
    - data

- series
    - name
    - data
    
- toolbox
    
    - zoom, restore
    - table view
    
    - watermark: opacity, encrypted
    
    - export csv、xlsx
    - export png
    - extract data
    - sampling
    
    - share
    
    - switch to Bar/Line/Pie
    
- responsive
    - fit 缩放到视口
    - clip 缩放到宽度，并裁剪

## api设计

#### pie

- plot position, w, h

- data

- option
    - startAngle
    - rotation
    - percentFormat

#### line

- plot position, w, h

- data

- option
    - lineStyle

#### bar

- plot position, w, h

- data

- option
    - animation
    
#### scatter & bubble

- plot position, w, h

- data

- option
    - hitRadius
    - circleStyle
    - circleRadius
    - hoverStyle
