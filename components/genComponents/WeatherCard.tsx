import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCloudSun} from '@fortawesome/free-solid-svg-icons'
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';



const WeatherCard = () => {

    const [currentDate, setCurrentDate] = useState('');

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
           return  <MaterialCommunityIcons name="weather-sunny" size={80} color="#253D2C" />
           break;
          case 'Partly cloudy':
            return  <MaterialCommunityIcons name="weather-partly-cloudy" size={80} color="#253D2C" />
            break;
          case 'Cloudy':
            return  <MaterialCommunityIcons name="weather-cloudy" size={80} color="#253D2C" />
            break;
          case 'Slight rain' :
            return  <MaterialCommunityIcons name="weather-rainy" size={80} color="#253D2C" />
            break;
    
          case 'Light drizzle':
            return <Feather name="cloud-drizzle" size={80} color="#253D2C" />
            break;

          case 'Overcast':
            return <Ionicons name="cloudy-sharp" size={80} color="#253D2C" />
    
          case 'Thunderstorm' : 
            <Ionicons name="thunderstorm-outline" size={80} color="#253D2C" />
            break
     
         
        }
      }

      



  const navigateToWeather = ()=>{


    router.push('/(screens)/WeatherForecast')
  }

  const [loading,setLoading] = React.useState(false);
  const [weatherData,setWeatherData] = useState<any>()

  useEffect(()=>{
    const FetchWeather = async () => {


        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        setCurrentDate(formattedDate);

        try {
          setLoading(true);
          const response = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=15.3066&longitude=120.8564&hourly=temperature_2m,weathercode&timezone=Asia/Manila'
          );
          const data = await response.json();
      
          const currentHourIndex = new Date().getHours(); // Get the current hour index
      
          // Extract current weather status and temperature
          const currentTemperature = data.hourly.temperature_2m[currentHourIndex];
          const currentWeatherCode = data.hourly.weathercode[currentHourIndex];
      
          setWeatherData({
            temperature: currentTemperature,
            weatherStatus: currentWeatherCode,
          });
      
          console.log('Current Temperature:', currentTemperature);
          console.log('Current Weather Code:', currentWeatherCode);
      
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      };

     FetchWeather();
  },[])

  const testData = ()=> {

    console.log(weatherData.temperature)
  }

  
  return (
    <View style={styles.container}>


        {loading ? ( <Text>Loading...</Text>) : (



            <>
                
                
            <View style = {styles.topPart}>
                <Text style={styles.locationText}> San Antonio</Text>
                <Text style={styles.dateText}> {currentDate}</Text>
            </View>

            <View style = {styles.midPart}>
                <Text style={styles.tempText}>{weatherData?.temperature}°C</Text>
                {getWeatherIcon(weatherDescriptions[weatherData?.weatherStatus])}
            </View>

            <View style = {styles.bottomPart}>

                <View style={styles.bottomPartDiv1}>
                    <Text style={styles.weatherStatus}>{weatherDescriptions[weatherData?.weatherStatus]}</Text>
                  
                </View>

                <View style={styles.bottomPartDiv2}>
                    <TouchableOpacity onPress={navigateToWeather}>
                        <Text style={styles.seeMore}>See more</Text>
                    </TouchableOpacity>
                    
                </View>

              

            </View>
        
            </>


        )}

        
      
    </View>
  ) 
}

export default WeatherCard

const styles = StyleSheet.create({

    container : {
        width: '95%',
        height:220,
        paddingTop:10,
        paddingBottom:10,
       // borderColor: 'black',
        //borderWidth: 1,
        display:'flex',
        flexDirection:'column',
        backgroundColor:'#CFFFDC',
        marginTop:10,
        borderRadius:5,
        marginBottom:25,
        elevation:3
     
    },


    topPart : {
        width:"100%",
        flex: 1,
        display:'flex',
        flexDirection:'column',
        //: 'black',
        //borderWidth: 1,
        justifyContent:'center',
    
        
    },

    
    midPart : {
        width:"100%",
        flex: 2,
        display:'flex',
        flexDirection:'row',
        //borderColor: 'black',
        alignItems:'center',
        //borderWidth: 1,
        paddingHorizontal:20
    },



    
    bottomPart : {
        width:"100%",
        flex: 1,
        display:'flex',
        flexDirection:'row',
        //: 'black',
       // borderWidth: 1,
    },


    bottomPartDiv1 : {
        //borderWidth: 1,
        marginTop:'auto',
        paddingBottom:10
    },

    bottomPartDiv2 : {
        //borderWidth: 1,
        marginLeft: 'auto',
        display:'flex',
        flexDirection:'column',
        marginTop:'auto',
        paddingBottom:10
        
    },

    // text styling

    locationText : {
        fontSize: 25,
        fontWeight:600,
        color:'#253D2C',
        marginLeft: 10
    },

    dateText : {
        fontSize: 16,
        marginLeft:10,
        fontWeight:600,
        color:'#253D2C',
    },

    tempText : {
        fontSize: 40,
        fontWeight:600,
        color:'#253D2C',
        marginRight: 20,
        marginLeft: 'auto',
    },

    weatherStatus : {
        color:'#253D2C',
        marginLeft: 10,
        fontSize: 15,
        fontWeight:600,
    },
    tempStatus : {
        color:'#253D2C',
        marginLeft: 10,
        fontSize: 15,
        fontWeight:400,
    },

    seeMore : {
        marginRight: 20,
        fontSize:16,
        textDecorationLine:'underline',
        color:'#253D2C',
        fontWeight: 500,
        marginTop:'auto'

    },


    // icon styling
    iconStyle:{
        marginRight:20,
    },

})