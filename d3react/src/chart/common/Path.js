import React from 'react';
import PropTypes from 'prop-types';

const {string, array} = PropTypes;

class Path extends React.Component {

  render() {
    const {
      className,
      stroke,
      strokeWidth,
      strokeLinecap,
      strokeDasharray,
      fill,
      d,
      style,
      data,
      onMouseEnter,
      onMouseLeave
    } = this.props;

    return (
      <path
        className={className}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeDasharray={strokeDasharray}
        fill={fill}
        d={d}
        onMouseMove={evt => onMouseEnter(evt, data)}
        onMouseLeave={evt => onMouseLeave(evt)}
        style={style}
      />
    );
  }
}

Path.defaultProps = {
  className: 'path',
  fill: 'none',
  strokeWidth: '2',
  strokeLinecap: 'butt',
  strokeDasharray: 'none'
};

Path.propTypes = {
  className: string,
  stroke: string.isRequired,
  strokeLinecap: string,
  strokeWidth: string,
  strokeDasharray: string,
  fill: string,
  d: string.isRequired,
  data: array.isRequired
};

export default Path;
