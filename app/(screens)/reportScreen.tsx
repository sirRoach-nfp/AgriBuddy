
//icon
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather'
import { Picker } from '@react-native-picker/picker';




import { router } from 'expo-router'
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Touchable, ScrollView } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const reportScreen = () => {


    //use states --- data

    const [reportType,setReportType] = useState("Comment")
    const [reason,setReason] = useState("Select a reason")
    const [additionalInfo,setAdditionalInfo] = useState("")



    const isValid = true


    useEffect(()=>{

        const checkValid = () => {
            const valid = Boolean()
        }
    },[reportType,reason,additionalInfo])




    return(<>

        <PaperProvider>

            <SafeAreaView style={styles.mainWrapper}>
                <View style={styles.headerContainer}>


                    <TouchableOpacity onPress={()=> router.back()} style={{marginLeft:10}}>
                        <Feather name="x" size={24} color="black"  />
                    </TouchableOpacity>



                        
                    <Text style={styles.typo__headerMain__primary}>Report Content</Text>
        

                </View>
                <ScrollView style={styles.scrollContainer}>


                    <View style={[styles.itemWrapper,{display:'flex',flexDirection:'row',alignItems:'center'}]}>
                        <View style={{borderWidth:1,padding:5,borderRadius:'50%',alignSelf:'flex-start',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <AntDesign name="warning" size={20} color="black" />
                        </View>


                        
                        <Text style={[styles.typo__Secondary,{marginHorizontal:3,}]}>
                            Help us keep the community safe and accurate. Please select a reason for reporting this item.
                        </Text>
               
                    </View>




                    <View style={[styles.itemWrapper,{display:'flex',flexDirection:'column'}]}>
                        <Text style={styles.itemWrapper__primary}>What are you reporting?</Text>

                        <View style={{width:'100%',borderWidth:1,borderRadius:5,borderColor:'#E2E8f0',marginVertical:10}}>
    
                            <Picker
                                selectedValue={reportType}
                                onValueChange={setReportType}
                                style={{width:'100%',backgroundColor:'white',borderRadius:5}}
    
                            >
                                <Picker.Item key="Comment" label="Comment" value="Comment"/>
                                <Picker.Item key="Post" label="Post" value="Post"/>
                                <Picker.Item key="Crop__Data" label="Crop Data" value="Crop__Data"/>
                           
                            </Picker>
    
                        </View>
                    </View>



                    <View style={[styles.itemWrapper,{display:'flex',flexDirection:'column'}]}>
                        <Text style={styles.itemWrapper__primary}>Reason for Report</Text>

                        <View style={{width:'100%',borderWidth:1,borderRadius:5,borderColor:'#E2E8f0',marginVertical:10}}>
    
                            <Picker
                                selectedValue={reportType}
                                onValueChange={setReportType}
                                style={{width:'100%',backgroundColor:'white',borderRadius:5}}
    
                            >
                                <Picker.Item key="Comment" label="Comment" value="Comment"/>
                                <Picker.Item key="Post" label="Post" value="Post"/>
                                <Picker.Item key="Crop__Data" label="Crop Data" value="Crop__Data"/>
                           
                            </Picker>
    
                        </View>
                    </View>




                    <View style={[styles.itemWrapper,{display:'flex',flexDirection:'column',height:250}]}>
                        <Text style={styles.itemWrapper__primary}>Additional Details? (Optional)</Text>

                        <TextInput maxLength={1000} onChange={(e)=>setAdditionalInfo(e.nativeEvent.text)} placeholder="Your Comment....." numberOfLines={20} multiline={true} textAlignVertical="top" style={styles.TextInput}></TextInput>
                        

                        <View style={{paddingVertical:5,width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <Text style={[styles.typo__Secondary]}>Help us understand the issue better</Text>   
                            <Text style={[styles.typo__Secondary]}>{additionalInfo.length}/500</Text>
                        </View>
                       
                    </View>

                    <TouchableOpacity style={[isValid ? buttonStyle.postButton__active : buttonStyle.postButton__disabled,{marginBottom:20}]}>
                        <Text style={{fontWeight:500,fontSize:15,color:'#ECF4F7'}}>
                            Submit report
                        </Text>
                    </TouchableOpacity>


                </ScrollView>
            </SafeAreaView>


        </PaperProvider>
    
    </>)
}



const styles = StyleSheet.create({
    
    headerContainer:{
        width:'100%',
        paddingVertical:5,
        borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        minHeight:50,
        //backgroundColor:'#2E6F40',
        //marginBottom:20,
        backgroundColor:'white'
    },


    mainWrapper:{
        display:'flex',
        flex:1,
        flexDirection:'column',
        width:'100%',
        borderWidth:1,
        alignItems:'center',
        backgroundColor:'#F4F5F7',

    },


    scrollContainer:{
        display:'flex',
        width:'100%',
        flexDirection:'column',
        paddingVertical:10,
        paddingHorizontal:10,
        flex:1,
        borderWidth:1,
        paddingTop:10
    },


    itemWrapper:{
       
        paddingVertical:10,
        paddingHorizontal:10,
        borderWidth:1,
        backgroundColor:'white',
        borderRadius:5,
        borderColor:"#E2E8f0",
        marginBottom:10,
    },

    itemWrapper__primary:{
        fontSize:16,
        color: '#475569',
        fontWeight:600,
    },


    TextInput:{
        width:'100%',
        borderWidth:1,
        flex:1,
        fontSize:16,
        marginVertical:10,
        padding:15,
        height:'100%',
        borderColor:"#E2E8f0",
    },
    typo__Secondary:{
        fontSize:14,
        fontWeight:400,
        color:'red'
    },
    typo__headerMain__primary:{
        fontSize:17,
        fontWeight:600,
        marginLeft:10,
    }
})

const buttonStyle = StyleSheet.create({
    postButton__active:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
        paddingHorizontal:30,
        borderWidth:0,
        borderRadius:5,
        marginLeft:'auto',
        marginRight:10,
        gap:10,
        backgroundColor:'#607D8B',
        width:'100%'
    },

    postButton__disabled:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
        paddingHorizontal:30,
        borderWidth:0,
        borderRadius:5,
        marginLeft:'auto',
        marginRight:10,
        gap:10,
        backgroundColor:'#AFBDC8',
        width:'100%'
    },
})
export default reportScreen