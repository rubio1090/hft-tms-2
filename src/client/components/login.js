import React, { Component } from 'react';
import ErrorMessage from './errorMessage';
import { Redirect } from 'react-router-dom';


export default class Login extends Component{
  constructor(props){
    super(props);
    this.state={
      errorMessage : '',
      username : '',
      password : '',
      user : [], 
      loggedIn : false
    }
  }

  componentDidMount(){
    this.setState({loggedIn : this.props.isLoggedIn});
  }
  sendBackendRequest=(endpoint, dataLoad)=>{
    const url = `/api/${endpoint}`;
    const data = dataLoad;
    const options = {
      headers : {'content-type' : 'application/json; charset=UTF-8'},
      body : JSON.stringify(data),
      made : 'cors',
      method : 'POST'
    };
    fetch(url, options)
      .then(res => res.json())
      .then(res =>{
        if(res.success){
          this.props.login(res.user);
          this.props.getCurrentUser(res.user);
          this.setState({
            username : '',
            password : '',
            user : res.user,
            loggedIn : true
          });
        }else{
          this.setState({
            loggedIn : false,
            errorMessage : 'Incorrect username/password'
          })
        }
      })
  }
  handleInput=(e)=>{
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name] : value, errorMessage : '' });
  }
  loginAttempt=(e)=>{
    e.preventDefault();
    const {username, password} = this.state;
    if(username.trim() == '' || password.trim() == ''){
      this.setState({ errorMessage : 'Username/Password cannot be blank!' })
    }else{
      const url = 'login';
      const data = {
        username : username,
        password : password
      }
      this.sendBackendRequest(url, data);
    }
  }
  render(){
    const {errorMessage, username, password, loggedIn, user} = this.state;
    return(
      
      <div className="container-fluid">
        {loggedIn ? 
          <Redirect to={{
            pathname : '/',
            state : {
              loggedIn : true,
              user : user
            }
          }}/> : null}

        <div className="row d-flex justify-content-center mt-5">
          <div className="card-wrap col-lg-4 col-md-8 col-sm-10 p-4">

            <p className="card-title">Login</p>
            <hr/>
            <form className="py-3">
              
              <div className="form-group col-md-12 my-3">
                <input 
                  name="username" 
                  type="text" 
                  className="py-3 form-control" 
                  placeholder="Username" 
                  value={username}
                  onChange={this.handleInput}/>
              </div>
            

              <div className="form-group col-md-12 my-3">
                <input 
                  name="password" 
                  type="password" 
                  className="py-3 form-control" 
                  placeholder="Password"
                  value={password}
                  onChange={this.handleInput}/>
              </div>

              <div className="form-group col-md-12">
                {errorMessage == '' ? null : <ErrorMessage msg={errorMessage}/>}  
              </div>

              <div className="form-group col-md-12">
                <button className="py-3 col-12 btn btn-primary" onClick={this.loginAttempt}>
                  <i className="fa fa-hammer mx-2"></i>
                  Login
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    )
  }
}