import React, { Component } from 'react';

export default class MessageSuccess extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const {msg} = this.props;
    return(
      <div className="alert alert-success">
        {msg}
      </div>
    )
  }
}