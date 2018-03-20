import React from 'react';
import PropTypes from 'prop-types';

const {number, node} = PropTypes;

/**
 * 所有图表的 通用提示
 */
class Tooltip extends React.Component {

  render() {

    // console.log('====props Tooltip')
    // console.log(this.props)

    //translate暂未使用
    const {top, left, hidden, html, translate} = this.props;

    const style = {
      display: hidden ? 'none' : 'block',
      position: 'absolute',
      top,
      left,
      // transform: `translate(-${translate}%, 0)`,
      pointerEvents: 'none',
      padding: '10px 10px 6px 10px',
      lineHeight: '20px',
      background: 'rgba(0, 0, 0, 0.65)',
      color: '#fff',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
      transition: 'visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1), left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      fontSize: '12px'

    };

    //自定义样式可使用 .tooltip{ }
    return <div className="tooltip" style={style}>{html}</div>;
  }
}

Tooltip.defaultProps = {
  top: 150,
  left: 100,
  html: '',
  translate: 50
};

Tooltip.propTypes = {
  top: number.isRequired,
  left: number.isRequired,
  html: node,
  translate: number
};

export default Tooltip;
