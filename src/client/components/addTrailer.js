import React, { Component } from 'react';

export default class AddTrailer extends Component{
  constructor(){
    super();
    this.state={
      trailerId : null,
      trailerName : null,
      isDamaged :  false,
      errorMsg : null
    }
  }
  componentDidMount(){
    if(this.props.trailer !== null){
      const {trailer} = this.props;
      this.setState({
        trailerId : trailer.TRAILER_ID,
        trailerName : trailer.TRAILER_NAME,
        isDamaged : this.props.trailer.IS_DAMAGED === 1 ? true : false
      });
    }
  }
  handleSelecetion=(e)=>{
    let value = e.target.value;
    let name = e.target.name;
    this.setState({ [name] : value, errorMsg : null });
  }
  updateCheck=()=>{
    this.setState(prevState=>({isDamaged : !prevState.isDamaged}));
  }
  handleSave=(e)=>{
    e.preventDefault();
    const {trailerName} = this.state;
    if(trailerName == null){
      this.setState({errorMsg : "Input fields cannot be blank"});
      return false;
    }else{
      const damaged = this.state.isDamaged ? 1 : 0;
      const data = {
        trailerId : this.state.trailerId,
        trailerName : this.state.trailerName,
        isDamaged : damaged
      }
      if(this.props.trailer !== null){
        this.props.sendUpdate('edit/trailer', data, 'trailer');
      }else{
        this.props.sendUpdate('add/trailer', data, 'trailer');
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
            <input type="text" className="form-control py-3" placeholder="Trailer Name" name="trailerName" value={this.state.trailerName} onChange={this.handleSelecetion}></input>
          </div>
          <div className="col d-flex align-items-center">
            <label className="form-check-label align-middle">
              <input  className="form-check-input" type="checkbox" checked={this.state.isDamaged} onClick={this.updateCheck}></input>Damaged
            </label>
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