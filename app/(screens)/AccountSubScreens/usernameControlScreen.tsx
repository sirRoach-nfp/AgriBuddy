import {StyleSheet, Text, TouchableOpacity, View,ScrollView,TextInput, Button, Touchable } from 'react-native'
import React, { useState } from 'react'
import { Dialog, MD3Colors, PaperProvider, Portal, ProgressBar } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { auth, db } from '@/app/firebaseconfig'
import { updateProfile } from 'firebase/auth'
import { useUserContext } from '@/app/Context/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'


import { UserData } from '@/app/Context/UserContext'
const usernameControlScreen = () => {


  //user context

  const {user,storeUserData} = useUserContext()
  const [newUsername,setNewUsername] = useState("")
  const [confirmNewUsername,setConfirmNewUsername] = useState("")


  const isFieldsValid = (newUsername : string, confirmedUsername : string) => {

    const isFieldsNotEmpty =  newUsername.length > 0 && confirmNewUsername.length > 0
    const isUsernameMatched = newUsername === confirmNewUsername
    return isFieldsNotEmpty && isUsernameMatched
  }

  const isValid = isFieldsValid(newUsername,confirmNewUsername)


  //modal controls
  const[showConfirmation,setShowConfirmation] = useState(false)
  const [showProcessDialog,setShowProcessDialog] = useState(false)
  const [showError,setShowError] = useState<boolean>(false)

  
  const [passwordWarningVisible,setPasswordWarningVisible] = useState(false)
  const [passwordWarning,setPasswordWarning] = useState("")


  //states

  const [process,setProcess] = useState(false)

  const renderConfirmation = () => (
    <Portal>
      
      <Dialog visible={showConfirmation} >

        <Dialog.Title>
          <Text style={{color:'#37474F'}}>
            Update Your Username?
          </Text>
        </Dialog.Title>

        <Dialog.Content>
          <Text style={{color:'#475569'}}>
            Are you sure you want to update your username? This action will change how your name appears across the app.
          </Text>
        </Dialog.Content>


        <Dialog.Actions>


          <TouchableOpacity onPress={() => setShowConfirmation(false)} style={{borderColor:'#475569',borderWidth:1,alignSelf:'flex-start',backgroundColor:'transparent',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

              <Text style={{color:'#475569',fontSize:16,fontWeight:500}}>
                  Cancel
              </Text>

          </TouchableOpacity>



          <TouchableOpacity onPress={() => updateUsername()} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

              <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                  Continue
              </Text>

          </TouchableOpacity>




        </Dialog.Actions>

      </Dialog>

    </Portal>
  )



  const renderProcess = () => (
    <Portal>
      
      <Dialog visible={showProcessDialog} >


        {process? (
          <Dialog.Title>
            <Text style={{color:'#37474F'}}>
              Updating Username
            </Text>
          </Dialog.Title>
        ) : (
          <Dialog.Title>
            <Text style={{color:'#37474F'}}>
              Username Updated
            </Text>
          </Dialog.Title>
        )}




        {process ? (
        <Dialog.Content>
          <Text style={{color:'#475569'}}>
            Please wait while we update your username. This may take a few seconds.
          </Text>
        </Dialog.Content>
        ) : (
        <Dialog.Content>
          <Text style={{color:'#475569'}}>
            Your username has been successfully updated.
          </Text>
        </Dialog.Content>
        )}






        {process ? (
          <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
        ) : (
          <Dialog.Actions>

            <TouchableOpacity onPress={() => setShowProcessDialog(false)} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                    Continue
                </Text>

            </TouchableOpacity>

          </Dialog.Actions>
        )}






      </Dialog>

    </Portal>
  )



  const renderPasswordWarning = (errorCode:string) => (

      


      <Portal>
          <Dialog visible={passwordWarningVisible} onDismiss={()=>setPasswordWarningVisible(false)}>

              <Dialog.Content>
                  <Text>{errorCode}</Text>
              </Dialog.Content>

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
  




  const updateUsername = async() =>{

      setShowConfirmation(false)

      if(newUsername !== confirmNewUsername){
        setPasswordWarning("Your username doesn't matched")
        return
      }


      setShowProcessDialog(true)
      setProcess(true)



    try{

      /*
      setTimeout(() => {
        console.log("Timeout hold");
        setProcess(false); // move it inside the timeout
      }, 5000);
      */



      const q = query(
        collection(db,"users"),
        where("username","==",newUsername)
      )

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Username already taken
        setPasswordWarning("Username already exists");
        setPasswordWarningVisible(true);
        setProcess(false)
        return;
      }

      const currentUser = auth.currentUser;
      console.log("Current User : ",currentUser)
      if(!currentUser){
        setPasswordWarning("No user logged in");
        setPasswordWarningVisible(true);
        setProcess(false)
        return {success:false}
      }



      const userDocRef = doc(db,"Users",currentUser.uid);
      await updateDoc(userDocRef,{Username:newUsername})

      await updateProfile(currentUser,{displayName:newUsername})


      const updatedUserData: UserData = { 
        ...(user as UserData), 
        Username: newUsername 
      };

      console.log("Stale User Data : ",user)
      await AsyncStorage.setItem("userData",JSON.stringify(updatedUserData));
      storeUserData(updatedUserData)
      console.log("Updated User Data : ",user)
      setProcess(false)


      console.log("Timeout complete")
      
    }catch(err){
      //set showprocess dialog to false
      //set process to false
      //show error modal dialog 
      console.log(err)
      setProcess(false)
      setShowProcessDialog(false)
      setShowError(true)
      
    }


  }
    

  return (
    <PaperProvider>



      <SafeAreaView style={styles.mainContainer}>
        
        {renderConfirmation()}
        {renderProcess()}
        {renderPasswordWarning(passwordWarning)}
        <View style={styles.header}>

            <TouchableOpacity onPress={()=> router.back()} style={{marginLeft:10}}>
               <Ionicons name="arrow-back" size={25} color="#607D8B" />
            </TouchableOpacity>



            <Text style={{fontSize:20,fontWeight:600,color:'#37474F',marginLeft:20}}>Change Username</Text>

        </View>

        <ScrollView style={styles.scrollContainer}>



          
            <View   style={decorators.userNameWrapper}>
              <View style={decorators.userNameWrapper__iconWrapper}>
                <MaterialCommunityIcons name="account-outline" size={35} color="#ffffff" />
              </View>

              <View style={decorators.userNameWrapper__infoWrapper}>
                <Text style={decorators.userNameWrapper__infoWrapper__secondary}>Current Username</Text>
                <Text style={decorators.userNameWrapper__infoWrapper__primary}>SacabambaspisDev</Text>
              </View>

            </View>


            <View style={[fieldStyles.fieldWrapper,{marginBottom:10}]}>
              <Text style={fieldStyles.fieldWrapperLabel}>
                New Username
              </Text>

              <TextInput style={fieldStyles.textInput} placeholder='Enter New Username' onChange={(e)=>setNewUsername(e.nativeEvent.text)}/>
            </View>

            <View style={fieldStyles.fieldWrapper}>
              <Text style={fieldStyles.fieldWrapperLabel}>
                Confirm New Username
              </Text>

              <TextInput style={fieldStyles.textInput} placeholder='Confirm New Username' onChange={(e)=>setConfirmNewUsername(e.nativeEvent.text)}/>
            </View>

            <View style={buttonStyles.buttonContainers}>

              <TouchableOpacity disabled={!isFieldsValid(newUsername,confirmNewUsername)} style={{display:'flex',
                backgroundColor: isValid ? '#607D8B' : '#CBD5E1',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                paddingVertical:10,
                borderRadius:5,
                }}
                onPress={()=>setShowConfirmation(true)}
                >
                <Text style={{color:'white',fontSize:16, fontWeight:600}}>Update Username</Text>
              </TouchableOpacity>

              
              <TouchableOpacity style={{
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                paddingVertical:10,
                borderRadius:5,
                borderWidth:2,
                borderColor:'#e2e8f0'
                }}>
                <Text style={{color:'#37474F',fontSize:16, fontWeight:600}}>Cancel</Text>
              </TouchableOpacity>

            </View>

            <View style={noteStyles.noteWrapper}>
                <Text style={noteStyles.header}>Username Guidelines</Text>

                <View style={noteStyles.textWrapper}>
                  <Text style={noteStyles.textWrapper__bullet}>
                    •
                  </Text>
                  <Text style={noteStyles.textWrapper__text}>
                    Must be atleast 3 characters long
                  </Text>

                </View>

                <View style={noteStyles.textWrapper}>
                  <Text style={noteStyles.textWrapper__bullet}>
                    •
                  </Text>

                  <Text style={noteStyles.textWrapper__text}>
                    Can contain letters, numbers, and underscores
                  </Text>

                </View>

                <View style={noteStyles.textWrapper}>

                  <Text style={noteStyles.textWrapper__bullet}>
                    •
                  </Text>

                  <Text style={noteStyles.textWrapper__text}>
                    Cannot contain spaces
                  </Text>

                </View>

                <View style={noteStyles.textWrapper}>

                  <Text style={noteStyles.textWrapper__bullet}>
                    •
                  </Text>

                  <Text style={noteStyles.textWrapper__text}>
                    Must be unique
                  </Text>

                </View>
            </View>
            



        </ScrollView>

      </SafeAreaView>

    </PaperProvider>
  )
}

export default usernameControlScreen

const styles = StyleSheet.create({


  mainContainer:{
    borderWidth:1,
    flex:1,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    backgroundColor:'#F4F5F7',
  },

  header:{
    width:'100%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    borderWidth:1,
    paddingVertical:15,
    backgroundColor:'white',
    borderColor:'#E2E8f0'

  },

  scrollContainer:{
    width:'95%',
    borderWidth:0,
    flex:1,
    display:'flex',
    flexDirection:'column',
    paddingVertical:25,
    gap:10
  }


})
const decorators = StyleSheet.create({

  userNameWrapper:{
    width:'100%',
    paddingHorizontal:10,
    paddingVertical:20,
    borderWidth:1,
    borderColor:'#e2e8f0',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    backgroundColor:'white',
    borderRadius:5,
    marginBottom:30,
    
  },

  userNameWrapper__iconWrapper:{
    width:50,
    height:50,
    backgroundColor:'#607D8B',
    borderRadius:'50%',
    borderWidth:0,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center'
  },

  userNameWrapper__infoWrapper:{
    display:'flex',
    flexDirection:'column',
    borderWidth:0
  },

  userNameWrapper__infoWrapper__primary:{
    fontWeight:700,
    fontSize:17,
    color:'#37474F'
  },

  userNameWrapper__infoWrapper__secondary:{
    fontWeight:500,
    fontSize:15,
    color: '#475569'
  }


})  
const fieldStyles = StyleSheet.create({
  fieldWrapper:{
    width:'100%',
    borderWidth:0,
    display:'flex',
    flexDirection:'column',
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
  }
})
const buttonStyles= StyleSheet.create({
  buttonContainers:{
    width:'100%',
    display:'flex',
    flexDirection:'column',
    gap:15,
    marginTop:30
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
    marginTop:35,
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