import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import WeatherForecastHourly from '@/components/WeatherForecastComponents/WeatherForecastHourly'
import ExpandedWeatherCard from '@/components/WeatherForecastComponents/ExpandedWeatherCard'
import DailyForecastCard from '@/components/WeatherForecastComponents/DailyForecastCard'
import Ionicons from '@expo/vector-icons/Ionicons';


import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'




const WeatherForecast = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [weatherData,setWeatherData] = useState<any>(null)
  const [loading,setLoading]= useState(true)
  const [weatherStatus,setWeatherStatus] = useState<number>(0)
  const [timeIndex,setTimeIndex] = useState<number>(0)
  const [HourlyForecast,setHourlyForecast] = useState<any>([])

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



  useEffect(()=>{
    
    const FetchWeather = async () => {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      });
      setCurrentDate(formattedDate);
    
      try {
        setLoading(true);
    
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=15.3066&longitude=120.8564&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,windspeed_10m,surface_pressure,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,weathercode&timezone=Asia/Manila'
        );
    
        const data = await response.json();
        setWeatherData(data);
    
        // Get current time in Manila timezone
        const now = new Date();
        const localTimeString = now.toLocaleString('sv-SE', {
          timeZone: 'Asia/Manila',
          hour12: false,
        });
        const [datePart, timePart] = localTimeString.split(' ');
        const hourOnly = timePart.slice(0, 2); // e.g. "21"
        const currentHourString = `${datePart}T${hourOnly}:00`; // "2025-04-20T21:00"
    
        const timeIndex = data.hourly.time.findIndex(
          (t: string) => t === currentHourString
        );
        setTimeIndex(timeIndex)
        console.log('⏱ Matched Manila time string:', currentHourString);
        console.log('🧭 Time index:', timeIndex);
    
        // Fallback if index not found
        if (timeIndex === -1) {
          throw new Error('Current time not found in hourly data.');
        }
    
        // Extract current temperature for top card (optional)
        setWeatherStatus(data.hourly.temperature_2m[timeIndex]);
    
        // Prepare next few hours forecast
        const nextHours = data.hourly.time
          .map((time: string, index: number) => ({
            time: new Date(time).getHours(),
            temp: data.hourly.temperature_2m[index],
            rain: data.hourly.precipitation_probability[index],
            code: data.hourly.weathercode[index],
          }))
          .slice(timeIndex, timeIndex + 5); // Get current + next 4 hours
    
        console.log('📊 Next few hours:', nextHours);
        setHourlyForecast(nextHours);
    
        setLoading(false);
      } catch (err) {
        console.log('⚠️ Error:', err);
      }
    };

    FetchWeather()

  },[])

  return (
    <SafeAreaView style={styles.mainContainer}>
        <View style={styles.headerContainer}>

            <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10}} onPress={()=> router.back()}>

                <Ionicons name="arrow-back" size={30} color="#607D8B" />

            </TouchableOpacity>


        </View>
        <ScrollView contentContainerStyle={{alignItems:'center'}} style={{paddingTop:10,borderWidth:0,flex:1,width:'100%',display:'flex',flexDirection:'column'}}>

          {loading ? (
              <Text>Loading weather data...</Text>
            ) : (
              <>
                <ExpandedWeatherCard
                  temperature={weatherData.hourly.temperature_2m[timeIndex]}
                  status={weatherDescriptions[ weatherData.hourly.weathercode[0]]}
                  humidity={weatherData.hourly.relative_humidity_2m?.[0]}
                  chanceOfRain={weatherData?.hourly?.precipitation_probability?.[0]}
                  windSpeed={weatherData?.hourly?.windspeed_10m?.[0]}
                  pressure={weatherData?.hourly?.surface_pressure?.[0]}
                  currentDate={currentDate}
                />

                <LinearGradient 
                colors={['#E0F7FA','#B2EBF2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hourlyWrapper}>
                  <Text style={styles.hourlyForecastHeader}>{currentDate}</Text>
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
                </LinearGradient>


                <LinearGradient 
                
                  colors={['#E0F7FA','#B2EBF2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.dailyForecastWrapper}>
                  <Text style={styles.dailyForecastHeader}>Forecast Daily</Text>

                  {weatherData?.daily?.time?.map((day:string,index:number)=>(
                        <DailyForecastCard
                        key={index}
                        day={day}
                        temp={weatherData.daily.temperature_2m_max[index]}
                        rain={weatherData.daily.precipitation_probability_max[index]}
                        code={weatherData.daily.weathercode[index]}
                        currentDate={currentDate}
                        
                        
                        />

                  ))}

                  
              
                </LinearGradient>
              </>
          )}


        </ScrollView>





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
        //paddingTop:20
    },
    headerContainer:{
      width:'100%',
      maxHeight:50,
      //borderWidth:1,
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
      paddingVertical:10,
      height:50,
      //backgroundColor:'#2E6F40',
      //marginBottom:20,
      //backgroundColor:'white'
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