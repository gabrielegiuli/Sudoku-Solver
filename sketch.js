//Sudoku - sketch.js
//
//
//Gabriele Giuli, all rights reserved

const TILE_LENGTH = 30;
const x = 5;
const y = 5;

var tableData = [];
for(var i = 0; i < 9; i++) {
  tableData[i] = [];
  for(var j = 0; j < 9; j++) {
    tableData[i][j] = null;
  }
}

var a = null;
var b = null;

function setup() {
  createCanvas(370, 370);
  drawTable();

}

function mousePressed() {

  //print('Mouse: ' + mouseX + ' ' + mouseY);

  for(var i = 0; i < 9; i++) {
    if(mouseX > x + i * TILE_LENGTH && mouseX < x + ((i + 1) * TILE_LENGTH)) {
      a = i;
    }
    if(mouseY > y + i * TILE_LENGTH && mouseY < y + ((i + 1) * TILE_LENGTH)) {
      b = i;
    }
  }

  //print('a: ' + a + ' - b: ' + b);

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

function keyPressed() {
  if(key >= 1 && key <= 9) {
    print('Number selected: ' + key);

    if(a != null && b != null) {
      tableData[a][b] = key;
      background(255);
      drawTable();
    }
  } else if(keyCode == 83) { //'s'
    print('Solving...');
    solve();
  }
}

function drawTable() {
  stroke(0, 0, 0);
  fill(0, 0, 0);
  for(var i = 0; i < 10; i++) {
    if(i % 3 == 0) {
      strokeWeight(2);
    } else {
      strokeWeight(1);
    }
    line(x, y + i * TILE_LENGTH, x + 9 * TILE_LENGTH, y + i * TILE_LENGTH);
    line(x + i * TILE_LENGTH, y, x + i * TILE_LENGTH, y + 9 * TILE_LENGTH);
  }

  for(var i = 0; i < 9; i++) {
    for(var j = 0; j < 9; j++) {
      if(tableData[i][j] != null) {
        strokeWeight(1);
        text(tableData[i][j], x + (i * TILE_LENGTH) + TILE_LENGTH/2 - 3, y + (j * TILE_LENGTH) + TILE_LENGTH/2 + 5);
      }
    }
  }
}

function printData() {
  for(var i = 0; i < 9; i++) {
    console.log('');
    for(var j = 0; j < 9; j++) {
      console.log(tableData[i][j]);
    }
  }
}

function solve() {
  var changed;
  do {
    changed = false;
    for(var i = 0; i < 9; i++) {
      for(var j = 0; j < 9; j++) {
        let res = getPossibleNumbers(i, j);
        print('Possible: ' + res + ' - Coordinate: ' + i + ' - ' + j + ' - Value: ' + tableData[i][j]);
        if(res.length == 1 && tableData[i][j] == null) {
          print('Done');
          tableData[i][j] = res[0];
          background(255);
          drawTable();
          changed = true;
        }
      }
    }
  } while(changed);
}

function getHorizontalLine(a, b) {
  var array = [];
  for(var i = 0; i < 9; i++) {
    if(i != a && tableData[i][b] != null) {
      array.push(tableData[i][b]);
    }
  }
  return array;
}

function getVerticalLine(a, b) {
  var array = [];
  for(var i = 0; i < 9; i++) {
    if(i != b && tableData[a][i] != null) {
      array.push(tableData[a][i]);
    }
  }
  return array;
}

function getSquare(a, b) {
  var array = [];
  var res = getInitialSquareTile(a, b);

  for(var i = res.a; i < res.a + 3; i++) {
    for(var j = res.b; j < res.b + 3; j++) {
      if((i != a || j != b) && tableData[i][j] != null) {
        array.push(tableData[i][j]);
      }
    }
  }

  return array;
}

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

function getPossibleNumbers(a, b) {
  var horizontalLine = getHorizontalLine(a, b);
  var verticalLine = getVerticalLine(a, b);
  var square = getSquare(a, b);

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
