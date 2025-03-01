import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
const CropManagement = () => {

  const [selectedOption,setSelectedOption] = useState<String>('CareGuide')


  const handleSegmentChange = (value:String) => {
    setSelectedOption(value);
  };



  

  


  return (
    <SafeAreaView style={styles.mainContainer}>

        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={styles.segmentButton}
            onPress={() => handleSegmentChange('CareGuide')}
          >
            <Text
              style={[
                styles.segmentText,
                selectedOption === 'CareGuide' && styles.activeText,
              ]}
            >
              Care Guide
            </Text>
            {selectedOption === 'CareGuide' && (
              <View style={styles.activeLine} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.segmentButton}
            onPress={() => handleSegmentChange('Management')}
          >
            <Text
              style={[
                styles.segmentText,
                selectedOption === 'Management' && styles.activeText,
              ]}
            >
              Management
            </Text>
            {selectedOption === 'Management' && (
              <View style={styles.activeLine} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.segmentButton}
            onPress={() => handleSegmentChange('PestAndDiseases')}
          >
            <Text
              style={[
                styles.segmentText,
                selectedOption === 'PestAndDiseases' && styles.activeText,
              ]}
            >
              Pest And Diseases
            </Text>
            {selectedOption === 'PestAndDiseases' && (
              <View style={styles.activeLine} />
            )}
          </TouchableOpacity>
        </View>



       {selectedOption === 'CareGuide' && 
       
       
        <ScrollView style={styles.contentWrapper}>
          <View  style={styles.Thumbnail}>



          </View>


          <View style={styles.headerWrapper} >

            <View style={styles.nameWrapper}>
              <Text style={styles.cropName}>CropName</Text>
              <Text style={styles.scientificName}>(Scientific Name)</Text>
            </View>

            <View>
              <FontAwesomeIcon icon={faClockRotateLeft} size={20} color='#2E6F40'/>
              <Text></Text>
            </View>


          </View>
        </ScrollView>
       
       
       }






        
    </SafeAreaView>
  )
}

export default CropManagement

const styles = StyleSheet.create({

  //care guide


  //> header wrapper

  headerWrapper:{
    width:'100%',
    borderWidth:1,
    marginTop:10,
    display:'flex',
    flexDirection:'column',

  },
  nameWrapper:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    
  },

  scientificName:{
    color:'#253D2C',
    fontSize:15,
    fontStyle:'italic',
    fontWeight:400
  },


  cropName:{
    color:'#253D2C',
    fontSize:28,
    fontWeight:600,
    marginRight:5
  },

  Thumbnail:{
    width:'100%',
    height:230,
    backgroundColor:'red',
    borderRadius:10
  },


  mainContainer:{
    flex:1,
    flexDirection:'column',
    display:'flex',
    borderWidth:1,
    borderColor:'green',
    alignItems:'center'

  },

  contentWrapper:{
    width:'95%',
    borderWidth:1,
    flex:1,
    flexDirection:'column',
    display:'flex'
  },

  //tab top

  container: {
    flex: 1,
    padding: 16,
    //backgroundColor: '#fff',
  },
  segmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width:'100%'
  },
  segmentButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  segmentText: {
    color: 'black',
    fontSize: 14,
  },
  activeText: {
    fontWeight: 'bold',
    color: '#2E6F40',
  },
  activeLine: {
    marginTop: 4,
    height: 2,
    width: '100%',
    backgroundColor: '#2E6F40',
  }




})