import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'

import Collapsible from 'react-native-collapsible';

import { SelectList } from 'react-native-dropdown-select-list';
import MultiSelect from 'react-native-multiple-select';


//react native paper imports
import { Button } from 'react-native-paper';
import { TextInput } from 'react-native-paper';


const CropManagement = () => {

  const [selectedOption,setSelectedOption] = useState<String>('CareGuide')


  const handleSegmentChange = (value:String) => {
    setSelectedOption(value);
  };


  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCollapsed2, setIsCollapsed2] = useState(true);
  const [isCollapsed3, setIsCollapsed3] = useState(true);
  const [isCollapsed4, setIsCollapsed4] = useState(true);
  const [isCollapsed5, setIsCollapsed5] = useState(true);

  

  

  //records

  //> data 

  const [pesticide,setPesticide] = useState<string> ('')
  const [fertilizer,setFertilizer] = useState<string> ('')
  const [notes,setNotes] = useState<string> ('')

  const [selectedPest, setSelectedPest] = useState<string | null>('');
  const [selectedDisease, setSelectedDisease] = useState<string | null>('');



  const [openDropdown, setOpenDropdown] = useState('');
  //pest data
  const pestData = [
    { id: '1', name: 'fruitworm' },
    { id: '2', name: 'thrips' },
    { id: '3', name: 'whiteflies' },
  
  ];

  const diseaseData = [
    { id: '1', name: 'Nematode' },
    { id: '2', name: 'Bacterial Wilt' },
    { id: '3', name: 'Mosaic Virus' },
    { id: '4', name: 'None' },
  ];

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);


  const multiSelectRef = React.useRef<MultiSelect | null>(null);


  const onSelectedItemsChange = (items:string[]) => {
    setSelectedItems(items);
  };


  const onSelectedDiseaseChange = (items:string[])=>{
    setSelectedDiseases(items);
  }

  const onChangeNotes = (text:string) => {
    setNotes(text);
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

            <View style={styles.counterWrapper}>
              <FontAwesomeIcon icon={faClockRotateLeft} size={18} color='#2E6F40'/>
              <Text style={styles.plantedText}>20 Days Since Started Growing</Text>
            </View>


          </View>




          <View style={stylesCollapsible.collapseWrapper}>

            <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
              <Text style={stylesCollapsible.header}>Soil Preparation</Text>
            </TouchableOpacity>

            <Collapsible collapsed={isCollapsed}>

              <View >
                <Text style={stylesCollapsible.contentText}>If possible, prepare the planting soil early to allow enough time for weeds and residues from the previous crop to decompose. Plow and hallow the soil two to three times alternately, with a one-week interval between each session. Plow the soil to a depth of 15-20 centimeters. Harrow twice to break up clumps and level the soil. Refining the soil to improve air circulation and promotes healthy root growth.</Text>
              </View>

            </Collapsible>

          </View>



          <View style={stylesCollapsible.collapseWrapper}>

            <TouchableOpacity onPress={() => setIsCollapsed2(!isCollapsed2)}>
              <Text style={stylesCollapsible.header}>Seedling Care</Text>
            </TouchableOpacity>

            <Collapsible collapsed={isCollapsed2}>

              <View >
                <Text style={stylesCollapsible.contentText}>If possible, prepare the planting soil early to allow enough time for weeds and residues from the previous crop to decompose. Plow and hallow the soil two to three times alternately, with a one-week interval between each session. Plow the soil to a depth of 15-20 centimeters. Harrow twice to break up clumps and level the soil. Refining the soil to improve air circulation and promotes healthy root growth.</Text>
              </View>

            </Collapsible>

          </View>



          <View style={stylesCollapsible.collapseWrapper}>

            <TouchableOpacity onPress={() => setIsCollapsed3(!isCollapsed3)}>
              <Text style={stylesCollapsible.header}>Preparing The Planting Bed</Text>
            </TouchableOpacity>

            <Collapsible collapsed={isCollapsed3}>

              <View >
                <Text style={stylesCollapsible.contentText}>If possible, prepare the planting soil early to allow enough time for weeds and residues from the previous crop to decompose. Plow and hallow the soil two to three times alternately, with a one-week interval between each session. Plow the soil to a depth of 15-20 centimeters. Harrow twice to break up clumps and level the soil. Refining the soil to improve air circulation and promotes healthy root growth.</Text>
              </View>

            </Collapsible>

          </View>



          <View style={stylesCollapsible.collapseWrapper}>

            <TouchableOpacity onPress={() => setIsCollapsed4(!isCollapsed4)}>
              <Text style={stylesCollapsible.header}>Transplanting</Text>
            </TouchableOpacity>

            <Collapsible collapsed={isCollapsed4}>

              <View >
                <Text style={stylesCollapsible.contentText}>If possible, prepare the planting soil early to allow enough time for weeds and residues from the previous crop to decompose. Plow and hallow the soil two to three times alternately, with a one-week interval between each session. Plow the soil to a depth of 15-20 centimeters. Harrow twice to break up clumps and level the soil. Refining the soil to improve air circulation and promotes healthy root growth.</Text>
              </View>

            </Collapsible>

          </View>

        </ScrollView>
       
       
       }


       {selectedOption === 'Management' && 
      
        <ScrollView style={styles.contentWrapper} contentContainerStyle={{alignItems:'center'}}>


          <View style={stylesRecords.container}>

              <Text style={stylesRecords.header}>Progress Logging</Text>



              <View style={stylesRecords.inputWrapper}>


                <View style={stylesRecords.inputHeader}>
                  <View style={stylesRecords.iconWrapper}></View>
                  <Text style={stylesRecords.inputText}>Spotted Pests</Text>
                </View>

                <View style={{flex:1,borderWidth:0,width:'100%',padding:0}}>

                  <MultiSelect
                   
                    hideTags
                    items={pestData}
                    uniqueKey="id"
                    ref={(component: any) => { multiSelectRef.current = component }}
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={selectedItems}
                    selectText="Select Pest(s)"
                    searchInputPlaceholderText={""}
                    onChangeInput={ (text: any)=> console.log(text)}
                    altFontFamily="ProximaNova-Light"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#CCC"
                    submitButtonText="Confirm"
           
                  />


                 <View style={stylesRecords.selectedItemsWrapper}>
                    {selectedItems.length > 0 ? (
                      selectedItems.map((item) => (

                        <View key={item} style={{ paddingTop:5,paddingBottom:5, paddingLeft:10,paddingRight:10, borderWidth:0,borderRadius:5,alignSelf: 'flex-start',marginRight:10,backgroundColor:'#FAD4D4'}}>
                          
                          <Text style={stylesRecords.selectedItemText} >
                            {pestData.find((p) => p.id === item)?.name}
                          </Text>
                          
                        </View>

                      ))
                    ) : (
                      <Text style={{ color: '#CCC' }}>No Pest Selected</Text>
                    )}
                  </View>


                </View>

              </View>


              <View style={stylesRecords.inputWrapper}>


                <View style={stylesRecords.inputHeader}>
                  <View style={stylesRecords.iconWrapper}></View>
                  <Text style={stylesRecords.inputText}>Spotted Disease</Text>
                </View>

                <View style={{flex:1,borderWidth:0,width:'100%',padding:0}}>

                  <MultiSelect
                   
                    hideTags
                    items={diseaseData}
                    uniqueKey="id"
                    ref={(component: any) => { multiSelectRef.current = component }}
                    onSelectedItemsChange={onSelectedDiseaseChange}
                    selectedItems={selectedDiseases}
                    selectText="Select Disease(s)"
                    searchInputPlaceholderText={""}
                    onChangeInput={ (text: any)=> console.log(text)}
                    altFontFamily="ProximaNova-Light"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#CCC"
                    submitButtonText="Confirm"
           
                  />


                 <View style={stylesRecords.selectedItemsWrapper}>
                    {selectedDiseases.length > 0 ? (
                      selectedDiseases.map((item) => (

                        <View key={item} style={{ paddingTop:5,paddingBottom:5, paddingLeft:10,paddingRight:10, borderWidth:0,borderRadius:5,alignSelf: 'flex-start',marginRight:10,backgroundColor:'#FAD4D4'}}>
                          
                          <Text style={stylesRecords.selectedItemText} >
                            {diseaseData.find((p) => p.id === item)?.name}
                          </Text>
                          
                        </View>

                      ))
                    ) : (
                      <Text style={{ color: '#CCC' }}>No Pest Selected</Text>
                    )}
                  </View>


                </View>



                

              </View>






              <View style={stylesRecords.inputWrapper}>


                <View style={stylesRecords.inputHeaderNormal}>
                  <View style={stylesRecords.iconWrapper}></View>
                  <Text style={stylesRecords.inputText}>Applied Pesticide</Text>
                </View>

                <View style={{flex:1,borderWidth:0,width:'100%',padding:0}}>

                <TextInput
                  label=""
                  value={pesticide}
                  onChangeText={(text: React.SetStateAction<string>) => setPesticide(text)}
                  mode='flat'
                  style={{ backgroundColor: 'transparent' }}
                  theme={{ colors: { primary: '#2E6F40' } }}
                />

                </View>



                

              </View>


              <View style={stylesRecords.inputWrapper}>


                <View style={stylesRecords.inputHeaderNormal}>
                  <View style={stylesRecords.iconWrapper}></View>
                  <Text style={stylesRecords.inputText}>Applied Fertilizer</Text>
                </View>

                <View style={{flex:1,borderWidth:0,width:'100%',padding:0}}>

                <TextInput
                  label=""
                  value={pesticide}
                  onChangeText={(text: React.SetStateAction<string>) => setPesticide(text)}
                  mode='flat'
                  style={{ backgroundColor: 'transparent' }}
                  theme={{ colors: { primary: '#2E6F40' } }}
                />

                </View>



                

              </View>




              <View style={stylesRecords.inputWrapper}>


                <View style={stylesRecords.inputHeaderNormal}>
                  <View style={stylesRecords.iconWrapper}></View>
                  <Text style={stylesRecords.inputText}>Observation Notes</Text>
                </View>


                <TextInput
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={100}
                  onChangeText={(text: string) => onChangeNotes(text)}
                  value={notes}
                  placeholder='Additional Observations....'
                  style={{width:'100%',backgroundColor: '#f0f0f0',borderRadius:5}}
                  theme={{ colors: { primary: '#2E6F40' } }}
                  
                />





              </View>





              

          </View>


          <Button style={{marginTop:20,marginBottom:20}} icon={() => <FontAwesomeIcon icon={faFileArrowDown} size={20} color="#FFFFFF" />} mode="contained-tonal" onPress={() => console.log('Pressed')} buttonColor="#2E6F40" textColor="#FFFFFF"
          >
              Log Crop Data
          </Button>


        </ScrollView>
       
       }



       {selectedOption==='PestAndDiseases' && 
       
       
       
        <View style={stylesAiles.contentWrapper}>

          <View style={stylesAiles.containerWrappperPest}>
              <Text style={stylesAiles.subContainerHeaderPest}>Common Pests</Text>



              <View style={stylesAiles.badgeContainer}>

                  <View style={stylesAiles.badgeWrapper}>
                      
                    
                      <Text  style={stylesAiles.badgesText}>Loamy</Text>

                  </View>

                  <View style={stylesAiles.badgeWrapper}>
                      <Text style={stylesAiles.badgesText}>Sandy</Text>
                  </View>

                  <View style={stylesAiles.badgeWrapper}>
                      <Text style={stylesAiles.badgesText}>Clayey</Text>
                  </View>
                  </View>


        





          </View>




          <View style={stylesAiles.containerWrappperPest}>
              <Text style={stylesAiles.subContainerHeaderPest}>Common Diseases</Text>



              <View style={stylesAiles.badgeContainer}>

                  <TouchableOpacity style={stylesAiles.badgeWrapper}>
                      
                      <Text  style={stylesAiles.badgesText}>Loamy</Text>

                  </TouchableOpacity>

                  <View style={stylesAiles.badgeWrapper}>
                      <Text style={stylesAiles.badgesText}>Sandy</Text>
                  </View>

                  <View style={stylesAiles.badgeWrapper}>
                      <Text style={stylesAiles.badgesText}>Clayey</Text>
                  </View>
              </View>


        





          </View>

        </View>
       
       
       
       
       
       }






        
    </SafeAreaView>
  )
}

export default CropManagement


const stylesCollapsible = StyleSheet.create({
  collapseWrapper:{
    width:'100%',
    //borderWidth:1,
    borderRadius:5,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:10,
    backgroundColor:'#CFFFDC',
    marginBottom:10
  },

  header:{
    color:'#253D2C',
    fontSize:16,
    fontWeight:700
  },
  contentText:{
    marginBottom:20,
    marginTop:30,
    fontWeight:300
  }
})



const stylesAiles = StyleSheet.create({
  contentWrapper:{
    width:'100%',
    borderWidth:1,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    paddingTop:30
  },
  containerWrappperPest: {
    paddingTop:10,
    width:'95%',
    //borderWidth:1,
    position:'relative',
    marginBottom:20,
    backgroundColor:'#FAD4D4',
    borderRadius:5
},
badgeContainer:{
  width:'100%',
  //borderWidth:1,
  position:'relative',
  
  display:'flex',
  flexDirection:'row',
  justifyContent:'space-between',
  marginBottom:10
},
badgeWrapper:{
  height:90,
  width:90,
  //borderWidth:1,
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center'
  
},
subContainerHeaderPest:{
  color:'#A94442',
  fontWeight:500,
  fontSize:14,
  marginBottom:5,
  marginLeft:10
  
},
badgesText:{
  color:'#253D2C',
  fontWeight:300,
  fontSize:13,
  fontStyle:'italic'
},


})
const stylesRecords = StyleSheet.create({


  logData:{
    paddingTop:10,
    paddingBottom:10,
    paddingRight:30,
    paddingLeft:30
  },
  selectedItemsWrapper:{
    flexDirection:'row',
    flexWrap:'wrap',
    width:'100%',
   
  },

  selectedItemText:{
    fontWeight:500,
    color:'#A94442'
  },
  inputHeader:{
    width:'100%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'row',
    marginBottom:10
  },
  inputHeaderNormal:{
    width:'100%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'row',
    marginBottom:0
  },
  container:{
    width:'95%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'column',
    paddingTop:30
    //backgroundColor:'#CFFFDC'
  },

  inputWrapper:{
    width:'100%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    marginBottom:20
  },
  iconWrapper:{
    width:25,
    height:25,
    borderRadius:5,
    backgroundColor:'#253D2C'
  },
  inputText:{
    fontSize:16,
    fontWeight:600,
    color:'#253D2C',
    marginRight:10,
    marginLeft:10
  },
  dropdownOpen: {
    position: 'absolute',
    zIndex: 999,
    width: 200,
    backgroundColor: "#FFFFFF",
  },
  dropdownHidden: {
    display: 'none', // Hide dropdown when it's not active
  },

  header:{
    fontSize:20,
    fontWeight:500,
    color:'#253D2C',
    textAlign:'center',
    marginBottom:35
  }



})

const styles = StyleSheet.create({

  //care guide


  //> header wrapper

  headerWrapper:{
    width:'100%',
    borderWidth:1,
    marginTop:10,
    display:'flex',
    flexDirection:'column',
    marginBottom:20

  },
  nameWrapper:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    elevation:4
    
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

  plantedText:{
    fontWeight:400,
    fontSize:16,
    color:'#253D2C'
  },


  counterWrapper:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    marginTop:10
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
    //borderWidth:1,
    borderColor:'green',
    alignItems:'center'

  },

  contentWrapper:{
    width:'95%',
    //borderWidth:1,
    flex:1,
    flexDirection:'column',
    display:'flex',
   
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