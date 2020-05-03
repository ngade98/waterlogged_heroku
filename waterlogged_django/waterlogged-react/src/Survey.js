import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import Logo from './logo-blue.png';


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
}

export default class Survey extends React.Component<Props, States>{
    constructor(props: Props) {
		super(props);
		this.state = {
            userState: 0,
            username: localStorage.getItem("username"),
            downloadProgress: 0,
            downloading: false,
        };
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
                            Flood Research Survey
                        </Mui.Typography>
                    </Mui.Grid>
                    <Mui.Grid item s={3} style={{paddingBottom: 0}}>
                        <Mui.Typography
                             style={{ fontWeight:400, paddingBottom: 10, fontSize: 16, marginBottom: 0}}
                             variant={'body2'}
                        >
                            Hi, please take our survey about floods to further help our research.
                        </Mui.Typography>
                    </Mui.Grid>
                    <Mui.Grid item s={5} style={styles.button}>
                        <Mui.Button
                            variant="contained"
                            size="large"
                            color="primary"
                            fullWidth={true}
                            Component={Link}
                            target="_blank"
                            href="https://tamu.qualtrics.com/jfe/form/SV_3CApQaPgzda1nbD"
                        >
                            Take Survey
                        </Mui.Button>
                      
                    </Mui.Grid>
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