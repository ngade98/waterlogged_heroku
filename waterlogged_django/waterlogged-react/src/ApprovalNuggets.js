import React from 'react';
import Roboto from './App.css';

import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import Drawer from './HomeNavigation.js';
import Test from './penny.jpeg'
import axios from 'axios';

const styles = {
    wrapper: { // holds ALL the contnet for the page
        display: 'flex',
        backgroundColor: '#eceff1',
        height: '100vh',
        justifyContent: 'space-between',
    },
    content: { // Holds the content to the right of the menu bar
        display:'flex',
        backgroundColor: '#eceff1',
        // justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        paddingBottom: 0,
        // width: '100%',
        flexGrow: 1,
        height: 345,
        justifyContent: 'center',
        flexWrap:"wrap",
    },
    unpairedImgContent: { // Holds the content to the right of the menu bar
        display: 'flex',
        backgroundColor: '#eceff1',
        alignItems: 'center',
        padding: 20,
        flexGrow: 1,
        height: 300,
        justifyContent: 'center',
    },
    buttonHolder: { // holds ALL the contnet for the page
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        width: 200,
        height: 200,
        padding: 30,
    },
};

const theme = createMuiTheme({
  overrides: {
      // overrides here

  },
});

interface Props {
    preFlood: any; // Image tags <img src="ex.jpeg" />
    postFlood: any; // Image tags <img src="ex.jpeg" />
    editOnClick: any; // onClick that sends the Admin to the edit page with all image info
    denyOnClick: any; // has database things
    approveOnClick: any; // has database things
    hide: any;
}
interface States {
    userState: number; // 0 = game, 1 = pass, 2 = kinda, 3 = fail
    openDenialModal: boolean;
    hide: Boolean;
}

export default class ApprovalNugget extends React.Component<{}, States> {
    Inappropriate
    constructor(props: Props) {
		super(props);
		this.state = {
            openDenialModal: false,
            preImage: "",
            postImage: "",
            hide: false,
        };
        this.preFloodImg();
        this.postFloodImg();
    }

    // Opens the modal 
    handleDeny = () => {
        // Launch the denial modal
        this.setState({
            openDenialModal: true,
        });
    }

    // CLoses the modal 
    handleClose = () => {
        this.setState({
            openDenialModal: false,
        });

    }

    // Handles the CONFIRMED denial - deletes from database
    handleDelete = () => {
        if(this.props.image.preID && this.props.image.postID){ //if it's a paired image
            axios.delete('http://' + window.$backendDNS + '/api/image/' + this.props.image.preID)
            .then(pre => {
                console.log("preImage deleted: ", pre);
                axios.delete('http://' + window.$backendDNS + '/api/image/' + this.props.image.postID)
                .then(post => {
                    console.log("postImage deleted: ", post);
                });
            });
        }
        else if(this.props.image.postID && (this.props.image.preID == null)){ //there's just a post image
            axios.delete('http://' + window.$backendDNS + '/api/image/' + this.props.image.postID)
            .then(post => {
                console.log("postImage deleted: ", post);
            });
        }
        else if(this.props.image.preID && (this.props.image.postID == null)){ //there's just a pre image
            axios.delete('http://' + window.$backendDNS + '/api/image/' + this.props.image.preID)
            .then(pre => {
                console.log("preImage deleted: ", pre);
            });
        }
        else {
            console.log("error");
            return;
        }
        this.setState({
            openDenialModal: false,
            hide: true,
        });
    }

    handleChecked = () => {
    }

    approveBothImages = () => {
        axios.put('http://' + window.$backendDNS + '/api/image/' + this.props.image.preID, {image: {approved_by_admin: true}})
        .then(pre => {
            console.log("preImage approved: ", pre);
            axios.put('http://' + window.$backendDNS + '/api/image/' + this.props.image.postID, {image: {approved_by_admin: true}})
            .then(post => {
                console.log("postImage approved: ", post);
            });
        });
        this.setState({
            hide: true,
        });
    }

    approvePostImage = () => {
        axios.put('http://' + window.$backendDNS + '/api/image/' + this.props.image.postID, {image: {approved_by_admin: true}})
        .then(post => {
            console.log("postImage approved: ", post);
            axios.delete('http://' + window.$backendDNS + '/api/image/' + this.props.image.preID)
            .then(pre => {
                console.log("preImage deleted: ", pre);
            });
        });
        this.setState({
            hide: true,
        });
    }

    getReasonsForDenial() {
        return ['Inappropriate', 'Waterline not visible', 'Stop sign not in full view', 'Duplicate Image'];
    }

    preFloodImg = () => {
        //go get the pre image
        axios.post('http://' + window.$backendDNS + '/api/receive/', {blob_name: this.props.image.pre_blob_name})
        .then((response) => {
            console.log(response)
            this.setState({
                preImage: response.data
            });
        });
    }

    postFloodImg = () => {
        //go get the post image
        axios.post('http://' + window.$backendDNS + '/api/receive/', {blob_name: this.props.image.post_blob_name})
        .then((response) => {
            console.log(response)
            this.setState({
                postImage: response.data
            });
        });
    }

// Returns any content for the page
    content() {
        return(
            <div style={this.props.image.preID && this.props.image.postID ? styles.content : styles.unpairedImgContent}>
                <Mui.GridList
                    cellHeight={this.props.image.preID && this.props.image.postID ? 345 : 345}
                    cols={this.props.image.preID && this.props.image.postID ? 2 : 1}
                    style={this.props.image.preID && this.props.image.postID ? {width: 470} : {width: 230}}
                >
                    <Mui.GridListTile hidden={this.props.image.preID == null}>
                        <img src ={this.state.preImage}/> 
                    </Mui.GridListTile>
                    <Mui.GridListTile hidden={this.props.image.postID == null}>
                        <img src ={this.state.postImage}/> 
                    </Mui.GridListTile>
                </Mui.GridList>

                <div style={styles.buttonHolder}>
                    {this.props.image.preID && this.props.image.postID ? <Mui.Button variant="contained" color="primary" children="Approve Pair" onClick={this.approveBothImages}/> : null }
                    <Mui.Button variant="contained" color="primary" children="Approve Only Post" onClick={this.approvePostImage}/>
                    <Mui.Button variant="contained" color="secondary" children={this.props.image.preID && this.props.image.postID ? "Deny Both Images" : "Deny Image"} onClick={this.handleDeny}/>
                </div>

                <Mui.Modal
                   open={this.state.openDenialModal}
                   onClose={this.handleClose}
                   style={{marginLeft: '40%', marginTop: '10%'}}
                 >
                     <Mui.Card variant="outlined" style={{width: 350}}>
                           <Mui.CardContent>
                             <Mui.Typography color="textSecondary" gutterBottom>
                              Reasons for denial
                             </Mui.Typography>

                             <Mui.List dense={true}>
                                {this.getReasonsForDenial().map(value => {
                                    const labelId = `checkbox-list-label-${value}`;
                                        return (
                                            <Mui.ListItem
                                                key={value}
                                                role={undefined}
                                                dense
                                                button
                                                style={{paddingBottom: 0, paddingTop: 0}}
                                            // onClick={handleToggle(value)}
                                            >
                                                <Mui.ListItemIcon>
                                                  <Mui.Checkbox
                                                    edge="start"
                                                    style={{padding: 4}}
                                                    color={'primary'}
                                                    value={value}
                                                    // onChange={(e)=>{this.handleChecked}}
                                                    // checked={checked.indexOf(value) !== -1}
                                                    // tabIndex={-1}
                                                    disableRipple
                                                    // inputProps={{ 'aria-labelledby': labelId }}
                                                  />
                                                </Mui.ListItemIcon>
                                                <Mui.ListItemText
                                                    id={1}
                                                    primary={`${value}`}
                                                />
                                            </Mui.ListItem>
                                        );
                                })}
                            </Mui.List>
                           </Mui.CardContent>

                           <Mui.CardActions>
                             <Mui.Button
                                size="small"
                                color="primary"
                                onClick={this.handleDelete}
                            >
                                Confirm Denial
                            </Mui.Button>
                             <Mui.Button
                                size="small"
                                style={{color: '#9e9e9e'}}
                                onClick={this.handleClose}
                            >
                                Cancel
                            </Mui.Button>
                           </Mui.CardActions>
                     </Mui.Card>
                </Mui.Modal>
            </div>
        );
    }

// Renders the Whole Page
    render(){
        return(
            <MuiThemeProvider theme={theme}>

                {this.state.hide ? null : this.content()}

          </MuiThemeProvider>
        )
    }
}
