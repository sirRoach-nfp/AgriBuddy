import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { faArrowsSpin } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


interface PlanData{
    CropName: string,
    CropId:string,
    CropFamily:string,
    CropRoot:string
  }
  


interface props{
    SessionId?:string,
    Title:String,
    Plan:PlanData[]
}
const PlanMinCard = ({Title,SessionId,Plan}:props) => {



  const checkPlan = ()=> {
    console.log(Plan)
  }
  return (
    <View style={styles.wrapper}>
      
      <TouchableOpacity style={styles.thumbnail} onPress={checkPlan}>
        <FontAwesomeIcon icon={faArrowsSpin} size={40} color='#fff'/>
      </TouchableOpacity>
      

      <View style={styles.infoWrapper}> 
        

        <Text style={styles.planTitle}>{Title}</Text>
        

        <View style={styles.infoBeads}>


         {Plan.map((item,index)=>(
            <View style={styles.infoBead} > 
                <View style={styles.bead}>

                </View>
                <Text style={styles.beadText}>
                    {item.CropName}
                </Text>
            </View>


         ))}




            
            
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
        width:'80%',
        display:'flex',
        flexDirection:'row',
        marginTop:'auto',
        flexWrap:'wrap'


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
        alignItems:'center',
        //borderWidth:1,
       width:'50%'
    },
    beadText:{
        marginRight:20,
        fontWeight:400,
        fontSize:15

        
    }
})