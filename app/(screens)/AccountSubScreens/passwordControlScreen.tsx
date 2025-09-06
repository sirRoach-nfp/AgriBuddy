import {StyleSheet, Text, TouchableOpacity, View,ScrollView,TextInput, Button, Touchable } from 'react-native'
import React, { useState } from 'react'
import { Dialog, PaperProvider, Portal } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useUserContext } from '@/app/Context/UserContext'
import { sendPasswordResetEmail } from 'firebase/auth'
import { sendPaswordRequestToEmail } from '@/app/controllers/AccountAuth/Auth'

const passwordControlScreen = () => {

  const {user} = useUserContext()

  const [currentPassword,setCurrentPassword] = useState("")
  const [newPassword,setNewPassword] = useState("")
  const [confirmNewPassword,setConfirmNewPassword] = useState("")


  const [error,setError] = useState("")


  const isFieldsValid = (currentPassword: string,newPassword : string, confirmedNewPassword : string) => {

    const isFieldsNotEmpty =  newPassword.length > 0 && confirmedNewPassword.length > 0 && currentPassword.length > 0
    
    return isFieldsNotEmpty
  }

  const isValid = isFieldsValid(currentPassword,newPassword,confirmNewPassword)




  //modal controller


  const[showSuccess,setShowSuccess] = useState(false)
  const [showError,setShowError] = useState<boolean>(false)

  //modal

    const renderSuccess = () => (
      <Portal>
        
        <Dialog visible={showSuccess} >
  
          <Dialog.Title>
            <Text style={{color:'#37474F'}}>
              Password Reset Link Sent!
            </Text>
          </Dialog.Title>
  
          <Dialog.Content>
            <Text style={{color:'#475569'}}>
              We’ve sent a password reset link to your email. Please check your inbox (and spam folder just in case) and follow the instructions to reset your password.
            </Text>
          </Dialog.Content>
  
  
          <Dialog.Actions>
  
  
  
  
            <TouchableOpacity onPress={() => setShowSuccess(false)} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
  
                <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                    Continue
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

  const changePassword = async() =>{

    try{  

      const email =  user?.Email as string
      await sendPaswordRequestToEmail(email)
      setShowSuccess(true)

    }catch(err){
      setShowError(true)
      console.log(err)
    }
  }


  return (
    <PaperProvider>

      {renderSuccess()}
      {renderError()}
      <SafeAreaView style={styles.mainContainer}>
        
        <View style={styles.header}>

            <TouchableOpacity onPress={()=> router.back()} style={{marginLeft:10}}>
               <Ionicons name="arrow-back" size={25} color="#607D8B" />
            </TouchableOpacity>



            <Text style={{fontSize:20,fontWeight:600,color:'#37474F',marginLeft:20}}>Change Password Request</Text>

        </View>

        <ScrollView style={styles.scrollContainer}>


            <View style={noteStyles.noteWrapper}>
              <View style={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',paddingVertical:10}}>
                  <MaterialIcons name="lock" size={25} color="#BFA76F" />
                  <Text style={noteStyles.header}>Security Tips</Text>
              </View>
              

              <View style={noteStyles.textWrapper}>
                <Text style={noteStyles.textWrapper__bullet}>
                  •
                </Text>
                <Text style={noteStyles.textWrapper__text}>
                  Use a unique password
                </Text>

              </View>

              <View style={noteStyles.textWrapper}>
                <Text style={noteStyles.textWrapper__bullet}>
                  •
                </Text>

                <Text style={noteStyles.textWrapper__text}>
                  Don't share your password with anyone
                </Text>

              </View>

              <View style={noteStyles.textWrapper}>

                <Text style={noteStyles.textWrapper__bullet}>
                  •
                </Text>

                <Text style={noteStyles.textWrapper__text}>
                  Change your password regularly
                </Text>

            </View>

  
            </View>
          
            <View style={[fieldStyles.fieldWrapper,{marginBottom:10}]}>
              <Text style={fieldStyles.fieldWrapperLabel}>
                Email
              </Text>

              <TextInput editable={false} style={fieldStyles.textInput} placeholder='Enter New Username' value={user?.Email} onChange={(e)=>setCurrentPassword(e.nativeEvent.text)}/>
            </View>



            <View style={buttonStyles.buttonContainers}>

              <TouchableOpacity  style={{display:'flex',
                backgroundColor:  '#607D8B',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                paddingVertical:10,
                borderRadius:5,
                
                }}
                onPress={changePassword}
                >
                <Text style={{color:'white',fontSize:16, fontWeight:600}}>Send Reset Link</Text>
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
                <Text style={{color:'#37474F',fontSize:16, fontWeight:600}}>Didn't mean to reset?</Text>
              </TouchableOpacity>

            </View>


            



        </ScrollView>

      </SafeAreaView>

    </PaperProvider>
  )
}

export default passwordControlScreen

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
    padding:10,
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
    backgroundColor:'#FEFBEA',
    borderRadius:5,
    borderColor:'#F0EEc8',
    borderWidth:1,
    marginTop:15,
    marginBottom:20,
  },

  header:{
    fontSize:17,
    fontWeight:600,
    color:'#70523b',
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
    color:'#AD9075',
  },

  textWrapper__text:{
    fontSize:16,
    fontWeight:400,
    color:'#AD9075',
  }


})