# d3react  
reusable chart components built with d3 & react    
borrowed some code and ideas from [codesuki/react-d3-components](https://github.com/codesuki/react-d3-components) and [recharts/recharts](https://github.com/recharts/recharts)  

 :warning: d3react is still under development, not stable enough to be used yet. 

## overview

d3react is an **interactive** chart library built with [D3](http://d3js.org) and [React](https://facebook.github.io/react/).  
The main purpose of this library is to make developers and users happy when writing charts in React. Main principles of d3react are:

- **Simple & Easy** to use with React components
- **Interactive** charting experience
- **Dynamic** data update support

## dev 

```sh
 git clone https://github.com/uptonking/d3react.git
 cd d3react/
 npm install
 npm run build
```

## demo

```sh
 npm run demo
```

start from [http://localhost:3000](http://localhost:3000)

## todo

#### 2018
- [ ] pie plot 添加响应式
- [ ] pie plot 饼状图data要取x、y， 需要添加原始数据k、v自动转换成x、y的函数
- [ ] tooltip位置限制在svg内

#### 201x
- [ ] hover时变大或变长，鼠标移出还原
- [ ] 嵌套高阶组件改为 lodash flowRight()

#### remind
- [x] pie simple
- [x] line simple
- [x] bar simple
- [ ] scatter simple
- [ ] area simple
- [ ] tree simple
- [ ] heatmap simple
- [ ] radar simple
- [ ] funnel simple
- [ ] sankey simple
- [ ] boxplot simple
- [ ] migrate to d3 v5.x

## usage

#### PiePLot  
准备数据  
```js
    const data = {
      label: '事例一',
      values: [
        {x: '事例一', y: 40},
        {x: '事例二', y: 21},
      ]
    };
```
[使用组件示例](https://github.com/uptonking/d3react/demo/compolent/plot/PiePlotDemo.js)  
```js
 <PiePlot
          data={data}
          width={800}
          height={480}
          margin={{top: 10, bottom: 10, left: 100, right: 100}}
          tooltipMode={'fixed'}
          tooltipOffset={{top: 210, left: 280}}
          tooltipHtml={tooltipPie}
          sort={null}
```

#### LinePlot  
[使用组件示例](https://github.com/uptonking/d3react/demo/compolent/plot/LinePlotDemo.js)   
```js
 <LinePlot
          data={data}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltipLine}
          tooltipContained
          xAxis={{innerTickSize: 6, label: "x-label"}}
          yAxis={{label: "y-label"}}
          shapeColor={"red"}
          stroke={{strokeDasharray: dashFunc, strokeWidth: widthFunc}}
        />
```  

#### BarPlot  
[使用组件示例](https://github.com/uptonking/d3react/demo/compolent/plot/BarPlotDemo.js)     
```js
  <BarPlot
          data={data1}
          width={800}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltip}
          colorByLabel={false}
        />
```




