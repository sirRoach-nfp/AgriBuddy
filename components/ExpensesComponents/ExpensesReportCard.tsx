import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'


//icon imports
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {router} from 'expo-router'

const ExpensesReportCard = () => {


    const navigateToDetailedScreen = () => {

    router.push('/(screens)/ExpandedExpenseReport')
    }



  return (
    <TouchableOpacity style={styles.mainWrapper} onPress={navigateToDetailedScreen}>
      <View style={styles.highlight}>
      </View>

      <View style={styles.infoWrapper}>
        <Text style={textStyle.titleText}>Title Placeholder</Text>

        <View style={styles.subInfoInnerWrapper}>
            <AntDesign name="calendar" size={20} color="#607D8B" />
            <Text style={textStyle.subText}>Date Placeholder</Text>
        </View>
        <View style={styles.subInfoInnerWrapper}>
            <Entypo name="location-pin" size={20} color="#607D8B" />
            <Text  style={textStyle.subText}>Plot placeholder</Text>
        </View>
        <View style={styles.subInfoInnerWrapper}>
            <Feather name="package" size={20} color="#607D8B" />
            <Text  style={textStyle.subText}>Amount placeholder</Text>
        </View>

        <View style={styles.priceTotalInnerWrapper}>
            <FontAwesome6 name="peso-sign" size={25} color="#607D8B" />

            <Text style={textStyle.totalText}>
                20000
            </Text>
            
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ExpensesReportCard

const styles = StyleSheet.create({

    mainWrapper:{
        width:'100%',
        minHeight:150,
        backgroundColor:'#FFFFFF',
        display:'flex',
        flexDirection:'row',
        //alignItems:'center',
        alignContent:'flex-start',
        //gap:10
        
    },

    highlight:{
        height:'100%',
        backgroundColor:'#607D8B',
        borderTopStartRadius:15,
        borderBottomStartRadius:15,
        width:5
    },

    infoWrapper:{
        flex:1,
        display:'flex',
        flexDirection:'column',
        //borderColor:'#4B5563',
        //borderWidth:1,
        paddingVertical:5,
        paddingLeft:10,
        //borderTopWidth:1,
        //borderBottomWidth:1,
        elevation:.5
    },

    subInfoInnerWrapper:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        //justifyContent:'space-between',
        marginBottom:5,
        //borderColor:'red',
        //borderWidth:1,
        gap:3
    },

    priceTotalInnerWrapper:{
        width:'100%',
        //borderWidth:1,
        //borderColor:'red',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        marginVertical:5,
        justifyContent:'flex-end',
        paddingRight:15,
        gap:10,
    },




})


const textStyle = StyleSheet.create({
    titleText:{
        fontSize:18,
        fontWeight:700,
        fontFamily:'ui-sans-serif',
        marginBottom:5,
        color:'#37474F'
    },
    subText:{
        color:'#64748B',
        fontSize:15,
        fontFamily:'ui-sans-serif',
        fontWeight:600
    },
    totalText:{
        fontSize:17,
        fontWeight:600,
        color:'#4B5563',
        fontFamily:'ui-sans-serif',
    }

})