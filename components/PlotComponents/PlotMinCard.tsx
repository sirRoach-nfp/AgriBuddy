import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router'

import Foundation from '@expo/vector-icons/Foundation';

interface CurrentCrops{

    CropAssocId:string | null
    CropId:string | null
    CropName:string | null,
    
  }
interface props{
    plotName:string,
    plotAssocId:string,
    plotThumbnail:string,
    CurrentCrops:CurrentCrops
}



const PlotMinCard = ({plotAssocId,plotName,CurrentCrops,plotThumbnail}:props) => {

    










    const navigateToPlot =()=>{

        const queryString = `?plotAssocId=${encodeURIComponent(plotAssocId)}`
        router.push(`/(screens)/PlotManagementScreen${queryString}` as any)
    }
  return (
    <TouchableOpacity style={styles.container} onPress={navigateToPlot}>

      <View style={styles.thumbnail}>


            {plotThumbnail.length>0 ?(
                <Image source={{uri:plotThumbnail}} style={styles.img} resizeMode="cover"/>
            ) : (
                <Foundation name="photo" size={24} color="white" />
            )}
            
      </View>


      <View style={styles.infoWrapper}>
        <Text style={styles.plotName}>{plotName}</Text>



        {CurrentCrops.CropAssocId ? (
            <View style={styles.badgeGrowing}>
                <Text style={styles.badgeText} >
                    Growing
                </Text>
               
            </View>

        ) : (
            <View style={styles.badgeResting}>
                <Text style={styles.badgeText} >
                    Idle
                </Text>
            </View>


        )}

      </View>
      
    </TouchableOpacity>
  )
}

export default PlotMinCard

const styles = StyleSheet.create({

    container:{
        width:'100%',
        borderWidth:1,
        borderColor:'#E2E8F0',
        marginBottom:10,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        minHeight:150,
        borderRadius:10
    },

    thumbnail:{
        width:'100%',
        height:160,
        //borderWidth:1,
        backgroundColor:'#D2D2D2',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
            borderTopStartRadius:10,
        borderTopEndRadius:10,
        objectFit:'cover',
        backgroundPosition:'center'
    },
    infoWrapper:{
        width:'100%',
        display:"flex",
        flexDirection:'column',
        gap:8,
        marginBottom:'auto',
        flex:1,
        padding:10
    },
    badgeResting:{
        width:100,
        height:20,
        //borderWidth:1,
        alignSelf:'flex-start',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:3,
        paddingBottom:3,
        backgroundColor:'#E9A800',
        borderRadius:5,
        marginTop:'auto'
    },


    badgeGrowing:{
        width:100,
        alignSelf:'flex-start',
        //borderWidth:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:3,
        paddingBottom:3,
        backgroundColor:'#2E6F40',
        borderRadius:5,
        marginTop:'auto'
    },
    img:{
        width:'100%',
        height:'100%',
        borderWidth:0,
        borderTopStartRadius:10,
        borderTopEndRadius:10
    },
    //text 
    plotName:{
        fontSize:17,
        fontWeight:600,
         color:'#253D2C',
        
    },
    badgeText:{
        color:'#ffffff',
        fontSize:13,
    }
})