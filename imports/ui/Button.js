import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: props.disabled
    };
  }

  render() {
    return (<button
      className={classNames(this.props.className, 'button')}
      onClick={this.props.onClick}
      disabled={this.props.disabled}
      >
        {this.props.label}
      </button>);
  }
}

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}
