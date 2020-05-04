import React from 'react';

import * as Mui from '@material-ui/core';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import RoomIcon from '@material-ui/icons/Room';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ExImg1 from './ExampleImages/9_PostFlood.jpg';
import ExImg2 from './ExampleImages/9_PreFlood.jpg';

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
        flexGrow: 1,
    },
    mobile: { 
        display: 'flex',
        justifyContent: 'center',
        // paddingTop: 30,
        flexGrow: 1,
    },
    boxes: { // Desktop, holds the 2 sides of help content 
        display: 'flex',
        width: '45%',
        flexDirection: 'column',
        height: 'fit-content'
        // height: '80%'
    },
    titles: { 
        color: '#3f51b5',
        fontWeight: 900,
    },
    keywords: { 
        color: '#3f51b5',
       fontWeight: 900
    },
    imgTitle: {
        background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    test: {
       height: 20,
       marginTop: 2, 
    }
};

const theme = createMuiTheme({
  overrides: {
      MuiExpansionPanel: { 
        root: { 
            '&$expanded': {
                margin: 0,
            },
        },
      },

  },
});


const mobileTheme = createMuiTheme({
    overrides: {
        MuiExpansionPanel: { 
          root: { 
            //   height: 20,
              '&$expanded': {
                  margin: 0,
              },
          },
        },
        MuiExpansionPanelSummary: { 
            root: { 
                height: 20,
                '&$expanded': {
                    margin: 0,
                },
            },
            content: { 
                margin: 0,
                '&$expanded': {
                    margin: 0,
                },
            },
        },
        MuiExpansionPanelDetails: { 
            root: {
                height: 200,
                overflow: 'auto',
                paddingBottom: 20,
                background:
                'linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,0) 20%)',
            },     
        },
        MuiTypography: {
            body1: {
                fontSize: "0.85rem",
            },
        },
    },
  });

interface Props {
    title: string;
}
interface States {
    expanded1: string,
    expanded2: string,
}

export default class HelpPage extends React.Component<{}, States>{
    isMobile = window.innerWidth < 1000;
    constructor(props) {
		super(props);
		this.state = {
            expanded1: this.isMobile ? false : "panel1",
            expanded2: this.isMobile? false : "panel4",
		};
    }
    
    handleChange = (panel) => (event, newExpanded) => {
        if (panel=== "panel1" || panel==="panel2" || panel==="panel3") {
            this.setState({ 
                expanded1: newExpanded ? panel : false,
            });
        } else { 
            this.setState({ 
                expanded2: newExpanded ? panel : false,
            });
        }
    }

    handleMobileChange = (panel) => (event, newExpanded) => {
        this.setState({ 
            expanded1: newExpanded ? panel : false,
        });
    }
    
    getHelpTopics = () => { 
        return (
            <MuiThemeProvider theme={theme}>
            <Mui.ExpansionPanel expanded={this.state.expanded1 === 'panel1'} onChange={this.handleChange('panel1')}>
                <Mui.ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                    <Mui.Typography variant={'h6'} style={styles.titles}>About Us</Mui.Typography>
                </Mui.ExpansionPanelSummary>
                <Mui.ExpansionPanelDetails>
                    <Mui.Typography>
                    Howdy! We are so thrilled you have chosen to learn more about this application. This flood water 
                    mapping application was designed to help your community better document and understand the floods 
                    in your area through crowd sourcing. The images you take and upload are sent to a server hosted at 
                    Texas A&M University and are approved by members of the Construction Science department on a research 
                    team headed up by Dr. Behzadan. These images are then put through a machine learning algorithm that 
                    helps us figure out how deep the flood water in the photo is. The algorithm does this by looking at 
                    the pre-flood images and comparing the stop sign in that image to the same stop sign during a flood. 
                    Since stop signs are government regulated it has standardized dimensions, this means we can use it 
                    as a kind of measuring stick to figure out the scale of the photo and therefore the depth of the 
                    flood water. It is so important to have good flood water mapping in communities because this 
                    information can be used to mitigate flood risk, which saves lives, resources and infrastructure. 
                    </Mui.Typography>
                </Mui.ExpansionPanelDetails>
            </Mui.ExpansionPanel>
            <Mui.ExpansionPanel expanded={this.state.expanded1 === 'panel2'} onChange={this.handleChange('panel2')}>
                <Mui.ExpansionPanelSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                    <Mui.Typography variant={'h6'} style={styles.titles}>Important Info</Mui.Typography>
                </Mui.ExpansionPanelSummary>
                <Mui.ExpansionPanelDetails>
                    <Mui.Typography>
                    This application was started with help from an IRB and thus it has strict regulations governing it. 
                    We do not store your personal data and take precautions to separate the person from the account. 
                    Your images are not saved to our server until you click submit. The information you provide helps increase 
                    flood water mapping in your area and each picture you post is sent to an admin for approval before it 
                    is put up on the site. If approved any user of the site with an authorized account will be able to see 
                    the photo but not any data associated with you specifically. Please contact us if there are any problems 
                    that you have found with the privacy and restrictions of this application. 
                    </Mui.Typography>
                </Mui.ExpansionPanelDetails>
            </Mui.ExpansionPanel>
            <Mui.ExpansionPanel expanded={this.state.expanded1 === 'panel3'} onChange={this.handleChange('panel3')}>
                <Mui.ExpansionPanelSummary aria-controls="panel3d-content" id="panel3d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                    <Mui.Typography variant={'h6'} style={styles.titles}>Credits</Mui.Typography>
                </Mui.ExpansionPanelSummary>
                <Mui.ExpansionPanelDetails>
                    <Mui.Typography>
                        The map presented on our ‘Map’ page and the images viewed on the google street view page 
                        are served from google, as well as the captured image that is rendered when the capture image button is clicked. 

                        The application was built by a team of computer science students from Texas A&M University.
                    </Mui.Typography>
                </Mui.ExpansionPanelDetails>
            </Mui.ExpansionPanel>
        </MuiThemeProvider>
        );
    }

    getHowTo = () => { 
        return(
            <MuiThemeProvider theme={theme}>
                <Mui.ExpansionPanel expanded={this.state.expanded2 === 'panel4'} onChange={this.handleChange('panel4')}>
                    <Mui.ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                        <Mui.Typography variant={'h6'} style={styles.titles}>What Should I Upload?</Mui.Typography>
                    </Mui.ExpansionPanelSummary>
                    <Mui.ExpansionPanelDetails style={{flexDirection: 'column'}}>
                        <Mui.GridList cols={2.5} cellHeight={200}>
                        <Mui.GridListTile cols={0.75}>
                            <img src={ExImg1}/>
                            <Mui.GridListTileBar style={styles.imgTitle} title={"Post Flood"}></Mui.GridListTileBar>
                        </Mui.GridListTile>
                        
                        <Mui.GridListTile cols={0.75}>
                            <img src={ExImg2}/>
                            <Mui.GridListTileBar style={styles.imgTitle} title={"Pre Flood"}></Mui.GridListTileBar>
                        </Mui.GridListTile>
                        <Mui.GridListTile>
                            <div>
                                <Mui.Box display="flex" alignItems={'center'} > <CheckCircleIcon color={'primary'} fontSize="small"/>Stop sign in full view </Mui.Box>
                                <Mui.Box lineHeight={3} display="flex" alignItems={'center'} > <CheckCircleIcon color={'primary'} fontSize="small"/> Waterline in view </Mui.Box>
                                <Mui.Box display="flex" alignItems={'center'} > <CheckCircleIcon color={'primary'} fontSize="small"/> Pole fully visable </Mui.Box>
                            </div>
                        </Mui.GridListTile>
                        </Mui.GridList> 
                        <Mui.Box style={{paddingTop: 10}}>
                            Please make sure your photos are at least 512x512 pixel resolution!
                        </Mui.Box>
                    </Mui.ExpansionPanelDetails>
                </Mui.ExpansionPanel>
                <Mui.ExpansionPanel expanded={this.state.expanded2 === 'panel5'} onChange={this.handleChange('panel5')}>
                    <Mui.ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                        <Mui.Typography variant={'h6'} style={styles.titles}>How to Upload</Mui.Typography>
                    </Mui.ExpansionPanelSummary>
                    <Mui.ExpansionPanelDetails>
                        <Mui.Typography>
                        The basic <span style={styles.keywords}>upload</span> steps are as follows: 
                        <Mui.Box> 1. Upload an image of a <span style={styles.keywords}>stop sign</span> in a flood </Mui.Box> 
                        <Mui.Box style={{paddingLeft: 20}}>- This is your <span style={styles.keywords}>post-flood</span> image </Mui.Box>
                        <Mui.Box> 2. Choose to pair your post-flood image or to just submit as is</Mui.Box> 
                        <Mui.Box style={{paddingLeft: 20}}> - If you choose to <span style={styles.keywords}>pair</span> the post flood photo you can either:</Mui.Box>
                        <Mui.Box style={{paddingLeft: 40}}> - Upload an image you have of the same stop sign before the flood </Mui.Box>
                        <Mui.Box style={{paddingLeft: 40}}> - Use Google Street View to show us the view of the stop sign </Mui.Box> 
                        <Mui.Box style={{paddingLeft: 20}}> - If you choose to <span style={styles.keywords}>pair</span> we will then ask you to confirm your selection and submit once again</Mui.Box>
                        <Mui.Box style={{paddingLeft: 20}}> - If you did not pair the photo we will ask you to complete the upload process by approving the image</Mui.Box>
                        <Mui.Box> This packaged image and data will be sent to an admin for approval</Mui.Box> 
                        
                        <Mui.Box> If approved, the image will be posted to the map and if rejected, the image will be deleted </Mui.Box> 
                        </Mui.Typography>
                    </Mui.ExpansionPanelDetails>
                </Mui.ExpansionPanel>
                <Mui.ExpansionPanel expanded={this.state.expanded2 === 'panel6'} onChange={this.handleChange('panel6')}>
                    <Mui.ExpansionPanelSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                        <Mui.Typography variant={'h6'} style={styles.titles}>Map Help</Mui.Typography>
                    </Mui.ExpansionPanelSummary>
                    <Mui.ExpansionPanelDetails>
                        <Mui.Typography>
                        If you wish to view only the map you may click the<span><RoomIcon color={'primary'}fontSize="small"/></span>
                        at the bottom of your phone screen or the left of your computer screen at any time. This will take you to a 
                        map of the area with a number of pins on it. These pins represent either <span style={styles.keywords}>paired </span> 
                        or <span style={styles.keywords}>unpaired</span> flooded stop sign images. You can click or tap on these to see the 
                        images at that specific pin as well as accompanying data. You may also filter the map’s pins based on preferred criteria 
                        (like date or paired/unpaired) to customize your search. The map is dynamic, meaning you can zoom in and out and move around the area 
                        at will. 
                        </Mui.Typography>
                    </Mui.ExpansionPanelDetails>
                </Mui.ExpansionPanel>
            </MuiThemeProvider>
        );
    }

    mobileView = () => { 
        const isMobile = window.innerWidth < 1000;
        return(
            <MuiThemeProvider theme={mobileTheme}>
                <Mui.ExpansionPanel expanded={this.state.expanded1 === 'panel1'} onChange={this.handleMobileChange('panel1')}>
                    <Mui.ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                        <Mui.Typography variant={'subtitle2'} style={styles.titles}>About Us</Mui.Typography>
                    </Mui.ExpansionPanelSummary>
                    <Mui.ExpansionPanelDetails>
                        <Mui.Typography>
                        Howdy! We are so thrilled you have chosen to learn more about this application. This flood water 
                        mapping application was designed to help your community better document and understand the floods 
                        in your area through crowd sourcing. The images you take and upload are sent to a server hosted at 
                        Texas A&M University and are approved by members of the Construction Science department on a research 
                        team headed up by Dr. Behzadan. These images are then put through a machine learning algorithm that 
                        helps us figure out how deep the flood water in the photo is. The algorithm does this by looking at 
                        the pre-flood images and comparing the stop sign in that image to the same stop sign during a flood. 
                        Since stop signs are government regulated it has standardized dimensions, this means we can use it 
                        as a kind of measuring stick to figure out the scale of the photo and therefore the depth of the 
                        flood water. It is so important to have good flood water mapping in communities because this 
                        information can be used to mitigate flood risk, which saves lives, resources and infrastructure. 
                        </Mui.Typography>
                    </Mui.ExpansionPanelDetails>
                </Mui.ExpansionPanel>
                <Mui.ExpansionPanel expanded={this.state.expanded1 === 'panel2'} onChange={this.handleMobileChange('panel2')}>
                    <Mui.ExpansionPanelSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                        <Mui.Typography variant={'subtitle2'} style={styles.titles}>Important Info</Mui.Typography>
                    </Mui.ExpansionPanelSummary>
                    <Mui.ExpansionPanelDetails>
                        <Mui.Typography>
                        This application was started with help from an IRB and thus it has strict regulations governing it. 
                        We do not store your personal data and take precautions to separate the person from the account. 
                        Your images are not saved to our server until you click submit. The information you provide helps increase 
                        flood water mapping in your area and each picture you post is sent to an admin for approval before it 
                        is put up on the site. If approved any user of the site with an authorized account will be able to see 
                        the photo but not any data associated with you specifically. Please contact us if there are any problems 
                        that you have found with the privacy and restrictions of this application. 
                        </Mui.Typography>
                    </Mui.ExpansionPanelDetails>
                </Mui.ExpansionPanel>
                <Mui.ExpansionPanel expanded={this.state.expanded1 === 'panel3'} onChange={this.handleMobileChange('panel3')}>
                    <Mui.ExpansionPanelSummary aria-controls="panel3d-content" id="panel3d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                        <Mui.Typography variant={'subtitle2'} style={styles.titles}>Credits</Mui.Typography>
                    </Mui.ExpansionPanelSummary>
                    <Mui.ExpansionPanelDetails>
                        <Mui.Typography>
                            The map presented on our ‘Map’ page and the images viewed on the google street view page 
                            are served from google, as well as the captured image that is rendered when the capture image button is clicked. 

                            The application was built by a team of computer science students from Texas A&M University.
                        </Mui.Typography>
                    </Mui.ExpansionPanelDetails>
                </Mui.ExpansionPanel>
                <Mui.ExpansionPanel expanded={this.state.expanded1 === 'panel4'} onChange={this.handleMobileChange('panel4')}>
                    <Mui.ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                        <Mui.Typography variant={'subtitle2'} style={styles.titles}>What Should I Upload?</Mui.Typography>
                    </Mui.ExpansionPanelSummary>
                    <Mui.ExpansionPanelDetails style={{flexDirection: 'column'}}>
                        <Mui.GridList cols={2} cellHeight={200}>
                        <Mui.GridListTile cols={1}>
                            <img src={ExImg1}/>
                            <Mui.GridListTileBar style={styles.imgTitle} title={"Post Flood"}></Mui.GridListTileBar>
                        </Mui.GridListTile>
                        
                        <Mui.GridListTile cols={1}>
                            <img src={ExImg2}/>
                            <Mui.GridListTileBar style={styles.imgTitle} title={"Pre Flood"}></Mui.GridListTileBar>
                        </Mui.GridListTile>
                        <Mui.GridListTile cols={2}>
                            <div>
                                <Mui.Box display="flex" alignItems={'center'} > <CheckCircleIcon color={'primary'} fontSize="small"/>Stop sign in full view </Mui.Box>
                                <Mui.Box lineHeight={3} display="flex" alignItems={'center'} > <CheckCircleIcon color={'primary'} fontSize="small"/> Waterline in view </Mui.Box>
                                <Mui.Box display="flex" alignItems={'center'} > <CheckCircleIcon color={'primary'} fontSize="small"/> Pole fully visable </Mui.Box>
                                <Mui.Box style={{paddingTop: 10}}>
                            Please make sure your photos are at least 512x512 pixel resolution!
                        </Mui.Box>
                            </div>
                        </Mui.GridListTile>
                        </Mui.GridList> 
                        
                    </Mui.ExpansionPanelDetails>
                </Mui.ExpansionPanel>
                <Mui.ExpansionPanel expanded={this.state.expanded1 === 'panel5'} onChange={this.handleMobileChange('panel5')}>
                    <Mui.ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                        <Mui.Typography variant={'subtitle2'}style={styles.titles}>How to Upload</Mui.Typography>
                    </Mui.ExpansionPanelSummary>
                    <Mui.ExpansionPanelDetails>
                        <Mui.Typography>
                        The basic <span style={styles.keywords}>upload</span> steps are as follows: 
                        <Mui.Box> 1. Upload an image of a <span style={styles.keywords}>stop sign</span> in a flood </Mui.Box> 
                        <Mui.Box style={{paddingLeft: 20}}>- This is your <span style={styles.keywords}>post-flood</span> image </Mui.Box>
                        <Mui.Box> 2. Choose to pair your post-flood image or to just submit as is</Mui.Box> 
                        <Mui.Box style={{paddingLeft: 20}}> - If you choose to <span style={styles.keywords}>pair</span> the post flood photo you can either:</Mui.Box>
                        <Mui.Box style={{paddingLeft: 40}}> - Upload an image you have of the same stop sign before the flood </Mui.Box>
                        <Mui.Box style={{paddingLeft: 40}}> - Use Google Street View to show us the view of the stop sign </Mui.Box> 
                        <Mui.Box style={{paddingLeft: 20}}> - If you choose to <span style={styles.keywords}>pair</span> we will then ask you to confirm your selection and submit once again</Mui.Box>
                        <Mui.Box style={{paddingLeft: 20}}> - If you did not pair the photo we will ask you to complete the upload process by approving the image</Mui.Box>
                        <Mui.Box> This packaged image and data will be sent to an admin for approval</Mui.Box> 
                        
                        <Mui.Box> If approved, the image will be posted to the map and if rejected, the image will be deleted </Mui.Box> 
                        </Mui.Typography>
                    </Mui.ExpansionPanelDetails>
                </Mui.ExpansionPanel>
                <Mui.ExpansionPanel expanded={this.state.expanded1 === 'panel6'} onChange={this.handleMobileChange('panel6')}>
                    <Mui.ExpansionPanelSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon color="primary" />}>
                        <Mui.Typography variant={'subtitle2'} style={styles.titles}>Map Help</Mui.Typography>
                    </Mui.ExpansionPanelSummary>
                    <Mui.ExpansionPanelDetails>
                        <Mui.Typography>
                        If you wish to view only the map you may click the<span><RoomIcon color={'primary'}fontSize="small"/></span>
                        at the bottom of your phone screen or the left of your computer screen at any time. This will take you to a 
                        map of the area with a number of pins on it. These pins represent either <span style={styles.keywords}>paired </span> 
                        or <span style={styles.keywords}>unpaired</span> flooded stop sign images. You can click or tap on these to see the 
                        images at that specific pin as well as accompanying data. You may also filter the map’s pins based on preferred criteria 
                        (like date or paired/unpaired) to customize your search. The map is dynamic, meaning you can zoom in and out and move around the area 
                        at will. 
                        </Mui.Typography>
                    </Mui.ExpansionPanelDetails>
                </Mui.ExpansionPanel>
                
            </MuiThemeProvider>

        );
    }
// Returns any content for the page
    content() {
        const isMobile = window.innerWidth < 1000;
        if (isMobile){ 
            return(
                <div >
                    {this.mobileView()}
                </div>
            );
        } else {
        return(
            <div style={styles.content}>
                {/* The Help Topics */}
                <Mui.Paper style={styles.boxes}>
                    {this.getHelpTopics()}
                </Mui.Paper>
                {/* How to use the app  */}
                <Mui.Paper style={styles.boxes}>
                    {this.getHowTo()}
                </Mui.Paper>
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
