import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const WeatherForecast = () => {
  return (
    <SafeAreaView>


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
        borderColor:'black'
    },

    scrollWrapper:{
        flex:1,
        borderWidth:1,
        borderColor:'red'
    }
})