import * as PIXI from './node_modules/pixi.js/dist/pixi.min.mjs';

let app = new PIXI.Application({background: 'white', width: 400, height: 400 });
globalThis.__PIXI_APP__ = app;
document.body.appendChild(app.view);

let graphic = PIXI.Graphics;

let background = PIXI.Sprite.from("background.png");
background.width = 325;
background.height = 325;

// 0 - Not Set
// 1 - Player X
// 2 - Player O
let fieldBooleans = [0,0,0,
    0,0,0,
    0,0,0];


let player1 = 1;
let player2 = 2;
let currentPlayer = player1;

const gameStatus = {
RUNNING: 1,
STOPPING: 2
}

let gameIsRunning = gameStatus.RUNNING;

app.stage.addChild(background);
drawGrid();

function drawGrid()
{
    let field = new PIXI.Container();
    let line = new graphic()
        .lineStyle(2,"white", 1)
        .moveTo(100,0)
        .lineTo(100,300);
    
    let line2 = new graphic()
        .lineStyle(2,"white", 1)
        .moveTo(200,0)
        .lineTo(200,300);
    
    let line3 = new graphic()
        .lineStyle(2,"white", 1)
        .moveTo(0,100)
        .lineTo(300,100);
    
    let line4 = new graphic()
        .lineStyle(2,"white", 1)
        .moveTo(0,200)
        .lineTo(300,200);
    
    app.stage.eventMode = "static";
    app.stage.on("pointermove", trackMousePos)
            .on("pointerdown", clickedField);

    field.addChild(line);
    field.addChild(line2);
    field.addChild(line3);
    field.addChild(line4);

    app.stage.addChild(field); // add a component to the stage
}

// tracking mouse movements for debugging purposes
function trackMousePos(e)
{
    let pos = e.data.global;

    //console.log("x: " + pos.x + " y: " + pos.y);
}

function clickedField(e)
{
    let pos = e.data.global;
    if(gameIsRunning === gameStatus.RUNNING)
    {

        if(pos.x > 0 && pos.x < 100 && pos.y > 0 && pos.y < 100)
        {
            if(fieldBooleans[0] !== player1 && fieldBooleans[0] !== player2)
            {
                fieldBooleans[0] = currentPlayer;
                playerSelection(0,0);
            }
        }
        else if(pos.x > 100 && pos.x < 200 && pos.y > 0 && pos.y < 100)
        {
            if(fieldBooleans[1] !== player1 && fieldBooleans[1] !== player2)
            {
                fieldBooleans[1] = currentPlayer;
                playerSelection(100,0);
            }
        }
        else if(pos.x > 200 && pos.x < 300 && pos.y > 0 && pos.y < 100)
        {
            if(fieldBooleans[2] !== player1 && fieldBooleans[2] !== player2)
            {
                fieldBooleans[2] = currentPlayer;
                playerSelection(200,0);
            }
        }
        else if(pos.x > 0 && pos.x < 100 && pos.y > 100 && pos.y < 200)
        {
            if(fieldBooleans[3] !== player1 && fieldBooleans[3] !== player2)
            {
                fieldBooleans[3] = currentPlayer;
                playerSelection(0,100);
            }
        }
        else if(pos.x > 100 && pos.x < 200 && pos.y > 100 && pos.y < 200)
        {
            if(fieldBooleans[4] !== player1 && fieldBooleans[4] !== player2)
            {
                fieldBooleans[4] = currentPlayer;
                playerSelection(100,100);
            }
        }
        else if(pos.x > 200 && pos.x < 300 && pos.y > 100 && pos.y < 200)
        {
            if(fieldBooleans[5] !== player1 && fieldBooleans[5] !== player2)
            {
                fieldBooleans[5] = currentPlayer;
                playerSelection(200,100);
            }
        }
        else if(pos.x > 0 && pos.x < 100 && pos.y > 200 && pos.y < 300)
        {
            if(fieldBooleans[6] !== player1 && fieldBooleans[6] !== player2)
            {
                fieldBooleans[6] = currentPlayer;
                playerSelection(0,200);
            }
        }
        else if(pos.x > 100 && pos.x < 200 && pos.y > 200 && pos.y < 300)
        {
            if(fieldBooleans[7] !== player1 && fieldBooleans[7] !== player2)
            {
                fieldBooleans[7] = currentPlayer;
                playerSelection(100,200);
            }
        }
        else if(pos.x > 200 && pos.x < 300 && pos.y > 200 && pos.y < 300)
        {
            if(fieldBooleans[8] !== player1 && fieldBooleans[8] !== player2)
            {
                fieldBooleans[8] = currentPlayer;
                playerSelection(200,200);
            }
        }
    
        checkWinner()
    }
    if(gameIsRunning === gameStatus.STOPPING)
    {
        if(pos.x > 100 && pos.x < 200 && pos.y > 125 && pos.y < 175) {
            restartGame()
        }
    }
}

function checkWinner()
{
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical rows
        [0, 4, 8], [2, 4, 6]             // diagonal rows
    ];

    // the board positions for the cutline through all the winning symbols
    const boardCombinationsPos = {
        0: { start: [0, 50], end: [300, 50] },
        1: { start: [0, 150], end: [300, 150] },
        2: { start: [0, 250], end: [300, 250] },

        3: { start: [50, 0], end: [50, 300] },
        4: { start: [150, 0], end: [150, 300] },
        5: { start: [250, 0], end: [250, 300] },

        6: { start: [0, 0], end: [300, 300] },
        7: { start: [300, 0], end: [0, 300] },
    };
    
    let xCount = 0;
    let oCount = 0;
    let winCombo = null;

    // drawing the line at the end of the game
    function drawEndLine(start,end) 
    {
        let winningLine = new graphic()
            .lineStyle(2,"red",1)
            .moveTo(start[0], start[1])
            .lineTo(end[0], end[1]);

        app.stage.addChild(winningLine);
    }
    
    for (let i = 0; i < winCombinations.length; i++) 
    {
        xCount = 0;
        oCount = 0;
        
        for (let j = 0; j < 3; j++) {
            const cellValue = fieldBooleans[winCombinations[i][j]];
    
            if (cellValue === 1) {
                xCount++;
            } else if (cellValue === 2) {
                oCount++;
            }
    
            if (xCount === 3 || oCount === 3) {
                console.log("Player " + (xCount === 3 ? "1" : "2") + " wins!");
                winCombo = i;
                console.log("game ends");
                gameIsRunning = gameStatus.STOPPING;
                drawEndLine(boardCombinationsPos[winCombo].start,boardCombinationsPos[winCombo].end)
                drawRestartButton(50,125,200,50)
                break;
            }
        }

        //if not checking the game status it will run another time before exiting
        if(gameIsRunning == gameStatus.STOPPING)
        {
            break;
        }
    }

    // if its a tie then just draw the restart button and end the game
    if(!fieldBooleans.some(index => index === 0) && gameIsRunning == gameStatus.RUNNING)
    {
        console.log("game ends with a tie");
        gameIsRunning = gameStatus.STOPPING;
        drawRestartButton(50,125,200,50)
    }
}

function playerSelection(x,y)
{
    if(currentPlayer == player1)
    {
        drawX(x,y);
    }
    else if(currentPlayer == player2)
    {
        drawO(x,y);
    }
    currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;
}

// draw an x to the position defined
function drawX(x,y)
{
    let XSym = new PIXI.Container();
    let xline1 = new PIXI.Graphics();
    let xline2 = new PIXI.Graphics();

    xline1.lineStyle(5,"white", 1);
    xline1.x = x;
    xline1.y = y;
    xline1.lineTo(100,100);
    
    xline2.lineStyle(5,"white", 1);
    xline2.x = x + 100;
    xline2.y = y;
    xline2.lineTo(-100, 100);
    
    XSym.addChild(xline1);
    XSym.addChild(xline2);
    
    app.stage.addChild(XSym);
}

// draw an circle to the position defined
function drawO(x,y)
{
    let circle = new graphic()
        .lineStyle(5,"white",1)
        .beginFill("transparent",1)
        .drawCircle(x + 50,y + 50,45)
        .endFill();

    app.stage.addChild(circle)
}

function restartGame()
{
    app.stage.removeChildren();
    app.stage.addChild(background);
    drawGrid();
    setTimeout(() => {
        gameIsRunning = gameStatus.RUNNING;
        fieldBooleans = [0,0,0,
                         0,0,0,
                         0,0,0];
        currentPlayer = player1;
    }, 500);
}

function drawRestartButton(x,y,w,h)
{
    let restartButton = new PIXI.Container();
    let restartText = new PIXI.Text("Continue?", { fontSize: 20, fill: 'white'} );

    let buttonBox = new graphic()
    .lineStyle(5,"white",1)
    .beginFill("black")
    .drawRect(x,y,w,h)
    .endFill();
    
    restartText.x = x + 50;
    restartText.y = y + 12;
    
    
    restartButton.addChild(buttonBox);
    restartButton.addChild(restartText);
    app.stage.addChild(restartButton);
}