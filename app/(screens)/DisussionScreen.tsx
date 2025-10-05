import { ActivityIndicator, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { Avatar, Dialog, MD3Colors, PaperProvider, Portal, ProgressBar } from 'react-native-paper';
import { useSearchParams } from 'expo-router/build/hooks';
import { arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import {router, useFocusEffect} from 'expo-router';
import { Image } from 'react-native';

//icons
import AntDesign from '@expo/vector-icons/AntDesign';
import { useUserContext } from '../Context/UserContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


import ImageViewing from "react-native-image-viewing";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLanguage } from '../Context/LanguageContex';

interface DiscussionData {
    Author:string,
    AuthorUid:string,
    Title:string,
    Content:string,
    ImageSnapshots:string[],
    CreatedAt:any,
    Tag:string
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
  const {language} = useLanguage()
  const navigateToComment = (RefId:string) => {

    const queryString = `?PostRefId=${encodeURIComponent(RefId)}`
    router.push(`/(screens)/CommentScreen${queryString}` as any)
    
  }


  const [discussionData,setDiscussionData] = useState<DiscussionData>()
  const searchParams = useSearchParams();
  const discussionid = searchParams.get('PostRefId');
  const signatureId = searchParams.get('SignatureId')
  const [comments,setComments] = useState<{id:string,Author:string,Content:string,CreatedAt:any}[]>([])

  
  const {user} = useUserContext();

  const [loadingData,setLoadingData] = useState(false)
  const [showDeleteProcess,setShowDeleteProcess] = useState(false)
  const [showDeleteConfirmation,setShowDeleteConfirmation] = useState(false)
  const [loadingDelete,setLoadingDelete] = useState(false)



  const [showDeletePostConfirmation,setShowDeletePostConfirmation] = useState(false)
  const [showDeletePostProcess,setShowDeletePostProcess] = useState(false)
  const [deletePostLoading,setDeletePostLoading] = useState(false)
  const [showInternetError,setShowInternetError] = useState(false)
  const[showError,setShowError] = useState(false)
  const [selectedCommentIndex,setSelectedCommentIndex] = useState<number>(-1)
  const [selectedCommentId,setSelectedCommentId] = useState<string>("")

  const[visibleImageView,setVisibleImageView] = useState(false)
  const [selectedImageIndex,setSelectedImageIndex] = useState(0)

  // 1st version fetch
  /*
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

*/

// 2nd version fetch
/*
useEffect(() => {
  const fetchDiscussionData = async () => {
    setLoadingData(true);
    console.log("Document id is : ", discussionid);

    try {
      const docRef = doc(db, "Discussions", discussionid as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const discussion = docSnap.data() as DiscussionData;

        // 🔹 Fetch the author's username using the Author UID
        let authorName = "Unknown";
        if (discussion.Author) {
          const userQuery = query(
            collection(db, "Users"),
            where("UserId", "==", discussion.Author) // since your Users collection uses UserId field
          );
          const userSnap = await getDocs(userQuery);

          if (!userSnap.empty) {
            authorName = userSnap.docs[0].data().Username || "Unknown";
          }
        }

        setDiscussionData({
          ...discussion,
          Author: authorName, // attach username alongside Author UID
        });
      } else {
        console.log("Document doesn't exist");
      }

      // 🔹 Fetch replies
      const repliesRef = collection(db, "Discussions", discussionid as string, "Comments");
      const repliesSnap = await getDocs(repliesRef);

      const replies = repliesSnap.docs.map((doc) => ({
        id: doc.id, // Reply document ID
        CreatedAt: doc.data().CreatedAt || 0,
        Author: doc.data().Author || "",
        Content: doc.data().Content || "",
      }));

      setComments(replies);
      console.log("Fetched Replies:", replies);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingData(false);
    }
  };

  fetchDiscussionData();
}, [discussionid]);
*/
useEffect(() => {
  const fetchDiscussionData = async () => {
    setLoadingData(true);
    console.log("Document id is : ", discussionid);

    try {
      // 🔹 Fetch discussion
      const docRef = doc(db, "Discussions", discussionid as string);
      const docSnap = await getDoc(docRef);

      let discussionWithAuthor: any = null;

      if (docSnap.exists()) {
        const discussion = docSnap.data() as DiscussionData;

        // Resolve discussion Author name
        let authorName = "Unknown";
        if (discussion.Author) {
          const userQuery = query(
            collection(db, "Users"),
            where("UserId", "==", discussion.Author)
          );
          const userSnap = await getDocs(userQuery);
          if (!userSnap.empty) {
            authorName = userSnap.docs[0].data().Username || "Unknown";
          }
        }

        discussionWithAuthor = {
          ...discussion,
          Author: authorName,
        };
        setDiscussionData(discussionWithAuthor);
      } else {
        console.log("Document doesn't exist");
      }

      // 🔹 Fetch replies
      const repliesRef = collection(db, "Discussions", discussionid as string, "Comments");
      const repliesSnap = await getDocs(repliesRef);

      const replies = repliesSnap.docs.map((doc) => ({
        id: doc.id,
        CreatedAt: doc.data().CreatedAt || 0,
        Author: doc.data().Author || "",
        Content: doc.data().Content || "",
      }));

      // Collect all unique reply Author UIDs
      const replyAuthorIds = [...new Set(replies.map((r) => r.Author))].filter(Boolean);

      let userMap: Record<string, string> = {};

      if (replyAuthorIds.length > 0) {
        // Firestore "in" supports max 10 values → chunk if needed
        const chunks: string[][] = [];
        for (let i = 0; i < replyAuthorIds.length; i += 10) {
          chunks.push(replyAuthorIds.slice(i, i + 10));
        }

        for (const chunk of chunks) {
          const usersQuery = query(
            collection(db, "Users"),
            where("UserId", "in", chunk)
          );
          const usersSnap = await getDocs(usersQuery);
          usersSnap.forEach((doc) => {
            const data = doc.data();
            userMap[data.UserId] = data.Username;
          });
        }
      }

      // Attach usernames to replies
      const repliesWithNames = replies.map((reply) => ({
        ...reply,
        Author: userMap[reply.Author] || "Unknown",
      }));

      setComments(repliesWithNames);
      console.log("Fetched Replies with usernames:", repliesWithNames);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingData(false);
    }
  };

  fetchDiscussionData();
}, [discussionid]);


// refetch reply after commenting (1st iteration)
/*
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
            
            replies.sort((a,b) => b.CreatedAt.toDate().getTime() - a.CreatedAt.toDate().getTime())
            setComments(replies)
            console.log("ReFetched Replies:", replies);

        }
        reFetchReplies()
      // Fetch data or refresh state here
    }, [])
  );
    */

  useFocusEffect(
  useCallback(() => {
    const reFetchReplies = async () => {
      console.log("Refetching replies (triggered by comment)");

      const repliesRef = collection(
        db,
        "Discussions",
        discussionid as string,
        "Comments"
      );
      const repliesSnap = await getDocs(repliesRef);

      const replies = repliesSnap.docs.map((doc) => ({
        id: doc.id, // Reply document ID
        CreatedAt: doc.data().CreatedAt || 0,
        Author: doc.data().Author || "",
        Content: doc.data().Content || "",
      }));

      // 🔹 Collect unique reply authors
      const replyAuthorIds = [...new Set(replies.map((r) => r.Author))].filter(Boolean);

      let userMap: Record<string, string> = {};

      if (replyAuthorIds.length > 0) {
        // Chunk into batches of 10 for Firestore "in"
        const chunks: string[][] = [];
        for (let i = 0; i < replyAuthorIds.length; i += 10) {
          chunks.push(replyAuthorIds.slice(i, i + 10));
        }

        for (const chunk of chunks) {
          const usersQuery = query(
            collection(db, "Users"),
            where("UserId", "in", chunk)
          );
          const usersSnap = await getDocs(usersQuery);
          usersSnap.forEach((doc) => {
            const data = doc.data();
            userMap[data.UserId] = data.Username;
          });
        }
      }

      // 🔹 Attach AuthorName to replies
      const repliesWithNames = replies.map((reply) => ({
        ...reply,
        Author: userMap[reply.Author] || "Unknown",
      }));

      // 🔹 Sort newest → oldest
      repliesWithNames.sort(
        (a, b) =>
          b.CreatedAt.toDate().getTime() - a.CreatedAt.toDate().getTime()
      );

      setComments(repliesWithNames);
      console.log("ReFetched Replies with usernames:", repliesWithNames);
    };

    reFetchReplies();
  }, [discussionid])
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
                <Text>
                    {language === "en" ? "Deleting Your Comment" : "Binubura ang Iyong Komento"}
                </Text>
            </Dialog.Title>

            {loadingDelete ? (
                <Dialog.Content>
                    <Text style={{fontSize:16}}>
                        {language === "en" 
                        ? "Your comment is being deleted. Please wait..." 
                        : "Binubura ang iyong komento. Mangyaring maghintay..."}
                    </Text>
                </Dialog.Content>
            ) : (
                <Dialog.Content>
                    <Text style={{fontSize:16}}>
                        {language === "en" 
                        ? "Your comment is deleted Successfully!" 
                        : "Matagumpay na nabura ang iyong komento!"}
                    </Text>
                </Dialog.Content>
            )}

            {loadingDelete ? (
                <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
            ) : (
                <Dialog.Actions>

                    <TouchableOpacity onPress={()=>{setShowDeleteProcess(false)}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                        <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                            {language === "en" ? "Continue" : "Magpatuloy"}
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
                    <Text>
                        {language === "en" 
                            ? "Are you sure you want to delete this comment?" 
                            : "Sigurado ka bang gusto mong burahin ang komento na ito?"}
                    </Text>
                </Dialog.Title>

                <Dialog.Content>
                    <Text style={{fontSize:16}}>
                        {language === "en" 
                            ? "This action cannot be undone" 
                            : "Ang aksyong ito ay hindi na maibabalik"}
                    </Text>
                </Dialog.Content>

                <Dialog.Actions style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <TouchableOpacity onPress={()=>{setShowDeleteConfirmation(false)}} style={{borderColor:' #607D8B',borderWidth:1,alignSelf:'flex-start',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                        <Text style={{color:'#607D8B',fontSize:16,fontWeight:500}}>
                            {language === "en" ? "Cancel" : "I-Kansela"}
                        </Text>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{deleteComment(discussionid as string,commentId as string,selectedIndex)}} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                        <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                            {language === "en" ? "Continue" : "Magpatuloy"}
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
                    <Text>
                        {language === "en" 
                            ? "Deleting Your Post" 
                            : "Binubura ang Iyong Post"}
                    </Text>
                </Dialog.Title>

                {deletePostLoading ? (
                    <Dialog.Content>
                        <Text>
                            {language === "en" 
                                ? "Your Post is being deleted Please wait..." 
                                : "Ang iyong post ay binubura, mangyaring maghintay..."}
                        </Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                        <Text>
                            {language === "en" 
                                ? "Your Post is deleted Successfully!" 
                                : "Matagumpay na nabura ang iyong post!"}
                        </Text>
                    </Dialog.Content>
                )}

                {deletePostLoading ? (
                    <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                ) : (
                    <Dialog.Actions>
                        <TouchableOpacity onPress={()=>{router.push('/(main)/records')}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
                            <Text style={{color:'white'}}>
                                {language === "en" ? "Continue" : "Magpatuloy"}
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
                    <Text>
                        {language === "en" 
                            ? "Are you sure you want to delete this Post?" 
                            : "Sigurado ka bang gusto mong burahin ang post na ito?"}
                    </Text>
                </Dialog.Title>

                <Dialog.Content>
                    <Text>
                        {language === "en" 
                            ? "This action cannot be undone" 
                            : "Ang aksyong ito ay hindi na maibabalik"}
                    </Text>
                </Dialog.Content>

                <Dialog.Actions>
                    <TouchableOpacity onPress={()=>{setShowDeletePostConfirmation(false); deleteDiscussion(discussionid,discussionRefId)}} style={{backgroundColor:'red',paddingVertical:5,paddingHorizontal:10,borderRadius:5,elevation:1}} >
                        <Text style={{color:'white'}}>
                            {language === "en" ? "Continue" : "Magpatuloy"}
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

    /*<--- Delete leftover logic [LEGACY] */
    /*
    const deleteLeftover = async () =>{

        console.log("Deleting discussion with an id of : ", discussionid )


        try{


            const discussionRecordRef = doc(db,'DiscussionRecords',user?.DiscussionRecordRefId as string)
            const discussionRecorSnap = await getDoc(discussionRecordRef)


            if(discussionRecorSnap.exists()){

                let recordsArray = discussionRecorSnap.data().Discussions || []
                
                console.log("Discussion Records Array before remove : ", recordsArray)


                const discussionRecordIndex = recordsArray.findIndex((discussion:any)=>discussion.discussionId === discussionid);
                console.log("Index of discussion record to remove : ", discussionRecordIndex)

                if(discussionRecordIndex !== -1){
                    const updatedRecord = [...recordsArray.slice(0, discussionRecordIndex), ...recordsArray.slice(discussionRecordIndex + 1)];
                    console.log("Updated Record : after remove", updatedRecord)


                    await updateDoc(discussionRecordRef,{Discussions:updatedRecord})
                }

            }

        }catch(err){

        }
    }*/
    const deleteLeftover = async () => {
        console.log("Deleting discussion with an id of : ", discussionid);

        try {
            const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), 20000)
            );

            const deleteProcess = (async () => {
            const discussionRecordRef = doc(db, "DiscussionRecords", user?.DiscussionRecordRefId as string);
            const discussionRecorSnap = await getDoc(discussionRecordRef);

            if (discussionRecorSnap.exists()) {
                let recordsArray = discussionRecorSnap.data().Discussions || [];
                console.log("Discussion Records Array before remove : ", recordsArray);

                const discussionRecordIndex = recordsArray.findIndex(
                (discussion: any) => discussion.discussionId === discussionid
                );
                console.log("Index of discussion record to remove : ", discussionRecordIndex);

                if (discussionRecordIndex !== -1) {
                const updatedRecord = [
                    ...recordsArray.slice(0, discussionRecordIndex),
                    ...recordsArray.slice(discussionRecordIndex + 1),
                ];
                console.log("Updated Record : after remove", updatedRecord);

                await updateDoc(discussionRecordRef, { Discussions: updatedRecord });
                }
            }
            })();

            // race between Firestore operation and timeout
            await Promise.race([deleteProcess, timeoutPromise]);

            console.log("Leftover discussion record cleaned up");
            router.push('/(main)/account')
        } catch (err: any) {
            if (err.message === "timeout") {
            console.error("Delete leftover failed: timeout");
            setShowInternetError?.(true);
            } else {
            console.error("Error deleting leftover discussion record:", err);
            setShowError?.(true);
            }
        }
    };
    /*<--- Delete post logic [LEGACY] */
    /*
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


        
     


            console.log("Removed discussion reference from DiscussionRecords");





            setDeletePostLoading(false)
            
    
        } catch (err:any) {

            setDeletePostLoading(false)

            if(err.message === "timeout") {
                setShowInternetError(true)
            } else {
                setShowError(true)
            }

            console.error("Error deleting discussion:", err);
        }
    };*/

    const deleteDiscussion = async (discussionId: string, discussionRecordRefId: string) => {
        setDeletePostLoading(true);
        setShowDeletePostProcess(true);

        try {
            console.log("Passed data: discussionId >", discussionId, "<> discussionRecordRefId >", discussionRecordRefId);

            const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), 20000)
            );
            const discussionRef = doc(db, "Discussions", discussionId);

            // Wrap the whole deletion process inside a promise
            const deleteProcess = (async () => {
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
            const discussionRecordRef = doc(db, "DiscussionRecords", user?.DiscussionRecordRefId as string);
            const discussionRecorSnap = await getDoc(discussionRecordRef);

            if (discussionRecorSnap.exists()) {
                let recordsArray = discussionRecorSnap.data().Discussions || [];
                console.log("Discussion Records Array before remove : ", recordsArray);

                const discussionRecordIndex = recordsArray.findIndex(
                (discussion: any) => discussion.discussionId === discussionId
                );
                console.log("Index of discussion record to remove : ", discussionRecordIndex);

                if (discussionRecordIndex !== -1) {
                const updatedRecord = [
                    ...recordsArray.slice(0, discussionRecordIndex),
                    ...recordsArray.slice(discussionRecordIndex + 1),
                ];
                console.log("Updated Record : after remove", updatedRecord);

                await updateDoc(discussionRecordRef, { Discussions: updatedRecord });
                }
            }

            console.log("Removed discussion reference from DiscussionRecords");
            })();

            // Run the process with timeout protection
            await Promise.race([deleteProcess, timeoutPromise]);

            setDeletePostLoading(false);
        } catch (err: any) {
            setDeletePostLoading(false);

            if (err.message === "timeout") {
            setShowInternetError(true);
            } else {
            setShowError(true);
            }

            console.error("Error deleting discussion:", err);
        }
    };

  const redirectToReport = () =>{
    console.log("Redirecting to rs")
    const queryString = `?PostRefId=${discussionid}
        &PostTitle=${discussionData?.Title}
        &PostBody=${discussionData?.Content}
        &Author=${discussionData?.Author}
        &ContentType=Post`;
    router.push(`/(screens)/reportScreen${queryString}` as any)
  }

  const redirectToCommentReport = (commentContent:string,commentRefId:string,commentAuthor:string) => {
    const queryString = `?PostRefId=${discussionid}
        &ReplyRefId=${commentRefId}
        &Author=${commentAuthor}
        &PostBody=${commentContent}
        &ContentType=Comment`;

    router.push(`/(screens)/reportScreen${queryString}` as any)
  }
  
  return (


    <PaperProvider>


        {renderProcess()}
        {renderDeleteConfirmation(discussionid as string,selectedCommentId,selectedCommentIndex)}
        {renderDeletePostConfirmation(discussionid as string,user?.DiscussionRecordRefId as string)}
        {renderProcessDeletePost()}
        {renderError()}
        {renderSlowInternet()}
        {loadingData ? (
            <>
                <SafeAreaView style={[styles.mainWrapper, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#607D8B" />
                    <Text style={{ marginTop: 10, color: '#607D8B' }}>Loading discussion...</Text>
                </SafeAreaView>
            </>
        ) : discussionData ? (
            <>
                <ImageViewing
                        images={discussionData?.ImageSnapshots.map((img) => ({ uri: img })) as any}
                        imageIndex={selectedImageIndex}
                        visible={visibleImageView}
                        onRequestClose={() => setVisibleImageView(false)}
                    />

                <SafeAreaView style={styles.mainWrapper}>


                    <View style={styles.headerContainer}>

                        <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10,borderWidth:0,padding:5}} onPress={()=> router.back()}>

                            <Ionicons name="arrow-back" size={25} color="#607D8B" />

                        </TouchableOpacity>
                        

                        <TouchableOpacity style={{marginLeft:'auto'}} onPress={redirectToReport}>
                            <MaterialIcons name="report" size={24} color="#6F7072" />
                        </TouchableOpacity>

                        {user?.UserId === discussionData?.AuthorUid && (

                            <TouchableOpacity onPress={()=> setShowDeletePostConfirmation(true)} style={{alignSelf:'flex-start',marginRight:10, marginLeft:20}}>
                                <MaterialCommunityIcons name="delete-empty" size={30} color="red" />
                            </TouchableOpacity>

                        )}


                        

                    </View>



                    <ScrollView style={styles.contentScrollContainer}>


                        <View style={stylesDiscussionContent.mainContainer}>

                            <View style={stylesDiscussionContent.header}>
                                <Avatar.Text size={50} label={getAuthorInitials(discussionData?.Author as string)}  style={stylesDiscussionContent.badgeContainer}/>

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
                                <Text style={{fontSize:17,color:'#475569'}}>{discussionData?.Content}</Text>
                                <View style={{borderColor:'#D5F6E5',marginVertical:10,borderWidth:1,alignSelf:'flex-start',backgroundColor:'#D5F6E5',paddingVertical:2,paddingHorizontal:10,borderRadius:20,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{fontSize:16,color:'#518A69'}}>{discussionData?.Tag}</Text>

                                    
                                </View>
                            </View>





                    
                        </View>

                        
                    
                        
                        
                        <View style={stylesReply.mainContainer}>
                            <View style={stylesReply.replyHeader}>

                                <FontAwesome5 name="comment-alt" size={20} color="#607D8B" />
                                <Text style={{fontWeight:500,marginLeft:10,color:'#607D8B',fontSize:16}}>Comments</Text>

                            </View>

                                {comments && comments.length > 0 && (

                                    comments.map((comment,index)=>(


                                    <View style={stylesReply.replyWrapper } key={index}>



                                        

                                        <View style={stylesReply.infoWrapper}>
                                            <View style={stylesReply.avatarIconWrapper}>
                                                <Avatar.Text size={35} label={getAuthorInitials(comment?.Author as string)}/>
                                            </View>
                                            <View style={stylesReply.infoWrapper__metadataWrapper}> 
                                                <Text  style={stylesReply.userText}>{comment?.Author}</Text>
                                                <Text style={stylesReply.dateText}>{formatDate(comment?.CreatedAt)}</Text>

                                            </View>


                                        </View>
                    
                                        <View style={stylesReply.replyContent}>
                                            <Text style={{fontSize:16,color:'#475569'}} >{comment?.Content}</Text>
                                        </View>

                                        <View style={stylesReply.actionsWrapper}>

                                            {user?.Username === comment?.Author && 
                                                <TouchableOpacity style={{alignSelf:'flex-start',borderWidth:0}} onPress={()=> {setSelectedCommentIndex(index); setSelectedCommentId(comment?.id as string); setShowDeleteConfirmation(true)}}>
                                                        <AntDesign name="delete" size={20} color="#6F7072" />
                                                </TouchableOpacity>
                                            }
                                            <TouchableOpacity style={{}} onPress={()=> redirectToCommentReport(comment?.Content,comment?.id,comment?.Author)}>
                                                <MaterialIcons name="report" size={22} color="#6F7072" />
                                            </TouchableOpacity>
                                        </View>

                                    </View>


                                        ))


                                )}


                        </View>
                        


                        



               

                    </ScrollView>

                    <View style={stylesDiscussionContent.commentContainer}>
                        
                        <TouchableOpacity style={stylesDiscussionContent.commentActionWrapper} onPress={()=>navigateToComment(discussionid as string)}>
                            <Text style={stylesDiscussionContent.CommentActionText}>Join Discussion</Text>
                        </TouchableOpacity>

                    </View>


                </SafeAreaView>

            </>
        ) : (
            <>
            <SafeAreaView style={[styles.mainWrapper]}>
                <View style={styles.headerContainer}>

                        <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10,borderWidth:0,padding:5}} onPress={()=> router.back()}>

                            <Ionicons name="arrow-back" size={25} color="#607D8B" />

                        </TouchableOpacity>
                        

                        

                </View>
                <View style={stylesDataDoesntExist.wrapper}>
                    <MaterialIcons name="error-outline" size={28} color="#E63946" />
                    <Text style={stylesDataDoesntExist.primaryText}>This discussion is no longer available</Text>
                    <Text style={stylesDataDoesntExist.secondaryText}>It may have been removed for violating community guidelines.</Text>

                    {signatureId === user?.UserId && (
                        <TouchableOpacity style={stylesDataDoesntExist.actionWrapper} onPress={deleteLeftover}>
                            <Text style={stylesDataDoesntExist.actionText}>Delete from your records</Text>
                        </TouchableOpacity>
                    )}

                    

                </View>
                
            </SafeAreaView>
            </>
        ) }
        

    </PaperProvider>
  )
}

export default DisussionScreen

const stylesDataDoesntExist = StyleSheet.create({

    wrapper:{
        display:'flex',
        flexDirection:'column',
        width:'80%',
        borderWidth:0,
        justifyContent:'center',
        alignItems:'center',
        gap:10,
        marginVertical:'auto',
        marginHorizontal:'auto'
    },

    secondaryText:{
        textAlign:'center',
        color:'#6C757D',
        fontSize:15
    },
    primaryText:{
        fontSize:20,
        textAlign:'center',
        color:'#2B2D42',
        fontWeight:600
    },

    actionWrapper:{
        paddingVertical:5,
        paddingHorizontal:10,
        borderColor:'#E63946',
        borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFE5E5',
        borderRadius:5,
        marginTop:10,
    },

    actionText:{
        fontSize:15,
        fontWeight:500,
        color:'#E63946'
    }

})
const stylesReply = StyleSheet.create({

    mainContainer:{
        width:'100%',
        //borderWidth:1,
    },

    avatarIconWrapper:{
        //borderWidth:1,
    },
    

    actionsWrapper:{
        borderTopWidth:1,
        
        borderColor:'#E2E8f0',
        paddingVertical:5,
        justifyContent:'flex-end',
        display:'flex',
        flexDirection:'row',
        gap:10
    },
    
    replyHeader:{
        //borderWidth:1,
        width:'100%',
        //marginBottom:5,
        display:'flex',
        flexDirection:'row',
        padding:5,
        paddingVertical:15,
        alignItems:'center',
        borderBottomWidth:1,
        borderColor:'#E2E8f0',
        backgroundColor:'white',
    },
    replyWrapper:{
        width:'100%',
        //borderWidth:1,
        borderBottomWidth:1,
        borderColor:'#E2E8F0',
       paddingRight:10,
        display:'flex',
        flexDirection:'column',
        paddingHorizontal:5,
        gap:10,
        paddingTop:20,
        paddingBottom:5,
      
        marginBottom:5,
        backgroundColor:'white'
        
    },


    infoWrapper:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        //borderWidth:1,
        gap:10,
        paddingRight:5,
      
    },
    infoWrapper__metadataWrapper:{
        display:'flex',
        flexDirection:'column',
        borderWidth:0,
    },


    replyContent:{
        width:'95%',
        //borderWidth:1,
        paddingVertical:3
    },

    userText:{
        fontWeight:'500',
        fontSize:14,
        marginLeft:0,
        marginRight:10,
        color:' #37474F'
    
    },
    dateText:{
        fontSize:13,
        color:'#94A3B8'
    }
})
const styles = StyleSheet.create({


    mainWrapper:{
        borderWidth:1,
        flex:1,
        color:'red',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'#F4F5F7'
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
        //maxHeight:50,
        borderBottomWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        //height:50,
        //backgroundColor:'#2E6F40',
        //marginBottom:20,
        backgroundColor:'white',
        borderColor:'#E2E8f0'
    },
})
const stylesDiscussionContent = StyleSheet.create({

    badgeContainer:{
        width:55,
        height:55,
        borderRadius:'50%',
        borderWidth:0,
        marginRight:0,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },

    mainContainer:{
        width:'100%',
        //borderWidth:1,
        //borderColor:'red',
        display:'flex',
        flexDirection:'column',
        marginBottom:10,
        backgroundColor:'white',
        paddingHorizontal:5,
        paddingTop:20,
        paddingBottom:30
        
    },
    header:{
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:10,
    
    },

    headerInfoContainer:{
        flex:1,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        marginLeft:10
    },
    TitleWrapper:{
        marginTop:0,
        marginBottom:0,
        //borderWidth:1,
        width:'100%',
        //backgroundColor:'red',
        paddingVertical:10
        //height:50
    },
    bodyWrapper:{
    
        width:'100%',
        //backgroundColor:'green',
        paddingTop:20,
        paddingBottom:20,
        borderBottomWidth:1,
        borderColor:'#E2E8f0'
    },
    imageScrollWrapper:{
        width:'100%',
        //borderWidth:1,
        //height:10,
        //backgroundColor:'blue',
        marginVertical:10,
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
        fontSize:19,
        fontWeight:600,
        color:'#37474F'
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