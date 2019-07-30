import React, { Component } from 'react';

export default class AddContact extends Component{
  constructor(){
    super();
    this.state={
      contactId : null,
      firstName : null,
      lastName : null,
      position : null,
      phoneNumber : null,
      dc : null,
      shift : null,
      errorMsg : null
    }
  }
  componentDidMount(){
    if(this.props.contact !== null){
      const contact = this.props.contact;
      this.setState({
        contactId : contact.CONTACT_ID,
        firstName : contact.FIRST_NAME,
        lastName : contact.LAST_NAME,
        position : contact.POSITION,
        phoneNumber : contact.PHONE,
        dc : contact.DC,
        shift : contact.SHIFT
      });
    }
  }
  handleSelecetion=(e)=>{
    let value = e.target.value;
    let name = e.target.name;
    this.setState({ [name] : value });

    let chars = /^[A-Za-z]*$/;

    if((name == 'firstName' || name == 'lastName') && !value.match(chars)){
      this.setState({errorMsg : "Must be valid input!"});
    }else if((name == 'phoneNumber') && isNaN(value)){
      this.setState({errorMsg : "Must be a valid number"});
    }else{
      this.setState({errorMsg : null});
    }
  }
  handleSave=(e)=>{
    e.preventDefault();
    const {firstName, position, dc, shift} = this.state;
    if(firstName == null || position == null || dc == null || shift == null){
      this.setState({errorMsg : "Input fields cannot be blank"});
      return false;
    }else {
      const data = {
        contactId : this.state.contactId,
        firstName : this.state.firstName,
        lastName : this.state.lastName,
        position : this.state.position,
        phoneNumber : this.state.phoneNumber,
        dc : this.state.dc,
        shift : Number(this.state.shift)
      }
      if(this.props.contact !== null){
        console.log('Edited')
        this.props.sendUpdate('edit/contact', data, 'contact');
      }else{
        console.log("Added")
        this.props.sendUpdate('add/contact', data, 'contact');
      }
      this.props.close;
    }
  }
  render(){
    return(
      <form id="contact-form">

        <div className="row">
          {this.state.errorMsg !== null ?
            <div className="col mx-3 alert alert-danger">
              {this.state.errorMsg}
            </div> : null
          }
        </div>

        <div className="row mb-4 mt-1">
          <div className="col">
            <input type="text" className="form-control py-3" placeholder="First name" name="firstName" value={this.state.firstName} onChange={this.handleSelecetion}></input>
          </div>
          <div className="col">
            <input type="text" className="form-control py-3" placeholder="Last name" name="lastName" value={this.state.lastName} onChange={this.handleSelecetion}></input>
          </div>
        </div>

        <div className="row my-4">
          <div className="col">
            <select name="position" className="custom-selector form-control py-5" value={this.state.position} onChange={this.handleSelecetion}>
              <option value=""></option>
              <option value="Manager">Manager</option>
              <option value="Coordinator">Coordinator</option>
              <option value="Yard Driver">Yard Driver</option>
            </select>
          </div>
          <div className="col">
            <input type="text" className="form-control py-3" placeholder="Phone Number" name="phoneNumber" value={this.state.phoneNumber} onChange={this.handleSelecetion}></input>
          </div>
        </div>

        <div className="row my-4">
          <div className="col">
            <select name="dc" className="custom-selector form-control py-5" value={this.state.dc} onChange={this.handleSelecetion}>
              <option value=""></option>
              <option value="Cactus">Cactus</option>
              <option value="Brodiaea">Brodiaea</option>
              <option value="Nandina">Nandina</option>
            </select>
          </div>
          <div className="col">
            <select name="shift" className="custom-selector form-control py-5" value={this.state.shift} onChange={this.handleSelecetion}>
              <option value=""></option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
        </div>

        <div className="row my-4">
          <div className="col">
            <button className="btn btn-primary py-3 px-5" onClick={this.handleSave}>Save</button>
            <button className="btn btn-secondary py-3 px-5 mx-3" onClick={this.props.close}>Cancel</button>
          </div>
        </div>
      </form>
    )
  }
}