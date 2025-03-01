import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'






import { Image } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';





const CropProfile = () => {

    const searchParams = useSearchParams();

    const commonName = searchParams.get('commonName'); // should return "bellpepper"
    const scientificName = searchParams.get('scientificName');
    const imgUrl = searchParams.get('imgUrl');



    
  return (
    <SafeAreaView style={styles.mainContainer}>
        
        <View style={styles.thumbnail}>\
            <Image source={{uri:imgUrl as string}}/>
        </View>


        <View style={styles.content}> 
            <View style={styles.headerWrapper}>
                <View style={styles.seasonIndi}></View>

                <Text style={styles.cropName}>{commonName}</Text>
                <Text style={styles.scientificName}>(Scientific Name)</Text>
                <Text style={styles.familyName}>From The Family Solanacea</Text>
                <Text style={styles.bestGrown}>Best Grown From month - to month</Text>
            </View>

            <ScrollView style={styles.bodyWrapper} contentContainerStyle={{alignItems:'center'}}>


                <View style={subContainer.containerWrappper}>
                    <Text style={styles.subContainerHeader}>Suitable Soil</Text>



                    <View style={subContainer.badgeContainer}>

                        <View style={subContainer.badgeWrapper}>
                            
                            <Image/>
                            <Text  style={styles.badgesText}>Loamy</Text>

                        </View>

                        <View style={subContainer.badgeWrapper}>
                            <Text style={styles.badgesText}>Sandy</Text>
                        </View>

                        <View style={subContainer.badgeWrapper}>
                            <Text style={styles.badgesText}>Clayey</Text>
                        </View>
                        </View>


                        <View style={subContainer.phIndi}>
                        <Text style={styles.phText}>
                            Optimal Soil PH is 7.5 - 8.0
                        </Text>
                    </View>





                </View>







                <View style={subContainer.containerWrappperPest}>
                    <Text style={styles.subContainerHeaderPest}>Common Pests</Text>



                    <View style={subContainer.badgeContainer}>

                        <View style={subContainer.badgeWrapper}>
                            
                            <Image/>
                            <Text  style={styles.badgesText}>Loamy</Text>

                        </View>

                        <View style={subContainer.badgeWrapper}>
                            <Text style={styles.badgesText}>Sandy</Text>
                        </View>

                        <View style={subContainer.badgeWrapper}>
                            <Text style={styles.badgesText}>Clayey</Text>
                        </View>
                        </View>







                </View>






                <View style={subContainer.containerWrappperPest}>
                    <Text style={styles.subContainerHeaderPest}>Common Diseases</Text>



                    <View style={subContainer.badgeContainer}>

                        <View style={subContainer.badgeWrapper}>
                            
                            <Image/>
                            <Text  style={styles.badgesText}>Loamy</Text>

                        </View>

                        <View style={subContainer.badgeWrapper}>
                            <Text style={styles.badgesText}>Sandy</Text>
                        </View>

                        <View style={subContainer.badgeWrapper}>
                            <Text style={styles.badgesText}>Clayey</Text>
                        </View>
                        </View>


              





                </View>





            </ScrollView>
        </View>




    </SafeAreaView>
  )
}

export default CropProfile

const styles = StyleSheet.create({



    //text.

    //pestheadertext
    subContainerHeaderPest:{
        color:'#A94442',
        fontWeight:500,
        fontSize:14,
        marginBottom:5,
        marginLeft:10
        
    },


    phText:{
        color:'#253D2C',
        fontWeight:300,
        fontSize:13,
        fontStyle:'italic',
        marginLeft:10
    },

    subContainerHeader:{
        color:'#253D2C',
        fontWeight:500,
        fontSize:14,
        marginBottom:5,
        marginLeft:10
    },

    badgesText:{
        color:'#253D2C',
        fontWeight:300,
        fontSize:13,
        fontStyle:'italic'
    },
    mainContainer:{
        display:'flex',
        flex:1,
        flexDirection:'column',
        //borderWidth:1
    },
    thumbnail:{
        width:'100%',
        height:200,
        zIndex:0,
        backgroundColor:'red'
    },
    content:{
        flex:1,
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        marginTop:-20
       
    },
    headerWrapper:{
        width:'100%',
        //height:100,
        //borderWidth:1,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        backgroundColor:'#FFFFFF',
        paddingTop:15,
        paddingBottom:15,
        borderBottomColor:'#B9B9B9',
        borderBottomWidth:1,
        marginBottom:20

    },

    seasonIndi:{
        width:13,
        height:13,
        borderRadius:'50%',
        backgroundColor:'#80E900',
        marginLeft:15,
        marginBottom:10
    },

    cropName:{
        marginLeft:15,
        fontWeight:500,
        fontSize:25,
        color:'#253D2C',
        
        
    },
    scientificName:{
        marginLeft:15,
        fontWeight:300,
        fontStyle:'italic',
        fontSize:15,
        marginBottom:10,
        color:'#253D2C',
    },
    familyName:{
        marginLeft:15,
        fontWeight:300,
        fontSize:16,
        fontStyle:'italic',
        color:'#253D2C',
    },
    bestGrown:{
        marginLeft:15,
        fontWeight:300,
        fontSize:16,
        fontStyle:'italic',
        color:'#253D2C',
    },
    bodyWrapper:{
        width:'100%',
        flex:1,
        borderColor:'green',
        //borderWidth:1,
        borderStyle:'dotted',
        display:'flex',
        flexDirection:'column',
        paddingTop:10

    },

})


const subContainer = StyleSheet.create({

    //pest

    containerWrappperPest: {
        paddingTop:10,
        width:'95%',
        //borderWidth:1,
        position:'relative',
        marginBottom:20,
        backgroundColor:'#FAD4D4',
        borderRadius:5
    },


    //soil
    containerWrappper: {
        width:'95%',
        //borderWidth:1,
        position:'relative',
        marginBottom:20
    },
    badgeContainer:{
        width:'100%',
        //borderWidth:1,
        position:'relative',
        
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:10
    },
    badgeWrapper:{
        height:90,
        width:90,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
        
    },
    phIndi:{
        width:'100%',
        paddingTop:5,
        paddingBottom:5,
        borderRadius:5,
        backgroundColor:'#CFFFDC'
    }


})