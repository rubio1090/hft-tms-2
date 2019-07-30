import React, { Component } from 'react';

export default class AddDoor extends Component{
  constructor(){
    super();
    this.state={
      doorId : null,
      yard : null,
      doorName : null,
      errorMsg : null
    }
  }
  componentDidMount=()=>{
    if(this.props.door !== null){
      const {door} = this.props;
      this.setState({
        doorId : door.DOOR_ID,
        yard : door.DC,
        doorName : door.DOOR_NAME
      });
    }
  }
  handleSelecetion=(e)=>{
    let value = e.target.value;
    let name = e.target.name;
    this.setState({ [name] : value, errorMsg : null });

  }
  handleSave=(e)=>{
    e.preventDefault();
    const {yard, doorName} = this.state;
    if(yard == null || doorName == null){
      this.setState({errorMsg : "Input fields cannot be blank"});
      return false;
    }else{
      const data = {
        doorId : this.state.doorId,
        yard : this.state.yard,
        doorName : this.state.doorName
      }
      if(this.props.door !== null){
        this.props.sendUpdate('edit/door', data, 'door');
      }else{
        this.props.sendUpdate('add/door', data, 'door');
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

        <div className="row my-4">
          <div className="col">
            <select name="yard" className="custom-selector form-control py-5" value={this.state.yard} onChange={this.handleSelecetion}>
              <option value=""></option>
              <option value="Cactus">Cactus</option>
              <option value="Brodiaea">Brodiaea</option>
              <option value="Nandina">Nandina</option>
            </select>
          </div>
          <div className="col">
            <input type="text" className="form-control py-3" placeholder="Door Name" name="doorName" value={this.state.doorName} onChange={this.handleSelecetion}></input>
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