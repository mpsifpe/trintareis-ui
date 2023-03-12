import React from "react";
import './image-component.css';

export default class ImageComponent extends React.Component {
  state = { isOpen: false };

  handleShowDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
    console.log("cliked");
  };

  render() {
    return (
      <div>
        {!this.state.isOpen && (
            <img
            className="small"
            src={this.props.url}
            onClick={this.handleShowDialog}
            alt="image"
            />
        )}
        {this.state.isOpen && (
          <dialog
            className="dialog"
            style={{ position: "absolute", marginLeft:"-20%", maxWidth:"175vh" }}
            open
            onClick={this.handleShowDialog}
          >
            <img
              className="image"
              src={this.props.url}
              onClick={this.handleShowDialog}
              alt="image"
            />
          </dialog>
        )}
      </div>
    );
  }
}
