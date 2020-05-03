import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import Logo from './logo-blue.png';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import wordFilter from 'bad-words';

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
    button: {
        width: '100%',
        // marginBottom: 20,
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

}

interface States {
    phoneNumber: string;
    username: string;
    password: string;
    confirmedPassword: String;  
}

var filter = new wordFilter();

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


export default class CreateAccount extends React.Component<{}, States>{
    constructor(props: Props) {
		super(props);
		this.state = {
            phoneNumber: "",
            username: "",
            password: "",
            confirmedPassword: "",
            badCreate: false,
            errorMessage: null,
            loading: false,
            badUser: false
		};
	}

    createAccount = async () => {
        if(this.state.phoneNumber.length < 10){
            this.setState({
                badCreate: true,
                errorMessage: "Invalid Phone Number" 
            });
            return
        }
        if(this.state.username.length < 1){
            this.setState({
                badCreate: true,
                errorMessage: "Username empty" 
            });
            return;
        }
        if(this.state.username.length > 16){
            this.setState({
                badCreate: true,
                errorMessage: "Username is too long: Max 16 characters" 
            });
            return;
        }
        var regex = /^[A-Za-z0-9 ]+$/
        var isValid = regex.test(this.state.username);
        if(filter.isProfane(this.state.username) || !isValid){
            this.setState({
                badCreate: true,
                errorMessage: "Please choose another username" 
            });
            return;
        }
        if(this.state.password.length < 1){
            this.setState({
                badCreate: true,
                errorMessage: "Password Empty" 
            });
            return;
        }
        if(this.state.password.length < 8){
            this.setState({
                badCreate: true,
                errorMessage: "Password too short: Min 8 characters" 
            });
            return;
        }
        if(this.state.password.length > 64){
            this.setState({
                badCreate: true,
                errorMessage: "Password too long: Max 64 characters" 
            });
            return;
        }
        if(!this.confirmPasswords()){
            this.setState({
                badCreate: true,
                errorMessage: "Passwords do not match" 
            });
            return;
        }

        this.setState({
            badCreate: false,
            errorMessage: null,
            loading: true 
        });

        try{
            var createAccountResponse = await axios.post('http://' + window.$backendDNS + '/api/profile/', {username: this.state.username, phone_number: this.state.phoneNumber, is_admin: false, approved_by_admin: false, password: this.state.password});

            //check that phone number/username doesnt already exist here
            var goodResponse = true;

            if(goodResponse){
                window.location.href="./Login";
                return;
            }
            else{
                this.setState({
                    badCreate: true,
                    errorMessage: "Error on Post",
                    loading: false 
                });
                return;
            }
        }
        catch(err){
            this.setState({
                badCreate: true,
                errorMessage: "Server Error",
                loading: false 
            });
            return;
        }
    }

    // Stores phone number
    updatePhoneNumber = (event) => { 
        this.setState({ 
            phoneNumber: event.target.value
        });
    }

    // Stores username
    updateUsername = (event) => { 
        var regex = /^[A-Za-z0-9 ]+$/
        var isValid = regex.test(event.target.value);
        
        if (!isValid) {
            this.setState({ 
                badUser: true
            });
        }
        else {
            this.setState({ 
                badUser: false
            });
        }

        this.setState({ 
            username: event.target.value
        });
    }

    // Stores password
    updatePassword = (event) => { 
        this.setState({ 
            password: event.target.value
        });
    }

    // Stores 'confirmed' password for checking purposes 
    updateConfirmedPassword = (event) => { 
        this.setState({ 
            confirmedPassword: event.target.value
        });
    }

    // checks if the passwords are the same 
    confirmPasswords = () => { 
        // if the two states are same then set true, else show an error
        if (this.state.password === this.state.confirmedPassword){ 
            return true;
        }
        return false;
    }

    errorMessage = () => {
        if(this.state.badCreate){
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
            badCreate: false,
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
        }
        else {
            return(
                <Mui.Grid item s={3} style={{paddingBottom: 0}}>
                    <Mui.Typography
                        style={{paddingBottom: 10, marginBottom: 0, color: "#303f9f", textDecoration: "none"}}
                        variant={'body1'}
                        children={"Back to Login"}
                        component={Link}
                        to="/Login"
                    />
                </Mui.Grid>
            );
        }
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

                <Mui.Grid item s={3} style={window.innerWidth < 800 ? {paddingBottom: 0} : {paddingTop: 100, paddingBottom: 0}}>
                    <Mui.Typography
                        style={{ fontWeight:900, paddingBottom: 10, marginBottom: 0, color: "#303f9f"}}
                        variant={'h4'}
                        children={"Create Account"}
                    />
                </Mui.Grid>

                {this.errorMessage()}


                <Mui.Grid item s={3} style={{paddingTop: 0, width: "100%"}}>
                    <Mui.TextField
                        required
                        error = {this.state.phoneNumber.length > 12}
                        label="Phone Number"
                        placeholder="Phone Number"
                        margin="none"
                        variant="outlined"
                        fullWidth={true}
                        value={this.state.phoneNumber}
                        onChange={this.updatePhoneNumber}
                        id="formatted-numberformat-input"
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                        }}
                    />
                </Mui.Grid>

                <Mui.Grid item s={3} style={{paddingTop: 5, width: "100%"}}>
                    <Mui.TextField
                        required
                        label="Username"
                        placeholder="Username (1 - 16 characters)"
                        onChange = {this.updateUsername}
                        value= {this.state.username}
                        margin="none"
                        variant="outlined"
                        fullWidth={true}
                        helperText={this.state.badUser ? "Username can only contain letters and numbers" : null}
                    />
                </Mui.Grid>

                <Mui.Grid item s={3} style={{paddingTop: 5, width: "100%"}}>
                    <Mui.TextField
                        required
                        label="Password"
                        placeholder="Password (8 - 64 characters)"
                        onChange = {this.updatePassword}
                        value= {this.state.password}
                        margin="none"
                        type="password"
                        variant="outlined"
                        fullWidth={true}
                    />
                </Mui.Grid>

                <Mui.Grid item s={3} style={{paddingTop: 5, width: "100%", paddingBottom: 20}}>
                    <Mui.TextField
                        required
                        error={!this.confirmPasswords()}
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        onChange = {this.updateConfirmedPassword}
                        value= {this.state.confirmedPassword}
                        margin="none"
                        type="password"
                        variant="outlined"
                        helperText={(this.confirmPasswords()) && !(this.state.updateConfirmedPassword === "") ? null : "Passwords do not match"}
                        fullWidth={true}
                    />
                </Mui.Grid>

                <Mui.Grid item s={3} style={styles.button}>
                    <Mui.Button 
                        color="primary"
                        variant="contained"
                        size="large" 
                        fullWidth={true} 
                        onClick={this.createAccount}
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
        return(
            <MuiThemeProvider theme={theme}>
                {this.content()}
            </MuiThemeProvider>
        )
    }
}
