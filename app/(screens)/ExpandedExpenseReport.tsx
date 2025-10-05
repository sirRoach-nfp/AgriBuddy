import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useUserContext } from '../Context/UserContext'
import { useSearchParams } from 'expo-router/build/hooks'
import { fetchSpecificRecord } from '../controllers/ExpenseControllers/fetchSpecificRecord'

//icon
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Dialog, MD3Colors, PaperProvider, Portal, ProgressBar } from 'react-native-paper'
import { router } from 'expo-router'
import { deleteExpenseRecord } from '../controllers/ExpenseControllers/deleteExpenseRecord'
import { useLanguage } from '../Context/LanguageContex'


interface cartItem{
    id:string,
    itemName : string,
    itemQuantity : number,
    itemPrice : number,
}


interface expenseLogData{
    title:string,
    date:Date,
    description:string,
    expenseId:string,
    total:number,
    items:cartItem[]
}


const ExpandedExpenseReport = () => {
    const {user} = useUserContext();
    const{language,setLanguage} = useLanguage()


    const searchParams = useSearchParams();
    const recordId = searchParams.get('ExpenseRefId')
    const [logData,setLogData] = useState<expenseLogData>()


    //modal controllers

    const [showDeletePostProcess,setShowDeleteProcess] = useState(false)
    const [showDeleteConfirmation,setShowDeleteConfirmation] = useState(false)
    const [loadingDelete,setLoadingDelete] = useState(false)
    const [deletePostLoading,setDeletePostLoading] = useState(false)
    const [showError,setShowError] = useState<boolean>(false)
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));


    useEffect(()=>{

        const fetchExpenseData = async()=>{
            try{

                if(recordId){

                    const fetchedLogData = await fetchSpecificRecord(user,recordId)
                    setLogData(fetchedLogData)
                }
               
            }catch(err){console.log(err)}
        }

        fetchExpenseData()

    },[recordId])

    


    const deleteRecord = async()=>{

        setShowDeleteConfirmation(false);
        setShowDeleteProcess(true);
        setLoadingDelete(true);

        try{
         


         await sleep(5)

        if(recordId){
        deleteExpenseRecord(user?.ExpensesRefId as string,recordId)
        }
         
        
        setLoadingDelete(false)
        

        }catch(err){
            setLoadingDelete(false)
            setShowDeleteProcess(false)
            setShowError(true)
        }
    }


        //modals------------------------------------------------------
    const renderDeleteConfirmation = () => (


   
        <Portal>

            <Dialog visible={showDeleteConfirmation} onDismiss={()=>{setShowDeleteConfirmation(false)}}>

                <Dialog.Title>
                    <Text>
                        {language === "en" ? "Delete Expense Record?" : "Tanggalin ang Rekord ng Gastos?"}
                    </Text>
                </Dialog.Title>

                <Dialog.Content>
                    <Text>
                        {language === "en" 
                            ? "This action will permanently remove this expense and all its items from your records. You won’t be able to undo this." 
                            : "Ang aksyong ito ay permanenteng magtatanggal ng gastos at lahat ng item nito mula sa iyong talaan. Hindi mo na ito maibabalik."}
                    </Text>
                </Dialog.Content>

                <Dialog.Actions>
                    <TouchableOpacity onPress={()=>{deleteRecord()}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                        <Text style={{color:'white'}}>
                            {language === "en" ? "Continue" : "Tuloy"}
                        </Text>

                    </TouchableOpacity>
                </Dialog.Actions>

            </Dialog>
        </Portal>
    )


    const renderProcessDeletePost = () => (
    
        <Portal>
            <Dialog visible={showDeletePostProcess} onDismiss={()=>{}}>

                {deletePostLoading ? (
                    <Dialog.Title>
                        <Text>
                            {language === "en" ? "Deleting Expense..." : "Binubura ang Gastos..."}
                        </Text>
                    </Dialog.Title>
                ) :(
                    <Dialog.Title>
                        <Text>
                            {language === "en" ? "Expense Deleted" : "Natanggal na ang Gastos"}
                        </Text>
                    </Dialog.Title>
                )}



                {deletePostLoading ? (
                    <Dialog.Content>
                        <Text>
                            {language === "en" ? 
                                "Please wait while we remove this record. This may take a few seconds." 
                                : 
                                "Maghintay habang tinatanggal namin ang rekord na ito. Maaaring tumagal ng ilang segundo."}
                        </Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                        <Text>
                            {language === "en" ? 
                                "The expense record has been successfully removed from your records!" 
                                : 
                                "Matagumpay nang natanggal ang rekord ng gastos sa iyong talaan!"}
                        </Text>
                    </Dialog.Content>
                )}



                {deletePostLoading ? (
                    <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                ) : (
                    <Dialog.Actions>

                        <TouchableOpacity onPress={()=>{router.push('/(main)/expenses')}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                            <Text style={{color:'white'}}>
                                {language === "en" ? "Continue" : "Tuloy"}
                            </Text>

                        </TouchableOpacity>

                    </Dialog.Actions>
                )}

            </Dialog>
        </Portal>
    )


    const renderError = ()=>(

        <Portal>
              <Dialog visible={showError} onDismiss={()=>setShowError(false)}>
      
                  <Dialog.Icon  icon="alert-circle" size={60} color='#ef9a9a'/>
      
                  <Dialog.Title>
                      <Text style={{color:'#37474F'}}>
                          {language === "en" ? "Something Went Wrong" : "May Nagkaproblema"}
                      </Text>
                      
                  </Dialog.Title>
                  
                  <Dialog.Content>
                      <Text style={{color:'#475569'}}>
                       {language === "en" ? "An unexpected error occured. Please try again later" : "Nagkaroon ng hindi inaasahang error. Pakisubukang muli mamaya."}
                        
                      </Text>
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

  
    return (


    <PaperProvider>
        {renderDeleteConfirmation()}
        {renderProcessDeletePost()}
        {renderError()}
        <SafeAreaView style={{display:'flex',flexDirection:'column',flex:1,borderWidth:0,borderColor:'red',alignItems:'center'}}>

            <ScrollView style={{width:'95%', borderWidth:0,borderColor:'blue',display:'flex',flexDirection:'column'}} contentContainerStyle={{alignItems:'center'}}>
                
                <View style={{width:'100%',maxHeight:50,height:50,
                display:'flex',flexDirection:'row',
                alignItems:'center',gap:10,marginBottom:10,borderWidth:0,justifyContent:'space-between',borderBottomWidth:1,borderColor:'#e2e8f0'

                }}>

                    <TouchableOpacity onPress={()=> router.back()} style={{borderWidth:0,padding:5}}>
                        <Ionicons name="arrow-back" size={25} color="#607D8B" />
                    </TouchableOpacity>
                    

                    <TouchableOpacity style={{borderWidth:0,padding:5}} onPress={()=>setShowDeleteConfirmation(true)}>
                        <MaterialIcons name="delete" size={24} color="#9E1C1E" />
                    </TouchableOpacity>
                    
                </View>

                
                <View style={[subContainers.UpperSubContainer,{gap:5}]}>
                    <Text style={textStyles.headerTitle}>
                        {logData?.title}
                    </Text>

    
                    <View style={{width:'100%',display:'flex',flexDirection:'row',alignItems:"center",borderWidth:0,justifyContent:'center'}}>
                        <Text style={[textStyles.formFieldDesc,{fontWeight:500}]}>
                            {logData?.date?.toLocaleDateString()}
                        </Text>
                    </View>





                </View>



                <View style={subContainers.DefaultInfoSubContainer}>
                    <View style={subContainers.DefaultInfoHeaderWrapper}>
                        <Text style={textStyles.defCardHeaderStyle}>Description</Text>
                    </View>

                    <View style={subContainers.DefaultContentWrapper}>
                        <Text style={textStyles.defCardContentStyle}>
                            {logData?.description}
                        </Text>
                    </View>
                </View>




                <View style={[subContainers.DefaultInfoSubContainer,{marginBottom:5}]}>
                    <View style={subContainers.DefaultInfoHeaderWrapper}>
                        <Text style={textStyles.defCardHeaderStyle}>Items and Expenses</Text>
                    </View>

                    <View style={[subContainers.DefaultContentWrapper,{display:'flex',flexDirection:'column',gap:5}]}>

                        {Array.isArray(logData?.items) && logData.items.length > 0 &&
                        logData.items.map((item, index) => (
                            <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                borderWidth: 0,
                                paddingVertical: 5,
                                borderColor: 'red',
                                width: '100%',
                            }}
                            key={index}
                            >
                            <View
                                style={{
                                flex: 1,
                                borderWidth: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 5,
                                }}
                            >
                                <Text
                                style={[
                                    textStyles.defCardHeaderStyle,
                                    { wordWrap: 'wrap', fontSize: 15, fontWeight: '700', color: '#64748B' },
                                ]}
                                >
                                {item.itemName}
                                </Text>
                                <Text style={{ fontSize: 14, color: '#64748B' }}>
                                Quantity: {item.itemQuantity}
                                </Text>
                            </View>

                            <View
                                style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignContent: 'flex-start',
                                borderWidth: 0,
                                paddingHorizontal: 10,
                                }}
                            >
                                <Text style={{ fontSize: 15, color: '#64748B', fontWeight: '600' }}>
                                {item.itemPrice}
                                </Text>
                            </View>
                            </View>
                        ))}

        

                        <View style={{display:'flex',flexDirection:'row',borderTopWidth:1,paddingVertical:5,borderColor:'#E2E8F0',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
                            <Text style={[textStyles.headerTitle,{fontSize:17}]}>Total Amount</Text>
                            <Text style={[textStyles.headerTitle,{fontSize:17,color:'#64748B'}]}>₱ {logData?.total}</Text>
                        </View>



                    </View>
                </View>


            

            </ScrollView>



        </SafeAreaView>
    </PaperProvider>
  )
}

export default ExpandedExpenseReport

const styles = StyleSheet.create({


    HeaderMainWrapper:{
        width:'100%',
        display:'flex',
        flexDirection:'column',
        borderWidth:1,
        paddingVertical:30,
    }
})


const subContainers = StyleSheet.create({


    UpperSubContainer:{
        width:'100%',
        display:'flex',
        flexDirection:'column',
        borderWidth:0,
        paddingVertical:30,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:20
    },

    DefaultInfoSubContainer:{
        width:'100%',
        display:'flex',
        flexDirection:'column',
        borderWidth:1,
        borderColor:'#E2E8F0',
        marginBottom:20,
        borderRadius:3,
        //gap:10
        //paddingVertical:30,
        //justifyContent:'center',
        //alignItems:'center'
    },

    DefaultInfoHeaderWrapper:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1,
        borderColor:'#E2E8F0',
        padding:20,
        backgroundColor:'#F8FAFC',
        borderStartEndRadius:3,
        borderTopEndRadius:3
    },

    DefaultContentWrapper:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderWidth:0,
        padding:20
    }
})

const textStyles = StyleSheet.create({
    headerTitle:{
        color:'#37474F',
        fontSize:20,
        fontWeight:700,
        fontFamily:'ui-sans-serif',
    },


    //form texts

    formHeaderMain:{
        color:'#37474F',
        fontSize:22,
        fontWeight:700,
         fontFamily:'ui-sans-serif',
    },


    formFieldDesc:{
        color:'#64748B',
        fontFamily:'ui-sans-serif',
        fontSize:15,
        fontWeight:700
    },

    //default cards styles

    defCardHeaderStyle:{
        color:'#37474F',
        fontSize:18,
        fontWeight:700,
        fontFamily:'ui-sans-serif',
    },

    defCardContentStyle:{
        fontSize:14,
        fontWeight:400,
        textAlign:"left"
    }


})