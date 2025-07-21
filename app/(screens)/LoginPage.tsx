
import { ActivityIndicator, Button, SafeAreaView, Text,TextInput,Touchable,TouchableOpacity,View } from "react-native"
import { StyleSheet } from "react-native"
import { Link } from "expo-router"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { router } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import { Dialog, PaperProvider, Portal } from "react-native-paper";
import { useUserContext } from "../Context/UserContext";
export default function LoginPage(){
    const {user,logout,storeUserData} = useUserContext();

    const [password,setPassword] = useState('');
    const [email,setEmail] = useState("")

    const [loginErrorVisible,setlogInErrorVisible] = useState(false);
    const [logProcess,SetLogProcess] = useState(false)
    const [loading,setLoading] = useState(false)


    const login = async(email:string,password:string) => {
        if(email.length === 0 || password.length === 0){return} 

        setLoading(true)

        


        

        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User ID : ",user.uid)



            const userRef = doc(db,'Users',user.uid);
            const userSnapShot = await getDoc(userRef);
            console.log("userSnapShot ",userSnapShot)
            if(userSnapShot.exists()){
                const userData = userSnapShot.data();
                console.log("userData ",userData)
                storeUserData(userData as any)
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
            }


       

            setLoading(false)
            router.replace('/(main)/home');
        }
        catch(err){
            console.error(err)
            setLoading(false)
            setlogInErrorVisible(true)
        }
    }






    const renderLogInError = () => (

        <Portal>
            <Dialog visible={loginErrorVisible} onDismiss={()=>setlogInErrorVisible(false)}>

                <Dialog.Content>
                    <Text>Email or Password is incorrect, Please try again</Text>
                </Dialog.Content>

            </Dialog>
        </Portal>

    )





    const renderLogInLoading = () => (

        <Portal>
        <Dialog
            visible={loading}
            onDismiss={() => {}}
            style={{
            width: 150,
            height: 150,
            alignSelf: 'center',
            borderRadius: 12,
            justifyContent: 'center',
            }}
        >
            <Dialog.Content
            style={{
                padding: 0, // removes the default padding
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
            <ActivityIndicator size={50} color="#607D8B" />
            </Dialog.Content>
        </Dialog>
        </Portal>

    )

    return(

        <PaperProvider>



        

        <SafeAreaView style={styles.mainContainer}>

                {renderLogInError()}
                {renderLogInLoading()}

                



                <View style={styles.headerWrapper}>
                    <Text style={styles.headerTextMain}>Hi, Welcome Back</Text>
                    <Text style={styles.headerTextSub}>Hello again! You've been missed</Text>
                </View>




                <View style={styles.fieldsWrapper}>

                    
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputWrapperHeader}>Email : </Text>
                        <TextInput onChange={(e)=>setEmail(e.nativeEvent.text)} placeholder="YourAccount@gmail.com" style={styles.textInput}></TextInput>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputWrapperHeader}>Password : </Text>
                        <TextInput secureTextEntry={true} onChange={(e)=>setPassword(e.nativeEvent.text)} placeholder="Enter Your Password" style={styles.textInput}></TextInput>
                    </View>


                    <TouchableOpacity style={styles.forgotPasswordButton}>
                        <Text style={styles.forgotPasswordText}>Forgot Password</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity style={styles.logButtonWrapper} onPress={()=>login(email,password)}>


                        <Text style={styles.logButtonText}>Login</Text>


                    </TouchableOpacity>

                </View>

             



                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 0,borderWidth:0,display:'flex' }}>
                    <Text style={styles.signUpText}>Don't Have An Account?</Text>
                    <TouchableOpacity onPress={() => router.push('/(screens)/SignupPage')}>
                        <Text style={styles.signUpTextClick}> Sign Up</Text>
                    </TouchableOpacity>
                </View>








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
        marginBottom:5,
        color:'#333333'
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
        backgroundColor:'#607D8B'
    },
    logButtonText:{
        color:'#ffffff',
        fontSize:15
    },

    signUpText:{
        fontSize:15,
        //marginTop:'auto',
        //marginBottom:20,
        color:'#7F7B72'
    },
    signUpTextClick:{
        color:'#253D2C',
        fontWeight:500
    },
    headerTextMain:{
        color:'#37474F',
        fontSize:25,
        fontWeight:600,
        marginBottom:5
    },
    headerTextSub:{
        color:'#333333',
        fontSize:15
    }
  })