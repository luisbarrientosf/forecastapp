import React, { Component } from 'react';
import { get } from './services/api.js'; 

import cities from './datasets/data.js';
import socket from './services/websocket.js';
import CityForecast from './components/CityForecast.js';
import { Row, Col } from 'reactstrap';
import './App.css';

class App extends Component {

  constructor(props){
    super(props)
    this.state = { 
      lastUpdate: null,
      forecasts: []
    }
    this.renderCities = this.renderCities.bind(this);
    this.startUpdatesByCity = this.startUpdatesByCity.bind(this);
    this.getSocketForecastData = this.getSocketForecastData.bind(this);
  }

  componentWillMount(){
    this.initForecast();
    socket.emit('get_data');
    socket.on("get_forecast_data", this.getSocketForecastData);
    
    setInterval( () => { socket.emit('update_data') }, 10000);
    setInterval( () => { socket.emit('get_data') }, 10000);
  }

  async initForecast(){
    try {
      const a = await get("init", { cities } );
      this.startUpdatesByCity();
    } catch(error) {
      this.initForecast();
    }
  }

  startUpdatesByCity(){
    for (var i = 0; i < cities.length; i++) {
      this.updateCityForecats(cities[i].name);
    }
    this.setState({ lastUpdate: new Date().toString() });
  }

  async updateCityForecats(city){
    try {
      const a = await get("forecast", { city });
    } catch(error) {
      this.updateCityForecats(city);
    }
  }

  getSocketForecastData(forecasts){
    let parsedForecasts = [];
    for (let key in forecasts){
      let forecast = {
        key,
        temperature: JSON.parse(forecasts[key]).temperature,
        summary: JSON.parse(forecasts[key]).summary,
        icon: JSON.parse(forecasts[key]).icon,
      };
      parsedForecasts.push(forecast);
    }

    this.setState({ forecasts: parsedForecasts });
  }


  renderCities(){
    const forecasts = cities.map((city, index) => { 
      const key = `${city.lat},${city.lng}`;
      let forecast = this.state.forecasts.find( (o) => o.key == key );
      let icon = forecast !== undefined ? forecast.icon.toUpperCase().replace(/-/g,"_") : "CLEAR_DAY";
      return (
        <CityForecast 
          city={city}
          forecasts={this.state.forecasts}
          icon={icon}
        />
      );
    });

    return ( <Col><Row>{forecasts}</Row></Col>);
  }

  

  render() {
    return (
      <div className="AppMainContainer">
        {this.renderCities()}
        {this.state.lastUpdate && (
          <div className="lastUpdate">
            Ultima actualización: { this.state.lastUpdate }
          </div>
        )}
      </div>
    );
  }
}

export default App;
