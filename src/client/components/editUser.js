import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import ErrorMessage from './errorMessage';
import MessageSuccess from '../utilities/messageSuccess';

export default class EditUser extends Component{
  constructor(props){
    super(props);
    this.state={
      errorMessage : '',
      userId : null,
      firstname : '',
      lastname : '',
      username : '',
      password : '',
      confirmPassword : '', 
      editUserSuccess : false
    }
  }

  componentDidMount(){
    const {user} = this.props;
      this.setState({
        firstname : user.FIRST_NAME,
        lastname : user.LAST_NAME,
        username : user.USER_NAME,
        userId : user.USER_ID
      })
  }
  handleInput=(e)=>{
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name] : value, errorMessage : '' });
  }
  sendUpdate=(e)=>{
    e.preventDefault();
    const {userId, firstname, lastname, username, password, confirmPassword} = this.state;
    const {user} = this.props;

    if(firstname.trim() == '' || lastname.trim() == '' || username.trim() == '' || password.trim() == '' || confirmPassword.trim() == ''){
      this.setState({ errorMessage : 'Input fields cannot be blank!' })
    }else{
      if(password !== confirmPassword){
        this.setState({ errorMessage : 'Error! Passwords must match.' })
      }else{
        const url = `/api/edit/user`;
        const data = {
          userId : userId, 
          firstname : firstname,
          lastname : lastname,
          username : username,
          password : password
        };
        const options = {
          headers : {'content-type' : 'application/json; charset=UTF-8'},
          body : JSON.stringify(data),
          made : 'cors',
          method : 'POST'
        };
        fetch(url, options)
          .then(res => res.json())
          .then(res => {
            if(res.success){
              this.setState({ 
                editUserSuccess : true,
                password : '',
                confirmPassword : ''
              })
            }else{
              this.setState({
                errorMessage : res.errorMessage
              });
              setTimeout(()=>{this.setState({errorMessage : ''})},4000);
            }
          })
          .then(setTimeout(()=>{this.setState({editUserSuccess : false})},4000))
      }
    }
  }
  render(){
    const {errorMessage, editUserSuccess, firstname, lastname, username, password,confirmPassword} = this.state;
    const {user, isLoggedIn} = this.props;

    return(
      <div className="container-fluid">
        {!isLoggedIn || user == 'undefined' ? <Redirect to={{ pathname : '/' }}/> : null}

        <div className="row d-flex justify-content-center mt-5">
          <div className="card-wrap col-lg-6 col-md-8 col-sm-12 p-4">

            <p className="card-title">Edit Profile</p>
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
                    name="confirmPassword" 
                    type="password" 
                    className="py-3 form-control" 
                    placeholder="Comfirm Password"
                    value={confirmPassword}
                    onChange={this.handleInput}/>
                </div>
              

              <div className="form-group col-md-12">
                {errorMessage == '' ? null : <ErrorMessage msg={errorMessage}/>}  
              </div>

              <div className="form-group col-md-12">
                {!editUserSuccess ? null : <MessageSuccess msg="Updates were made successfully."/>}  
              </div>

              <div className="form-group col-md-12">
                <button className="py-3 col-12 btn btn-primary" onClick={this.sendUpdate}>
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