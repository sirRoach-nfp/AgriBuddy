import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Searchbar } from 'react-native-paper'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import { LinearGradient } from 'expo-linear-gradient'
import { useSearchParams } from 'expo-router/build/hooks'



interface ArticleData {
    cover:string,
    title:string,
    articleId:string
  }


const ArticleSearchResult = () => {


    const [articleData,setArticleData] = useState<ArticleData[]>([])
    const searchParams = useSearchParams()

    const queryString = searchParams.get('searchQuery')




    useEffect(()=>{

        const fetchArticles = async()=>{

            try{

                const articleDocRef = collection(db,'Articles')
                const articleDocSnap = await getDocs(articleDocRef)



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
                }
            }catch(err){console.error(err)}
            

        }

        //fetchArticles()
    },[])
  return (


    <SafeAreaView style={{flex:1,borderWidth:1,flexDirection:'column',display:'flex',alignItems:'center'}}>

        <View style={styles.headerContainer}>

            <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10,marginTop:'auto',marginBottom:'auto'}} onPress={()=> router.back()}>

                <Ionicons name="arrow-back" size={30} color="black" />

            </TouchableOpacity>

            <Text>
                Search Results For {queryString}
            </Text>






        </View>

        <ScrollView style={styles.scrollContainer}  contentContainerStyle={{alignItems:'center'}}>
            {articleData && articleData.length > 0 && articleData.map((article,index)=>(


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



            ))}
        </ScrollView>




    </SafeAreaView>
  )
}

export default ArticleSearchResult

const styles = StyleSheet.create({
    
    headerContainer:{
        width:'100%',
        height:56,
        borderWidth:1,
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
        paddingTop:10
    }
})