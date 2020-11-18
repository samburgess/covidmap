const crunchData = require('./crunchData')

let parse = crunchData().then( (covidData) => {
    console.log(covidData)
}).catch(e =>{
    console.error("Error parsing data: ", e)
})
