import React, { Component } from 'react';
const moment = require('moment');
import ReactTooltip from 'react-tooltip';

export default class Trailer extends Component{
  constructor(props){
    super(props);
    this.state={
      doors: this.props.doors,
      value : ''
    }
  }

  componentDidMount(){
    this.setState({value : this.props.trailer.TO_DOOR});
  }
  formatDisplayDate=(dt)=>{
    const currDate = moment().format('M-D-YY');
    const inDate = moment(dt).format('M-D-YY');
    const displayDate = moment(dt).format('h:mm A');
    if(dt == null){
      return null;
    }else{
      if(currDate == inDate){
        return displayDate;
      }else{
        return moment(dt).format('MMM D, h:mm A');
      }
    }
  }
  sendUpdate=(endpoint, dataLoad)=>{
    const url = `http://127.0.0.1:3030/api/edit/${endpoint}`;
    const data = dataLoad;
    const options = {
      headers : {'content-type' : 'application/json; charset=UTF-8'},
      body : JSON.stringify(data),
      made : 'cors',
      method : 'POST'
    };
    fetch(url, options)
      .then(res => res.json())
      .then(this.props.refreshList)
      .then(this.props.refreshDoors)
  }
  toggleStatus=()=>{
    const trSt = this.props.trailer.IS_EMPTY == 1 ? 0 : 1;
    const dataLoad = {
      newStatus : trSt,
      trailer_id : this.props.trailer.TRAILER_ID
    };
    this.sendUpdate('status', dataLoad);
  }
  displayTrailerStatus=(trailer)=>{
    const statusClass = trailer.IS_EMPTY == 1 ? 'status-toggler btn btn-success' : 'status-toggler btn btn-warning';
    const status = trailer.IS_EMPTY == 1 ? 'Empty' : 'Full';
    return(
      <button className={statusClass} onClick={this.toggleStatus}>{status}</button>
    )
  }
  displayAvailableDoors=(door, toDoorId)=>{
    if(door.DOOR_ID == toDoorId || door.DOOR_STATUS == 50){
      return(
        <option key={door.DOOR_ID} value={door.DOOR_NAME}>{door.DOOR_NAME}</option>
      )
    }
  }
  availableForCurrent=(door, trailer)=>{
    if(door.DOOR_ID == trailer.CURRENT_DOOR_ID || door.DOOR_STATUS == 50){
      return(
        <option key={door.DOOR_ID} value={door.DOOR_NAME}>{door.DOOR_NAME}</option>
      )
    }
  }
  updateDestination=(e)=>{
    this.setState({value : e.target.value});

    const value = e.target.value;
    const {doors} = this.props;
    let toDoorId = null;

    for(var i = 0; i<doors.length; i++){
      if(doors[i].DOOR_NAME === value){
        toDoorId = doors[i].DOOR_ID;
        break;
      }
    }

    let data = {
      toDoorId : toDoorId,
      oldDoorId : this.props.trailer.CURRENT_DOOR_ID,
      tranId : this.props.trailer.TRAN_ID,
      trailerId : this.props.trailer.TRAILER_ID
    }
    this.sendUpdate('destination', data);
  }
  handleWaveSelection=(e)=>{
    this.setState({waveValue : e.target.value});
    const data = {
      tranId : this.props.trailer.TRAN_ID,
      trailerId : this.props.trailer.TRAILER_ID,
      fromDoor : this.props.trailer.CURRENT_DOOR_ID,
      wave : e.target.value
    }
    this.sendUpdate('wave', data);
  }
  handleCurrntDoorSelection=(e)=>{
    const value = e.target.value;
    const {doors} = this.props;
    let currDoorId = null;

    this.setState({currentDoorValue : value});

    for(var i = 0; i<doors.length; i++){
      if(doors[i].DOOR_NAME === value){
        currDoorId = doors[i].DOOR_ID;
        break;
      }
    }

    let data = {
      newDoorId : currDoorId,
      trailerId : this.props.trailer.TRAILER_ID,
      oldDoorId : this.props.trailer.CURRENT_DOOR_ID
    }
    this.sendUpdate('currentdoor', data);
  }
  disableButton=(prevComplete)=>{
    if(prevComplete !== null){
      return false;
    }else{
      return true;
    }
  }
  arrivedClass=()=>{
    const {trailer} = this.props;
    if(trailer.TO_DOOR_ID == null){
      return "btn mr-2 btn-outline-secondary";
    }else if(trailer.ARRIVE_DTTM==null){
      return "btn mr-2 btn-outline-primary";
    }else{
      return "btn mr-2 btn-success"
    }
  }
  offloadStartClass=()=>{
    const {trailer} = this.props;
    if(trailer.ARRIVE_DTTM==null){
      return "btn mr-2 btn-outline-secondary";
    } else if(trailer.OFFLOAD_START_DTTM==null){
      return "btn mr-2 btn-outline-primary";
    }else{
      return "btn mr-2 btn-success"
    }
  }
  offloadEndClass=()=>{
    const {trailer} = this.props;
    if(trailer.OFFLOAD_START_DTTM == null){
      return "btn mr-2 btn-outline-secondary";
    }else if(trailer.OFFLOAD_DTTM==null){
      return "btn mr-2 btn-outline-primary";
    }else{
      return "btn mr-2 btn-success"
    }
  }
  arriveTimestamp=()=>{
    let timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    let data = {
      tranId : this.props.trailer.TRAN_ID,
      timeSt : timestamp,
      toDoorId : this.props.trailer.TO_DOOR_ID,
      trailerId : this.props.trailer.TRAILER_ID,
      isEmpty : this.props.trailer.IS_EMPTY
    }
    this.sendUpdate('arrivalts', data);
    this.props.refreshList;
    this.props.refreshDoors;
    this.props.trailer.IS_EMPTY == 1 ? this.setState({ waveValue : ""}) : null;
  }
  offloadStartTimestamp=()=>{
    let timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    let data = {
      tranId : this.props.trailer.TRAN_ID,
      timeSt : timestamp,
      trailerId : this.props.trailer.TRAILER_ID
    }
    this.sendUpdate('offloadstart', data);
  }
  offloadEndTimestamp=()=>{
    let timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    let data = {
      tranId : this.props.trailer.TRAN_ID,
      timeSt : timestamp,
      trailerId : this.props.trailer.TRAILER_ID
    }
    this.sendUpdate('offloadend', data);
    this.setState({ waveValue : ""});
  }

  render(){
    const {trailer, doors} = this.props;
    return(
      <tr className="trailer-row">
        
        <td>{trailer.DC}</td>
        
        <td>{trailer.TRAILER_NAME}</td>
        
        <td>{this.displayTrailerStatus(trailer)}</td>

        <td>{trailer.LOAD_STATUS_DESC}</td>

        <td>
          <select className="form-control" value={this.props.trailer.DOOR_NAME || ""} onChange={this.handleCurrntDoorSelection}>
            <option value=""></option>
            {doors.map(door => this.availableForCurrent(door, trailer))}
          </select>
        </td>

        <td>{trailer.FROM_DOOR}</td>

        <td>
          <select className="form-control" value={this.props.trailer.WAVE_NBR || ""} onChange={this.handleWaveSelection}>
            <option value=""></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </td>

        <td>
          <select disabled={trailer.WAVE_NBR== null ? true : false} className="form-control" value={this.state.value} onChange={this.updateDestination}>
            <option value=""></option>
            {doors.map( door => this.displayAvailableDoors(door, trailer.TO_DOOR_ID))}
          </select>
        </td>

        <td>{this.formatDisplayDate(trailer.ARRIVE_DTTM)}</td>
        <td>{this.formatDisplayDate(trailer.OFFLOAD_START_DTTM)}</td>
        <td>{this.formatDisplayDate(trailer.OFFLOAD_DTTM)}</td>

        <td>
          <button disabled={this.disableButton(trailer.TO_DOOR_ID)} className={this.arrivedClass()} data-tip="Arrived" onClick={this.arriveTimestamp}>
            <i className="fa fa-truck"></i>
          </button>
          <button disabled={this.disableButton(trailer.ARRIVE_DTTM)} className={this.offloadStartClass()} data-tip="Offload-Start" onClick={this.offloadStartTimestamp}>
            <i className="fa fa-truck-loading"></i>
          </button>
          <button disabled={this.disableButton(trailer.OFFLOAD_START_DTTM)} className={this.offloadEndClass()} data-tip="Offloaded" onClick={this.offloadEndTimestamp}>
            <i className="fa fa-check-square"></i>
          </button>
          <ReactTooltip/>
        </td>

      </tr>
    )
  }
}
