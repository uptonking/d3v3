import React from 'react';
import PropTypes from 'prop-types';
import Sector from "./Sector";

const {string, number, bool, func, array} = PropTypes;

/**
 * 饼状图数据容器
 */
class DataSet extends React.Component {

  renderLabel(sector) {

    const {
      arc,
      outerArc,
      radius,
      strokeWidth,
      stroke,
      fill,
      opacity,
      x
    } = this.props;

    const labelPos = outerArc.centroid(sector);
    labelPos[0] = radius * (this.midAngle(sector) < Math.PI ? 1 : -1);

    const linePos = outerArc.centroid(sector);
    linePos[0] = radius * 0.95 * (this.midAngle(sector) < Math.PI ? 1 : -1);

    const textAnchor = this.midAngle(sector) < Math.PI ? 'start' : 'end';

    return (
      <g>
        <polyline
          opacity={opacity}
          strokeWidth={strokeWidth}
          stroke={stroke}
          fill={fill}
          points={[arc.centroid(sector), outerArc.centroid(sector), linePos]}
        />
        <text
          dy=".35em"
          x={labelPos[0]}
          y={labelPos[1]}
          textAnchor={textAnchor}>{x(sector.data)}
        </text>
      </g>
    );
  }


  render() {
    const {
      pie,
      arc,
      colorScale,
      x,
      y,
      onMouseEnter,
      onMouseLeave,
      hideLabels
    } = this.props;

    // console.log('====props DataSet')
    // console.log(this.props)

    const sectors = pie.map((e, index) => {

      const labelFits = e.endAngle - e.startAngle >= 10 * Math.PI / 180;

      return (
        <g key={`${x(e.data)}.${y(e.data)}.${index}`} className="arc">
          <Sector
            data={e.data}
            fill={colorScale(x(e.data))}
            d={arc(e)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          {!hideLabels && !!e.value && labelFits && this.renderLabel(e)}
        </g>
      );
    });

    return <g>{sectors}</g>;
  }


  midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

}

DataSet.defaultProps = {
  strokeWidth: 2,
  stroke: '#000',
  fill: 'none',
  opacity: 0.3,
  hideLabels: false
};

DataSet.propTypes = {
  pie: array.isRequired,
  arc: func.isRequired,
  outerArc: func.isRequired,
  colorScale: func.isRequired,
  radius: number.isRequired,
  strokeWidth: number,
  stroke: string,
  fill: string,
  opacity: number,
  x: func.isRequired,
  hideLabels: bool
};

export default DataSet;
