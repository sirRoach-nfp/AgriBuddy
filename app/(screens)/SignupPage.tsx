import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebaseconfig'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { Dialog, MD3Colors, PaperProvider, Portal, ProgressBar } from 'react-native-paper'
import { router } from 'expo-router'

export default function SignupPage() {


    const [email,setEmail] = useState("")
    const [userName,setUsername] = useState("")
    const [password,setPassword] = useState("")


    const [showSignUpProcess,setShowSignUpProcess] = useState(false)
    const [processDone,setProcessDone] = useState(false)


    const [passwordWarningVisible,setPasswordWarningVisible] = useState(false)
    const [passwordWarning,setPasswordWarning] = useState("")

    const showSignUpProcessFun = () => {
        setShowSignUpProcess(true)
    }


    const hideSignUpProcessFun = () => {
        setShowSignUpProcess(false)
    }

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      };


    const renderPasswordWarning = (errorCode:string) => (

        


        <Portal>
            <Dialog visible={passwordWarningVisible} onDismiss={()=>setPasswordWarningVisible(false)}>

                <Dialog.Content>
                    <Text>{errorCode}</Text>
                </Dialog.Content>

            </Dialog>
        </Portal>
    )





    const renderSignUpProcess = () => (
        <Portal>
        <Dialog visible={showSignUpProcess} onDismiss={()=>{}} style={{borderWidth:0,paddingTop:10,paddingBottom:15}}>


            {processDone ? (

                <Dialog.Title style={{color:'#253D2C'}}><Text>Account Created</Text></Dialog.Title>

            ):(


                <Dialog.Title style={{color:'#253D2C'}}><Text>Creating Your Account</Text></Dialog.Title>

            )}
          



          {!processDone ? (
            <Dialog.Content>
                <Text style={{color:'#7F7B72'}}>Please wait while we create your account</Text>
            </Dialog.Content>

          ) : (

            <Dialog.Content>
                <Text style={{color:'#7F7B72'}} >Your account has been successfully created you can now proceed to login</Text>
            </Dialog.Content>

          )}




          {processDone ? (

                <Dialog.Actions>

                     <TouchableOpacity onPress={()=>{hideSignUpProcessFun()}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                            <Text style={{color:'white'}}>
                                Continue To Login
                            </Text>

                     </TouchableOpacity>
                     
                </Dialog.Actions>

          ) : (

            <ProgressBar indeterminate color={MD3Colors.error50} style={{width:'80%',marginLeft:'auto',marginRight:'auto'}} />
          )}

          

        </Dialog>
      </Portal>
      )
      




    const registerAccount = async(email:string,userName:string,password:string)=>{


        if(email.length === 0 || userName.length === 0 || password.length === 0){return}


        if(!isValidEmail(email)){
            setPasswordWarning("Please enter a valid email address")
            setPasswordWarningVisible(true);
            return
        }

        if(password.length < 6){
            setPasswordWarning("Password should be at least 6 characters long")
            setPasswordWarningVisible(true);
            return} 




        try{
            

            const usersRef = collection(db, "Users");
            const q = query(usersRef, where("Username", "==", userName));
            const querySnapshot = await getDocs(q);
        
            if (!querySnapshot.empty) {
              setPasswordWarning("Username already exists")
              setPasswordWarningVisible(true);
              return;
            }

            

            setProcessDone(false)
            showSignUpProcessFun()
            await new Promise(resolve => setTimeout(resolve, 5000));



            

            const userCredential = await createUserWithEmailAndPassword (auth, email, password);
            const user = userCredential.user
            const userId = user.uid
            


            const cropRotationPlanRefId = "CropRotationRef" +`${userName}` + Date.now().toString()
            const CurrentCropsRefId = "CurrentCropsRef" +`${userName}` + Date.now().toString()
            const PlotsRefId = "PlotsRefId" +`${userName}` + Date.now().toString()
            const RecordsRefId = "RecordsRefId" +`${userName}` + Date.now().toString()
            const DiscussionRecordRefId = "DiscussionRecordRefId" +`${userName}` + Date.now().toString()


            const newUserObject = {
                Email : email,
                Username : userName,
                CropRotationPlanRefId : cropRotationPlanRefId,
                CurrentCropsRefId : CurrentCropsRefId,
                PlotsRefId : PlotsRefId,
                RecordsRefId:RecordsRefId,
                DiscussionRecordRefId: DiscussionRecordRefId
            }

            await setDoc(doc(db,"Users",userId),newUserObject)


            await setDoc(doc(db,"Plots",PlotsRefId),{Plots:[]})
            await setDoc(doc(db,"Records",RecordsRefId),{PestLogs:[],DiseaseLogs:[],FertilizerLogs:[],PesticideLogs:[]})
            await setDoc(doc(db,"CurrentCrops",CurrentCropsRefId),{CurrentCrops:[]})
            await setDoc(doc(db,"CropRotationPlan",cropRotationPlanRefId),{Plans:[]})
            await setDoc(doc(db,"DiscussionRecords",DiscussionRecordRefId),{Discussions:[]})
            


            Alert.alert("Account Created Successfully")

            setProcessDone(true)


        }catch(err){
            console.error(err)
        }



    }



    useEffect(() => {
        console.log("Component mounted.");
    }, []);

  return (


    <PaperProvider>




  
        <SafeAreaView style={styles.mainContainer}>



                {renderSignUpProcess()}
                {renderPasswordWarning(passwordWarning)}
  



                <View style={styles.headerWrapper}>
                    <Text style={styles.headerTextMain}>Create An Account</Text>
                    <Text style={styles.headerTextSub}>Digitalize Your Farming Journey</Text>
                </View>




                <View style={styles.fieldsWrapper}>

                    
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputWrapperHeader}>Email : </Text>
                        <TextInput placeholder="YourAccount@gmail.com" style={styles.textInput} onChange={(e)=>setEmail(e.nativeEvent.text)} value={email}></TextInput>
                    </View>


                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputWrapperHeader}>Username : </Text>
                        <TextInput placeholder="Enter Your Username" style={styles.textInput} onChange={(e)=>setUsername(e.nativeEvent.text)} value={userName}></TextInput>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputWrapperHeader}>Password : </Text>
                        <TextInput placeholder="Enter Your Password" style={styles.textInput} onChange={(e)=>setPassword(e.nativeEvent.text)} value={password}></TextInput>
                    </View>

                    
                    <TouchableOpacity style={styles.logButtonWrapper} onPress={()=>registerAccount(email,userName,password)}>


                        <Text style={styles.logButtonText}>Signup</Text>


                    </TouchableOpacity>

                </View>


                <Text style={styles.signUpText}>

                    Already Have An Account ? <TouchableOpacity onPress={()=> router.push('/(screens)/LoginPage')}> <Text style={styles.signUpTextClick}> Login </Text>  </TouchableOpacity>
                </Text>









        </SafeAreaView>


    </PaperProvider>
  )
}



const styles = StyleSheet.create({


    mainContainer:{
      //borderWidth:1,
      flex:1,
      borderColor:'red',
      flexDirection:'column',
      display:"flex",
      alignItems:'center',
      paddingTop:50
    },



    headerWrapper:{
      width:'90%',
      //borderWidth:1,
      marginBottom:30
    },

    textInput:{
        borderWidth:1,
        padding:15,
        borderRadius:7
    },

    fieldsWrapper:{
        width:'90%',
        //borderWidth:1,
        marginTop:20,
        paddingTop:20,
        paddingBottom:20,
       
    },
    inputWrapper:{
        width:'100%',
        //borderWidth:1,
        borderColor:'red',
        display:'flex',
        flexDirection:'column',
        marginBottom:20
    },
    inputWrapperHeader:{
        fontSize:16,
        fontWeight:500,
        marginBottom:5
    },
    forgotPasswordButton:{
        //borderWidth:1,
        alignSelf:'flex-start',
        marginLeft:'auto',
        marginBottom:20
    },
    forgotPasswordText:{
        fontSize:13,
        color:'red',
        fontWeight:500,
        
    },
    logButtonWrapper:{
        width:'100%',
        //borderWidth:1,
        padding:10,
        borderRadius:7,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#253D2C'
    },
    logButtonText:{
        color:'#ffffff',
        fontSize:15
    },

    signUpText:{
        fontSize:15,
        marginTop:'auto',
        marginBottom:20,
        color:'#7F7B72'
    },
    signUpTextClick:{
        color:'#253D2C',
        fontWeight:500
    },
    headerTextMain:{
        color:'#253D2C',
        fontSize:25,
        fontWeight:600,
        marginBottom:5
    },
    headerTextSub:{
        color:'#7F7B72',
        fontSize:15
    }
  })