import React from 'react';
import PropTypes from 'prop-types';
import Bar from './Bar';

const {string, number, bool, func, array} = PropTypes;

/**
 * 柱状图数据容器
 */
class DataSet extends React.Component {

  render() {
    const {
      data,
      xScale,
      yScale,
      colorScale,
      values,
      label,
      x,
      y,
      y0,
      onMouseEnter,
      onMouseLeave,
      groupedBars,
      colorByLabel
    } = this.props;

    let bars;
    if (groupedBars) {
      bars = data.map((stack, serieIndex) => values(stack).map((e, index) => {
        const yVal = y(e) < 0 ? yScale(0) : yScale(y(e));
        return(
          <Bar
            key={`${label(stack)}.${index}`}
            width={xScale.rangeBand() / data.length}
            height={Math.abs(yScale(0) - yScale(y(e)))}
            x={xScale(x(e)) + xScale.rangeBand() * serieIndex / data.length}
            y={yVal}
            fill={colorScale(label(stack))}
            data={e}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        );
      }));
    } else {
      bars = data.map(stack => values(stack).map((e, index) => {
        const color = colorByLabel ? colorScale(label(stack)) : colorScale(x(e));
        const yVal = y(e) < 0 ? yScale(y0(e)) : yScale(y0(e) + y(e));
        return (
          <Bar
            key={`${label(stack)}.${index}`}
            width={xScale.rangeBand()}
            height={Math.abs(yScale(y0(e) + y(e)) - yScale(y0(e)))}
            x={xScale(x(e))}
            y={yVal}
            fill={color}
            data={e}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        );
      }));
    }

    return <g>{bars}</g>;
  }

}

DataSet.propTypes = {
  data: array.isRequired,
  xScale: func.isRequired,
  yScale: func.isRequired,
  colorScale: func.isRequired,
  values: func.isRequired,
  label: func.isRequired,
  x: func.isRequired,
  y: func.isRequired,
  y0: func.isRequired
};

export default DataSet;
