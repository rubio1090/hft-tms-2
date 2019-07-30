import React, { Component } from 'react';

export default class Switcher extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <label className="switch">
        <input type="checkbox"></input>
        <span className="slider round" onClick={this.handleSwithc}></span>
      </label>
    )
  }
}