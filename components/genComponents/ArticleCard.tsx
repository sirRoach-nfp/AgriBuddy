import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ArticleCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}></View>
      <View style={styles.contextContainer}></View>
    </View>
  )
}

export default ArticleCard

const styles = StyleSheet.create({

    container : {
        flex:1,
        //borderWidth:1,
        //height:200,
        display:'flex',
        flexDirection:'column',
    },

    imageContainer : {
        width:'100%',
        flex:2,
        backgroundColor:'black',
        borderTopRightRadius:5,
        borderTopLeftRadius:5

    },

    contextContainer : {
        width:'100%',
        flex:1,
        backgroundColor:'red',
        borderBottomLeftRadius:5,
        borderBottomRightRadius:5
    }

    
})