import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';

type recordMinCardProps = {
    cropName:string,
    cropId:string,
    status: string,
    datePlanted:string,
}
import { Image } from 'react-native';

const RecordMinCard = ({cropName,cropId,status,datePlanted}: recordMinCardProps) => {


    const navigateToManagement = () =>{
  
  
  
        const queryString = `?cropName=${encodeURIComponent(cropName)}&status=${encodeURIComponent(status)}&datePlanted=${encodeURIComponent(datePlanted)}`;
        router.push(`/CropManagement${queryString}` as any);
  
  
  
    }


  return (
        <TouchableOpacity style={styles.container} onPress={navigateToManagement}  >
    
            <View style={styles.thumbnail}>
                <FontAwesomeIcon icon={faSeedling} size={30} color='#FFFFFF'/>
            </View>
    
    
    
            <View style={styles.infoWrapper}>
    
                <Text style={styles.commonName}>{cropName}</Text>
                <Text style={styles.scientificName}>{datePlanted}</Text>
    
                
                <View style={styles.statusWrapper}> 
                    <View style={styles.statusIndi}>
    
                    </View>
                    <Text style={styles.statusText}>{status}</Text>
    
    
                    
    
                </View>
    
    
    
            </View>
    
    
    
    
    
        </TouchableOpacity>
  )
}

export default RecordMinCard



const styles = StyleSheet.create({

    container: {
        width:'95%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        marginBottom:15

    },

    infoWrapper:{
        display:'flex',
        flexDirection:'column',
        //borderWidth:1,
        flex:2

    },

    statusWrapper:{
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'

    },
    thumbnail: {
        width:60,
        height:60,
        //borderWidth:1,
        backgroundColor:'#4C9142',
        borderRadius:5,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    icon:{

    },

    img:{
        width:'100%',
        height:'100%',
        resizeMode:'cover',
        borderRadius:5,
        elevation:5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    commonName: {
        
        fontSize:15,
        fontWeight:600,
        color:'#253D2C',
        marginLeft:15,




    },
    scientificName:{
        fontWeight:300,
        color:'#253D2C',
        fontStyle:'italic',
        marginTop:'auto',
        marginBottom:'auto',
        marginLeft:15,


    },


    statusIndi:{
        borderRadius:'50%',
        backgroundColor:'#80E900',
        width:10,
        height:10,
        marginLeft:15,
        marginRight:5
    },
    statusText:{
        fontWeight:300,
        color:'#253D2C',
        fontStyle:'italic',
    },



})
    
