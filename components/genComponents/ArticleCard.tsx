import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'


interface ArticleData {
    cover:string,
    title:string,
    articleId:string
}
const ArticleCard = ({articleId,title,cover}:ArticleData) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>

        <ImageBackground source={{uri:cover}} style={{flex:1}} imageStyle={styles.imageBackgroundStyle}/>
      </View>

      <View style={styles.contextContainer}>
        <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              color: '#37474F',
              fontSize: 20,
              fontWeight: '600',
              marginBottom:7
         
            }}
        >
          {title}
        </Text>

      <TouchableOpacity style={styles.buttonReadMore} 
          onPress={() => {
            router.push(`/(screens)/ArticleMainScreen?articleId=${encodeURIComponent(articleId)}`);
          }}
      >
        <Text style={styles.buttonReadMoreText}>
          Read More
        </Text>
      </TouchableOpacity>
      </View>


    </View>
  )
}

export default ArticleCard

const styles = StyleSheet.create({

    container : {
        flex:1,
        width:'100%',
        borderWidth:1,
        height:300,
        display:'flex',
        flexDirection:'column',
        borderBottomEndRadius:10,
        borderBottomStartRadius:10,
        borderColor:"#E2E8F0",
        marginBottom:10,
    },

    imageContainer : {
        width:'100%',
        flex:3,
        backgroundColor:'black',
        borderTopRightRadius:5,
        borderTopLeftRadius:5

    },

    contextContainer : {
        width:'100%',
        height:'60%',
        flex:2,
        backgroundColor:'white',
        borderBottomLeftRadius:5,
        borderBottomRightRadius:5,
        borderBottomEndRadius:10,
        borderBottomStartRadius:10,
        borderWidth:0,
        
        //alignItems:'center',
        display:'flex',
        flexDirection:'column',
        paddingHorizontal:15,
        justifyContent:'center',
        
    },
    

    buttonReadMore:{
      borderWidth:0,
      alignSelf:'flex-start',
      marginLeft:'auto',
      //marginBottom:20
      paddingVertical:7,
      paddingHorizontal:12,
      borderRadius:5,
      backgroundColor:'#607D8B'
    },
    buttonReadMoreText:{
      fontSize:15,
      fontWeight:600,
      color:'white'

    },
    imageBackgroundStyle: {
      resizeMode: 'cover',
      borderRadius: 10,
    },

    
})