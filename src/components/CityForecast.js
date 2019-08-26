import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import Skycons from 'react-skycons';
import './CityForecast.css';

class CityForecast extends Component{
  constructor(props){
    super(props);
    this.state = {
      icon: "CLEAR_DAY",
      date: "Loading...",
      time: "Loading..."
    };
    this.getForecastTemperatureText = this.getForecastTemperatureText.bind(this);
    this.getForecastSummaryText = this.getForecastSummaryText.bind(this);
  }

  componentWillReceiveProps(){
    if (this.props.forecasts.length > 0 ){
      const key = `${this.props.city.lat},${this.props.city.lng}`;
      const forecast = this.props.forecasts.find( (obj) => obj.key == key );
      const icon2 = forecast.icon.toUpperCase().replace("-","_").toString();
      if(this.state.icon !== icon2){
        this.setState({ icon: icon2 });
      }
    }
  }

  componentDidMount(){
    setInterval(() => this.setCityTime(this.props.city), 1000);
  }
  
  getForecastTemperatureText(city){
    const key = `${city.lat},${city.lng}`;
    if (this.props.forecasts.length > 0 ){
      const forecast = this.props.forecasts.find( (obj) => obj.key == key );
      return this.farenheitToCelsius(forecast.temperature) + " ºC";
    }else{
      return "- ºC";
    }
  }

  getForecastSummaryText(city){
    const key = `${city.lat},${city.lng}`;
    if (this.props.forecasts.length > 0 ){
      const forecast = this.props.forecasts.find( (obj) => obj.key == key );
      return forecast.summary;
    }else{
      return "Loading...";
    }
  }

  setCityTime(city){
    const now = new Date();
    const dateUTC = now.getTime() + (now.getTimezoneOffset() * 60000);
    const dateStr =  new Date(dateUTC + (city.gmt * 3600000)).toLocaleString("es-EU");
    const time = dateStr.substr( dateStr.indexOf(" ") + 1, dateStr.length);
    let date = dateStr.substr( 0 , dateStr.indexOf(" ") );

    this.setState({ time, date });
  }

  farenheitToCelsius(temperature){
    return ((temperature - 32) * 5/9).toFixed(1);
  }

  render(){
    return(
      <Col xs={9} sm={6} md={4} xl={3}>
        <div className="cityForecastMainContainer night">
          <Row>

            <div>
              <div className="skyconContainer">
                <Skycons 
                  color='white' 
                  icon={this.props.icon} 
                  autoplay={true}
                /> 
              </div>
              <Col className="cityForecastSummary">
                  { this.getForecastSummaryText(this.props.city) }
              </Col>
            </div>
            
            <div className="cityForecastDetails">
              <div className="cityName">
                { `${this.props.city.name} / ${this.props.city.countryCode}` }
              </div>
              <div className="cityTemperature">
                { this.getForecastTemperatureText(this.props.city) }
              </div>
              <div className="cityDate">
                { this.state.date }
              </div>
              <div className="cityTime">
                { this.state.time }
              </div>
            </div>
            
          </Row>    
        </div>
      </Col>
    );
  }
}


export default CityForecast;