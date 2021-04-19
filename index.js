const Discord = require("discord.js") 
const fetch = require("node-fetch")
const keepAlive= require("./server")
const Database = require("@replit/database")

const db = new Database()
const client = new Discord.Client()

const sadWords=["sad", "depressed", "victor", "unhappy", "angry"]

const starterEncouragements=[
  "Cheer up!",
  "Hang in there.",
  "You are a great person/bot!"
]

db.get("encouragements").then(encouragements =>{
  if(!encouragements || encouragements.length < 1){
    db.set("encouragements", starterEncouragements)
  } 
}) //setam niste incurajari de baza in cazul in care vectorul nostru e nul

db.get("responding").then(value => {
  if (value == null) {
    db.set("responding", true)
  }
}) //functie care da enable sau disable la raspunsuri la mesaje triste
function getQuote() {
  return fetch("https://zenquotes.io/api/random") //facem rost de obiecte (quoteuri) prin API
  .then(res => {
    return res.json() //convertim textul in json care se poate citi
  }) 
  .then(data => {
    return data[0]["q"]+" -"+data[0]["a"] //quote si autor pt data
  })
}

function updateEncouragements(encouragingMessage){
  db.get("encouragements").then(encouragements =>{
    encouragements.push([encouragingMessage])
    db.set("encouragements", encouragements)
  })
} //facem o functie care permite adaugarea de quote-uri noi de catre oricine

function deleteEncouragement(index){
   db.get("encouragements").then(encouragements =>{
    if(encouragements.length > index){
      encouragements.splice(index, 1)
      db.set("encouragements", encouragements)
    }
    
  })
} //facem si o functie care sa permita stergerea

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})
//avem o functie(un event de fapt) care se executa atunci cand eventul "ready" apare
//folosim $ ca sa luam subcategoriile obiectului client 
client.on("message", msg =>{
if(msg.author.bot) return //nu face nimic daca trimite el mesajul ca sa nu se repete la infinit

  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote)) //verificam daca exista quoteul si il trimitem pe canalul de discord
  }
  db.get("responding").then(responding =>{
    if(responding && sadWords.some(word => msg.content.includes(word))) //verificam daca avem cuv triste
     {
     db.get("encouragements").then(encouragements => {
     const encouragement=encouragements[Math.floor(Math.random() * encouragements.length)]
     msg.reply(encouragement) //cream cuvintele de incurajare si ne da un nr random din  indexul vectorului encouragements
     })
     }
  })
  
  if(msg.content.startsWith("$new")) {
   encouragingMessage = msg.content.split("$new ")[1] //adaugam mesajul
    updateEncouragements(encouragingMessage)
    msg.channel.send("New encouraging message added.")
  }

  if(msg.content.startsWith("$del")) {
   index = parseInt(msg.content.split("$del ")[1]) //parseInt transforma nr in string
    deleteEncouragement(index)
    msg.channel.send("Encouraging message deleted.")
  }
  if(msg.content.startsWith("$list")) {
    db.get("encouragements").then(encouragements =>{
      msg.channel.send(encouragements)
    })
  }
  if(msg.content.startsWith("$responding")) {
   value = msg.content.split("$responding ")[1]
     if(value.toLowerCase() == "true"){
     db.set("responding", true)
     msg.channel.send("Responding is on.")

    } else {db.set("responding", false)
     msg.channel.send("Responding is off.")}
   }

})
//avem o functie(un event de fapt) care se executa atunci cand eventul "message" apare
keepAlive()
client.login(process.env.TOKEN)
//.env e ascuns de toata lumea, restul fisierelor sunt vizibile, token e pt bot