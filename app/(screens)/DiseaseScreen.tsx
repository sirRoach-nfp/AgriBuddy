import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { router } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useLanguage } from '../Context/LanguageContex';



interface Symptoms{
    Symptoms:string,
    SymptomsSnapshot:string[]
}

interface referenceType{
  referenceTitle:string,
  referenceLink:string,
}


interface DiseaseData{
    CommonName:string,
    MethodsOfDispersal:string,
    DamageSymptoms : Symptoms,
    DiseaseSnapshot:string,
    DiseaseDevelopment:string,
    ControlMeasures:string,
    reference:referenceType[]
}


const DiseaseScreen = () => {





    const {language} = useLanguage()
    const searchParams = useSearchParams();
    const diseaseId = searchParams.get('diseaseId')


    const [diseaseData,setDiseaseData] = useState<DiseaseData>()

    const [selectedOption,setSelectedOption] = useState<String>('Symptoms');
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
    <ScrollView style={stylesContent.mainContainer} contentContainerStyle={{alignItems:'center'}}>

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
                            {language === "en" ? "Symptoms" : "Sintomas"}
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
                               {language === "en" ? "Disease Development" : "Pag-unlad ng Sakit"}
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
                            {language === "en" ? "Methods of Dispersal" : "Mga Paraan ng Pagkalat"}
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
                            {language === "en" ? "Control Measures" : "Pamamaraan sa Pagkontrol"}
                            </Text>
                            {selectedOption === 'ControlMeasures' && (
                            <View style={styles.activeLine} />
                            )}
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={styles.segmentButton}
                            onPress={() => handleSegmentChange('Sources')}
                        >
                            <Text
                            style={[
                                styles.segmentText,
                                selectedOption === 'Sources' && styles.activeText,
                            ]}
                            >
                            Sources
                            </Text>
                            {selectedOption === 'Sources' && (
                            <View style={styles.activeLine} />
                            )}
                        </TouchableOpacity>
                        </View>

                </ScrollView>

        </View>




        {selectedOption === 'MethodsOfDispersal' && 
        
            <View style={stylesContent.infoCard}>
                <Text style={stylesContent.contentTextPrimary}>
                    Dispersal Overview
                </Text>

                {diseaseData?.MethodsOfDispersal.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                    <Text key={index} style={stylesContent.contentText}>
                        {line}
                    </Text>
                ))}

            </View>
        }



        {selectedOption === 'DiseaseDevelopment' && 

            <View style={stylesContent.infoCard}>

                <Text style={stylesContent.contentTextPrimary}>
                    How it develops
                </Text>
                {diseaseData?.DiseaseDevelopment.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                    <Text key={index} style={stylesContent.contentText}>
                        {line}
                    </Text>
                ))}

            </View>
        }


        {selectedOption === 'Symptoms' && 
        
            <View style={stylesContent.infoCard}>
                <Text style={stylesContent.contentTextPrimary}>
                    Visible Signs
                </Text>

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


            </View>
        }



        
        {selectedOption === 'ControlMeasures' && 
        
            <View style={stylesContent.infoCard}>
                <Text style={stylesContent.contentTextPrimary}>
                    What You Can Do
                </Text>
                    
                {diseaseData?.ControlMeasures.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                    <Text key={index} style={stylesContent.contentText}>
                        {line}
                    </Text>
                ))}
              
            </View>
        }


        {selectedOption === 'Sources' && (
            <>
            
            
                <View style={[stylesAiles.containerWrappperPest,{borderWidth:0,}]}>
                            
                            <View style={[stylesAiles.containerWrapperHeader,{backgroundColor:'#DAEEF7',borderColor:'#53697E'}]}>
                    
                                <AntDesign name="link" size={24} color="#53697E" />
                                <Text style={[stylesAiles.subContainerHeaderPest,{color:'#53697E'}]}>{language === "en" ? "Reference Links" : "Mga Pinagkunan ng Impormasyon"}</Text>
                            </View>


                            <View style={{width:'100%',backgroundColor:'white',
                                paddingVertical:10,
                                paddingHorizontal:10,
                                display:'flex',
                                flexDirection:'column',
                                gap:5,
                                borderLeftWidth:1,
                                borderBottomWidth:1,
                                borderRightWidth:1,
                                borderColor:'#e2e8f0',
                        
                                }}>


                                    {diseaseData&& diseaseData.reference && diseaseData.reference.length > 0 
                                    ? diseaseData.reference.map((ref,index)=> (
                                        <View style={{
                                        borderWidth:0,
                                        width:'100%',
                                        display:'flex',
                                        flexDirection:'row',
                                        alignItems:'center',
                                        gap:5,
                                        }}
                                        key={index}
                                        >

                                        <TouchableOpacity style={{padding:7,borderRadius:'50%',borderWidth:0,}}
                                            onPress={() => Linking.openURL(ref.referenceLink)}
                                        >
                                            <Feather name="external-link" size={20} color="#53697E" />
                                        </TouchableOpacity>
                                        <Text style={{fontSize:17}}>
                                            {ref.referenceTitle}
                                        </Text>
                                        
                                        </View>
                                    )) : (

                                    <View style={stylesAiles.noDataPlaceholder}>
                                        <View style={stylesAiles.noDataPlaceholder__iconWrapper}>
                                    
                                        <AntDesign name="link" size={24} color="#64748B" />
                                        </View>
                                        
                                        <Text style={stylesAiles.noDataPlaceholder__Primary}>{language === "en" ? "No References Yet" : "Walang Reference Pangkasalukuyan"}t</Text>
                                        <Text style={stylesAiles.noDataPlaceholder__Secondary}>{language === "en" 
    ? "Looks like we don’t have reference links for this pest data at the moment." 
    : "Mukhang wala pang reference links para sa datos ng sakit na ito sa kasalukuyan."}</Text>
                                    </View>

                                    )
                                    }


                            </View>



                </View>
            </>
        )}

    </ScrollView>
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
        fontSize:17,
        fontWeight:400
    },
    infoCard:{
        borderWidth:1,
        padding:20,
        width:'95%',
        marginVertical:'auto',
        borderRadius:20,
        borderColor:'#E2e8f0',
        marginBottom:30,
    

    },
    contentTextPrimary:{
        marginVertical:15,
        color:'#333333',
        fontSize:20,
        fontWeight:500
    },
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
        marginBottom:20
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
const stylesAiles = StyleSheet.create({


  noDataPlaceholder:{
    display:'flex',
    flexDirection:'column',
    width:'100%',
    borderWidth:0,
    padding:10,
    alignItems:'center',
    justifyContent:'center',
    gap:10,
    height:250
  },

  noDataPlaceholder__iconWrapper:{
    width:60,
    height:60,
    borderWidth:0,
    borderRadius:'50%',
    backgroundColor:'#F3F4F6',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },

  noDataPlaceholder__Primary:{
    fontSize:18,
    fontWeight:700,
    color:"#2D303F"
  },
  noDataPlaceholder__Secondary:{
    fontSize:15,
    fontWeight:400,
    textAlign:'center',
    color:"#64748B"
  },
  contentWrapper:{
    width:'100%',
  
   
    display:'flex',
    flexDirection:'column',
 
    paddingTop:0
  },
  containerWrappperPest: {
    paddingTop:0,
    paddingHorizontal:0,
    width:'95%',
    borderWidth:0,
    position:'relative',
    marginBottom:20,
    backgroundColor:'white',
    borderRadius:5,

},
badgeContainer:{
  width:'100%',
  borderWidth:0,
  borderLeftWidth:1,
  borderBottomWidth:1,
  borderRightWidth:1,
  borderColor:'#e2e8f0',
  position:'relative',
  //borderWidth: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  paddingVertical:10,
  //justifyContent: 'center',
  gap: 10,
  paddingHorizontal: 10,
},
badgeWrapper:{
  /*
  height:100,
  width:150,
  //borderWidth:1,
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center'
  */

  height:220,
  width:'100%',
  borderWidth:1,
  borderColor:'#E2E8F0',
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center',
  borderRadius:5
  
},
subContainerHeaderPest:{
    color:'#842C2B',
    fontWeight:700,
    fontSize:18,

  
},
badgesText:{
  color:'#2D303F',
  fontWeight:500,
  fontSize:16,
  
  marginTop:10,
  marginBottom:10
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
},
    containerWrapperHeader:{
        width:'100%',
        borderColor:'#D7514E',
        paddingVertical:10,
        paddingLeft:5,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:5,
        borderLeftWidth:5,
        borderTopLeftRadius:10,
        backgroundColor:'#FEF2F2'
    },


})
