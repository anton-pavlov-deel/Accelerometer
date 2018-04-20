import React, { Component } from 'react';
import classNames from 'classnames';
import 'flot';
import _ from 'lodash';

export default class Graph extends Component {
  componentDidUpdate() {
    this.updateGraph.bind(this)();
  }

  componentDidMount() {
    this.updateGraph.bind(this)();
  }

  configureOptions() {
    const {
      actualData,
      options,
    } = this.props;

    if (actualData.X.length) {
      const maxX = Math.max(...actualData.X.map(item => item[1]));
      const maxY = Math.max(...actualData.Y.map(item => item[1]));
      const maxZ = Math.max(...actualData.Z.map(item => item[1]));
      const maxData = Math.max(maxX, maxY, maxZ, options.minDataValue);

      return {
        yaxis: {
          max: maxData,
          min: -maxData
        },
        xaxis: {
          max: (options.time + options.timeInterval)/1000,
          min: (options.time - options.timeInterval)/1000
        },
      };
    }
  }

  updateGraph() {
    const {
      options,
      actualData,
      recordData,
      width,
      height,
      dataFragment,
    } = this.props;

    const data = [];

    data.push({
      label: `Actual ${this.props.className}`,
      data: actualData[dataFragment]
    });

    if (recordData) {
      data.push({
        label: `Record ${this.props.className}`,
        data: recordData[dataFragment]
      });
    }

    this.canvas.style = `width: ${width}px; height: ${height}px;`;
    $(`#graph${this.props.className}`).plot(data, this.configureOptions(options));
  }

  render() {
    return (
      <div className={classNames(this.props.className, 'graph')}>
        <div id={`graph${this.props.className}`} ref={ref => {this.canvas = ref}}></div>
      </div>
    )
  }
}
