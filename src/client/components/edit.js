import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import { Link } from 'react-router-dom';

import Modal from 'react-modal';
import CustomModal from './customModal';
import AddContact from './addContact';
import AddDoor from './addDoor';
import AddTrailer from './addTrailer';

Modal.setAppElement('#root');

export default class Edit extends Component{
  constructor(props, context){
    super(props, context);
    this.state={
      showContactModal : false,
      showDoorModal : false,
      showTrailerModal : false,
      updateContact : null,
      updateTrailer : null,
      updateDoor : null,
      successMsg : ''
    }
  }

  componentDidMount(){
  }
  handleShowContact=()=>{
    this.setState({showContactModal : true})
  }
  handleHideContact=()=>{
    this.setState({
      showContactModal : false,
      updateContact : null
    });
  }
  showDoorModal=()=>{
    this.setState({showDoorModal : true})
  }
  hideDoorModal=()=>{
    this.setState({
      showDoorModal : false,
      updateDoor : null
    });
  }
  showTrailerModal=()=>{
    this.setState({showTrailerModal : true})
  }
  hideTrailerModal=()=>{
    this.setState({
      showTrailerModal : false,
      updateTrailer : null
    })
  }
  sendUpdate=(endpoint, dataLoad, msg)=>{
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
      .then(setTimeout(()=>{this.props.refreshData()},500))
      .then(this.setState({
        showContactModal : false,
        showDoorModal : false,
        showTrailerModal : false,
        successMsg : msg
      }))
      .then(setTimeout(()=>{this.setState({successMsg : ''})},4000))
  }
  updateTrailerToEdit=(tr)=>{
    this.setState({updateTrailer : tr});
  }
  setUpContactEdit=(contact)=>{
    this.setState({updateContact : contact});
    this.handleShowContact();
  }
  setUpDoorEdit=(door)=>{
    this.setState({updateDoor : door});
    this.showDoorModal();
  }
  setUpTrailerEdit=(trailer)=>{
    this.setState({updateTrailer : trailer});
    this.showTrailerModal();
  }
  deleteRecord=(obj, typ)=>{
    let dlt = confirm(`Are you sure you want to delete ${typ} from the list?`);
    let url = `delete/${typ}`;
    let data = {
      id : Object.values(obj)[0]
    }
    if(dlt){
      this.sendUpdate(url, data, typ);
    }else{
      return false;
    }
  }

  render(){
    const {contacts, doors, trailers, users, user, isLoggedIn} = this.props;
    return(
      <div className="container-fluid">
        {isLoggedIn ? null : <Redirect to={{ pathname : '/' }}/>}

        <h2 className="section-title">
          <i className="fa fa-edit mx-2"></i>
          Editor
        </h2>
        <hr/>

        <div className="row justify-content-center">

        <div className="card-wrap col-10 p-4 my-4">
          <div className="card-title" data-target="#user-div" data-toggle="collapse">Users</div>
            <div className="collapse" id="user-div">

              <Link to="/adduser">
                <button className="btn btn-success p-2 px-5 my-3">
                  <i className="fa fa-user-plus"></i> Add User
                </button>
              </Link>

              {this.state.successMsg !== 'contact' ? null : <div className="alert alert-success">Update was successfully made.</div>}

              <table className="to-edit-table table table-hover">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {users.map((user)=>{
                    return(
                      <tr key={user.USER_ID}>
                        <td className="align-middle" >{user.FIRST_NAME}</td>
                        <td className="align-middle" >{user.LAST_NAME}</td>
                        <td className="align-middle" >{user.USER_NAME}</td>
                        <td className="align-middle" >
                          <button className="action-btn btn btn-outline-danger" onClick={this.deleteRecord.bind(this, user, 'user')}><i className="fa fa-trash"></i></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CONTACTS */}
          <div className="card-wrap col-10 p-4 my-4">

          <CustomModal 
            close={this.handleHideContact} 
            show={this.handleShowContact} 
            showModal={this.state.showContactModal} 
            modalTitle="Add Contact"
            content={<AddContact close={this.handleHideContact} sendUpdate={this.sendUpdate} contact={this.state.updateContact}/>}/>

          <div className="card-title" data-target="#contact-div" data-toggle="collapse">Contacts</div>
            <div className="collapse" id="contact-div">

              <button className="btn btn-success p-2 px-5 my-3" onClick={this.handleShowContact}>
                <i className="fa fa-user-plus"></i> Add new contact
              </button>

              {this.state.successMsg !== 'contact' ? null : <div className="alert alert-success">Update was successfully made.</div>}

              <table className="to-edit-table table table-hover">
                <thead>
                  <tr className="">
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Position</th>
                    <th>Phone Number</th>
                    <th>Warehouse</th>
                    <th>Shift</th>
                    <th>Delete</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {contacts.map((contact)=>{
                    return(
                      <tr key={contact.CONTACT_ID}>
                        <td className="align-middle" >{contact.FIRST_NAME}</td>
                        <td className="align-middle" >{contact.LAST_NAME}</td>
                        <td className="align-middle" >{contact.POSITION}</td>
                        <td className="align-middle" >{contact.PHONE}</td>
                        <td className="align-middle" >{contact.DC}</td>
                        <td className="align-middle" >{contact.SHIFT}</td>
                        <td className="align-middle" >
                          <button className="action-btn btn btn-outline-danger" onClick={this.deleteRecord.bind(this, contact, 'contact')}><i className="fa fa-trash"></i></button>
                        </td>
                        <td className="align-middle" >
                          <button className="action-btn btn btn-outline-primary" onClick={this.setUpContactEdit.bind(this, contact)}><i className="fa fa-pen"></i></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doors */}
          <div className="card-wrap col-10 p-4 my-4">

          <CustomModal 
            close={this.hideDoorModal} 
            show={this.showDoorModal} 
            showModal={this.state.showDoorModal} 
            modalTitle="Add Door"
            content={<AddDoor close={this.hideDoorModal} sendUpdate={this.sendUpdate} door={this.state.updateDoor}/>}/>

            <div className="card-title"  data-target="#door-div" data-toggle="collapse">Doors</div>
            <div className="collapse" id="door-div">

              <button className="btn btn-success p-2 px-5 my-3" onClick={this.showDoorModal}>
                <i className="fa fa-door-closed"></i> 
                Add new door
              </button>

              {this.state.successMsg !== 'door' ? null : <div className="alert alert-success">Update was successfully made.</div>}

              <table className="to-edit-table table table-hover">
                <thead>
                  <tr className="">
                    <th>Yard</th>
                    <th>Door Name</th>
                    <th>Delete</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {doors.map((door)=>{
                    return(
                      <tr key={door.DOOR_ID}>
                        <td>{door.DC}</td>
                        <td>{door.DOOR_NAME}</td>
                        <td>
                          <button className="action-btn btn btn-outline-danger" onClick={this.deleteRecord.bind(this, door, 'door')}><i className="fa fa-trash"></i></button>
                        </td>
                        <td>
                          <button className="action-btn btn btn-outline-primary" onClick={this.setUpDoorEdit.bind(this, door)}><i className="fa fa-pen"></i></button>
                        </td>
                      </tr>
                    )
                  })}
                  
                </tbody>
              </table>
            </div>
          </div>

          {/* Trailers */}
          <div className="card-wrap col-10 p-4 my-4">

          <CustomModal 
            close={this.hideTrailerModal} 
            show={this.showTrailerModal} 
            showModal={this.state.showTrailerModal} 
            modalTitle="Add Trailer"
            content={<AddTrailer close={this.hideTrailerModal} sendUpdate={this.sendUpdate} trailer={this.state.updateTrailer}/>}/>

            <div className="card-title"  data-target="#trailer-div" data-toggle="collapse">Trailers</div>
            <div className="collapse" id="trailer-div">

              <button className="btn btn-success p-2 px-5 my-3" onClick={this.showTrailerModal}>
                <i className="fa fa-truck"></i> 
                Add new trailer
              </button>

              {this.state.successMsg !== 'trailer' ? null :<div className="alert alert-success">Update was successfully made.</div>}

              <table className="to-edit-table table table-hover">
                <thead>
                  <tr>
                    <th>Trailer</th>
                    <th>Damaged</th>
                    <th>Delete</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {trailers.map((trailer)=>{
                    return(
                      <tr key={trailer.TRAILER_ID}>
                        <td>{trailer.TRAILER_NAME}</td>
                        <td>{trailer.IS_DAMAGED === 1 ? "Damaged" : "No"}</td>
                        <td>
                          <button className="action-btn btn btn-outline-danger"  onClick={this.deleteRecord.bind(this, trailer, 'trailer')}><i className="fa fa-trash"></i></button>
                        </td>
                        <td>
                          <button className="action-btn btn btn-outline-primary" onClick={this.setUpTrailerEdit.bind(this,trailer)} >
                            <i className="fa fa-pen"></i>
                          </button>
                        </td>
                      </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
