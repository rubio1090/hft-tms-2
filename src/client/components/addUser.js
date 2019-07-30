import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import ErrorMessage from './errorMessage';
import MessageSuccess from '../utilities/messageSuccess';

export default class AddUser extends Component{
  constructor(props){
    super(props);
    this.state={
      errorMessage : '',
      firstname : '',
      lastname : '',
      username : '',
      password : '',
      passwordComfirm : '',
      wasSuccess : false
    }
  }
  sendBackendRequest=(endpoint, dataLoad)=>{
    const url = `http://127.0.0.1:3030/api/${endpoint}`;
    const data = dataLoad;
    const options = {
      headers : {'content-type' : 'application/json; charset=UTF-8'},
      body : JSON.stringify(data),
      made : 'cors',
      method : 'POST'
    };
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if(res.data == false){
          this.setState({ errorMessage : 'Error. Username already exists.' })
        }else{
          this.setState({
            wasSuccess : res.data,
            firstname : '',
            lastname : '',
            username : '',
            password : '',
            passwordComfirm : ''
          });
          setTimeout(()=>{this.props.refreshData()},500);
          setTimeout(()=>{
            this.setState({wasSuccess : false})
          },3000);
        }
      })
  }
  handleInput=(e)=>{
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name] : value, errorMessage : '' });
  }
  saveUser=(e)=>{
    e.preventDefault();
    const {firstname, lastname, username, password, passwordComfirm} = this.state;
    if(firstname.trim() == '' || lastname.trim() == '' || username.trim() == '' || password.trim() == '', passwordComfirm.trim() == ''){
      this.setState({ errorMessage : 'Input fields cannot be blank!' })
    }else{
      if(passwordComfirm !== password){
        this.setState({ errorMessage : 'Passwords must match!' })
      }else{
        const url = 'add/user';
        const data = {
          firstname : firstname,
          lastname : lastname,
          username : username,
          password : password
        }
        this.sendBackendRequest(url, data);
      }
    }
  }
  
  render(){
    const {errorMessage, firstname, lastname, username, password, passwordComfirm} = this.state;
    const {isLoggedIn} = this.props;

    return(
      <div className="container-fluid">
        {isLoggedIn ? null : <Redirect to={{ pathname : '/' }}/>}

        <div className="row d-flex justify-content-center mt-5">
          <div className="card-wrap col-lg-6 col-md-8 col-sm-12 p-4">

            <p className="card-title">Add User</p>
            <hr/>
            <form className="py-3">
              
                <div className="form-group col-md-12 my-3">
                  <input 
                    name="firstname" 
                    type="text" 
                    className="py-3 form-control" 
                    placeholder="First Name" 
                    value={firstname}
                    onChange={this.handleInput}/>
                </div>

                <div className="form-group col-md-12 my-3">
                  <input 
                    name="lastname" 
                    type="text" 
                    className="py-3 form-control" 
                    placeholder="Last Name" 
                    value={lastname}
                    onChange={this.handleInput}/>
                </div>


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

                <div className="form-group col-md-12 my-3">
                  <input 
                    name="passwordComfirm" 
                    type="password" 
                    className="py-3 form-control" 
                    placeholder="Comfirm Password"
                    value={passwordComfirm}
                    onChange={this.handleInput}/>
                </div>
              

              <div className="form-group col-md-12">
                {errorMessage == '' ? null : <ErrorMessage msg={errorMessage}/>}  
              </div>

              <div className="form-group col-md-12">
                {!this.state.wasSuccess ? null : <MessageSuccess msg={'User successfully added.'}/>}  
              </div>

              <div className="form-group col-md-12">
                <button className="py-3 col-12 btn btn-primary" onClick={this.saveUser}>
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    )
  }
}