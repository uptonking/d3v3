import React, {Component} from 'react';
import {PiePlot} from 'recharts';
// import {changeNumberOfData} from './utils';


export default class PiePlotDemo extends Component {

  static displayName = 'PiePlotDemo';

  render() {

    var tooltipPie = function (x, y) {
      return y.toString();
    };

    const data = {
      label: '事例一',
      values: [
        {x: '事例四', y: 13},
        {x: '事例一', y: 40},
        {x: '事例五', y: 9},
        {x: '事例二', y: 21},
        {x: '事例三', y: 17}
      ]
    };

    return (
      <div>
        <p>Simple Pie Plot</p>
        <PiePlot
          data={data}
          width={800}
          height={480}
          margin={{top: 10, bottom: 10, left: 100, right: 100}}

          tooltipMode={'fixed'}
          tooltipOffset={{top: 210, left: 280}}
          tooltipHtml={tooltipPie}
          sort={null}
        />
      </div>
    );
  }
}

