import React, { Component } from 'react';

export default class ArrowToggler extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const {direction, target} = this.props;
    return(
      <i className={`fa fa-arrow-circle-${direction} float-right`} data-toggle="collapse" data-target={`#${target}`}></i>
    )
  }
}