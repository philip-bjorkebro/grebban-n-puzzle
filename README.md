# Grebban N-Puzzle

Demo för detta React projekt finns live på min server [https://grebban.entrify.se](https://grebban.entrify.se)

## Programkrav

```
Node.js
Node Package Manager
```

## Installation

Öppna Terminal/Bash och skriv dessa rader

```
git clone https://github.com/philipbjorkebro/grebban-n-puzzle.git
cd grebban-n-puzzle
npm install
npm start
```

## Konfiguration

Du kan ändra antal kolumner och rader i filen `src/board.json`

```
{
  "columns": 4,
  "rows": 4
}
```

## Kända problem

- `Warning: findDOMNode is deprecated in StrictMode.` Dyker endast upp under första animationen i konsolen i React development mode.

## React bibliotek som används

- `react-transition-group`
