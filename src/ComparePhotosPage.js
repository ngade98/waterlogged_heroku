import React from 'react';

import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import axios from "axios";

const styles = {
    wrapper: { // holds ALL the contnet for the page
        display: 'flex',
        backgroundColor: '#eceff1',
        height: '100vh',
        width: '100%',
    },
    content: { // Holds the content to the right of the menu bar
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 30,
        flexGrow: 1,
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
}

export default class ComparePhotosPage extends React.Component<{}, States>{
    constructor(props: Props) {
		super(props);
		this.state = {
            userState: 0,
            images: []
		};
	}
componentDidMount(){
    this.resetState();
}

resetState = () => {
    this.getImages();
  };

getImages = () =>{

    axios.get('http://' + window.$backendDNS + '/api/image')
    .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
     });

};

// Returns any content for the page
    content() {
        return(
            <div style={styles.content}>

            getImages();
            </div>
        );
    }

// Renders the Whole Page
    render(){
        return(
              <div style={styles.wrapper}>
                {this.content}
              </div>
        )
    }
}
