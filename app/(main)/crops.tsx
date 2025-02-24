import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SafeAreaView } from 'react-native-safe-area-context';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { ScrollView } from 'react-native-gesture-handler';






import CropMinCard from '@/components/genComponents/cropMinCard';

const crops = () => {

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


      <ScrollView style={styles.scrollContentWrapper} contentContainerStyle={{alignItems:'center'}}>
          <Text style={styles.huge}>Test</Text>
          <Text style={styles.huge}>Test</Text>
          <Text style={styles.huge}>Test</Text>
          <Text style={styles.huge}>Test</Text>
          <Text style={styles.huge}>Test</Text>
          <Text style={styles.huge}>Test</Text>
          <Text style={styles.huge}>Test</Text>
          <Text style={styles.huge}>Test</Text>
          <Text style={styles.huge}>Test</Text>
          <Text style={styles.huge}>Test</Text>
          <Text style={styles.huge}>Test</Text>
          

          <CropMinCard/>

      </ScrollView>





    </SafeAreaView>

  )
}

export default crops

const styles = StyleSheet.create({


  mainContainer : {
    borderWidth:1,
    flex:1,
    display:'flex',
    flexDirection:'column'
  },

  scrollContentWrapper: {
    borderWidth:1,
    display:'flex',
    flexDirection:'column',
 
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