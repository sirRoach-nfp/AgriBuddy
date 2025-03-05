import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCloudSun} from '@fortawesome/free-solid-svg-icons'
import { router } from 'expo-router';



const WeatherCard = () => {


  const navigateToWeather = ()=>{


    router.push('/(screens)/WeatherForecast')
  }

  
  return (
    <View style={styles.container}>

        <View style = {styles.topPart}>
            <Text style={styles.locationText}> San Antonio</Text>
            <Text style={styles.dateText}> 14 Feb</Text>
        </View>
        <View style = {styles.midPart}>
            <Text style={styles.tempText}>21°C</Text>
            <FontAwesomeIcon icon={faCloudSun} size={75} color='#253D2C' style={styles.iconStyle}/>
        </View>
        <View style = {styles.bottomPart}>

            <View style={styles.bottomPartDiv1}>
                <Text style={styles.weatherStatus}>Scattered Rain</Text>
                <Text style={styles.tempStatus} >21°C / 24°C</Text>
            </View>

            <View style={styles.bottomPartDiv2}>
                <TouchableOpacity onPress={navigateToWeather}>
                    <Text style={styles.seeMore}>See more</Text>
                </TouchableOpacity>
                
            </View>

        </View>
      
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
        marginBottom:10,
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
    },

    bottomPartDiv2 : {
        //borderWidth: 1,
        marginLeft: 'auto',
        display:'flex',
        flexDirection:'column'
        
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