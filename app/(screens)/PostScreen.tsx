import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput, Touchable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Dialog, MD3Colors, PaperProvider, Portal, ProgressBar, Title } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';
import { addDoc, arrayUnion, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { useUserContext } from '../Context/UserContext';
import { db } from '../firebaseconfig';
import { router } from 'expo-router';

//controllers

import { uploadPostController } from '../controllers/PostControllers/uploadPost';


//icons 

import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Picker } from '@react-native-picker/picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const PostScreen = () => {
    const {user} = useUserContext();


    //data
    const [imageUri, setImageUri] = useState<string[]>([]);
    const [title,setTitle] = useState<string>('');
    const [body,setBody] = useState<string>('');
    const [selectedTag,setSelectedTag] = useState<string>('General')

    //loaders
    const [postLoading,setPostLoading] = useState<boolean>(false);


    //dialog handlers
    const [showConfirmation,setShowConfirmation] = useState<boolean>(false);
    const [showProcess,setShowProcess] = useState<boolean>(false);
    const [showError,setShowError] = useState<boolean>(false)
    const [showInternetError,setShowInternetError] = useState(false)
    //
    const isValid = 
        title.trim().length >= 10 && 
        title.trim().length <= 80 &&
        body.trim().length >= 20;


    const renderPostConfirmation = ()=>(

        <Portal>
            <Dialog visible={showConfirmation} onDismiss={()=>setShowConfirmation(false)}>


                <Dialog.Title>
                    <Text style={{color:'#37474F'}}>
                        Confirm Post Submission
                    </Text>
                    
                </Dialog.Title>
                
                <Dialog.Content>
                    <Text style={{color:'#475569'}}>Are you sure you want to post this discussion? Once submitted, it will be visible to others.</Text>
                </Dialog.Content>



                <Dialog.Actions>

                <TouchableOpacity onPress={uploadPost} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                    <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                        Post
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
                    Something went wrong
                </Text>
                
            </Dialog.Title>
            
            <Dialog.Content>
                <Text style={{color:'#475569'}}>An unexpected error occured. Please try again later</Text>
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
                            Slow Connection
                        </Text>
                        
                    </Dialog.Title>
                    
                    <Dialog.Content>
                        <Text style={{color:'#475569'}}>Connection seems slow. Please try again.</Text>
                    </Dialog.Content>
    
    
    
                    <Dialog.Actions>
    
                    <TouchableOpacity onPress={()=> setShowInternetError(false)} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
    
                        <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                            OK
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

                        <TouchableOpacity onPress={()=>{router.back()}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

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


        if(title.length < 0){return}
        setShowConfirmation(false);
        setShowProcess(true);
        setPostLoading(true);
        console.log("Entering UploadPost....")
        console.log("Inside UploadPost")
        console.log("Selected image : ", imageUri)

        try{

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("timeout")), 20000)
            );

            await Promise.race([
                uploadPostController(imageUri,title,body,user,selectedTag),timeoutPromise
            ])
        

            setPostLoading(false);
            //throw new Error("Deliberate failure");

            setTitle(""),
            setBody(""),
            setImageUri([])
        
        }catch(err:any){
            setPostLoading(false);
            setShowProcess(false)

            if(err.message === "timeout") {
                setShowInternetError(true)
            } else {
                setShowError(true)
            }
        
        }

    }



    const extractKeywords = (text: string): string[] => {
        return text
          .toLowerCase()
          .replace(/[^\w\s]/gi, '') // remove punctuation
          .split(/\s+/)
          .filter((word, index, self) =>
            word.length > 1 && self.indexOf(word) === index
          );
      };

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
        {renderError()}
        {renderSlowInternet()}
        <SafeAreaView style={styles.mainWrapper}>

            <View style={styles.headerContainer}>


                <TouchableOpacity onPress={()=> router.back()} style={{marginLeft:10}}>
                    <Feather name="x" size={24} color="black"  />
                </TouchableOpacity>
                

                <TouchableOpacity style={[!isValid ? styles.postButton__disabled : styles.postButton__active]} onPress={()=> {
                    if(title.length <= 0){return}
                    
                    setShowConfirmation(true)}}
                    disabled={!isValid}
                    
                    >
                    <FontAwesome name="send" size={15} color="#ECF4F7" />
                    <Text style={{fontWeight:500,fontSize:15,color:'#ECF4F7'}}>
                        Post
                    </Text>
                </TouchableOpacity>




            </View>



            <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
                
                

                <View style={fieldStyles.fieldWrapper}>
                    <Text style={fieldStyles.fieldWrapperLabel}>Title</Text>
                    <TextInput onChange={(e)=>setTitle(e.nativeEvent.text)} placeholder="Title" style={fieldStyles.textInput} maxLength={80}></TextInput>
                    <Text style={{ fontSize: 13, color: title.length < 10 ? "red" : "green",alignSelf:'flex-end' }}>
                    {title.length}/10 min
                    </Text>
                </View>
                

                <View style={fieldStyles.fieldWrapper}>
                    <View style={fieldStyles.fieldDecorationWrapper}>
                        <AntDesign name="tag" size={20} color="#607D8B" />
                       
                        <Text style={fieldStyles.fieldWrapperLabel}>Tag</Text>
                    </View>


                    <View style={{width:'100%',borderWidth:1,borderRadius:5,borderColor:'#E2E8f0'}}>

                        <Picker
                            selectedValue={selectedTag}
                            onValueChange={setSelectedTag}
                            style={{width:'100%',backgroundColor:'white',borderRadius:5}}

                        >
                            <Picker.Item key="General" label="General" value="General"/>
                            <Picker.Item key="Crops" label="Crops" value="Crops"/>
                            <Picker.Item key="Help" label="Help" value="Help"/>
                            <Picker.Item key="Tips" label="Tips" value="Tips"/>
                        </Picker>

                    </View>


                </View>
                

                

                <View style={fieldStyles.fieldWrapper}>
                    <Text style={fieldStyles.fieldWrapperLabel}>Content</Text>
                    <TextInput onChange={(e)=>setBody(e.nativeEvent.text)} maxLength={10000} placeholder="Your Content....." numberOfLines={10} multiline={true} textAlignVertical="top" style={styles.bodyInput}></TextInput>
                    <Text style={{ fontSize: 13, color: body.length < 20 ? "red" : "green",alignSelf:'flex-end' }}>
                        {body.length}/20 min
                    </Text>
                </View>
                





                <View style={{width:'100%',borderWidth:0,marginTop:20}}>
                    <View style={fieldStyles.fieldDecorationWrapper}> 
                        <MaterialCommunityIcons name="image-plus" size={25} color="#607D8B" />
                        <Text style={fieldStyles.fieldWrapperLabel}>Images (Optional, up to 3)</Text>
                    </View>



                    <ScrollView horizontal={true}  showsHorizontalScrollIndicator={true} contentContainerStyle={styles.imageThumbContainer}>

                        {
                            imageUri.map((item,index)=>(
                                <TouchableOpacity style={styles.thumbImagesWrapper} onPress={()=>removeImage(index)} key={item + index}>

                                    <Image source={{uri:imageUri[index]}} style={styles.thumbImg}/>

                                </TouchableOpacity>
                            ))  
                        }



                        <TouchableOpacity style={styles.addImageWrapper} onPress={pickImage}>

                            <MaterialCommunityIcons name="image-plus" size={30} color="#9EA1A6" />

                        </TouchableOpacity>




                    </ScrollView>

                </View>




                <View style={noteStyles.noteWrapper}>
                    <Text style={noteStyles.header}>Community Guidelines</Text>
    
                    <View style={noteStyles.textWrapper}>
                        <Text style={noteStyles.textWrapper__bullet}>
                        •
                        </Text>
                        <Text style={noteStyles.textWrapper__text}>
                        Be respectful and helpful to fellow AgriBuddies
                        </Text>
    
                    </View>
    
                    <View style={noteStyles.textWrapper}>
                        <Text style={noteStyles.textWrapper__bullet}>
                        •
                        </Text>
    
                        <Text style={noteStyles.textWrapper__text}>
                        Share accurate information and cite sources when possible
                        </Text>
    
                    </View>
    
                    <View style={noteStyles.textWrapper}>
    
                        <Text style={noteStyles.textWrapper__bullet}>
                        •
                        </Text>
    
                        <Text style={noteStyles.textWrapper__text}>
                        User relevant tag to help others find your discussion
                        </Text>
    
                    </View>
    
                    <View style={noteStyles.textWrapper}>
    
                        <Text style={noteStyles.textWrapper__bullet}>
                        •
                        </Text>
    
                        <Text style={noteStyles.textWrapper__text}>
                        Include clear photos when asking about plant issues
                        </Text>
    
                    </View>
                </View>





                



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
        fontSize:16,
        minHeight:200,
        borderWidth:1,
        borderRadius:5,
        backgroundColor:"#ffffff",
        borderColor:"#E2E8f0",
        padding:5,
        paddingTop:5
    },

    mainWrapper:{
        display:'flex',
        flex:1,
        flexDirection:'column',
        //width:'100%',
        borderWidth:0,
        alignItems:'center',
        backgroundColor:'#F4F5F7',

    },
    scrollContainer:{
        width:'95%',
        borderWidth:0,
        borderColor:'red',
        display:'flex',
        flexDirection:'column',
        marginTop:20,
    },
    headerContainer:{
        width:'100%',
        //maxHeight:50,
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:15,
        marginTop:30,
        backgroundColor:'#ffffff',
        borderBottomWidth:1,
        borderColor:'#E2E8f0'
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
    imageThumbContainer:{
        //width:'100%',
        borderWidth:1,
        display:'flex',
        flexDirection:'row',
        //height:20
        paddingVertical:5,
        gap:15
    },
    addImageWrapper:{
        width:200,
        height:130,
        borderWidth:2,
        borderColor:'#9EA1A6',
        borderStyle:'dotted',
        borderRadius:10,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    thumbImagesWrapper:{
        width:200,
        height:130,
        borderRadius:10,
    },
    thumbImg:{
        width:'100%',
        height:'100%',
        objectFit:'cover',
        borderRadius:10,
    }





})

const fieldStyles = StyleSheet.create({
  fieldWrapper:{
    width:'100%',
    borderWidth:0,
    display:'flex',
    flexDirection:'column',
    marginBottom:10,
    gap:5
  },

  fieldWrapperLabel:{
    fontWeight:600,
    fontSize:16,
    paddingVertical:5,
    color: '#475569'
  },

  textInput:{
    backgroundColor:'white',
    fontSize:16,
 
    paddingHorizontal:5,
    paddingVertical:10,
    borderRadius:5,
    borderWidth:1,
    borderColor:'#E2E8f0'
  },
  fieldDecorationWrapper:{
    width:'100%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    gap:5
  }
})


const noteStyles = StyleSheet.create({
  noteWrapper:{
    width:'100%',
    padding:15,
    backgroundColor:'#EFF6FF',
    borderRadius:5,
    borderColor:'#E2E8F0',
    borderWidth:1,
    marginTop:25,
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


function launchImageLibrary(arg0: { mediaType: string; }, arg1: (response: any) => void) {
    throw new Error('Function not implemented.');
}
