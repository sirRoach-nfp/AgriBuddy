import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';


type hourlyData = {
    hour: number,
    temp: number,
    rain: number,
    code:number

}


const weatherDescriptions: { [key: number]: string } = {
  0: 'Clear sky',//goods
  1: 'Mainly clear',
  2: 'Partly cloudy', //goods
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle', // goods
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain', // Slight rain
  63: 'Moderate rain', // color  orange 
  65: 'Heavy rain', // color red
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};


  const getWeatherIcon = (status:string) => {

    switch(status){
      case 'Clear sky':
       return  <MaterialCommunityIcons name="weather-sunny" size={30} color="#253D2C" />
       break;
      case 'Partly cloudy':
        return  <MaterialCommunityIcons name="weather-partly-cloudy" size={30} color="#253D2C" />
        break;
      case 'Cloudy':
        return  <MaterialCommunityIcons name="weather-cloudy" size={30} color="#253D2C" />
        break;
      case 'Slight rain' :
        return  <MaterialCommunityIcons name="weather-rainy" size={30} color="#253D2C" />
        break;

      case 'Light drizzle':
        return <Feather name="cloud-drizzle" size={30} color="#253D2C" />
        break;

      case 'Thunderstorm' : 
        <Ionicons name="thunderstorm-outline" size={30} color="#253D2C" />
        break;

      case 'Overcast':

        return <Fontisto name="cloudy" size={30} color="#253D2C" />
        break;
 
     
    }
  }


const WeatherForecastHourly = ({hour,temp,rain,code}:hourlyData) => {


  return (
    <View style={styles.wrapper}>
      <Text style={styles.hour}>{hour}:00</Text>
      {getWeatherIcon(weatherDescriptions[code])}
      <Text style={styles.temp}>{temp}°C</Text>
      <Text>{rain}% rain</Text>



    </View>
  )
}

export default WeatherForecastHourly

const styles = StyleSheet.create({

    wrapper:{
        display:'flex',
        flexDirection:'column',
        //borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        width:80
    },
    hour:{
        fontWeight:500,
        fontSize:15
    },
    temp:{
        fontWeight:400
    }

})