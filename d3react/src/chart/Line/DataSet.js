import React from 'react';
import PropTypes from 'prop-types';
import Path from '../common/Path';

const {string, number, bool, func, array} = PropTypes;

/**
 * 线状图数据容器
 */
class DataSet extends React.Component {

  render() {

    const {
      width,
      height,
      data,
      line,
      strokeWidth,
      strokeLinecap,
      strokeDasharray,
      colorScale,
      values,
      label,
      onMouseEnter,
      onMouseLeave
    } = this.props;

    const sizeId = width + 'x' + height;

    const lines = data.map((stack, index) =>
      <Path
      key={`${label(stack)}.${index}`}
      className={'line'}
      d={line(values(stack))}
      stroke={colorScale(label(stack))}
      strokeWidth={typeof strokeWidth === 'function' ? strokeWidth(label(stack)) : strokeWidth}
      strokeLinecap={typeof strokeLinecap === 'function' ? strokeLinecap(label(stack)) : strokeLinecap}
      strokeDasharray={typeof strokeDasharray === 'function' ? strokeDasharray(label(stack)) : strokeDasharray}
      data={values(stack)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{clipPath: `url(#lineClip_${sizeId})`}}
    />);

    /*
     The <rect> below is needed in case we want to show the tooltip no matter where on the chart the mouse is.
     Not sure if this should be used.
     */
    return (
      <g>
        <defs>
          <clipPath id={`lineClip_${sizeId}`}>
            <rect width={width} height={height}/>
          </clipPath>
        </defs>
        {lines}
        <rect
          width={width}
          height={height}
          fill={'none'}
          stroke={'none'}
          style={{pointerEvents: 'all'}}
          onMouseMove={evt => {
            onMouseEnter(evt, data);
          }}
          onMouseLeave={evt => {
            onMouseLeave(evt);
          }}
        />
      </g>
    );
  }

}

DataSet.propTypes = {
  data: array.isRequired,
  line: func.isRequired,
  colorScale: func.isRequired
};

export default DataSet;
