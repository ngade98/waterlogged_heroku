import React from 'react';
import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage'

import axios from 'axios';



export default class App extends React.Component {
    constructor(props: Props) {
		super(props);
        this.state = {
            image: "",
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 4 / 6,
            rotation: 0,
            croppedAreaPixels: null,
            croppedImage: null,
            imageUploaded: false,
            imageCropped: false,
            croppedBlob: null,
            Tempid: 0,
            TempFilePath:"" 
        }
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
        const newCroppedImage = await getCroppedImg(
            this.state.image,
            this.state.croppedAreaPixels,
            this.state.rotation
        )
        this.setState({
            croppedImage: newCroppedImage,
            imageCropped: true
        });
    }

    onFileChange = async e => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            let imageDataUrl = await this.readFile(file)
            this.setState({
                imageUploaded: true,
                rotation: 0,
                imageCropped: false,
                image: imageDataUrl
            })
        }
      }

    readFile = (file) => {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }


    dataURItoBlob = (dataURI) => {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
    
        return new Blob([ia], {type:mimeString});
    }

    submitImage = (event) => {
        console.log(this.state);
        localStorage.setItem("croppedImage", this.state.croppedImage);
        this.setState({
            croppedImage: this.state.image
        });
        
        this.setState({
            croppedImage: localStorage.getItem("croppedImage")
        });
        /*
        event.preventDefault();

        let form_data = new FormData();

        var blob = this.dataURItoBlob(this.state.croppedImage);
        form_data.append('image', blob, "aha.jpeg");

        let url = 'http://' + window.$backendDNS + '/api/temp/';

        axios.post(url, form_data, { 
            headers: {'content-type': 'multipart/form-data'}
        }).then(res => {
            console.log(res.data);
            console.log(res.data.id);
            console.log(res.data.image);
            console.log(res.data.longitude);
            console.log(res.data.latitude);

            this.setState({
                Tempid: res.data.id,
                TempFilePath: res.data.image
            })

            this.props.handleStateChange(this.state.Tempid, this.state.TempFilePath);
            
            this.props.goToNext(event);

        }).catch(err => console.log(err));
    */
    }

    render() {
        return (
            <div style= {{display: "flex", flexDirection: "row"}}>
                <div style= {{display: "flex", flexDirection: "column"}}>
                    <div style= {{display: "flex", flexDirection: "row"}}>
                        {this.state.imageUploaded ?
                            <div style= {{width: "400px", height: "300px", position: "relative"}}>
                                <Cropper
                                    image={this.state.image}
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
                            <Mui.Paper style={{color: "#e0e0e0", width: "400px", height: "300px" }}>
                            </Mui.Paper>
                        }
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <input
                            accept="image/*"
                            type="file"
                            id="contained-button-file"
                            onChange={this.onFileChange}
                            style={{display: "none"}}
                        />
                        <label htmlFor="contained-button-file">
                            <Mui.Button variant="contained" color="primary" component="span">
                                Upload
                            </Mui.Button>
                        </label>
                        <div style={{display: 'flex', flex: '1', alignItems: 'center', marginRight: "15px", marginLeft: "15px"}}>
                            <Mui.Typography>
                                Rotation
                            </Mui.Typography>
                            <Mui.Slider
                                value={this.state.rotation}
                                min={0}
                                max={360}
                                step={1}
                                aria-labelledby="Rotation"
                                onChange={this.onRotationChange}
                            />
                        </div>
                        <Mui.Button
                            onClick={this.showCroppedImage}
                            variant="contained"
                            color="primary"
                            disabled={!this.state.imageUploaded}
                        >
                            Crop
                        </Mui.Button>
                    </div> 
                </div>
                <div style= {{display: "flex", flexDirection: "column"}}>
                    {this.state.imageCropped ?
                        <img src ={this.state.croppedImage} style = {{width: "300px", height: "450px" }}></img>
                    :
                        <Mui.Paper style={{color: "#e0e0e0", width: "300px", height: "450px" }}/>
                    }
                    <Mui.Button
                        variant="contained"
                        color="primary"
                        onClick={this.submitImage}
                        disabled={!this.state.imageCropped}
                    >
                        Submit
                    </Mui.Button>
                </div>
            </div>
        );
    }
  }