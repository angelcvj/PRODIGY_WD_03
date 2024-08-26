const modeSelectBox = document.getElementById("modeSelectBox"),
      selectBox = document.getElementById("selectBox"),
      playBoard = document.getElementById("playBoard"),
      resultBox = document.getElementById("resultBox"),
      selectBtnX = selectBox.querySelector(".playerX"),
      selectBtnO = selectBox.querySelector(".playerO"),
      onePlayerBtn = modeSelectBox.querySelector(".one-player"),
      twoPlayersBtn = modeSelectBox.querySelector(".two-players"),
      players = document.querySelector(".players"),
      slider = players.querySelector(".slider"),
      allBox = document.querySelectorAll("section span"),
      wonText = resultBox.querySelector(".won-text"),
      replayBtn = document.getElementById("replayBtn");

let isOnePlayer = false;
let currentPlayer = "X";
let botSign = "O";
let runBot = true;

onePlayerBtn.onclick = () => {
    isOnePlayer = true;
    modeSelectBox.classList.add("hide");
    selectBox.classList.remove("hide");
    selectBox.classList.add("show");
};

twoPlayersBtn.onclick = () => {
    isOnePlayer = false;
    modeSelectBox.classList.add("hide");
    selectBox.classList.remove("hide");
    selectBox.classList.add("show");
};

selectBtnX.onclick = () => {
    startGame("X", isOnePlayer ? "O" : null);
};

selectBtnO.onclick = () => {
    startGame("O", isOnePlayer ? "X" : null);
};

function startGame(player, bot) {
    selectBox.classList.add("hide");
    playBoard.classList.remove("hide");
    playBoard.classList.add("show");
    currentPlayer = player;
    botSign = bot;
    updateSlider(); // Update the slider when the game starts
    if (isOnePlayer && currentPlayer === botSign) {
        playBoard.style.pointerEvents = "none";
        setTimeout(botMove, 500); // AI plays immediately if bot is first
    }
}

function updateSlider() {
    if (currentPlayer === "X") {
        slider.style.left = "0%";
        players.classList.add("active");
    } else {
        slider.style.left = "50%";
        players.classList.remove("active");
    }
    // Ensure text is always on top of the slider
    players.querySelectorAll("span").forEach(span => {
        span.style.position = "relative";
        span.style.zIndex = "2";
    });
}

window.onload = () => {
    allBox.forEach(box => box.addEventListener("click", () => clickedBox(box)));
};

function clickedBox(element) {
    if (element.innerHTML === "" && runBot) {
        element.innerHTML = currentPlayer === "X" ? '<i class="fas fa-times"></i>' : '<i class="far fa-circle"></i>';
        element.setAttribute("id", currentPlayer);
        element.style.pointerEvents = "none";
        selectWinner();

        if (isOnePlayer && currentPlayer !== botSign) {
            playBoard.style.pointerEvents = "none";
            currentPlayer = botSign;  // Switch to bot for its move
            updateSlider();  // Update slider before bot move
            setTimeout(botMove, Math.random() * 1000 + 500);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateSlider();  // Update slider for 2-player mode
        }
    }
}

function botMove() {
    let availableMoves = [];
    allBox.forEach((box, index) => {
        if (box.innerHTML === "") {
            availableMoves.push(index);
        }
    });

    if (availableMoves.length > 0) {
        let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        allBox[move].innerHTML = botSign === "X" ? '<i class="fas fa-times"></i>' : '<i class="far fa-circle"></i>';
        allBox[move].setAttribute("id", botSign);
        allBox[move].style.pointerEvents = "none";
        selectWinner();
    }

    currentPlayer = botSign === "X" ? "O" : "X";
    updateSlider();  // Update slider after bot move
    playBoard.style.pointerEvents = "auto";
}

function getClass(idname) {
    return document.querySelector(".box" + idname).id;
}

function checkClasses(val1, val2, val3, sign) {
    return getClass(val1) === sign && getClass(val2) === sign && getClass(val3) === sign;
}

function selectWinner() {
    const winningCombos = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9], // Rows
        [1, 4, 7], [2, 5, 8], [3, 6, 9], // Columns
        [1, 5, 9], [3, 5, 7]  // Diagonals
    ];

    for (const [a, b, c] of winningCombos) {
        if (checkClasses(a, b, c, "X")) {
            endGame("X");
            return;
        } else if (checkClasses(a, b, c, "O")) {
            endGame("O");
            return;
        }
    }

    if ([...allBox].every(box => box.innerHTML !== "")) {
        endGame("tie");
    }
}

function endGame(result) {
    runBot = false;
    let resultMessage;
    if (result === "tie") {
        resultMessage = "It's a tie!";
    } else {
        resultMessage = `${result} wins!`;
    }
    wonText.textContent = resultMessage;
    playBoard.classList.add("hide");
    resultBox.classList.remove("hide");
    resultBox.classList.add("show");

    // Trigger confetti when a player wins
    if (result !== "tie") {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    setTimeout(() => {
        window.location.href = "index.html"; // Redirect to home page after 2 seconds
    }, 2000);
}

replayBtn.onclick = () => {
    allBox.forEach(box => {
        box.innerHTML = '';
        box.setAttribute("id", "");
        box.style.pointerEvents = "auto";
    });
    playBoard.classList.remove("hide");
    resultBox.classList.add("hide");
    runBot = true;
    currentPlayer = "X";
    updateSlider(); // Reset slider position when replaying
    if (isOnePlayer && currentPlayer === botSign) {
        playBoard.style.pointerEvents = "none";
        setTimeout(botMove, 500);
    }
};
