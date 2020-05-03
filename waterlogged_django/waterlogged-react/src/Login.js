import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import Logo from './logo-blue.png';
import axios from 'axios';

import NumberFormat from 'react-number-format';

const styles = {

    content: { // Holds the content to the right of the menu bar
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: -30,
        width: '100%',
        flexGrow: 1,
        height: '90vh',
    },
    login:{
        border: "1px solid #9e9e9e",
        backgroundColor: '#eceff1',
        borderRadius: 20,
        margin: 'auto',
        maxWidth: 800,
        padding: 40,
    },
    button: {
        width: '100%'
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
    phoneNumber: string,
    password: string,
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            format="+1 (###) ###-####" mask="_"
            isNumericString
        />
    );
  }


export default class Login extends React.Component<{}, States>{
    constructor(props: Props) {
		super(props);
		this.state = {
            userState: 0,
            phoneNumber: '',
            password: '',
            badSignIn:false,
            errorMessage: null,
            loading: false
		};
	}

    LoginClick = async () => {
        this.setState({
            loading: true,
            errorMessage: null,
            badSignIn: false 
        });

        //check phone/username input
        if(this.state.phoneNumber.length < 1){
            this.setState({
                loading: false,
                badSignIn: true,
                errorMessage: "Phone Number Empty"
            });
            return;
        }

        if(this.state.password.length < 1){
            this.setState({
                loading: false,
                badSignIn: true,
                errorMessage: "Password Empty"
            });
            return;
        }

        try {
            var loginResponse = await axios.post('http://' + window.$backendDNS + '/api/login/', {phone_number: this.state.phoneNumber, password: this.state.password});

            console.log(loginResponse)


            if(loginResponse.data.Failure){
                var msg = "No account found"
                if(loginResponse.data.Failure == "this user is banned!"){
                    msg = "User is banned"
                }
                this.setState({
                    loading: false,
                    badSignIn: true,
                    errorMessage: "Login Failed: " + msg
                });
                return;
            }

            var accessToken = "blahblahblah"; //placeholder
            var refreshToken = "blahblah"; //placeholder

            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('username', loginResponse.data[0].username);
            localStorage.setItem('phone', loginResponse.data[0].phone_number);
            localStorage.setItem('admin', loginResponse.data[0].is_admin);

            window.location.href="./MyProfile";
            return;
        }
        catch(err) {
            console.log(err);
            this.setState({
                loading: false,
                badSignIn: true,
                errorMessage: "Could not connect to server. Please try again"
            });
            return;
        }
     }

    //set State Var of entered username and password
    handleNumberChange = (event) => {
        this.setState({
            phoneNumber: event.target.value
        });
    }

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value
        });
    }

    errorMessage = () => {
        if(this.state.badSignIn){
            return(
                <Mui.Grid item s={3} style={{paddingTop: 0, width: "100%"}}>
                    <Alert severity="error"  onClose={this.closeAlert}>
                        {this.state.errorMessage}
                    </Alert>
                </Mui.Grid>
            );
        }
    }

    closeAlert = () => {
        this.setState({
            badSignIn: false,
            errorMessage: null 
        });
    };

    loadingIcon = () => {
        if(this.state.loading){
            return(
                <Mui.Grid item s={3} style={{paddingTop: 0, marginLeft:"auto", marginRight: "auto"}}>
                    <Mui.CircularProgress style={{margin:"auto"}}/>
                </Mui.Grid>
            );
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
                            children={"Login"}
                        />
                    </Mui.Grid>

                    {this.errorMessage()}

                    <Mui.Grid item s={3} style={{paddingTop: 0, width: "100%"}}>
                         <Mui.TextField
                            label="Phone Number"
                            placeholder="Phone Number"
                            margin="none"
                            variant="outlined"
                            fullWidth={true}
                            onChange={this.handleNumberChange}
                            id="formatted-numberformat-input"
                            InputProps={{
                                inputComponent: NumberFormatCustom,
                            }}
                    />
                    </Mui.Grid>

                    <Mui.Grid item s={3} style={{paddingTop: 0, width: "100%"}}>
                        <Mui.TextField
                            label="Password"
                            placeholder="Password"
                            type="password"
                            margin="normal"
                            InputLabelProps={{shrink: true}}
                            variant="outlined"
                            fullWidth={true}
                            onChange={this.handlePasswordChange}
                        />
                    </Mui.Grid>

                    <Mui.Grid item s={5} style={styles.button}>
                        <Mui.Button
                            variant="contained"
                            size="large"
                            color="primary"
                            fullWidth={true}
                            onClick={this.LoginClick}
                        >
                            Login
                        </Mui.Button>
                    </Mui.Grid>

                    <Mui.Grid item s={5} style={styles.button}>
                        <Mui.Button 
                            variant="contained"
                            size="large" 
                            fullWidth={true} 
                            component={Link}
                            to="/CreateAccount"
                        >
                            Create Account
                        </Mui.Button>
                    </Mui.Grid>

                    {this.loadingIcon()}

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