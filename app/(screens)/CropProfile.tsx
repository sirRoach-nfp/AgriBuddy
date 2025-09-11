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


//icons

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
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


interface seasonData{
    startMonth:number,
    endMonth:number,
}


const CropProfile = () => {


    const [showConfirmationVisible,setShowConfirmationVisible] = useState(false)

    const [cropBestSeason,setCropBestSeason] = useState<seasonData>({
        startMonth:1,
        endMonth:4,
    })

    const currentMonth = new Date().getMonth()+1
    

    //helper
    const isCropSuitable = (season:seasonData, currentMonth:number): boolean => {
        const {startMonth,endMonth} = season;

        if(startMonth <= endMonth){
            return currentMonth >= startMonth && currentMonth <= endMonth;
        }
        else{
            return currentMonth >= startMonth || currentMonth <= endMonth;
        }
    }

    const getSeasonMonthRange = (startMonth: number, endMonth: number): string => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const startName = monthNames[startMonth - 1]; // -1 since array is 0-based
        const endName = monthNames[endMonth - 1];

        return `${startName} – ${endName}`;
    };




    const isSuitable = isCropSuitable(cropBestSeason,currentMonth)


    const renderAddCropConfirmationDialog = (cropId:string,commonName:string) => (
        <Portal>
        <Dialog visible={showConfirmationVisible} onDismiss={()=>{}}>
          
            <Dialog.Icon
                icon={isSuitable ? "check-circle-outline" : "alert-circle-outline"}
                size={40}
                color={isSuitable ? "#17A34A" : "#FFA000"}
            />

            <Dialog.Title style={{color:'#475569'}}>Crop Suitability</Dialog.Title>
          
          
          <Dialog.Content>
            {isSuitable ?(

                <>
                <Text style={{fontSize:15,fontWeight:600,color:'#17A34A'}}>
                    Great choice! This crop is suitable for the current season.
                </Text>
                <Text style={{marginTop:10,marginBottom:10,color:"#767273"}}>
                    {"\u2022"} Recommended planting season matches the current season{"\n"}
                    {"\u2022"} For best results, use the specified compatible soil types
                </Text>
                </>
            ):(
                <>

                    <Text style={{fontSize:15,fontWeight:600,color:'#FFA000'}}>
                        The selected crop is NOT suitable for the current season.
                    </Text>

                    <Text style={{marginTop:10,marginBottom:10,color:"#767273"}}>
                        {"\u2022"} Recommended planting season: {getSeasonMonthRange(cropBestSeason.startMonth,cropBestSeason.endMonth)}{"\n"}
                        {"\u2022"} Soil caution: Using soil types other than the specified may lead to poor yield or crop failure.
                    </Text>
                
                </>
            )}



            {isSuitable ? (
                <Text style={{color:'#475569',fontSize:15,fontWeight:600}}>Would you like to proceed with planting?</Text>
            ) :(
                <Text style={{color:'#475569',fontSize:15,fontWeight:600}}>Do you still want to proceed?</Text>
            )}

            
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=>setShowConfirmationVisible(false)} style={{borderWidth:1,borderColor:'#7b7b7b',width:'49%',borderRadius:5}}>Cancel</Button>
            <Button onPress={() => AddToCurrent(cropId,commonName)} style={[{borderWidth:1,width:'49%',borderRadius:5},
                isSuitable ?{backgroundColor:'#17A34A',borderColor:'#17A34A'} :{backgroundColor:'#FFA000',borderColor:'#FFA000'}]}>Proceed</Button>
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


            <ScrollView style={styles.bodyWrapper} contentContainerStyle={{alignItems:'center'}}>
            
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
                 
                            <Text style={styles.cropName}>{cropData?.commonName}</Text>
                            <Text style={styles.scientificName}>({cropData?.scientificName})</Text>
                            <Text style={styles.familyName}>From The Family {cropData?.family}</Text>
                            
                        </View>

                            <View style={subContainer.containerWrappperPest}>
                               
                                <View style={subContainer.containerWrapperHeader}>
                                    <MaterialIcons name="pest-control" size={24} color="#842C2B" />
                                    <Text style={styles.subContainerHeaderPest}>Common Diseases</Text>
                                </View>


                                <View style={subContainer.badgeContainer}>
                                    

                                    {cropData?.commonDiseases.map((disease,index)=>(
                                        <View style={subContainer.badgeWrapper} key={index}>

                                            <View style={subContainer.badgeWrapper__imageWrapper}>
                                                <Image source={{ uri: disease.diseaseCoverImage}} style={{width:'100%',height:'100%', borderTopLeftRadius:3,borderTopRightRadius:3}}/>
                                            </View>
                                            <View style={subContainer.badgeWrapper__infoWrapper}>
                                                  <Text  style={styles.badgesText} numberOfLines={1} ellipsizeMode="tail">{disease.diseaseName}</Text>
                                            </View>
                                            
                                           
                
                                        </View>


                                    ))}




                                </View>


                            </View>

                            <View style={subContainer.containerWrappper}>

                                <View style={subContainer.containerWrapperHeader}>
                                    <FontAwesome6 name="mound" size={24} color="#37474F" />
                                    <Text style={styles.subContainerHeader}>Suitable Soil</Text>
                                </View>
                                



                                <View style={subContainer.badgeContainer}>

                                        <View style={[subContainer.badgeWrapper,cropData?.soilType.includes("Loamy") && { borderColor: '#17A34A',borderWidth:2 }]}>
                                            
                                            
                                            <View style={subContainer.badgeWrapper__imageWrapper}>
                                                <Image source={soilImages['loamy']} style={{width:'100%',height:'100%', borderTopLeftRadius:3,borderTopRightRadius:3}}/>
                                            </View>
                                            <View style={[subContainer.badgeWrapper__infoWrapper,cropData?.soilType.includes("Loamy") && {backgroundColor:'#F0FDF4'}]}>
                                                <Text  style={styles.badgesText}>Loamy</Text>
                                            </View>
                                            

                                        </View>

                                        <View style={[subContainer.badgeWrapper,cropData?.soilType.includes("Sandy") && { borderColor: '#17A34A',borderWidth:2 }]}>
                                            

                                            <View style={subContainer.badgeWrapper__imageWrapper}>
                                                <Image source={soilImages['sandy']} style={{width:'100%',height:'100%', borderTopLeftRadius:3,borderTopRightRadius:3}}/>
                                            </View>
                                            <View style={[subContainer.badgeWrapper__infoWrapper,cropData?.soilType.includes("Sandy") && {backgroundColor:'#F0FDF4'}]}>
                                                <Text style={styles.badgesText}>Sandy</Text>
                                            </View>

                                            
                                        </View>


                                        <View style={[subContainer.badgeWrapper,cropData?.soilType.includes("Clayey") && { borderColor: '#17A34A',borderWidth:2 }]}>

                                            <View style={subContainer.badgeWrapper__imageWrapper}>
                                                <Image source={soilImages['clay']} style={{width:'100%',height:'100%', borderTopLeftRadius:3,borderTopRightRadius:3}}/>
                                            </View>
                                            
                                            <View style={[subContainer.badgeWrapper__infoWrapper,cropData?.soilType.includes("Clayey") && {backgroundColor:'#F0FDF4'}]}>
                                                <Text style={styles.badgesText}>Clayey</Text>
                                            </View>
                                            
                                        </View>


                                        <View style={[subContainer.badgeWrapper,cropData?.soilType.includes("Silty") && { borderColor: '#17A34A',borderWidth:2 }]}>
                                            

                                            <View style={subContainer.badgeWrapper__imageWrapper}>
                                                <Image source={soilImages['loamy']} style={{width:'100%',height:'100%', borderTopLeftRadius:3,borderTopRightRadius:3}}/>
                                            </View>
                                            
                                            <View style={[subContainer.badgeWrapper__infoWrapper,cropData?.soilType.includes("Silty") && {backgroundColor:'#F0FDF4'}]}>
                                                <Text  style={styles.badgesText}>Silty</Text>
                                            </View>
                                            

                                        </View>

                                        <View style={[subContainer.badgeWrapper,cropData?.soilType.includes("Peaty") && { borderColor: '#17A34A',borderWidth:2 }]}>
                                            
                                            <View style={subContainer.badgeWrapper__imageWrapper}>
                                                <Image source={soilImages['sandy']} style={{width:'100%',height:'100%', borderTopLeftRadius:3,borderTopRightRadius:3}}/>
                                            </View>

                                            <View style={[subContainer.badgeWrapper__infoWrapper,cropData?.soilType.includes("Peaty") && {backgroundColor:'#F0FDF4'}]}>
                                                <Text style={styles.badgesText}>Peaty</Text>
                                            </View>

                                        </View>

                                        <View style={[subContainer.badgeWrapper,cropData?.soilType.includes("Sandy loam") && { borderColor: '#17A34A',borderWidth:2 }]}>

                                            <View style={subContainer.badgeWrapper__imageWrapper}>
                                                <Image source={soilImages['clay']} style={{width:'100%',height:'100%', borderTopLeftRadius:3,borderTopRightRadius:3}}/>
                                            </View>

                                            <View style={[subContainer.badgeWrapper__infoWrapper,cropData?.soilType.includes("Sandy loam") && {backgroundColor:'#F0FDF4'}]}>
                                                <Text style={styles.badgesText}>Sandy Loam</Text>
                                            </View>
                                            
                                            
                                        </View>


                                        <View style={[
                                        subContainer.badgeWrapper,
                                        cropData?.soilType.includes("Clay Loam") && { borderColor: '#17A34A', borderWidth: 2 }
                                        ]}>
                                            <View style={subContainer.badgeWrapper__imageWrapper}>
                                                <Image 
                                                source={soilImages['loamy']} 
                                                style={{ width: '100%', height: '100%', borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
                                                />
                                            </View>
                                            <View style={[
                                                subContainer.badgeWrapper__infoWrapper, 
                                                cropData?.soilType.includes("Clay Loam") && { backgroundColor: '#F0FDF4' }
                                            ]}>
                                                <Text style={styles.badgesText}>Clay Loam</Text>
                                            </View>
                                        </View>


                                        <View style={[
                                        subContainer.badgeWrapper,
                                        cropData?.soilType.includes("Silty Loam") && { borderColor: '#17A34A', borderWidth: 2 }
                                        ]}>
                                            <View style={subContainer.badgeWrapper__imageWrapper}>
                                                <Image 
                                                source={soilImages['sandy']} 
                                                style={{ width: '100%', height: '100%', borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
                                                />
                                            </View>
                                            <View style={[
                                                subContainer.badgeWrapper__infoWrapper, 
                                                cropData?.soilType.includes("Silty Loam") && { backgroundColor: '#F0FDF4' }
                                            ]}>
                                                <Text style={styles.badgesText}>Silty Loam</Text>
                                            </View>
                                        </View>


                                        <View style={[
                                        subContainer.badgeWrapper,
                                        cropData?.soilType.includes("Sandy Clay Loam") && { borderColor: '#17A34A', borderWidth: 2 }
                                        ]}>
                                            <View style={subContainer.badgeWrapper__imageWrapper}>
                                                <Image 
                                                source={soilImages['clay']} 
                                                style={{ width: '100%', height: '100%', borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
                                                />
                                            </View>
                                            <View style={[
                                                subContainer.badgeWrapper__infoWrapper, 
                                                cropData?.soilType.includes("Sandy Clay Loam") && { backgroundColor: '#F0FDF4' }
                                            ]}>
                                                <Text style={styles.badgesText}>Sandy Clay Loam</Text>
                                            </View>
                                        </View>



                                    </View>


                                    <View style={subContainer.phIndi}>
                                        <Text style={styles.phText}>
                                            Optimal Soil PH is {cropData?.soilPh}
                                        </Text>
                                    </View>





                            </View>







                            <View style={subContainer.containerWrappperPest}>


                                <View style={subContainer.containerWrapperHeader}>
                                    <MaterialIcons name="pest-control" size={24} color="#842C2B" />
                                    <Text style={styles.subContainerHeaderPest}>Common Pests</Text>
                                </View>
                                



                                <View style={subContainer.badgeContainer}>
                                        {cropData?.commonPests.map((pest,index)=>(
                                            <View style={subContainer.badgeWrapper} key={index}>
                                                
                                                <View style={subContainer.badgeWrapper__imageWrapper}>
                                                    <Image source={{ uri: pest.pestCoverImage}} style={{width:'100%',height:'100%', borderTopLeftRadius:3,borderTopRightRadius:3}}/>
                                                </View>
                                                <View style={subContainer.badgeWrapper__infoWrapper}>
                                                    <Text ellipsizeMode="tail" numberOfLines={1}   style={styles.badgesText}>{pest.pestName}</Text>
                                                </View>

                                                
                                                
                    
                                            </View>


                                        ))}

                                </View>









                            </View>








                            <Button onPressIn={()=>{setShowConfirmationVisible(true)}} style={{marginTop:20,marginBottom:20,borderRadius:5}} icon={() => <FontAwesomeIcon icon={faLeaf} size={20} color="#FFFFFF" />} mode="contained-tonal" onPress={() => console.log('Pressed')} buttonColor="#2E6F40" textColor="#FFFFFF"
                            >
                                Start Planting
                            </Button>





                        
                    </View>

            </ScrollView>
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
        color:'#842C2B',
        fontWeight:700,
        fontSize:18,
     
    
        
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
        fontWeight:700,
        fontSize:19,
        
        
        //marginLeft:10
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
        backgroundColor:'#F9FAFC'
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
        borderTopLeftRadius:0,
        borderTopRightRadius:0,
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
        fontSize:35,
      
        color:"#37474F"
        
        
    },
    scientificName:{
        marginLeft:15,
        fontWeight:400,
        fontStyle:'italic',
        fontSize:17,
        marginBottom:0,
        color:"#37474F"
    },
    familyName:{
        marginLeft:15,
        fontWeight:300,
        fontSize:17,
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
        borderWidth:1,
        borderStyle:'dotted',
        display:'flex',
        flexDirection:'column',
        paddingTop:10

    },

})


const subContainer = StyleSheet.create({

    containerWrapperHeader:{
        width:'100%',
        //borderWidth:1,
        paddingVertical:5,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:5,
    },


    //pest

    containerWrappperPest: {
        paddingTop:10,
        width:'100%',
        //borderWidth:1,
        position:'relative',
        marginBottom:20,
        paddingHorizontal:5,
        borderRadius:5,
       
    },


    //soil
    containerWrappper: {
        width:'100%',
        //borderWidth:1,
        position:'relative',
        marginBottom:20,
        paddingVertical:10,
        paddingHorizontal:5,
       
        borderRadius:5,
    
    },
    badgeContainer:{
        width:'100%',
        //borderWidth:1,
        position:'relative',
        //borderWidth: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical:10,
        gap: 5,
        paddingHorizontal: 0,
    },
    badgeWrapper:{
        height:130,
        width:'48%',
        borderWidth:1,
        borderColor:'#E2E8F0',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
        
    },
    phIndi:{
        width:'100%',
        paddingTop:5,
        paddingBottom:5,
        borderRadius:5,
        backgroundColor:'#CFFFDC'
    },

    badgeWrapper__infoWrapper:{
        width:'100%',
        borderWidth:0,
        height:'30%',
        marginTop:'auto',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
        borderBottomEndRadius:5,
        borderBottomLeftRadius:5,

    },

    badgeWrapper__imageWrapper:{
        flex:1,
        width:'100%',
        borderWidth:0,
        borderTopEndRadius:5,
        borderTopStartRadius:5,
    }


})