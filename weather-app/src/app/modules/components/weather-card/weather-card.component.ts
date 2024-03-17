import { Component, Input, OnInit } from '@angular/core';
import { faDroplet, faTemperatureHigh, faTemperatureLow, faWind } from '@fortawesome/free-solid-svg-icons';
import { WeatherDatas } from 'src/app/models/Interfaces/WeatherDatas';


@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',

})
export class WeatherCardComponent {
  @Input() weatherDatasInput!:WeatherDatas

  minTemperatureIcon = faTemperatureLow
  maxTemperatureIcon = faTemperatureHigh
  humidityIcon = faDroplet
  windIcon = faWind



}
