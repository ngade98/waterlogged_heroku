import React from 'react';
import ReactDOM from 'react-dom';
import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import StreetMap from './StreetMap';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import SearchBar from './SearchBar';
import {compress, decompress} from 'lz-string';

import axios from 'axios';

const styles = {
    content: { // Holds the content to the right of the menu bar (Desktop)
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        paddingTop: 30,
    },
    mobileContent: { // Holds the content above the Nav (mobile)
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        alignItems: 'center',
        // width: '100%',
        height: '98%',
        padding: 20,
        paddingTop: 10,
        paddingBottom: 0,
    },
    leftContent: { // Desktop holds the map Instance
        display: 'flex',
        // justifyContent: 'center',
        flexDirection: 'column',
        width: '45%',
        marginLeft:'2%',
        height: '80vh',
        // padding: '2%',
        // paddingRight: '1%',
        // paddingLeft: '2%',
    },
    rightContent: { // Desktop holds the buttons and such
        display: 'flex',
        width: '43%',
        flexDirection: 'column',
        alignItems: 'center',
        paddingRight: '2%',
    },
    mapContainer: { // Holds the Map Instance and sets spacing
        display: 'flex',
        width: '100%',
        height: '100%',
        marginBottom: '2%',
        // borderLeft: '5px solid #303f9f',
        // borderRight: '5px solid #303f9f',
        // borderRadius: '0 0 0 0'
    },
    mobileMapContainer: { // Holds the Map Instance and sets spacing (Mobile)
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '50vh',
        marginBottom: '2%',
    },
    screenshot: { // Holds the Map Instance and sets spacing (Mobile)
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        objectFit: 'contain',
        height: '50vh',
        marginBottom: '2%',
    },
    picturePreview: { // Container for the post-image (Desktop)
        // minHeight: '90%',
        // maxHeight: '90%',
        display: 'flex',
        margin: 'auto',
        marginBottom: 20,
        marginTop: 0,
        overflow: 'hidden',
        // width: "100%",
        // paddingTop: "calc( (4 / 3) * 100%)",
        maxHeight: '50%',
        minHeight: '50%',
        maxWidth: '100%',
    },
    floodImage: { // Actual Image Formatting
        display: 'block',
        minHeight: 200,
        maxHeight: 300,
        objectFit: 'cover',
        width: 'auto',
    },
    button: {
        width: 120,
    },
    img: { 
        maxHeight: "100%",
        maxWidth: "100%",
    },
};

const theme = createMuiTheme({
  overrides: {
      // overrides here
  },
});

interface Props {
    nextBtn: any,
    backBtn: any,
    imagePath: any,
    imageid: number,
    imageLat: any,
    imageLon: any,
    postFloodImg: any, // The post flood image
    preFloodDataTransfer: any, 
}
interface States {
    userState: number,
    screenshotTaken: boolean,
    viewPostImage: boolean,
    FullImagePath: any,
    JsonData: any,
}

export default class AddLocation extends React.Component<{}, States>{
    constructor(props: Props) {
		super(props);
        this.state  = {
            map: null,
            geocoder: null,
            input: null,
            currentStreetViewData: null,
            currentStreetViewPanoURL: null, //
            screenshotTaken: false,
            viewPostImage: false,
            postImage: ""
        };
        this.getPostImage()
    }



    mapFunction(map) { //this runs on map load (which is each time the page is loaded or the map is shown after being hid)

        //create a dummy container to render the search bar into
        var legendContainer = document.createElement('div');
        legendContainer.id = "searchContainer";
        //attach the search bar to the html doc
        document.getElementById("root").appendChild(legendContainer);
        //push the dummy container into the maps controls
        map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(document.getElementById("searchContainer"));
        
        //render the legend into the dummy container we pushed to controls
        ReactDOM.render(<SearchBar/>,document.getElementById("searchContainer"), () => { //below executes once render is done

            ///make the search box an autocomplete box w google
            var searchBox = new window.google.maps.places.Autocomplete(document.getElementById('satSearch'));
            //create a geocoder object for other functions
            var geocoder = new window.google.maps.Geocoder;
        
            //add event listener for search place change
            searchBox.addListener('place_changed', function(){
                var returnInfo = searchBox.getPlace(); //
        
                if(returnInfo == undefined || 
                    returnInfo.geometry == undefined || 
                    returnInfo.geometry.viewport == undefined || 
                    returnInfo.geometry.viewport.Ya == undefined || 
                    returnInfo.geometry.viewport.Ua == undefined ||
                    returnInfo.geometry.viewport.Ya.i == undefined || 
                    returnInfo.geometry.viewport.Ya.j == undefined ||
                    returnInfo.geometry.viewport.Ua.i == undefined || 
                    returnInfo.geometry.viewport.Ua.j == undefined 
                ){ 
                    return; 
                } //if there is no info, don't change the location (prevents error)
        
                //sum the viewport lat/longs
                var sumLat = parseFloat(returnInfo.geometry.viewport.Ya.i) + parseFloat(returnInfo.geometry.viewport.Ya.j);
                var sumLng = parseFloat(returnInfo.geometry.viewport.Ua.i) + parseFloat(returnInfo.geometry.viewport.Ua.j);
                //find the average of the lat/longs (had to break this operation up for some reason)
                var avgLat = sumLat/2;
                var avgLng = sumLng/2;
        
                var searchPosition = {lat: avgLat, lng: avgLng} //create an array for the position of the streetview searched for
        
                map.setPosition(searchPosition); //set the streetview location
            });
        
            //save the map and geocoder to states for use by otherfunctions
            this.setState({
                map: map,
                geocoder: geocoder
            });
        });

       
    }

    getPostImage = () => {
        //go get the post image
        axios.post('http://' + window.$backendDNS + '/api/receive/', {blob_name: localStorage.getItem("postImage")})
        .then((response) => {
            this.setState({
                postImage: response.data
            });
        });
    }

    captureStreetView = () => {

        const latlng = this.state.map.getPosition().toJSON();
        const pov = this.state.map.getPov();

        var fov = 180 / Math.pow(2,pov.zoom) 
        
        const streetViewData = {
            lat: latlng.lat,
            lng: latlng.lng,
            heading: pov.heading,
            pitch: pov.pitch,
            fov: fov
        };
       
        var panoURL = "https://maps.googleapis.com/maps/api/streetview?"+ "size=520x795" + "&location=" + streetViewData.lat + "," + streetViewData.lng + "&heading=" + streetViewData.heading + "&pitch=" + streetViewData.pitch + "&fov=" + streetViewData.fov + "&key=AIzaSyD7blO0Y7Z-Jf2rRFyuo2CrQa7kEXRy1po";
        var linkURL = "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + streetViewData.lat + "," + streetViewData.lng + "&heading=" + streetViewData.heading + "&pitch=" + streetViewData.pitch + "&fov=" + streetViewData.fov;

        this.state.geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    localStorage.setItem("address", results[0].formatted_address);
                }
                else {
                    localStorage.setItem("address", "Coordinates: " + latlng.lat + ", " + latlng.lng);
                }
            }
            else {
                localStorage.setItem("address", "Coordinates: " + latlng.lat + ", " + latlng.lng);
            }
        });


        localStorage.setItem("streetViewData", JSON.stringify(streetViewData));
        localStorage.setItem("latitude", latlng.lat);
        localStorage.setItem("longitude", latlng.lng);
        localStorage.setItem("streetViewPano", panoURL);
        
        this.setState({
            screenshotTaken: true,
            currentStreetViewPanoURL: panoURL,
        });
    }

    // View Post-Image Dialog - Mobile Only 
    viewPostImage = () => {
        this.setState({
            viewPostImage: true,
        });
    }

    // Handles View Image Modal Close - Mobile Only
    closePostImage = () => {
        this.setState({
            viewPostImage: false,
        });
    }

    // Retry onclick 
    retryScreenshot = () => {
        this.setState({
            screenshotTaken: false,
        });
    }

    handleNext = () => {
        localStorage.setItem("streetView", true);
        this.props.nextBtn();
    }

    handleBack = () => {
        if(localStorage.getItem("needStreetView") == "true"){
            this.props.skipBackBtn();
        }
        else{
            this.props.backBtn();
        }
    }


    render(){
        const isMobile = window.innerWidth < 1000;
        if (isMobile) {
            return(
                <div style={styles.mobileContent}>

                        {this.state.screenshotTaken ? 
                            <div style={styles.screenshot} id={"mapContainer"}>
                                <img src = {this.state.currentStreetViewPanoURL} style={styles.img} />
                            </div>
                            :
                            <div style={styles.mobileMapContainer} id={"mapContainer"}>
                                <StreetMap
                                    onMapLoad={
                                        map => this.mapFunction(map)
                                    }
                                />
                            </div>
                        }

                        <Mui.Typography variant="subtitle2">
                            Find the Stop Sign, and take a screenshot.
                        </Mui.Typography>
                           
                        {this.state.screenshotTaken ?       
                            <Mui.Button
                                variant="contained"
                                // color="secondary"
                                size='large'
                                style={{width: 200}}
                                onClick={this.retryScreenshot}
                            >
                                Retry
                            </Mui.Button>
                        : 
                        <Mui.Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{width: 200}}
                            onClick={this.captureStreetView}
                            startIcon={<PhotoCameraIcon/>}
                        >
                            Screenshot Map
                        </Mui.Button>
                        }

                        <Mui.Button
                             variant="contained"
                             color="primary"
                             style={{width: 200}}
                             disabled={localStorage.getItem("needStreetView") == "true" && this.state.screenshotTaken == false}
                             onClick={this.props.nextBtn}
                        >
                            {this.state.screenshotTaken ? "Next" : "Skip step" }
                        </Mui.Button>

                        <Mui.Button
                             // variant="contained"
                             style={{width: 200}}
                             onClick={this.viewPostImage}
                            //  startIcon={<PhotoCameraIcon/>}
                        >
                            View Uploaded Image
                        </Mui.Button>

                        <Mui.Button
                             style={{width: 200}}
                             onClick={this.props.backBtn}
                        >
                            Back
                        </Mui.Button>

                        {/* View Post Image Modal */}
                        <Mui.Modal
                            open={this.state.viewPostImage}
                            onClose={this.closePostImage}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',}}
                        >
                            <Mui.Card style={{width: 300}}>
                                <Mui.CardMedia
                                    component="img"
                                    image={this.state.postImage}
                                    style={{height: 'auto', width: 300}}
                                />
                            </Mui.Card>
                        </Mui.Modal>
                </div>

            );
        } else {
        return (
                <div style={styles.content}>
                    <div style={styles.leftContent} id={"leftContent"}>
                        {this.state.screenshotTaken ? 
                            <div style={styles.mapContainer} id={"mapContainer"}>
                                <img src = {this.state.currentStreetViewPanoURL}/>
                            </div>
                            :
                            <div style={styles.mapContainer} id={"mapContainer"}>
                                
                                <StreetMap
                                    onMapLoad= {
                                        map => this.mapFunction(map)
                                    }
                                />
                            </div>
                        }
                        <Mui.Tooltip
                            title={"Take screenshot here!"}
                            placement="right"
                            open={!this.state.screenshotTaken}
                            arrow
                        >

                        {this.state.screenshotTaken ?       
                            <Mui.Button
                                variant="contained"
                                // color="secondary"
                                size='large'
                                fullWidth
                                onClick={this.retryScreenshot}
                            >
                                Retry
                            </Mui.Button>
                        : 
                            <Mui.Button
                                hidden={this.screenshotTaken}
                                variant="contained"
                                color="primary"
                                size='large'
                                fullWidth
                                onClick={this.captureStreetView}

                            >
                                Capture Image
                            </Mui.Button>
                        }
                        
                        </Mui.Tooltip>
                    </div>

                    <div style={styles.rightContent}>
                        <Mui.Paper elevation={3}>
                            <img
                                src = {this.state.postImage}
                                style ={styles.floodImage}
                            />
                        </Mui.Paper>

                        <Mui.Typography
                            variant="subtitle2"
                            style={{fontSize: '1rem', paddingBottom: 20, paddingLeft: 10, paddingRight: 10, textAlign: "center"}}
                        >
                            Find the stop sign in your uploaded image. Use the 'Capture Image' button once you find it.
                        </Mui.Typography>

                        <Mui.Tooltip
                            title={!this.state.screenshotTaken ? "Take screenshot first" : ""}
                            placement="top"
                        >
                        <span>
                        <Mui.Button
                            variant="contained"
                            color="primary"
                            size='medium'
                            style={styles.button}
                            disabled={localStorage.getItem("needStreetView") == "true" && this.state.screenshotTaken == false}
                            onClick={this.handleNext}
                        >
                            {this.state.screenshotTaken ? "Next" : "Skip step" }
                        </Mui.Button>
                        </span>
                        </Mui.Tooltip>
                        <div style={{padding: 5}}/>
                        <Mui.Button
                             variant="contained"
                             size='medium'
                             style={styles.button}
                             onClick={this.handleBack}
                        >
                            Back
                        </Mui.Button>
                  </div>
                </div>
        );
    }
    }
}