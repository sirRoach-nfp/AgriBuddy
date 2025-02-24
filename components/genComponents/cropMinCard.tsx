import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CropMinCard = () => {
  return (
    <View style={styles.container}>

        <View style={styles.thumbnail}>
            
        </View>



        <View style={styles.infoWrapper}>

            <Text style={styles.commonName}>Common Name</Text>
            <Text style={styles.scientificName}>Scientific Name</Text>

            
            <View style={styles.statusWrapper}> 
                <View style={styles.statusIndi}>

                </View>
                <Text style={styles.statusText}>In Season</Text>


                

            </View>



        </View>





    </View>
  )
}

export default CropMinCard

const styles = StyleSheet.create({

    container: {
        width:'95%',
        borderWidth:1,
        display:'flex',
        flexDirection:'row'

    },

    infoWrapper:{
        display:'flex',
        flexDirection:'column',
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
        width:80,
        height:80,
        borderWidth:1,
    },
    commonName: {
        
        fontSize:15,
        fontWeight:600,
        color:'#253D2C',
        marginLeft:5,




    },
    scientificName:{
        fontWeight:300,
        color:'#253D2C',
        fontStyle:'italic',
        marginTop:'auto',
        marginBottom:'auto',
        marginLeft:5,


    },


    statusIndi:{
        borderRadius:'50%',
        backgroundColor:'#80E900',
        width:10,
        height:10,
        marginLeft:5,
        marginRight:5
    },
    statusText:{
        fontWeight:300,
        color:'#253D2C',
        fontStyle:'italic',
    },



})