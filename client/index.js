
const socket = io('http://localhost:3000')




socket.on("connect" ,()=>{
    console.log(`connected as ${socket.id}`)
    
    
    console.log("user connected ... !" , socket.id) ; 

    
 

})
socket.emit("ready" , ()=>{})


const winningConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
var won = false
var draw = false
//let current = "X"

var cells = ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ,""  ]
const cell = document.querySelectorAll(".cell")
const winner = document.getElementById("winner")
let result = document.getElementById("result")
let restart = document.getElementById("restart")
const statusText  = document.getElementById('statusText')
const conditionText = document.getElementById('condition')
const msg = document.getElementById('message')
let xWon = document.getElementById("xwon")
let oWon = document.getElementById("owon")
let drawResult = document.getElementById("draw")
var xCounter = 0
var oCounter = 0
var drawCounter = 0
var start = false
let isX;
let current;
let oponent;
let allow;
let player;

cell.forEach(element => {
    element.addEventListener("click" , ()=>{
        const idx = element.getAttribute("idx")
       
      
        if(cells[idx] === "" & !won & !draw & start & allow ){

           socket.emit("clicked" , {idx , element , checkWinner  , allow})
           allow = !allow
            cells[idx]= current
            checkWinner()
            element.textContent = current
           
            console.log(`isX is now ${isX}`)
           
        }
        if(!won & !draw & cells[idx] !== ""){
          
            //    current = current === "X" ?"O" : "X" 
                updateStatus()
            } else if(won || draw){
                result.style.display = "block"
                console.log(allow)
                won ? winner.textContent = `${allow ? "Oponent" : "You"} won!` : winner.textContent = "Draw!" 
    
                if(draw){
                    drawCounter +=1
    
                }else if(!allow){
                    xCounter +=1
                }else if (allow){
                    oCounter +=1
                }
                statusText.style.display = "none"
                statistics()
            }



        
    })
});

restart.addEventListener("click" , ()=>{
    socket.emit("restart")
    restartGame()
})




function checkWinner(){
    for(let i = 0  ; i < 8 ;  i++){
        
        currentCondition  = winningConditions[i]
        
        cellOne = cells[currentCondition[0]]
        cellTwo = cells[currentCondition[1]]
        cellThree = cells[ currentCondition[2]]

        if(cellOne != '' & cellOne ===cellTwo & cellOne ===cellThree){
            won =  true
            return
        }
        if(!cells.includes("")){
            draw = true
        }


    }
   
}


function restartGame(){
    won = false;
    draw = false;
    cells = ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ,""  ]
    result.style.display = "none"
    cell.forEach(element => element.textContent = ""
        )
    statusText.style.display = "block"
    updateStatus()
}


function updateStatus(){
    statusText.style.display = "block"
    statusText.innerText = allow ? "Your turn" : "Oponents turn"
}


function statistics(){
    xWon.textContent = `You : ${xCounter}`
    oWon.textContent = `Oponent : ${oCounter}`
    drawResult.textContent = `Draw : ${drawCounter}`
}

function startGame(){
    start = true
    console.log("Game has started!")
    console.log(`isX is ${isX}`)
    console.log(current)
    statusText.style.display = "block"
    conditionText.style.display = "none"
    msg.innerText = ""
}




socket.on("startGame" , (id)=>{
    isX = socket.id === id
    current = isX ? "X" : "O"
    oponent = isX ? "O" : "X"
    allow = isX ? true : false
    player = isX ? "You" : "Oponent"
    statusText.innerText = allow ? "Your turn" : "Oponents turn"
    startGame()
    
})


socket.on("restart" , ()=>{
    restartGame()
})

socket.on("clicked" , (clickedData)=>{
    console.log("clicked")

    cells[clickedData.idx] = oponent
    checkWinner()
    idx = clickedData.idx
    allow = clickedData.allow
   
    cell.forEach(element => 
        {
            const index = element.getAttribute("idx")
            if(index === clickedData.idx){
                element.innerHTML= oponent
            }
        }
        )
        console.log(allow)
        if(!won & !draw & cells[idx] !== "" & allow){
          
            //    current = current === "X" ?"O" : "X" 
                updateStatus()
            } else if(won || draw){
                result.style.display = "block"
                won ? winner.textContent = `${allow ? "Oponent" : "You"} won!` : winner.textContent = "Draw!" 
               
                if(draw){
                    drawCounter +=1
    
                }else if(!allow){
                    xCounter +=1
                }else{
                    oCounter +=1
                }
                statusText.style.display = "none"
    
                statistics()
                
            }
})

socket.on("disconnected" , (message)=>{
    msg.innerText = message
   
    socket.emit("ready")
    start = false
    conditionText.style.display = "block"
    statusText.style.display = "none"
    allow = false
    cells = ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ,""  ]
    
    cell.forEach(element => element.textContent = ""
        )
})