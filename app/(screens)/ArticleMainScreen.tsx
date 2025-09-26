import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';



interface contentType  {
    content:string,
    header:string,
}

interface articleType{
    contents:contentType[],
    cover:string,
    title:string,
    CreatedAt:string

}
const ArticleMainScreen = () => {


    const formatDate = (createdAt:any) => {
        if (!createdAt || !createdAt.seconds) return "N/A"; // Handle missing data
        
        const date = new Date(createdAt.seconds * 1000); // Convert Firestore timestamp to JS Date
        return date.toLocaleDateString("en-US", { month: "long", day: "numeric" }); // Format as "Month Day"
        };



    const searchParams = useSearchParams();

    const articleId = searchParams.get('articleId')

    const [articleData,setArticleData] = useState<articleType>()

 useEffect(()=>{
    const fetchArticleData = async()=>{

        try{
            const articleDocRef = doc(db,'Articles',articleId as string)
            const articleDocSnap = await getDoc(articleDocRef)

            if(articleDocSnap.exists()){

                setArticleData(articleDocSnap.data() as articleType)
            }
        }catch(err){console.error(err)}
        
    }

    fetchArticleData()
 },[articleId])


 useEffect(()=>{
    console.log("Article data loaded : ", articleData)
 },[articleData])
  return (

    <SafeAreaView style={styles.mainWrapper}>

        <View style={styles.headerWrapper}>

                <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10,borderWidth:0,marginVertical:'auto'}} onPress={()=> router.back()}>

                    <Ionicons name="arrow-back" size={30} color="black" />

                </TouchableOpacity>

        </View>


        <ScrollView style={styles.scrollContentWrapper}>

     

            <Image style={{ width:'100%',height:250,borderRadius:20,borderWidth:0, }} source={{ uri:articleData?.cover }} resizeMode="cover" />

            <View style={styles.articleInfoWrapper}>

                <Text style={styles.dateText}>Posted on {formatDate(articleData?.CreatedAt)}</Text>
                <Text style={styles.titleMain}>{articleData?.title}</Text>

            </View>




            {articleData?.contents && articleData.contents.length > 0 && articleData.contents.map((content,index)=>(


                <View style={stylesContent.contentMainWrapper} key={index}>
                    <View style={[stylesContent.headerWrapper,content?.header.length <= 0 && {display:'none'}]}>
                        <Text style={stylesContent.headerText}>{content?.header}</Text>
                    </View>

                    <View style={stylesContent.contextWrapper}>
                        <Text style={stylesContent.contentText}>
                            {content.content}
                        </Text>
                    </View>
                </View>


            ))}






        </ScrollView>


    </SafeAreaView>
  )
}

export default ArticleMainScreen

const styles = StyleSheet.create({
    mainWrapper:{
        flex:1,
        width:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        //borderWidth:1,
    },

    headerWrapper:{
        width:'100%',
        //height:50,
        borderBottomWidth:1,
        marginBottom:10,
        display:'flex',
        flexDirection:'row',
        borderColor:'#e2e8f0',
        paddingVertical:10
        //alignItems:'center'
        //marginBottom:30
    },

    scrollContentWrapper:{
        width:'95%',
        flex:1,
        //borderWidth:1,
        borderColor:"red"
    },
    articleInfoWrapper:{
        width:'100%',
        borderWidth:1,
        borderColor:'#e2e8f0',
        display:'flex',
        flexDirection:'column',
        marginVertical:20,
        flexWrap:'wrap',
        padding:10,
        borderRadius:5,
        backgroundColor:'#ffffff',
        
        //gap:15
    },
    titleMain:{
        fontSize:25,
        fontWeight:700,
        width: '100%', 
        flexShrink: 1,
        
    },
    dateText:{
        fontSize:16,
        fontWeight:500
        
    }
})

const stylesContent = StyleSheet.create({
    contentMainWrapper:{
        width:'100%',

        padding:10,
        marginBottom:10,
        borderWidth:1,
        borderColor:'#e2e8f0',
        borderRadius:10,
    },
    headerWrapper:{
        width:'100%',
        paddingVertical:5,
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        //borderWidth:1,
        marginBottom:10,
        borderBottomWidth:1,
        borderColor:'#e2e8f0',

    },

    contextWrapper:{
        width:'100%',
        paddingVertical:5,
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        //borderWidth:1,


    },
    headerText:{
        fontSize:20,
        fontWeight:600
    },
    contentText:{
        fontSize:17,
        textAlign:'left',
        letterSpacing:.5,
        
    }
})