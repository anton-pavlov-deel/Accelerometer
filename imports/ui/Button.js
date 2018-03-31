import React, { Component } from 'react';
import classNames from 'classnames';

export default class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enable: props.enable
    };
  }

  render() {
    return (<button
      className={classNames(this.props.className, 'button')}
      onClick={this.props.onClick}
      >
        {this.props.value}
      </button>);
  }
}
