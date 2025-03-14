import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Appbar } from 'react-native-paper';
import { BackHandler } from "react-native";

import AntDesign from '@expo/vector-icons/AntDesign';

import { CropProvider,useCropContext } from '../Context/CropContext';
import { useNavigation } from 'expo-router';

import FamilyData from '../CropsData/Crops/Family/family.json'
import { cropsImages } from '../Pestdat';
import crops from '../(main)/crops';
import { Image } from 'react-native';



interface CropFamilyDataLocal{
  CropName:string,
  CropId:string,
  CropRoot:string,
  
}

interface CropsFamilyDataLocal{
  [key: string]: {
    crops: CropFamilyDataLocal[];
  };
}
const CropsSelection = () => {

  
 

  const {addCrop,selectedCrops} = useCropContext(); 
  const navigation = useNavigation()
  const [cropData, setCropData] = useState<CropsFamilyDataLocal>({});
  const [restrictedFamily, setRestrictedFamily] = useState<string | null>(null);
  const [previousCropRoot,setPrevousCropRoot] = useState<string | null>(null)



  //input data



  const addSelectedCrop = (cropId:string,cropName:string,cropFamily:string,cropRoot:string)=>{
    const selectedCrop = {
      CropId : cropId,
      CropName : cropName,
      CropFamily : cropFamily,
      CropRoot:cropRoot
    }


    try{
      addCrop(selectedCrop)
      navigation.goBack()
    }catch(err){
      console.error(err)
    }
    
  }

  useEffect(() => {
    const backAction = () => {
      // Prevent default back action
      return true;
    };
  
    // Add event listener
    BackHandler.addEventListener("hardwareBackPress", backAction);
  
    return () => {
      // Remove event listener when component unmounts
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, []);
  
  useEffect(()=> {
    console.log(FamilyData)
    setCropData(FamilyData)

    if(selectedCrops.length>0){
      const lastSelectedCrop = selectedCrops[selectedCrops.length - 1];
      setRestrictedFamily(lastSelectedCrop.CropFamily);
      setPrevousCropRoot(lastSelectedCrop.CropRoot)
    }
    
    console.log(selectedCrops[0]?.CropFamily)

  },[selectedCrops])

  

  return (
    <SafeAreaView style={styles.main}>

    <Appbar.Header style={{width:'100%',flex:1}}>
      <Appbar.BackAction  onPress={navigation.goBack}/>
      <Appbar.Content title="Choose a Crop" />
 

    </Appbar.Header>

    {restrictedFamily && (
          <View style={styles.warningWrapper}>
      <Text style={styles.warningText}>
      Since your previous crop is from the family <Text style={{ fontWeight: 'bold', color:'#253D2C' }}>{restrictedFamily}</Text>,
      it is highly encouraged to choose a crop from a different family to avoid pest buildup and nutrient depletion.
      </Text>

    </View>
    )}





    <ScrollView style={styles.contentScrollWrapper}  contentContainerStyle={{alignItems:'center'}}>




        {Object.entries(cropData).map(([family, data]) => (
          <View style={styles.familyContainer} key={family}>
              <View style={styles.familyContainerHeader}> 
                  <Text style={[styles.familyContainerHeaderText, { color: restrictedFamily === family ? '#a71919' : '#253D2C' }]}>
                    {family}
                  </Text>

                  {restrictedFamily === family ? (
                    <AntDesign name="warning" size={20} color="#a71919" />
                  ) : (

                    <AntDesign name="checkcircleo" size={20} color="#253D2C" />
                  )}
                  
                  
    
  
              </View>

            <View style={styles.familyContainerCardWrapper}> 

            {data.crops.map((crop, index) => (
  
              

  
  
              
  
                <View style={styleCard.cropCard}>

                  <TouchableOpacity style = {[styleCard.cropCardThumbnail,restrictedFamily === family ? { opacity: 0.5 } : {}]}

                
                    onPress={() => {
                      if (restrictedFamily !== family) {
                        addSelectedCrop(crop.CropId, crop.CropName, family,crop.CropRoot);
                      }
                    }}
                    disabled={restrictedFamily === family} // Prevents selection
                  >
                    <Image source={cropsImages[crop.CropId]} style={{width:'100%',height:'100%',borderRadius:10}}/>
                  </TouchableOpacity>
  
                  <Text style={styleCard.cropCardName}>
                    {crop.CropName}
                  </Text>

                  <Text style={[styleCard.cropCardName,previousCropRoot === crop.CropRoot && { color: '#a71919' }]}>
                    ({crop.CropRoot})
                  </Text>

            
  
  
                </View>
  
             
  
            
             
            ))} 
            </View>
          </View>
        ))}
  




    </ScrollView>



    </SafeAreaView>
  )
}

export default CropsSelection

const styleCard = StyleSheet.create({
  cropCard:{
    //borderWidth:1,
    display:'flex',
    flexDirection:'column',
    padding:5,
    alignItems:'center'

  },

  cropCardThumbnail:{
    //backgroundColor:'red',
    width:80,
    height:80,
    borderRadius:5
  },
  cropCardName:{
    fontSize:16,
    fontStyle:'italic',
    fontWeight:400,
    marginTop:5,
 
  }
})


const styles = StyleSheet.create({

  warningWrapper:{
    width:'95%',
    //borderWidth:1,
    marginLeft:'auto',
    marginRight:'auto',
    marginTop:20,
    marginBottom:20,
    padding:10,
    borderRadius:5,
    backgroundColor:'#d9d9d9'
  },
  warningText:{
    fontSize:15,
    color:'#545454'
  },
  main:{
    flex:1,
    display:'flex',
    flexDirection:'column',
    //borderWidth:1,
  
  },


  contentScrollWrapper:{
    width:'100%',
    borderColor:'red',
    //borderWidth:1
  },


  familyContainer:{
    width:'95%',
    borderColor:'green',
    //borderWidth:1,
    marginTop:20,
  },
  familyContainerHeader:{
    width:'100%',
    flexDirection:'row',
    //borderWidth:1,
    display:'flex',
    alignItems:'center',
    paddingTop:10,
    paddingBottom:10
  },
  familyContainerHeaderText:{
    fontSize:18,
    fontWeight:500,
    marginRight:10,
    color:'#253D2C' 
  },


  familyContainerCardWrapper:{
    width:'100%',
    borderColor:'blue',
    //borderWidth:1,
    display:'flex',
    flexDirection:'row',
    
    justifyContent:'center',
    flexWrap:'wrap',
    paddingTop:5,
    paddingBottom:5,
    gap:5
  }
})