import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import db from "./config/dbSQL.js";
import cors from "cors";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:'*',
    methods:['GET',"POST"]
  }
});
app.use(cors());


const getNumber = async () => {
  const count = await db('wishes').count('* as totalCount').first()
   number = parseInt(count.totalCount)
}
getNumber()
let number   

io.on("connection", async (socket) => {
  
  console.log('new connection')



  socket.on('new wish', ( {name , text, lang} ) => {
    number++
    io.emit('get new wish', {
      user_name: name, 
      text: text, 
      language: lang
    });

  });


  socket.on('disconnect',()=>{
    console.log('польователь отключился')
  })
})

server.listen(process.env.PORT, () => console.log(`Socket server is working in the PORT: ${process.env.PORT}`))
