    import React, { Component } from "react";

    
    export default class Image extends Component {
      constructor(props) {
        super(props);
        this.state = {
          activeItem: this.props.activeItem
        };
      }
    }