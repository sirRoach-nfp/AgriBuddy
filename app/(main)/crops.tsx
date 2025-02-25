import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SafeAreaView } from 'react-native-safe-area-context';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { ScrollView } from 'react-native-gesture-handler';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { cropDataDummy } from '../Datas/crops';


import CropMinCard from '@/components/genComponents/cropMinCard';
import PlanMinCard from '@/components/genComponents/PlanMinCard';

type Crop = {
  commonname: string;
  scientificname: string;
  imgurl: string;
};

type CropData = {
  [key: string]: Crop;
};



const crops = () => {



  const [cropData,SetCropData] = useState<CropData>({})




  useEffect(()=> {

    SetCropData(cropDataDummy)


  },[])

  const [selectedOption, setSelectedOption] = useState<String>('crops');

  const handleSegmentChange = (value:String) => {
    setSelectedOption(value);
  };

  
  return (
    <SafeAreaView style={styles.mainContainer}>

      

      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={styles.segmentButton}
          onPress={() => handleSegmentChange('crops')}
        >
          <Text
            style={[
              styles.segmentText,
              selectedOption === 'crops' && styles.activeText,
            ]}
          >
            Crops
          </Text>
          {selectedOption === 'crops' && (
            <View style={styles.activeLine} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.segmentButton}
          onPress={() => handleSegmentChange('plans')}
        >
          <Text
            style={[
              styles.segmentText,
              selectedOption === 'plans' && styles.activeText,
            ]}
          >
            Plans
          </Text>
          {selectedOption === 'plans' && (
            <View style={styles.activeLine} />
          )}
        </TouchableOpacity>
      </View>

      



      {selectedOption === 'crops' && 
      
      <ScrollView style={styles.scrollContentWrapper} contentContainerStyle={{alignItems:'center'}}>
        {Object.keys(cropData).map((key)=>(
          <CropMinCard  key={key} commonName={cropData[key].commonname} scientificName={cropData[key].scientificname} imgUrl={cropData[key].imgurl}/>
        ))}
      </ScrollView> 

      }


      {selectedOption === 'plans' && 
      
      <ScrollView style={styles.scrollContentWrapper} contentContainerStyle={{alignItems:'center'}}>
        <PlanMinCard/>
        <PlanMinCard/>
        <PlanMinCard/>
        <PlanMinCard/>



        <View style={styles.CreatePlan}> 

          <View style={styles.createPlanThumb}>
            <FontAwesomeIcon icon={faPlus} size={40} color='#FFFFFF'/>
          </View>

          <View style={styles.createPlanTextWrap}>
            <Text style={styles.createPlanText}>
              Create A New Plan
            </Text>
          </View>


        </View>
      </ScrollView> 

      }






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
    //borderWidth:1,
    flex:1,
    display:'flex',
    flexDirection:'column'
  },

  scrollContentWrapper: {
    //borderWidth:1,
    display:'flex',
    flexDirection:'column',
    paddingTop:10
 
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
  },
  activeText: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  activeLine: {
    marginTop: 4,
    height: 2,
    width: '100%',
    backgroundColor: '#6200ee',
  },
  content: {
    paddingTop: 20,
    alignItems: 'center',
  },
  
})