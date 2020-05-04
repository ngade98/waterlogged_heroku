import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import {fade,  makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    search: {
        borderRadius: 5,
        backgroundColor: '#303F9F',
        width: "100%",
        display: "flex",
        flexDirection: "row",
        height: "30px",
        marginTop: "auto",
        marginBottom: "auto"
    },
    searchIconContainer: {
        marginRight: "5px"
    },
    SearchIcon: {
        height: "100%",
        color: "#ffffff"
    },
    inputRoot: {
        color: '#ffffff',
        marginRight: "2px"
    }
}));

export default function SearchBar() {
    const classes = useStyles();
    return(
        <div className={classes.search}>
            <div className={classes.searchIconContainer}>
                <SearchIcon classes={{ root: classes.SearchIcon }}/>
            </div>
            <InputBase 
                placeholder="Search…" 
                id="satSearch" 
                classes={{ root: classes.inputRoot }}
                aria-label="searchInput"
            />
        </div>
    );
}