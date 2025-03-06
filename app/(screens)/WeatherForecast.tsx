import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import WeatherForecastHourly from '@/components/WeatherForecastComponents/WeatherForecastHourly'
import ExpandedWeatherCard from '@/components/WeatherForecastComponents/ExpandedWeatherCard'
import DailyForecastCard from '@/components/WeatherForecastComponents/DailyForecastCard'
const WeatherForecast = () => {

  const [weatherData,setWeatherData] = useState<any>(null)
  const [loading,setLoading]= useState(true)
  const [weatherStatus,setWeatherStatus] = useState<number>(0)

  const [HourlyForecast,setHourlyForecast] = useState<any>([])

  const weatherDescriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
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



  useEffect(()=>{
    
    const FetchWeather = async()=> {

      try{
        setLoading(true);
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=15.3066&longitude=120.8564&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,windspeed_10m,surface_pressure,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,weathercode&timezone=Asia/Manila')
        const data = await response.json()
        setWeatherData(data)
        setWeatherStatus(data.hourly.temperature_2m[0])
        //alert('success')
        console.log(data)
        setLoading(false)

        const currentHourIndex = new Date().getHours(); 


        const nextHours = data.hourly.time.map((time:string,index:number)=>({
          time: new Date(time).getHours(),
          temp: data.hourly.temperature_2m[index],
          rain: data.hourly.precipitation_probability[index],
          code:data.hourly.weathercode[index]
        })).slice(currentHourIndex, currentHourIndex + 5)

        console.log(nextHours)
        setHourlyForecast(nextHours)

      }catch(err){console.log(err)}

      finally{}
    }

    FetchWeather()

  },[])

  return (
    <SafeAreaView style={styles.mainContainer}>


        {loading ? (
            <Text>Loading weather data...</Text>
          ) : (
            <>
              <ExpandedWeatherCard
                temperature={weatherData.hourly.temperature_2m[0]}
                status={weatherDescriptions[ weatherData.hourly.weathercode[0]]}
                humidity={weatherData.hourly.relative_humidity_2m?.[0]}
                chanceOfRain={weatherData?.hourly?.precipitation_probability?.[0]}
                windSpeed={weatherData?.hourly?.windspeed_10m?.[0]}
                pressure={weatherData?.hourly?.surface_pressure?.[0]}
              />

              <View style={styles.hourlyWrapper}>
                <Text style={styles.hourlyForecastHeader}>Day | Date</Text>
                <View style={styles.hourlyCardWrapper}>

                  {HourlyForecast.map((forecast:any,index:number)=> (
                    <WeatherForecastHourly
                      key={index}
                      hour={forecast.time}
                      temp={forecast.temp}
                      rain={forecast.rain}
                      code={forecast.code}

                    />
                  ))}
                  
                </View>
              </View>
              <ScrollView style={styles.dailyForecastWrapper}>
                <Text style={styles.dailyForecastHeader}>Forecast Daily</Text>

                {weatherData?.daily?.time?.map((day:string,index:number)=>(
                      <DailyForecastCard
                      key={index}
                      day={day}
                      temp={weatherData.daily.temperature_2m_max[index]}
                      rain={weatherData.daily.precipitation_probability_max[index]}
                      code={weatherData.daily.weathercode[index]}
                      
                      
                      />

                ))}

                
             
              </ScrollView>
            </>
        )}



    </SafeAreaView>
  )
}

export default WeatherForecast

const styles = StyleSheet.create({



    mainContainer:{
        flex:1,
        //borderWidth:1,
        borderColor:'black',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        paddingTop:20
    },

    scrollWrapper:{
        flex:1,
        borderWidth:1,
        borderColor:'red'
    },

    hourlyWrapper:{
      width:'100%',
      backgroundColor:"#CFFFDC",
      marginTop:20,
      marginBottom:20,
      paddingTop:10,
      paddingBottom:10
    },

    hourlyCardWrapper:{
      width:'100%',
      //borderWidth:1,
      flexDirection:'row',
      alignContent:'center',
      justifyContent:'center',
      paddingBottom:10,
      paddingTop:10
    },
    hourlyForecastHeader:{
      fontWeight:600,
      fontSize:17,
      marginLeft:15
    },
    dailyForecastWrapper:{
      flex:1,
      width:'100%',
      //borderWidth:1,
      backgroundColor:"#CFFFDC",

    },
    dailyForecastHeader:{
      fontWeight:600,
      fontSize:17,
      marginTop:15,
      marginBottom:15,
      marginLeft:15
    }
})