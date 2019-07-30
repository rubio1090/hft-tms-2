import React, { Component } from 'react';
import ErrorMessage from './errorMessage';

export default class Home extends Component{
  constructor(){
    super();
    this.state={
      trailers : [],
      doors : [],
      selectedTrailer : null,
      doorAvailable : true
    }
  }

  componentDidMount(){
    this.getTrailersList();
    this.getDoorList();
  }

  getTrailersList=()=>{
    fetch('http://127.0.0.1:3030/api/trailers')
      .then( res => res.json())
      .then( res => this.setState({ trailers : res.data }))
  }
  getDoorList=()=>{
    fetch('http://127.0.0.1:3030/api/doors')
      .then( res => res.json())
      .then( res => this.setState({ doors : res.data }))
  }
  updateDestination=(tr,e)=>{
    const url = 'http://127.0.0.1:3030/add/destination';
    const data = {
      trailerId : tr,
      dest_door_id : e.target.value
    }

    console.log(data);

    const options ={
      headers: {
        "content-type" : "application/json; charset=UTF-8"
      },
      body : JSON.stringify(data),
      made : "cors",
      method : "POST"
    };

    fetch(url, options)
      .then( res => res.json())
      .then( this.getTrailersList.bind(this))
      .then( this.getDoorList.bind(this))
  }
  updateSelectedTrailer=(e, trailer)=>{
    this.setState({ selectedTrailer : trailer })
    var rows = document.getElementsByClassName('trailer-row');
    for(var i = 0; i< rows.length; i++){
      rows[i].classList.remove('selected-row');
    }
    e.target.parentNode.className = 'trailer-row selected-row';
  }
  updateTrailerStatus=(e)=>{
    e.preventDefault();
    const {selectedTrailer} = this.state;
    let currentSelection = selectedTrailer;
    if(currentSelection.TRAILER_STATUS_CODE === 15){
      currentSelection.TRAILER_STATUS_CODE = 5;
    }else{
      currentSelection.TRAILER_STATUS_CODE += 5;
    }
    this.setState({selectedTrailer : currentSelection});
  }
  buttonClass=(st)=>{
    let classToReturn = '';
    if(st === 5){classToReturn = 'btn-success'}
    if(st === 10){classToReturn = 'btn-danger'}
    if(st === 15){classToReturn = 'btn-warning'}
    if(st === null){classToReturn = 'btn-outline-primary'}

    return classToReturn;
  }
  displayStatus=(st)=>{
    let statusToReturn = '';
    if(st === 5){statusToReturn = 'Empty'}
    if(st === 10){statusToReturn = 'Loaded'}
    if(st === 15){statusToReturn = 'In Transit'}

    return statusToReturn;
  }
  renderTrailerView=(t)=>{
    return(
      <tr className="trailer-row" id={`tr${t.TRAILER_ID}`} key={t.TRAILER_ID}  onClick={ e => this.updateSelectedTrailer(e, t)}>
        <td>{t.TRAILER_NAME}</td>
        <td>{t.TRAILER_STATUS_DESC}</td>
        <td>{t.DOOR_NAME}</td>
        <td>{t.TO_DOOR}</td>
        <td>{t.ARRIVE_DTTM}</td>
        <td>{t.OFFLOAD_START_DTTM}</td>
        <td>{t.OFFLOAD_DTTM}</td>
        <td>{t.WAVE_NBR}</td>
      </tr>
    )
  }
  handleInput=(e)=>{
    const name = e.target.name;
    const val = e.target.value;
    let selection = this.state.selectedTrailer;

    selection[name] = val; 
    this.setState({ selectedTrailer : selection })
  }

  render(){
    const {trailers, doors, selectedTrailer, doorAvailable} = this.state;
    const isSelected = selectedTrailer !== null ? true : false;
    return(
      <div className="full-h container-fluid">
        <div className="trailer-view-container container-fluid p-3">
          <div className="row pt-3">
            <div className="col-8">
              <table className="dark-theme shadow-div table table-borderless mx-2 px-4">
                <thead>
                  <tr>
                    <td>Trailer</td>
                    <td>Status</td>
                    <td>Door</td>
                    <td>Destination</td>
                    <td>Arrival</td>
                    <td>Offload-Start</td>
                    <td>Offload-End</td>
                    <td>Wave</td>
                  </tr>
                </thead>
                <tbody>
                  {trailers.map( trailer => this.renderTrailerView(trailer) )}
                </tbody>
              </table>
            </div>
            
            <div className="col-4">

              <div className="shadow-div">
                <div className="form-title">
                  {isSelected ? <span id="title-value">{selectedTrailer.TRAILER_NAME}</span>
                    : <span id="trailer-null">Click on a trailer to edit.</span> }
                <hr/>
                </div>

                <div className="form-wrap pb-5">
                  <form id="edit-form">
                    
                    {/* TRAILER NAME */}
                    <div className="form-row">
                      <div className="form-group col-md-12">
                        <label htmlFor="trailer-name">Trailer</label>
                        <input 
                          disabled 
                          className="form-control p-2" 
                          type="text" 
                          name="TRAILER_NAME" 
                          id="trailer-name" 
                          value={isSelected ? selectedTrailer.TRAILER_NAME : ''}
                          onChange={this.handleInput}/>
                      </div>
                    </div>

                    {/* STATUS, DOOR */}
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="status">Status</label>
                        <button name="status" id="status" 
                          className={`btn ${isSelected ? this.buttonClass(selectedTrailer.TRAILER_STATUS_CODE) : 'btn-outline-primary'} form-control`} 
                          onClick={this.updateTrailerStatus}>
                          {isSelected ? this.displayStatus(selectedTrailer.TRAILER_STATUS_CODE) : 'Status'}
                        </button>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="door">Door</label>
                        <input 
                          className="form-control" 
                          type="text" 
                          name="DOOR_NAME" 
                          id="door"
                          value={isSelected ? selectedTrailer.DOOR_NAME : ''}
                          onChange={this.handleInput}/>
                      </div>
                    </div>

                    {doorAvailable ? null : <ErrorMessage/> }

                    {/* DESTINATION, ARRIVAL */}
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="destination">Destination</label>
                        <input 
                          className="form-control" 
                          type="text" 
                          name="TO_DOOR" 
                          id="destination"
                          value={isSelected && selectedTrailer.TO_DOOR !== null ? selectedTrailer.TO_DOOR : ''}
                          onChange={this.handleInput}/>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="arrival">Arrival</label>
                        <input 
                          className="form-control" 
                          type="datetime-local" 
                          name="ARRIVE_DTTM" id="arrival"
                          value={isSelected && selectedTrailer.ARRIVE_DTTM !== null ? selectedTrailer.ARRIVE_DTTM : ""}
                          onChange={this.handleInput}/>
                      </div>
                    </div>

                    {/* OFFLOAD START/END */}
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="offload-start">Offload-start</label>
                        <input 
                          className="form-control" 
                          type="datetime-local" 
                          name="OFFLOAD_START_DTTM" 
                          id="offload-start"
                          value={isSelected && selectedTrailer.ARRIVE_DTTM !== null ? selectedTrailer.OFFLOAD_START_DTTM : ""}
                          onChange={this.handleInput}/>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="offload-end">Offload-end</label>
                        <input 
                          className="form-control" 
                          type="datetime-local" 
                          name="OFFLOAD_DTTM" id="offload-end"
                          value={isSelected && selectedTrailer.ARRIVE_DTTM !== null ? selectedTrailer.OFFLOAD_DTTM : ""}
                          onChange={this.handleInput}/>
                      </div>
                    </div>

                    {/* WAVE */}
                    <div className="form-row">
                      <div className="form-group col-md-12">
                        <label htmlFor="wave">Wave</label>
                        <select className="form-control" name="WAVE_NBR" id="wave"
                          value={isSelected && selectedTrailer.ARRIVE_DTTM !== null ? selectedTrailer.WAVE_NBR : null}
                          onChange={this.handleInput}>
                          <option value=""></option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-12">
                        <button className="form-control btn btn-primary p-2">Save</button>
                      </div>
                    </div>

                  </form>
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}