import React from 'react';
import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import ApprovalNugget from './ApprovalNuggets.js';
import AccessRequestNugget from './AccessRequestNugget.js';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

const styles = {
    wrapper: { // holds ALL the contnet for the page
        display: 'flex',
        backgroundColor: '#eceff1',
        height: '100vh',
        justifyContent: 'center',
    },
    content: { // Holds the content to the right of the menu bar
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: 30,
        width: '100%',
        flexGrow: 1,
        height: '100vh',
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
    value: number;
    hide: boolean; 
}

export default class Admin extends React.Component<{}, States>{
    constructor(props: Props) {
		super(props);
		this.state = {
            userState: 0,
            value: 0,
            pairedImages: [],
            unpairedImages: [],
            unapprovedProfiles: [],
            loading: true,
            showError: false,
        };
        //on load, get stuff to approve
        this.getStuffToApprove();
	}

    //toggles tabs
    handleChange = (event, newValue) => {
        this.setState({
            value: newValue
        });
    };

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
            showError: false,
            loading: true
        }, () => {
            this.getStuffToApprove();
        })
    }

    getStuffToApprove = () => {
        
        //ask database for unapproved pics
        axios.get('http://' + window.$backendDNS + '/api/datasearch/')
        .then(res => {
            console.log(res);
            var unpairedImages = [];
            var pairedImages = [];
            for(var i = 0; i < res.data.length; i++){
                if(res.data[i].preID != null){
                    pairedImages.push(res.data[i]);
                }
                else {
                    unpairedImages.push(res.data[i]);
                }
            }
    
            console.log(pairedImages);
            console.log(unpairedImages);

             //ask database for unapproved profiles
            axios.get('http://' + window.$backendDNS + '/api/profileapprove/').then(profiles => {
                this.setState({
                    pairedImages: pairedImages,
                    unpairedImages: unpairedImages,
                    unapprovedProfiles: profiles.data.unapproved_profiles,
                    loading: false
                });
            }).catch(error => {
                this.setState({
                    loading: false,
                    showError: true
                })
            });
        }).catch(error => {
            this.setState({
                loading: false,
                showError: true
            })
        });
        
    };

    pairedPhotos = () => {
        
        if(this.state.loading){
            return (
                <Mui.LinearProgress />
            );
        }
        else if (this.state.pairedImages.length == 0){
            return (
                <Mui.Typography>
                    No New Photos
                </Mui.Typography>
            );
        }
        else {
            return (
                this.state.pairedImages.map((imageObject) =>
                    <ApprovalNugget image={imageObject}/>
                )
            );
        }
    }

    unpairedPhotos = () => {
        
        if(this.state.loading){
            return (
                <Mui.LinearProgress />
            );
        }
        else if (this.state.unpairedImages.length == 0){
            return (
                <Mui.Typography>
                    No New Photos
                </Mui.Typography>
            );
        }
        else {
            return (
                this.state.unpairedImages.map((imageObject) =>
                <ApprovalNugget image={imageObject} />
                )
            );
        }
    }

    profiles = () => {
        if(this.state.loading){
            return (
                <Mui.LinearProgress />
            );
        }
        else if (this.state.unapprovedProfiles.length == 0){
            return (
                <Mui.Typography>
                    No New Profiles
                </Mui.Typography>
            );
        }
        else {
            return (
                <Mui.Grid container>
                {this.state.unapprovedProfiles.map((profile) =>
                    <AccessRequestNugget username={profile.username} id={profile.id}/>
                )}
                </Mui.Grid>
            );
        }
    }

// Returns any content for the page
    content() {
        return(
            <div style={styles.content}>
                <Mui.Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    variant="fullWidth"
                    style={{width: '90%'}}
                >
                    <Mui.Tab label="Paired Images" />
                    <Mui.Tab label="Un-Paired Images" />
                    <Mui.Tab label="Account Requests" />
                </Mui.Tabs>

                <div hidden={this.state.value !== 0} index={0} style={{width: "85%", paddingTop: 30}}>
                   {this.pairedPhotos()}
                </div>

                <div hidden={this.state.value !== 1} index={1} style={{width: "85%", paddingTop: 30}}>
                    {this.unpairedPhotos()}
                </div>

                <div hidden={this.state.value !== 2} index={2} style={{width: '85%', paddingTop: 30}}>
                    {this.profiles()}    
                </div>
                {this.showErrorMessage()}
            </div>
        );
    }

// Renders the Whole Page
    render(){
        return(
            <MuiThemeProvider theme={theme}>
                {this.content()}
            </MuiThemeProvider>
        )
    }
}
