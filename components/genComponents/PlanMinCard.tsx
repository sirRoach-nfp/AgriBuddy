import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { faArrowsSpin } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
const PlanMinCard = () => {
  return (
    <View style={styles.wrapper}>
      
      <View style={styles.thumbnail}>
        <FontAwesomeIcon icon={faArrowsSpin} size={40} color='#fff'/>
      </View>
      

      <View style={styles.infoWrapper}> 
        

        <Text style={styles.planTitle}>Test</Text>
        

        <View style={styles.infoBeads}>
            
            <View style={styles.infoBead}> 
                <View style={styles.bead}>

                </View>
                <Text style={styles.beadText}>
                    Test
                </Text>
            </View>

            <View style={styles.infoBead}> 
                <View style={styles.bead}>

                </View>
                <Text style={styles.beadText}>
                    Test
                </Text>
            </View>
            
        </View>


        <View style={styles.infoBeads}>
            
            <View style={styles.infoBead}> 
                <View style={styles.bead}>

                </View>
                <Text style={styles.beadText}>
                    Test
                </Text>
            </View>

            <View style={styles.infoBead}> 
                <View style={styles.bead}>

                </View>
                <Text style={styles.beadText}>
                    Test
                </Text>
            </View>
            
        </View>

      </View>

    </View>
  )
}

export default PlanMinCard

const styles = StyleSheet.create({


    planTitle: {
        marginLeft:10,
        fontSize:17,
        fontWeight:500
    },

    wrapper:{
        width:'95%',
        display:'flex',
        flexDirection:'row',
        marginBottom:20

        //borderWidth:1
    },

    infoWrapper:{
        flex:1,
        display:'flex',
        flexDirection:'column',
    },

    thumbnail:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        width:65,
        height:65,
        //borderWidth:1,
        backgroundColor:'#4C9142',
        borderRadius:5
    },

    icon:{
        height:'80%',
        width:100
    },

    infoBeads:{
        //borderWidth:1,
        width:'100%',
        display:'flex',
        flexDirection:'row',
        marginTop:'auto'


    },
    bead:{
        width:6,
        height:6,
        backgroundColor:'#80E900',
        borderRadius:'50%',
        marginRight:5,
        marginLeft:10
    },
    infoBead:{
        flexDirection:'row',
        display:'flex',
        alignItems:'center'
    },
    beadText:{
        marginRight:20,
        fontWeight:300,

        
    }
})