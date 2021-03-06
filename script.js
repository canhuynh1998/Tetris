document.addEventListener('DOMContentLoaded', ()=>{
    
    // Essential variables
    const width = 10;
    let timerId;
    let score = 0;
    let nextRandom = 0;

    //D.O.M
    //Array.from() : create an array from input
    let squares = Array.from(document.querySelectorAll('.grid div'));   //getting 200 div inside the grid class
    const scoreDisplay = document.querySelector('#score');  //get score element
    const startBtn = document.querySelector('#start-btn');  //get button element
    const testBtn = document.querySelector('#test');
    const grid = document.querySelector('.grid');
    //Creating blocks
    // Each array contains 4 arrays. Each of these 4 arrays are coordinate of the blocks. It can be in any order
    const Lblocks = [[1, width+1, width*2 + 1, 2], [width, width+1, width+2, width*2 + 2], 
                     [1, width+1, width*2+1, width*2],[width, width*2, width*2+1, width*2+2]];

    const Zblock = [[0,width,width+1,width*2+1], [width+1, width+2,width*2,width*2+1],
                    [0,width,width+1,width*2+1],[width+1, width+2,width*2,width*2+1] ];

    const Tblock = [[1,width,width+1,width+2],[1,width+1,width+2,width*2+1],
                    [width,width+1,width+2,width*2+1],[1,width,width+1,width*2+1]];

    const squareblock = [[0, 1, width, width+1],[0, 1, width, width+1],
                         [0, 1, width, width+1],[0, 1, width, width+1] ];

    const Iblock = [[width, width+1, width+2, width+3],[1, width+1, width*2 +1, width*3 + 1],
                    [width, width+1, width+2, width+3],[1, width+1, width*2 +1, width*3 + 1]];

    const colors = ['orange', 'red', 'purple','green','blue'];
    const blocks = [Lblocks, Zblock, Tblock, squareblock, Iblock];

    let currentPos = 4;
    let firstRotation = 0;
    let random = Math.floor(Math.random()*blocks.length);
    let current = blocks[random][firstRotation];

    function draw(){
        // draw the block on the screen
        current.forEach(index => {
            squares[currentPos + index].classList.add('tetromino');
            squares[currentPos + index].style.backgroundColor = colors[random];
        });
        
    }

    function undraw(){
        // remove the block from the screen
        current.forEach(index => {
            squares[currentPos + index].classList.remove('tetromino');
            squares[currentPos + index].style.backgroundColor = '';
        });
    }
    
    //Controlling the blocks
    function control(e){
        if(e.keyCode === 37){
            moveLeft();
        }
        else if(e.keyCode === 39){
            moveRight();
        }
        else if(e.keyCode === 38){
            rotate();
        }
        else if(e.keyCode === 40){
            moveDown();
        }
    }
    document.addEventListener('keyup', control);
    
    function freeze(){
        if(current.some(index => squares[currentPos + index + width].classList.contains('taken'))){
            //This if statement check if any index contains class taken then switch the rest of that 
            //block into class taken.
            // Block will stop at the end
            current.forEach(index => squares[currentPos + index].classList.add('taken'));
            random = nextRandom;
            nextRandom = Math.floor(Math.random()*blocks.length);
            current = blocks[random][firstRotation];
            currentPos = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }


    /********************MOVING BLOCKS********************/
    function moveLeft(){
        //move the block to the left
        undraw();
        // current is an array and if any value in this array === 0 isLeftEdge is True
        const isLeftEdge = current.some(index => (currentPos + index) % width === 0);
        if(!isLeftEdge){
            currentPos--;
        }
        if(current.some(index => squares[currentPos + index].classList.contains('taken'))){
            currentPos+=1;  // get back to the previous position.
        }
        draw();
    }

    function moveRight(){
        //move the block to the right
        //same logic with moveLeft()
        undraw();
        const isRightEdge = current.some(index => (currentPos + index) % width === width - 1)
        if(!isRightEdge){
            currentPos++;
        }
        if(current.some(index => squares[currentPos + index].classList.contains('taken'))){
            currentPos--;
        }
        draw();
    }

    function rotate(){
        undraw();
        firstRotation++;
        if(firstRotation === current.length){
            firstRotation = 0;
        }
        console.log(currentPos);
        current = blocks[random][firstRotation];
        console.log(current);
        rotateCheck();
        draw();
    }

    function moveDown(){
        //Move the block down 
        undraw();
        currentPos += width;
        draw();
        freeze();
    }

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0

    // Choose a fix block to display
    const nextBlocks =[
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    function displayShape(){
        //display new block
        displaySquares.forEach(square=>{
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        })
        nextBlocks[nextRandom].forEach(index =>{
            displaySquares[displayIndex+index].classList.add('tetromino');
            displaySquares[displayIndex+index].style.backgroundColor = colors[nextRandom];
        })
    }

    function addScore(){
        for(let i = 0; i<199; i+= width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += width;
                scoreDisplay.innerHTML = score;
                row.forEach(index =>{
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                })
                const removedSquare = squares.splice(i, width);
                squares = removedSquare.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }
    
    function gameOver(){
        if(current.some(index=> squares[currentPos + index].classList.contains('taken'))){

            console.log(score);
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }



    /********************Rotation checking********************/
    function rightEdge(){
        return current.some(index => (currentPos+index+1)%width ===0);
    }
    function leftEdge(){
        return current.some(index =>(currentPos + index) % width === 0);
    }

    function rotateCheck(P){
        //Check if the rotation is out of bound
        P = P || currentPos;
        if((P+1) % width < 4){
            if(rightEdge()){
                currentPos++;
                rotateCheck(P);
            }
        }else if((P % width) > 5){
            if(leftEdge()){
                currentPos--;
                rotateCheck(P);
            }
        }
    }


    /********************Button functionality********************/
    testBtn.addEventListener('click', ()=>{location.reload();});    //refresh the page.
    
    startBtn.addEventListener('click',() =>activate());

    function activate(){
        if(timerId){
            //this is to pause the game
            clearInterval(timerId);
            timerId = null;
        }else{
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*blocks.length);
            displayShape();
        }
    }
});

//array.splice(index, count)