import React, { Component } from "react";
import { CSSTransition } from "react-transition-group";
import "./Tile.css";

class Tile extends Component {
  render() {
    //Kollar om brickan är tom / 0, Isåfall kör den en CSS animation.
    return (
      <CSSTransition
        in={this.props.value === 0}
        timeout={100}
        classNames="tile"
      >
        <div
          className={this.props.value === 0 ? "empty tile" : "tile"}
          onClick={this.props.onClicked}
        >
          {this.props.value}
        </div>
      </CSSTransition>
    );
  }
}

export default Tile;
