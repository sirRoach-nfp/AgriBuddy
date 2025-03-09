import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
const TaskCard = () => {
  return (
    <View style={styles.container}>
        <View style={styles.topPart}>
            <Text style={styles.header}>Today's Agenda</Text>
            <Text style={styles.seeAll}>See All</Text>
        </View>
        <View style={styles.bottomPart}>
            <View style={styles.taskCont}>
                <FontAwesomeIcon icon={faCircleExclamation} size={16} color='#E9A800' />
                <Text style={styles.taskContext}>Weed the planting area</Text>
            </View>
            <View style={styles.taskCont}>
                <FontAwesomeIcon icon={faCircleExclamation} size={16} color='#E9A800' />
                <Text style={styles.taskContext}>Till the soil</Text>
            </View>
        </View>
    </View>
  )
}

export default TaskCard

const styles = StyleSheet.create({

    container: {
        width: '95%',
        //height:200,
        display:'flex',
        flexDirection:'column',
        //borderWidth: 1,
        backgroundColor:'#FAF3E0',
        borderRadius:5,
        flexShrink:1,
        marginBottom:25,

    },



    topPart: {
        width: '100%',
        flex: 1,
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingTop:15,
        paddingBottom:15,
    },
    
    bottomPart: {
        width: '100%',
        flex: 2,
        //borderWidth:1,
        flexDirection:'column',
        alignItems:'center',
        paddingTop:15,
        paddingBottom:25,
    },



    //task container

    taskCont : {
        width: '90%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        marginBottom:10,
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#68BA7F',
        paddingBottom:5
    },

    //Text 


    header : {
        fontSize:16,
        fontWeight:600,
        color:'#2E6F40',
        marginLeft:10,
    },

    seeAll : {
        fontSize:16,
        fontWeight:400,
        color:'#2E6F40',
        marginLeft:'auto',
        textDecorationLine:'underline',
        marginRight:10,
    },

    taskContext  : {
        color:'#253D2C',
        fontSize:14,
        fontWeight:400,
        letterSpacing:1,
        marginLeft:10,

      

    }





})