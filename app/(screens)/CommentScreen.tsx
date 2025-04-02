import { StyleSheet, Text, TouchableOpacity, View,TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feather from '@expo/vector-icons/Feather';
import { useSearchParams } from 'expo-router/build/hooks';
import { ScrollView } from 'react-native-gesture-handler';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { Dialog, MD3Colors, PaperProvider, Portal, ProgressBar } from 'react-native-paper';
import { db } from '../firebaseconfig';
import { useUserContext } from '../Context/UserContext';
const CommentScreen = () => {

  const searchParams = useSearchParams();
  const discussionid = searchParams.get('PostRefId');
  const [loading,setLoading] = useState(false);
  const [showProcess,setShowProcess] = useState(false);
  const {user} = useUserContext();

  const addComment = async(author:string) => {
        console.log("Uploading reply")
    try{
        setLoading(true)
        setShowProcess(true)

        if(comment.length<1){return}


        const newComment = {
            Author:author,
            Content:comment,
            CreatedAt:Timestamp.now()
        }



        await addDoc(collection(db,"Discussions",discussionid as string,"Comments"),newComment)



        setLoading(false)
        console.log("Success")
        


    }catch(err){
        console.error(err)
    }
  }


    const renderProcess = () => (
  
          <Portal>
              <Dialog visible={showProcess} onDismiss={()=>{}}>
  
  
                  <Dialog.Title>
                      Posting Your Comment
                  </Dialog.Title>
  
  
                  {loading ? (
                      <Dialog.Content>
                          <Text>Your comment is being posted. Please wait...</Text>
                      </Dialog.Content>
                  ) : (
                      <Dialog.Content>
                      <Text>Your comment is Posted Successfully!</Text>
                      </Dialog.Content>
                  )}
  
  
  
                  {loading ? (
                      <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                  ) : (
                      <Dialog.Actions>
  
                          <TouchableOpacity onPress={()=>{setShowProcess(false)}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
  
                              <Text style={{color:'white'}}>
                                  Continue
                              </Text>
  
                          </TouchableOpacity>
  
                      </Dialog.Actions>
                  )}
  
  
  
  
  
  
  
  
  
  
              </Dialog>
  
  
  
  
          </Portal>
      )


  const [comment,setComment] = useState("")
  return (

    <PaperProvider>

        {renderProcess()}

    
        <SafeAreaView style={styles.mainWrapper}>


            <View style={styles.headerContainer}>


                <Feather name="x" size={24} color="black" style={{marginLeft:10}} />

                <Text style={stylesHeader.HeaderText}>Add Comment</Text>

                <TouchableOpacity style={stylesHeader.buttonWrapper} onPress={()=>{addComment(user?.Username as string)}}>
                    <Text style={stylesHeader.buttonText}>Post</Text>
                </TouchableOpacity>

            </View>


            <ScrollView style={styles.contentScrollContainer} contentContainerStyle={{alignItems:'center'}}>


                <TextInput onChange={(e)=>setComment(e.nativeEvent.text)} placeholder="Your Comment....." numberOfLines={20} multiline={true} textAlignVertical="top" style={styles.TextInput}></TextInput>
                





            </ScrollView>

        

            
            <Text>{user?.Username}</Text>


        </SafeAreaView>


    </PaperProvider>
  )
}

export default CommentScreen

const styles = StyleSheet.create({
    mainWrapper:{
        //borderWidth:1,
        flex:1,
        color:'red',
        display:'flex',
        flexDirection:'column',
        alignItems:'center'
    },


    contentScrollContainer:{
        width:'97%',
        //borderWidth:1,
        paddingTop:20,
        display:'flex',
        flexDirection:'column'
    },
    headerContainer:{
        width:'100%',
        maxHeight:50,
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        height:50,
        //backgroundColor:'#2E6F40'
    },


    TextInput:{
        width:'95%'
    },


    scrollContainer:{
        width:'95%',
        borderWidth:1
    }
})


const stylesHeader = StyleSheet.create({
    HeaderText:{
        fontSize:17,
        fontWeight:600,
        marginLeft:10,
    },
    buttonWrapper:{
        alignSelf:'flex-start',
        marginRight:20,
        marginLeft:'auto',
        marginTop:'auto',
        marginBottom:'auto'
    },
    buttonText:{
        fontSize:16,
        fontWeight:400,

    }
})