import React from 'react';
import ReactDOM from 'react-dom';
import Markerclustererplus from '@google/markerclustererplus'
import SatMap from './SatMap'
import MapToolbar from './MapToolbar';
import MapLegend from './MapLegend';
import ImageModal from './ImageModal';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection:  "column",
        backgroundColor: '#eceff1',
        height: '100%',
        width: "100%"
    },
    loadingIcon: {
        position: "fixed",
        zIndex: 1000,
        left: "50%",
        bottom: "75px"
    },
    errorMessage: {
        position: "fixed",
        zIndex: 1000,
        left: "50%",
        bottom: "75px"
    }
};

interface Props {
    title: string;
}
interface States {
    userState: number; // 0 = game, 1 = pass, 2 = kinda, 3 = fail
            //modal states
            modal: bool;
            preImageURL: string;
            postImageURL: string;
            date: string;
            waterHeight: string;
            address: string;
            preSource: string;
            postSource: string;
            //
            pairPref: number;  // 0 for all photos, 1 for paired, 2 for unpaired
            timeMin: number; //expressed in days (time slide order: 0, 7, 31, 185, 365, 100,000)
            timeMax: number;
}

export default class MapPage extends React.Component<Props, States>{    
    constructor(props: Props) {
        
        super(props);
        
        this.state = {
            // ?
            userState: 0,
            //map stuff
            map: null,
            mapMarkers: null,
            markerCluster: null,
            //modal states
            modal: false,
            preImage: null,
            postImage: null,
            date: null,
            waterHeight: null,
            address: null,
            preSource: null,
            postSource: null,
            isPaired: null,
            pairAttempted: null,
            mapsLink: null,
            postID: null,
            latitude: null,
            longitude: null,
            postBlob: null,
            preBlob: null,
            //
            pairPref: 1,  // 1 for all photos, 2 for paired, 3 for unpaired
            timeMin: 4, // 0 = 0 Days, 1 = 7 Days, 2 = 30 Days, 3 = 185 Days, 4 = 365 Days, 5 = 100,000 Days
            timeMax: 0,    //expressed in days before current time (time slide order: 0, 7, 31, 185, 365, 100,000)
            //
            goToAddLocation: false,
            //
            filterLoading: false
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateMarkers = this.updateMarkers.bind(this);
    }

    openModal = () => {
        this.setState({
            modal: true,
        });
    }

    closeModal = () => {
        this.setState({
            modal: false,
            preImage: null,
            postImage: null,
            date: null,
            waterHeight: null,
            address: null,
            preSource: null,
            postSource: null,
            isPaired: null,
            pairAttempted: null,
            mapsLink: null,
            postID: null,
            latitude: null,
            longitude: null,
            postBlob: null,
            preBlob: null,
        });
    }

    sliderMoved = (newVals) => {
        this.setState({
            timeMax: newVals[0],
            timeMin: newVals[1]
        },() => {
            this.updateMarkers(this.state.map, this.state.mapMarkers);
        });
    }

    pairPrefChanged = (newVal) => {
        this.setState({
            pairPref: newVal
        },() => {
            this.updateMarkers(this.state.map, this.state.mapMarkers);
        });
    }

    navigateToAddLocation = () => {
        localStorage.setItem("latitude", this.state.latitude);
        localStorage.setItem("longitude", this.state.longitude);
        localStorage.setItem("date", this.state.date);
        localStorage.setItem("needStreetView", "false");
        localStorage.setItem("streetView", "false");
        localStorage.setItem("address", this.state.address);
        localStorage.setItem("PostID", this.state.postID);
        localStorage.setItem("activeStep", 1);
        localStorage.setItem("postImage", this.state.postBlob);

        this.setState({
            goToAddLocation: true,
        });
    }

    showErrorMessage = () => {
        if(this.state.showError){
            return(
                <Snackbar
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                    }}
                    open={true}
                    onClick={this.refresh}
                    message="Couldn't reach server. Click to refresh the page"
                    action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={this.refresh}>
                        <RefreshIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                    }
                />
            )
        }
        else{
            return null
        }
    }

    refresh = () => {
        this.setState({
            showError: false
        }, () => {
            this.updateMarkers(this.state.map, this.state.mapMarkers);
        })
    }



    updateMarkers = async (map, mapMarkers) => {
        //show that the filters are loading
        this.setState({
            filterLoading: true,
            showError: false
        });

        //get data for new markers           
        var mapBounds = map.getBounds(); //requests map bounds
        var maxLat = 29.871048066002892;
        var minLat = 29.651691881838385;
        var minLong = -95.54523105957031;
        var maxLong = -95.18130894042969; 
        
        if(mapBounds != undefined){ //undefined on initial load, uses default over houston. If not, gets from getBounds() request
            var neBounds = mapBounds.getNorthEast();
            var swBounds = mapBounds.getSouthWest();
           
            maxLat = neBounds.lat();
            minLat = swBounds.lat();
            minLong = swBounds.lng();
            maxLong = neBounds.lng();    
        }
        
        //Date Math:
        const dateObject = new Date();
        const curUnixTime = dateObject.getTime();

        var millisecondsForMax, millisecondsForMin; // the number of milliseconds to subtract from the current unix time to get the min and max date

        if(this.state.timeMin == 0) { //today (subtracting one day for the min and 0 days for the max)
            millisecondsForMin = 86400000; 
        }
        else if(this.state.timeMin == 1) { //7 days ago
            millisecondsForMin = 604800000;
        }
        else if(this.state.timeMin == 2) { //31 days ago
            millisecondsForMin = 2678400000;
        }
        else if(this.state.timeMin == 3) { //182 days ago
            millisecondsForMin = 15724800000;
        }
        else if(this.state.timeMin == 4) { //365 days ago
            millisecondsForMin = 31536000000;
        }
        else if(this.state.timeMin == 5){//36500 days ago (about 100 years)
            millisecondsForMin = 3153600000000;
        }
        else {                              //there was an error, defaulting to min time as 100 years ago
            millisecondsForMin = 3153600000000;
        }

        if(this.state.timeMax == 0) { //today (subtracting one day for the min and 0 days for the max)
            millisecondsForMax = 0; 
        }
        else if(this.state.timeMax == 1) { //7 days ago
            millisecondsForMax = 604800000;
        }
        else if(this.state.timeMax == 2) { //31 days ago
            millisecondsForMax = 2678400000;
        }
        else if(this.state.timeMax == 3) { //182 days ago
            millisecondsForMax = 15724800000;
        }
        else if(this.state.timeMax == 4) { //365 days ago
            millisecondsForMax = 31536000000;
        }
        else if(this.state.timeMax == 5){//365 days ago
            millisecondsForMax = 31536000000;
        }
        else {                              //there was an error, defaulting to max time as today
            millisecondsForMax = 0;
        }

        var minTimeConv = new Date(curUnixTime - millisecondsForMin);
        var maxTimeConv = new Date(curUnixTime - millisecondsForMax);

        var minLeadingZero = "";
        if(minTimeConv.getMonth() + 1 < 10){
            minLeadingZero = "0";
        }
        var maxLeadingZero = "";
        if(maxTimeConv.getMonth() + 1 < 10){
            maxLeadingZero = "0";
        }

        var minDate = String(minTimeConv.getFullYear()) + "-" + minLeadingZero + String(minTimeConv.getMonth() + 1) + "-" + String(minTimeConv.getDate()) + "T00:00:00Z";
        var maxDate = String(maxTimeConv.getFullYear()) + "-" + maxLeadingZero + String(maxTimeConv.getMonth() + 1) + "-" + String(maxTimeConv.getDate()) + "T23:59:59Z";

        //interprets the drop down menu value into a string for the query 
        var pairStatus = null;
        if(this.state.pairPref == 3){
            pairStatus = "unpaired";
        }
        else if(this.state.pairPref == 2){
            pairStatus = "paired";
        }
        else{
            pairStatus = "all photos";
        } 

        //construct query object from map position and filter settings
        const queryJSON = {
            data: {
                MinLat: minLat,
                MaxLat: maxLat,
                MinLong: minLong,
                MaxLong: maxLong,
                MinDate: minDate,
                MaxDate: maxDate,
                PairingStatus: pairStatus
            }
        }

        //run query on database to get array of locations and file paths
        console.log("Query Object:\n",queryJSON);
        try {
            var markerDataArray = await axios.post('http://' + window.$backendDNS + '/api/datasearch/', queryJSON);
        }
        catch(err){
            console.log(err);
            console.log("Couldn't reach server. Please refresh the page");
            this.setState({
                filterLoading: false,
                showError: true
            });
            return;
        };
        console.log("Query Return:\n", markerDataArray);

        //clear all markers
        for(var i = 0; i < mapMarkers.length; i++){
            mapMarkers[i].setMap(null)
        }
        this.setState({
            mapMarkers: [],
            markerCluster: null,
            filterLoading: true,
            showError: false
        });


        //make markers for each flood image
        for(var markerIndex = 0; markerIndex < markerDataArray.data.length; markerIndex++){
            
            const newMarkerData = markerDataArray.data[markerIndex] //get the data for this marker

            //create marker color based on paired/unpaired
            var iconURL; 
            if(newMarkerData.isPaired == "True"){
                iconURL = require('./blueIcon.png');
            }
            else {
                iconURL = require('./yellowIcon.png');
            }

            //create marker attributes
            const newMarker = new window.google.maps.Marker({
                position: newMarkerData.position, //marker position from DB
                map: map,
                icon: {
                    url: iconURL
                }
            });

            //executes when a marker is clicked
            newMarker.addListener('click', (function() {
                this.openModal(); //opens the modal
                this.setState({ //sets modal's inputs to the map states
                    loading: true, //starts the loading animation
                    waterHeight: "n/a", //HARDCODE
                    address: newMarkerData.address,
                    preSource: newMarkerData.preSource,
                    postSource: newMarkerData.postSource,
                    isPaired: newMarkerData.isPaired,
                    pairAttempted: newMarkerData.pairAttempted,
                    mapsLink: newMarkerData.map_url,
                    date: newMarkerData.floodDate,
                    postID: newMarkerData.postID,
                    latitude: newMarkerData.position.lat,
                    longitude: newMarkerData.position.lng,
                    postBlob: newMarkerData.post_blob_name,
                    preBlob: newMarkerData.pre_blob_name
                }, () => {
                    axios.post('http://' + window.$backendDNS + '/api/receive/', {blob_name: newMarkerData.post_blob_name}) //go get the post flood image
                    .then((post) => {
                        axios.post('http://' + window.$backendDNS + '/api/receive/', {blob_name: newMarkerData.pre_blob_name}) //go get the pre flood image
                        .then((pre) => {
                            this.setState({
                                preImage: pre.data, //sets image data to map states
                                postImage: post.data, 
                                loading: false, //stop the loading animation
                            });
                        });
                    });
                });
            }).bind(this));



            //add marker to set of markers
            mapMarkers.push(newMarker);
        }
        //update the states of maps/markers
        this.setState({
            map: map,
            mapMarkers: mapMarkers,
            filterLoading: false
        });
    };

    mapFunction(map) {
        //array to hold markers
        var mapMarkers = [];

        var searchMarker = new window.google.maps.Marker({
            map: map,
          });
        searchMarker.setVisible(false);
                      
        map.addListener('dragend', (function() { 
            this.updateMarkers(this.state.map, this.state.mapMarkers); 
        }).bind(this));

        map.addListener('zoom_changed', (function() { 
            this.updateMarkers(this.state.map, this.state.mapMarkers); 
        }).bind(this));
        
        //function executes when zoom changes
        map.addListener('zoom_changed', function() {
           if(map.getZoom() > 16){
               map.setMapTypeId('hybrid');
           }
           else {
               map.setMapTypeId('roadmap');
           }
        });
        
        //load markers on initial map load
        this.updateMarkers(map, mapMarkers);

        //append legend to the map
        //create dummy container to render into
        var legendContainer = document.createElement('div');
        legendContainer.id = "legendRenderContainer";
        document.getElementById("root").appendChild(legendContainer);
        map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById("legendRenderContainer"));

        //render the legend into the dummy container we pushed to controls
        ReactDOM.render(<MapLegend/>,document.getElementById("legendRenderContainer"));

        var searchBox = new window.google.maps.places.Autocomplete(document.getElementById('satSearch')); //makes search element a places autocomplete object
        searchBox.setFields(["geometry"]); //only returns geometry field with address data

        //fires when a user selects an autocomplete option
        searchBox.addListener('place_changed', function() {
            var place = searchBox.getPlace();
            //gets selection
            if(place.geometry && place.geometry.location){
                searchMarker.setPosition(place.geometry.location);  //sets marker at location
                searchMarker.setVisible(true);                      //shows marker
                map.setCenter(place.geometry.location);             //sets map center on location             
                map.setZoom(14); 
            }
        });

        this.setState({
            map: map,
            mapMarkers: mapMarkers
        });
    }


    loadingIcon = () => {
        if(this.state.filterLoading){
            return <CircularProgress style={styles.loadingIcon} />
        }
        else{
            return null;
        }
    }

    render(){
        if(this.state.goToAddLocation){
            return(
                <Redirect 
                    push  
                    to={{
                        pathname: "/Home"
                    }}
                />
            )
        }
        else{
            return (
                <div style={styles.wrapper}>
                    <MapToolbar
                        onPairPrefChanged = {this.pairPrefChanged}
                        onSliderMoved = {this.sliderMoved}
                    />
                    <SatMap
                        id="myMap"
                        options={{
                            center: { 
                                lat: 29.76143, 
                                lng: -95.36327 
                            },
                            zoom: 12,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            gestureHandling: "greedy",
                            minZoom: 4,
                            mapTypeId : "roadmap",
                            styles: [{
                                "featureType": "poi",
                                "stylers": [{
                                    "visibility": "off"
                                }]
                            }]
                        }}
                        onMapLoad={
                            map => this.mapFunction(map)
                        }
                    />
                    <ImageModal 
                        show = {this.state.modal}
                        onClose = {this.closeModal}
                        postImage = {this.state.postImage}
                        preImage = {this.state.preImage}
                        date = {this.state.date}
                        address = {this.state.address}
                        height = {this.state.waterHeight}
                        preSource = {this.state.preSource}
                        postSource = {this.state.postSource}
                        isPaired = {this.state.isPaired}
                        pairAttempted = {this.state.pairAttempted}
                        mapsLink = {this.state.mapsLink}
                        onAddingLocation = {this.navigateToAddLocation}
                        loading = {this.state.loading}
                    />
                    {this.loadingIcon()}
                    {this.showErrorMessage()}
                </div>
            );
        }
    }
}