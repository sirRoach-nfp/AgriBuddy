import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'react-native';
import { useUserContext } from '../Context/UserContext';
import { useSearchParams } from 'expo-router/build/hooks';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';


interface Symptoms{
    Symptoms:string,
    SymptomsSnapshot:string[]
}


interface referenceType{
  referenceTitle:string,
  referenceLink:string,
}


interface PestData{
    CommonName:string,
    ScientificName:string,
    Characterstics:string,
    Ecology:string,
    DamageSymptoms : Symptoms,
    PestSnapshot:string,
    ControlMeasures:string,
     reference:referenceType[]
}



const DiseasePestScreen = () => {

    const searchParams = useSearchParams();
    const pestName = searchParams.get('pestName');



  const [pestData, setPestData] = useState<PestData | null>(null);
  const [selectedOption,setSelectedOption] = useState<String>('Characteristics');
  const handleSegmentChange = (value:String) => {
    setSelectedOption(value);
  };


  useEffect(()=>{
    

    const fetchPestData = async()=>{

        try{
            console.log("Passed pest name ", pestName)
            const docRef = doc(db,'Pest',pestName as string);


            const docSnap = await getDoc(docRef)



            if(docSnap.exists()){
                console.log(docSnap.data())
                setPestData(docSnap.data() as PestData)
            }
        }catch(err){
            console.error(err)
        }
    }



    fetchPestData()
  },[])
  return (
    <SafeAreaView style={styles.mainContainer}>
    <ScrollView style={stylesContent.mainContainer} contentContainerStyle={{alignItems:'center'}}>

        <View style={styles.headerContainer}>
            <Image source={{ uri: pestData?.PestSnapshot }}
                style={{width:'100%',height:'100%',objectFit:'cover',        borderBottomLeftRadius:20,
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
                {pestData?.CommonName} 
            </Text>

            <Text style={styles.scientificName}>
                ({pestData?.ScientificName})
            </Text>


            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

                        <View style={styles.segmentContainer}>
                        <TouchableOpacity
                            style={styles.segmentButton}
                            onPress={() => handleSegmentChange('Characteristics')}
                        >
                            <Text
                            style={[
                                styles.segmentText,
                                selectedOption === 'Characteristics' && styles.activeText,
                            ]}
                            >
                            Characteristics
                            </Text>
                            {selectedOption === 'Characteristics' && (
                            <View style={styles.activeLine} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.segmentButton}
                            onPress={() => handleSegmentChange('Ecology')}
                        >
                            <Text
                            style={[
                                styles.segmentText,
                                selectedOption === 'Ecology' && styles.activeText,
                            ]}
                            >
                                Ecology
                            </Text>
                            {selectedOption === 'Ecology' && (
                            <View style={styles.activeLine} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.segmentButton}
                            onPress={() => handleSegmentChange('DamageSymptoms')}
                        >
                            <Text
                            style={[
                                styles.segmentText,
                                selectedOption === 'DamageSymptoms' && styles.activeText,
                            ]}
                            >
                            Symptoms
                            </Text>
                            {selectedOption === 'DamageSymptoms' && (
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




        {selectedOption === 'Characteristics' && (
            <>
                <View style={stylesContent.infoCard}>
                <Text style={stylesContent.contentTextPrimary}>
                    Physical Characteristics
                </Text>
                {pestData?.Characterstics.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                    


                        <Text key={index} style={stylesContent.contentText}>
                            {line}
                        </Text>
                   

                ))} 
                </View>
            </>
        )
        
   


        


        }



        {selectedOption === 'Ecology' && (
            <>  
                <View style={stylesContent.infoCard}>
                    <Text style={stylesContent.contentTextPrimary}>
                                Life cycle and ecology
                    </Text>
                    {pestData?.Ecology.replace(/\\n/g, '\n')
                        .split('\n')
                        .map((line, index) => (

                            

                                <Text key={index} style={stylesContent.contentText}>
                                    {line}
                                </Text>
                            

                    ))}
                </View>
            </>
        )}


        {selectedOption === 'DamageSymptoms' && (
            <View style={stylesContent.infoCard}>

                <Text style={stylesContent.contentTextPrimary}>
                        Damage Symptoms
                </Text>  
            <>
                {pestData?.DamageSymptoms?.Symptoms && pestData?.DamageSymptoms.Symptoms.replace(/\\n/g, '\n').split('\n').map((line, index) => (
  
                        
                        <Text key={index} style={stylesContent.contentText}>
                            {line}
                        </Text>
                    


                ))}


                {pestData?.DamageSymptoms?.SymptomsSnapshot && pestData?.DamageSymptoms.SymptomsSnapshot.map((snapshot,index)=>(
                    <View key={index} style={stylesContent.snapShots}>
                        <Image source={{ uri: snapshot }} style={{ width: '100%', height: '100%',borderRadius:5 }} />
                    </View>

                ))}
            </>
            </View>
        )}



        
        {selectedOption === 'ControlMeasures' && (
            <>
            
            
            <View style={stylesContent.infoCard}>
            <Text style={stylesContent.contentTextPrimary}>
                    Management Strategies
            </Text>
            {pestData && pestData.ControlMeasures && pestData?.ControlMeasures.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                
                

                    <Text key={index} style={stylesContent.contentText}>
                        {line}
                    </Text>
                

            ))}
            </View>
            </>
        )}

                
        {selectedOption === 'Sources' && (
            <>
            
            
                <View style={[stylesAiles.containerWrappperPest,{borderWidth:0,}]}>
                            
                            <View style={[stylesAiles.containerWrapperHeader,{backgroundColor:'#DAEEF7',borderColor:'#53697E'}]}>
                    
                                <AntDesign name="link" size={24} color="#53697E" />
                                <Text style={[stylesAiles.subContainerHeaderPest,{color:'#53697E'}]}>Reference Links</Text>
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


                                    {pestData&& pestData.reference && pestData.reference.length > 0 
                                    ? pestData.reference.map((ref,index)=> (
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
                                        
                                        <Text style={stylesAiles.noDataPlaceholder__Primary}>No References Yet</Text>
                                        <Text style={stylesAiles.noDataPlaceholder__Secondary}>Looks like we don’t have reference links for this pest Data at the moment.</Text>
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

export default DiseasePestScreen


const stylesContent = StyleSheet.create({

    infoCard:{
        borderWidth:1,
        padding:20,
        width:'95%',
        marginVertical:'auto',
        borderRadius:20,
        borderColor:'#E2e8f0',
        marginBottom:30,
    

    },

    mainContainer:{
        width:'95%',
        display:'flex',
        borderWidth:0,
        paddingTop:10,
        flexDirection:'column',
        
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
        borderWidth:0,
        display:'flex',
        flexDirection:'column',
        marginBottom:20,

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
        fontSize:19,
        color:'#333333',
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
