import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type dailyData = {
    day:string,
    temp: number,
    rain: number,
    code:number
}


const DailyForecastCard = ({day,temp,rain,code}:dailyData) => {
  return (
    <View style={styles.wrapper}>

      <Text style={styles.day}>{day}</Text>

      <View style={styles.statusWrapper}>
        <MaterialCommunityIcons name="weather-partly-cloudy" size={30} color="#253D2C"  style={styles.icon}/>
        <Text style={styles.status}>{rain}% rain</Text>

      </View>

      <Text style={styles.temp}>{temp}°C</Text>
    </View>
  )
}

export default DailyForecastCard

const styles = StyleSheet.create({
    wrapper:{
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        //justifyContent:'space-evenly',
        alignItems:'center',
        paddingLeft:20,
        paddingRight:20,
        marginBottom:20
    },

    statusWrapper:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        //borderWidth:1,
        marginLeft:'auto',
        marginRight:'auto',
        width:100
    },

    day:{
        fontSize:15,
        fontWeight:700,
        color:'#253D2C'
    },
    status:{
        fontWeight:500,
        fontSize:15,
        color:'#253D2C'
        //borderWidth:1
        
    },
    temp:{
        fontWeight:500,
        fontSize:15,
        //borderWidth:1,
        width:50,
        color:'#253D2C'
    },
    icon:{
        marginRight:10
    }
})