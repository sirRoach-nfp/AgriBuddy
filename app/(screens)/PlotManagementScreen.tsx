import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'


import Feather from '@expo/vector-icons/Feather';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CropPlanCard from '@/components/genComponents/CropPlanCard';

const PlotManagementScreen = () => {


 
  return (
    <SafeAreaView style={styles.mainContainer}>

        <View style={styles.plotInfoContainer}>
            <View style={styles.thumbnail}></View>
            <View style={styles.infoWrapper}>
                <View style={styles.infoHeaderwrapper}>
                    <Text  style={styles.plotName}>Farm Plot # Name</Text>
                    <Feather name="edit" size={20} color="black" style={{marginLeft:5}}/>

                </View>
                
                <View style={styles.badge}>
                    <Text style={styles.status} >
                        Growing
                    </Text>
                </View>
            </View>
        </View>





        // rotation plan


        <View style={stylesNoRotation.wrapper}>
            
            <View style={stylesNoRotation.textContainer}>
                <Text style={stylesNoRotation.text}>
                Not Following A Crop Rotation Plan
                </Text>
            </View>
            <View style={stylesNoRotation.add}>
                <FontAwesomeIcon icon={faPlus} size={40} color='#FFFFFF'/>
            </View>
        </View>


        <CropPlanCard/>



    </SafeAreaView>
  )
}

export default PlotManagementScreen

const styles = StyleSheet.create({

    mainContainer:{
        flex:1,
        display:"flex",
        flexDirection:'column',
        borderWidth:1,
        alignItems:'center',
        paddingTop:10
    },
    plotInfoContainer:{
        width:'95%',
        borderWidth:1,
        display:'flex',
        flexDirection:'row',
        marginBottom:20
    },
    thumbnail:{
        width:140,
        height:90,
        borderWidth:1
    },
    infoWrapper:{
        marginLeft:10,
        display:"flex",
        flexDirection:'column',
        borderWidth:1,
        marginBottom:'auto',
        height:'100%'
    },
    badge:{
        width:100,
        height:20,
        borderWidth:1,
        marginTop:'auto',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        padding:10
    },

    infoHeaderwrapper:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',

    },


    //text

    plotName:{
        fontSize:18,
        fontWeight:500
    },
    status:{
        fontSize:15,
        fontWeight:500
    }
})


const stylesNoRotation = StyleSheet.create({

    wrapper:{
        width:'95%',
        
        display:'flex',
        flexDirection:'row',
        marginBottom:20,

    },
    add:{
        width:70,
        height:70,
        //borderWidth:1,
        marginLeft:'auto',
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#D2D2D2',
    },
    textContainer:{
        flex:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        borderWidth:2,
        borderStyle:'dotted',
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        marginRight:10,
        borderColor:'#9B9B9B'
    },
    text:{
        fontSize:15,
        fontWeight:500,
        color:'#9B9B9B'
    }
})

const stylesWRotation = StyleSheet.create({

    wrapper:{}
})