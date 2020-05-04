
import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import Drawer from './HomeNavigation.js';

import AddLocation from './AddLocation.js';
import Approval from './Admin.js';
import ConfirmationPage from './ConfirmationPage';
import CreateAccount from './CreateAccount.js';
import HelpPage from './HelpPage.js';
import Home from './Home.js';
import MyProfile from './MyProfile.js';
import Login from './Login.js';
import MapPage from './MapPage.js';
import ThanksForUploading from './ThanksForUploading';
import UploadWorkflow from './UploadWorkflow';
import Survey from './Survey';


const styles = {
    wrapper: { // holds ALL the contnet for the page
        display: 'flex',
        backgroundColor: '#eceff1',
        height: '100vh',
    },
    mobileWrapper: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#eceff1',
        height: "100vh",
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

export default class App extends React.Component<Props, States>{
    constructor(props: Props) {
		super(props);
		this.state = {
            userState: 0,
		};
	}

    appVersion() {
        const isMobile = window.innerWidth < 1000;
        console.log(window.innerWidth);
        if (isMobile) {
            console.log("we are mobile");
            return(
                  <div style={styles.mobileWrapper}>
                  <Router>

                      <Switch>
                          {/* Mobile Routes*/}
                          <Route exact path="/" component={MapPage} />
                          <Route exact path="/Home" component={UploadWorkflow} />
                          <Route path="/MapPage" component={MapPage} />
                          <Route path="/Login" component={Login} />
                          <Route path="/MyProfile" component={MyProfile} />
                          <Route path="/Help" component={HelpPage}/>
                          <Route path="/CreateAccount" component={CreateAccount}/>
                          <Route path="/Survey" component={Survey}/>
                      </Switch>
                      <Drawer />
                  </Router>
                  </div>
            );
        } else {
            return(
                <div style={styles.wrapper}>
                    <Router>
                        <Drawer />
                        <Switch>
                            {/* Desktop Routes */}
                            <Route exact path="/" component={MapPage} />
                            <Route exact path="/Home" component={UploadWorkflow} />
                            <Route path="/MapPage" component={MapPage} />
                            <Route path="/Login" component={Login} />
                            <Route path="/MyProfile" component={MyProfile} />
                            <Route path="/Approval" component={Approval} />
                            <Route path="/AddLocation" component={AddLocation} />
                            <Route path="/ConfirmationPage" component={ConfirmationPage} />
                            <Route path="/ThanksForUploading" component={ThanksForUploading} />
                            <Route path="/CreateAccount" component={CreateAccount}/>
                            <Route path="/Help" component={HelpPage}/>
                            <Route path="/Survey" component={Survey}/>
                        </Switch>
                    </Router>
                </div>
            );
        }
    }

// Renders the Whole Page
    render(){
        return(
             <div>
                {this.appVersion()}
             </div>
        )
    }
}
