let tiles = document.getElementsByClassName("tile");
let extra = document.getElementById("extra");
let currentScore = document.getElementById("score");
let block = document.getElementById("block");
let totalScore = 0;
let bestScore = 0;

function createTile() {
  let empty = [];
  for (let tile of tiles) {
    if (tile.classList.contains("empty")) {
      empty.push(tile);
    }
  }
  let random = Math.floor(Math.random() * empty.length);
  empty[random].value = 2;
  empty[random].classList.remove("empty");
  empty[random].classList.add("zoomToFit");
}

for (let tile of tiles) {
  tile.addEventListener("animationend", (event) => {
    if (event.target.classList.contains("zoomToFit")) {
      event.target.classList.remove("zoomToFit");
    }
    if (event.target.classList.contains("zoomLarger")) {
      event.target.classList.remove("zoomLarger");
    }
  });
}

function newGame() {
  createTile();
  createTile();
}

function valuesOnRow(row) {
  let arr = [];
  for (let col = 0; col < 4; col++) {
    let value = tiles[row * 4 + col].value;
    if (value != "") {
      arr.push(parseInt(value));
    }
  }
  return arr;
}

function valuesOnCol(col) {
  let arr = [];
  for (let row = 0; row < 4; row++) {
    let value = tiles[row * 4 + col].value;
    if (value != "") {
      arr.push(parseInt(value));
    }
  }
  return arr;
}

function displayTile(result, i, destTile, isMerged) {
  let emptyToggles = 0;
  if (i < result.length) {
    destTile.value = result[i];
    if (destTile.classList.contains("empty")) {
      destTile.classList.remove("empty");

      emptyToggles = 1;
    }
  } else {
    destTile.value = "";
    if (!destTile.classList.contains("empty")) {
      destTile.classList.add("empty");

      emptyToggles = 1;
    }
  }
  if (isMerged) {
    destTile.classList.add("zoomLarger");
  }
  return emptyToggles;
}

function showScore(score) {
  if (score != 0) {
    totalScore += score;
    currentScore.innerHTML = totalScore;
    extra.innerHTML = "+" + score;
    extra.classList.add("fade");
  }
}

extra.addEventListener("animationend", (event) => {
  event.target.classList.remove("fade");
});

function moveLeft() {
  let emptyToggles = 0;
  let score = 0;
  for (let row = 0; row < 4; row++) {
    let arr = valuesOnRow(row);
    let result = [];
    let mergePos = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == arr[i + 1]) {
        result.push(arr[i] * 2);
        mergePos.push(1);
        score += arr[i] * 2;
        i++;
      } else {
        result.push(arr[i]);
        mergePos.push(0);
      }
    }
    for (let col = 0; col < 4; col++) {
      emptyToggles += displayTile(
        result,
        col,
        tiles[row * 4 + col],
        mergePos[col] ? 1 : 0
      );
    }
  }
  showScore(score);
  return emptyToggles;
}

function moveRight() {
  let emptyToggles = 0;
  let score = 0;
  for (let row = 0; row < 4; row++) {
    let arr = valuesOnRow(row);
    let result = [];
    let mergePos = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == arr[i - 1]) {
        result.push(arr[i] * 2);
        score += arr[i] * 2;
        mergePos.push(1);
        i--;
      } else {
        result.push(arr[i]);
        mergePos.push(0);
      }
    }
    for (let col = 3; col >= 0; col--) {
      emptyToggles += displayTile(
        result,
        3 - col,
        tiles[row * 4 + col],
        mergePos[3 - col] ? 1 : 0
      );
    }
  }
  showScore(score);
  return emptyToggles;
}

function moveUp() {
  let emptyToggles = 0;
  let score = 0;
  for (let col = 0; col < 4; col++) {
    let arr = valuesOnCol(col);
    let result = [];
    let mergePos = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == arr[i + 1]) {
        result.push(arr[i] * 2);
        score += arr[i] * 2;
        mergePos.push(1);
        i++;
      } else {
        result.push(arr[i]);
        mergePos.push(0);
      }
    }
    for (let row = 0; row < 4; row++) {
      emptyToggles += displayTile(
        result,
        row,
        tiles[row * 4 + col],
        mergePos[row] ? 1 : 0
      );
    }
  }
  showScore(score);
  return emptyToggles;
}

function moveDown() {
  let emptyToggles = 0;
  let score = 0;
  for (let col = 0; col < 4; col++) {
    let arr = valuesOnCol(col);
    let result = [];
    let mergePos = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == arr[i - 1]) {
        result.push(arr[i] * 2);
        score += arr[i] * 2;
        mergePos.push(1);
        i--;
      } else {
        result.push(arr[i]);
        mergePos.push(0);
      }
    }
    for (let row = 3; row >= 0; row--) {
      emptyToggles += displayTile(
        result,
        3 - row,
        tiles[row * 4 + col],
        mergePos[3 - row] ? 1 : 0
      );
    }
  }
  showScore(score);
  return emptyToggles;
}

function gameOver() {
  for (let tile of tiles) {
    if (tile.value == "") {
      return false;
    }
  }
  for (row = 0; row < 4; row++) {
    let pos = row * 4 + 1;
    if (
      tiles[pos].value == tiles[pos - 1].value ||
      tiles[pos].value == tiles[pos + 1].value ||
      tiles[pos + 1].value == tiles[pos + 2].value
    ) {
      return false;
    }
  }
  for (col = 0; col < 4; col++) {
    let pos = 4 + col;
    if (
      tiles[pos].value == tiles[pos - 4].value ||
      tiles[pos].value == tiles[pos + 4].value ||
      tiles[pos + 4].value == tiles[pos + 8].value
    ) {
      return false;
    }
  }
  return true;
}

window.onkeydown = async (event) => {
  let emptyToggles = await new Promise((res) => {
    if (event.key == "ArrowLeft") {
      res(moveLeft());
    } else if (event.key == "ArrowRight") {
      res(moveRight());
    } else if (event.key == "ArrowUp") {
      res(moveUp());
    } else if (event.key == "ArrowDown") {
      res(moveDown());
    }
  });
  if (emptyToggles > 0) {
    createTile();
  }
  if (gameOver()) {
    block.classList.remove("hidden");
  }
};

document.getElementById("restart").onclick = () => {
  for (let tile of tiles) {
    tile.value = "";
    if (!tile.classList.contains("empty")) {
      tile.classList.add("empty");
    }
  }
  if (bestScore < totalScore) {
    bestScore = totalScore;
    document.getElementById("best").innerHTML = bestScore;
  }
  totalScore = 0;
  currentScore.innerHTML = "0";
  if (!block.classList.contains("hidden")) {
    block.classList.add("hidden");
  }
  newGame();
};

newGame();
