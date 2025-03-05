import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import ExpandedWeatherCard from '@/components/WeatherForecastComponents/ExpandedWeatherCard'
const WeatherForecast = () => {

  const [weatherData,setWeatherData] = useState(null)
  const [loading,setLoading]= useState(true)


  useEffect(()=>{
    
    const FetchWeather = async()=> {

      try{
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=15.3066&longitude=120.8564&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia/Manila')
        const data = await response.json()
        setWeatherData(data)
        alert('success')
      }catch(err){console.log(err)}

      finally{}
    }

    FetchWeather()

  },[])

  return (
    <SafeAreaView style={styles.mainContainer}>


        <ExpandedWeatherCard/>

        <ScrollView>

            
        </ScrollView>




    </SafeAreaView>
  )
}

export default WeatherForecast

const styles = StyleSheet.create({



    mainContainer:{
        flex:1,
        borderWidth:1,
        borderColor:'black',
        display:'flex',
        flexDirection:'column',
        alignItems:'center'
    },

    scrollWrapper:{
        flex:1,
        borderWidth:1,
        borderColor:'red'
    }
})