import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import RecordMinCard from '@/components/genComponents/recordMinCard'
import { recordsDat } from '../Datas/records'

import { router } from 'expo-router'
type Record = {
  cropName: string,
  cropId: string,
  status:string,
  datePlanted: string,
}

type RecordData = {
  [key:string]:Record
}




const records = () => {

  const [recordData,setRecordData] = useState<RecordData>({})


  useEffect(()=>{
    setRecordData(recordsDat)
  },[])






  return (
    <SafeAreaView style={styles.mainContainer}>
      


      <View style={styles.tabHeader}>


      </View>

      <ScrollView style={styles.contentContainer}>

      </ScrollView>



      
    </SafeAreaView>
  )
}

export default records

const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
    display:'flex',
    flexDirection:'column',
    borderWidth:1
  },
  contentContainer:{
    borderWidth:1,
    borderColor:'red',
    display:'flex',
    flexDirection:'column',

  },
  tabHeader:{
    width:'100%',
    height:100,
    borderWidth:1,

  },


})