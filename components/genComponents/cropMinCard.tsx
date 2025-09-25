import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native';
import { router } from 'expo-router';

interface optimalSeasonType{
    end:number,
    start:number
}
type CropMinCardProps = {
    commonName: string;
    scientificName: string;
    imgUrl:string;
    cropId:string;
    optimalSeason:optimalSeasonType
  };
  

const CropMinCard = ({commonName,scientificName,imgUrl,cropId,optimalSeason}: CropMinCardProps) => {



  const navigateToView = () => {
    const queryString = `?commonName=${encodeURIComponent(commonName)}&scientificName=${encodeURIComponent(scientificName)}&imgUrl=${encodeURIComponent(imgUrl)}&cropid=${encodeURIComponent(cropId)}`;
    router.push(`/CropProfile${queryString}` as any);
  }

    const currentMonth = new Date().getMonth()+1
    //helper
    const isCropSuitable = (season:optimalSeasonType, currentMonth:number): boolean => {
        const {start,end} = season;

        if(start <= end){
            return currentMonth >= start && currentMonth <= end;
        }
        else{
            return currentMonth >= start || currentMonth <= end;
        }
    }

  const isSuitable = isCropSuitable(optimalSeason,currentMonth)

  return (
    <TouchableOpacity style={styles.container} onPress={navigateToView} >

        <View style={styles.thumbnail}>
            <Image source={{uri:imgUrl}} style={styles.img}/>
        </View>



        <View style={styles.infoWrapper}>

            <Text style={styles.commonName}>{commonName}</Text>
            <Text style={styles.scientificName}>{scientificName}</Text>

            
            <View style={styles.statusWrapper}> 

                {isSuitable ?(
                    <>
                        <View style={styles.statusIndi}></View>
                        <Text style={styles.statusText}>Ideal Season</Text>
                    </>
                ) : (
                    <>
                        <View style={[styles.statusIndi,{backgroundColor:'#FFC107'}]}></View>
                        <Text style={styles.statusText}>Not Ideal Season</Text>
                    </>
                )}



                

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
            
            fontSize:17,
            fontWeight:500,
            color:'#253D2C',
            marginLeft:15,




        },
        scientificName:{
            fontWeight:400,
            color:'#253D2C',
            fontStyle:'italic',
            marginTop:'auto',
            marginBottom:'auto',
            marginLeft:16,


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