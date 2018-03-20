import React from 'react';
import PropTypes from 'prop-types';

const {number, string, array, object, func, oneOfType} = PropTypes;

class Bar extends React.Component {

  render() {
    const {
      x,
      y,
      width,
      height,
      fill,
      data,
      onMouseEnter,
      onMouseLeave
    } = this.props;

    return (
      <rect
        className="bar"
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        onMouseMove={e => onMouseEnter(e, data)}
        onMouseLeave={e => onMouseLeave(e)}
      />
    );
  }
}

Bar.propTypes = {
  width: number.isRequired,
  height: number.isRequired,
  x: number.isRequired,
  y: number.isRequired,
  fill: string.isRequired,
  data: oneOfType([
    array,
    object
  ]).isRequired,
  onMouseEnter: func,
  onMouseLeave: func
}

export default Bar;
