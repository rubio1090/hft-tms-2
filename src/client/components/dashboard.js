import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {Bar, Doughnut} from 'react-chartjs-2';


export default class Dashboard extends Component{
  constructor(props){
    super(props);
    this.state={
      trailers : [],
      doors: [],
      contacts : [],
      isFirstShift: true,
      donutChartData : {
        labels: ["Cactus", "Brodiaea", "Nandina"],
        datasets: [{
        label: "Trailer Count by Yard",
        backgroundColor: ['#0099cc', '#9494b8', '#94b8b8'],
        data: []
        }]
      },
      donutChartOptions :{
        cutoutPercentage : 40,
        animation : {
          easing : 'easeInOutQuint'
        },
        title : {
          display : true,
          text: "Trailer Count by Yard",
          fontSize : 20,
          fontColor : '#333333'
        },
        legend : {
          display : true,
          position : 'bottom'
        }
      },
      stackedChartData : {
        labels: ['Cactus', 'Brodiaea', 'Nandina'],
        datasets: [
          {
            stack: 'stack1',
            label: 'Empty',
            backgroundColor: ['#0099cc', '#0099cc', '#0099cc'],
            data: [1, 2, 3]
          },
          {
            stack: 'stack1',
            label: 'Full',
            backgroundColor: ['#ff661a', '#ff661a', '#ff661a'],
            data: [3, 4, 1]   
          }
        ]
      },
      stackedChartOptions :{
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        },
        legend : {
          display : true,
          position : 'bottom'
        },
        title : {
          display : true,
          text : "Trailer Count by Status",
          fontSize : 20,
          fontColor : '#333333'
        }
      }
    }
  }

  componentDidMount(){
    if(this.props.isLoggedIn){
      this.updateChartsData();
      this.updateState();
    }
  }
  updateState=()=>{
    setTimeout(()=>{
      this.setState({
        trailers : this.props.trailers,
        doors : this.props.doors,
        contacts : this.props.contacts
      })
    },500)
  }
  displayOpenDoors=(door)=>{
    if(door.DOOR_STATUS == 50){
      return(
        <tr key={door.DOOR_ID} className="custom-row">
          <td className="px-4">{door.DC}</td>
          <td>{door.DOOR_NAME}</td>
        </tr>
      )
    }
  }
  displayTrailersByStatus=(trailer, stat)=>{
    if(trailer.IS_EMPTY == stat){
      return(
        <tr key={trailer.TRAILER_ID} className="custom-row">
          <td className="px-4">{trailer.DC}</td>
          <td>{trailer.TRAILER_NAME}</td>
        </tr>
      )
    }
  }
  shiftSelection=()=>{
    this.setState(prevState => ({ isFirstShift : !prevState.isFirstShift }));
  }
  renderContacts=(shift,person,dc,pos)=>{
    let sft = shift ? 1 : 2;
      if(person.SHIFT == sft && person.POSITION == pos && person.DC == dc){
        return(
          <div key={person.CONTACT_ID} className="contact-div col-11 mx-2">
            <p className="float-left">{person.FIRST_NAME} {person.LAST_NAME}</p>
          </div>
        )
      }
  }
  updateChartsData=()=>{
    let intr = setInterval(()=>{
      let {trailers} = this.props;
      let chartData = this.state.donutChartData;
      let stackedData = this.state.stackedChartData;
      let cac = 0, brd = 0, nan = 0;
      let cacE = 0, cacF = 0, brdE = 0, brdF = 0, nanE = 0, nanF = 0;

      if(trailers !== []){
        for(var i = 0; i<trailers.length; i++){
          if(trailers[i].DC == 'Cactus'){
            cac = cac + 1;
            if(trailers[i].IS_EMPTY == 1){
              cacE = cacE + 1;
            }else{
              cacF = cacF + 1;
            }
          }
          if(trailers[i].DC == 'Brodiaea'){
            brd = brd+1;
            if(trailers[i].IS_EMPTY == 1){
              brdE = brdE + 1;
            }else{
              brdF = brdF + 1;
            }
          }
          if(trailers[i].DC == 'Nandina'){
            nan = nan+1;
            if(trailers[i].IS_EMPTY == 1){
              nanE = nanE + 1;
            }else{
              nanF = nanF + 1;
            }
          }
        }
        chartData.datasets[0].data = [];
        stackedData.datasets[0].data = [];
        stackedData.datasets[1].data = [];

        chartData.datasets[0].data.push(cac, brd, nan);
        stackedData.datasets[0].data.push(cacE, brdE, nanE);
        stackedData.datasets[1].data.push(cacF, brdF, nanF);

        this.setState({
          donutChartData : chartData,
          stackedChartData : stackedData
        });
        clearInterval(intr);
      }
    }, 200);
  }
  updateUserInfo=(user)=>{
    this.props.updateUser(user);
  }

  render(){
    const {trailers, doors, contacts, isLoggedIn} = this.props;
    const {isFirstShift} = this.state;
    return(
      <div className="container-fluid">
        {isLoggedIn ? null : <Redirect to={{ pathname : '/login', updateUser : this.updateUserInfo.bind(this) }}/>}

        <h2 className="section-title">
          <i className="fa fa-chart-line mx-2 fa-red"></i>
          Dashboard
        </h2>
        <hr/>

        <div className="row">
          <div className="col-10 px-0">

            {/* CHARTS */}
            <div className="row px-2 my-0 d-flex justify-content-center">
              <div className="col-6">
                <div className="chart-wrap">
                  <Doughnut data={this.props.donutChartData} options={this.props.donutChartOptions}/>
                </div>
              </div>
              <div className="col-6">
                <div className="chart-wrap">
                  <Bar data={this.props.stackedChartData} options={this.props.stackedChartOptions}/>
                </div>
              </div>
            </div>

            <div className="row px-3 pt-2 mt-4 d-flex justify-content-center">

              {/* EMPTY DOOR LIST */}
              <div className="col-4">
                  <div className="card-wrap m-1">
                    <p className="card-title m-4">
                      <i className="fa fa-door-open mr-2"></i>
                      Open Doors
                    </p>
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th className="px-4">DC</th>
                          <th>Door Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doors.map(door => this.displayOpenDoors(door))}
                      </tbody>
                    </table>
                  </div>
                </div>

              {/* EMPTY TRAILERS */}
              <div className="col-4">
                  <div className="card-wrap m-1">
                    <p className="card-title m-4">
                      <i className="fa fa-truck mr-2"></i>
                      Empty Trailers
                    </p>
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th className="px-4">Yard</th>
                          <th>Trailer Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trailers.map(trailer => this.displayTrailersByStatus(trailer, 1))}
                      </tbody>
                    </table>
                  </div>
                </div>

              {/* FULL TRAILERS */}
              <div className="col-4">
                <div className="card-wrap m-1">
                  <p className="card-title m-4">
                    <i className="fa fa-truck mr-2"></i>
                    Full Trailers
                  </p>
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th className="px-4">Yard</th>
                        <th>Trailer Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trailers.map(trailer => this.displayTrailersByStatus(trailer, 0))}
                    </tbody>
                  </table>
                </div>
              </div>
            
            </div>

          </div>

          {/* CONTACTS */}
          <div className="col-2 pl-0 px-2">
            <div className="card-wrap px-1">
              <p className="card-title m-2">
                <i className="fa fa-address-book mr-2"></i>
                Contacts
              </p>
              <hr/>

              <div className="mx-2">
                <label className="switch">
                  <input type="checkbox"></input>
                  <span className="slider round" onClick={this.shiftSelection}></span>
                </label>
                <span className="indicator">{this.state.isFirstShift ? '1st Shift' : '2nd Shift'}</span>
              </div>
              
              <div className="row py-2">

                <span className="indicator">Cactus</span>
                {contacts.map( person => this.renderContacts(isFirstShift, person, "Cactus", "Manager"))}
                {contacts.map( person => this.renderContacts(isFirstShift, person, "Cactus", "Coordinator"))}
                
                <span className="indicator">Brodiaea</span>
                {contacts.map( person => this.renderContacts(isFirstShift, person, "Brodiaea", "Manager"))}
                {contacts.map( person => this.renderContacts(isFirstShift, person, "Brodiaea", "Coordinator"))}

                <span className="indicator">Nandina</span>
                {contacts.map( person => this.renderContacts(isFirstShift, person, "Nandina", "Manager"))}
                {contacts.map( person => this.renderContacts(isFirstShift, person, "Nandina", "Coordinator"))}

                <span className="indicator">Yards</span>
                {contacts.map( person => this.renderContacts(isFirstShift, person, null, "Yard Driver"))}

              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}