document.addEventListener('DOMContentLoaded', ()=>{
    const width = 10;
    const grid = document.querySelector('.grid');
    //Array.from() : create an array from input
    let squares = Array.from(document.querySelectorAll('.grid div'));   //getting 200 div inside the grid class
    const scoreDisplay = document.querySelector('#score');  //get score element
    const startBtn = document.querySelector('#start-btn');  //get button element

    //Creating blocks
    // Each array contains 4 arrays. Each of these 4 arrays are coordinate of the blocks. It can be in any order
    const Lblocks = [
        [1, width+1, width*2 + 1, 2],
        [width, width+1, width+2, width*2 + 2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const Zblock = [
        [0, width, width + 1, width*2 + 1],
        [width+1, width+2, width*2, width*2 +1], // Z
        [width+1, width+2, width*2, width*2 +1],
        [0, width, width + 1, width*2 +1]
    ];

    const Tblock = [
        [width, width+1, width+2, width*2 + 1],
        [1, width, width*2 + 1, width + 1],
        [1, width, width*2 +1, width + 2],
        [width*2, width*2 + 1, width*2 + 2, width+1]
    ];

    const squareblock = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];

    const Iblock = [
        [width, width+1, width+2, width+3],
        [1, width+1, width*2 +1, width*3 + 1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2 +1, width*3 + 1]
    ];

    const blocks = [Lblocks, Zblock, Tblock, squareblock, Iblock];

    let currentPos = 4;
    // let current = blocks[0][0];
    let firstRotation = 0;
    let random = Math.floor(Math.random()*blocks.length);
    let current = blocks[random][firstRotation];

    function draw(){
        // draw the block on the screen
        current.forEach(index=>{
            // add class tetromino in tot the html at the position currentPos + index
            squares[currentPos + index].classList.add('tetromino'); 
            
        })
    }

    function undraw(){
        // remove the block from the screen
        current.forEach(index => {
            squares[currentPos + index].classList.remove('tetromino');
        })
    }
    
    timeId = setInterval(moveDown, 100);    // for every 1000ms do the moveDown

    function moveDown(){
        undraw();
        currentPos += width;
        draw();
        freeze();
    }


    function freeze(){
        if(current.some(index => squares[currentPos + index + width].classList.contains('taken'))){
            //This if statement check if any index contains class taken then switch the rest of that 
            //block into class taken
            current.forEach(index => squares[currentPos + index].classList.add('taken'));
            random = Math.floor(Math.random()*blocks.length);
            current = blocks[random][firstRotation];
            currentPos = 4;
            draw();
        
        }
    }
});

