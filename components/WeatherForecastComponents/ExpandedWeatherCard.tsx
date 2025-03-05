import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native';

import Fontisto from '@expo/vector-icons/Fontisto';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ExpandedWeatherCard = () => {
  return (
    <View style={styles.mainWrapper}>
      
      <Text style={styles.locationText}>Location</Text>


      <View style={styles.mainInfoWrapper}>

        <View style={styles.mainWeatherIconWrapper}>
          <MaterialCommunityIcons name="weather-sunny-alert" size={100} color="#253D2C" />

        </View>


        <View style={styles.mainWeatherDetailWrapper}>
            <Text style={styles.dateMainText}>Date</Text>
            <Text style={styles.tempMainText}>Temp°C</Text>
            <Text style={styles.statusMainText}>Status</Text>
        </View>

      </View>

      <View style={{width:'95%',height:1,backgroundColor:'#253D2C',marginBottom:15}}></View>




      <View style={styles.subInfoWrapper}>

        <View style={styles.subInfoContainer}>
          
          <Fontisto name="wind" size={30} color="#253D2C"  style={{marginLeft:10}}/>

          <View style={styles.statusTextWrapper}>
            <Text>status</Text>
            <Text style={styles.subStatusContext}>Wind</Text>
          </View>
          
        </View>

        <View style={styles.subInfoContainer}>
          
        <Fontisto name="rain" size={30} color="#253D2C"  style={{marginLeft:10}}/>
          <View style={styles.statusTextWrapper}>
            <Text>status</Text>
            <Text style={styles.subStatusContext}>Chance of rain</Text>
          </View>
        </View>


        <View style={styles.subInfoContainer}>
          
        <Feather name="thermometer"  size={30} color="#253D2C"  style={{marginLeft:10}}/>
          <View style={styles.statusTextWrapper}>
            <Text>status</Text>
            <Text style={styles.subStatusContext}>Pressure</Text>
          </View>
        </View>


        <View style={styles.subInfoContainer}>
          
        <Feather name="droplet"  size={30} color="#253D2C"  style={{marginLeft:10}}/>
          <View style={styles.statusTextWrapper}>
            <Text>status</Text>
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
      marginLeft:10
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