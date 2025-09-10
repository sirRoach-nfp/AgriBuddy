
//icon
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather'
import { Picker } from '@react-native-picker/picker';




import { router } from 'expo-router'
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Touchable, ScrollView } from 'react-native'
import { Dialog, MD3Colors, PaperProvider, Portal, ProgressBar } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { uploadReport } from '../controllers/ReportControllers/reportController';

const reportScreen = () => {


    //use states --- data

    const [reportType,setReportType] = useState("Comment")
    const [reason,setReason] = useState("Spam")
    const [additionalInfo,setAdditionalInfo] = useState("")



    //modal controllers
    const[showConfirmation,setShowConfirmation] = useState(false)
    const[showError,setShowError] = useState(false)
    const [showProcess,setShowProcess] = useState(false)
    const[postLoading,setPostLoading] = useState(false)
    const isValid = true


    useEffect(()=>{

        const checkValid = () => {
            const valid = Boolean()
        }
    },[reportType,reason,additionalInfo])





    

    // modal
const renderPostConfirmation = ()=>(

        <Portal>
            <Dialog visible={showConfirmation} onDismiss={()=>setShowConfirmation(false)}>


                <Dialog.Title>
                    <Text style={{color:'#37474F'}}>
                        Confirm Report
                    </Text>
                    
                </Dialog.Title>
                
                <Dialog.Content>
                    <Text style={{color:'#475569'}}>Are you sure you want to report this item? Please confirm so we can review it.</Text>
                </Dialog.Content>



                <Dialog.Actions>

                <TouchableOpacity onPress={submitReport} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                    <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                        Submit
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




    const renderProcess = () => (

        <Portal>
            <Dialog visible={showProcess} onDismiss={()=>{}}>

                {postLoading ? (
                    <Dialog.Title>
                        Submitting Report
                    </Dialog.Title>
                ) :(
                    <Dialog.Title>
                        Report Submitted
                    </Dialog.Title>
                )}



                {postLoading ? (
                    <Dialog.Content>
                        <Text>Your report is being submitted. Please wait while we process your request....</Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                    <Text>Thank you. Your report has been successfully submitted and will be reviewed shortly.</Text>
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


    const submitReport = async() => {

        setShowConfirmation(false)
        setPostLoading(true)
        setShowProcess(true)
        try{
            const newReport = {
               
                id: Date.now().toString(),
                reportType:reportType,
                reportReason:reason,
                additionalInfo:additionalInfo,
            }

            await uploadReport(newReport);
      
            setPostLoading(false)
            console.log("Report data : ", newReport)
        }catch(err){
            setPostLoading(false)
            setShowProcess(false)
            setShowError(true)
        }
    }

    //helper
      const isFieldsValid = (reason : string, contentType : string) => {
                /*
                const isFieldsNotEmpty =  newUsername.length > 0 && confirmNewUsername.length > 0
                const isUsernameMatched = newUsername === confirmNewUsername
                return isFieldsNotEmpty && isUsernameMatched
                */
        }

    return(<>

        <PaperProvider>
            {renderPostConfirmation()}
            {renderError()}
            {renderProcess()}
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
                                selectedValue={reason}
                                onValueChange={setReason}
                                style={{width:'100%',backgroundColor:'white',borderRadius:5}}
    
                            >   
                         
                                <Picker.Item key="Spam" label="Spam Or Unwanted Content" value="Spam"/>
                                <Picker.Item key="Bullying" label="Harassment or Bullying" value="Harassment"/>
                                <Picker.Item key="FalseInformation" label="False or Misleading Information" value="FalseInformation"/>
                                <Picker.Item key="InappropriateContent" label="Inappropriate Content" value="InappropriateContent"/>
                                
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

                    <TouchableOpacity onPress={()=>setShowConfirmation(true)} style={[isValid ? buttonStyle.postButton__active : buttonStyle.postButton__disabled,{marginBottom:20}]}>
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
        borderBottomWidth:1,
        borderColor:"#e2e8f0",
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
        borderWidth:0,
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
        borderWidth:0,
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
        color:'#64748B'
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