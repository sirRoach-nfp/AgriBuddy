import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { router } from 'expo-router'

//components import
import ExpensesReportCard from '@/components/ExpensesComponents/ExpensesReportCard'
const expenses = () => {

  const {width} = useWindowDimensions()
  const isSmallScreen = width < 480




  const navigateToCreateRecord = () => {

    router.push(`/(screens)/ExpensesRecords`)
  }


  return (
    <SafeAreaView style={{flex:1,display:'flex',flexDirection:'column'}}>

      



      <ScrollView style={styles.mainContentWrapper}>


        <View style={styles.headerMainWrapper}>

          <View style={HeaderStyles.innerHeaderWrapper}>
              <Text style={HeaderStyles.headerTextStyles}>
                Expense Tracker
              </Text>

              <Text style={HeaderStyles.subtitleTextStyle}>
                Track and manage your expenses
              </Text>
          </View>

          <View style={[ControllerWrapper.controllerWrapper,{flexDirection:isSmallScreen?'column': 'row'}]}>

            <TouchableOpacity  onPress={navigateToCreateRecord} style={[ButtonStyles.CreateNewButton,{backgroundColor:'#607D8B'}]} >
              <Text style={ButtonStyles.buttonTextCreate}>Create New Expense Record</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[ButtonStyles.CreateNewButton,{borderWidth:2,borderColor:'#607D8B'}]}>
              <Text style={ButtonStyles.buttonTextAnalytics}>View Analytics</Text>
            </TouchableOpacity>
            
          </View>

        

        </View>



        <ExpensesReportCard/>
      </ScrollView>




    </SafeAreaView>
  )
}

export default expenses

const styles = StyleSheet.create({
  mainContentWrapper:{
    flex:1,
    borderWidth:0,
    borderColor:'red',
    display:'flex',
    flexDirection:'column',
    paddingTop:10,
    paddingHorizontal:10
  },

  headerMainWrapper:{
    width:'100%',
    display:'flex',
    flexDirection:'column',
    alignContent:'flex-start',
    //borderWidth:1,
    //borderColor:"black",
    marginBottom:20
  }



})


const HeaderStyles = StyleSheet.create({

  innerHeaderWrapper:{
    width:'100%',
    display:'flex',
    flexDirection:'column',
    //borderWidth:1,
    //borderColor:'green',
    alignContent:'flex-start',
    marginBottom:20
  },

  headerTextContainer:{
    flex:1,
    backgroundColor:'blue',
    display:'flex',
    flexDirection:'column',

  },

  buttonsContainer:{
    flex:1,
    backgroundColor:'yellow'
  },

  headerTextStyles:{
    //fontFamily:'Roboto',
     fontFamily:'ui-sans-serif',
    fontSize:27,
    fontWeight:700,
    color:'#37474F',
    letterSpacing:.5,
    lineHeight:32,
  },

  subtitleTextStyle:{
    fontFamily:'ui-sans-serif',
    fontSize:16,
    fontWeight:400,
    color:'#94A3B8',
    lineHeight:20
  }
})


const ControllerWrapper = StyleSheet.create({
  controllerWrapper:{
    width:'100%',
    display:'flex',
    //flexDirection:'row',
    //borderWidth:1,
    //borderColor:'green',
    alignContent:'flex-start',
    gap:10
  }
})

const ButtonStyles = StyleSheet.create({
  CreateNewButton:{
    //borderWidth:1,
    //borderColor:'red',
    padding:10,
    flex:1,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
    
  },

  buttonTextCreate:{
    fontSize:16,
    fontWeight:600,
    fontFamily:'ui-sans-serif',
    color:'white',
    
  },

  buttonTextAnalytics:{
    fontSize:16,
    fontWeight:600,
    fontFamily:'ui-sans-serif',
    color:'#607D8B'
  }
})