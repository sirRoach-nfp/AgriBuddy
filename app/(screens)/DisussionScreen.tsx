import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { Avatar, Dialog, MD3Colors, PaperProvider, Portal, ProgressBar } from 'react-native-paper';
import { useSearchParams } from 'expo-router/build/hooks';
import { arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import {router, useFocusEffect} from 'expo-router';
import { Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useUserContext } from '../Context/UserContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';



//import ImageViewing from "react-native-image-viewing";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
interface DiscussionData {
    Author:string,
    Title:string,
    Content:string,
    ImageSnapshots:string[],
    CreatedAt:any
}


const getAuthorInitials = (name:string) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    return words.length > 1
      ? words[0][0] + words[1][0] // First letter of first and last name
      : words[0][0]; // If only one word, return the first letter
  };



const formatDate = (createdAt:any) => {
if (!createdAt || !createdAt.seconds) return "N/A"; // Handle missing data

const date = new Date(createdAt.seconds * 1000); // Convert Firestore timestamp to JS Date
return date.toLocaleDateString("en-US", { month: "long", day: "numeric" }); // Format as "Month Day"
};





const DisussionScreen = () => {

  const navigateToComment = (RefId:string) => {

    const queryString = `?PostRefId=${encodeURIComponent(RefId)}`
    router.push(`/(screens)/CommentScreen${queryString}` as any)
    
  }


  const [discussionData,setDiscussionData] = useState<DiscussionData>()
  const searchParams = useSearchParams();
  const discussionid = searchParams.get('PostRefId');
  const [comments,setComments] = useState<{id:string,Author:string,Content:string,CreatedAt:any}[]>([])

  
  const {user} = useUserContext();

  const [loadingData,setLoadingData] = useState(false)
  const [showDeleteProcess,setShowDeleteProcess] = useState(false)
  const [showDeleteConfirmation,setShowDeleteConfirmation] = useState(false)
  const [loadingDelete,setLoadingDelete] = useState(false)



  const [showDeletePostConfirmation,setShowDeletePostConfirmation] = useState(false)
  const [showDeletePostProcess,setShowDeletePostProcess] = useState(false)
  const [deletePostLoading,setDeletePostLoading] = useState(false)


  const [selectedCommentIndex,setSelectedCommentIndex] = useState<number>(-1)
  const [selectedCommentId,setSelectedCommentId] = useState<string>("")

  const[visibleImageView,setVisibleImageView] = useState(false)
  const [selectedImageIndex,setSelectedImageIndex] = useState(0)
  useEffect(()=>{

    const fetchDiscussionData = async()=>{
        setLoadingData(true)
        console.log("Document id is : ", discussionid)

        try{
            const docRef = doc(db,'Discussions',discussionid as string);
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                console.log(docSnap.data())
                setDiscussionData(docSnap.data() as DiscussionData)
            }else{
                console.log("Document doesn't exist")
            }


            //fetch replies


            const repliesRef = collection(db,'Discussions',discussionid as string,'Comments')
            const repliesSnap = await getDocs(repliesRef)

            const replies = repliesSnap.docs.map(doc => ({
                id: doc.id, // Reply document ID
                CreatedAt : doc.data().CreatedAt || 0,
                Author: doc.data().Author || "",
                Content: doc.data().Content || "",
            }));
            
            setComments(replies)
            console.log("Fetched Replies:", replies);

           


            setLoadingData(false)
        }catch(err){
            console.log(err)
        }

    }

    fetchDiscussionData()
    
  },[discussionid])



  useFocusEffect(
    useCallback(() => {
      


        const reFetchReplies = async()=> {

            console.log("Refetching replies (triggered by comment")
            const repliesRef = collection(db,'Discussions',discussionid as string,'Comments')
            const repliesSnap = await getDocs(repliesRef)

            const replies = repliesSnap.docs.map(doc => ({
                id: doc.id, // Reply document ID
                CreatedAt : doc.data().CreatedAt || 0,
                Author: doc.data().Author || "",
                Content: doc.data().Content || "",
            }));
            
            setComments(replies)
            console.log("ReFetched Replies:", replies);

        }
        reFetchReplies()
      // Fetch data or refresh state here
    }, [])
  );


  const deleteComment = async(discussionId:string,commentId:string,index:number) => {
    
    setLoadingDelete(true)
    setShowDeleteConfirmation(false)
    setShowDeleteProcess(true)

    try{

        console.log("passed index :",index)
        
        const replyRef = doc(db,'Discussions',discussionId,'Comments',commentId)
        await deleteDoc(replyRef)
        

        setComments(prev => prev.filter((_, index) => index !== 0));


        console.log(comments)
        setLoadingDelete(false)
        setSelectedCommentIndex(-1)
        setSelectedCommentId("")
     
        
    }catch(err){console.error(err)}
  }




  const renderProcess = () => (
    
            <Portal>
                <Dialog visible={showDeleteProcess} onDismiss={()=>{}}>
    
    
                    <Dialog.Title>
                        Deleting Your Comment
                    </Dialog.Title>
    
    
                    {loadingDelete ? (
                        <Dialog.Content>
                            <Text>Your comment is being deleted Please wait...</Text>
                        </Dialog.Content>
                    ) : (
                        <Dialog.Content>
                        <Text>Your comment is deleted Successfully!</Text>
                        </Dialog.Content>
                    )}
    
    
    
                    {loadingDelete ? (
                        <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                    ) : (
                        <Dialog.Actions>
    
                            <TouchableOpacity onPress={()=>{setShowDeleteProcess(false)}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
    
                                <Text style={{color:'white'}}>
                                    Continue
                                </Text>
    
                            </TouchableOpacity>
    
                        </Dialog.Actions>
                    )}
    

                </Dialog>
    
    
    
    
            </Portal>
    )



    const renderDeleteConfirmation = (discussionid:string,commentId:string,selectedIndex:number) => (

        <Portal>

            <Dialog visible={showDeleteConfirmation} onDismiss={()=>{setShowDeleteConfirmation(false)}}>


                <Dialog.Title>
                    Are you sure you want to delete this comment?
                </Dialog.Title>


                <Dialog.Content>
                    <Text>
                        This action cannot be undone
                    </Text>
                </Dialog.Content>


                <Dialog.Actions>
                    <TouchableOpacity onPress={()=>{deleteComment(discussionid as string,commentId as string,selectedIndex)}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
        
                        <Text style={{color:'white'}}>
                            Continue
                        </Text>

                    </TouchableOpacity>
                </Dialog.Actions>

            </Dialog>
        </Portal>
    )


    const renderProcessDeletePost = () => (
    
        <Portal>
            <Dialog visible={showDeletePostProcess} onDismiss={()=>{}}>


                <Dialog.Title>
                    Deleting Your Post
                </Dialog.Title>


                {deletePostLoading ? (
                    <Dialog.Content>
                        <Text>Your Post is being deleted Please wait...</Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                    <Text>Your Post is deleted Successfully!</Text>
                    </Dialog.Content>
                )}



                {deletePostLoading ? (
                    <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                ) : (
                    <Dialog.Actions>

                        <TouchableOpacity onPress={()=>{router.push('/(main)/records')}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                            <Text style={{color:'white'}}>
                                Continue
                            </Text>

                        </TouchableOpacity>

                    </Dialog.Actions>
                )}


            </Dialog>




        </Portal>
    )


    const renderDeletePostConfirmation = (discussionid:string,discussionRefId:string) => (

        <Portal>

            <Dialog visible={showDeletePostConfirmation} onDismiss={()=>{setShowDeletePostConfirmation(false)}}>


                <Dialog.Title>
                    Are you sure you want to delete this Post?
                </Dialog.Title>


                <Dialog.Content>
                    <Text>
                        This action cannot be undone
                    </Text>
                </Dialog.Content>


                <Dialog.Actions>
                    <TouchableOpacity onPress={()=>{setShowDeletePostConfirmation(false); deleteDiscussion(discussionid,discussionRefId)}} style={{backgroundColor:'red',paddingVertical:5,paddingHorizontal:10,borderRadius:5,elevation:1}} >
        
                        <Text style={{color:'white'}}>
                            Continue
                        </Text>

                    </TouchableOpacity>
                </Dialog.Actions>

            </Dialog>
        </Portal>
    )


    const deleteDiscussion = async (discussionId: string, discussionRecordRefId: string) => {
        
        setDeletePostLoading(true)
        setShowDeletePostProcess(true)

        try {
            console.log("Passed data: discussionId > ",discussionId, "<> discussionRecordRefId > ", discussionRecordRefId)



            const discussionRef = doc(db, "Discussions", discussionId);
    
            // Step 1: Delete all replies from the subcollection
            const repliesRef = collection(discussionRef, "Comments");
            const repliesSnapshot = await getDocs(repliesRef);
    
            const deleteRepliesPromises = repliesSnapshot.docs.map((reply) =>
                deleteDoc(doc(repliesRef, reply.id))
            );
    
            await Promise.all(deleteRepliesPromises);
            console.log("All replies deleted successfully");
    
            // Step 2: Delete the discussion document
            await deleteDoc(discussionRef);
            console.log("Discussion deleted successfully");



    
            // Step 3: Remove discussion reference from user's DiscussionRecords


            const discussionRecordRef = doc(db,'DiscussionRecords',user?.DiscussionRecordRefId as string)
            const discussionRecorSnap = await getDoc(discussionRecordRef)


            if(discussionRecorSnap.exists()){

                let recordsArray = discussionRecorSnap.data().Discussions || []
                
                console.log("Discussion Records Array before remove : ", recordsArray)


                const discussionRecordIndex = recordsArray.findIndex((discussion:any)=>discussion.discussionId === discussionId);
                console.log("Index of discussion record to remove : ", discussionRecordIndex)

                if(discussionRecordIndex !== -1){
                    const updatedRecord = [...recordsArray.slice(0, discussionRecordIndex), ...recordsArray.slice(discussionRecordIndex + 1)];
                    console.log("Updated Record : after remove", updatedRecord)


                    await updateDoc(discussionRecordRef,{Discussions:updatedRecord})
                }

            }


            /*
            const userDiscussionRef = doc(db, "DiscussionRecords", discussionRecordRefId);
            await updateDoc(userDiscussionRef, {
                Discussions: arrayRemove({
                    discussionId:discussionId
                }),
            });
            */


            console.log("Removed discussion reference from DiscussionRecords");





            setDeletePostLoading(false)
            
    
        } catch (error) {
            console.error("Error deleting discussion:", error);
        }
    };
  
  return (


    <PaperProvider>


        {renderProcess()}
        {renderDeleteConfirmation(discussionid as string,selectedCommentId,selectedCommentIndex)}
        {renderDeletePostConfirmation(discussionid as string,user?.DiscussionRecordRefId as string)}
        {renderProcessDeletePost()}

        {/*<ImageViewing
                images={discussionData?.ImageSnapshots.map((img) => ({ uri: img })) as any}
                imageIndex={selectedImageIndex}
                visible={visibleImageView}
                onRequestClose={() => setVisibleImageView(false)}
            />*/}

        <SafeAreaView style={styles.mainWrapper}>


            <View style={styles.headerContainer}>

                <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10}} onPress={()=> router.back()}>

                    <Ionicons name="arrow-back" size={30} color="black" />

                </TouchableOpacity>
                

                {user?.Username === discussionData?.Author && (

                    <TouchableOpacity onPress={()=> setShowDeletePostConfirmation(true)} style={{alignSelf:'flex-start',marginRight:10, marginLeft:'auto'}}>
                        <MaterialCommunityIcons name="delete-empty" size={30} color="red" />
                    </TouchableOpacity>

                )}


                

            </View>



            <ScrollView style={styles.contentScrollContainer}>


                <View style={stylesDiscussionContent.mainContainer}>

                    <View style={stylesDiscussionContent.header}>
                        <Avatar.Text size={40} label={getAuthorInitials(discussionData?.Author as string)}  style={stylesDiscussionContent.badgeContainer}/>

                        <View style={stylesDiscussionContent.headerInfoContainer}>
                            <Text style={stylesDiscussionContent.headerUsernameText}>{discussionData?.Author}</Text>
                            <Text style={stylesDiscussionContent.headerDateText}>{formatDate(discussionData?.CreatedAt)}</Text>
                        </View>
                    </View>



                    <View style={stylesDiscussionContent.TitleWrapper}>
                        <Text style={stylesDiscussionContent.titleText}>
                            {discussionData?.Title}
                        </Text>
                    </View>


                    {discussionData && discussionData?.ImageSnapshots.length > 0 && (



                    <ScrollView horizontal={true}  showsHorizontalScrollIndicator={true} style={stylesDiscussionContent.imageScrollWrapper} contentContainerStyle={{alignItems:'center'}} >
                        
                        {discussionData?.ImageSnapshots.map((image,index)=>(

                                <TouchableOpacity style={stylesDiscussionContent.imageWrapper} 
                                
                                
                                    key={index} 
                                    onPress={() => {
                                        setSelectedImageIndex(index);
                                        setVisibleImageView(true);
                                        console.log(discussionData?.ImageSnapshots)
                                    }}
                                >
                                    <Image source={{uri:image}} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:5}}/>
                                </TouchableOpacity>


                        ))}



                    </ScrollView>



                    )}


                    <View style={stylesDiscussionContent.bodyWrapper}>
                        <Text style={{fontSize:15}}>{discussionData?.Content}</Text>
                    </View>





            
                </View>

                
           


                <View style={stylesReply.replyHeader}>

                    <FontAwesome5 name="comment-alt" size={20} color="black" />
                    <Text style={{fontWeight:500,marginLeft:10}}>Comments</Text>

                </View>
                {comments && comments.length > 0 && (

                        comments.map((comment,index)=>(


                        <View style={stylesReply.replyWrapper}>
                            <View style={stylesReply.infoWrapper}>
                                <Avatar.Text size={25} label={getAuthorInitials(comment?.Author as string)}/>
                                <Text  style={stylesReply.userText}>{comment?.Author}</Text>
                                <Text style={stylesReply.dateText}>{formatDate(comment?.CreatedAt)}</Text>
                                {user?.Username === comment?.Author && 
                                    <TouchableOpacity style={{alignSelf:'flex-start',borderWidth:0,marginLeft:'auto',marginRight:10}} onPress={()=> {setSelectedCommentIndex(index); setSelectedCommentId(comment?.id as string); setShowDeleteConfirmation(true)}}>
                                            <AntDesign name="delete" size={20} color="#E63946" />
                                    </TouchableOpacity>
                                }
                            </View>
        
                            <View style={stylesReply.replyContent}>
                                <Text >{comment?.Content}</Text>
                            </View>
                        </View>


                        ))


                )}

                





            </ScrollView>

            <View style={stylesDiscussionContent.commentContainer}>
                
                <TouchableOpacity style={stylesDiscussionContent.commentActionWrapper} onPress={()=>navigateToComment(discussionid as string)}>
                    <Text style={stylesDiscussionContent.CommentActionText}>Join Discussion</Text>
                </TouchableOpacity>

            </View>


        </SafeAreaView>

    </PaperProvider>
  )
}

export default DisussionScreen
const stylesReply = StyleSheet.create({
    replyHeader:{
        //borderWidth:1,
        width:'100%',
        marginBottom:10,
        display:'flex',
        flexDirection:'row',
        padding:5,
        backgroundColor:'white',
    },
    replyWrapper:{
        width:'100%',
        //borderWidth:1,
        borderColor:'red',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        paddingVertical:5,
        marginBottom:10,
        backgroundColor:'white'
    },


    infoWrapper:{
        width:'95%',
        display:'flex',
        flexDirection:'row',
        //borderWidth:1,
        paddingVertical:3,
        alignItems:'center'
    },


    replyContent:{
        width:'95%',
        //borderWidth:1,
        paddingVertical:3
    },

    userText:{
        fontWeight:'bold',
        fontSize:13,
        marginLeft:10,
        marginRight:10,
    
    },
    dateText:{
        fontSize:13,
    }
})


const styles = StyleSheet.create({


    mainWrapper:{
        //borderWidth:1,
        flex:1,
        color:'red',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'#F2F3F5'
    },


    contentScrollContainer:{
        width:'100%',
        //borderWidth:1,
        paddingBottom:5
        //paddingTop:20,
        //paddingHorizontal:5,
        
        
        
      
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
        //backgroundColor:'#2E6F40',
        //marginBottom:20,
        backgroundColor:'white'
    },
})


const stylesDiscussionContent = StyleSheet.create({

    badgeContainer:{
        width:40,
        height:40,
        borderRadius:'50%',
        //borderWidth:1,
        marginRight:0
    },

    mainContainer:{
        width:'100%',
        //borderWidth:1,
        //borderColor:'red',
        display:'flex',
        flexDirection:'column',
        marginBottom:20,
        backgroundColor:'white',
        paddingHorizontal:5,
        paddingTop:20
        
    },
    header:{
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
   
    
    },

    headerInfoContainer:{
        flex:1,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        marginLeft:10
    },
    TitleWrapper:{
        marginTop:10,
        marginBottom:20,
        //borderWidth:1,
        width:'100%',
        //backgroundColor:'red',
        paddingVertical:10
        //height:50
    },
    bodyWrapper:{
        //borderWidth:1,
        width:'100%',
        //backgroundColor:'green',
        paddingVertical:10
    },
    imageScrollWrapper:{
        width:'100%',
        //borderWidth:1,
        //height:10,
        //backgroundColor:'blue',
        marginTop:10,
        display:'flex',
        flexDirection:'row',
       

    },
    imageWrapper:{
        width:300,
       // borderWidth:1,
        height:170,
        marginRight:15
    },



    // text 
    headerUsernameText:{
        fontSize:16,
        fontWeight:500
    },
    headerDateText:{
        fontSize:15,
        fontWeight:300
    },
    titleText:{
        fontSize:18,
        fontWeight:500
    },


    commentContainer:{
        width:'100%',
        //borderWidth:1,
        marginTop:'auto',
        paddingVertical:10,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white'
    },

    commentActionWrapper:{
        paddingVertical:10,
        //borderWidth:1,
        width:'95%',
        borderRadius:10,
        backgroundColor:'#F2F3F5',
        paddingHorizontal:20,
       
    },
    CommentActionText:{
        color:"#D7D8Da"
    },

})