const http = require("http")
const server = http.createServer()
const io = require('socket.io')(server , {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
let availablePlayer =0 
 
io.on("connection"  , (socket)=>{
    console.log(`new client connected with ${socket.id}`)
        let room;
    socket.on("ready" ,  ()=>{
       
             
         
        room = `room -  ${Math.floor(availablePlayer / 2)}`;
        availablePlayer++;
        socket.join(room);
        console.log("user is ready" , socket.id , room);
           
        if(availablePlayer % 2 == 0){
            io.to(room).emit("startGame" , socket.id) 
            console.log("the game has started!")
        }
    }) 

    socket.on("clicked" , (index)=>{
        socket.to(room).emit("clicked" , index )
    })
  
    socket.on("restart" , ()=>{
        socket.to(room).emit("restart")
    })

    socket.on("disconnect" , ()=>{
        io.to(room).emit("disconnected" ,  "user disconnected")
        console.log("user disconnected....!")

    })
})
 
      
    

server.listen(3000 , ()=>{
    console.log('listening on port 3000.....')
})    