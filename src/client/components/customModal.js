import React, { Component } from 'react';
import Modal from 'react-modal';

export default class CustomModal extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalStyles : {
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        },
        content: {
          position: 'absolute',
          top: '10%',
          maxHeight: '500px',
          maxWidth : '900px',
          marginLeft : 'auto',
          marginRight : 'auto',
          border: '1px solid #ccc',
          background: '#fff',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '4px',
          outline: 'none',
          padding: '20px'
        }
      }
    }
  }



  render(){
    return(
      <Modal 
          isOpen={this.props.showModal}
          style={this.state.modalStyles}
          contentLabel="Test Modal">

          <p className="card-title mx-5 mt-3">{this.props.modalTitle}</p>
          <hr className="mx-4"/>

          {this.props.content}

        </Modal>
    )
  }
}
