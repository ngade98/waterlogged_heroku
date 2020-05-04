import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddLocation from './AddLocation';
import ThanksForUploading from './ThanksForUploading';

import $ from 'jquery';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUp from './Yellow-ThumbsUp.svg';

import UploadButton from './UploadButton.js'; 
import axios from 'axios';

import {compress, decompress} from 'lz-string';

const styles = {
    wrapper: { // holds ALL the contnet for the page
        display: 'flex',
        backgroundColor: '#eceff1',
        flexDirection: 'column',
        // height: '100vh',
        width: '100%',
        paddingTop: 10,
        alignItems: 'center',
    },
    content: { // Holds the content to the right of the menu bar
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 30,
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: "center",
    },
    imagesContainer: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 40,
        // marginLeft: 50,
        // marginRight: 50,
        width: '50%',
    },
    mobileImagesContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftImage: {
        display: 'flex',
        margin: 'auto',
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        // width: "100%",
        objectFit: 'contain',
    },
    rightImage: {
        display: 'flex',
        margin: 'auto',
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        // width: "100%",
        objectFit: 'contain',
    },
    image: {
        minHeight: 200,
        maxHeight: 300,
        width: 'auto',
        objectFit: 'cover',
    },
    mobileImage: {
        width: 'auto',
        objectFit: 'cover',
        height: 200,
    },
    mobileTopBtmImages: {
        display: 'flex',
        margin: 'auto',
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        overflow: 'hidden',
        width: 'auto',
        height: 'auto',
    },
    confirmationText: {
        padding: '15px',
        fontSize: '1rem',
        paddingBottom: 20,
        textAlign: "center"
    },
    button: {
        width: 200,
        marginBottom: 12,
    },
    thumbsUpChip: {
        backgroundColor: '#FFDE03',//#3F51B5 #FFDE03
        boxShadow: '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
        marginTop: 15,
    },
};

const theme = createMuiTheme({
    overrides: {
        // overrides here
    },
});

interface Props {
    title: string;
    submitBtn: any;
    backBtn: any;
    preImage: any;
    postImage: any; 
    preImageURL: any; 
    preImageLat: any;
    preImageLon: any;
    postImageLon: any;
    postImageLat: any; 
    preImagedate: any;
    postImagedate: any; 
    preImagePath: any;
    PreImageJSONData: any;
}
interface States {
    userState: number; // 0 = game, 1 = pass, 2 = kinda, 3 = fail
    imageURI: string;
    submit: bool;
    openPreViewModal: bool;
    openPostViewModal: bool;
    preImagePath: any;

    preImageLat: Number;
    preImageLon: Number;
    

    postImage: any;  
//still in use 

//to determine using if statments based on pass ins 
    pair_attempted: any; // set to true if we go down x path 
    pre_image_source: any; 

    preImageURL: Number; 
    pairid: number; // the id recived from the main database post of the post image 

    //used for the Put request of the Post photo 
    pairIdToPost: Number; // the id recived from the main database post of the pre image 

    Post_Image_Temp_Path: any;
    Pre_Image_Temp_Path: any; 

    //*****Variables collected via inbrowser memory******
    PreImageJSONData: any; // the JSON with the PRe Image infromation 
    //only used if we have a Pre Image from GOOGLE
    Post_Image: any; //the actual post photo file 
    Pre_Image: any; //the actual pre immage file 
    //only used if we have a pre immage user uploaded 
    Image_Lat: any; //will be used for both pre and post
    Image_Lon: any; //will be used for both pre and post 
    Post_image_date: any; //only filled if we have the data
    Pre_image_location_address: any; // addres sof pre image if available from google maps or lat/lon 

    Post_Image_Display: any;
    Pre_Image_Display: any; 

    Post_image_blob: any;
    Pre_image_blob: any;

    JumpIntoPostID: any;
    oneImage: bool; // allows us to display only one image 
    
}

export default class ConfirmationPage extends React.Component<{}, States>{
    constructor(props: Props) {
        super(props);
        
   
       if((localStorage.getItem("streetView") == "true")&&(localStorage.getItem("streetViewData") == null)){ // No metadata
            this.state = {
                userState: 0,
                submit: false,
                oneImage: null,
                Post_image_blob:localStorage.getItem("postImage"),
                Pre_Image: localStorage.getItem("streetViewPano"),
                Image_Lat: 0.0,
                Image_Lon: 0.0,
                Post_image_date: this.convert_date(),
                PreImageJSONData: null, 
                JumpIntoPostID: localStorage.getItem("PostID"),
                Pre_image_location_address: localStorage.getItem("address"),
                //preImageURL: "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + JSON.parse(localStorage.getItem("streetViewData")).lat + "," + JSON.parse(localStorage.getItem("streetViewData")).lng + "&heading=" + JSON.parse(localStorage.getItem("streetViewData")).heading + "&pitch=" + JSON.parse(localStorage.getItem("streetViewData")).pitch + "&fov=" + JSON.parse(localStorage.getItem("streetViewData")).fov,
            };
            this.Post_Image_Receive()
        }
        else if (localStorage.getItem("streetView") == "true"){ // Has Metadata
            this.state = {
            userState: 0,
            submit: false,
            oneImage: null,
            Post_image_blob:localStorage.getItem("postImage"),
            Pre_Image: localStorage.getItem("streetViewPano"),
            Image_Lat: localStorage.getItem("latitude"),
            Image_Lon: localStorage.getItem("longitude"),
            Post_image_date: this.convert_date(),
            PreImageJSONData: JSON.parse(localStorage.getItem("streetViewData")),
            Pre_image_location_address: localStorage.getItem("address"),
            preImageURL: "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + JSON.parse(localStorage.getItem("streetViewData")).lat + "," + JSON.parse(localStorage.getItem("streetViewData")).lng + "&heading=" + JSON.parse(localStorage.getItem("streetViewData")).heading + "&pitch=" + JSON.parse(localStorage.getItem("streetViewData")).pitch + "&fov=" + JSON.parse(localStorage.getItem("streetViewData")).fov,
            Pre_Image_Display: localStorage.getItem("streetViewPano"),
            JumpIntoPostID: localStorage.getItem("PostID")
        }
            this.Post_Image_Receive()
          
        }
        else{
            this.state = {
                userState: 0,
                submit: false,
                oneImage: null,
                //Post_Image: decompress(localStorage.getItem("croppedImage")),
                //Pre_Image: decompress(localStorage.getItem("croppedPreImage")),
                Pre_image_blob: localStorage.getItem("preImage"),
                Post_image_blob:localStorage.getItem("postImage"),
                Image_Lat: localStorage.getItem("latitude"),
                Image_Lon: localStorage.getItem("longitude"),
                Post_image_date: this.convert_date(),
                PreImageJSONData: JSON.parse(localStorage.getItem("streetViewData")),
                Pre_image_location_address: localStorage.getItem("address"),
                preImageURL: "none",
                JumpIntoPostID: localStorage.getItem("PostID")
            };
            this.Post_Image_Receive()
            this.Pre_Image_Receive()
        }

        
    }

    convert_date = () => {

        var date = localStorage.getItem("date"); 

        if(date == null){
            console.log("there is no date associated - using the default")
            var newdate = "2020-04-15T00:27:26.205177Z"
        }
        else {
        var YYYY = date.substr(0,4);
        var MM = date.substr(5,2);
        var DD = date.substr(8,2);
        var hh = date.substr(11,2);
        var mm = date.substr(14,2);
        var ss = date.substr(17,2);

        var newdate = YYYY+"-"+MM+"-"+DD+"T"+hh+":"+mm+":"+ss+".205177Z"; 

        console.log(date); 
        console.log(newdate);
        
        } 

        return newdate; 
        

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
    
    submit = () =>{

        console.log(this.state.Post_image_date);
        console.log(localStorage.getItem("date"));


        if (localStorage.getItem("streetView") == "false"){
            if (localStorage.getItem("PostID") == null ){
                this.setState({
                    oneImage: false,
                });
                this. Submit_Two_Files()
                console.log("file upload")

            }else {
                this.New_Paring_of_Post_FileUpload()
                console.log("Juming into: file upload")
            }
            
        }else if (localStorage.getItem("streetViewData") == null){

            this.Submit_One_File_Only()
            console.log("Only one file")

        }else {
            if (localStorage.getItem("PostID") == null ){
                this.setState({
                    oneImage: false,
                });
                this.Submit_With_Google()
                console.log("Stretview")
            }else {
                this.New_Paring_of_Post_Maps()
                console.log("Jumping into: Stretview")
            }

        }


        this.clear()
    }

    clear = () => {


        localStorage.removeItem("latitude");
        localStorage.removeItem("longitude");
        localStorage.removeItem("address");
        localStorage.removeItem("date");
        localStorage.removeItem("postImage");
        localStorage.removeItem("preImage");
        localStorage.removeItem("needStreetView");
        localStorage.removeItem("streetView");
        localStorage.removeItem("streetViewData");
        localStorage.removeItem("streetViewPano");
        localStorage.removeItem("activeStep");
        localStorage.removeItem("PostID");


    }

//STATE SETTING FOR POST IMAGE
    Post_Image_Receive = () =>{
        axios.post('http://' + window.$backendDNS + '/api/receive/', {blob_name: (localStorage.getItem("postImage"))})
        .then((response) => {
            this.setState({
                Post_Image_Display: response.data
            })
        })
    }

//STATE SETTING FOR PRE IMAGE 
    Pre_Image_Receive = () =>{
        axios.post('http://' + window.$backendDNS + '/api/receive/', {blob_name: (localStorage.getItem("preImage"))})
        .then((response) => {
            this.setState({
                Pre_Image_Display: response.data
            })
        })
    }

    New_Paring_of_Post_Maps = () => {

        let jumppairid = this.state.JumpIntoPostID;
//DOING A LOAD FOR THE DATA FOR THE GOOGLE MAPS STILL                        
        var EditedJSON = this.state.PreImageJSONData;
        console.log(EditedJSON);
        EditedJSON['id'] = jumppairid;
        EditedJSON["size"]= "530x795";
        EditedJSON["key"] = "AIzaSyD7blO0Y7Z-Jf2rRFyuo2CrQa7kEXRy1po";
        EditedJSON["location"] = this.state.Image_Lat + "," + this.state.Image_Lon;

        console.log("load") 
        let urlfileupload = 'http://' + window.$backendDNS + '/api/load/';
           axios.post(urlfileupload, EditedJSON)
              .then(res => {
                  console.log(res)

                  this.setState({

                    Pre_image_blob: res.data.blob_name, 

                  })

//SUBMITTING THE PRE IMAGE WHICH IS THE GOOGLE MAPS CONVERTED IMAGE 
                  let form_data = new FormData();
                  form_data.append('blob_name', res.data.blob_name);  
                  form_data.append('flood_date', this.state.Post_image_date);
                  form_data.append('pre_post', false); // false for pre 
                  form_data.append('longitude', this.state.Image_Lon);
                  form_data.append('latitude', this.state.Image_Lat);
                  form_data.append('address', this.state.Pre_image_location_address);
                  form_data.append('user_uploaded', 1); // 1 means user uploaded yes 
                  form_data.append('pair_index', jumppairid); //temporarally 1 need to do a put to change later 
                  form_data.append('approved_by_admin', false);
                  form_data.append('pair_approved_by_admin', false);
                  form_data.append('flood_height', 0);
                  form_data.append('source', 'Google Maps');
                  form_data.append('pair_attempted', true);
                  form_data.append('Maps_URL', this.state.preImageURL);
                  form_data.append('user_id_of_upload', 1); 
              
                  let url = 'http://' + window.$backendDNS + '/api/image/';
                  axios.post(url, form_data, {
                    headers: {
                      'content-type': 'multipart/form-data'
                    }
                  }).then(res => {
              
                      this.setState({
                          pairIdToPost: res.data.id,
                          })
                          console.log("putting together the json to pass to put ") 
                                  //putting together the json to send to the backend for the put request
                        //var text = '{ "image": { "id": '+jumppairid+', "flood_date": "'+this.state.Post_image_date+'", "pre_post": true, "longitude": '+this.state.Image_Lon+', "latitude": '+this.state.Image_Lat+', "address": "'+this.state.Pre_image_location_address+'", "user_uploaded": 1, "pair_index": '+res.data.id+', "approved_by_admin": false, "pair_approved_by_admin": false, "flood_height": 0.0, "source": "File Upload", "pair_attempted": true, "blob_name" : "'+this.state.Post_image_blob+'" , "Maps_URL":"'+this.state.preImageURL+'", "user_id_of_upload":"1" } }'
                        var text = '{ "image": { "id": '+jumppairid+', "flood_date": "'+this.state.Post_image_date+'", "pre_post": true, "longitude": '+this.state.Image_Lon+', "latitude": '+this.state.Image_Lat+', "address": "'+this.state.Pre_image_location_address+'", "user_uploaded": 1, "pair_index": '+res.data.id+', "approved_by_admin": false, "pair_approved_by_admin": false, "flood_height": 0.0, "source": "File Upload", "pair_attempted": true, "blob_name" : "'+this.state.Post_image_blob+'" , "Maps_URL":"'+this.state.preImageURL+'", "user_id_of_upload":"1" } }'

                        
                        //pairid is the original id passed back by the first post request
                        //pairIDtoPost is the id passed back by the pre image's post request            
                        let urlput = 'http://' + window.$backendDNS + '/api/image/'+jumppairid;
//PUT CALL TO CHANGE THE PAIR ID FOR A POST IMAGE WITH A PRE IMAGE PAIR 

                         axios.put(urlput, JSON.parse(text))
                        .then(res => {
                            console.log(res.data);
                        }).catch(err => console.log(err))         
                    
                    }).catch(err => console.log(err))

                }).catch(err => console.log(err));

                this.setState({

                    submit: true
                    
                })


    }

    New_Paring_of_Post_FileUpload = () => {



        let jumppairid = this.state.JumpIntoPostID;

            
              let pre_data = new FormData();

              pre_data.append('blob_name', this.state.Pre_image_blob);  
              pre_data.append('flood_date', this.state.Post_image_date);
              pre_data.append('pre_post', false); // false for pre 
              pre_data.append('longitude', this.state.Image_Lon);
              pre_data.append('latitude', this.state.Image_Lat);
              pre_data.append('address', this.state.Pre_image_location_address);
              pre_data.append('user_uploaded', 1); // 1 means user uploaded yes 
              pre_data.append('pair_index', jumppairid); //temporarally 1 need to do a put to change later 
              pre_data.append('approved_by_admin', false);
              pre_data.append('pair_approved_by_admin', false);
              pre_data.append('flood_height', 0);
              pre_data.append('source', 'File Upload');
              pre_data.append('pair_attempted', true);

//POST THE PRE IMAGE TO THE DATABASE GET BACK THE ID 
              let url = 'http://' + window.$backendDNS + '/api/image/';
              axios.post(url, pre_data, {
                headers: {
                  'content-type': 'multipart/form-data'
                }
                }).then(res => {
          
                    console.log("putting together the json to pass to put ") 
                              //putting together the json to send to the backend for the put request
                   // var text = '{ "image": { "id": '+jumppairid+', "flood_date": "'+this.state.Post_image_date+'", "pre_post": true, "longitude": '+this.state.Image_Lon+', "latitude": '+this.state.Image_Lat+', "address": "'+this.state.Pre_image_location_address+'", "user_uploaded": 1, "pair_index": '+res.data.id+', "approved_by_admin": false, "pair_approved_by_admin": false, "flood_height": 0.0, "source": "File Upload", "pair_attempted": true, "blob_name" : "'+this.state.Post_image_blob+'" , "Maps_URL":"'+this.state.preImageURL+'", "user_id_of_upload":"1" } }'
                    
                   var text = '{ "image": { "id": '+jumppairid+', "flood_date": "'+this.state.Post_image_date+'", "pre_post": true, "longitude": '+this.state.Image_Lon+', "latitude": '+this.state.Image_Lat+', "address": "'+this.state.Pre_image_location_address+'", "user_uploaded": 1, "pair_index": '+res.data.id+', "approved_by_admin": false, "pair_approved_by_admin": false, "flood_height": 0.0, "source": "File Upload", "pair_attempted": true, "blob_name" : "'+this.state.Post_image_blob+'" , "Maps_URL":"'+this.state.preImageURL+'", "user_id_of_upload":"1" } }'

                    console.log(text);
                    console.log(JSON.parse(text));
                    //PUT REQUEST TO THE DATABASE TO CHAANGE THE PAIR ID FOR THE PRE IMAGE 
                    //pairid is the original id passed back by the first post request
                     //pairIDtoPost is the id passed back by the pre image's post request            
                    let urlput = 'http://' + window.$backendDNS + '/api/image/'+jumppairid;
    
                axios.put(urlput, JSON.parse(text))
                .then(res => {
                    console.log(res.data);
                }).catch(err => console.log(err))         

      
            }).catch(err => console.log(err))

            this.setState({

                submit: true
                
            })



    }

//COMPLETED SUBMIT ONE FILE ONLY ONCE 
    Submit_One_File_Only = () => {

    let form_data = new FormData();

    form_data.append('blob_name', this.state.Post_image_blob);  
    form_data.append('flood_date', this.state.Post_image_date);
    form_data.append('pre_post', true); // true for post 
    form_data.append('longitude', this.state.Image_Lon);
    form_data.append('latitude', this.state.Image_Lat);
    form_data.append('address', this.state.Pre_image_location_address);
    form_data.append('user_uploaded', 1); // 1 means user uploaded yes 
    form_data.append('pair_index', 0); //temporarally 1 need to do a put to change later 
    form_data.append('approved_by_admin', false);
    form_data.append('pair_approved_by_admin', false);
    form_data.append('flood_height', 0);
    form_data.append('source', 'File Upload');
    form_data.append('pair_attempted', false);
    form_data.append('Maps_URL', "none");
    form_data.append('user_id_of_upload', 1); 


    axios.post('http://' + window.$backendDNS + '/api/image/', form_data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }).then(res => {

        this.setState({

            submit: true
            
        })


    }).catch(err => console.log(err))



    }

//COMPLETED SUBMIT WITH GOOGLE LOAD 
    Submit_With_Google = () => {

        let form_data = new FormData();
//UPLOADING THE POST IMAGE TO THE DATABASE SO THAT WE CAN USE THE PAIR ID 
        form_data.append('blob_name', this.state.Post_image_blob);  
        form_data.append('flood_date', this.state.Post_image_date);
        form_data.append('pre_post', true); // true for post 
        form_data.append('longitude', this.state.Image_Lon);
        form_data.append('latitude', this.state.Image_Lat);
        form_data.append('address', this.state.Pre_image_location_address);
        form_data.append('user_uploaded', 1); // 1 means user uploaded yes 
        form_data.append('pair_index', 0); //temporarally 1 need to do a put to change later 
        form_data.append('approved_by_admin', false);
        form_data.append('pair_approved_by_admin', false);
        form_data.append('flood_height', 0);
        form_data.append('source', 'File Upload');
        form_data.append('pair_attempted', true);
        form_data.append('Maps_URL', this.state.preImageURL);
        form_data.append('user_id_of_upload', 1); 
    
        console.log("here") 

        axios.post('http://' + window.$backendDNS + '/api/image/', form_data, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }).then(res => {
    
        let pairid = res.data.id;
//DOING A LOAD FOR THE DATA FOR THE GOOGLE MAPS STILL                        
        var EditedJSON = this.state.PreImageJSONData;
        console.log(EditedJSON);
        EditedJSON['id'] = pairid;
        EditedJSON["size"]= "530x795";
        EditedJSON["key"] = "AIzaSyD7blO0Y7Z-Jf2rRFyuo2CrQa7kEXRy1po";
        EditedJSON["location"] = this.state.Image_Lat + "," + this.state.Image_Lon;

        console.log("load") 
        let urlfileupload = 'http://' + window.$backendDNS + '/api/load/';
           axios.post(urlfileupload, EditedJSON)
              .then(res => {
                  console.log(res)

                  this.setState({

                    Pre_image_blob: res.data.blob_name, 

                  })

//SUBMITTING THE PRE IMAGE WHICH IS THE GOOGLE MAPS CONVERTED IMAGE 
                  let form_data = new FormData();
                  form_data.append('blob_name', res.data.blob_name);  
                  form_data.append('flood_date', this.state.Post_image_date);
                  form_data.append('pre_post', false); // false for pre 
                  form_data.append('longitude', this.state.Image_Lon);
                  form_data.append('latitude', this.state.Image_Lat);
                  form_data.append('address', this.state.Pre_image_location_address);
                  form_data.append('user_uploaded', 1); // 1 means user uploaded yes 
                  form_data.append('pair_index', pairid); //temporarally 1 need to do a put to change later 
                  form_data.append('approved_by_admin', false);
                  form_data.append('pair_approved_by_admin', false);
                  form_data.append('flood_height', 0);
                  form_data.append('source', 'Google Maps');
                  form_data.append('pair_attempted', true);
                  form_data.append('Maps_URL', this.state.preImageURL);
                  form_data.append('user_id_of_upload', 1); 
              
                  let url = 'http://' + window.$backendDNS + '/api/image/';
                  axios.post(url, form_data, {
                    headers: {
                      'content-type': 'multipart/form-data'
                    }
                  }).then(res => {
              
                      this.setState({
                          pairIdToPost: res.data.id,
                          })
                          console.log("putting together the json to pass to put ") 
                                  //putting together the json to send to the backend for the put request
                        var text = '{ "image": { "id": '+pairid+', "flood_date": "'+this.state.Post_image_date+'", "pre_post": true, "longitude": '+this.state.Image_Lon+', "latitude": '+this.state.Image_Lat+', "address": "'+this.state.Pre_image_location_address+'", "user_uploaded": 1, "pair_index": '+res.data.id+', "approved_by_admin": false, "pair_approved_by_admin": false, "flood_height": 0.0, "source": "File Upload", "pair_attempted": true, "blob_name" : "'+this.state.Post_image_blob+'" , "Maps_URL":"'+this.state.preImageURL+'", "user_id_of_upload":"1" } }'

                        //pairid is the original id passed back by the first post request
                        //pairIDtoPost is the id passed back by the pre image's post request            
                        let urlput = 'http://' + window.$backendDNS + '/api/image/'+pairid;
//PUT CALL TO CHANGE THE PAIR ID FOR A POST IMAGE WITH A PRE IMAGE PAIR 

                         axios.put(urlput, JSON.parse(text))
                        .then(res => {
                            console.log(res.data);
                        }).catch(err => console.log(err))         
                    
                    }).catch(err => console.log(err))

                }).catch(err => console.log(err));

                this.setState({

                    submit: true
                    
                })

             }).catch(err => console.log(err))    


    }

//COMPLETED SUBMIT OF TWO FILES 
    Submit_Two_Files =() => {


    let form_data = new FormData();

    form_data.append('blob_name', this.state.Post_image_blob);  
    form_data.append('flood_date', this.state.Post_image_date);
    form_data.append('pre_post', true); // true for post 
    form_data.append('longitude', this.state.Image_Lon);
    form_data.append('latitude', this.state.Image_Lat);
    form_data.append('address', this.state.Pre_image_location_address);
    form_data.append('user_uploaded', 1); // 1 means user uploaded yes 
    form_data.append('pair_index', 0); //temporarally 1 need to do a put to change later 
    form_data.append('approved_by_admin', false);
    form_data.append('pair_approved_by_admin', false);
    form_data.append('flood_height', 0);
    form_data.append('source', 'File Upload');
    form_data.append('pair_attempted', true);

    console.log("here") 
//POST TO IMAGE DATABASE THE POST IMAGE 
    axios.post('http://' + window.$backendDNS + '/api/image/', form_data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }).then(res => {

        let pairid = res.data.id;

            
              let pre_data = new FormData();

              pre_data.append('blob_name', this.state.Pre_image_blob);  
              pre_data.append('flood_date', this.state.Post_image_date);
              pre_data.append('pre_post', false); // false for pre 
              pre_data.append('longitude', this.state.Image_Lon);
              pre_data.append('latitude', this.state.Image_Lat);
              pre_data.append('address', this.state.Pre_image_location_address);
              pre_data.append('user_uploaded', 1); // 1 means user uploaded yes 
              pre_data.append('pair_index', pairid); //temporarally 1 need to do a put to change later 
              pre_data.append('approved_by_admin', false);
              pre_data.append('pair_approved_by_admin', false);
              pre_data.append('flood_height', 0);
              pre_data.append('source', 'File Upload');
              pre_data.append('pair_attempted', true);

//POST THE PRE IMAGE TO THE DATABASE GET BACK THE ID 
              let url = 'http://' + window.$backendDNS + '/api/image/';
              axios.post(url, pre_data, {
                headers: {
                  'content-type': 'multipart/form-data'
                }
                }).then(res => {
          
                    console.log("putting together the json to pass to put ") 
                              //putting together the json to send to the backend for the put request
                   // var text = '{ "image": { "id": '+pairid+', "flood_date": "'+this.state.Post_image_date+'", "pre_post": true, "longitude": '+this.state.Image_Lon+', "latitude": '+this.state.Image_Lat+', "address": "'+this.state.Pre_image_location_address+'", "user_uploaded": 1, "pair_index": '+this.state.pairIdToPost+', "approved_by_admin": false, "pair_approved_by_admin": false, "flood_height": 0.0, "source": "File Upload", "pair_attempted": true, "blob_name": "' +this.state.Post_image_blob+'" , "Maps_URL":"'+this.state.preImageURL+'", "user_id_of_upload":"1" } }'
                    var text = '{ "image": { "id": '+pairid+', "flood_date": "'+this.state.Post_image_date+'", "pre_post": true, "longitude": '+this.state.Image_Lon+', "latitude": '+this.state.Image_Lat+', "address": "'+this.state.Pre_image_location_address+'", "user_uploaded": 1, "pair_index": '+res.data.id+', "approved_by_admin": false, "pair_approved_by_admin": false, "flood_height": 0.0, "source": "File Upload", "pair_attempted": true, "blob_name" : "'+this.state.Post_image_blob+'" , "Maps_URL":"'+this.state.preImageURL+'", "user_id_of_upload":"1" } }'

                    
//PUT REQUEST TO THE DATABASE TO CHAANGE THE PAIR ID FOR THE PRE IMAGE 
                    //pairid is the original id passed back by the first post request
                     //pairIDtoPost is the id passed back by the pre image's post request            
                    let urlput = 'http://' + window.$backendDNS + '/api/image/'+pairid;
    
                axios.put(urlput, JSON.parse(text))
                .then(res => {
                    console.log(res.data);
                }).catch(err => console.log(err))         

      
            }).catch(err => console.log(err))

            this.setState({

                submit: true
                
            })


        }).catch(err => console.log(err));


    }

    handlePreImgView = () => {
        this.setState({
            openPreViewModal: true,
        });
    };

    handlePreImgClose = () => {
        this.setState({
            openPreViewModal: false,
        });
     };

    handlePostImgView = () => {
        this.setState({
            openPostViewModal: true,
        });
    };

    handlePostImgClose = () => {
        this.setState({
            openPostViewModal: false,
        });
     };

    handleBack = () => {
        if(localStorage.getItem("streetView") == "true"){
            this.props.backBtn();
        }
        else {
            this.props.skipBackBtn();
        }
    }

    showTheImage = () => { 
        // { (localStorage.getItem("streetViewData") === null)? // single file
                    
        //                 !(localStorage.getItem("streetView") == "false") ? //double file
        //                 <Mui.Paper style={styles.rightImage} elevation={2} id="this_is_test">
        //                     <img
        //                         src = {this.state.Pre_Image_Display}
        //                         style={styles.image}
        //                     />
        //                 </Mui.Paper>
        //                  :null
                         
        //                  : <div> idk how to handle this </div>
                        
                    
                    
        //             }
        let content = null; 
  
        if (localStorage.getItem("streetView") == "false"){
           // if (localStorage.getItem("PostID") == null ){
                // Unsubmitted 2nd Upload for 2 file submission
                content =
                    <Mui.Paper style={styles.rightImage} elevation={2} id="this_is_test">
                        <img
                            src = {this.state.Pre_Image_Display}
                            style={styles.image}
                        />
                    </Mui.Paper>
           // }
        }else if (localStorage.getItem("streetViewData") == null){
            // All submitted files come here, as well as unsubmitted single file uploads 
           if (this.state.oneImage === false) { 
               // there are 2 images being submitted
                content = 
                    <Mui.Paper style={styles.rightImage} elevation={2} id="this_is_test">
                        <img
                            src = {this.state.Pre_Image_Display}
                            style={styles.image}
                        />
                    </Mui.Paper>
            } else { 
                // onyl 1 image being submitted 
                content = null
            }
            
        }else {
            //if (localStorage.getItem("PostID") == null ){
                // An unsubmitted Streetview 
                console.log("I should be a raw streetview");
                content = 
                    <Mui.Paper style={styles.rightImage} elevation={2} id="this_is_test">
                        <img
                            src = {this.state.Pre_Image_Display}
                            style={styles.image}
                        />
                    </Mui.Paper>
           // }
        }
        

        return content;
    }


    content () { 
        const isMobile = window.innerWidth < 1000;
        if (isMobile) {
            return(
                <div style={styles.wrapper}>
                {this.state.openPreViewModal ?
                    <Mui.Modal
                        open={this.state.openPreViewModal}
                        handleClose={this.handlePreImgClose}
                        onBackdropClick={this.handlePreImgClose}
                        style={{display:'flex',alignItems:'center',justifyContent:'center', outline: 'none'}}
                    >
                    <div>
                        <img
                            style={{width: 'auto', height: 500,  outline: 0}}
                            src = {this.state.Pre_Image_Display}
                        />
                    </div>
                  </Mui.Modal>
                   : null
                }
                {this.state.openPostViewModal ?
                    <Mui.Modal
                        open={this.state.openPostViewModal}
                        handleClose={this.handlePostImgClose}
                        onBackdropClick={this.handlePostImgClose}
                        style={{display:'flex',alignItems:'center',justifyContent:'center', outline: 'none'}}
                    >
                    <div>
                        <img
                            style={{width: 'auto', height: 500,  outline: 0}}
                            src = {this.state.Post_Image_Display}
                        />
                    </div>
                  </Mui.Modal>
                   : null
                }
                    <Mui.GridList  cellHeight={160} styles={{flexWrap: 'nowrap',}} cols={1}>
                        {localStorage.getItem("streetViewData") == null ? null : 
                            <Mui.GridListTile  rows={1} onClick={this.handlePreImgView}>
                                <img
                                    src = {this.state.Pre_Image_Display}
                                />
                            <Mui.GridListTileBar
                                title={"Pre-Flood"}
                            />
                            </Mui.GridListTile>
                        }


                         <Mui.GridListTile onClick={this.handlePostImgView}>
                             <img
                                src = {this.state.Post_Image_Display}
                             />
                           <Mui.GridListTileBar
                             title={"Post-Flood"}

                           />
                         </Mui.GridListTile>

                    </Mui.GridList>

                    {/* Thumbs Up Icon - only appears after submission */}
                    <Mui.Slide direction="up" in={this.state.submit} mountOnEnter unmountOnExit>
                        <Mui.Fab color="primary" aria-label="add" style={styles.thumbsUpChip} disabled>
                            <ThumbUpIcon style={{fill: '#fff'}}/>
                        </Mui.Fab>
                    </Mui.Slide >

                    {/* Buttons and Texts */}
                        {this.state.submit ?
                            <div style={styles.infoContainer}>
                            <Mui.Typography variant="subtitle2" style={styles.confirmationText}>
                                Thank you! Your photos have been submitted for review.
                            </Mui.Typography>
                            <Mui.Button
                                  variant="contained"
                                  component={Link}
                                  to="/MapPage"
                                  style={styles.button}
                                  size='medium'
                                  color="primary"
                             >
                                 Go to Map
                            </Mui.Button>
                            </div>
                        :
                            <div style={styles.infoContainer}>
                            <Mui.Typography variant="subtitle2" style={styles.confirmationText}>
                                Please confirm this photo pair.
                            </Mui.Typography>
                            <Mui.Button
                                  variant="contained"
                                  style={styles.button}
                                  size='medium'
                                  color="primary"
                                  onClick={this.submit}
                             >
                                 Submit Pair
                            </Mui.Button>
                            <Mui.Button
                                 // variant="contained"
                                 style={styles.button}
                                 onClick={this.handleBack}
                                 // size='medium'
                            >
                                Back
                            </Mui.Button>
                            </div>
                    }
                </div>
            );
        } else {
        return(
            <div style={styles.wrapper}>
                <div style={styles.imagesContainer}>
                    <Mui.Paper style={styles.leftImage} elevation={2}>
                        <img
                            src = {this.state.Post_Image_Display}
                            style={styles.image}
                        />
                    </Mui.Paper>

                    {/* Thumbs Up Icon - only appears after submission */}
                    <Mui.Slide direction="up" in={this.state.submit} mountOnEnter unmountOnExit>
                        <Mui.Fab color="primary" aria-label="add" style={styles.thumbsUpChip} disabled>
                            <ThumbUpIcon style={{fill: '#fff'}}/>
                        </Mui.Fab>
                    </Mui.Slide >
                    {/* Single Image Submission Dont show this (show null)  */}
                    {this.showTheImage()}
                    

                </div>

                {/* Buttons and Texts */}
                    {this.state.submit ?
                        <div style={styles.infoContainer}>
                        <Mui.Typography variant="subtitle2" style={styles.confirmationText}>
                            Thank you! Your photos have been submitted for review.
                        </Mui.Typography>
                        <Mui.Button
                              variant="contained"
                              component={Link}
                              to="/MapPage"
                              style={styles.button}
                              size='medium'
                              color="primary"
                         >
                             Go to Map
                        </Mui.Button>
                        </div>
                    :
                        <div style={styles.infoContainer}>
                        <Mui.Typography variant="subtitle2" style={styles.confirmationText}>
                            Please confirm this photo pair.
                        </Mui.Typography>
                        <Mui.Button
                              variant="contained"
                              // component={Link}
                              // to="/ThanksForUploading"
                              style={styles.button}
                              size='medium'
                              color="primary"
                              onClick={this.submit}
                         >
                             Submit Pair
                        </Mui.Button>
                        <Mui.Button
                             variant="contained"
                             onClick={this.handleBack}
                             style={styles.button}
                             size='medium'
                        >
                            Back
                        </Mui.Button>
                        </div>
                }
            </div>
        );
    }
        
    }

// Renders the Whole Page
    render(){
        return (
            <MuiThemeProvider theme={theme}>
                 {this.content()}
            </MuiThemeProvider>
           

        );
            
    }}
