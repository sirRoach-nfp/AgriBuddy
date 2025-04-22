
import { Button, SafeAreaView, Text,TextInput,Touchable,TouchableOpacity,View } from "react-native"
import { StyleSheet } from "react-native"
import { Link, useRouter } from "expo-router"
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { router } from "expo-router";
export default function App(){
    const router = useRouter();


    return(

        <SafeAreaView style={styles.mainContainer}>









        <Text style={styles.signUpText}>
        Don't Have An Account ? 
        <TouchableOpacity onPress={() => {router.push('/(screens)/SignupPage')}}> 
            <Text style={styles.signUpTextClick}> Sign Up </Text>  
        </TouchableOpacity>
        </Text>


                








        </SafeAreaView>

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