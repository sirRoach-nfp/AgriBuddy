import { ActivityIndicator, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

import RecordMinCard from '@/components/genComponents/recordMinCard'
import { recordsDat } from '../Datas/records'
import { Searchbar } from 'react-native-paper';
import Octicons from '@expo/vector-icons/Octicons';

import PostCard from '@/components/DiscussionBoardComponents/PostCard';
import { router, useFocusEffect } from 'expo-router'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig';


// icons
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

//controllers

import { fetchDiscussionsController } from '../controllers/PostControllers/fetchFeed';

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
  ReplyCount:any,
  AuthorName:any,
  Tag:string,
}


const records = () => {

  const [recordData,setRecordData] = useState<RecordData>({})
  const [discussionData,setDiscussionData] = useState<DiscussionData[]>([])
  const [lastDoc,setLastDoc] = useState<any|null>(null)
  const [loadingResult,setLoadingResult] = useState(true)
  const [loadingMore,setLoadingMore] = useState(false);


  const getReplyCount = async (discussionID:string) => {
    const repliesRef = collection(db, "Discussions", discussionID, "Comments");
    const snapshot = await getDocs(repliesRef);
    return snapshot.size; // Number of replies
};



  const [selectedTag,setSelectedTag] = useState<String>("All")


  //initial fetch


  useFocusEffect(
    useCallback(()=> {
      const fetchInitial = async () => {
        setLoadingResult(true);
        const {discussions,lastDoc} = await fetchDiscussionsController(20,null,selectedTag);
        setDiscussionData(discussions);
        setLastDoc(lastDoc);
        setLoadingResult(false);
      };
      fetchInitial();
    },[selectedTag])
  )
  //load more
  const loadMore = async () => {
    if(loadingMore || !lastDoc) return;
    setLoadingMore(true);


    const {discussions,lastDoc:newLastDoc} = await fetchDiscussionsController(20,lastDoc,selectedTag);
    setDiscussionData((prev)=>[...prev,...discussions]);
    setLastDoc(newLastDoc);
    setLoadingMore(false)
  }

  const [searchQuery,setSearchQuery] = useState("")
  const redirectToSearchResult = ()=>{
      const queryString = `?searchQuery=${encodeURIComponent(searchQuery)}`
      console.log("Query string is : ", queryString)
      router.push(`/(screens)/DiscussionSearchResult${queryString}` as any)
  }


  //helpers

  const handleSegmentChange = (value:String) => {
    setSelectedTag(value)
    setDiscussionData([]),
    setLastDoc(null)
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      


      <View style={styles.tabHeader}>

        <Searchbar
              style={{
                backgroundColor: '#f5f5f5', // ✅ soft off-white
                borderRadius: 10,
                borderWidth: 0,
                flex: 1,
                
                elevation: 0, 
                height:50// removes Android shadow
              }}

            inputStyle={{
              alignSelf:'center',
              paddingVertical:0
            }}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}

            onSubmitEditing={() => {
              // You can call your search handler here
                  redirectToSearchResult()
              }}
          />


        <TouchableOpacity onPress={()=>{router.push('/(screens)/PostScreen')}} style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,width:50,height:45,backgroundColor:'#607D8B',marginLeft:10,borderWidth:0,marginTop:'auto',marginBottom:'auto'}}>
            <FontAwesome6 name="add" size={25} color="white" />
            

        </TouchableOpacity>

        

      </View>

      <View style={styles.segmentContainer}>
          <View style={styles.segmentContainer__infoSection}>
            <Ionicons name="people" size={25} color="#607D8B" />
            <Text style={styles.segmentContainer__infoSection__primary}>Community Discussion</Text>
          </View>

          <View style={styles.segmentContainer__buttonSection}>
            
            <TouchableOpacity style={[selectedTag === "All" ? styles.segmentContainer__buttonSection__buttonActive : styles.segmentContainer__buttonSection__buttonDef]}

              onPress={()=>handleSegmentChange("All")}
              
            >
              <Text style={[selectedTag === "All" ? styles.segmentContainer__buttonSection__button__textActive :styles.segmentContainer__buttonSection__button__text]}>All</Text>
            </TouchableOpacity>



            <TouchableOpacity style={[selectedTag === "General" ? styles.segmentContainer__buttonSection__buttonActive : styles.segmentContainer__buttonSection__buttonDef]}

              onPress={()=>handleSegmentChange("General")}
              
            >
              <Text style={[selectedTag === "General" ? styles.segmentContainer__buttonSection__button__textActive :styles.segmentContainer__buttonSection__button__text]}>General</Text>
            </TouchableOpacity>



            <TouchableOpacity style={[selectedTag === "Crops" ? styles.segmentContainer__buttonSection__buttonActive : styles.segmentContainer__buttonSection__buttonDef]}

              onPress={()=>handleSegmentChange("Crops")}
              
            >
              <Text style={[selectedTag === "Crops" ? styles.segmentContainer__buttonSection__button__textActive :styles.segmentContainer__buttonSection__button__text]}>Crops</Text>
            </TouchableOpacity>



            <TouchableOpacity style={[selectedTag === "Help" ? styles.segmentContainer__buttonSection__buttonActive : styles.segmentContainer__buttonSection__buttonDef]}
              onPress={()=>handleSegmentChange("Help")}
            >
              <Text style={[selectedTag === "Help" ? styles.segmentContainer__buttonSection__button__textActive :styles.segmentContainer__buttonSection__button__text]}>Help</Text>
            </TouchableOpacity>


            <TouchableOpacity style={[selectedTag === "Tips" ? styles.segmentContainer__buttonSection__buttonActive : styles.segmentContainer__buttonSection__buttonDef]}
              onPress={()=>handleSegmentChange("Tips")}
            >
              <Text style={[selectedTag === "Tips" ? styles.segmentContainer__buttonSection__button__textActive :styles.segmentContainer__buttonSection__button__text]}>Tips</Text>
            </TouchableOpacity>


          </View>
      </View>



    {loadingResult ? (
          <View style={{borderWidth:0,flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <ActivityIndicator size={75 }color="#607D8B"  />
          </View>) : (

          <FlatList 
            style={{borderWidth:0,width:'100%',paddingHorizontal:10,paddingTop:10}}
            data = {discussionData}
            keyExtractor={(item) => item.DocumentId}
            renderItem={({item})=> (
              <PostCard AuthorName={item.AuthorName} 
                        Author={item.Author} 
                        CreatedAt={item.CreatedAt} 
                        Content={item.Content} 
                        Id={item.DocumentId} 
                        Title={item.Title} 
                        ReplyCount={item.ReplyCount}
                        Tag = {item.Tag}
              />
            )}

            onEndReached={loadMore}
            onEndReachedThreshold={0.7}
            ListFooterComponent={
              loadingMore ?  <ActivityIndicator size="large" color="#607D8B" /> : null
            }
            ListEmptyComponent={
              <Text style={{textAlign: 'center', marginTop: 20, color: '#888'}}>
                No discussions yet. Be the first to post!
              </Text>
            }

          >
          
          </FlatList>
          )}



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
    alignItems:'center',
    backgroundColor:'#F4F5F7'
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
    borderWidth:0,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:30,
    paddingVertical:5,
    paddingHorizontal:10,
    backgroundColor:'white',
    borderBottomWidth:1,
    borderColor:'#E2E8F0'
  },


  segmentContainer:{
    width:'100%',
    paddingVertical:10,
    paddingHorizontal:10,
    display:'flex',
    flexDirection:'column',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth:1,
    backgroundColor:'#ffffff',
    
  },

  segmentContainer__infoSection:{
    width:'100%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    gap:10
  },

  segmentContainer__infoSection__primary:{
    fontSize:17,
    fontWeight:500,
    color:'#37474F'
  },

  segmentContainer__buttonSection:{
    width:'100%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:10,
    flexWrap:'wrap',
    gap:5,
    borderWidth:0,
  },

  segmentContainer__buttonSection__buttonDef:{
    borderWidth:1,
    borderRadius:5,
    paddingVertical:10,
    paddingHorizontal:15,
    borderColor:"#E2E8F0"
  },

    segmentContainer__buttonSection__buttonActive:{
    borderWidth:1,
    borderRadius:5,
    paddingVertical:10,
    paddingHorizontal:15,
    backgroundColor:'#607D8B',
    borderColor:"#607D8B"
  },

  segmentContainer__buttonSection__button__text:{
    fontSize:14,
    fontWeight:500,
    color:'#37474F'
  },

  segmentContainer__buttonSection__button__textActive:{
    fontSize:14,
    fontWeight:500,
    color:'#ffffff'
  }

})