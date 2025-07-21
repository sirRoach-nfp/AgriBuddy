import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Searchbar } from 'react-native-paper'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import { LinearGradient } from 'expo-linear-gradient'



interface ArticleData {
    cover:string,
    title:string,
    articleId:string
  }


const ArticleHomeScreen = () => {

    const [searchQuery, setSearchQuery] = React.useState('');
    const [articleData,setArticleData] = useState<ArticleData[]>([])





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

        fetchArticles()
    },[])


    const redirectToSearchResult = ()=>{
        const queryString = `?searchQuery=${encodeURIComponent(searchQuery)}`
        console.log("Query string is : ", queryString)
        router.push(`/(screens)/ArticleSearchResult${queryString}` as any)
    }
  return (


    <SafeAreaView style={{flex:1,borderWidth:0,flexDirection:'column',display:'flex',alignItems:'center'}}>

        <View style={styles.headerContainer}>

            <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10,marginTop:'auto',marginBottom:'auto'}} onPress={()=> router.back()}>

                <Ionicons name="arrow-back" size={30} color="black" />

            </TouchableOpacity>

            <Searchbar
                    mode="bar" //dense
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={{
                      borderWidth:0,paddingVertical:0,
                      backgroundColor: '#f5f5f5', // ✅ soft off-white
                      borderRadius: 10,
                 
                      flex: 1,
                      marginLeft:10,
                      marginRight:10,
                      elevation: 0, // removes Android shadow
                    
                    
                    }}
                    inputStyle={{
                        paddingVertical: 0,
                        fontSize: 14,
                        margin: 0,
                        borderWidth:0,

                        

                        
                      }}

                    onSubmitEditing={() => {
                    // You can call your search handler here
                        redirectToSearchResult()
                    }}

 
            />






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

export default ArticleHomeScreen

const styles = StyleSheet.create({
    
    headerContainer:{
        width:'100%',
        paddingVertical:5,
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
        paddingTop:10
    }
})