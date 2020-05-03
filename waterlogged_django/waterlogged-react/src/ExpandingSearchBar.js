import React from 'react';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import {fade,  makeStyles } from '@material-ui/core/styles';

const styles = {
    search: {
        borderRadius: 5,
        backgroundColor: fade('#ffffff', 0.15),
        display: "flex",
        flexDirection: "row",
        marginTop: "auto",
        marginBottom: "auto",
        height: "30px"
    },
    searchIconContainer: {
        height: "inherit",
        width: "inherit"
    },
    button: {
        height: "inherit",
        width: "inherit"
    },
    SearchIcon: {
        margin: "0 auto",
        height: "100%",
        color: "#ffffff"
    },
    inputRoot: {
        color: '#ffffff',
        marginRight: "2px"
    },
    searchHidden:{
        backgroundColor: "inherit",
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        marginTop: "auto",
        marginBottom: "auto",
        height: "30px"
    },
    inputHidden: {

    },
};

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {searchToggle: false};
    
        // This binding is necessary to make `this` work in the callback
        this.searchExpand = this.searchExpand.bind(this);
      }


    searchExpand() {
        this.setState(prevState => ({
            searchToggle: !prevState.searchToggle
          }));
    }

    render() {
        return(
                    <div style={styles.search}>
                        <div style={styles.searchIconContainer}>
                            <IconButton classes = {{root: styles.button}} onClick ={this.searchExpand}>
                                <SearchIcon classes={{ root: styles.SearchIcon }}/>    
                            </IconButton>
                        </div>
                        <InputBase placeholder="Search…" classes={this.state.searchToggle ? {root: styles.inputRoot} : {root: styles.inputHidden} }/>
                    </div>
        );
    }
}