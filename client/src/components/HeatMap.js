import React, {Component} from 'react'
import GoogleMapReact from 'google-map-react'
import '../App.css'

class HeatMap extends Component{

    constructor(props){

        console.log("constructor")
        super(props)
        this.state = {
            data:[0],
            day : {positions:[], options:[]},
            date_string:"",
            days:[0],
            center : {
                lat : 39.8283,
                lng : -98.5795
            },
            zoom : 3.7,
            loading : true
        }
    }

    componentDidMount() {
        console.log("mount")
        //address of (probably not running) aws container running server code
        fetch("localhost:3001")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                data: result,
                day: {positions : result[result.length-1][1].map( (el) => {
                  let newEl = {}
                  newEl['lat'] = Number(el['lng'])  //TODO***** fix this lol
                  newEl['lng'] = Number(el['lat'])
                  // newEl['weight'] = Number(el['cases'])
                  return newEl
                }),
                options: {    
                  opacity: 0.6
                } 
                },
                days : result.map( (el) => {
                  return el[0]
                }),
                date_string : result[result.length-1][0],
                loading : false
              });
            },
            (error) => {
              console.error(error)
            }
          )
    }

    changeDate = (e) => {

      this.setState({
        date_string : e.target.innerText,
        day: {positions : this.state.data.filter((el) => el[0].includes(e.target.innerText))[0][1].map( (el2) => {
          let newEl = {}
          newEl['lat'] = Number(el2['lng'])  //TODO***** fix this lol
          newEl['lng'] = Number(el2['lat'])
          return newEl
        })}
      })
    }
    
    render(){
    
        //for demonstrative purposes only. Would obviously secure before production
        const apiKey = {key : 'AIzaSyC9w7ChJ-yY8UIbxUhmDu22Q4c9yRZM8Lw'}

        let dayList = <ul></ul>

        dayList = this.state.days.map( (el) =>
            <li
                className="DayEl"
                key = {el.toString()}
                onClick = {this.state.loading ? null : this.changeDate}
                value={el}>{el}</li>
        )

        return(
          <div className="Wrapper">
            {this.state.date_string}
            <div className="Map">
                {this.state.loading ? <div>Getting data ....</div> : <ul className="DayList">{dayList}</ul>}
                <GoogleMapReact  
                    ref={(el) => this._googleMap = el}
                    bootstrapURLKeys={apiKey}
                    defaultCenter={this.state.center}
                    defaultZoom={this.state.zoom}
                    heatmapLibrary={true}
                    heatmap={this.state.day}
                />
            </div>
        </div>
    )}
}

export default HeatMap
