import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
const PlotMinCard = () => {

    const navigateToPlot =()=>{
        router.push('/(screens)/PlotManagementScreen')
    }
  return (
    <TouchableOpacity style={styles.container} onPress={navigateToPlot}>

      <View style={styles.thumbnail}>

      </View>


      <View style={styles.infoWrapper}>
        <Text style={styles.plotName}>Farm Plot # Name</Text>
        <View style={styles.badge}>
            <Text >
                Growing
            </Text>
        </View>
      </View>
      
    </TouchableOpacity>
  )
}

export default PlotMinCard

const styles = StyleSheet.create({

    container:{
        width:'100%',
        borderWidth:1,
        marginBottom:5,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },

    thumbnail:{
        width:100,
        height:60,
        borderWidth:1
    },
    infoWrapper:{
        marginLeft:10,
        display:"flex",
        flexDirection:'column',
        borderWidth:1,
        marginBottom:'auto',
        height:'100%'
    },
    badge:{
        width:100,
        height:20,
        borderWidth:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:10,
        paddingBottom:10,
 
        borderRadius:5,
        marginTop:'auto'
    },
    //text 
    plotName:{
        fontSize:16,
        fontWeight:500,
         color:'#253D2C'
    }
})