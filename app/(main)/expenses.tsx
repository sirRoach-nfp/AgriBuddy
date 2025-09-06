import { FlatList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { router, useFocusEffect } from 'expo-router'

//components import
import ExpensesReportCard from '@/components/ExpensesComponents/ExpensesReportCard'
import {fetchExpensesController } from '../controllers/ExpenseControllers/fetchExpenses'
import { useUserContext } from '../Context/UserContext'













interface expenseLogStructure{
    date:Date,
    expenseId:string,
    title:string,
    total: number,
    amountItems:number
}



const expenses = () => {
  const {user} = useUserContext()
  const {width} = useWindowDimensions()
  const isSmallScreen = width < 480

  //data 
  const [expenseRecordsLog,setExpenseRecordLog] = useState<expenseLogStructure[]>([])


  const navigateToCreateRecord = () => {

    router.push(`/(screens)/ExpensesRecords`)
  }


    useFocusEffect(
      useCallback(()=> {

        const fetchExpenseRecords = async()=>{
          try{
            const expenseRecords = await fetchExpensesController(user)
            setExpenseRecordLog(expenseRecords)
          }catch(err){

          }
          
        }

        fetchExpenseRecords()
        
        
      },[])
    )


  return (
    <SafeAreaView style={{flex:1,display:'flex',flexDirection:'column'}}>

      

    <View style={styles.headerMainWrapper}>

      <View style={HeaderStyles.innerHeaderWrapper}>
          <Text style={HeaderStyles.headerTextStyles}>
            Expense Tracker
          </Text>

          <Text style={HeaderStyles.subtitleTextStyle}>
            Track and manage your expenses
          </Text>
      </View>

      <TouchableOpacity  onPress={navigateToCreateRecord} style={[ButtonStyles.CreateNewButton,{backgroundColor:'#607D8B'}]} >
          <Text style={ButtonStyles.buttonTextCreate}>Create New Expense Record</Text>
      </TouchableOpacity>

    

    </View>



      <FlatList
        style={{borderWidth:0,width:'100%',paddingHorizontal:5,paddingTop:20}}
        data={expenseRecordsLog}
        keyExtractor={(item) => item.expenseId}
        renderItem={({item})=>(
          <ExpensesReportCard title={item.title} date={item.date} total={item.total} amountItems={item.amountItems} expenseId={item.expenseId}/>

        )}
      >

      </FlatList>



      
     




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
    borderWidth:0,
    alignSelf:'flex-start',
    paddingTop:10,
    paddingHorizontal:5,
    //borderColor:"black",
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
    borderWidth:1,
    //borderColor:'green',
   
    
    gap:10
  }
})

const ButtonStyles = StyleSheet.create({
  CreateNewButton:{
    //borderWidth:1,
    //borderColor:'red',
    padding:10,

    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
    height:50,
    
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