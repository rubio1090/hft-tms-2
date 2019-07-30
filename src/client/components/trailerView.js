import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import Trailer from './trailer';


export default class TrailerView extends Component{
  constructor(props){
    super(props);
    this.state={

    }
  }
  render(){
    const {trailers, doors, refreshList, refreshDoors, isLoggedIn} = this.props;
    return(
      <div className="container-fluid">
        {isLoggedIn ? null : <Redirect to={{ pathname : '/login' }}/>}

        <div className="row pt-4 d-flex justify-content-center">
          <div className="col-12">
            <h2 className="section-title">Trailer View</h2>
            <hr/>
            <div className="trailer-wrap d-flex justify-content-center">
              <table className="table-hover">
                <tbody>
                  <tr className="trailer-row">
                    <td>Yard</td>
                    <td>Trailer</td>
                    <td>Trailer Status</td>
                    <td>Transfer Status</td>
                    <td>Door</td>
                    <td>From Door</td>
                    <td>Wave</td>
                    <td>To Door</td>
                    <td>Arrive Time</td>
                    <td>Offload Start</td>
                    <td>Offload End</td>
                    <td>Transactions</td>
                  </tr>
                  {trailers.map(trailer => 
                    <Trailer 
                      key={trailer.TRAILER_ID} 
                      trailer={trailer} 
                      doors={doors} 
                      refreshList={refreshList} 
                      refreshDoors={refreshDoors}/>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}