import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

export default class LandingPage extends Component{
  constructor(props){
    super(props);
    this.state={
      isLoggedIn : false
    }
  }
  componentDidMount(){
    console.log('Landed')
    const {loggedIn, user} = this.props.location.state;
    if(loggedIn){
      this.props.getCurrentUser(user);
      console.log('Updated User')
      this.props.login;
      console.log('loged in in main app')
      this.setState({isLoggedIn : true })
      console.log('logged in to redirect')
    }
  }

  render(){
    return(
      <div>
        {this.state.isLoggedIn ? <Redirect to='/'/> : null}
        <h4>Loading Page...</h4>
      </div>
    )
  }
}