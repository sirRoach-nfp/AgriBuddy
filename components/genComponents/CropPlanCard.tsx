import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CropPlanCard = () => {
  return (
    <View style={styles.container}>

      <View style={styles.currentCropContainer}>
        <View style={styles.currentCropThumbnail}>

        </View>

        <View style={styles.currentCropInfo}>
            <Text style={styles.currentCropInfoMainText}>Tomato</Text>
            <Text style={styles.currentCropInfoMainDate}>Days Since Planted : 20</Text>
        </View>

        <View style={styles.statusContainerMain}>
            <View style={styles.statusBadge}>
                <Text>
                    First Cycle
                </Text>

            </View>
        </View>

      </View>

      <View style={styles.nextCropContainer}>


            <View style={styles.nextCropCardContainer}>

                    <View style={styles.nextCropThumbnail}></View>

            <View style={styles.nextCropInfoContainer}>
                <Text style={styles.nextCropInfoText}>Crop Name</Text>

                <View style={styles.nextCropStatusBadge}>
                    <Text style={styles.nextCropStatusBadgeText}>
                        First Cycle
                    </Text>

                </View>



            </View>
            

        </View>

        <View style={styles.nextCropCardContainer}>


            <View style={styles.nextCropThumbnail}></View>

            <View style={styles.nextCropInfoContainer}>
                <Text style={styles.nextCropInfoText}>Crop Name</Text>

                <View style={styles.nextCropStatusBadge}>
                    <Text style={styles.nextCropStatusBadgeText}>
                        First Cycle
                    </Text>

                </View>



            </View>
            

        </View>


        <View style={styles.nextCropCardContainer}>
        
            <View style={styles.nextCropThumbnail}></View>

            <View style={styles.nextCropInfoContainer}>
                <Text style={styles.nextCropInfoText}>Crop Name</Text>

                <View style={styles.nextCropStatusBadge}>
                    <Text style={styles.nextCropStatusBadgeText}>
                        First Cycle
                    </Text>

                </View>



            </View>
        </View>
      </View>


      
    </View>
  )
}

export default CropPlanCard

const styles = StyleSheet.create({
    container:{
        width:'95%',
        //borderWidth:1,
        marginTop:20,
        display:"flex",
        flexDirection:'column',
    },
    currentCropContainer:{
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        marginBottom:10,
        paddingTop:5,
        paddingBottom:5,
   
    },
    currentCropThumbnail:{
        width:50,
        height:50,
        borderRadius:'100%',
        borderWidth:1,
        marginRight:10
    },

    currentCropInfo:{
        display:'flex',
        flexDirection:'column',
        //borderWidth:1,
        flex:2,
        height:'100%'
    },
    statusContainerMain:{
        flex:1,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        height:'100%',
    
        
    },
    statusBadge:{
        marginTop:'auto',
        width:100,
        height:25,
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        backgroundColor:'#5271ff',
        elevation:1

    },
    // text 

    currentCropInfoMainText:{
        fontSize:16,
        fontWeight:600,
        color: '#253D2C',
    },
    currentCropInfoMainDate:{
        marginTop:'auto',
        fontSize:15,
        fontWeight:400,
        color: '#253D2C',

    },

    nextCropContainer:{
        display:'flex',
        flexDirection:'row',
        gap:5
    },


    nextCropCardContainer:{
        flex:1,
        backgroundColor:"#CFFFDC",
        //borderWidth:1,
        //height:50,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        paddingTop:10,
        paddingBottom:10,
        borderRadius:5
    },

    nextCropThumbnail:{
        width:40,
        height:40,
        borderWidth:1,
        borderRadius:'50%',
        marginBottom:5
    },

    nextCropInfoContainer:{
        flex:1,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center'
    },
    nextCropStatusBadge:{
        width:90,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        marginTop:'auto',

        borderRadius:3,
        backgroundColor:'#5271ff',
    },
    //text 

    nextCropInfoText:{
        fontSize:14,
        fontWeight:500,
        marginBottom:5
    },
    nextCropStatusBadgeText:{
        fontSize:13,
        color:"#ffffff",
    }
    
})