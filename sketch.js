//Sudoku - sketch.js
//
//
//Gabriele Giuli, all rights reserved

/*
General informations on the algorithm:

The solving algorithm consists of two different parts: one that solves by simply
looking for the possible numbers in a tile, and if there is only one it just puts
that number in that tile. The other part consist in picking a tile (the one with
less possible numbers) and trying to solve the puzzle by substutuing one of the
possible numbers in that tile and continuing until the puzzle is either done,
not possible (that would imply to change the value at the particular tile) or
another case of "uncertanty" is present, in this case  is necessary to use the
"backtracking" part of the algorithm again.
*/

//Length of the side of each tile
const TILE_LENGTH = 30;

//Coordinates of the origin of the table
const x = 5;
const y = 5;

//Declaring the two dimensional array that holds the data of the table
var tableData = [];
for(var i = 0; i < 9; i++) {
  tableData[i] = [];
  for(var j = 0; j < 9; j++) {
    tableData[i][j] = null;
  }
}

//Variables that will be used later on to indicate the selected tile
var a = null;
var b = null;

//Called once the page has loaded
function setup() {
  createCanvas(300, 300);
  background(255);
  drawTable();
}

//Call when the user clicks with the mouse
function mousePressed() {

  //print('Mouse: ' + mouseX + ' ' + mouseY);

  //Checks the coordinates of the mose and assignes to 'a' and 'b' the relative
  //value to access the corresponding element in the array
  for(var i = 0; i < 9; i++) {
    if(mouseX > x + i * TILE_LENGTH && mouseX < x + ((i + 1) * TILE_LENGTH)) {
      a = i;
    }
    if(mouseY > y + i * TILE_LENGTH && mouseY < y + ((i + 1) * TILE_LENGTH)) {
      b = i;
    }
  }

  //print('a: ' + a + ' - b: ' + b);

  //If the location of the cursor is in the table, draw a blue rectangle on the
  //selected tile, to highlight that
  if(a != null && b != null) {
    background(255);
    drawTable();

    noFill();
    strokeWeight(4);
    stroke(0, 0, 200);
    rectMode(CENTER);

    rect(x + (a * TILE_LENGTH) + TILE_LENGTH/2, y + (b * TILE_LENGTH) + TILE_LENGTH/2, TILE_LENGTH, TILE_LENGTH);
  }
}

//Called when the user presses a button on the keyboard
function keyPressed() {
  //Checks if the user is pressing the numbers
  if(key >= 1 && key <= 9) {
    //print('Number selected: ' + key);

    //If a tile is selected, set its value to the designated one and update the table
    if(a != null && b != null) {
      tableData[a][b] = key;
      background(255);
      drawTable();
      a = null;
      b = null;
    }
  } else if(keyCode == 83) { //If the letter 's' is typed sole the sudoku
    print('Solving...');
    solve();
  } else if(keyCode == 32 && a != null && b != null) { //If the space bar is pressed clear the selected tile
    tableData[a][b] = null;
    background(255);
    drawTable();
  }
}

//Draws the table (lines and numbers in tiles)
function drawTable() {
  stroke(0, 0, 0);
  fill(0, 0, 0);

  //Draws the lines
  for(var i = 0; i < 10; i++) {
    //Sets the stroke weight according to the position
    if(i % 3 == 0) {
      strokeWeight(2);
    } else {
      strokeWeight(1);
    }
    line(x, y + i * TILE_LENGTH, x + 9 * TILE_LENGTH, y + i * TILE_LENGTH);
    line(x + i * TILE_LENGTH, y, x + i * TILE_LENGTH, y + 9 * TILE_LENGTH);
  }

  //Prints the numbers in the tiles
  for(var i = 0; i < 9; i++) {
    for(var j = 0; j < 9; j++) {
      if(tableData[i][j] != null) {
        strokeWeight(1);
        text(tableData[i][j], x + (i * TILE_LENGTH) + TILE_LENGTH/2 - 3, y + (j * TILE_LENGTH) + TILE_LENGTH/2 + 5);
      }
    }
  }
}

//Prints the table's data in the console (not used anymore, only for debugging purposes)
function printData() {
  for(var i = 0; i < 9; i++) {
    console.log('');
    for(var j = 0; j < 9; j++) {
      console.log(tableData[i][j]);
    }
  }
}

//Solve the puzzle
function solve() {
  var changed;

  //Repeats this process until there are no further changes in the data
  do {
    changed = rawCheckSolve(tableData);
  } while(changed);
}

//Simply checks for single possibilities
function rawCheckSolve(data) {
  var changed = false;
  for(var i = 0; i < 9; i++) {
    for(var j = 0; j < 9; j++) {
      let res = getPossibleNumbers(i, j, data);
      //print('Possible: ' + res + ' - Coordinate: ' + i + ' - ' + j + ' - Value: ' + data[i][j]);

      //If there's only one possibility and the tile is empty, put that possibility in that tile
      if(res.length == 1 && data[i][j] == null) {
        //print('Done');
        data[i][j] = res[0];
        background(255);
        drawTable();
        changed = true;
      }
    }
  }
  //Returns whether it has changed anything in the table or not
  return changed;
}

//Returns an array containing the other numbers in the horizontal line that
//conatins the tile associated to the coordinates passed as parameters
function getHorizontalLine(a, b, data) {
  var array = [];
  for(var i = 0; i < 9; i++) {
    if(i != a && data[i][b] != null) {
      array.push(data[i][b]);
    }
  }
  return array;
}

//Returns an array containing the other numbers in the vertical line that
//conatins the tile associated to the coordinates passed as parameters
function getVerticalLine(a, b, data) {
  var array = [];
  for(var i = 0; i < 9; i++) {
    if(i != b && data[a][i] != null) {
      array.push(data[a][i]);
    }
  }
  return array;
}

//Returns an array containing the other numbers in the square that
//conatins the tile associated to the coordinates passed as parameters
function getSquare(a, b, data) {
  var array = [];
  var res = getInitialSquareTile(a, b);

  for(var i = res.a; i < res.a + 3; i++) {
    for(var j = res.b; j < res.b + 3; j++) {
      if((i != a || j != b) && data[i][j] != null) {
        array.push(data[i][j]);
      }
    }
  }

  return array;
}

//Returns the coordinates of the first tile of the square that contains the
//tile associated to the coordinates passed as parameters
function getInitialSquareTile(a, b) {
  var res = { a: null, b : null };

  if(a >= 0 && a <= 2) {
    res.a = 0;
  } else if(a >= 3 && a <= 5) {
    res.a = 3;
  } else if(a >= 6 && a <= 8) {
    res.a = 6;
  }

  if(b >= 0 && b <= 2) {
    res.b = 0;
  } else if(b >= 3 && b <= 5) {
    res.b = 3;
  } else if(b >= 6 && b <= 8) {
    res.b = 6;
  }

  return res;
}

//Returns an array that contains all the possible numbers that can be put in the tile
function getPossibleNumbers(a, b, data) {
  var horizontalLine = getHorizontalLine(a, b, data);
  var verticalLine = getVerticalLine(a, b, data);
  var square = getSquare(a, b, data);

  var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for(var i = 0; i < horizontalLine.length; i++) {
    for(var j = 0; j < array.length; j++) {
      if(horizontalLine[i] == array[j]) {
        array.splice(j, 1);
      }
    }
  }

  for(var i = 0; i < verticalLine.length; i++) {
    for(var j = 0; j < array.length; j++) {
      if(verticalLine[i] == array[j]) {
        array.splice(j, 1);
      }
    }
  }

  for(var i = 0; i < square.length; i++) {
    for(var j = 0; j < array.length; j++) {
      if(square[i] == array[j]) {
        array.splice(j, 1);
      }
    }
  }
  return array;
}

//Checks if all the tiles in the table are not empty
function isComplete(data) {
  var c = 0;
  for(var i = 0; i < 9; i++) {
    for(var j = 0; j < 9; j++) {
      if(data[i][j] != null) {
        c++;
      }
    }
  }
  return c == 81;
}

//Returns the coordinates of the cell with less possibilities in the table
//and the array containing the possible numbers. This function will be used
//to create the various possibilities in the backtracking part of the algorithm.
function getFreeCell(data) {
  var min = { value: null, a: null, b: null, array: null };
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      if(data[i][j] == null) {
        let result = getPossibleNumbers(i, j, data);

        if(min.value == null) {
          min.value = result.length;
          min.a = i;
          min.b = j;
          min.array = result;
        } else if(result.length < min.value) {
          min.value = result.length;
          min.a = i;
          min.b = j;
          min.array = result;
        }

      }
    }
  }
  return min;
}

function generateTables(data) {
  var cell = getFreeCell(data);
  var tables = [];

  for(var k = 0; k < cell.array.length; k++) {
    let currentTable = [];
    for(var i = 0; i < 9; i++) {
      currentTable[i] = [];
      for(var j = 0; j < 9; j++) {
        if(i == cell.a && j == cell.b) {
          currentTable[i][j] = cell.array[k];
        } else {
          currentTable[i][j] = data[i][j];
        }
      }
    }
    tables.push(currentTable);
  }
  return tables;
}
