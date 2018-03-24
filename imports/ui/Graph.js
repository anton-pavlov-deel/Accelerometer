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


  updateGraph() {
    const {
      options,
      actualData,
      recordData,
      width,
      height
    } = this.props;

    const data = [];

    data.push({
      label: `Actual ${this.props.className}`,
      data: actualData
    });

    if (recordData) {
      data.push({
        label: `Record ${this.props.className}`,
        data: recordData
      });
    }

    this.canvas.style = `width: ${width}px; height: ${height}px;`;
    $(`#graph${this.props.className}`).plot(data, options);
  }

  render() {
    return (
      <div className={classNames(this.props.className, 'graph')}>
        <div id={`graph${this.props.className}`} ref={ref => {this.canvas = ref}}></div>
      </div>
    )
  }
}
