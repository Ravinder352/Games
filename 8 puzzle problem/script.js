document.addEventListener("DOMContentLoaded", () => {
    const puzzle_table = document.getElementById("puzzle");
    const shuffle_btnn = document.getElementById("shuffle_btn");
    const moves_disp = document.getElementById("moves_display");
    const congt_bx = document.getElementById("congt_bx");
    const puzzleSize = 3;
    let puzzleNumbers = Array.from({ length: 9 }, (_, i) => i + 1);
    let moveCount = 0;

    // Function to shuffle puzzle
    function shufflePuzzle() {
        do {
            for (let i = puzzleNumbers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [puzzleNumbers[i], puzzleNumbers[j]] = [puzzleNumbers[j], puzzleNumbers[i]];
            }
        } while (!isSolvable());
        renderPuzzle();
        moveCount = 0;
        updateMovesDisplay();
        congt_bx.style.display = "none"; // Hiding the congratulations message
    }

    // Function to render
    function renderPuzzle() {
        let index = 0;
        for (let row = 0; row < puzzleSize; row++) {
            for (let col = 0; col < puzzleSize; col++) {
                const cell = puzzle_table.rows[row].cells[col];
                const number = puzzleNumbers[index++];
                cell.textContent = number === puzzleSize * puzzleSize ? "" : number;
                cell.addEventListener("click", () => movePiece(row, col));
            }
        }
    }

    // To check if the puzzle is solvable
    function isSolvable() {
        let inversions = 0;
        for (let i = 0; i < puzzleNumbers.length - 1; i++) {
            for (let j = i + 1; j < puzzleNumbers.length; j++) {
                if (puzzleNumbers[i] > puzzleNumbers[j]) {
                    inversions++;
                }
            }
        }
        return (inversions % 2 === 0);
    }

    // Function to handle number movement
    function movePiece(row, col) {
        const emptyRow = findEmptyCell().row;
        const emptyCol = findEmptyCell().col;

        if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) || (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
            const clickedNumber = puzzleNumbers[row * puzzleSize + col];
            puzzleNumbers[row * puzzleSize + col] = puzzleNumbers[emptyRow * puzzleSize + emptyCol];
            puzzleNumbers[emptyRow * puzzleSize + emptyCol] = clickedNumber;
            renderPuzzle();

            moveCount++;
            updateMovesDisplay();
            if (isPuzzleSolved()) {
                congt_bx.textContent = "Congratulations! You've successfully completed the puzzle in " + moveCount + " moves!";
                congt_bx.style.display = "block"; // Showing the congratulations message
            }
        }
    }

    // Function to get empty cell
    function findEmptyCell() {
        for (let row = 0; row < puzzleSize; row++) {
            for (let col = 0; col < puzzleSize; col++) {
                if (puzzleNumbers[row * puzzleSize + col] === puzzleSize * puzzleSize) {
                    return { row, col };
                }
            }
        }
    }

    // Function to update the moves display
    function updateMovesDisplay() {
        moves_disp.textContent = "Moves: " + moveCount;
    }

    // Function to check if the puzzle is solved
    function isPuzzleSolved() {
        const correctPattern = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        return JSON.stringify(puzzleNumbers) === JSON.stringify(correctPattern);
    }

    // To start the puzzle
    shuffle_btnn.addEventListener("click", shufflePuzzle);
    shufflePuzzle();
});
