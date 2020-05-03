import React from 'react';
import Roboto from './App.css';

import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import Drawer from './HomeNavigation.js';

import NotInterestedIcon from '@material-ui/icons/NotInterested';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import axios from 'axios';

const styles = {
    approve: {
        '&-hover': {
            color: '#4caf50',
        },
    }
};

const theme = createMuiTheme({
  overrides: {
      // overrides here

  },
});

interface Props {
    username: string,
    approveOnClick: any, // Function for approving request
    denyOnClick: any, // Function for denying request
}
interface States {
    hide: Boolean,
}

export default class AccessRequestNugget extends React.Component<{}, States>{
    constructor(props: Props) {
		super(props);
		this.state = {
            hide: false,
		};
	}

    approveOnClick = () => {
        console.log("Approve profile #", this.props.id);

        const approveJSON = {
            approved_by_admin: true
        };
        axios.put('http://' + window.$backendDNS + '/api/profile/' + this.props.id, approveJSON).then(res => {
            console.log(res);
        });

        this.setState({
            hide: true,
        });
    }

    denyOnClick = () => {
        console.log("Delete profile #", this.props.id);
        axios.delete('http://' + window.$backendDNS + '/api/profile/' + this.props.id).then(res => {
            console.log(res);
        });
        this.setState({
            hide: true,
        });
    }


// Returns any content for the page
    content() {
        return(
            <Mui.Grid item xs={12} md={6}>
                <Mui.List dense={true}>
                    <Mui.ListItem>
                        <Mui.ListItemAvatar>
                            <Mui.Avatar/>
                        </Mui.ListItemAvatar>
                        <Mui.ListItemText
                            primary={this.props.username}
                        />
                        <Mui.ListItemSecondaryAction>
                            <Mui.IconButton edge="end" aria-label="delete" onClick={this.approveOnClick}>
                                <CheckCircleIcon />
                            </Mui.IconButton>
                            <Mui.IconButton edge="end" aria-label="delete" onClick={this.denyOnClick}>
                                <NotInterestedIcon />
                            </Mui.IconButton>
                        </Mui.ListItemSecondaryAction>
                    </Mui.ListItem>
                </Mui.List>
            </Mui.Grid>
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
