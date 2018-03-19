# note-viz-theory
数据可视化原理与设计

## 常用图表类型 Chart/Plot/Diagram

- 饼状图  /Pie
    - 基础饼图 外部文本 内部文本  /basic pie
    - 环形图  /basic donut doughnut
    - 分片环形图  /slice donut 
    - 嵌套饼图  /multi level pie
    - 南丁格尔玫瑰图 单色 多色  
    - 南丁格尔玫瑰图 环图 /donut rose
    - Wind Rose 风向玫瑰图
    - pizza chart
    - 双环图  /double ring

- 折线图  /Line
    - 基础折线图 单条 多条 /basic line + multi line
    - 曲线折线图 单条 多条 /smooth line
    - 阶梯折线图 单条 多条 /ladder line
    - 基础面积图 正值 含负值  /basic area
    - 堆叠面积图  /stacked area
    - 百分比堆叠面积图  /percentage area
    - 区间面积图  /ranged area
    
- 柱状图  /Bar
    - 基础柱状图 竖直方向  /basic column
    - 分组柱状图  /grouped column
    - 堆叠柱状图 普通 圆角  /stacked column
    - 百分比堆叠柱状图  /stacked percentage column
    - 区间柱状图  /ranged column
    - 极坐标下的径向柱状图  
    - 瀑布图  /waterfall
    - 直方图  /histogram
    - 堆叠直方图  /stacked histogram
    - 条形图 水平方向  /basic bar
    - 金字塔条形图  
    - 分组条形图  /grouped bar
    - 堆叠条形图  /stacked bar
    - 区间条形图  /ranged bar
    
- 点状图  /Point
    - 散点图 单色 多色  /scatter
    - 气泡图  /bubble
    - 扰动点图  /jitter

- 关系图  /Relation 
    - 力导向图  /force layout
    - 和弦图  /chord
    - 桑基图  /sankey
    - 树状分层图
    - 半圆弧长链接图  /arc
    - 极坐标圆形弧长链接图  /arc polar
    - voronoi图
    - 相邻层次图  /adjacency
    - 旭日图  /sunburst
    - 矩阵树图 四叉矩阵  /treemap
    - 径向树  /radial tidy tree
    - circle packing
    
- 热力图  /Heatmap
    - 色块图
    - 矩形分箱图  /rectangle box
    - 日历色块图  /heatmap calendar
    - 水平日历色块图  /horizontal calendar
    - 分块热力图  /grouped heatmap
    - 热力图  /heatmap
    - 六边形分箱图  /hexagon box
    
- 雷达图  /Radar
    - 面状
    - 线状
    - 多层嵌套雷达图 虫洞
    - Radial Bar Chart
    - Kagi Chart
    - 路径图
    - 子弹图

- 漏斗图  /Funnel
    - 平底漏斗图  /basic funnel
    - 尖底漏斗图  /sharp funnel
    - 对比漏斗图  /compare funnel
    - 对称漏斗图  /mirror funnel
    
- 箱型图  /Boxplot
    - 基础箱型图 普通 含异常值  /basic box
    - 分组箱型图  /group box

- 零钱图  /Pictorial
    - 点状 饼装
    - 柱状
    - 象形图例
    
- 烛型图  /Candlestick
    - 股票图
    - 股票范围区域图

- 仪表盘图  /Gauge
    - 仪表盘 单色 多色  /basic gauge
    - 刻度仪表盘  /tick gauge
    - 多仪表盘  /multi gauge

- 分面图  /Facet
    - 行列分面
    - 圆形分面
    - 行分面
    - 列分面
    - list分面
    - tree分面
    - 多级tree分面
    - 镜像分面
    - 矩阵分面

- 其他图表
    - 词云  /word cloud
    - 带图片遮罩的词云  /word cloud mask
    - 华夫图  /Waffle
    - 韦恩图  /Venn
    - punch card
    - 玉珏图  /jade
    - Polar Heatmap
    - 螺旋坐标系
    - Kagi Chart
    - Stream Graph
    - 元素周期表
    - 事件河流  /theme river
    

## 地图图表类型 Map

- 分级统计地图  /choropleth map
- 地图气泡图  /bubble map
- 渔网地图 六边形分割地图  /fishnet or binning

- 动态迁徙图  /migration

- 鹰眼地图
- 多级上卷下钻地图


## 3D

- 星云
- 曲面
- 撞击
 
## 专用图表类型

- AQI空气质量质数图
- 桑基图 
漏斗模型
- k线图
股票趋势

## 数理统计图表

- 对数分布
- 核函数概率密度回归曲线
- 回归曲线
- ROC曲线
- 核函数概率密度分布

## 图表设计

- 图表要素
    - 数据预处理
    - 图层配置、各表样式
    - 数据注记
    - 图例
    - 整饰要素 标题、时间日期
    
- animation
    - pan 平移
    - scale 缩放
    - rotate 旋转

- 视觉变量
    - 形状
    - 尺寸
    - 色彩
    - 方向
    - 数量
    - 密度


## 可视化产品

- js系 图表库
    - d3 - svg + canvas
    - highcharts
    - Chart.js - canvas
    - echarts  - canvas + gl + map
    - g2 - canvas
    - frappe/charts - svg
    
    - vega
    - recharts - react + d3
    - c3
    - nvd3
    - raw
    - plotly

- java系 图表库
    - xchart
    - jasperreports
     
- 其他 图表库
    - bokeh - python系
    - ggplot2 - r

 
- js系 图表产品
    - superset
    - kibana 
    - metabase
    - redash
    
- 其他可视化产品
    - [Tableau](https://www.tableau.com/)
    - [PowerBI](https://powerbi.microsoft.com)
    - [Qlikview](https://www.qlik.com/)
    - [pentaho](https://community.hds.com/community/products-and-solutions/pentaho/)
    
    - [FineBI](http://www.finebi.com/)
    - [永洪 Z-Suite敏捷BI](http://m.yonghongtech.com/)
    - [海致BDP](https://www.bdp.cn)
    - plotly
