import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export default class Nav extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const {user} = this.props;

    return(
      <div className="nav-top d-flex flex-row-reverse container-fluid sticky-top">

        <ul className="nav ml-auto">
          
          <li className="nav-hover nav-item py-2">
            <Link to='/'>
              <span className="nav-link">Dashboard</span>
            </Link>
          </li>
          
          <li className="nav-hover nav-item py-2">
            <Link to='/trailers'>
              <span className="nav-link">Trailer View</span>
            </Link>
          </li>

          <li className="nav-hover nav-item py-2">
            <Link to='/editor'>
              <span className="nav-link">Editor</span>
            </Link>
          </li>

          <li className="nav-hover py-2">
            <Link to={{
              pathname : '/edituser',
              state : { user : user }
            }}>
              <span className="nav-link">
                <i className="fa fa-users-cog mx-2"></i>
              </span>
            </Link>
          </li> 

          <li className="nav-item mr-3 py-2">
            <button className="btn btn-primary ml-3" onClick={this.props.logout}>Logout</button>
          </li>

        </ul>
      </div>
    )
  }
}