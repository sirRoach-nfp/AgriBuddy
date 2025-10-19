import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { router, Stack, useFocusEffect } from 'expo-router'

import Entypo from '@expo/vector-icons/Entypo';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faNewspaper } from '@fortawesome/free-regular-svg-icons'

import WeatherCard from '@/components/genComponents/WeatherCard'
import TaskCard from '@/components/genComponents/TaskCard'
import ArticleCard from '@/components/genComponents/ArticleCard'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import RecordMinCard from '@/components/genComponents/recordMinCard'
import { db } from '../firebaseconfig'
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useUserContext } from '../Context/UserContext'
import { Image } from 'react-native';



import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { LinearGradient } from 'expo-linear-gradient'
import {  listenToArticlesHome } from '../controllers/ArticleControllers/fetchArticleController';
import { listenToCurrentCrops } from '../controllers/CurrentCropsController/CurrentCropsController';
import { useLanguage } from '../Context/LanguageContex';


const { width } = Dimensions.get('window');





interface cropType{
  CropName:string,
  SessionId:string,
  CropId:string,
  PlotName:string,
  PlotAssoc:string,
  CropThumbnail:string,

}


interface CurrentCrop{
  crop:cropType[]
}


interface ArticleData {
  cover:string,
  title:string,
  articleId:string
}

const home = () => {
  const {user} = useUserContext();
const {language} = useLanguage()
  const [currentCrop, setCurrentCrop] = useState<CurrentCrop>({crop:[]})


  //carousel 
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [articleData,setArticleData] = useState<ArticleData[]>([])

  const data = [...new Array(6).keys()];
  const width = Dimensions.get("window").width * 0.95;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };


  useFocusEffect(
    useCallback(() => {
      if (!user?.CurrentCropsRefId) {
        console.error("CurrentCropsRefId is undefined");
        return;
      }

      console.log("Subscribing to Firestore data...");

      const unsubscribeCrop = listenToCurrentCrops(
        user.CurrentCropsRefId,
        (filteredCrops) => {
          setCurrentCrop({ crop: filteredCrops });
          console.log("✅ Crops updated (cache/server):", filteredCrops);
        },
        (error) => console.error("Error fetching crops:", error)
      );

  
      const unsubscribeArticles = listenToArticlesHome(
        (rawData) => {
          setArticleData(rawData);
          console.log("✅ Articles updated (cache/server):", rawData);
        },
        (error) => console.error("Error fetching articles:", error)
      );

      // ✅ Cleanup on screen unfocus
      return () => {
        unsubscribeCrop();
        unsubscribeArticles();
        console.log("Unsubscribed from Firestore listeners");
      };
    }, [user])
  );

  
  return (

    <>  

      <SafeAreaView style={styles.mainContainer}>


        <ScrollView style={styles.container} contentContainerStyle={{alignItems:'center'}}>

          <WeatherCard/>
          <View style={styles.AgriInsightContainer}>

            <View style={styles.AgriInsightHeader} >
              <FontAwesomeIcon icon={faNewspaper} size={20} color='#607D8B' style={styles.iconstyle}/>
              <Text style={styles.AgriInsightH}>Agri Insights</Text>
              <TouchableOpacity style={{marginLeft:'auto'}} onPress={()=> router.push(`/(screens)/ArticleHomeScreen`)}>
                 <Text style={styles.AgriInsightSeeMore}>See More</Text>
              </TouchableOpacity>
             
            
            </View> 



            <View style={styles.AgriInsightContentContainer} >

                <View style={stylesCarousel.carouselWrapperMain}>


                <Carousel
                  ref={ref}
                  width={width}
                  height={width * 0.50}
                  data={articleData!}
                  onProgressChange={progress}
                  renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 10,
                      overflow: 'hidden', // Important to clip children like the rounded corners
                    }}
                    onPress={() => {
                      router.push(`/(screens)/ArticleMainScreen?articleId=${encodeURIComponent(item.articleId)}`);
                    }}
                  >
                    <ImageBackground
                      source={{ uri: item.cover }}
                      resizeMode="cover"
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                      }}
                    >
                      {/* Overlay Gradient to improve text readability */}
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={{
                          padding: 10,
                          width: '100%',
                          position: 'absolute',
                          bottom: 0,
                        }}
                      >
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{
                            color: 'white',
                            fontSize: 20,
                            fontWeight: '600',
                          }}
                        >
                          {item.title}
                        </Text>
                      </LinearGradient>
                    </ImageBackground>
                  </TouchableOpacity>
                  )}
                />

                <Pagination.Basic
                progress={progress}
                data={articleData}
                dotStyle={{ backgroundColor: "#4d69ce", borderRadius: 50 }}
                containerStyle={{ gap: 5, marginTop: 10 }}
                onPress={onPressPagination}
                />

                </View>

            </View>




          </View>





          <View style={styles.currentCropContainer}>

            <View style={styles.currentCropHeader}>
              <Entypo name="leaf" size={24} color="#607D8B" />
              <Text style={styles.currentCropHeaderTitle }>
                {language === "en" 
                  ? "Current Crop" 
                  : "Kasalukuyang Tanim"}</Text>
            </View>


            <View style={styles.currentCropContentWrapper}>

             
            {currentCrop && currentCrop.crop?.length > 0 ? (
              currentCrop.crop.map((crop, index) => (
                <RecordMinCard
                  key={index}
                  cropName={crop.CropName}
                  cropId={crop.CropId}
                  status={crop.SessionId}
                  SessionId={crop.SessionId}
                  PlotAssoc={crop.PlotAssoc}
                  PlotName={crop.PlotName}
                  cropCover={crop.CropThumbnail}
                  datePlanted="01/01/2023"
                />
              ))
            ) : (
              <View style={{ gap:10,width:"100%",height:200,borderWidth:1,borderColor:"#e2e8f0",borderRadius:16,display:'flex',flexDirection:"column",alignItems:'center',justifyContent:'center'}}> 
                <FontAwesome6 name="seedling" size={30} color="#607D8B" />
                <Text style={{fontSize:16,color:'#475569'}}>
                  {language === "en" 
                  ? "You're currently not tracking any crop" 
                  : "Wala kang gulay na nakatanim sa ngayon"}
                  
                </Text>

              </View>
            )}
              

            </View>



           
          
          </View>


          





        </ScrollView>





      </SafeAreaView>
     
    
        
    
    
    </>

  )
}

export default home

const stylesCarousel = StyleSheet.create({
  carouselWrapperMain:{
    //borderWidth:1,
    borderColor:'red',

  }
})
const styles = StyleSheet.create({

  currentCropHeader:{
    width:'100%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'row',
    marginBottom:10,
    
  },
  currentCropHeaderTitle : {
    color:'#37474F',
    fontSize:18,
    fontWeight:600,
    letterSpacing:0.5,
  
  },
  currentCropContentWrapper:{
    //borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
    //paddingHorizontal: 10,
    //backgroundColor:'#F2F3F5',
  },
  currentCropContainer : {
    width:'95%',
    marginBottom:25,
    //borderWidth:1,
    paddingVertical:25
  },
    mainContainer: {
      flex:1,
      display:'flex',
      flexDirection:'column'
    },
    container : {
        flex: 1,
        borderColor:'black',
        //borderWidth:1,
        flexDirection:'column',
        

    },

    AgriInsightContainer : {
      width:'95%',
      flexShrink:1,
      //borderWidth:1,
      marginTop:10,
      paddingVertical:25
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
      color:'#37474F',
      fontSize:18,
      fontWeight:600,
      letterSpacing:0.5,
      marginLeft:5
    },

    AgriInsightSeeMore: {
      color:'#37474F',
      fontSize:16,
      fontWeight:600,
      letterSpacing:0.5,
      textDecorationLine:'underline'
    
    }
      ,


    //icon

    iconstyle : {
      //marginLeft:10
    }



})