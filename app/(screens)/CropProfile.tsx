import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import {pestImages,diseaseImages,soilImages} from '../Pestdat'

//firestore imports
import { doc, updateDoc, arrayUnion, DocumentReference } from "firebase/firestore";
import {db} from "../firebaseconfig"


import { Image } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';

import TomatoData from '../CropsData/Crops/Solanaceae/Tomato.json'
import { Button } from 'react-native-paper'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFileArrowDown,faLeaf } from '@fortawesome/free-solid-svg-icons'

interface guideStep{
    header: string;
    content: string;
  }
  
  interface CropData{
    cropId:string,
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
  
  interface CropsData {
    [key: string]: CropData;
  }



const CropProfile = () => {

    const getCurrentDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = date.getFullYear();
      
        return `${day}-${month}-${year}`;
      };

    const AddToCurrent = async(id:string,commonName:string) => {

        try{

            const userRef = doc(db,"CurrentCrops","zFmpiZQL51Q7xqG8KJ2k");

            await updateDoc(userRef,{
                CurrentCrops:arrayUnion({
                    SessionId:Date.now().toString(),
                    PlotAssoc:null,
                    CropName:commonName,
                    CropId:id,
                    Date: getCurrentDate(),
                    DiseaseLogs: [],
                    PestLogs: [],
                    PesticideApplication:[],
                    FertilizerApplication:[]
                })
            })

            console.log("success")
        }catch(err){
            console.error(err)
        }
    }

    const [loading,setLoading] = useState(true)

    const searchParams = useSearchParams();

    const commonName = searchParams.get('commonName'); // should return "bellpepper"
    const scientificName = searchParams.get('scientificName');
    const imgUrl = searchParams.get('imgUrl');


    const [cropData,setCropData] = useState<CropsData>({})
    

    useEffect(()=>{
        setLoading(true)
        switch(commonName){
            case 'Tomato' : 
                setCropData(TomatoData)
                break;
            default:
                 setCropData(TomatoData)
                 break;
        }
        setLoading(false)
        console.log(cropData)

        
    },[commonName])


    const selectedCrop = cropData[commonName as string]
  
  return (
    <SafeAreaView style={styles.mainContainer}>



        {loading ? (<Text>Loading</Text>) :
        
        
        
        <>
        
            <View style={styles.thumbnail}>
            
                <Image source={{ uri: selectedCrop.thumbnail}} style={{width:'100%',height:'100%',objectFit:'contain'}} />
           
            </View>


            <View style={styles.content}> 
                <View style={styles.headerWrapper}>
                    <View style={styles.seasonIndi}></View>

                    <Text style={styles.cropName}>{selectedCrop.commonName}</Text>
                    <Text style={styles.scientificName}>({selectedCrop.scientificName})</Text>
                    <Text style={styles.familyName}>From The Family {selectedCrop.family}</Text>
                    <Text style={styles.bestGrown}>Best Grown From month - to month</Text>
                </View>

                <ScrollView style={styles.bodyWrapper} contentContainerStyle={{alignItems:'center'}}>


                    <View style={subContainer.containerWrappper}>
                        <Text style={styles.subContainerHeader}>Suitable Soil</Text>



                        <View style={subContainer.badgeContainer}>

                            <View style={subContainer.badgeWrapper}>
                                
                                <Image source={soilImages['loamy']} style={{width:65,height:65,marginBottom:5, borderRadius:'50%'}}/>
                                <Text  style={styles.badgesText}>Loamy</Text>

                            </View>

                            <View style={subContainer.badgeWrapper}>
                                <Image source={soilImages['sandy']} style={{width:65,height:65,marginBottom:5, borderRadius:'50%'}}/>
                                <Text style={styles.badgesText}>Sandy</Text>
                            </View>

                            <View style={subContainer.badgeWrapper}>
                                 <Image source={soilImages['clay']} style={{width:65,height:65,marginBottom:5, borderRadius:'50%'}}/>
                                <Text style={styles.badgesText}>Clayey</Text>
                            </View>
                            </View>


                            <View style={subContainer.phIndi}>
                            <Text style={styles.phText}>
                                Optimal Soil PH is {selectedCrop.soilPh}
                            </Text>
                        </View>





                    </View>







                    <View style={subContainer.containerWrappperPest}>
                        <Text style={styles.subContainerHeaderPest}>Common Pests</Text>



                        <View style={subContainer.badgeContainer}>
                                {selectedCrop.commonPests.map((pest,index)=>(
                                    <View style={subContainer.badgeWrapper} key={index}>
            
                                        <Image source={pestImages[pest.toLowerCase() as string]} style={{width:65,height:65,marginBottom:5, borderRadius:'50%'}}/>
                                        <Text  style={styles.badgesText}>{pest}</Text>
            
                                    </View>


                                ))}

                        </View>










                    </View>






                    <View style={subContainer.containerWrappperPest}>
                        <Text style={styles.subContainerHeaderPest}>Common Diseases</Text>



                        <View style={subContainer.badgeContainer}>
                            

                            {selectedCrop.commonDiseases.map((disease,index)=>(
                                <View style={subContainer.badgeWrapper} key={index}>
        
                                    <Image source={diseaseImages[disease.toLowerCase() as string]} style={{width:65,height:65,marginBottom:5, borderRadius:'50%'}}/>
                                    <Text  style={styles.badgesText}>{disease}</Text>
        
                                </View>


                            ))}




                        </View>


                





                    </View>

                    <Button onPressIn={()=>{AddToCurrent(selectedCrop.cropId,selectedCrop.commonName)}} style={{marginTop:20,marginBottom:20,borderRadius:5}} icon={() => <FontAwesomeIcon icon={faLeaf} size={20} color="#FFFFFF" />} mode="contained-tonal" onPress={() => console.log('Pressed')} buttonColor="#2E6F40" textColor="#FFFFFF"
                    >
                        Start Planting
                    </Button>





                </ScrollView>
            </View>
        
        </>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        }


        





    </SafeAreaView>
  )
}

export default CropProfile

const styles = StyleSheet.create({



    //text.

    //pestheadertext
    subContainerHeaderPest:{
        color:'#A94442',
        fontWeight:500,
        fontSize:14,
        marginBottom:20,
        marginLeft:10
        
    },


    phText:{
        color:'#253D2C',
        fontWeight:300,
        fontSize:13,
        fontStyle:'italic',
        marginLeft:10
    },

    subContainerHeader:{
        color:'#253D2C',
        fontWeight:500,
        fontSize:14,
        marginBottom:5,
        marginLeft:10
    },

    badgesText:{
        color:'#253D2C',
        fontWeight:400,
        fontSize:15,
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
        borderRadius:'50%',
        backgroundColor:'#80E900',
        marginLeft:15,
        marginBottom:10
    },

    cropName:{
        marginLeft:15,
        fontWeight:500,
        fontSize:25,
        color:'#253D2C',
        
        
    },
    scientificName:{
        marginLeft:15,
        fontWeight:300,
        fontStyle:'italic',
        fontSize:15,
        marginBottom:10,
        color:'#253D2C',
    },
    familyName:{
        marginLeft:15,
        fontWeight:300,
        fontSize:16,
        fontStyle:'italic',
        color:'#253D2C',
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
        //borderWidth:1,
        position:'relative',
        marginBottom:20,
        backgroundColor:'#FAD4D4',
        borderRadius:5
    },


    //soil
    containerWrappper: {
        width:'95%',
        //borderWidth:1,
        position:'relative',
        marginBottom:20
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
    phIndi:{
        width:'100%',
        paddingTop:5,
        paddingBottom:5,
        borderRadius:5,
        backgroundColor:'#CFFFDC'
    }


})