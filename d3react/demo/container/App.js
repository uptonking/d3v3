import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import components from '../component/index';

class App extends Component {

  static propTypes = {
    params: PropTypes.object,
    location: PropTypes.object,
  };


  renderList() {

    ///items是无状态纯组件
    const items = Object.keys(components).map(key => {

      const group = components[key];

      ///二级 具体组件名
      const list = Object.keys(group).map((c) => {

        return (
          <li key={`component-${c}`}>
            <Link to={{pathname: '/', search: `?group=${key}&component=${c}`}}>{c}</Link>
          </li>
        );
      });

      ///一级 组件类别名
      return (
        <div key={`group-${key}`} className="component-list-container">
          <p className="group-name">{key}</p>
          <ul className="component-list">
            {list}
          </ul>
        </div>
      );
    });

    return (
      <div className="component-list-wrapper">
        <p className="title">components</p>
        {items}
      </div>
    );
  }


  renderPageDetail(group, page) {
    return (
      <div className="component-wrapper">
        <p className="back"><Link to={{pathname: '/'}}>Back to homepage</Link></p>
        <p className="title">{page}</p>
        {
          components[group] &&
          components[group][page] ? React.createElement(components[group][page]) : null
        }
      </div>
    );
  }


  render() {
    const {location} = this.props;
    const {search} = location;
    const group = /group=([a-zA-Z]+)/.exec(search);
    const component = /component=([a-zA-Z]+)/.exec(search);

    //如果地址栏url中能够找到2个group和2个component，就渲染详情页
    if (group && group.length === 2 && component && component.length === 2) {
      return this.renderPageDetail(group[1], component[1]);
    }

    //否则渲染列表页，默认初始状态
    return this.renderList();
  }
}

export default App;
