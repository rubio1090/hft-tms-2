import React, { Component } from 'react';
import Nav from './nav';
import Dashboard from './dashboard';
import Edit from './edit';


export default class Trailers extends Component{
  constructor(){
    super();
    this.state = {
      currentSelection : 3,
      trailers : [],
      editableTrailers : [],
      doors: [],
      contacts : []
    }
  }

  componentDidMount(){
    this.getTrailersList();
    this.getDoorList();
    this.getContacts();
    this.getEditableTrailers();
  }

  refreshFromChild=()=>{
    this.getEditableTrailers();
    this.getTrailersList();
    this.getDoorList();
    this.getContacts();
  }

  getTrailersList=()=>{
    fetch('/api/trailers')
      .then( res => res.json())
      .then( res => this.setState({ trailers : res.data }))
  }

  getContacts=()=>{
    fetch('/api/contacts')
      .then(res => res.json())
      .then(res => this.setState({ contacts : res.data }))
  }
  getDoorList=()=>{
    fetch('/api/doors')
      .then( res => res.json())
      .then( res => this.setState({ doors : res.data }))
  }
  displayOpenDoors=(door)=>{
    if(door.DOOR_STATUS == 50){
      return(
        <tr className="custom-row">
          <td className="px-4">{door.DC}</td>
          <td>{door.DOOR_NAME}</td>
        </tr>
      )
    }
  }
  displayTrailersByStatus=(trailer, stat)=>{
    if(trailer.IS_EMPTY == stat){
      return(
        <tr className="custom-row">
          <td className="px-4">{trailer.DC}</td>
          <td>{trailer.TRAILER_NAME}</td>
        </tr>
      )
    }
  }
  renderContacts=(shift,person,dc,pos)=>{
    let sft = shift ? 1 : 2;
      if(person.SHIFT == sft && person.POSITION == pos && person.DC == dc){
        return(
          <div className="contact-div col-11 mx-2">
            <p className="float-left">{person.FIRST_NAME} {person.LAST_NAME}</p>
            {/* {person.PHONE !== null ? <i className="fa fa-phone-square float-right mx-1" data-tip={person.PHONE}></i> : null} */}
            {/* {person.EMAIL !== null ? <i className="fa fa-envelope float-right mx-1" data-tip={person.EMAIL}></i> : null} */}
          </div>
        )
      }
  }
  shiftSelection=()=>{
    this.setState(prevState => ({ isFirstShift : !prevState.isFirstShift }));
    console.log(this.state.isFirstShift);
  }
  updateNav=(componentNumber)=>{
    this.setState({currentSelection : componentNumber});
  }

  render(){
    const {trailers, doors, contacts, currentSelection, editableTrailers, donutChartData, donutChartOptions, stackedChartData, stackedChartOptions} = this.state;
    return(
      <div className="container-fuid">
      <Nav updateNav={this.updateNav} currentSelection={currentSelection}/>

        {/* Transfer Manager */}
        {/* {currentSelection !== 2 ? null :
        <TrailerView
          trailers={trailers}
          doors={doors}
          refreshList={this.getTrailersList}
          refreshDoors={this.getDoorList}/>} */}

        {/* {currentSelection !== 3 ? null : 
          <Edit
            contacts={contacts}
            doors={doors}
            trailers={editableTrailers}
            refreshData={this.refreshFromChild}/>} */}

      </div>
    )
  }

}
