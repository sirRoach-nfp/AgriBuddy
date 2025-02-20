import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

import WeatherCard from '@/components/genComponents/WeatherCard'
import { ScrollView } from 'react-native-gesture-handler'
const home = () => {
  return (

    <>  
     
    
        <ScrollView style={styles.container} contentContainerStyle={{alignItems:'center'}}>

            <WeatherCard/>

        </ScrollView>
    
    
    </>

  )
}

export default home

const styles = StyleSheet.create({

    container : {
        flex: 1,
        borderColor:'black',
        borderWidth:1,
        flexDirection:'column',
        

    }



})