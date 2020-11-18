const fs = require('fs')
const neatCsv = require('neat-csv')
const shell = require('shelljs')

//clone from nyt database
// shell.cd('./data/nyt')
// shell.exec('git pull')
// shell.cd('../..')

//clones data from nyt database and formats to schema. 


const crunchData = async () => {

    console.log("crunchdata")

    const counties = fs.readFileSync('./data/county_coords.csv')

    let countyRaw = await neatCsv(counties)

    let rawCodes = fs.readFileSync('./data/state_abreviations.json')

    let stateCodes = JSON.parse(rawCodes)

    stateCodes = stateCodes.data
    
    let countyArr = countyRaw.map( (el) => {
        let newEl = {}
        newEl['state'] = el['STATE,C,2']
        newEl['name'] = el['COUNTYNAME,C,24']
        newEl['lat'] = el['LAT,N,19,11']
        newEl['lon'] = el['LON,N,19,11']
        return newEl
    })

    //map of <"County, State": [lat, lon]>
    let countyData = new Map()
    for(let i = 0; i < countyArr.length; i++){
        countyData.set(`${countyArr[i]['name']}, ${countyArr[i]['state']}`, [countyArr[i]['lat'], countyArr[i]['lon']])
    }


    //parse list of covid cases
    const nyt = fs.readFileSync('./data/nyt/us-counties.csv')

    let nytRaw = await neatCsv(nyt)

    //array of days
    //contents of day: [["County, State", weight, lat, lon], ...]
    //where weight = num cases *** TODO *** add option to swith between cases / deaths

    //first split raw data into array of arrays for each date
    let i = 0
    let days = new Map()
    let curDate = ""
    while(i < nytRaw.length){
        if(nytRaw[i]['date'] !== curDate){   //create new day entry & add entry
            curDate = nytRaw[i]['date']
            days.set(nytRaw[i]['date'], [])
        }
        let coordKey = ""
        try{
            coordKey = `${nytRaw[i]['county']}, ${stateCodes[stateCodes.map( (e) => e['State']).indexOf(nytRaw[i]['state'])]['Code']}`
        }catch(err){}
        if(countyData.get(coordKey)!=null){
            days.get(nytRaw[i]['date']).push( {
                "county" : coordKey,
                "state" : nytRaw[i]['state'],
                "cases" : nytRaw[i]['cases'], //TODO** find max, normalize??
                "lng" : countyData.get(coordKey)[0],
                "lat" : countyData.get(coordKey)[1]
            })
        }
        i++
    }//while

    // spread operator converts map to array, stringify converts array to json
    

    let stringd = await JSON.stringify([... days])
    let ret = fs.writeFileSync('./parsed.csv', stringd)
    console.log("end crunchdata")
    return ret

}//crunchdata

crunchData()

module.exports = crunchData
