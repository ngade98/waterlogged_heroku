import React, { Component } from 'react';
import axios from 'axios';


interface Props {
  
  filepath: any;
  flood_date: any;
  pre_post: any;
  longitude: any;
  latitude: any;
  address: any;
  user_uploaded: any;
  pair_index: any;
  approved_by_admin: any;
  pair_approved_by_admin: any;
  flood_height: any;
  source: any;
  pair_attempted: any;

  }

  interface State {



  };

class App extends React.Component<Props, States>{
  constructor(props: Props) {
  super(props);
  this.state = {

    /*
    filepath: null,
    flood_date: '2020-03-19T21:33:08.636367Z',
    pre_post: false,
    longitude: 0.0,
    latitude: 0.0,
    address: 'no available address',
    user_uploaded: 1,
    pair_index: -1,
    approved_by_admin: false,
    pair_approved_by_admin: false,
    flood_height: 0.0,
    source: 'User',
    pair_attempted: false

*/ 
    };

  }
  handleSubmit = (e) => {
    e.preventDefault();
   //console.log(this.state);
    let form_data = new FormData();

    form_data.append('filepath', this.props.filepath);  
    form_data.append('flood_date', this.propsflood_date);
    form_data.append('pre_post', this.props.pre_post);
    form_data.append('longitude', this.props.longitude);
    form_data.append('latitude', this.props.latitude);
    form_data.append('address', this.props.address);
    form_data.append('user_uploaded', this.props.user_uploaded);
    form_data.append('pair_index', this.props.pair_index);
    form_data.append('approved_by_admin', this.props.approved_by_admin);
    form_data.append('pair_approved_by_admin', this.props.pair_approved_by_admin);
    form_data.append('flood_height', this.props.flood_height);
    form_data.append('source', this.props.source);
    form_data.append('pair_attempted', this.props.pair_attempted);


    let url = 'http://' + window.$backendDNS + '/api/image/';
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => console.log(err))
  };

  render() {
    return (
      <div className="App">

        <form onSubmit={this.handleSubmit}>

        </form>
        
      </div>
    );
  }
}

export default App;