const http = require('http')
const fs = require('fs')
const port = process.env.PORT || 3001
const crunchData = require('./crunchData')

console.log("server")

// const server = http.createServer( (req, res) => {

//     console.log("Starting server ... ")

//     let parse = crunchData().then( (covidData) => {
//         res.setHeader('Access-Control-Allow-Origin', '*')
//         res.write(covidData)
//         res.end()
//     }).catch(e =>{
//         console.error("Error parsing data: ", e)
//     })

// })

// server.listen( port, function(error){
//     if(error){
//         console.error(error)
//     }
// })


const server = http.createServer( (req, res) => {
    let covidData = fs.readFileSync('parsed.csv')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.write(covidData)
    res.end()
})

server.listen( port, (error) => {
    if(error){
        console.log(error)
    }
})