
//icon
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather'
import { Picker } from '@react-native-picker/picker';




import { router } from 'expo-router'
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Touchable, ScrollView } from 'react-native'
import { Button, Dialog, MD3Colors, PaperProvider, Portal, ProgressBar } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { uploadReport } from '../controllers/ReportControllers/reportController';
import { useSearchParams } from 'expo-router/build/hooks';
import { serverTimestamp } from 'firebase/firestore';
import {globalStyles} from '../../assets/globalStyle'
import { useLanguage } from '../Context/LanguageContex';
const reportScreen = () => {

    const {language} = useLanguage()
    //use states --- data

    const [reportType,setReportType] = useState("Comment")
    const [reason,setReason] = useState("Spam")
    const [additionalInfo,setAdditionalInfo] = useState("")
    const [reportTitle,setReportTitle] = useState("");

    //metadata 
    const searchParams = useSearchParams()
    const discussionId = searchParams.get('PostRefId')
    const replyId = searchParams.get('ReplyRefId')
    const postTitle = searchParams.get('PostTitle')
    const postBody = searchParams.get('PostBody')
    const contentType = searchParams.get('ContentType')
    const contentAuthor = searchParams.get('Author')
    
    //modal controllers
    const[showConfirmation,setShowConfirmation] = useState(false)
    const[showError,setShowError] = useState(false)
    const [showProcess,setShowProcess] = useState(false)
    const[postLoading,setPostLoading] = useState(false)
    const [showInternetError,setShowInternetError] = useState(false)
    const isValid = true


    useEffect(()=>{

        const checkValid = () => {
            const valid = Boolean()
        }
    },[reportType,reason,additionalInfo])



    useEffect(()=> {
        setReportType(contentType as string)
    },[discussionId,postTitle,postBody,contentType])


    const checkParams = () => {

        console.log("discussionId : ",discussionId)
        console.log("discussionTitle : ",postTitle)
        console.log("discussionBody : ",postBody)
        console.log("contentType : ",contentType)
    }
    

    // modal
const renderPostConfirmation = ()=>(

        <Portal>
            <Dialog visible={showConfirmation} onDismiss={()=>setShowConfirmation(false)} style={globalStyles.dialogContainer}>


                <Dialog.Title>
                    <Text style={{color:'#37474F'}}>
                        {language === "en" ? "Confirm Report" : "Kumpirmahin ang Report"}
                    </Text>
                    
                </Dialog.Title>
                
                <Dialog.Content>
                    <Text style={{fontSize:16,color:'#475569'}}>  {language === "en"
                        ? "Are you sure you want to report this item? Please confirm so we can review it."
                        : "Sigurado ka bang gusto mong iulat ang item na ito? Paki-kumpirma upang aming masuri ito."
                    }</Text>
                </Dialog.Content>



                <Dialog.Actions>

                    <Button onPress={()=>setShowConfirmation(false)}             
                        mode="outlined"
                        style={globalStyles.buttonSecondary}
                        labelStyle={globalStyles.buttonLabelSecondary}>
                        {language === "en" ? "Cancel" : "Kanselahin"}
                    </Button>


                    <Button
                        mode="contained"
                        onPress={submitReport}
                        style={[globalStyles.buttonPrimary]}
                        labelStyle={globalStyles.buttonLabelPrimary}
                    >
                    {language === "en" ? "Submit Report" : "Isumite ang report"}
                    </Button>

                </Dialog.Actions>

            </Dialog>




        </Portal>

    )


    const renderError = ()=>(

        <Portal>
              <Dialog visible={showError} onDismiss={()=>setShowError(false)} style={globalStyles.dialogContainer}>
      
                  <Dialog.Icon  icon="alert-circle" size={60} color='#ef9a9a'/>
      
                  <Dialog.Title>
                      <Text style={{color:'#37474F'}}>
                          {language === "en" ? "Something Went Wrong" : "May Nagkaproblema"}
                      </Text>
                      
                  </Dialog.Title>
                  
                  <Dialog.Content>
                      <Text style={{fontSize:16,color:'#475569'}}>
                       {language === "en" ? "An unexpected error occured. Please try again later" : "Nagkaroon ng hindi inaasahang error. Pakisubukang muli mamaya."}
                        
                      </Text>
                  </Dialog.Content>
      
      
      
                  <Dialog.Actions>

                        <Button
                        mode="contained"
                        onPress={() => setShowError(false)}
                        style={[globalStyles.buttonPrimary, { alignSelf: 'flex-start' }]}
                        labelStyle={globalStyles.buttonLabelPrimary}
                        >
                        OK
                        </Button>
      
                  </Dialog.Actions>
      
              </Dialog>
      
          </Portal>

    )


    const renderSlowInternet = () => (
        <Portal>
            <Dialog visible={showInternetError} onDismiss={()=>setShowInternetError(false)} style={globalStyles.dialogContainer}>

                <Dialog.Icon  icon="alert-circle" size={60} color='#ef9a9a'/>

                <Dialog.Title>
                    <Text style={{color:'#37474F'}}>
                        {language === "en" ? "Slow Connection" : "Mabagal na Koneksyon"}
                    </Text>
                </Dialog.Title>
                
                <Dialog.Content>
                    <Text style={{fontSize:16,color:'#475569'}}>
                        {language === "en" ? "Connection seems slow. Please try again." : "Mabagal ang koneksyon. Pakisubukang muli."}
                    </Text>
                </Dialog.Content>

                <Dialog.Actions>
                    <Button
                    mode="contained"
                    onPress={() => setShowInternetError(false)}
                    style={[globalStyles.buttonPrimary, { alignSelf: 'flex-start' }]}
                    labelStyle={globalStyles.buttonLabelPrimary}
                    >
                    {language === "en" ? "OK" : "Sige"}
                    </Button>
                </Dialog.Actions>

            </Dialog>
        </Portal>
    )




    const renderProcess = () => (

        <Portal>
            <Dialog visible={showProcess} onDismiss={()=>{}} style={globalStyles.dialogContainer}>

                {postLoading ? (
                    <Dialog.Title>
                        {language === "en" ? "Submitting report..." : "Isinusumite ang ulat..."}
                    </Dialog.Title>
                ) :(
                    <Dialog.Title>
                       {language === "en" ? "Report submitted" : "Naipasa na ang ulat"}
                    </Dialog.Title>
                )}



                {postLoading ? (
                    <Dialog.Content>
                        <Text style={{fontSize:16,color:'#475569'}}>{language === "en" 
  ? "Your report is being submitted. Please wait while we process your request...." 
  : "Isinusumite ang iyong ulat. Mangyaring maghintay habang pinoproseso namin ang iyong report...."}</Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                    <Text style={{fontSize:16,color:'#475569'}}>{language === "en" 
  ? "Thank you. Your report has been successfully submitted and will be reviewed shortly." 
  : "Salamat. Matagumpay na naisumite ang iyong ulat at ito ay susuriin sa lalong madaling panahon."}</Text>
                    </Dialog.Content>
                )}



                {postLoading ? (
                    <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                ) : (
                    <Dialog.Actions>


                        <Button
                        mode="contained"
                        onPress={()=>{router.back()}}
                        style={[globalStyles.buttonPrimary]}
                        labelStyle={globalStyles.buttonLabelPrimary}
                        >
                        {language === "en" ? "Continue" : "Magpatuloy"}
                        </Button>

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

            //if post
            let newReport;
            let contentTitle = contentType === "Post" ? contentType : "";
            if(contentType === "Post"){
                newReport = {
                
                    id: Date.now().toString(),
                    reportType:reportType as string,
                    reportReason:reason as string,
                    reportTitle:reportTitle as string, 
                    additionalInfo:additionalInfo as string,
                    contentTitle:contentTitle as string,
                    contentBody:postBody as string,
                    postRefId: discussionId as string,
                    replyRefId:null,
                    author: contentAuthor as string,
                    createdAt: serverTimestamp(),
                    
                }
            } else {

                newReport = {
                
                    id: Date.now().toString(),
                    reportType:reportType as string,
                    reportReason:reason as string,
                    reportTitle:reportTitle as string, 
                    additionalInfo:additionalInfo as string,
                    contentTitle:null,
                    contentBody:postBody as string,
                    postRefId: discussionId as string,
                    replyRefId: replyId,
                    author: contentAuthor as string,
                    createdAt: serverTimestamp(),
                    
                }
            }
           


            const timeoutPromise = new Promise((_,reject)=>
                setTimeout(()=> reject(new Error("timeout")),20000)
            )

            await Promise.race([uploadReport(newReport),timeoutPromise])

            //await uploadReport(newReport);
      
            setPostLoading(false)
            console.log("Report data : ", newReport)
        }catch(err:any){
            setShowProcess(false)
            setPostLoading(false)
            

            if(err.message === "timeout") {
                setShowInternetError(true)
            } else {
                setShowError(true)
            }

        
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
            {renderSlowInternet()}
            <SafeAreaView style={styles.mainWrapper}>
                <View style={styles.headerContainer}>


                    <TouchableOpacity onPress={()=> router.back()} style={{marginLeft:10}}>
                        <Feather name="x" size={24} color="black"  />
                    </TouchableOpacity>



                        
                    <Text style={styles.typo__headerMain__primary}>{language === "en" ? "Report Content" : "Iulat ang Nilalaman"}</Text>
        

                </View>
                <ScrollView style={styles.scrollContainer}>


                    <View style={[styles.itemWrapper,{display:'flex',flexDirection:'row',alignItems:'center'}]}>
                        <View style={{borderWidth:1,padding:5,borderRadius:'50%',alignSelf:'flex-start',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <AntDesign name="warning" size={20} color="black" />
                        </View>


                        
                        <Text style={[styles.typo__Secondary,{marginHorizontal:3,}]}>
                           {language === "en" 
                            ? "Help us keep the community safe and accurate. Please select a reason for reporting this item." 
                            : "Tulungan kaming panatilihing ligtas at tama ang komunidad. Pumili ng dahilan para iulat ang item na ito."}
                        </Text>
               
                    </View>




                    <View style={[styles.itemWrapper,{display:'flex',flexDirection:'column'}]} pointerEvents="none">
                        <Text style={styles.itemWrapper__primary}>{language === "en" ? "What are you reporting?" : "Ano ang iyong inuulat?"}
                        </Text>

                        <View style={{width:'100%',borderWidth:1,borderRadius:5,borderColor:'#E2E8f0',marginVertical:10}}>
    
                            <Picker
                                selectedValue={reportType}
                                onValueChange={setReportType}
                                style={{width:'100%',backgroundColor:'white',borderRadius:5}}
                                
                            >   
                     
                                <Picker.Item key="Comment" label="Comment" value="Comment"/>
                                <Picker.Item key="Post" label="Post" value="Post"/>
                              
                           
                            </Picker>
    
                        </View>
                    </View>



                    <View style={[styles.itemWrapper,{display:'flex',flexDirection:'column'}]}>
                        <Text style={styles.itemWrapper__primary}>{language === "en" ? "Reason for Report" : "Dahilan ng Ulat"}</Text>

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
                        <Text style={styles.itemWrapper__primary}>{language === "en" ? "Report title (optional)" : "Pamagat ng ulat (opsyonal)"}
                        </Text>

                        <TextInput maxLength={150} onChange={(e)=>setReportTitle(e.nativeEvent.text)} placeholder="Report title..." textAlignVertical="top" style={styles.TextInput}></TextInput>
                        

                        <View style={{paddingVertical:5,width:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                            <Text style={[styles.typo__Secondary]}>{reportTitle.length}/150</Text>
                            <Text style={[styles.typo__Secondary]}>{language === "en" ? "Help us understand the issue better" : "Tulungan kaming mas maunawaan ang isyu"}
                            </Text>   
                            
                        </View>
                       
                    </View>

                    <View style={[styles.itemWrapper,{display:'flex',flexDirection:'column',height:250}]}>
                        <Text style={styles.itemWrapper__primary}>Additional Details? (Optional)</Text>

                        <TextInput maxLength={1000} onChange={(e)=>setAdditionalInfo(e.nativeEvent.text)} placeholder="Your Comment....." numberOfLines={20} multiline={true} textAlignVertical="top" style={styles.TextInput}></TextInput>
                        

                        <View style={{paddingVertical:5,width:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                            <Text style={[styles.typo__Secondary]}>{additionalInfo.length}/500</Text>
                            <Text style={[styles.typo__Secondary]}>{language === "en" ? "Help us understand the issue better" : "Tulungan kaming mas maunawaan ang isyu"}
                            </Text>   
                            
                        </View>
                       
                    </View>

                    <TouchableOpacity onPress={()=>setShowConfirmation(true)} style={[isValid ? buttonStyle.postButton__active : buttonStyle.postButton__disabled,{marginBottom:20}]}>
                        <Text style={{fontWeight:500,fontSize:15,color:'#ECF4F7'}}>
                           {language === "en" ? "Submit Report" : "Isumite ang Ulat"}

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