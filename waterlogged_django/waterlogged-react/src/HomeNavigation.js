import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';

import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AccountIcon from '@material-ui/icons/AccountCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import HelpIcon from '@material-ui/icons/Help';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import RoomIcon from '@material-ui/icons/Room';
import PublishIcon from '@material-ui/icons/Publish';

import Logo from './Logo-white.png';
import UploadButton from './UploadButton';


const styles = {
    gap: { // space between the list and image in drawer
        paddingTop: 10,
    },
    logo: {
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20,
        width: 180,
    },
    list: { // Centers the lists text
        '&$selected': {
            '&$hover': {
                color: '#000000',
            },
            color: '#000000',
        },
    },
    bottomNav: { // Sets Width and Color of Bottom Nav
        width: "100%",
        backgroundColor: '#303f9f',
        marginTop: 'auto',
    },
    icon: { 
        '&$selected': {
            '&$hover': {
                color: '#FFDE03',
            },
            color: '#FFDE03',
        },
        '&$hover': {
            color: '#FFDE03',
        },

    },
};

const theme = createMuiTheme({
    overrides: {
        // insert overrides here
        MuiDrawer: {
            paper: {
                backgroundColor: '#303f9f'
            },
            root: {
                flexShrink: 0 ,
                width: 220,
            },
        },
        MuiListItemText: {
            root: {

                fontFamily: 'Roboto',
                // color: '#ffffff',
                '&$hover': {
                    color: '#000000'

                },
            },
            primary: {
                // color: '#ffffff',
                '&$hover': {
                    color: '#000000'
                },
            },
        },
        MuiListItemIcon: {
            root: {
                color: "inherit",
                '&:hover': {
                    color: '#FFDE03',
                },
                '&:selected': { // this makes them different colors when they selected
                    color: '#FFDE03',
                    '&:hover': { // this makes them different colors when they selected
                        color: '#FFDE03',
                    },
                },
            },
        },
        MuiListItem: {
            root: {
                // fontWeight: 700,
                '&$selected': { // this makes them different colors when they selected
                    color: '#FFDE03',
                    fontWeight: 900,
                    // backgroundColor: '#transparent',
                    '&$hover': { // this makes them different colors when they selected
                        color: '#FFDE03',
                        fontWeight: 900,
                        // backgroundColor: '#transparent',
                    },
                },
                fontFamily: 'Roboto',
                fontWeight: 400,
                // backgroundColor: '#transparent',
            },
            button: {
                color: '#ffffff',
                fontWeight: 400,
                fontFamily: 'Roboto',
                    '&:hover': { // this is the hover color
                        color: '#FFDE03',
                        fontWeight: 900,
                        // backgroundColor: 'transparent',
                        '&:selected': { //
                            color: '#FFDE03',
                            fontWeight: 900,
                        },
                    },
                },
            },
        },
});

interface Props {
    userType?: number;
}
interface States {
    userType: number; // 0 = normal, 1 = admin
    sideNavSelected: number; //
    selected: string;
}

export default class HomeNavigation extends React.Component<Props, States>{
    selectedTab: number;
    constructor(props: Props) {
		super(props);
		this.state = {
            userType: 0, // default user is normal
            selected: "false",
            sideNavSelected: null,
		};
	}

    handleClick  = (event, index) => {
        const sel = index;
        this.selectedTab = index;
        this.setState({
            sideNavSelected: this.selectedTab,
        });

    };

    loginCheck () { 
        if (localStorage.getItem("username") || localStorage.getItem("phone") || localStorage.getItem("admin")) { // If they are logged in 
            return "/MyProfile";
        } else {  // If the aren't 
            return "/Login";
        }
    }

// Returns the Drawer
    Drawer() {
        const isMobile = window.innerWidth < 800;
        if (isMobile) {
            return(
                <Mui.BottomNavigation
                    showLabels={true}
                    style={styles.bottomNav}
                    value={this.state.selected}
                    onChange={(event,newValue) => {this.setState({selected: newValue})}}
                >
                    <Mui.BottomNavigationAction
                        label="Upload"
                        component={Link}
                        to="/Home"
                        style={{color: this.state.selected === "upload" ? "#FFDE03" : "#ffffff"}}
                        icon={<PublishIcon />}
                        value={"upload"}
                    />
                    <Mui.BottomNavigationAction
                        label="Map"
                        component={Link}
                        to="/MapPage"
                        style={{color: this.state.selected === "map" ? "#FFDE03" : "#ffffff"}}
                        icon={<RoomIcon  />}
                        value={"map"}
                    />
                    <Mui.BottomNavigationAction
                        label="Account"
                        component={Link}
                        to="/Login"
                        style={{color: this.state.selected === "account" ? "#FFDE03" : "#ffffff"}}
                        icon={<AccountIcon  />}
                        value={"account"}
                    />
                    <Mui.BottomNavigationAction
                        label="Help"
                        component={Link}
                        to="/Help"
                        style={{color: this.state.selected === "help" ? "#FFDE03" : "#ffffff"}}
                        icon={<HelpIcon />}
                        value={"help"}
                    />
                </Mui.BottomNavigation>
            );
        } else {
            return(
                 <MuiThemeProvider theme={theme}>
                <Mui.Drawer
                    variant="permanent"
                    anchor="left"
                >
                <img
                    style={styles.logo}
                    src={Logo}
                />
                <div style={styles.gap} />
                <div style={styles.hide}> </div>
                    <Mui.List
                        component='nav'
                    >
                        {/* Home Page */}
                        <Mui.ListItem
                            button
                            key={'Upload Photo'}
                            component={Link}
                            to="/Home"
                            // alignItems={'center'}
                            selected={this.state.sideNavSelected === 0}
                            // selected={this.selectedTab === 0 ? true : false}
                            onClick={event => this.handleClick(event, 0)}
                        >
                            <Mui.ListItemIcon> <CloudUploadIcon /> </Mui.ListItemIcon>
                            <Mui.ListItemText primary={'Upload Photo'} disableTypography={true}/>
                        </Mui.ListItem>
                        {/* Map Page */}
                        <Mui.ListItem
                            button
                            key={'Map'}
                            component={Link}
                            to="/MapPage"
                            // alignItems={'center'}
                            selected={this.state.sideNavSelected === 1}
                            // selected={this.selectedTab === 1 ? true : false}
                            onClick={event => this.handleClick(event, 1)}
                        >
                            <Mui.ListItemIcon> <RoomIcon /> </Mui.ListItemIcon> 
                            <Mui.ListItemText primary={'Map'} disableTypography={true}/>
                        </Mui.ListItem>
                        {/* Admin Page */}
                        <Mui.ListItem
                            button
                            key={'Approval'}
                            component={Link}
                            to="/Approval"
                            // alignItems={'center'}
                            selected={this.state.sideNavSelected === 3}
                            // selected={this.selectedTab === 3 ? true : false}
                            onClick={event => this.handleClick(event, 3)}
                        >
                            <Mui.ListItemIcon> <LibraryAddCheckIcon /> </Mui.ListItemIcon> 
                            {/* <Mui.ListItemIcon> <CheckCircleIcon /> </Mui.ListItemIcon>  */}
                            <Mui.ListItemText primary={'Approval'} disableTypography={true} />
                        </Mui.ListItem>
                        
                        {/* Login/Profile Page */}
                        <Mui.ListItem
                            button
                            key={'My Profile'}
                            component={Link}
                            to={this.loginCheck()}
                            // alignItems={'center'}
                            selected={this.state.sideNavSelected === 2}
                            // selected={this.selectedTab === 2 ? true : false}
                            onClick={event => this.handleClick(event, 2)}
                        >
                            <Mui.ListItemIcon> <AccountBoxIcon /> </Mui.ListItemIcon> 
                            {/* <Mui.ListItemIcon> <AccountIcon /> </Mui.ListItemIcon> */}
                            <Mui.ListItemText primary={'My Profile'} disableTypography={true} />
                        </Mui.ListItem>
                        {/* Howto Page */}
                        <Mui.ListItem
                            button
                            key={'Help'}
                            component={Link}
                            to="/Help"
                            // alignItems={'center'}
                            selected={this.state.sideNavSelected === 4}
                            // selected={this.selectedTab === 3 ? true : false}
                            onClick={event => this.handleClick(event, 4)}
                        >
                            <Mui.ListItemIcon> <HelpIcon /> </Mui.ListItemIcon> 
                            <Mui.ListItemText primary={'Help'} disableTypography={true} />
                        </Mui.ListItem>
                        <Mui.Divider light={false}/>
                        {/* The Survey */}
                        <Mui.ListItem
                            button
                            key={'Survey'}
                            component={Link}
                            to="/Survey"
                            // alignItems={'center'}
                            selected={this.state.sideNavSelected === 5}
                            // selected={this.selectedTab === 3 ? true : false}
                            onClick={event => this.handleClick(event, 5)}
                        >
                            <Mui.ListItemIcon> <AssignmentIcon /> </Mui.ListItemIcon> 
                            <Mui.ListItemText primary={'Take Survey'} disableTypography={true} />
                        </Mui.ListItem>
                    </Mui.List>

                    <Mui.Typography variant="caption" style={{display: 'flex', marginTop: 'auto', paddingLeft: 16, color: '#ffffff'}}>
                    BluPix v.2020.1
                    </Mui.Typography>
                </Mui.Drawer>
                 </MuiThemeProvider>
            );
        }
    }

    render(){
        return(
          <MuiThemeProvider theme={theme}>
              {this.Drawer()}
          </MuiThemeProvider>
        )
    }
}
