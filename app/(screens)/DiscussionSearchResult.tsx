import { ActivityIndicator, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Searchbar } from 'react-native-paper'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import { LinearGradient } from 'expo-linear-gradient'
import { useSearchParams } from 'expo-router/build/hooks'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PostCard from '@/components/DiscussionBoardComponents/PostCard'

interface DiscussionData {
    DocumentId:string,
    Author:string,
    Content:string,
    CreatedAt:any,
    Title:string,
    ReplyCount:any
  }
  


const DiscussionSearchResult = () => {


    const [discussionData,setDiscussionData] = useState<DiscussionData[]>([])
    const searchParams = useSearchParams()
    const [loadingResult,setLoadingResult] = useState(false)


    const queryString = searchParams.get('searchQuery')

    const preprocessSearch = (text: string): string[] => {
        return text
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .split(/\s+/)
          .filter((word, index, self) => 
            word.length > 1 && self.indexOf(word) === index
          );
      };


    const getReplyCount = async (discussionID:string) => {
        const repliesRef = collection(db, "Discussions", discussionID, "Comments");
        const snapshot = await getDocs(repliesRef);
        return snapshot.size; // Number of replies
    };




    useEffect(()=>{

        const searchDiscussions = async(searchText:string)=>{

            try{
                setLoadingResult(true)

                const keywords = preprocessSearch(searchText).slice(0,10);
                if (keywords.length === 0) return [];



                const q = query(
                    collection(db,'Discussions'),
                    where("Keyword","array-contains-any",keywords)
                )




 
                const discussionDocSnap = await getDocs(q)



                const discussions = await Promise.all(
                    discussionDocSnap.docs.map(async (doc) => {
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
                console.log("Returned Data : ", discussions)

                
                setDiscussionData(discussions)
                setTimeout(()=>{
            
                },5000)
                setLoadingResult(false)



            }catch(err){console.error(err)}
            

        }

        searchDiscussions(queryString as string)


    },[])
  return (


    <SafeAreaView style={{flex:1,borderWidth:0,flexDirection:'column',display:'flex',alignItems:'center'}}>

        <View style={styles.headerContainer}>

            <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10,marginTop:'auto',marginBottom:'auto'}} onPress={()=> router.back()}>

                <Ionicons name="arrow-back" size={30} color="#607D8B" />

            </TouchableOpacity>

            <Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:18,fontWeight:600,color:'#37474F',marginLeft:10}}>
                Search Results For {queryString}
            </Text>






        </View>

        {loadingResult === true ? (

            <View style={{borderWidth:0,flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>

                <ActivityIndicator size={75 }color="#607D8B"  />
            </View>
                 
        ) : (

            <ScrollView style={styles.scrollContainer}  contentContainerStyle={{    flexGrow: 1,
                justifyContent: discussionData.length === 0 ? 'center' : 'flex-start',
                alignItems: 'center',}} >


                    {discussionData && discussionData.length > 0 ? discussionData.map((data,index)=>(


                        <PostCard Author={data.Author} CreatedAt={data.CreatedAt} Content={data.Content} Id={data.DocumentId} key={index} Title={data.Title} ReplyCount={data.ReplyCount}/>



                    )) : (
                    <View style={{marginTop:0,borderWidth:0,display:'flex',flexDirection:'column', alignItems:'center',justifyContent:'center'}}>
                        
                            <MaterialIcons name="search-off" size={75} color="#607D8B" />
                            <Text style={{fontSize:25,fontWeight:600, color:"#37474F"}}>No Result Found</Text>
                            <Text style={{fontSize:16,fontWeight:400,color:"#333333"}}>We Can't Find Any Discussion Matching Your search</Text>
                    </View>
                    )}


            </ScrollView>




        )}


  






    </SafeAreaView>
  )
}

export default DiscussionSearchResult

const styles = StyleSheet.create({
    
    headerContainer:{
        width:'100%',
        height:56,
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
      
        //backgroundColor:'#2E6F40',
        //marginBottom:20,
        backgroundColor:'white'
    },

    scrollContainer:{
        display:'flex',
        width:'98%',
        flexDirection:'column',
        //backgroundColor:'red',
       //flex:1,
        //borderWidth:1,
        paddingTop:10
    }
})