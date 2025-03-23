import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faNewspaper } from '@fortawesome/free-regular-svg-icons'

import WeatherCard from '@/components/genComponents/WeatherCard'
import TaskCard from '@/components/genComponents/TaskCard'
import ArticleCard from '@/components/genComponents/ArticleCard'



import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import RecordMinCard from '@/components/genComponents/recordMinCard'
import { db } from '../firebaseconfig'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'



const { width } = Dimensions.get('window');





interface cropType{
  CropName:string,
  SessionId:string,
  CropId:string,
  PlotName:string,
  PlotAssoc:string

}


interface CurrentCrop{
  crop:cropType[]
}

const home = () => {


  const [currentCrop, setCurrentCrop] = useState<CurrentCrop>({crop:[]})



  useEffect(()=>{
    const fetchCurrentCrop = async()=>{
      try{
        const userRef = doc(db,"CurrentCrops","zFmpiZQL51Q7xqG8KJ2k");

        const docSnap = await getDoc(userRef);

        if(docSnap.exists()){
          const rawData = docSnap.data().CurrentCrops as any[];
          const filteredCrops: cropType[] = rawData.map(crop => ({
            CropName: crop.CropName,
            CropId: crop.CropId,
            SessionId: crop.SessionId,
            PlotAssoc: crop.PlotAssoc,
            PlotName: crop.PlotName
          }));
          setCurrentCrop({ crop: filteredCrops });
 
          console.log(docSnap.data().CurrentCrops)
        }else{
          console.log("document does not exist")
        }

      }catch(err){
        console.error(err)
      }
    }

    fetchCurrentCrop()
  },[])


  const testDataFetched = () => {
    console.log(currentCrop)
  }


  
  return (

    <>  

      <SafeAreaView style={styles.mainContainer}>


        <ScrollView style={styles.container} contentContainerStyle={{alignItems:'center'}}>

          <WeatherCard/>
          <TaskCard/>





          <View style={styles.currentCropContainer}>

            <View style={styles.currentCropHeader}>
              <FontAwesomeIcon icon={faNewspaper} size={20} color='#2E6F40' style={styles.iconstyle}/>
              <Text style={styles.currentCropHeaderTitle }>Current Crop</Text>
            </View>


            <View style={styles.currentCropContentWrapper}>

              {currentCrop.crop?.map((crop,index)=>(
                <RecordMinCard key={index} 
                cropName={crop.CropName} 
                cropId={crop.CropId} 
                status={crop.SessionId} 
                SessionId={crop.SessionId}
                PlotAssoc={crop.PlotAssoc}
                PlotName={crop.PlotName} 
                datePlanted="01/01/2023"/>
              ))}

            </View>



           
          
          </View>


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





      </SafeAreaView>
     
    
        
    
    
    </>

  )
}

export default home

const styles = StyleSheet.create({

  currentCropHeader:{
    width:'100%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'row',
    marginBottom:10,
    paddingTop:10,
    paddingBottom:10
  },
  currentCropHeaderTitle : {
    color:'#253D2C',
    fontSize:16,
    fontWeight:600,
    marginLeft:5
  },
  currentCropContentWrapper:{
    //borderWidth:1,
    display:'flex',
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'center',
    gap:20
  },
  currentCropContainer : {
    width:'95%',
    marginBottom:25,
    //borderWidth:1,
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