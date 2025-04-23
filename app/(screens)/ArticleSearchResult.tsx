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

interface ArticleData {
    cover:string,
    title:string,
    articleId:string
  }


const ArticleSearchResult = () => {


    const [articleData,setArticleData] = useState<ArticleData[]>([])
    const searchParams = useSearchParams()

    const queryString = searchParams.get('searchQuery')
    const [loadingResult,setLoadingResult] = useState(false)

    const preprocessSearch = (text: string): string[] => {
      return text
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter((word, index, self) => 
          word.length > 1 && self.indexOf(word) === index
        );
    };

    useEffect(()=>{

        const fetchArticles = async()=>{

            try{

                setLoadingResult(true)

                const keywords = preprocessSearch(queryString as string).slice(0,10);

                const q = query(
                    collection(db,'Articles'),
                    where("keywords","array-contains-any",keywords)
                )


       
                const articleDocSnap = await getDocs(q)



                if(articleDocSnap){
                    const rawData = articleDocSnap.docs.map((doc)=>{
                        return{
                            cover:doc.data().cover,
                            title:doc.data().title,
                            articleId:doc.id
                        }
                    })

                    console.log("Fetched Article Data : ", rawData)
                    setArticleData(rawData)

                    setLoadingResult(false)
                }else{
                  setLoadingResult(false)
                }
            }catch(err){console.error(err)}
            

        }

        fetchArticles()
    },[])
  return (


    <SafeAreaView style={{flex:1,borderWidth:0,flexDirection:'column',display:'flex',alignItems:'center'}}>

        <View style={styles.headerContainer}>

            <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10,marginTop:'auto',marginBottom:'auto'}} onPress={()=> router.back()}>

                <Ionicons name="arrow-back" size={30} color="#607D8B" />

            </TouchableOpacity>

            <Text numberOfLines={2} ellipsizeMode="tail" style={{marginLeft:10,fontSize:18,fontWeight:600,color:'#37474F'}} >
                Search Results For {queryString}
            </Text>






        </View>

        {loadingResult === true ? (
              <View style={{borderWidth:0,flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
  
                  <ActivityIndicator size={75 }color="#607D8B"  />
              </View>
        ) : (

          <ScrollView style={styles.scrollContainer}  contentContainerStyle={{alignItems:'center'}}>
            {articleData && articleData.length > 0 ? articleData.map((article,index)=>(


            <TouchableOpacity key={index}
                      style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 10,
                        overflow: 'hidden', // Important to clip children like the rounded corners
                      }}
                      onPress={() => {
                        router.push(`/(screens)/ArticleMainScreen?articleId=${encodeURIComponent(article.articleId)}`);
                      }}
                    >
                      <ImageBackground
                        source={{ uri: article.cover }}
                        resizeMode="cover"
                        style={{
                          flex: 1,
                          display:'flex',
                          flexDirection:'column'
                        }}
                      >
                        {/* Overlay Gradient to improve text readability */}
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.6)']}
                          style={{
                            padding: 10,
                            width: '100%',
                            position: 'absolute',
                            bottom: 0,
                          }}
                        >
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={{
                              color: 'white',
                              fontSize: 20,
                              fontWeight: '600',
                              marginTop:'auto'
                            }}
                          >


                            {article.title}
                          </Text>
                        </LinearGradient>
                      </ImageBackground>
                  </TouchableOpacity>



              )) : (
                <View style={{marginTop:100,borderWidth:0,display:'flex',flexDirection:'column', alignItems:'center',justifyContent:'center'}}>
                  
                  <MaterialIcons name="search-off" size={75} color="#607D8B" />
                  <Text style={{fontSize:25,fontWeight:600, color:"#37474F"}}>No Result Found</Text>
                  <Text style={{fontSize:16,fontWeight:400,color:"#333333"}}>We Can't Find Any Article Matching Yourself</Text>
                </View>
              )}
          </ScrollView>

        )}






    </SafeAreaView>
  )
}

export default ArticleSearchResult

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

        flex:1,
        //borderWidth:1,
        paddingTop:20
    }
})