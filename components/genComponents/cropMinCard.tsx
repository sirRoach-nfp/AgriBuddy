import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native';
import { router } from 'expo-router';
type CropMinCardProps = {
    commonName: string;
    scientificName: string;
    imgUrl:string;
  };
  

const CropMinCard = ({commonName,scientificName,imgUrl}: CropMinCardProps) => {



  const navigateToView = () => {
    router.push({
        pathname: '/CropProfile',
        params: {
          commonName,
          scientificName,
          imgUrl,
        },
      });
  }
  return (
    <TouchableOpacity style={styles.container} onPress={navigateToView} >

        <View style={styles.thumbnail}>
            <Image source={{uri:imgUrl}} style={styles.img}/>
        </View>



        <View style={styles.infoWrapper}>

            <Text style={styles.commonName}>{commonName}</Text>
            <Text style={styles.scientificName}>{scientificName}</Text>

            
            <View style={styles.statusWrapper}> 
                <View style={styles.statusIndi}>

                </View>
                <Text style={styles.statusText}>In Season</Text>


                

            </View>



        </View>





    </TouchableOpacity>
  )
}

export default CropMinCard

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