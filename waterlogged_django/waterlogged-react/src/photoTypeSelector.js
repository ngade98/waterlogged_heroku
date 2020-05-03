import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
    root: {
        color: 'white',
        textAlign: 'center',
        minWidth: "150px",
        maxWdith: '150px',
        border: "none",
        marginTop: "auto",
        marginBottom: "auto",
        backgroundColor: fade('#ffffff', 0.15),
        border: "none"
    },
    selectMenu: {
    },
    icon: {
        color: 'white'
    },
    popMenu: {
        backgroundColor: "#303F9F",
        color: "white"
    }
}));

export default function ControlledOpenSelect() {

  const classes = useStyles();

  const [age, setAge] = React.useState(1);

  const [open, setOpen] = React.useState(false);

  const handleChange = event => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

    return (
        <Select
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={age}
            onChange={handleChange}
            variant={'standard'}
            classes={{
                root: classes.root,
                select: classes.select,
                selectMenu: classes.selectMenu,
                icon: classes.icon
            }}
            MenuProps={{
               classes:  {
                    paper: classes.popMenu
               }
            }}
        >
          <MenuItem value={1} className={classes.menuItem}>All Photos</MenuItem>
          <MenuItem value={2}>Pairs Only</MenuItem>
          <MenuItem value={3}>Unpaired Only</MenuItem>
        </Select>
    );
}