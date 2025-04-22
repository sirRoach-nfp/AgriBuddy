import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { router } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons'



interface Symptoms{
    Symptoms:string,
    SymptomsSnapshot:string[]
}
interface DiseaseData{
    CommonName:string,
    MethodsOfDispersal:string,
    DamageSymptoms : Symptoms,
    DiseaseSnapshot:string,
    DiseaseDevelopment:string,
    ControlMeasures:string,
}


const DiseaseScreen = () => {






    const searchParams = useSearchParams();
    const diseaseId = searchParams.get('diseaseId')


    const [diseaseData,setDiseaseData] = useState<DiseaseData>()

    const [selectedOption,setSelectedOption] = useState<String>('Characteristics');
    const handleSegmentChange = (value:String) => {
    setSelectedOption(value);
    };




    useEffect(()=>{



        const fetchDiseaseData = async()=>{


            try{
                console.log("Passed Disease Id : ",diseaseId)

                const docRef = doc(db,'Disease', diseaseId as string)

                const docSnap = await getDoc(docRef)
                
                if(docSnap.exists()){
                    console.log(docSnap.data())
                    setDiseaseData(docSnap.data() as DiseaseData)
                }

            }catch(err){console.error(err)}



        }

        fetchDiseaseData()
    },[diseaseId])



  return (
    <SafeAreaView style={styles.mainContainer}>


        <View style={styles.headerContainer}>
            <Image source={{ uri: diseaseData?.DiseaseSnapshot }}
                style={{width:'100%',height:'100%',objectFit:'contain',        borderBottomLeftRadius:20,
                    borderBottomRightRadius:20,}}
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

        <View style={styles.infoHeaderContainer}>
            <Text style={styles.cropName}>
                {diseaseData?.CommonName} 
            </Text>

            <Text style={styles.scientificName}>
                ("NONE")
            </Text>


            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

                        <View style={styles.segmentContainer}>
                        <TouchableOpacity
                            style={styles.segmentButton}
                            onPress={() => handleSegmentChange('Symptoms')}
                        >
                            <Text
                            style={[
                                styles.segmentText,
                                selectedOption === 'Symptoms' && styles.activeText,
                            ]}
                            >
                            Symptoms
                            </Text>
                            {selectedOption === 'Symptoms' && (
                            <View style={styles.activeLine} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.segmentButton}
                            onPress={() => handleSegmentChange('DiseaseDevelopment')}
                        >
                            <Text
                            style={[
                                styles.segmentText,
                                selectedOption === 'DiseaseDevelopment' && styles.activeText,
                            ]}
                            >
                                Disease Development
                            </Text>
                            {selectedOption === 'DiseaseDevelopment' && (
                            <View style={styles.activeLine} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.segmentButton}
                            onPress={() => handleSegmentChange('MethodsOfDispersal')}
                        >
                            <Text
                            style={[
                                styles.segmentText,
                                selectedOption === 'MethodsOfDispersal' && styles.activeText,
                            ]}
                            >
                            Methods Of Dispersal
                            </Text>
                            {selectedOption === 'MethodsOfDispersal' && (
                            <View style={styles.activeLine} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.segmentButton}
                            onPress={() => handleSegmentChange('ControlMeasures')}
                        >
                            <Text
                            style={[
                                styles.segmentText,
                                selectedOption === 'ControlMeasures' && styles.activeText,
                            ]}
                            >
                            Control Measures
                            </Text>
                            {selectedOption === 'ControlMeasures' && (
                            <View style={styles.activeLine} />
                            )}
                        </TouchableOpacity>
                        </View>

                </ScrollView>

        </View>




        {selectedOption === 'MethodsOfDispersal' && 
        
            <ScrollView style={stylesContent.mainContainer}>
                {diseaseData?.MethodsOfDispersal.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                    <Text key={index} style={stylesContent.contentText}>
                        {line}
                    </Text>
                ))}



            </ScrollView>
        }



        {selectedOption === 'DiseaseDevelopment' && 
        
            <ScrollView style={stylesContent.mainContainer}>
                {diseaseData?.DiseaseDevelopment.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                    <Text key={index} style={stylesContent.contentText}>
                        {line}
                    </Text>
                ))}

            </ScrollView>
        }


        {selectedOption === 'Symptoms' && 
        
            <ScrollView style={stylesContent.mainContainer}>


                {diseaseData?.DamageSymptoms.Symptoms.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                    <Text key={index} style={stylesContent.contentText}>
                        {line}
                    </Text>
                ))}


                {diseaseData?.DamageSymptoms.SymptomsSnapshot.map((snapshot,index)=>(
                    <View key={index} style={stylesContent.snapShots}>
                        <Image source={{ uri: snapshot }} style={{ width: '100%', height: '100%',borderRadius:5 }} />
                    </View>

                ))}


            </ScrollView>
        }



        
        {selectedOption === 'ControlMeasures' && 
        
            <ScrollView style={stylesContent.mainContainer}>
                <Text style={stylesContent.contentText}>
                    
                {diseaseData?.ControlMeasures.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                    <Text key={index} style={stylesContent.contentText}>
                        {line}
                    </Text>
                ))}
                </Text>




            </ScrollView>
        }


    </SafeAreaView>
  )
}
export default DiseaseScreen

const stylesContent = StyleSheet.create({
    mainContainer:{
        width:'95%',
        display:'flex',
        //borderWidth:1,
        paddingTop:10
    },
    snapShots:{
        width:'100%',
        height:200,
        //backgroundColor:'red',
        marginBottom:15
    },
    contentText:{
        marginBottom:15,
        color:'#333333',
        fontSize:19,
        fontWeight:400
    }
})

const styles = StyleSheet.create({

    mainContainer:{
        flex:1,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center'
    },

    headerContainer:{
        width:'100%',
        height:225,
        //backgroundColor:'red',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        marginBottom:15
    },

    infoHeaderContainer:{
        width:'95%',
        //borderWidth:1,

    },
    segmentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width:'100%',
        marginTop:15
      },
      segmentButton: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      segmentText: {
        color: 'black',
        fontSize: 19,
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
      scrollContainer: {
        flexDirection: 'row',
      },

      //header info

      cropName:{
        fontSize:35,
        color:'#37474F',
        fontWeight:600,
        marginBottom:5
      },
      scientificName:{
        fontStyle:'italic',
        fontSize:18,
        marginBottom:5
      }
})