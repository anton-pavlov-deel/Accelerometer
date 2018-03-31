import React, { Component } from 'react';


export default class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enable: true
    };
  }

  render() {
    return (<button
      className = 'button'
      onClick={this.handleClick.bind(this)}
      >
        {this.state.enable ? 'enable' : 'disable'}
      </button>);
  }
}
