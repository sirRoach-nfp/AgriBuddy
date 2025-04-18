import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

import RecordMinCard from '@/components/genComponents/recordMinCard'
import { recordsDat } from '../Datas/records'
import { Searchbar } from 'react-native-paper';
import Octicons from '@expo/vector-icons/Octicons';

import PostCard from '@/components/DiscussionBoardComponents/PostCard';
import { router, useFocusEffect } from 'expo-router'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig';
type Record = {
  cropName: string,
  cropId: string,
  status:string,
  datePlanted: string,
}

type RecordData = {
  [key:string]:Record
}

interface DiscussionData {
  DocumentId:string,
  Author:string,
  Content:string,
  CreatedAt:any,
  Title:string,
  ReplyCount:any
}


const records = () => {

  const [recordData,setRecordData] = useState<RecordData>({})
  const [discussionData,setDiscussionData] = useState<DiscussionData[]>([])

  const getReplyCount = async (discussionID:string) => {
    const repliesRef = collection(db, "Discussions", discussionID, "Comments");
    const snapshot = await getDocs(repliesRef);
    return snapshot.size; // Number of replies
};


  useFocusEffect(
    useCallback(()=>{

      const fetchDiscussions = async() => {
        try{
  
          const discussionRef = collection(db,'Discussions')
          const snapshot = await getDocs(discussionRef)
  
          const discussions = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const replyCount = await getReplyCount(doc.id); // Await reply count
              return {
                DocumentId: doc.id,
                Author: doc.data().Author,
                Content: doc.data().Content,
                CreatedAt: doc.data().CreatedAt,
                Title: doc.data().Title,
                ReplyCount: replyCount,
              };
            })
          );

          console.log(discussions)
          setDiscussionData(discussions)
        }catch(err){
          console.error(err)
        }
      }
  
  
      fetchDiscussions()



    },[])
  )

  /*
  useEffect(()=>{



    const fetchDiscussions = async() => {
      try{

        const discussionRef = collection(db,'Discussions')
        const snapshot = await getDocs(discussionRef)

        const discussions = snapshot.docs.map(doc => ({
          DocumentId:doc.id,
          Author:doc.data().Author,
          Content:doc.data().Content,
          CreatedAt:doc.data().CreatedAt,
          Title:doc.data().Title,
          ReplyCount:getReplyCount(doc.id)
        }))

        console.log(discussions)
        setDiscussionData(discussions)
      }catch(err){
        console.error(err)
      }
    }


    fetchDiscussions()
    setRecordData(recordsDat)
  },[])

  */
  const [searchQuery,setSearchQuery] = useState("")



  return (
    <SafeAreaView style={styles.mainContainer}>
      


      <View style={styles.tabHeader}>

        <Searchbar
            style={{borderWidth:0,flex:1}}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
          />


        <TouchableOpacity onPress={()=>{router.push('/(screens)/PostScreen')}} style={{alignSelf:'flex-start',marginRight:20,marginLeft:10,borderWidth:0,marginTop:'auto',marginBottom:'auto'}}>

            <Octicons name="diff-added" size={30} color="#828282"  />

        </TouchableOpacity>

        

      </View>

      <ScrollView style={styles.contentContainer} contentContainerStyle={{alignItems:'center'}}>

        {discussionData && discussionData.length >0 &&
          discussionData?.map((data,index)=>(

              <PostCard Author={data.Author} CreatedAt={data.CreatedAt} Content={data.Content} Id={data.DocumentId} key={index} Title={data.Title} ReplyCount={data.ReplyCount}/>
          ))
        
        
        
        }
        

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
    //borderWidth:1,
    alignItems:'center'
  },
  contentContainer:{
    //borderWidth:1,
    borderColor:'red',
    display:'flex',
    flexDirection:'column',
    width:'97%',
    paddingTop:20

  },
  tabHeader:{
    width:'100%',
    maxHeight:100,
    //borderWidth:1,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:30
    

  },


})