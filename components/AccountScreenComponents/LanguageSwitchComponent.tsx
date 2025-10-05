import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View,Switch} from 'react-native'


import { useLanguage } from '@/app/Context/LanguageContex'


const LanguageSwitchComponent = () => {
    const { language, setLanguage } = useLanguage();

    const [isTagalog, setIsTagalog] = useState(false);


    return(
        <View style={styles.mainWrapper}>
            <View style={styles.headerSection}>
                <View style={styles.headerSection__iconWrapper}>
                    <AntDesign name="setting" size={20} color="white" />
                </View>
                <Text style={styles.headerSection__primary}>
                  
                     {language === "en" ? "UI Language Setting" : "Setting ng Wika ng UI"}    
                </Text>
            </View>


            <View style={styles.mainWrapper__accountControls}>


                <View style={styles.accountControls__itemWrapper}>
                    <View style={[styles.accountControls__itemWrapper__iconWrapper,{backgroundColor:'#DEEEFF'}]}>
                        <MaterialCommunityIcons name="account-outline" size={20} color="#406091" />
                    </View>


                    <View style={styles.accountControls__itemWrapper__textWrapper}>
                        <Text style={styles.accountControls__itemWrapper__textWrapper__primary}>
                            {language === "en" ? "Change UI Language" : "Palitan ang Wika ng UI"}
                        </Text>

                        <Text style={styles.accountControls__itemWrapper__textWrapper__secondary}>
                            {language === "en" ? "Switch UI to Tagalog" : "Palitan sa Ingles ang UI"}
                            
                        </Text>
                    </View>

                    <Switch
                    value={language === "tl"}
                    onValueChange={(val) => setLanguage(val ? "tl" : "en")}
                    thumbColor={language === "tl" ? "#406091" : "#ccc"}
                    trackColor={{ false: "#ccc", true: "#99BBFF" }}
                    style={{ marginLeft: "auto" }}
                    />

                </View>


            </View>


        </View>
    )
}

export default LanguageSwitchComponent

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