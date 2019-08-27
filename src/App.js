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
    this.getSocketForecastData = this.getSocketForecastData.bind(this);
    this.initForecast = this.initForecast.bind(this);
    this.initUpdateForecast = this.initUpdateForecast.bind(this);
  }

  componentDidMount(){
    for (var i = 0; i < cities.length; i++) {
      this.initForecast(cities[i]);
    }

    socket.on("init_error", this.initForecast);
    socket.on("init_completed", this.initUpdateForecast);

    socket.on("update_error", this.updateForecast);
    socket.on("update_completed", this.getSocketForecastData);
  }

  initForecast(city){
    socket.emit('init', city);
  }

  initUpdateForecast(city){
    const cityName = city.name; 
    this.updateForecast(cityName);
    setInterval( (cityName) => this.updateForecast(cityName) , 10000, cityName)
  }

  updateForecast(cityName){
    socket.emit('update', cityName) 
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

    this.setState({ forecasts: parsedForecasts, lastUpdate: new Date().toString() });
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