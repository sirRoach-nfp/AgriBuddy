import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'

//icon import 
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/app/firebaseconfig';
import { useUserContext } from '@/app/Context/UserContext';
import { LanguageProvider, useLanguage } from '@/app/Context/LanguageContex';





  
const AccountControlComponent = () => {

   const {user,logout} = useUserContext();
  const {language,setLanguage} = useLanguage()
  const logoutAccount = async () => {
    try {
      console.log("Logging out...");
  
      // Sign out fr m Firebase
      await signOut(auth);
      console.log("User signed out from Firebase.");
  
      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem("userData");
      console.log("User data removed from AsyncStorage.");
      logout();
  
      // Redirect to login page
      router.replace('/(screens)/LoginPage'); // Update path as per your routing setup
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

    



    const navigateToUsernameChange = () => {
        router.push('/(screens)/AccountSubScreens/usernameControlScreen')
    }

    const navigateToPasswordChange = () => {
        router.push('/(screens)/AccountSubScreens/passwordControlScreen')
    }

  return (
    <View style={styles.mainWrapper}>
        <View style={styles.headerSection}>
            <View style={styles.headerSection__iconWrapper}>
                <AntDesign name="setting" size={20} color="white" />
            </View>
            <Text style={styles.headerSection__primary}>{language === "en" ? "Account Settings" : "Setting ng Account"}</Text>
        </View>
      


      <View style={styles.mainWrapper__accountControls}>

        <View style={styles.accountControls__itemWrapper}>

            <View style={[styles.accountControls__itemWrapper__iconWrapper,{backgroundColor:'#DEEEFF'}]}>
                <MaterialCommunityIcons name="account-outline" size={20} color="#406091" />
            </View>


            <View style={styles.accountControls__itemWrapper__textWrapper}>
                <Text style={styles.accountControls__itemWrapper__textWrapper__primary}>
                    {language === "en" ? "Change Username" : "Palitan ang Username"}
                </Text>

                <Text style={styles.accountControls__itemWrapper__textWrapper__secondary}>
                 {language === "en" ? "Update your display name" : "I-update ang iyong Display Name"}
                </Text>
            </View>

            <TouchableOpacity style={{borderWidth:0,padding:5,marginLeft:'auto'}} onPress={navigateToUsernameChange}>
                <MaterialCommunityIcons name="square-edit-outline" size={24} color="#607D8B" />
            </TouchableOpacity>

        </View>


        <View style={[styles.accountControls__itemWrapper,{borderTopWidth:1,borderBottomWidth:0,borderColor:'#e2e8f0'}]}>

            <View style={[styles.accountControls__itemWrapper__iconWrapper,{backgroundColor:'#E1F7E2'}]}>
        
                <MaterialIcons name="lock" size={20} color="#539974" />
            </View>


            <View style={styles.accountControls__itemWrapper__textWrapper}>
                <Text style={styles.accountControls__itemWrapper__textWrapper__primary}>
                    {language === "en" ? "Change Password" : "Palitan ang Password"}
                </Text>

                <Text style={styles.accountControls__itemWrapper__textWrapper__secondary}>
                    {language === "en" ? "Update your account password" : "I-update ang Password ng Account"}
                </Text>
            </View>

            <TouchableOpacity style={{borderWidth:0,padding:5,marginLeft:'auto'}} onPress={navigateToPasswordChange}>
                <MaterialCommunityIcons name="square-edit-outline" size={24} color="#607D8B" />
            </TouchableOpacity>

        </View>


        <View style={[styles.accountControls__itemWrapper,{display:'none'}]}>

            <View style={[styles.accountControls__itemWrapper__iconWrapper,{backgroundColor:'#FFDBDC'}]}>
        
                <MaterialIcons name="delete" size={20} color="red" />
            </View>


            <View style={styles.accountControls__itemWrapper__textWrapper}>
                <Text style={[styles.accountControls__itemWrapper__textWrapper__primary,{color:'red'}]}>
                    Delete Account
                </Text>

                <Text style={[styles.accountControls__itemWrapper__textWrapper__secondary,{color:'red'}]}>
                    Permanently remove your account
                </Text>
            </View>

            <TouchableOpacity style={{borderWidth:0,padding:5,marginLeft:'auto'}}>
                <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>

        </View>

      </View>


      <TouchableOpacity onPress={logoutAccount} style={{backgroundColor:'#FFDBDC',borderWidth:0,borderColor:'#B64D5E',display:'flex',flexDirection:'row',paddingVertical:10,alignItems:'center',justifyContent:'center',gap:10,borderRadius:5}}>
        <MaterialIcons name="logout" size={24} color="#B64D5E" />
        <Text style={{color:'#B64D5E',fontSize:16,fontWeight:600}}>Logout</Text>
      </TouchableOpacity>

    </View>
  )
}

export default AccountControlComponent

const styles = StyleSheet.create({

    mainWrapper:{
        width:'95%',
        display:'flex',
        flexDirection:'column',
        borderWidth:0,
        gap:15,
        marginTop:20,
        marginBottom:20

    },

    headerSection:{
        width:'100%',
        paddingTop:15,
        paddingHorizontal:10,
        borderWidth:0,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:10
    },

    headerSection__iconWrapper:{
        width:30,
        height:30,
        borderRadius:'50%',
        borderWidth:0,
        backgroundColor:'#607D8B',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'
    },

    headerSection__primary:{
        color:'#37474F',
        fontSize:18,
        fontWeight:600,
    },

    mainWrapper__accountControls:{
        width:'100%',
        display:'flex',
        flexDirection:'column',
        backgroundColor:'white',
        alignSelf:'flex-start',
        borderWidth:1,
        paddingVertical:10,
        borderRadius:5,
        borderColor:'#E2E8f0'
    
    },


    accountControls__itemWrapper:{
        width:'100%',
        paddingVertical:10,
        paddingLeft:15,
        borderWidth:0,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    accountControls__itemWrapper__iconWrapper:{
        width:30,
        height:30,
        borderRadius:'50%',
        borderWidth:0,
        marginRight:10,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },

    accountControls__itemWrapper__textWrapper:{
        display:'flex',
        flexDirection:'column'
    },


    //typography

    accountControls__itemWrapper__textWrapper__primary:{
        color:'#37474F',
        fontSize:16,
        fontWeight:600,
    },

    accountControls__itemWrapper__textWrapper__secondary:{
        color: '#475569',
        fontSize:14,
        fontWeight:400,
    }

})