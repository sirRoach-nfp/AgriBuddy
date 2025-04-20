import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons'
import {pestImages,diseaseImages,soilImages} from '../Pestdat'

//firestore imports
import { doc, updateDoc, arrayUnion, DocumentReference, getDoc } from "firebase/firestore";
import {db} from "../firebaseconfig"


import { Image } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';

import TomatoData from '../CropsData/Crops/Solanaceae/Tomato.json'
import EggplantData from '../CropsData/Crops/Solanaceae/Eggplant.json'
import Squash from '../CropsData/Crops/Cucurbitaceae/Squash.json'
import ChilliPepper from '../CropsData/Crops/Solanaceae/ChilliPepper.json'
import Potato from '../CropsData/Crops/Solanaceae/Potato.json'
import Sitaw from '../CropsData/Crops/Fabaceae/Sitaw.json'
import Bittergourd from "../CropsData/Crops/Cucurbitaceae/Bittergourd.json"
import Bottlegourd from '../CropsData/Crops/Cucurbitaceae/Bottlegourd.json'
import Cucumber from '../CropsData/Crops/Cucurbitaceae/Cucumber.json'
import MungBean from '../CropsData/Crops/Fabaceae/Mungbean.json'
import Peanut from '../CropsData/Crops/Fabaceae/Peanut.json'
import Spongegourd from '../CropsData/Crops/Cucurbitaceae/Spongegourd.json'

import { Button, Dialog, PaperProvider, Portal } from 'react-native-paper'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFileArrowDown,faLeaf } from '@fortawesome/free-solid-svg-icons'
import { useUserContext } from '../Context/UserContext'
import { router } from 'expo-router'

interface guideStep{
    header: string;
    content: string;
  }


interface pestType{
    pestCoverImage:string,
    pestId:string,
    pestName:string

}

interface diseaseType{
    diseaseCoverImage:string,
    diseaseId:string,
    diseaseName:string

}
  
  interface CropData{
    cropId:string,
    thumbnail: string;
    scientificName: string;
    commonName:string,
    family: string;
    growthTime: string;
    bestSeason: string;
    soilType: string[];
    soilPh: string;
    commonPests: pestType[];
    commonDiseases: diseaseType[];
  }
  
  interface CropsData {
    [key: string]: CropData;
  }



const CropProfile = () => {


    const [showConfirmationVisible,setShowConfirmationVisible] = useState(false)



    const renderAddCropConfirmationDialog = (cropId:string,commonName:string) => (
        <Portal>
        <Dialog visible={showConfirmationVisible} onDismiss={()=>{}}>
          <Dialog.Title>Add to your current crops?</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure your want to add this crop to your list?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=>setShowConfirmationVisible(false)}>Cancel</Button>
            <Button onPress={() => AddToCurrent(cropId,commonName)}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      )



    const {user} = useUserContext()

    const getCurrentDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = date.getFullYear();
      
        return `${day}-${month}-${year}`;
      };

    const AddToCurrent = async(id:string,commonName:string) => {

        try{

            const userRef = doc(db,"CurrentCrops",user?.CurrentCropsRefId as string);

            await updateDoc(userRef,{
                CurrentCrops:arrayUnion({
                    SessionId:Date.now().toString(),
                    PlotAssoc:null,
                    CropName:commonName,
                    CropId:id,
                    CropCover:cropData?.thumbnail,
                    Date: getCurrentDate(),

                })
            })

            console.log("success")
            setShowConfirmationVisible(false)
            router.replace('/(main)/home')
        }catch(err){
            console.error(err)
        }
    }

    const [loading,setLoading] = useState(true)

    const searchParams = useSearchParams();
    const cropId = searchParams.get('cropid')
    const commonName = searchParams.get('commonName'); // should return "bellpepper"
    const scientificName = searchParams.get('scientificName');
    const imgUrl = searchParams.get('imgUrl');


    const [cropData,setCropData] = useState<CropData>()
    

    useEffect(()=>{


        const fetchCropDataFromFirebase = async()=>{
            
            try{
                console.log("Passed Document ID : ",cropId)
                const cropDataDocRef = doc(db,'Crops',cropId as string)
                const cropDataDocSnapshot = await getDoc(cropDataDocRef)


                if(cropDataDocSnapshot.exists()){

                    const rawData = {
                        cropId:cropDataDocSnapshot.id as string || "",
                        thumbnail: cropDataDocSnapshot.data().cropCover as string || " ",
                        scientificName: cropDataDocSnapshot.data().scientificName as string || " ",
                        commonName: cropDataDocSnapshot.data().cropName as string || " ",
                        family: cropDataDocSnapshot.data().family as string || " ",
                        growthTime: cropDataDocSnapshot.data().growthTime as string || " ",
                        bestSeason: cropDataDocSnapshot.data().bestSeason as string || " ",
                        soilType: cropDataDocSnapshot.data().soilType as string[] || [],
                        soilPh: cropDataDocSnapshot.data().soilPh as string || "",
                        commonPests: cropDataDocSnapshot.data().pests as pestType[] || [],
                        commonDiseases: cropDataDocSnapshot.data().diseases as diseaseType[] || "",
                    }

                    setCropData(rawData)
                }
            }catch(err){
                console.error(err)
            }

        }
        fetchCropDataFromFirebase()
        setLoading(false)
        console.log(cropData)

        
    },[cropId])



    useEffect(()=>{
       
        console.log("Data Set : ", cropData)
        
    },[cropData])


    //const selectedCrop = cropData[commonName as string]
  
  return (


    <PaperProvider>

        {cropData  && renderAddCropConfirmationDialog(cropData.cropId,cropData.commonName)}



    
        <SafeAreaView style={styles.mainContainer}>



            {loading ? (<Text>Loading</Text>) :
            
            
            
            <>
            
            <View style={styles.thumbnail}>
                    <Image 
                        source={{ uri: cropData?.thumbnail }} 
                        style={{ width: '100%', height: '100%' }} 
                        resizeMode="cover" 
                    />

                    <TouchableOpacity 
                        onPress={() => router.back()}
                        style={{
                        position: 'absolute',
                        top: 10, // adjust for safe area
                        left: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent dark background
                        borderRadius: 20,
                        padding: 8,
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>


                <View style={styles.content}> 
                    <View style={styles.headerWrapper}>
                        <View style={styles.seasonIndi}></View>

                        <Text style={styles.cropName}>{cropData?.commonName}</Text>
                        <Text style={styles.scientificName}>({cropData?.scientificName})</Text>
                        <Text style={styles.familyName}>From The Family {cropData?.family}</Text>
                        
                    </View>

                    <ScrollView style={styles.bodyWrapper} contentContainerStyle={{alignItems:'center'}}>


                        <View style={subContainer.containerWrappper}>
                            <Text style={styles.subContainerHeader}>Suitable Soil</Text>



                            <View style={subContainer.badgeContainer}>

                                    <View style={[subContainer.badgeWrapper,cropData?.soilType.includes("Loamy") && { backgroundColor: '#CFFFDC' }]}>
                                        
                                        <Image source={soilImages['loamy']} style={{width:65,height:65,marginBottom:5, borderRadius:20}}/>
                                        <Text  style={styles.badgesText}>Loamy</Text>

                                    </View>

                                    <View style={subContainer.badgeWrapper}>
                                        <Image source={soilImages['sandy']} style={{width:65,height:65,marginBottom:5, borderRadius:20}}/>
                                        <Text style={styles.badgesText}>Sandy</Text>
                                    </View>

                                    <View style={subContainer.badgeWrapper}>
                                        <Image source={soilImages['clay']} style={{width:65,height:65,marginBottom:5, borderRadius:20}}/>
                                        <Text style={styles.badgesText}>Clayey</Text>
                                    </View>

                                    <View style={subContainer.badgeWrapper}>
                                        
                                        <Image source={soilImages['loamy']} style={{width:65,height:65,marginBottom:5, borderRadius:20}}/>
                                        <Text  style={styles.badgesText}>Silty</Text>

                                    </View>

                                    <View style={subContainer.badgeWrapper}>
                                        <Image source={soilImages['sandy']} style={{width:65,height:65,marginBottom:5, borderRadius:20}}/>
                                        <Text style={styles.badgesText}>Peaty</Text>
                                    </View>

                                    <View style={subContainer.badgeWrapper}>
                                        <Image source={soilImages['clay']} style={{width:65,height:65,marginBottom:5, borderRadius:20}}/>
                                        <Text style={styles.badgesText}>Sandy Loam</Text>
                                    </View>

                                    <View style={subContainer.badgeWrapper}>
                                        
                                        <Image source={soilImages['loamy']} style={{width:65,height:65,marginBottom:5, borderRadius:20}}/>
                                        <Text  style={styles.badgesText}>Clay Loam</Text>

                                    </View>

                                    <View style={subContainer.badgeWrapper}>
                                        <Image source={soilImages['sandy']} style={{width:65,height:65,marginBottom:5, borderRadius:20}}/>
                                        <Text style={styles.badgesText}>Silty Loam</Text>
                                    </View>

                                    <View style={subContainer.badgeWrapper}>
                                        <Image source={soilImages['clay']} style={{width:65,height:65,marginBottom:5, borderRadius:20}}/>
                                        <Text style={styles.badgesText}>Sandy Clay Loam</Text>
                                    </View>



                                </View>


                                <View style={subContainer.phIndi}>
                                    <Text style={styles.phText}>
                                        Optimal Soil PH is {cropData?.soilPh}
                                    </Text>
                                </View>





                        </View>







                        <View style={subContainer.containerWrappperPest}>
                            <Text style={styles.subContainerHeaderPest}>Common Pests</Text>



                            <View style={subContainer.badgeContainer}>
                                    {cropData?.commonPests.map((pest,index)=>(
                                        <View style={subContainer.badgeWrapper} key={index}>
                
                                            <Image source={{ uri: pest.pestCoverImage}} style={{width:65,height:65,marginBottom:5, borderRadius:10}}/>
                                            <Text ellipsizeMode="tail" numberOfLines={1}   style={styles.badgesText}>{pest.pestName}</Text>
                
                                        </View>


                                    ))}

                            </View>










                        </View>






                        <View style={subContainer.containerWrappperPest}>
                            <Text style={styles.subContainerHeaderPest}>Common Diseases</Text>



                            <View style={subContainer.badgeContainer}>
                                

                                {cropData?.commonDiseases.map((disease,index)=>(
                                    <View style={subContainer.badgeWrapper} key={index}>
            
                                        <Image source={{ uri: disease.diseaseCoverImage}} style={{width:65,height:65,marginBottom:5, borderRadius:10}}/>
                                        <Text  style={styles.badgesText} numberOfLines={1} ellipsizeMode="tail">{disease.diseaseName}</Text>
            
                                    </View>


                                ))}




                            </View>


                    





                        </View>

                        <Button onPressIn={()=>{setShowConfirmationVisible(true)}} style={{marginTop:20,marginBottom:20,borderRadius:5}} icon={() => <FontAwesomeIcon icon={faLeaf} size={20} color="#FFFFFF" />} mode="contained-tonal" onPress={() => console.log('Pressed')} buttonColor="#2E6F40" textColor="#FFFFFF"
                        >
                            Start Planting
                        </Button>





                    </ScrollView>
                </View>
            
            </>
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            }


            





        </SafeAreaView>

    </PaperProvider>
  )
}

export default CropProfile

const styles = StyleSheet.create({



    //text.

    //pestheadertext
    subContainerHeaderPest:{
        color:'#A94442',
        fontWeight:500,
        fontSize:18,
        marginBottom:20,
        marginLeft:10
        
    },


    phText:{
        color:'#253D2C',
        fontWeight:300,
        fontSize:16,
        fontStyle:'italic',
        marginLeft:10
    },

    subContainerHeader:{
        color:"#37474F",
        fontWeight:500,
        fontSize:18,
        marginBottom:5,
        marginLeft:10
    },

    badgesText:{
        color:'#253D2C',
        fontWeight:400,
        fontSize:16,
        fontStyle:'italic'
    },
    mainContainer:{
        display:'flex',
        flex:1,
        flexDirection:'column',
        //borderWidth:1
    },
    thumbnail:{
        width:'100%',
        height:200,
        zIndex:0,
        backgroundColor:'red'
    },
    content:{
        flex:1,
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        marginTop:-20
       
    },
    headerWrapper:{
        width:'100%',
        //height:100,
        //borderWidth:1,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        backgroundColor:'#FFFFFF',
        paddingTop:15,
        paddingBottom:15,
        borderBottomColor:'#B9B9B9',
        borderBottomWidth:1,
        marginBottom:20

    },

    seasonIndi:{
        width:13,
        height:13,
        borderRadius:50,
        backgroundColor:'#80E900',
        marginLeft:15,
        marginBottom:10
    },

    cropName:{
        marginLeft:15,
        fontWeight:600,
        fontSize:30,
      
        color:"#37474F"
        
        
    },
    scientificName:{
        marginLeft:15,
        fontWeight:400,
        fontStyle:'italic',
        fontSize:18,
        marginBottom:10,
        color:"#37474F"
    },
    familyName:{
        marginLeft:15,
        fontWeight:300,
        fontSize:18,
        fontStyle:'italic',
        color:'#333333',
    },
    bestGrown:{
        marginLeft:15,
        fontWeight:300,
        fontSize:16,
        fontStyle:'italic',
        color:'#253D2C',
    },
    bodyWrapper:{
        width:'100%',
        flex:1,
        borderColor:'green',
        //borderWidth:1,
        borderStyle:'dotted',
        display:'flex',
        flexDirection:'column',
        paddingTop:10

    },

})


const subContainer = StyleSheet.create({

    //pest

    containerWrappperPest: {
        paddingTop:10,
        width:'95%',
        ///borderWidth:1,
        position:'relative',
        marginBottom:20,
        backgroundColor:'#ffffff',
        borderRadius:5,
        elevation:2
    },


    //soil
    containerWrappper: {
        width:'95%',
        //borderWidth:1,
        position:'relative',
        marginBottom:20,
        paddingVertical:10,
        paddingHorizontal:5,
        backgroundColor:'#ffffff',
        borderRadius:5,
        elevation:2
    },
    badgeContainer:{
        width:'100%',
        //borderWidth:1,
        position:'relative',
        //borderWidth: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical:10,
        justifyContent: 'center',
       // gap: 20,
        paddingHorizontal: 10,
    },
    badgeWrapper:{
        height:100,
        width:150,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
        
    },
    phIndi:{
        width:'100%',
        paddingTop:5,
        paddingBottom:5,
        borderRadius:5,
        backgroundColor:'#CFFFDC'
    }


})