import React, { Component } from 'react';

export default class ErrorMessage extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const {msg} = this.props;
    return(
      <div className="alert alert-danger">
        {msg}
      </div>
    )
  }
}
