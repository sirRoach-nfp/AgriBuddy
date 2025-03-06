import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


type hourlyData = {
    hour: number,
    temp: number,
    rain: number,
    code:number

}
const WeatherForecastHourly = ({hour,temp,rain,code}:hourlyData) => {


  return (
    <View style={styles.wrapper}>
      <Text style={styles.hour}>{hour}:00</Text>
      <MaterialCommunityIcons name="weather-partly-cloudy" size={30} color="black" />
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