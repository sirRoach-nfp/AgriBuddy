import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router'



interface CurrentCrops{

    CropAssocId:string | null
    CropId:string | null
    CropName:string | null,
  }
interface props{
    plotName:string,
    plotAssocId:string,
    CurrentCrops:CurrentCrops
}



const PlotMinCard = ({plotAssocId,plotName,CurrentCrops}:props) => {












    const navigateToPlot =()=>{

        const queryString = `?plotAssocId=${encodeURIComponent(plotAssocId)}`
        router.push(`/(screens)/PlotManagementScreen${queryString}` as any)
    }
  return (
    <TouchableOpacity style={styles.container} onPress={navigateToPlot}>

      <View style={styles.thumbnail}>
            <Image source={require('../../assets/images/Misc/PlotIcon.svg')} style={styles.img}/>
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
        //borderWidth:1,
        marginBottom:10,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },

    thumbnail:{
        width:100,
        height:60,
        //borderWidth:1,
        backgroundColor:'#4C9142',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
    },
    infoWrapper:{
        marginLeft:10,
        display:"flex",
        flexDirection:'column',
        //borderWidth:1,
        marginBottom:'auto',
        height:'100%'
    },
    badgeResting:{
        width:100,
        height:20,
        //borderWidth:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#E9A800',
        borderRadius:5,
        marginTop:'auto'
    },


    badgeGrowing:{
        width:100,
        height:20,
        //borderWidth:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#2E6F40',
        borderRadius:5,
        marginTop:'auto'
    },
    img:{
        width:45,
        height:45
    },
    //text 
    plotName:{
        fontSize:16,
        fontWeight:500,
         color:'#253D2C'
    },
    badgeText:{
        color:'#ffffff',
    }
})