import React from 'react';
import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage'
import EXIF from 'exif-js';
import axios from 'axios';

const styles = {
    wrapper: { // holds ALL the contnet for the page
        display: 'flex',
        backgroundColor: '#eceff1',
        width: '100%',
    },
    content: { // Holds the content to the right of the menu bar
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'space-evenly',
        paddingTop: 30,
        paddingLeft: 50,
        paddingRight: 50,
        width: '100%',
    },
    mobileContent: { // Holds the content above the menu bar
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingLeft: 30,
        paddingRight: 30,
        width: '100%',
    },
};

const theme = createMuiTheme({
  overrides: {
      // overrides here
  },
});

interface Props {
    title: string;
    PassfromHometoLocation: any;
    nextBtn: any; // For both Home and PrePhotoOptions Page
    skipNextBtn: any; // For the PrePhotoOptions Page
}

interface States {
    userState: number;
    imageUploaded: bool;
    imagePath: string;
    imageid: number;
    imageLat: any;
    imageLon: any;
    crop: any,
    zoom: number,
    aspect: number,
    rotation: number,
    croppedAreaPixels: number,
    imageUploaded: boolean,
    imageCropped: boolean,
    cropCompressed: boolean,
    preCropImage: any,
    postCropImage: any,
    nextStep: bool; // User has uploaded a post flood AND pressed next
}

export default class Home extends React.Component<{}, States>{
    constructor(props: Props) {
		super(props);
        
        if(localStorage.getItem("postImage")){
            this.state = {
                crop: { x: 0, y: 0 },
                zoom: 1,
                aspect: 4 / 6,
                rotation: 0,
                croppedAreaPixels: null,
                imageUploaded: true,
                imageCropped: true,
                preCropImage: "",
                postCropImage: ""
            };
            this.getPostImage();
        }
        else{
            this.state = {
                crop: { x: 0, y: 0 },
                zoom: 1,
                aspect: 4 / 6,
                rotation: 0,
                croppedAreaPixels: null,
                imageUploaded: false,
                imageCropped: false,
                preCropImage: "",
                postCropImage: ""
            };
            localStorage.removeItem("latitude");
            localStorage.removeItem("longitude");
            localStorage.removeItem("date");
            localStorage.removeItem("needStreetView");
            localStorage.removeItem("streetView");
            localStorage.removeItem("address");
            localStorage.removeItem("PostID");
        }
	}

    getPostImage = () => {
        //go get the post image
        axios.post('http://' + window.$backendDNS + '/api/receive/', {blob_name: localStorage.getItem("postImage")})
        .then((response) => {
            console.log(response)
            this.setState({
                postCropImage: response.data,
                imageCropped: true
            });
        });
    };

    onCropChange = crop => {
        this.setState({
            crop: crop 
        })
    }
   
    onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({
            croppedAreaPixels: croppedAreaPixels
        })
    }
   
    onZoomChange = zoom => {
        this.setState({
            zoom: zoom
        })
    }

    onRotationChange = (event, value) => {
        this.setState({
            rotation: value
        })
    }

    showCroppedImage = async () => {
        //use the cropper tool to return the cropped image
        const newCroppedImage = await getCroppedImg(
            this.state.preCropImage,
            this.state.croppedAreaPixels,
            this.state.rotation
        );
        this.setState({
            postCropImage: newCroppedImage,
            imageCropped: true
        });
    }

    onFileChange = async (e) => {
        //if uploaded file exists
        if (e.target.files && e.target.files.length > 0) {
            //clear local storage
           this.clearImage();

            //get image data from the file
            const file = e.target.files[0]
            let imageDataUrl = await this.readFile(file);

            //set the state to show that image has been uploaded, image has not been cropped, and rotation bar is at 0
            this.setState({
                preCropImage: imageDataUrl,
                postCropImage: "",
                imageUploaded: true,
                rotation: 0,
                imageCropped: false,
            });
            
            //get metadata
            var latArray, latRef, lonArray, lonRef, date ; 

            EXIF.getData(file, function() {
                latArray = EXIF.getTag(this, "GPSLatitude");
                latRef = EXIF.getTag(this, "GPSLatitudeRef");
                lonArray = EXIF.getTag(this, "GPSLongitude");
                lonRef = EXIF.getTag(this, "GPSLongitudeRef");
                date = EXIF.getTag(this, "DateTimeOriginal");
    
                if((latArray == null) || (latRef == null) || (lonArray == null) || (lonRef == null)){
                }
                else {
                    //get lat/long signs
                    var latSign, lonSign;
                    if(latRef.slice(-1) == "N"){
                        latSign = 1;
                    }
                    else {
                        latSign = -1;
                    }
                    if(lonRef.slice(-1) == "E"){
                        lonSign = 1;
                    }
                    else {
                        lonSign = -1;
                    }

                    //compute latitude and longitude
                    var latitude = latSign * (latArray[0] + latArray[1]/60 + latArray[2]/3600);
                    var longitude = lonSign * (lonArray[0] + lonArray[1]/60 + lonArray[2]/3600);

                    //store the location
                    localStorage.setItem("latitude", latitude);
                    localStorage.setItem("longitude", longitude);
                }
        
                if(!(date == null)){
                    //if there's a date, store it
                    localStorage.setItem("date", date);
                } 
            });
        }
      }

    readFile = (file) => {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }

    //deletes the image to upload a new one
    clearImage = () => {
        localStorage.removeItem("latitude");
        localStorage.removeItem("longitude");
        localStorage.removeItem("date");
        localStorage.removeItem("needStreetView");
        localStorage.removeItem("streetView");
        localStorage.removeItem("streetViewData");
        localStorage.removeItem("streetViewPano");
        localStorage.removeItem("postImage");
        localStorage.removeItem("preImage");
        localStorage.removeItem("address");
        localStorage.removeItem("PostID");
        //reset states
        this.setState({
            preCropImage: "",
            postCropImage: "",
            imageUploaded: false,
            rotation: 0,
            imageCropped: false,
        });
    }

    submit = () => {

        //if the image was previously submitted
        if(localStorage.getItem("postImage")){
            if(localStorage.getItem("needStreetView") == "true"){
                this.props.skipNextBtn();
                return
            }
            else {
                this.props.nextBtn();
                return
            }
        }

        var dataToSend = {
            file: this.state.postCropImage, //base64 format
            blob_name: (new Date().getTime() + Math.floor((Math.random() * 100) + 1)).toString() //random number w date for unique naming
        }

        axios.post('http://' + window.$backendDNS + '/api/send/', dataToSend)
        .then((response) => {
            localStorage.setItem("postImage", response.data.blob_name);

            if((localStorage.getItem("latitude") == null) || (localStorage.getItem("longitude") == null)){
                localStorage.setItem("streetView", true);
                localStorage.setItem("needStreetView", true);
                this.props.skipNextBtn();
                return
            }
            else {
                localStorage.setItem("needStreetView", false);
                fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + localStorage.getItem("latitude") + "," + localStorage.getItem("longitude") + "&key=" + "AIzaSyD7blO0Y7Z-Jf2rRFyuo2CrQa7kEXRy1po")
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result.results[0]){
                            if(result.results[0].formatted_address){
                                localStorage.setItem("address", result.results[0].formatted_address);
                                this.props.nextBtn();
                                return
                            }
                            else {
                                localStorage.setItem("address", "Coordinates: " + localStorage.getItem("latitude") + ", " + localStorage.getItem("longitude"));
                                this.props.nextBtn();
                                return
                            }
                        }
                        else {
                            localStorage.setItem("address", "Coordinates: " +localStorage.getItem("latitude") + ", " + localStorage.getItem("longitude"));
                            this.props.nextBtn();
                            return
                        }
                    },
                    (error) => {
                        //log here?
                        localStorage.setItem("address", "Coordinates: " + localStorage.getItem("latitude") + ", " + localStorage.getItem("longitude"));
                        this.props.nextBtn();
                        return
                    }
                );
            }
        })
    }


    cropper() { 
        const smallScreen = window.innerWidth < 420;
        return (
            <div style= {{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {this.state.imageUploaded ?
                    <div style={smallScreen? {width: 300, height: 300, position: "relative"} : {width: 400, height: 300, position: "relative"}}> 
                        <Cropper
                            image={this.state.preCropImage}
                            crop={this.state.crop}
                            zoom={this.state.zoom}
                            aspect={this.state.aspect}
                            rotation={this.state.rotation}
                            onRotationChange={this.onRotationChange}
                            onCropChange={this.onCropChange}
                            onCropComplete={this.onCropComplete}
                            onZoomChange={this.onZoomChange}
                        />
                    </div>
                :
                <Mui.Paper style={{color: "#e0e0e0", width: 400, height: 300 }} />
            }

                <Mui.Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing= {2}
                >

                    {/* Clear Button  */}
                    <Mui.Grid item>

                    
                        <Mui.IconButton
                            onClick={this.clearImage}
                            // variant="contained"
                            // color="primary"
                            disabled={!this.state.imageUploaded}
                        >
                            <DeleteForeverIcon />
                        </Mui.IconButton>
                    </Mui.Grid>
                    
                    <Mui.Grid item> 
                        <Mui.Typography>
                            Rotate
                        </Mui.Typography>
                        </Mui.Grid>
                        <Mui.Grid item> 
                        <Mui.Slider
                            value={this.state.rotation}
                            min={0}
                            max={360}
                            step={1}
                            aria-labelledby="Rotation"
                            onChange={this.onRotationChange}
                            style={{width: 180}}
                        />
                    </Mui.Grid>

                    <Mui.Grid item>
                    <Mui.Button
                        onClick={this.showCroppedImage}
                        variant="contained"
                        color="primary"
                        disabled={!this.state.imageUploaded}
                        style={smallScreen? {width: 300} : {}}
                    >
                        Crop
                    </Mui.Button>
                    </Mui.Grid>
                </Mui.Grid>
            </div>
        );
    }

    imagePreview() { 
        const smallScreen = window.innerWidth < 420;
        const isMobile = window.innerWidth < 1000;
        return (
            <div style= {{display: "flex", flexDirection: "column"}}>
                {this.state.imageCropped ?
                    <img src ={this.state.postCropImage} style = {smallScreen? {width: 240, height: 360} : {width: 280, height: 420}}></img>
                :
                    <Mui.Paper style={{backgroundColor: "#e0e0e0", width: 240, height: 360, display: 'flex', alignItems: 'center'}}> 
                        <Mui.Box textAlign="center">
                        <Mui.Typography align={'center'}> 
                            Line up the stop sign so it is fully in view and press <span style={{fontWeight: 900}}>crop</span>! 
                        </Mui.Typography>
                        </Mui.Box>
                    </Mui.Paper>
                }
                {isMobile ? 
                    <div style= {{display: "flex", flexDirection: "column"}}> 
                    <Mui.Button
                        variant="contained"
                        color="primary"
                        onClick={this.submit}
                        disabled={!this.state.imageCropped}
                    >
                        Submit
                    </Mui.Button>
                    <Mui.Button
                        // variant="contained"
                        // color="primary"
                        onClick={this.clearImage}
                        // disabled={!this.state.imageCropped}
                    >
                        Redo
                    </Mui.Button>
                    </div> 
                :
                    <Mui.Button
                        variant="contained"
                        color="primary"
                        onClick={this.submit}
                        disabled={!this.state.imageCropped}
                    >
                        Submit
                    </Mui.Button>
                }
                
            </div>
        );
    }

    uploadBlock() { 
        return (
            <Mui.Paper elevation={0} style={{display: "flex", width: '100%', padding: 30, backgroundColor: '#eceff1', justifyContent: 'center'}}>
                {/* Upload Button? */}
                <input
                    accept="image/*"
                    type="file"
                    id="contained-button-file"
                    onChange={this.onFileChange}
                    onClick={(event)=> { 
                        event.target.value = null
                }}
                    style={{display: "none"}}
                />
                <label htmlFor="contained-button-file">
                    <Mui.Button variant="contained" color="primary" component="span" elevation={0}>
                        Upload Image
                    </Mui.Button>
                </label>

            </Mui.Paper> 
        );
    }

// Returns any content for the page
    content() {
            const isMobile = window.innerWidth < 1000;
            if (isMobile) {
                return (
                    <div style={styles.mobileContent}>
                         <Mui.Typography variant="subtitle2" style={{fontSize: '1.05rem', paddingBottom: 15, textAlign: "center"}}>
                            Upload an image of a stop sign in a flooded area!
                            <br />
                            Make sure the stop sign and water line are visable.
                        </Mui.Typography>
                        { this.state.imageUploaded ?
                            // Cropper and Upload Preview 
                            <div style= {{display: "flex", flexDirection: "row", justifyContent: 'space-evenly'}}>
                                {this.state.imageCropped? 
                                    <div>
                                        {this.imagePreview()}
                                    </div>
                                    :
                                    <div>
                                        {this.cropper()}
                                    </div>
                                }
                            </div>  
                            :
                            // Upload Button 
                            <div style= {{display: "flex", flexDirection: "row"}}>
                                {this.uploadBlock()}
                            </div>    
                        }
                    </div>
                );
            }
            else {
                return(
                    <div style={styles.content}>
                         <Mui.Typography variant="subtitle2" style={{fontSize: '1.05rem', paddingBottom: 15, textAlign: "center"}}>
                            Upload an image of a stop sign in a flooded area!
                            <br />
                            Make sure the stop sign and water line are visable.
                        </Mui.Typography>

                        { this.state.imageUploaded ?
                            <div style= {{display: "flex", flexDirection: "row", justifyContent: 'space-evenly'}}>
                                {this.cropper()}
                                {this.imagePreview()}
                            </div>    
                            :
                            <div style= {{display: "flex", flexDirection: "row"}}>
                                {this.uploadBlock()}
                            </div>    
                        }
                        
                    </div>
                );            
          }
    }


// Renders the Whole Page
    render(){
        return(
              <div style={styles.wrapper}>
                    {this.content()}
              </div>
        )
    }
}
