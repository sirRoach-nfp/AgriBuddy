import { Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

import { cropsImages } from '../../app/Pestdat';

interface cropType{
    CropName: string,
    CropId:string,
}


const CropRotationCard = ({CropName,CropId}:cropType) => {


  const navigateToSelection = () => {


    router.push('/(screens)/CropsSelection')
  }
  return (
        <View style={CardsStyle.CardWrapper}>

            <TouchableOpacity style={CardsStyle.CardThumbnailDefault}>
                <Image style={{width:'100%',height:'100%',borderRadius:5, objectFit:'contain'} }source={cropsImages[CropId]}/>
            </TouchableOpacity>

            <View style={CardsStyle.CardContentWrapper}>

                <Text style={CardsStyle.CropNotSelectedText}>
                    {CropName}
                </Text>

                <View style={CardsStyle.BadgeSelected}>
                    <Text>Cycle One</Text>
                </View>

            </View>



        </View>

  )
}

export default CropRotationCard

const CardsStyle = StyleSheet.create({

    CardWrapper:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        marginBottom:30,
        //borderWidth:1

    },


    CardThumbnailDefault:{
        width:75,
        height:75,
        marginRight:20,
        borderRadius:5,
        //borderWidth:1,
        backgroundColor:'#D2D2D2'
    },

    

    CardContentWrapper:{
        flex:1,
        //borderWidth:1,
        //borderColor:'blue',
        display:'flex',
        flexDirection:'column'
    },

    //text

    CropSelectedText:{
        fontSize:20,
        fontWeight:500,
        color:'#253D2C',
    },

    CropNotSelectedText:{
        fontSize:17,
        fontWeight:500,
        color:'#9B9B9B',
        marginTop:10
    },

    BadgeSelected:{
        width:100,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#CFFFDC',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        marginTop:'auto'
    },

    BadgeNotSelected : {
        width:100,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#D2D2D2',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        marginTop:'auto'
    }

})