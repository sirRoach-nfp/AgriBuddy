import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { globalStyles } from '@/assets/globalStyle'
import { Button } from 'react-native-paper'
import { useLanguage } from '../../app/Context/LanguageContex';

interface ArticleData {
    cover:string,
    title:string,
    articleId:string
}
const ArticleCard = ({articleId,title,cover}:ArticleData) => {
  const {language} = useLanguage()
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
          <View style={{marginVertical:4,borderTopWidth:1,borderColor:'#e2e8f0'}}>

          </View>
        <Button
          mode="contained"
          onPress={() => {
            router.push(`/(screens)/ArticleMainScreen?articleId=${encodeURIComponent(articleId)}`);
          }}
          style={[globalStyles.buttonPrimary,{marginVertical:4}]}
          labelStyle={globalStyles.buttonLabelPrimary}
        >
          {language === "en" ? "Read More" : "Basahin"}
        </Button>
      </View>


    </View>
  )
}

export default ArticleCard

const styles = StyleSheet.create({

    container : {
      
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