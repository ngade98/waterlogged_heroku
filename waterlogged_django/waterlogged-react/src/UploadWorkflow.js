import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';

import Home from './Home';
import AddLocation from './AddLocation';
import ConfirmationPage from './ConfirmationPage';
import PrePhotoOptions from './PrePhotoOptions.js';

const styles = {
    wrapper: { // holds ALL the contnet for the page
        display: 'flex',
        backgroundColor: '#eceff1',
        height: '100vh',
        width: '100%',
    },
    content: { // Holds the content to the right of the menu bar
        display: 'flex',

        justifyContent: 'space-evenly',
        paddingTop: 30,
        paddingLeft: 50,
        paddingRight: 50,
        width: '130%',
    },
    stepper: { // sets the width

        width: '100',
    },
};

const theme = createMuiTheme({
  overrides: {
      // overrides here
      MuiStepper: {
          root: {
              backgroundColor: '#eceff1'
          },
      },

  },
});

interface Props {
    title: string;
}
interface States {
    userState: number;
    activeStep: number;
    imagePath: any; 
    imageid: number;
    imageLat: any;
    imageLon: any;
    PreImagePath: any;
    PreImageLat: any;
    PreImageLon: any; 
    PreImageURL: any;
    PreImageURLTwo: any; 
    PreImageLinkURL: any;
    PreImageJSONData: any; 
}

export default class UploadWorkflow extends React.Component<Props, States>{
    constructor(props: Props) {
		super(props);
        if(localStorage.getItem("activeStep") == null){
            this.state = {
                userState: 0,
                activeStep: 0
            };
            localStorage.setItem("activeStep", 0);
        }
        else {
            this.state = {
                userState: 0,
                activeStep: parseInt(localStorage.getItem("activeStep"))
            };
        }
	}

    steps =  ['Upload Post-Photo', 'Upload Pre-Photo', 'Submit'];

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return <Home nextBtn={this.handleNext} skipNextBtn={this.handleSkip}/>;
            case 1:
                return <PrePhotoOptions backBtn={this.handleBack} nextBtn={this.handleNext} skipNextBtn={this.handleSkip}/>;
            case 2:
                return <AddLocation nextBtn={this.handleNext} backBtn={this.handleBack} skipBackBtn={this.handleSkipBack}/>;
            case 3:
                return <ConfirmationPage submitBtn={this.handleNext} backBtn={this.handleBack} skipBackBtn={this.handleSkipBack}/>;
            case 4:
                return <ConfirmationPage submitBtn={this.handleNext}/>;
            default:
                return <Home nextBtn={this.handleNext} skipNextBtn={this.handleSkip}/>;
        }
    }

    handleNext = () =>  {
        localStorage.setItem("activeStep", this.state.activeStep + 1);
        this.setState({
            activeStep: parseInt(localStorage.getItem("activeStep"))
        });
    }

    handleBack = () =>  {
        localStorage.setItem("activeStep", this.state.activeStep - 1);
        this.setState({
            activeStep: parseInt(localStorage.getItem("activeStep"))
        });
    }

    handleSkip = () => {
        localStorage.setItem("activeStep", this.state.activeStep + 2);
        this.setState({
            activeStep: parseInt(localStorage.getItem("activeStep"))
        });
    }
    
    handleSkipBack = () => {
        localStorage.setItem("activeStep", this.state.activeStep - 2);
        this.setState({
            activeStep: parseInt(localStorage.getItem("activeStep"))
        });
    }

// Returns any content for the page
    content() {
            const isMobile = window.innerWidth < 1000;
            if (isMobile) {
                return(
                    <div style={{width: '100%'}}>
                        <MuiThemeProvider theme={theme}>
                            <Mui.Stepper
                                activeStep={this.state.activeStep}
                                alternativeLabel
                                style={{paddingLeft: 20,paddingRight: 20, paddingBottom:0}}
                            >
                                {this.steps.map(label => (
                                    <Mui.Step key={label}>
                                      <Mui.StepLabel>{label}</Mui.StepLabel>
                                    </Mui.Step>
                                ))}
                            </Mui.Stepper>
                            <div style={{height: '85%'}}>
                                {this.getStepContent(this.state.activeStep)}
                            </div>
                        </MuiThemeProvider>
                    </div>
                );
            }
            else {
                return(
                    <div style={{width: '100%', marginTop: 20}}>
                        <MuiThemeProvider theme={theme}>
                            <Mui.Stepper
                                activeStep={this.state.activeStep}
                                // alternativeLabel
                                style={{paddingLeft: 50,paddingRight: 50, paddingBottom:0}}
                            >
                                {this.steps.map(label => (
                                    <Mui.Step key={label}>
                                        <Mui.StepLabel>{label}</Mui.StepLabel>
                                    </Mui.Step>
                                ))}
                            </Mui.Stepper>
                            {this.getStepContent(this.state.activeStep)}
                        </MuiThemeProvider>
                    </div>
                );
            }
    }

// Renders the Whole Page
    render(){
        return(
              <div style={styles.wrapper}>
                    {this.content()}
              </div>
        )
    }
}
