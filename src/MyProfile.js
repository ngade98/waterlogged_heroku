import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import Logo from './logo-blue.png';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DoneIcon from '@material-ui/icons/Done';


import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';

import axios from 'axios';

const styles = {
    wrapper: { // holds ALL the contnet for the page
        display: 'flex',
        backgroundColor: '#eceff1',
        height: '100vh',
        justifyContent: 'center',
        // width: '100vw'
        // width: '100%',
            marginTop: -100,
    },
    content: { // Holds the content to the right of the menu bar
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: -30,
        width: '100%',
        flexGrow: 1,
        height: '100vh',
    },
    container: { // Web View
        width: '30%',
    },
    mobileContainer: { // Mobile View
        width: '70%',
    },
    logo: {
        width: 200,
    },
};

const theme = createMuiTheme({
  overrides: {
      // overrides here

  },
});

interface Props {
    title: string;
}
interface States {
    userState: number; // 0 = game, 1 = pass, 2 = kinda, 3 = fail
    username: string,
    password: string,
    selectedUsername: String, // for User banning and admin granting 
    confirmationMessage: String, 
}

export default class MyProfile extends React.Component<Props, States>{
    constructor(props) {
		super(props);
		this.state = {
            userState: 0,
            username: localStorage.getItem("username"),
            downloadProgress: 0,
            downloading: false,
            profiles: [],
            selectedUsername: '',
            selectedID: null,
            confirmationMessage: '', 
            searchText: " "
        };

        this.getProfiles();
    }

    base64ToArrayBuffer = (base64) => {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
    

    downloadImages = async () => {
        var zip = new JSZip();
        var postFloodFolder = zip.folder("PostFlood");
        var preFloodFolder = zip.folder("PreFlood");

        var queryJSON = {
            data: {
                MinLat: "-360",
                MaxLat: "360",
                MinLong: "-360",
                MaxLong: "360",
                MinDate: "1900-01-01T00:00:00Z",
                MaxDate: "2999-01-01T00:00:00Z",
                PairingStatus: "All Photos"
            }
        }

        var getDatabaseContent = await axios.post('http://' + window.$backendDNS + '/api/datasearch/', queryJSON);
        var images = getDatabaseContent.data;

        var csvContent = "Photo #,Paired,Longitude,Latitude,Address,Date Taken,Pre Source,Post Source,Streetview Link\n";

        for(var i = 0; i < images.length; i++){
            
            if(images[i].preID){
                const filename = (i + 1) + "_PreFlood" + ".jpg";
                const preImage = await axios.post('http://' + window.$backendDNS + '/api/receive/', {blob_name: images[i].pre_blob_name});
                const newData = this.base64ToArrayBuffer(preImage.data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
                preFloodFolder.file(filename, newData);
            }
            if(images[i].postID){
                const filename = (i + 1) + "_PostFlood" + ".jpg";
                const postImage = await axios.post('http://' + window.$backendDNS + '/api/receive/', {blob_name: images[i].post_blob_name});
                const newData = this.base64ToArrayBuffer(postImage.data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
                postFloodFolder.file(filename, newData);
            }
            
            var newCsvData = (i + 1) + "," + images[i].isPaired + "," + images[i].position.lng + "," + images[i].position.lat + "," +  "\"" +images[i].address  +  "\"" + "," + images[i].floodDate + "," + images[i].preSource + "," + images[i].postSource + "," + "\"" + images[i].map_url  +  "\"" + "\n"

            csvContent = csvContent + newCsvData; //new line in CSV
    
            this.setState({
                downloadProgress: 100 * i/images.length
            });
        }        
        
        zip.file("PhotoInfo.csv", csvContent);

        zip.generateAsync({type:"blob"}).then(function (blob) {
            saveAs(blob, "BluPixPhotos.zip"); 
        });

        this.setState({
            downloadProgress: 0,
            downloading: false
        });
    };

    triggerDownload = () => {
        this.setState({
            downloading: true
        },
        this.downloadImages
        );
    }

    getProfiles = () => {
        if(localStorage.getItem("admin")){
            axios.get('http://' + window.$backendDNS + '/api/profile')
            .then((allProfiles) => {
                this.setState({
                    searchText: "",
                    profiles: allProfiles.data,
                    loading: false,
                });
            });
        }
        else{
            return
        } 
    }

    onSelect = (event, newValue) => { 

        if (newValue !== null){ 
            
            var canAdmin, canBan;

            if(newValue.is_admin == true){
                canAdmin = false
            }
            else{
                canAdmin = true
            }

            if(newValue.banned == true){
                canBan = false
            }
            else{
                canBan = true
            }

            this.setState({ 
                selectedUsername: newValue.username,
                selectedID: newValue.id,
                canAdmin: canAdmin,
                canBan: canBan,
            });
        } else { 
            //  A value has been cleared. Dont call anything involving newValue here 
            this.setState({ 
                selectedUsername: ''
            });
        }
        
    }

    handleUpdateInput(text) {
        this.setState({
          searchText: text
        })
    }

// Autocomplete for Banning and Making Users Admins 
    renderAutocomplete = () => {
        return(
            <Mui.Grid item s={5} style={styles.button}>
                <Mui.Grid item s={5} style={styles.button}>
                    <Autocomplete
                        autoComplete
                        autoHighlight
                        selectOnFocus
                        clearOnBlur
                        id="combo-box-demo"
                        options={this.state.profiles}
                        selectOnFocus = {true}
                        getOptionLabel={(option) => {
                            var returnLabel = "";
                            if(option.is_admin == true ){
                                returnLabel = returnLabel + "\uD83D\uDC51 "
                            }
                            if(option.banned == true){
                                returnLabel = returnLabel + "\u26D4 "
                            }
                            return returnLabel + option.username
                        }}
                        style={{ width: 300}}
                        renderInput={(params) => <TextField {...params} label="Search Users..." variant="outlined" />}
                        onChange={this.onSelect}
                        searchText={this.state.searchText}
                        onUpdateInput={this.handleUpdateInput}
                    />
            </Mui.Grid>
            <Mui.Grid item s={5}style={{paddingTop: 10,display: 'flex', alignItems: 'center'}}>
                   {/* Ban and Make Admin Button */}
                    <Mui.Button
                        onClick={this.adminToggle}
                        variant="contained"
                        disabled={this.state.selectedUsername === "" || this.state.loading == true}
                        color="primary"
                        style={{ height: 46, paddingLeft: 10 }}
                    >
                        {this.state.canAdmin ? "Make Admin" : "Remove as Admin"}
                    </Mui.Button>
                    <Mui.Button
                        onClick={this.banToggle}
                        variant="contained"
                        disabled={this.state.selectedUsername === "" || this.state.loading == true}
                        color="secondary"
                        style={{ height: 46, marginLeft: 10 }}
                    >
                        {this.state.canBan ? "Ban Profile" : "Remove Ban"}
                    </Mui.Button>
            </Mui.Grid>
                    <Mui.Typography variant="caption" style={{display: 'flex', alignItems: 'center'}}> 
                        {this.state.confirmationMessage} {this.state.confirmationMessage ? <DoneIcon style={{fontSize: 13}} /> : null }
                    </Mui.Typography>
            </Mui.Grid>
        );
    }

    // Returns Download Database Pics Button
    adminFunctions = () => {
        if(localStorage.getItem("admin")){
                return(
                    <Mui.Grid item s={5} style={styles.button}>
                        <Mui.Button 
                            onClick={this.triggerDownload}
                            variant="contained"
                            size="large"
                            color="primary"
                            fullWidth={true}
                        >
                            Download Database Pictures
                        </Mui.Button>    
                    </Mui.Grid>
                );
        }
        else{
            return null;
        }
    }

    // OnClick for Ban Button
    banToggle = () => {
        this.setState({
            loading: true
        }, () => {
            axios.put('http://' + window.$backendDNS + '/api/profile/' + this.state.selectedID, {banned: this.state.canBan})
            .then(() => {
                var banText;
                if(this.state.canBan){
                    banText = this.state.selectedUsername + " has been banned";
                }
                else {
                    banText =  this.state.selectedUsername + " is no longer banned";
                }
                this.setState({
                    confirmationMessage: banText,
                    canBan: !this.state.canBan
                }, () => {
                    this.getProfiles();
                }
                );
            });
        });
    }

    // onClick for Make Admin Button 
    adminToggle = () => {
        this.setState({
            loading: true
        }, () => {
            axios.put('http://' + window.$backendDNS + '/api/profile/' + this.state.selectedID, {is_admin: this.state.canAdmin})
            .then(() => {
                var adminText;
                if(this.state.canAdmin){
                    adminText = this.state.selectedUsername + " has been made an administrator";
                }
                else {
                    adminText =  this.state.selectedUsername + " is no longer an administrator";
                }
                this.setState({
                    confirmationMessage: adminText,
                    canAdmin: !this.state.canAdmin
                }, () => {
                    this.getProfiles();
                }
                );
            });
        });
    }

    downloadProgressBar = () => {
        if(this.state.downloading){
            return(
                <Mui.LinearProgress variant="determinate" value={this.state.downloadProgress} style={{width: "100%"}}/>
            );
        }
        else {
            return null;
        }
    }   

    //set State Var of entered username and password

    logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('admin');
        localStorage.removeItem('phone');
        localStorage.removeItem('username');
        window.location.href="./Login";
    }

// Returns any content for the page
    content() {
        return(
             <div style={styles.content}>
                <Mui.Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    style={ window.innerWidth < 1000 ? styles.mobileContainer : styles.container }
                    spacing={2}
                >
                {window.innerWidth < 1000 ?
                    <Mui.Grid item s={3} style={{paddingBottom: 0}}>
                        <img
                            style={styles.logo}
                            src={Logo}
                        />
                    </Mui.Grid>
                    :
                    null
                }
                    <Mui.Grid item s={3} style={{paddingBottom: 0}}>
                        <Mui.Typography
                             style={{ fontWeight:900, paddingBottom: 10, marginBottom: 0, color: "#303f9f"}}
                             variant={'h4'}
                        >
                            Hi, {this.state.username}
                        </Mui.Typography>
                    </Mui.Grid>

                    {/* Logout Button */}
                    <Mui.Grid item s={5}>
                        <Mui.Button
                            variant="contained"
                            size="large"
                            color="primary"
                            fullWidth={true}
                            onClick={this.logout}
                        >
                            Logout
                        </Mui.Button>
                    </Mui.Grid>

                    {/* The Survey */}
                    <Mui.Grid item s={5}>
                        <Mui.Button
                            variant="contained"
                            size="large"
                            color="primary"
                            fullWidth={true}
                            component={Link}
                            target="_blank"
                            href="https://tamu.qualtrics.com/jfe/form/SV_3CApQaPgzda1nbD"
                        >
                            Take Survey
                        </Mui.Button>
                    </Mui.Grid>

                    {/* Admin ONLY */}
                    {/* Download DB Button */}
                    {this.adminFunctions()}
                    {this.downloadProgressBar()}

                    {/* User Bannign and Admin Making */}
                    {this.renderAutocomplete()}
                    
                </Mui.Grid>
            </div>
        );
    }

// Renders the Whole Page
    render(){
        return (
            <MuiThemeProvider theme={theme}>
                {this.content()}
            </MuiThemeProvider>
        );
    }

}