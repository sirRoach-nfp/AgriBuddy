import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SafeAreaView } from 'react-native-safe-area-context';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { ScrollView } from 'react-native-gesture-handler';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { cropDataDummy } from '../Datas/crops';

import cropsData from '../CropsData/Crops/Crops.json'

import CropMinCard from '@/components/genComponents/cropMinCard';
import PlanMinCard from '@/components/genComponents/PlanMinCard';
import { router, useFocusEffect } from 'expo-router';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useUserContext } from '../Context/UserContext';



type Crop = {
  commonname: string;
  scientificname: string;
  imgurl: string;
};

interface guideStep{
  header: string;
  content: string;
}

interface CropData{
  thumbnail: string;
  scientificName: string;
  commonName:string,
  family: string;
  growthTime: string;
  bestSeason: string;
  soilType: string;
  soilPh: string;
  commonPests: string[];
  commonDiseases: string[];
  guide: Record<string, guideStep>;
}


interface PlanData{
  CropName: string,
  CropId:string,
  CropFamily:string,
  CropRoot:string
}


interface RotationPlan{
  PlanTitle:string,
  Crops:PlanData[],
  SessionId?:string
}

interface CropsData {
  [key: string]: CropData;
}

interface optimalSeasonType{
    end:number,
    start:number
}
interface CropsDataFire {

  cropId:string,
  cropName:string,
  cropCover:string,
  cropScientificName:string,
  optimalSeason:optimalSeasonType
}

const crops = () => {

  const {user,logout} = useUserContext();
  //const [cropDataMain,SetCropDataMain] = useState({})
  const [cropData,SetCropData] = useState<CropsDataFire[]>([])
  const [rotationPlan,SetRotationPlan] = useState<RotationPlan[]>([])


  /* Legacy fetch

  useEffect(()=> {

    const fetchCropsFromFirebase = async()=>{

      try{
        console.log("Fetching Crops......")
        const cropDocRef = collection(db,'Crops')
        const cropSnapshot = await getDocs(cropDocRef)


        if(cropSnapshot){
          console.log("Displaying Crops......")
          const rawData = cropSnapshot.docs.map((doc)=>{
            return {
              cropId:doc.id,
              cropName:doc.data().cropName,
              cropScientificName: doc.data().scientificName,
              cropCover:doc.data().cropCover,
              optimalSeason:doc.data().optimalSeason

            }


          }) 
          SetCropData(rawData)
        }
      }catch(err){
        console.error(err)
      }
    }


    fetchCropsFromFirebase()


  },[])*/

 const fetchCropsFromFirebase = useCallback(() => {
    console.log("Listening to Crops collection...");

    const cropDocRef = collection(db, "Crops");

    // onSnapshot automatically detects changes (add, update, delete)
    const unsubscribe = onSnapshot(cropDocRef, (snapshot) => {
      console.log("Displaying Crops...");
      const rawData = snapshot.docs.map((doc) => ({
        cropId: doc.id,
        cropName: doc.data().cropName,
        cropScientificName: doc.data().scientificName,
        cropCover: doc.data().cropCover,
        optimalSeason: doc.data().optimalSeason,
      }));
      SetCropData(rawData);
    });

    // Return unsubscribe to clean up listener when screen is unfocused
    return unsubscribe;
  }, []);

  // 👇 Runs when the screen is focused, and cleans up on blur
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = fetchCropsFromFirebase();
      return () => unsubscribe && unsubscribe();
    }, [fetchCropsFromFirebase])
  );
  
  const [selectedOption, setSelectedOption] = useState<String>('crops');

  const handleSegmentChange = (value:String) => {
    setSelectedOption(value);
  };


  const navigateToCreatePlan = () => {
    router.push('/(screens)/CropRotationSelect')
  }


  useEffect(()=> {


    const fetchPlots = async()=>{

      try{


        const docRef = doc(db,'CropRotationPlan',user?.CropRotationPlanRefId as string);


        const docSnap = await getDoc(docRef)


        if(docSnap.exists()){
          console.log(docSnap.data().plans)
          SetRotationPlan(docSnap.data().plans)
        }else {
          console.log("Doc doesn't exist")
        }
      }catch(err){
        console.error(err)
      }
    }


  fetchPlots()
  },[])


  const testPlanData = () => {
    console.log(rotationPlan[0].Crops)
  }

  
  return (
    <SafeAreaView style={styles.mainContainer}>

      



      
      <FlatList
        style={styles.scrollContentWrapper}
        contentContainerStyle={{ 
          alignItems: 'center',
          paddingBottom: 20, // move padding here!
          paddingTop: 20
        }}
        data={cropData}
        keyExtractor={(item, index) => item.cropId?.toString() || index.toString()}
        renderItem={({ item }) => (
          <CropMinCard
            cropId={item.cropId}
            commonName={item.cropName}
            scientificName={item.cropScientificName}
            imgUrl={item.cropCover}
            optimalSeason={item.optimalSeason}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
          








    </SafeAreaView>

  )
}

export default crops

const styles = StyleSheet.create({


  //Add new Plan

  CreatePlan:{
    width:'95%',
    display:'flex',
    flexDirection:'row',
    //borderWidth:1
  },

  createPlanThumb:{
    width:65,
    height:65,
    //borderWidth:1,
    borderTopLeftRadius:5,
    borderBottomLeftRadius:5,
    backgroundColor:'#D2D2D2',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
  },

  createPlanTextWrap:{
    marginLeft: 10,
    borderWidth:1,
    flex:1,
    borderTopRightRadius:5,
    borderBottomRightRadius:5,
    borderStyle:'dotted',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    borderColor:'#9B9B9B'
    
  },

  createPlanText:{
    fontSize:15,
    fontWeight:600,
    color:'#9B9B9B'
  },
  

  mainContainer : {
    borderWidth:0,
    flex:1,
    display:'flex',
    flexDirection:'column'
  },

  scrollContentWrapper: {
    borderWidth:0,
    display:'flex',
    flexDirection:'column',
    paddingTop:20,
    paddingBottom:550,
 
  },

  huge: {
    fontSize:70
  },


  container: {
    flex: 1,
    padding: 16,
    //backgroundColor: '#fff',
  },
  segmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    //borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  segmentButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  segmentText: {
    color: 'black',
    fontSize: 16,
    fontWeight:500
  },
  activeText: {
    fontWeight: 'bold',
    color: '#37474F',
  },
  activeLine: {
    marginTop: 4,
    height: 2,
    width: '100%',
    backgroundColor: '#37474F',
  },
  content: {
    paddingTop: 20,
    alignItems: 'center',
  },
  
})