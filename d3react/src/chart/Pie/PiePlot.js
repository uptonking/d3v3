import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import d3 from 'd3';

import Plot from '../common/Plot';
import Tooltip from '../Tooltip/Tooltip';

import DataSet from './DataSet';

const {string, number, bool, func, object, array, shape, any, oneOf, oneOfType, objectOf} = PropTypes;

class PiePlot extends React.Component {

  constructor() {
    super();
    this.state = {
      tooltip: {
        hidden: true
      }
    };
  }

  componentDidMount() {
    this._svgNode = ReactDOM.findDOMNode(this).getElementsByTagName('svg')[0];
  }

  onMouseEnter = (e, data) => {
    // console.log('====onMouseEnter ')
    // console.log(this.props);

    if (!this.props.tooltipHtml) {
      console.log('====onMouseEnter tooltipHtml为空')
      return;
    }

    e.preventDefault();

    const {
      margin,
      tooltipMode,
      tooltipOffset,
      tooltipContained
    } = this.props;

    const svg = this._svgNode;
    let position;

    if (svg.createSVGPoint) {
      let point = svg.createSVGPoint();
      //clientX事件属性返回当事件被触发时鼠标指针向对于浏览器页面（或客户区）的水平坐标。
      point.x = e.clientX;
      point.y = e.clientY;
      // console.log('====point')
      // console.log(point)
      point = point.matrixTransform(svg.getScreenCTM().inverse());
      // console.log(point)
      position = [point.x - margin.left, point.y - margin.top];

    } else {
      const rect = svg.getBoundingClientRect();
      position = [e.clientX - rect.left - svg.clientLeft - margin.left,
        e.clientY - rect.top - svg.clientTop - margin.top];
    }

    const [html, xPos, yPos] = this._tooltipHtml(data, position);

    const svgTop = svg.getBoundingClientRect().top + margin.top;
    const svgLeft = svg.getBoundingClientRect().left + margin.left;

    let top = 0;
    let left = 0;

    if (tooltipMode === 'fixed') {
      // console.log('====tooltipMode fixed')

      top = svgTop + tooltipOffset.top;
      left = svgLeft + tooltipOffset.left;
    } else if (tooltipMode === 'element') {
      // console.log('====tooltipMode element')

      top = svgTop + yPos + tooltipOffset.top;
      left = svgLeft + xPos + tooltipOffset.left;
    } else { // mouse
      // console.log('====tooltipMode mouse')
      top = e.clientY + tooltipOffset.top;
      left = e.clientX + tooltipOffset.left;
    }

    //线性插值函数
    function lerp(t, a, b) {
      return (1 - t) * a + t * b;
    }

    let translate;

    if (tooltipContained) {
      const t = position[0] / svg.getBoundingClientRect().width;
      translate = lerp(t, 0, 100);
    }

    this.setState({
      tooltip: {
        top,
        left,
        hidden: false,
        html,
        translate
      }
    });
  }

  onMouseLeave = (e) => {
    // console.log('====onMouseEnter ')

    if (!this.props.tooltipHtml) {
      console.log('====onMouseLeave tooltipHtml为空')
      return;
    }

    e.preventDefault();

    this.setState({
      tooltip: {
        hidden: true
      }
    });
  }

  _tooltipHtml(d) {
    const html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

    return [html, 0, 0];
  }


  render() {

    const {
      data,
      width,
      height,
      margin,
      viewBox,
      preserveAspectRatio,
      colorScale,
      padRadius,
      cornerRadius,
      sort,
      x,
      y,
      values,
      hideLabels
    } = this.props;

    let {
      innerRadius,
      outerRadius,
      labelRadius
    } = this.props;

    // console.log('====props PiePlot')
    // console.log(this.props);
    // console.log(this.state.tooltip.hidden);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let pie = d3.layout.pie()
      .value(e => y(e));


    if (typeof sort !== 'undefined') {
      pie = pie.sort(sort);
    }

    const radius = Math.min(innerWidth, innerHeight) / 2;
    if (!innerRadius) {
      innerRadius = radius * 0.8;
    }

    if (!outerRadius) {
      outerRadius = radius * 0.4;
    }

    if (!labelRadius) {
      labelRadius = radius * 0.9;
    }

    const arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .padRadius(padRadius)
      .cornerRadius(cornerRadius);


    const outerArc = d3.svg.arc()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

    const pieData = pie(values(data));

    // console.log('====PiePlot pieData');
    // console.log(pieData);

    const translation = `translate(${innerWidth / 2}, ${innerHeight / 2})`;

    return (
      <div>
        <Plot height={height} width={width} margin={margin} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio}>

          <g transform={translation}>
            <DataSet
              width={innerWidth}
              height={innerHeight}
              colorScale={colorScale}
              pie={pieData}
              arc={arc}
              outerArc={outerArc}
              radius={radius}
              x={x}
              y={y}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
              hideLabels={hideLabels}
            />
          </g>
          {this.props.children}
        </Plot>
        <Tooltip {...this.state.tooltip} />
      </div>
    );
  }
}

PiePlot.defaultProps = {

  //== defaultProps
  data: {label: 'No data available', values: [{x: 'No data available', y: 1}]},
  margin: {top: 0, bottom: 0, left: 0, right: 0},
  xScale: null,
  yScale: null,
  colorScale: d3.scale.category20(),
  //== accessor
  label: stack => stack.label,
  values: stack => stack.values,
  x: e => e.x,
  y: e => e.y,
  y0: () => 0,
  //== tooltip
  tooltipMode: 'mouse',
  tooltipOffset: {top: 0, left: 0},
  tooltipHtml: null,
  tooltipContained: false,

  // ====
  innerRadius: null,
  outerRadius: null,
  labelRadius: null,
  padRadius: 'auto',
  cornerRadius: 0,
  sort: undefined,
  hideLabels: false
};

PiePlot.propTypes = {
  data: oneOfType([object, array]).isRequired,
  height: number.isRequired,
  width: number.isRequired,
  margin: shape({
    top: number,
    bottom: number,
    left: number,
    right: number
  }),
  xScale: func,
  yScale: func,
  colorScale: func,
  //==
  label: func,
  values: func,
  x: func,
  y: func,
  y0: func,
  //==
  tooltipHtml: func,
  tooltipMode: oneOf(['mouse', 'element', 'fixed']),
  tooltipContained: bool,
  tooltipOffset: objectOf(number),

  // ====
  innerRadius: number,
  outerRadius: number,
  labelRadius: number,
  padRadius: string,
  cornerRadius: number,
  sort: any,
  hideLabels: bool
};

export default PiePlot;
