import React, { Component } from "react";
import Tile from "./Tile.jsx";
import ConfigData from "../board.json";
import "./Board.css";

//Konstant variabel för Tileanimationens svep vid förflyttning
const swipeDirectionCSSVariableName = "--swipeDirection";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [],
      columns: ConfigData.columns,
      rows: ConfigData.rows,
      tileOnCorrectPosition: 0,
      win: false,
    };
  }

  setCSSRootVariable(key, value) {
    //Tilldela CSS via kod
    document.documentElement.style.setProperty(key, value);
  }

  createBoard(columns, rows) {
    //Hämtar data om spelplanens storlek
    this.setCSSRootVariable("--columns", columns);
    this.setCSSRootVariable("--rows", rows);

    const maxTiles = columns * rows;
    let tiles = [];

    //Fyller tilearray brickor
    for (let index = 0; index < maxTiles; index++) {
      tiles[index] = index;
    }

    //Slumpa ordningen på alla brickor
    let state = this.shuffleTiles(tiles);

    state.columns = columns;
    state.rows = rows;

    //Pusha ut det nya "statet" med brickorna
    this.setState(state);
  }

  moveTile(tileIndex) {
    //Med hjälp av moduloräkning kan man räkna vart i X-leden brickan befinner sig på spelplanen.
    let xModulo = tileIndex % this.state.columns;

    //Kollar ifall modulo inte är 0, vilket betyder att det tomma utrymmet KAN vara på vänster sida av brickan spelaren har valt. Kollar också ifall vänster om brickan är tom / 0
    if (xModulo !== 0 && this.state.tiles[tileIndex - 1] === 0) {
      //Tomma utrymmet är vänster sida av valda brickan. Ställer in CSS variabel så animationen går åt rätt håll samt byter plats på brickorna.
      this.setCSSRootVariable(swipeDirectionCSSVariableName, "leftSwipe");
      this.switchTiles(tileIndex, tileIndex - 1);
      return;
    }

    //Kollar ifall modulo inte är spelplanensbred - 1, vilket betyder att det tomma utrymmet KAN vara på höger sida av brickan spelaren har valt. Kollar också ifall höger om brickan är tom / 0
    if (
      xModulo !== this.state.columns - 1 &&
      this.state.tiles[tileIndex + 1] === 0
    ) {
      //Tomma utrymmet är höger sida av valda brickan. Ställer in CSS variabel så animationen går åt rätt håll samt byter plats på brickorna.
      this.setCSSRootVariable(swipeDirectionCSSVariableName, "rightSwipe");
      this.switchTiles(tileIndex, tileIndex + 1);
      return;
    }

    //Kollar ifall brickan över är tom / 0. Här skulle en error uppstå vid första raden av brickor med andra spårk då vi försöker hämta data utanför arrays storlek. Här är Javascript rätt så förlåtande
    if (this.state.tiles[tileIndex - this.state.columns] === 0) {
      //Tomma utrymmet är övre valda brickan. Ställer in CSS variabel så animationen går åt rätt håll samt byter plats på brickorna.
      this.setCSSRootVariable(swipeDirectionCSSVariableName, "topSwipe");
      this.switchTiles(tileIndex, tileIndex - this.state.columns);

      return;
    }
    //Kollar ifall brickan under är tom / 0. Här skulle en error uppstå vid första raden av brickor med andra spårk då vi försöker hämta data utanför arrays storlek. Här är Javascript rätt så förlåtande
    if (this.state.tiles[tileIndex + this.state.columns] === 0) {
      //Tomma utrymmet är under valda brickan. Ställer in CSS variabel så animationen går åt rätt håll samt byter plats på brickorna.
      this.setCSSRootVariable(swipeDirectionCSSVariableName, "downSwipe");
      this.switchTiles(tileIndex, tileIndex + this.state.columns);
      return;
    }
  }

  switchTiles(tileIndexOne, tileIndexTwo) {
    //Hämtar data från "State"
    let { tiles, tileOnCorrectPosition, win } = this.state;

    //Kollar ifall de 2 brickorna ligger rätt innan vi flyttar dem, detta hjälper oss att senare i functionen.
    let localTileScoreBeforeSwitching = this.checkIfTileIsInRightPosition(
      [tileIndexOne, tileIndexTwo],
      tiles
    );

    //Byter plats på brickorna
    const tempVarible = tiles[tileIndexOne];
    tiles[tileIndexOne] = tiles[tileIndexTwo];
    tiles[tileIndexTwo] = tempVarible;

    //Kollar ifall de 2 brickorna ligger rätt efter vi bytt plats, med hjälp av förra gången vi kollade kan vi räkna ut en diffrens som vi applicerar på hela scoret
    //Om vi gör detta så slipper vi köra en FOR loop över hela spelarplanen vid varje brickflyttning, vilket sparar klockcyklar.
    tileOnCorrectPosition +=
      (localTileScoreBeforeSwitching -
        this.checkIfTileIsInRightPosition(
          [tileIndexOne, tileIndexTwo],
          tiles
        )) *
      -1;

    //Kollar ifall "poängen" har samma värde som arrayns storlek - 1. Detta är pga av den tomma platsen / 0, aldrig kommer kommer ge ett "poäng" i checkIfTileIsInRightPosition funktionen.
    win = tileOnCorrectPosition === this.state.tiles.length - 1 ? true : false;

    //Updaterar state
    this.setState({ tiles, tileOnCorrectPosition, win });
  }

  checkIfTileIsInRightPosition(indexes, tiles) {
    let score = 0;
    //Loopar igenom alla index som vi fick som argument i funktionen.
    indexes.forEach((indexElement) => {
      if (tiles[indexElement] === indexElement + 1) {
        score++;
      }
    });
    return score;
  }

  shuffleTiles(tiles) {
    const maxTiles = tiles.length;
    let state = {};
    state.tiles = [];

    //Nollställer "poängen".
    state.tileOnCorrectPosition = 0;
    state.win = false;

    for (let index = 0; index < maxTiles; index++) {
      //Genererar en slumpmässig siffra mellan 0 och tiles arrayns längd.
      const random = Math.floor(Math.random() * tiles.length);
      //Hämtar datan ifrån arrayn med index från "random" och pushar värdet till en annan array där våra slumpade siffror ligger.
      state.tiles.push(tiles[random]);
      //Kollar ifall den slumpade brickan kom på rätt plats och ger isåfall ett poäng.
      if (state.tiles[index] === index + 1) {
        state.tileOnCorrectPosition++;
      }
      //Raderar "brickan" ifrån den gamla arrayn så vi inte drar samma bricka igen i loopen.
      tiles.splice(random, 1);
    }

    //Returnerar state med brickor och och poäng.
    return state;
  }

  componentDidMount() {
    //Skapar en ny spelarplan.
    this.createBoard(this.state.columns, this.state.rows);
  }

  render() {
    return (
      <React.Fragment>
        <div className="buttonContainer">
          <button
            //Slumpar om brickorna.
            onClick={() => this.setState(this.shuffleTiles(this.state.tiles))}
          >
            {
              //Ändrar knappens innehåll beroende på om man har vunnit.
              this.state.win !== true
                ? "Slumpa"
                : "Du vann, vill du spela igen?"
            }
          </button>
        </div>
        <div className="board">
          {
            //Går igenom hela tile arrayn och gör komponeter för varje index.
            this.state.tiles.map((value, index) => {
              return (
                <Tile
                  key={index}
                  value={value}
                  onClicked={() => this.moveTile(index)}
                />
              );
            })
          }
        </div>
      </React.Fragment>
    );
  }
}

export default Board;
