import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native';

import Fontisto from '@expo/vector-icons/Fontisto';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

type currentWeather = {

  temperature:string,
  status:string,
  humidity:string,
  windSpeed:string,
  chanceOfRain:string,
  pressure:string,
}


const ExpandedWeatherCard = ({temperature,status,humidity,windSpeed,chanceOfRain,pressure}:currentWeather) => {


  const getWeatherIcon = (status:string) => {

    switch(status){
      case 'Clear sky':
       return  <MaterialCommunityIcons name="weather-sunny" size={100} color="#253D2C" />
       break;
      case 'Partly cloudy':
        return  <MaterialCommunityIcons name="weather-partly-cloudy" size={100} color="#253D2C" />
        break;
      case 'Cloudy':
        return  <MaterialCommunityIcons name="weather-cloudy" size={100} color="#253D2C" />
        break;
      case 'Slight rain' :
        return  <MaterialCommunityIcons name="weather-rainy" size={100} color="#253D2C" />
        break;

      case 'Light drizzle':
        return <Feather name="cloud-drizzle" size={100} color="#253D2C" />
        break

      case 'Thunderstorm' : 
        <Ionicons name="thunderstorm-outline" size={100} color="#253D2C" />
        break
 
     
    }
  }
  
  return (
    <View style={styles.mainWrapper}>
      
      <Text style={styles.locationText}>Location</Text>


      <View style={styles.mainInfoWrapper}>

        <View style={styles.mainWeatherIconWrapper}>



         {getWeatherIcon(status)}

        </View>


        <View style={styles.mainWeatherDetailWrapper}>
            <Text style={styles.dateMainText}>Date</Text>
            <Text style={styles.tempMainText}>{temperature}°C</Text>
            <Text style={styles.statusMainText}>{status}</Text>
        </View>

      </View>

      <View style={{width:'95%',height:1,backgroundColor:'#253D2C',marginBottom:15}}></View>




      <View style={styles.subInfoWrapper}>

        <View style={styles.subInfoContainer}>
          
          <Fontisto name="wind" size={30} color="#253D2C"  style={{marginLeft:20}}/>

          <View style={styles.statusTextWrapper}>
            <Text>{windSpeed} km/h</Text>
            <Text style={styles.subStatusContext}>Wind</Text>
          </View>
          
        </View>

        <View style={styles.subInfoContainer}>
          
        <Fontisto name="rain" size={30} color="#253D2C"  style={{marginLeft:20}}/>
          <View style={styles.statusTextWrapper}>
            <Text>{chanceOfRain}%</Text>
            <Text style={styles.subStatusContext}>Chance of rain</Text>
          </View>
        </View>


        <View style={styles.subInfoContainer}>
          
        <Feather name="thermometer"  size={30} color="#253D2C"  style={{marginLeft:20}}/>
          <View style={styles.statusTextWrapper}>
            <Text>{pressure} mbar</Text>
            <Text style={styles.subStatusContext}>Pressure</Text>
          </View>
        </View>


        <View style={styles.subInfoContainer}>
          
        <Feather name="droplet"  size={30} color="#253D2C"  style={{marginLeft:20}}/>
          <View style={styles.statusTextWrapper}>
            <Text>{humidity}%</Text>
            <Text style={styles.subStatusContext}>Humidity</Text>
          </View>
        </View>

      </View>
      
    </View>
  )
}

export default ExpandedWeatherCard

const styles = StyleSheet.create({
    mainWrapper:{
        width:'95%',
        display:'flex',
        flexDirection:'column',
        backgroundColor:'#CFFFDC',paddingTop:10,paddingBottom:10,
        borderRadius:10,
        alignItems:'center'
    },
    subInfoWrapper:{
      width:'95%',
      //borderWidth:1,
      borderColor:'green',
      flexDirection:'row',
      display:'flex',
      flexWrap:'wrap'
    },
    subInfoContainer:{
      width:'50%',
      //backgroundColor:'blue',
      //borderWidth:1,
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      paddingTop:5,
      paddingBottom:5,
      marginBottom:10
    },

    mainInfoWrapper:{
      width:'100%',
      display:'flex',
      flexDirection:"row",
      paddingTop:10,
      paddingBottom:10,
      marginBottom:20
    
    },

    mainWeatherIconWrapper:{
      flex:1,
      //borderWidth:1,
      //borderColor:'red',
      display:'flex',
      alignItems:'center',
      justifyContent:'center'
    },

    mainWeatherDetailWrapper:{
      display:'flex',
      flexDirection:'column',
      flex:1,
      //borderWidth:1,
      borderColor:'red',
      alignItems:'center'
    },
    substatus:{
      width:30,height:30,backgroundColor:'black',
      marginLeft:20
    },
    subStatusContext:{
      fontWeight:500
    },
    statusTextWrapper:{
      display:"flex",
      flexDirection:'column',
      //borderWidth:1,
      flex:1,
      paddingLeft:20
    },



    //texts 

    locationText:{
      //marginTop:10,
      marginBottom:10,
      fontSize:18,
      fontWeight:600,
      textAlign:'center'
    },

    dateMainText:{
      fontSize:16,
      fontWeight:500,
      color:"#253D2C",

    },

    tempMainText:{
      fontSize:35,
      fontWeight:500,
      color:"#253D2C",
      marginTop:5,
      marginBottom:5
    },

    statusMainText:{
      fontSize:16,
      fontWeight:500,
      color:"#253D2C",
    },


})