import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { render } from 'react-dom';
import d3 from 'd3';
Meteor.startup(() => {
  render(<App />, document.getElementById('root'));
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0.0,
      y: 0.0,
      z: 0.0
    }

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this), false);
    }
  }

  handleDeviceMotion(event) {
    const { x, y, z } = event.accelerationIncludingGravity;
    this.setState({
      x,
      y,
      z
    })

    d3.select(".chart")
      .selectAll("div")
      .data([x, y, z])
        .enter()
        .append("div")
        .style("width", function(d) { return d + "px"; })
        .text(function(d) { return d; });
  }

  render() {
    return (
      <ul>
        <li>{this.state.x}</li>
        <li>{this.state.y}</li>
        <li>{this.state.z}</li>
        <div className='chart'></div>
      </ul>
    );
  }
}
