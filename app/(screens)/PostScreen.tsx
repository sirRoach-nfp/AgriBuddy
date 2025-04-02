import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput, Touchable } from 'react-native'
import React, { useState } from 'react'
import { Dialog, MD3Colors, PaperProvider, Portal, ProgressBar } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from "expo-image-picker";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';
import { addDoc, arrayUnion, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { useUserContext } from '../Context/UserContext';
import { db } from '../firebaseconfig';
const PostScreen = () => {
    const {user} = useUserContext();

    const [imageUri, setImageUri] = useState<string[]>([]);
    const [title,setTitle] = useState<string>('');
    const [body,setBody] = useState<string>('');
    const [postLoading,setPostLoading] = useState<boolean>(false);


    //dialog handlers
    const [showConfirmation,setShowConfirmation] = useState<boolean>(false);
    const [showProcess,setShowProcess] = useState<boolean>(false);


    const renderPostConfirmation = ()=>(

        <Portal>
            <Dialog visible={showConfirmation} onDismiss={()=>setShowConfirmation(false)}>


                <Dialog.Title>
                    Confirm Post Submission
                </Dialog.Title>
                <Dialog.Content>
                    <Text>Are you sure you want to post this discussion? Once submitted, it will be visible to others.</Text>
                </Dialog.Content>



                <Dialog.Actions>

                <TouchableOpacity onPress={uploadPost} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                    <Text style={{color:'white'}}>
                        Post
                    </Text>

                </TouchableOpacity>

                </Dialog.Actions>

            </Dialog>




        </Portal>

    )




    const renderProcess = () => (

        <Portal>
            <Dialog visible={showProcess} onDismiss={()=>{}}>


                <Dialog.Title>
                    Posting Discussion
                </Dialog.Title>


                {postLoading ? (
                    <Dialog.Content>
                        <Text>Your discussion is being posted. Please wait...</Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                    <Text>Your discussion is Posted Successfully!</Text>
                    </Dialog.Content>
                )}



                {postLoading ? (
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

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to select images!");
          return;
        }
    
        // Open image picker
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true, // Allow cropping
          aspect: [4, 3], // Aspect ratio
          quality: 1, // High quality
        });
    
        if (!result.canceled) {
            setImageUri([...imageUri, result.assets[0].uri]); // Set image URI
        }
      };



    const removeImage = (indexToRemove: number) => {
    setImageUri((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    };




    const uploadPost = async()=> {
        setShowConfirmation(false);
        setShowProcess(true);
        setPostLoading(true);
        console.log("Entering UploadPost....")
        console.log("Inside UploadPost")
        try{

            const uploadedImageUrls = [];


            if(imageUri.length > 0){

                for (const base64 of imageUri) {
                    const blob = base64ToBlob(base64); // Convert Base64 to Blob
    
                    const formData = new FormData();
                    formData.append("file", blob, "upload.jpg"); // Append Blob instead of object
                    formData.append("upload_preset", "dishlyunsignedpreset");
    
                    const uploadResponse = await fetch(
                        "https://api.cloudinary.com/v1_1/dvl7mqi2r/image/upload",
                        {
                            method: "POST",
                            body: formData,
                        }
                    );
    
                    const data = await uploadResponse.json();
                    if (data.secure_url) {
                        uploadedImageUrls.push(data.secure_url); // Store uploaded image URL
                    } else {
                        console.error("Upload failed:", data);
                    }
                }
        
                console.log("Uploaded Images:", uploadedImageUrls);



            
            const newDiscussion = {
                Title:title,
                Content:body,
                ImageSnapshots:uploadedImageUrls,
                ReplyCount:0,
                Author:user?.Username,
                CreatedAt:Timestamp.now(),
            }


                    // Add the discussion post to Firestore
            const discussionRef = await addDoc(collection(db, "Discussions"), newDiscussion);
            console.log("New discussion added with ID:", discussionRef.id);

            // Replies subcollection
            const repliesCollectionRef = collection(db, "Discussions", discussionRef.id, "Replies");

            console.log("Replies subcollection ready:", repliesCollectionRef.path);
            

            // add record 



            const discussionRecordRef = doc(db,"DiscussionRecords",user?.DiscussionRecordRefId as string);


            await updateDoc(discussionRecordRef,{
                Discussions:arrayUnion(discussionRef.id)
            })

            console.log("Uploaded success")




            }

            console.log("Skipped image upload empty image array")

            setPostLoading(false);
            setTitle(""),
            setBody(""),
            setImageUri([])
            






        }catch(err){console.log(err)}
    }


    const base64ToBlob = (base64: string): Blob => {
        const byteString = atob(base64.split(",")[1]); // Remove Base64 header
        const mimeString = base64.split(",")[0].split(":")[1].split(";")[0]; // Extract MIME type
    
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
    
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
    
        return new Blob([arrayBuffer], { type: mimeString });
    };

      
  return (

    <PaperProvider>

        {renderPostConfirmation()}
        {renderProcess()}

    
        <SafeAreaView style={styles.mainWrapper}>

            <View style={styles.headerContainer}>
                <Feather name="x" size={24} color="black" style={{marginLeft:10}} />

                <TouchableOpacity style={styles.postButton} onPress={()=> setShowConfirmation(true)}>
                    <Text>
                        Post
                    </Text>
                </TouchableOpacity>


            </View>



            <ScrollView style={styles.scrollContainer}>

                <TextInput onChange={(e)=>setTitle(e.nativeEvent.text)} placeholder="Title" style={styles.titleInput}></TextInput>


                <TextInput onChange={(e)=>setBody(e.nativeEvent.text)} placeholder="Your Content....." numberOfLines={10} multiline={true} textAlignVertical="top" style={styles.bodyInput}></TextInput>







                <ScrollView horizontal={true}  showsHorizontalScrollIndicator={true} contentContainerStyle={styles.imageThumbContainer}>

                    {
                        imageUri.map((item,index)=>(
                            <TouchableOpacity style={styles.thumbImagesWrapper} onPress={()=>removeImage(index)}>

                                <Image source={{uri:imageUri[index]}} style={styles.thumbImg}/>

                            </TouchableOpacity>
                        ))  
                    }



                    <TouchableOpacity style={styles.addImageWrapper} onPress={pickImage}>

                        <MaterialCommunityIcons name="image-plus" size={30} color="#828282" />

                    </TouchableOpacity>




                </ScrollView>

                



            </ScrollView>




         








            
        </SafeAreaView>
        
    
    
    
    </PaperProvider>
  )
}

export default PostScreen

const styles = StyleSheet.create({
    titleInput:{
        fontSize:25,
        fontWeight:500,
        borderWidth:0,
        marginBottom:20
      
    },
    bodyInput:{
        fontSize:18
    },

    mainWrapper:{
        display:'flex',
        flexDirection:'column',
        //width:'100%',
        //borderWidth:1,
        alignItems:'center',

    },
    scrollContainer:{
        width:'97%',
        //borderWidth:1,
        borderColor:'red',
        display:'flex',
        flexDirection:'column',
        marginTop:20
    },
    headerContainer:{
        width:'100%',
        maxHeight:50,
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10
    },

    postButton:{
        alignSelf:'flex-start',
        paddingVertical:5,
        paddingHorizontal:15,
        borderWidth:1,
        borderRadius:10,
        marginLeft:'auto',
        marginRight:10
    },
    imageThumbContainer:{
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        //height:20
        paddingVertical:5,
        gap:15
    },
    addImageWrapper:{
        width:100,
        height:100,
        //borderWidth:1,
        backgroundColor:'#DADADA',
        borderRadius:10,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    thumbImagesWrapper:{
        width:100,
        height:100,
        borderRadius:10,
    },
    thumbImg:{
        width:'100%',
        height:'100%',
        objectFit:'cover',
        borderRadius:10,
    }





})

function launchImageLibrary(arg0: { mediaType: string; }, arg1: (response: any) => void) {
    throw new Error('Function not implemented.');
}
