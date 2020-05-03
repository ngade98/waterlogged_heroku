import React, { Component } from 'react';
import { render } from 'react-dom';

class StreetMap extends Component {
  constructor(props) {
    super(props);
    this.onScriptLoad = this.onScriptLoad.bind(this);
  }

  onScriptLoad() {
    var mapDiv = document.getElementById("myMap");
    
    var mapPos;

    if(localStorage.getItem("latitude") == null || localStorage.getItem("longitude") == null){
      mapPos = { lat: 29.68743086092769, lng: -95.4109504372631 };
    }
    else{
      mapPos = { lat: parseFloat(localStorage.getItem("latitude")), lng: parseFloat(localStorage.getItem("longitude")) };
    }
    const map = new window.google.maps.StreetViewPanorama(
      mapDiv, {
        position: mapPos,
        pov: {
          heading: 173,
          pitch: 10,
          zoom: 1.8
        },
        addressControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_BOTTOM
        },
        fullscreenControl: false
      }
    )
    //once script is loaded
    this.props.onMapLoad(map)
  }

  componentDidMount() {
    if (!window.google) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = `https://maps.google.com/maps/api/js?key=AIzaSyD7blO0Y7Z-Jf2rRFyuo2CrQa7kEXRy1po&libraries=places`;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
      // Below is important. 

      //We cannot access google.maps until it's finished loading
      s.addEventListener('load', e => {
        this.onScriptLoad()
      })
    } else {
      this.onScriptLoad()
    }
  }
  render() {
    return (
        <div  style={ {flex: 1} } id={"myMap"} />
    );
  }
}

export default StreetMap
