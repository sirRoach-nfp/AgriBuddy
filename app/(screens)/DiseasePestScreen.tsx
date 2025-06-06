import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'react-native';
import { useUserContext } from '../Context/UserContext';
import { useSearchParams } from 'expo-router/build/hooks';
import { router } from 'expo-router';


interface Symptoms{
    Symptoms:string,
    SymptomsSnapshot:string[]
}
interface PestData{
    CommonName:string,
    ScientificName:string,
    Characterstics:string,
    Ecology:string,
    DamageSymptoms : Symptoms,
    PestSnapshot:string,
    ControlMeasures:string,
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
                            DamageSymptoms
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
                        </View>

                </ScrollView>

        </View>




        {selectedOption === 'Characteristics' && 
        
            <ScrollView style={stylesContent.mainContainer}>
                {pestData?.Characterstics.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                    <Text key={index} style={stylesContent.contentText}>
                        {line}
                    </Text>
                ))}

                <TouchableOpacity onPress={()=>{console.log(pestData?.DamageSymptoms)}}>
                    Test
                </TouchableOpacity>

            </ScrollView>
        }



        {selectedOption === 'Ecology' && 
        
            <ScrollView style={stylesContent.mainContainer}>
                {pestData?.Ecology.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                    <Text key={index} style={stylesContent.contentText}>
                        {line}
                    </Text>
                ))}

            </ScrollView>
        }


        {selectedOption === 'DamageSymptoms' && 
        
            <ScrollView style={stylesContent.mainContainer}>


                {pestData?.DamageSymptoms.Symptoms.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                    <Text key={index} style={stylesContent.contentText}>
                        {line}
                    </Text>
                ))}


                {pestData?.DamageSymptoms.SymptomsSnapshot.map((snapshot,index)=>(
                    <View key={index} style={stylesContent.snapShots}>
                        <Image source={{ uri: snapshot }} style={{ width: '100%', height: '100%',borderRadius:5 }} />
                    </View>

                ))}


            </ScrollView>
        }



        
        {selectedOption === 'ControlMeasures' && 
        
            <ScrollView style={stylesContent.mainContainer}>
                <Text style={stylesContent.contentText}>
                    
                {pestData?.ControlMeasures.replace(/\\n/g, '\n').split('\n').map((line, index) => (
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

export default DiseasePestScreen


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
        fontSize:16
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
        fontSize: 17,
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
      },
      scrollContainer: {
        flexDirection: 'row',
      },

      //header info

      cropName:{
        fontSize:30,
        color:'#253D2C',
        fontWeight:600,
        marginBottom:5
      },
      scientificName:{
        fontStyle:'italic',
        fontSize:18,
        marginBottom:5
      }
})