const express= require("express")

const server= express()

server.all("/", (req,res) =>{
  res.send("Bot is running!")
})  //cream o ruta care va trimite mesajul ca sa tina serverul pornit

function keepAlive() {
  server.listen(3000, () =>{
    console.log("Server is ready.")
  })
} //initializam serverul

module.exports = keepAlive
//folosind uptimerobot o sa dam ping la acest server pentru a-l tine in functiune