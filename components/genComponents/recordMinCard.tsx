import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';

type recordMinCardProps = {
    cropName:string,
    cropId:string,
    status: string,
    datePlanted:string,
    cropCover:string,
    SessionId:string,
    PlotName:string,
    PlotAssoc:string

}
import { Image } from 'react-native';
import { cropsImages } from '@/app/Pestdat';

const RecordMinCard = ({cropName,cropId,status,datePlanted,SessionId,PlotAssoc,PlotName,cropCover}: recordMinCardProps) => {


    const navigateToManagement = () =>{
  
  
  
        const queryString = `?cropName=${encodeURIComponent(cropName)}&status=${encodeURIComponent(status)}&datePlanted=${encodeURIComponent(datePlanted)}&cropId=${encodeURIComponent(cropId)}&SessionId=${encodeURIComponent(SessionId)}&PlotAssoc=${encodeURIComponent(PlotAssoc)}&PlotName=${encodeURIComponent(PlotName)}`;
        router.push(`/CropManagement${queryString}` as any);
  
  
  
    }


  return (
    <TouchableOpacity style={styles.container} onPress={navigateToManagement}>
        <ImageBackground
            source={{ uri: cropCover }}
            style={styles.backgroundImage}
            imageStyle={styles.imageBackgroundStyle}
        >
            <View style={styles.overlay}>
            <Text style={styles.commonName}>{cropName}</Text>

            {PlotAssoc && PlotAssoc !== 'null' ? (
                <View style={styles.badgeWrapperPlot}>
                <Text style={styles.badgeTextPlot}>{PlotName}</Text>
                </View>
            ) : (
                <View style={styles.badgeWrapperNoPlot}>
                <Text style={styles.badgeText}>No Plot</Text>
                </View>
            )}
            </View>
        </ImageBackground>
    </TouchableOpacity>
  )
}

export default RecordMinCard



const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: 'flex-end', // content at bottom
      },
      imageBackgroundStyle: {
        resizeMode: 'cover',
        borderRadius: 10,
      },
      overlay: {
        backgroundColor: 'rgba(255,255,255,0.85)', // slight overlay for readability
        padding: 10,
        alignItems: 'center',
      },
      
    badgeWrapperNoPlot:{
        width:80,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        marginTop:5,
        borderRadius:5,
        backgroundColor:'#E9A800',
        padding:3
    },
    badgeTextPlot:{
        color:'#ffffff',
        fontSize:14,
        fontWeight:400,
    },
    badgeWrapperPlot:{
        alignSelf:'flex-start',
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        marginTop:5,
        borderRadius:5,
        backgroundColor:'#2E6F40',
        padding:3,
        marginLeft:'auto',
        marginRight:'auto'
    },
    badgeText:{
        fontSize:14,
        fontWeight:400,
        //color:'#253D2C',

    },
    container: {
        width: '47%',
        aspectRatio: 1,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 2,
        marginBottom: 15,
        borderWidth:1
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
        borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'

    },
    thumbnail: {
        width:70,
        height:70,
        //borderWidth:1,
        backgroundColor:'#4C9142',
        borderRadius:10,
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
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
      },
    scientificName:{
        fontWeight:300,
        color:'#253D2C',
        fontStyle:'italic',
        marginTop:'auto',
        marginBottom:'auto',
       


    },


    statusIndi:{
        borderRadius:5,
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
    
