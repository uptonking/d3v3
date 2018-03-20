import React, {Component} from 'react';
import {BarPlot} from 'recharts';
// import {changeNumberOfData} from './utils';


export default class BarPlotDemo extends Component {

  static displayName = 'BarPlotDemo';

  render() {
    const tooltip = function (x, y0, y, total) {
      return y.toString();
    }

    // ==== option for plot1 - simple bar

    const data1 = [{
      label: 'somethingA',
      values: [
        {x: 'SomethingA', y: 10},
        {x: 'SomethingB', y: 4},
        {x: 'SomethingC', y: 3},
        {x: 'SomethingD', y: 3}]
    }];

    // ==== option for plot2,3 - grouped ,stacked bar
    const data2 = [
      {
        label: 'somethingA',
        values: [
          {x: 'SomethingA', y: 10},
          {x: 'SomethingB', y: 4},
          {x: 'SomethingC', y: -3}
        ]
      },
      {
        label: 'somethingB',
        values: [
          {x: 'SomethingA', y: 5},
          {x: 'SomethingB', y: 8},
          {x: 'SomethingC', y: -5}
        ]
      },
      {
        label: 'somethingC',
        values: [
          {x: 'SomethingA', y: 6},
          {x: 'SomethingB', y: 7},
          {x: 'SomethingC', y: 5}
        ]
      }
    ];

    return (
      <div>
        <p>Simple Bar Plot</p>
        <BarPlot
          data={data1}
          width={800}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltip}
          colorByLabel={false}
        />

        <p>Grouped Bar Plot</p>
        <BarPlot
          data={data2}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltip}
          tooltipMode={'mouse'}
          groupedBars
        />

        <p>Stacked Bar Plot</p>
        <BarPlot
          data={data2}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltip}
          tooltipMode={'element'}
        />
      </div>
    );
  }
}

