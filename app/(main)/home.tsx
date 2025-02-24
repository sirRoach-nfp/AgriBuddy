import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faNewspaper } from '@fortawesome/free-regular-svg-icons'

import WeatherCard from '@/components/genComponents/WeatherCard'
import TaskCard from '@/components/genComponents/TaskCard'
import ArticleCard from '@/components/genComponents/ArticleCard'



import { ScrollView } from 'react-native-gesture-handler'



const { width } = Dimensions.get('window');

const home = () => {
  return (

    <>  
     
    
        <ScrollView style={styles.container} contentContainerStyle={{alignItems:'center'}}>

            <WeatherCard/>
            <TaskCard/>


            <View style={styles.AgriInsightContainer}>

              <View style={styles.AgriInsightHeader} >
                <FontAwesomeIcon icon={faNewspaper} size={20} color='#2E6F40' style={styles.iconstyle}/>
                <Text style={styles.AgriInsightH}>Agri Insights</Text>
                <Text style={styles.AgriInsightSeeMore}>See More</Text>
              
              </View> 



              <View style={styles.AgriInsightContentContainer} >

                <View style={styles.fullWidthContainer}>
                  <ArticleCard/>
                </View>



                <View style={styles.gridContainer}>

                  <View style={styles.gridItem}>
                    <ArticleCard />
                  </View>

                  <View style={styles.gridItem}>
                    <ArticleCard />
                  </View>

              </View>





              </View>




            </View>

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
        

    },

    AgriInsightContainer : {
      width:'95%',
      flexShrink:1,
      //borderWidth:1,
      marginTop:10
    },

    AgriInsightHeader : {

      width:'100%',
      paddingTop:10,
      paddingBottom:10,
      //borderWidth:1,
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
    },

    AgriInsightContentContainer : {
      width:'100%',
      //borderWidth:1,
      flexShrink:1,
      marginTop:5,
    },

    fullWidthContainer : {
      width:'100%',
      //borderWidth:1,
      height:200,
      marginBottom:20
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    gridItem: {
      width: (width - 40) / 2, // Fit two in a row
      marginBottom: 10, // Space between rows if more cards are added
      height:120
    },





    //text

    AgriInsightH: {
      color:'#253D2C',
      fontSize:16,
      fontWeight:600,
      marginLeft:5
    },

    AgriInsightSeeMore: {
      color:'#253D2C',
      fontSize:16,
      fontWeight:400,
      marginLeft:'auto',
      textDecorationLine:'underline'
    
    }
      ,


    //icon

    iconstyle : {
      marginLeft:10
    }



})