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

    SessionId:string,
    PlotName:string,
    PlotAssoc:string

}
import { Image } from 'react-native';
import { cropsImages } from '@/app/Pestdat';

const RecordMinCard = ({cropName,cropId,status,datePlanted,SessionId,PlotAssoc,PlotName}: recordMinCardProps) => {


    const navigateToManagement = () =>{
  
  
  
        const queryString = `?cropName=${encodeURIComponent(cropName)}&status=${encodeURIComponent(status)}&datePlanted=${encodeURIComponent(datePlanted)}&cropId=${encodeURIComponent(cropId)}&SessionId=${encodeURIComponent(SessionId)}$PlotAssoc=${encodeURIComponent(PlotAssoc)}&PlotName=${encodeURIComponent(PlotName)}`;
        router.push(`/CropManagement${queryString}` as any);
  
  
  
    }


  return (
        <TouchableOpacity style={styles.container} onPress={navigateToManagement}  >
    
            <View style={styles.thumbnail}>
                <Image source={cropsImages[cropId]} style={{width:'100%',height:'100%',objectFit:'contain',borderRadius:'50%'}}  />
            </View>
    
    
    
           
    
            <Text style={styles.commonName}>{cropName}</Text>


            <View style={styles.badgeWrapperNoPlot}>
                <Text style={styles.badgeText}>No Plot</Text>
            </View>
            

    
    
    
    
    
        </TouchableOpacity>
  )
}

export default RecordMinCard



const styles = StyleSheet.create({
    badgeWrapperNoPlot:{
        width:80,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        marginTop:5,
        borderRadius:5,
        backgroundColor:'#E9A800'
    },
    badgeWrapperPlot:{
        width:80,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        marginTop:5,
        borderRadius:5,
        backgroundColor:'#2E6F40'
    },
    badgeText:{
        fontSize:14,
        fontWeight:400,
        //color:'#253D2C',

    },
    container: {
        width:150,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        //marginBottom:15,
        elevation:7,
        backgroundColor:'#D8D8C0',
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        paddingTop:15,
        paddingBottom:15

    },

    infoWrapper:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        marginTop:5,
        borderWidth:1,
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
        width:70,
        height:70,
        //borderWidth:1,
        backgroundColor:'#4C9142',
        borderRadius:'50%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        
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
        marginTop:10,
      
       




    },
    scientificName:{
        fontWeight:300,
        color:'#253D2C',
        fontStyle:'italic',
        marginTop:'auto',
        marginBottom:'auto',
       


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
    
