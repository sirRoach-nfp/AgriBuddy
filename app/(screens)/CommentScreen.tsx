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
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLanguage } from '../Context/LanguageContex';




const CommentScreen = () => {
  

  const {language} = useLanguage()
  const searchParams = useSearchParams();
  const discussionid = searchParams.get('PostRefId');
  const [loading,setLoading] = useState(false);
  const [showProcess,setShowProcess] = useState(false);
  const {user} = useUserContext();
  const [showError,setShowError] = useState<boolean>(false)
  const [showInternetError,setShowInternetError] = useState(false)


  const [error, setError] = useState(false);



  const addComment = async(author:string) => {
        console.log("Uploading reply")
    try{
        setLoading(true)
        setShowProcess(true)

        if(comment.length<1){return}

       const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("timeout")), 20000)
        );

        const newComment = {
            Author:author,
            Content:comment,
            CreatedAt:Timestamp.now()
        }



        
        await Promise.race([
            addDoc(collection(db,"Discussions",discussionid as string,"Comments"),newComment),
            timeoutPromise
        ])








        setLoading(false)
        //router.back()
        console.log("Success")
        


    }catch(err:any){
        setError(true)
        if(err.message === "timeout") {
            setShowInternetError(true)
        } else {
            setShowError(true)
        }
        console.error(err)
    }
  }

    const renderProcess = () => (
        !error && (
            <Portal>
                <Dialog visible={showProcess} onDismiss={()=>{}}>

                    <Dialog.Title>
                        <Text>
                            {language === "en" ? "Posting Your Comment" : "Ipino-post ang Iyong Komento"}
                        </Text>
                    </Dialog.Title>

                    {loading ? (
                        <Dialog.Content>
                            <Text>
                                {language === "en" 
                                ? "Your comment is being posted. Please wait..." 
                                : "Ipinapadala ang iyong komento. Paki-hintay..."}
                            </Text>
                        </Dialog.Content>
                    ) : (
                        <Dialog.Content>
                            <Text>
                                {language === "en" 
                                ? "Your comment is Posted Successfully!" 
                                : "Matagumpay na naipost ang iyong komento!"}
                            </Text>
                        </Dialog.Content>
                    )}

                    {loading ? (
                        <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                    ) : (
                        <Dialog.Actions>

                            <TouchableOpacity onPress={()=>{router.back()}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                                <Text style={{color:'white'}}>
                                    {language === "en" ? "Continue" : "Magpatuloy"}
                                </Text>

                            </TouchableOpacity>

                        </Dialog.Actions>
                    )}

                </Dialog>
            </Portal>
        )
        
    )

    const renderError = ()=>(

        <Portal>
                <Dialog visible={showError} onDismiss={()=>setShowError(false)}>
        
                    <Dialog.Icon  icon="alert-circle" size={60} color='#ef9a9a'/>
        
                    <Dialog.Title>
                        <Text style={{color:'#37474F'}}>
                            {language === "en" ? "Something Went Wrong" : "May Nagkaproblema"}
                        </Text>
                        
                    </Dialog.Title>
                    
                    <Dialog.Content>
                        <Text style={{color:'#475569'}}>
                        {language === "en" ? "An unexpected error occured. Please try again later" : "Nagkaroon ng hindi inaasahang error. Pakisubukang muli mamaya."}
                        
                        </Text>
                    </Dialog.Content>
        
        
        
                    <Dialog.Actions>
        
                    <TouchableOpacity onPress={()=> setShowError(false)} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
        
                        <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                            OK
                        </Text>
        
                    </TouchableOpacity>
        
                    </Dialog.Actions>
        
                </Dialog>
        
            </Portal>

    )

    const renderSlowInternet = () => (
        <Portal>
            <Dialog visible={showInternetError} onDismiss={()=>setShowInternetError(false)}>

                <Dialog.Icon  icon="alert-circle" size={60} color='#ef9a9a'/>

                <Dialog.Title>
                    <Text style={{color:'#37474F'}}>
                        {language === "en" ? "Slow Connection" : "Mabagal na Koneksyon"}
                    </Text>
                </Dialog.Title>
                
                <Dialog.Content>
                    <Text style={{color:'#475569'}}>
                        {language === "en" ? "Connection seems slow. Please try again." : "Mabagal ang koneksyon. Pakisubukang muli."}
                    </Text>
                </Dialog.Content>

                <Dialog.Actions>
                    <TouchableOpacity onPress={()=> setShowInternetError(false)} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
                        <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                            {language === "en" ? "OK" : "Sige"}
                        </Text>
                    </TouchableOpacity>
                </Dialog.Actions>

            </Dialog>
        </Portal>
    )


  const [comment,setComment] = useState("")



  // input validator
  const isValid = comment.trim().length <= 1000 && comment.trim().length >= 10;


  return (

    <PaperProvider>

        {renderProcess()}
        {renderError()}
        {renderSlowInternet()}
    
        <SafeAreaView style={styles.mainWrapper}>


            <View style={styles.headerContainer}>


                <TouchableOpacity onPress={()=> router.back()} style={{marginLeft:10,borderWidth:0,padding:3}}>
                    <Feather name="x" size={24} color="black"  />
                </TouchableOpacity>

                <Text style={stylesHeader.HeaderText}>
                {language === "en" ? "Add Comment" : "Mag-iwan ng Komento"}
                </Text>

                <TouchableOpacity disabled={!isValid} style={[!isValid ? styles.postButton__disabled : styles.postButton__active]} onPress={()=>{addComment(user?.UserId as string)}}>
                   <FontAwesome name="send" size={15} color="#ECF4F7" />
                   <Text style={stylesHeader.buttonText}>Post</Text>
                </TouchableOpacity>

            </View>


            <ScrollView style={styles.contentScrollContainer} contentContainerStyle={{alignItems:'center'}}>

                
                <View style={{width:'95%',
                    borderWidth:1,
                    height:350,
                    display:'flex',
                    flexDirection:'column',
                    borderRadius:10,
                    backgroundColor:'white',
                    borderColor:'#E2E8F0'
                    }}>
                    <TextInput maxLength={1000} onChange={(e)=>setComment(e.nativeEvent.text)} placeholder="Your Comment....." numberOfLines={20} multiline={true} textAlignVertical="top" style={styles.TextInput}></TextInput>
                    
                    <View style={{width:'100%',
                        borderTopWidth:1,
                        borderColor:'#E2E8F0',
                        paddingVertical:15,
                        display:'flex',
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent:'flex-end',
                        paddingHorizontal:10,
                        backgroundColor:'#F9FAFC',
                        borderBottomEndRadius:10,
                        borderBottomStartRadius:10,
                        }}>
                        <Text style={{color:'#6B7280'}}>{comment.length}/1000</Text>
                    </View>

                </View>


            <View style={noteStyles.noteWrapper}>
                <Text style={noteStyles.header}>
                    {language === "en" ? "Community Guidelines" : "Patakaran ng Komunidad"}
                </Text>

                <View style={noteStyles.textWrapper}>
                    <Text style={noteStyles.textWrapper__bullet}>•</Text>
                    <Text style={noteStyles.textWrapper__text}>
                        {language === "en" 
                            ? "Comment should be a minimum of 10 characters" 
                            : "Ang komento ay dapat hindi bababa sa 10 karakter"}
                    </Text>
                </View>

                <View style={noteStyles.textWrapper}>
                    <Text style={noteStyles.textWrapper__bullet}>•</Text>
                    <Text style={noteStyles.textWrapper__text}>
                        {language === "en" 
                            ? "Be respectful and constructive with your comments" 
                            : "Maging magalang at kapaki-pakinabang sa iyong mga komento"}
                    </Text>
                </View>

                <View style={noteStyles.textWrapper}>
                    <Text style={noteStyles.textWrapper__bullet}>•</Text>
                    <Text style={noteStyles.textWrapper__text}>
                        {language === "en" 
                            ? "Share relevant farming experiences and knowledge" 
                            : "Ibahagi ang mga kaugnay na karanasan at kaalaman sa pagsasaka"}
                    </Text>
                </View>

                <View style={noteStyles.textWrapper}>
                    <Text style={noteStyles.textWrapper__bullet}>•</Text>
                    <Text style={noteStyles.textWrapper__text}>
                        {language === "en" 
                            ? "Avoid spam, offensive language, or inappropriate content" 
                            : "Iwasan ang spam, bastos na salita, o hindi angkop na nilalaman"}
                    </Text>
                </View>
            </View>
                
                
                





            </ScrollView>

        

            <View style={{borderColor:'#E2E8F0',borderRadius:20,borderWidth:1,marginVertical:5,paddingVertical:7,paddingHorizontal:10,backgroundColor:'#ffffff'}}>
                <Text style={{color: "#374151"}}>
                {language === "en" 
                    ? `Commenting as ${user?.Username}` 
                    : `Magko-komento bilang ${user?.Username}`}
                </Text>
            </View>
            


        </SafeAreaView>


    </PaperProvider>
  )
}

export default CommentScreen

const styles = StyleSheet.create({

    postButton__disabled:{


        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
        paddingHorizontal:30,
        borderWidth:0,
        borderRadius:20,
        marginLeft:'auto',
        marginRight:10,
        gap:10,
        backgroundColor:'#AFBDC8'


    },



    postButton__active:{



        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
        paddingHorizontal:30,
        borderWidth:0,
        borderRadius:20,
        marginLeft:'auto',
        marginRight:10,
        gap:10,
        backgroundColor:'#607D8B'

    },


    mainWrapper:{
        //borderWidth:1,
        flex:1,
        color:'red',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'#F4F5F7'
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
        borderColor:'#E2E8F0',
        borderBottomWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:15,
     
        backgroundColor:'#ffffff'
    },


    TextInput:{
        width:'100%',
        borderWidth:0,
        flex:1,
        fontSize:16,
        padding:15,
        height:'100%'
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
        fontSize:15,
        fontWeight:500,
        color:'#ECF4F7'

    }
})

const noteStyles = StyleSheet.create({
  noteWrapper:{
    width:'95%',
    padding:15,
    backgroundColor:'#EFF6FF',
    borderRadius:5,
    borderColor:'#E2E8F0',
    borderWidth:1,
    marginTop:10,
    marginBottom:35,
  },

  header:{
    fontSize:17,
    fontWeight:600,
    color:'#3A4765',
    marginBottom:20,
  },

  textWrapper:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    gap:5,
    borderWidth:0,
    marginBottom:5,
  },

  textWrapper__bullet:{
    fontSize: 18,
    fontWeight:700,
    color:'#3A4765',
  },

  textWrapper__text:{
    fontSize:16,
    fontWeight:400,
    color:'#3A4765',
  }


})