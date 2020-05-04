import React, { Component } from 'react';
import axios from 'axios';
import Logo from './logo-blue.png';
import { ThemeProvider } from '@material-ui/core';


const styles = {
  wrapper: { // holds ALL the contnet for the page
      display: 'flex',
      backgroundColor: '#eceff1',
      // height: '100vh',
      width: '100%',
  },

  uploadBox: {
      height: '75vh',
      width: 405,
      display: 'flex',
      justifyContent: 'center',
      alignItems: "center",
      backgroundColor: '#e0e0e0',
  },
  rightSide:{
      display: 'flex',
      height: '75vh',
      flexDirection: "column",
      justifyContent: 'center',
      alignItems: "center",
  },
  logo: {
      height: 'auto',
      width: 200,
      paddingBottom: 30,
  },
  upload: {
      display: 'flex',
      alignItems: 'center',
  },
};

interface Props {
  handleStateChange: any,
  nextBtn: any,
  }

 interface State {

    image: any,

    objectURL: any,

    Tempid: any,

    TempFilePath: any,

    TempLat: any,

    TempLon: any

  };

class App extends React.Component<Props, States>{
  constructor(props: Props) {
  super(props);
  this.state = {
          
    image: null,

    objectURL: Logo,

    Tempid: 0,

    TempFilePath: ' ', 

    TempLat: 0.0,

    TempLon: 0.0


  };

}


  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  };

  handleImageChange = (e) => {
    this.setState({
      image: e.target.files[0],
      objectURL: URL.createObjectURL(e.target.files[0])
    })


  };



  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    let form_data = new FormData();
    form_data.append('image', this.state.image, this.state.image.name);

    let url = 'http://' + window.$backendDNS + '/api/pre/';
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
        .then(res => {
          console.log(res.data);
          console.log(res.data.id);
          console.log(res.data.image);
          console.log(res.data.longitude);
          console.log(res.data.latitude);

          this.setState({
            Tempid: res.data.id,
            TempFilePath: res.data.image,
            TempLat: res.data.latitude,
            TempLon: res.data.longitude
          })

          console.log("Passing via prop");
          this.props.handleStateChange(this.state.TempFilePath, this.state.TempLat, this.state.TempLon);


        })
        .catch(err => console.log(err));
        this.props.nextBtn();



  };

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <img style={styles.logo} src={this.state.objectURL} ></img>
          <p>
            <input style={styles.upload} 
                   type="file"
                   id="image"
                   accept="image/png, image/jpeg"  onChange={ this.handleImageChange} required/>
          </p>
          <input type="submit"/>
        </form>
      </div>
    );
  }
}

export default App;
