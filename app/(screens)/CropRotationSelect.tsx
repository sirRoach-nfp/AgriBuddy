import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'


import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CropRotationCard from '@/components/genComponents/CropRotationCard';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {Dialog, PaperProvider, Portal } from 'react-native-paper';

import { CropProvider,useCropContext } from '../Context/CropContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLeaf, faPlus } from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';
import { Button } from 'react-native-paper';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
type MenuScreenProps = NativeStackScreenProps<RootStackParamList, "MenuScreen">;
type RootStackParamList = {
    CropRotationSelect: undefined;
    MenuScreen: undefined;
  };

  
  

const CropRotationSelect = () => {


// dialog controller 
const [visible, setVisible] = React.useState(false);

const hideDialog = () => setVisible(false);

const { selectedCrops, addCrop, removeCrop } = useCropContext();
    //data

  const [cycleOne, setCycleOne] = React.useState([]);

  //menu state
  const [showMenu,setShowMenu] = useState(false);
  

  const [planTitle,setPlanTitle] = useState("Crop Rotation Plan")
  const [isEditing, setIsEditing] = useState(false);


  const savePlan = async ()=> {



    //

    const formattedCrops = selectedCrops.map((crop) => ({
      CropName: crop.CropName,
      CropId: crop.CropId,
      CropRoot:crop.CropRoot,
      CropFamily:crop.CropFamily

    }))

    const planData = {
        PlanTitle : planTitle,
        Crops : formattedCrops,
        SessionId:Date.now().toString()
    }



    try{
        const userRef = doc(db,"CropRotationPlan","O3fLUlPUpvqLyugpQUGg");

        await updateDoc(userRef, {
            plans: arrayUnion(planData),
          });

        setVisible(true)
      
          console.log("Plan saved successfully!");

    }catch(err){
        console.error(err)
    }


    console.log(planData)





  }
  return (


    

    <PaperProvider>


    
    <SafeAreaView style={styles.MainContainer}>


        <Portal>
            <Dialog visible={visible} >
                <Dialog.Actions>
                <Button onPress={() => console.log('Cancel')}>Cancel</Button>
                <Button onPress={() => console.log('Ok')}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>

        <View style={styles.HeaderContainer}>

            <View style={styles.PlanTitleWrapper}>

                    {isEditing ? (
                        <TextInput
                            style={styles.PlanTitleInput}
                            value={planTitle}
                            onChangeText={(text) => setPlanTitle(text.slice(0, 30))}
                            autoFocus
                            maxLength={30} 
                            onBlur={() => setIsEditing(false)} // Save on blur
                            selectionColor="transparent"
                        />
                    ) : (
                        <Text style={styles.PlanTitle}>{planTitle}</Text>
                    )}

                    <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                           <FontAwesome5 name="edit" size={30} color="#253D2C" />
                    </TouchableOpacity>
             
            </View>

        </View>


        <ScrollView style={{borderTopLeftRadius:20,borderTopRightRadius:20,display:'flex',flexDirection:'column',
            width:'100%',marginTop:-20,zIndex:1,backgroundColor:'#ffffff',paddingTop:50,elevation:5
        }} contentContainerStyle={{alignItems:'center'}}>


            <View style={styles.CardsContainer}>

        
                



        
                

                {selectedCrops.length === 0 ? (
                <Text></Text>
                ) : (
                selectedCrops.map((crop, index) => <CropRotationCard key={index} CropName={crop.CropName} CropId={crop.CropId}/>)
                )}



                {selectedCrops.length < 4 && (
                    <TouchableOpacity style={styles.addContainer} onPress={()=>{router.push('/(screens)/CropsSelection')}}> 

                        <View style={styles.addIconWrapper}>
                            <FontAwesomeIcon icon={faPlus} size={40} color='#FFFFFF'/>
                        </View>

                        <View style={styles.createPlanTextWrap}>
                            <Text style={styles.createPlanText}>
                            Select A Crop
                            </Text>
                        </View>


                    </TouchableOpacity>
                )}      


                {selectedCrops.length === 4 && (

                    <Button onPress={savePlan} style={{marginTop:20,marginBottom:20,borderRadius:5}} icon={() => <FontAwesomeIcon icon={faLeaf} size={20} color="#FFFFFF" />} mode="contained-tonal" buttonColor="#2E6F40" textColor="#FFFFFF"
                    >
                        Start Planting
                    </Button>
                )}




            </View>




        </ScrollView>

    </SafeAreaView>

    </PaperProvider>

  )
}

export default CropRotationSelect

const styles = StyleSheet.create({

    PlanTitleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#253D2C',
        flex: 1, // Makes it take only necessary space
        minWidth: '50%', // Prevents shrinking too much
        paddingVertical: 5,
        borderBottomWidth: 1,
    },
    addContainer:{
        //borderWidth:1,
        width:'100%',
   
        display:'flex',
        flexDirection:'row',
        
    },
    addIconWrapper:{
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
    borderWidth:2,
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
    CardsContainer:{
        width:'95%',
        //borderWidth:1,
        borderColor:'red',
        display:'flex',
        alignItems:'center'
    },
    MainContainer:{
        flex:1,
        //borderWidth:1,
        
    },


    HeaderContainer:{
        width:'100%',
        height:250,
        //borderWidth:1,
        backgroundColor:'#CFFFDC',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        zIndex:0,
    
    },

    PlanTitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '90%',
        paddingHorizontal: 10,
        borderBottomWidth: 1, 
        borderColor: '#253D2C',
    },
    //text

    PlanTitle:{
        color:'#253D2C',
        fontSize:30,
        fontWeight: 700,
        marginRight:10
    }
})


const CardsStyle = StyleSheet.create({

    CardWrapper:{
        width:'100%',
        display:'flex',
        flexDirection:'row',

    },


    CardThumbnail:{
        width:75,
        height:75,
        marginRight:20,
        borderWidth:1
    },

    CardContentWrapper:{
        flex:1,
        borderWidth:1,
        borderColor:'blue',
        display:'flex',
        flexDirection:'column'
    },

    //text

    CropSelectedText:{
        fontSize:15,
        fontWeight:500,
        color:'#253D2C'
    },

    CropNotSelectedText:{
        fontSize:15,
        fontWeight:500,
        color:'#9B9B9B'
    },

    BadgeSelected:{
        width:100,
        height:40,
        backgroundColor:'#CFFFDC',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20
    },


})