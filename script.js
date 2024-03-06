"use strict";

window.addEventListener("load", start);

document.querySelector('#resetButton').addEventListener('click', resetGrid);

const GRID_WIDTH = 30;
const GRID_HEIGHT = 20;
const ROWS = null;
const COLS = null;

// ***************** CONTROLLER *****************

// ***************** VIEW *****************

function start() {
  createView();
  makeBoardClickable();
  createModel();
  displayGenerationCount();
  setInterval(gameLoop, 1500);
}

function createView() {
  const board = document.querySelector("#board");

  board.style.setProperty("--GRID_WIDTH", GRID_WIDTH);

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.appendChild(cell);
    }
  }
}

function makeBoardClickable() {
  document.querySelector("#board").addEventListener("mousedown", boardClicked);
}

function boardClicked(event) {
  console.log("board clicked");
  const cell = event.target;

  if (cell.classList.contains("cell")) {
    console.log(cell);

    const row = cell.dataset.row;
    const col = cell.dataset.col;
    console.log(`clicked on row:  ${row} and col: ${col} `);
    selectCell(row, col);
  }
}

function displayBoard() {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cellState = model[row][col];
      updateCellView(row, col, cellState);
    }
  }
}
function updateCellView(row, col, cellState) {
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (cellState === 1) {
    cell.classList.add("alive");
  } else {
    cell.classList.remove("alive");
  }
}

function displayGenerationCount() {
    const generationDisplay = document.getElementById('generationCount');
    generationDisplay.textContent = `Generation: ${generationCounter}`;
  }
  

// ***************** MODEL *****************

const model = [];
let generationCounter = 0;

function createModel() {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    const newRow = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      newRow[col] = 0;
    }
    model[row] = newRow;
  }
}
function selectCell(row, col) {
  // Convert row and col to integers, because dataset values are strings //thank you chat
  row = parseInt(row, 10);
  col = parseInt(col, 10);

  const currentState = readFromCell(row, col);
  let newState;
  if (currentState === 1) {
    newState = 0;
  } else {
    newState = 1;
  }

  writeToCell(row, col, newState);
  updateCellView(row, col, newState);
}

function writeToCell(row, col, value) {
  model[row][col] = value;
}

function readFromCell(row, col) {
  return model[row][col];
}

function countNeighbours(row, col) { //the function made in class didnt work appearently, i got help for this one
  let count = 0;
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      let newRow = row + y;
      let newCol = col + x;
      if (
        newRow >= 0 && 
        newRow < GRID_HEIGHT &&
        newCol >= 0 &&
        newCol < GRID_WIDTH
      ) {
        if (!(x === 0 && y === 0)) {
          count += readFromCell(newRow, newCol);
        }
      }
    }
  }
  return count;
}

function cellHandler(row, col) {
  const neighbours = countNeighbours(row, col);
  const currentState = readFromCell(row, col);

  if (currentState === 1 && (neighbours < 2 || neighbours > 3)) {
    // Cell dies
    return 0;
  } else if (currentState === 0 && neighbours === 3) {
    // Cell becomes alive
    return 1;
  } else {
    // Cell stays the same
    return currentState;
  }
}

function createModelArray() {
  const arr = [];
  for (let row = 0; row < GRID_HEIGHT; row++) {
    arr[row] = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      arr[row][col] = 0;
    }
  }
  return arr;
}

function gameLoop() {
  const newGeneration = createModelArray(); 

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      newGeneration[row][col] = cellHandler(row, col);
    }
  }

  // Replace model with newGeneration
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      model[row][col] = newGeneration[row][col];
    }
  }
  generationCounter++;
  displayBoard();
  displayGenerationCount();
}

function resetGrid() {
  // Loop through each cell in the model and set its state to 0 (dead)
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      model[row][col] = 0; 
    }
  }
  generationCounter = 0; 
  displayBoard(); 
  displayGenerationCount(); 
}
