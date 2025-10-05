import { StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons'
import { text } from '@fortawesome/fontawesome-svg-core'
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'expo-datepicker';

import { Picker } from '@react-native-picker/picker'


//icon imports 
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


//controller
import { uploadExpenseController } from '../controllers/ExpenseControllers/uploadExpenses'
import { Dialog, MD3Colors, PaperProvider, Portal, ProgressBar } from 'react-native-paper'
import { router } from 'expo-router'
import { useUserContext } from '../Context/UserContext'
import { useLanguage } from '../Context/LanguageContex'




interface ItemObject{
    id:string,
    itemName : string,
    itemQuantity : number,
    itemPrice : number

}

const ExpensesRecords = () => {
   const{language,setLanguage} = useLanguage()
   const {user} = useUserContext();


   const [date,setNewDate] = useState(new Date());
   const [itemCart,setItemCart] = useState<ItemObject[]>([])
   const [title,setTitle] = useState<String>()
   const [description,setDescription] = useState<String>()
   const [total,setTotal] = useState<Number>(0)

   //modal controller
   const [showConfirmation,setShowConfirmation] = useState<boolean>(false)
   const [showProcess,setShowProcess] = useState<boolean>(false);
   const [showError,setShowError] = useState<boolean>(false)

   //loaders
   const [postLoading,setPostLoading] = useState<boolean>(false);


   //controllers
   const [showDatePicker,setShowDatePicker] = useState<boolean>(false)


   /*
   const [openCategoryDropDown,setOpenCategoryDropDown] = useState<boolean>(false)
   const [categoryValue,setCategoryValue] = useState<string>()

   const [categoryItems,setCategoryItems] = useState([
    {},{},{},
   ])
    */


    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));



   //input funcs
   const onchangeDate = (event:any,selectedDate:any) => {
        if (selectedDate) {
            setNewDate(selectedDate);
            setShowDatePicker(false)
        }
    }



    const addNewItem = () => {


        const newItem = {
            id: Date.now().toString(),
            itemName : "New Item",
            itemQuantity : 0,
            itemPrice : 0,

        }


        setItemCart(prev=>[...prev,newItem]);
    }


    const removeItem = (id:string) => {

        setItemCart(prev=> prev.filter(item => item.id !== id))
    }


    const handleOnChangeForItems = (id:string,field: keyof ItemObject, value : string | number) => {


        setItemCart(prev=> prev.map(item=> item.id === id ? {...item,[field] : value} : item))


    }


    //form submission


    const uploadExpenseRecordToStorage = async () => {
        // close confirm, open "processing"
        setShowConfirmation(false);
        setShowProcess(true);
        setPostLoading(true);

            try {
                if (!title || !date || !description || !itemCart) {
                throw new Error("Missing fields");
                }

                // Let the UI commit the modal BEFORE doing work
                await sleep(0);

                // do the real upload, but ensure the loader stays up at least 5s
                await Promise.all([
                // make sure this returns a Promise
                uploadExpenseController(user,title,date,description,itemCart,total),
                sleep(5000),
                ]);

                // switch modal content to "success"
                setPostLoading(false);

                

            } catch (err) {
                // on error: close modal and loader
                setPostLoading(false);
                setShowProcess(false);
            }
    };



    //helpers

    const isReadyToUpload = Boolean(title && description && itemCart);

    useEffect(()=>{

        const newTotal = itemCart.reduce((sum,item)=> sum + item.itemPrice * item.itemQuantity,0)
        setTotal(newTotal)

    },[itemCart])
   


  //modals

  
    const renderPostConfirmation = ()=>(

        <Portal>
            <Dialog visible={showConfirmation} onDismiss={()=>setShowConfirmation(false)}>

                <Dialog.Title>
                    <Text style={{color:'#37474F'}}>
                        {language === "en" ? "Upload Expense?" : "I-upload ang Gastos?"}
                    </Text>
                </Dialog.Title>
                
                <Dialog.Content>
                    <Text style={{color:'#475569'}}>
                        {language === "en" 
                            ? "Double-check the details. Do you want to upload this expense record now?" 
                            : "Suriin ang mga detalye. Gusto mo bang i-upload ang tala ng gastos ngayon?"}
                    </Text>
                </Dialog.Content>

                <Dialog.Actions>

                <TouchableOpacity onPress={uploadExpenseRecordToStorage} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                    <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                        {language === "en" ? "Post" : "I-upload"}
                    </Text>

                </TouchableOpacity>

                </Dialog.Actions>

            </Dialog>
        </Portal>

    )
     const renderProcess = () => (

        <Portal>
            <Dialog visible={showProcess} onDismiss={()=>{}}>

                <Dialog.Title>
                    <Text>
                        {language === "en" ? "Uploading Expense..." : "Ina-upload ang Gastos..."}
                    </Text>
                </Dialog.Title>

                {postLoading ? (
                    <Dialog.Content>
                        <Text>
                            {language === "en" 
                                ? "This may take a few seconds. Don’t close the app" 
                                : "Maaaring tumagal ng ilang segundo. Huwag isara ang app"}
                        </Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                        <Text>
                            {language === "en" 
                                ? "The record is now saved to your expenses!" 
                                : "Nai-save na ang tala sa iyong mga gastos!"}
                        </Text>
                    </Dialog.Content>
                )}

                {postLoading ? (
                    <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                ) : (
                    <Dialog.Actions>

                        <TouchableOpacity onPress={()=>{router.back()}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                            <Text style={{color:'white'}}>
                                {language === "en" ? "Continue" : "Tuloy"}
                            </Text>

                        </TouchableOpacity>

                    </Dialog.Actions>
                )}

            </Dialog>
        </Portal>
    )



    useEffect(() => {
    console.log("showProcess changed to:", showProcess);
    }, [showProcess]);

  return (

    <PaperProvider>
    {renderPostConfirmation()}
    {renderProcess()}

    
    <SafeAreaView  style={{flex:1,display:'flex',flexDirection:'column'}}>

        
        <ScrollView style={{flex:1,borderWidth:0,display:'flex',flexDirection:'column',gap:20,borderColor:'red'}} contentContainerStyle={{alignItems:'center'}}>
            <View style={{width:'100%',
           display:'flex',flexDirection:'row',
            alignItems:'center',gap:10,marginBottom:10,borderBottomWidth:1,paddingHorizontal:10,
            borderColor:'#e2e8f0',backgroundColor:'white'

            }}>

                <TouchableOpacity style={{
                    borderWidth:0,
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    justifyContent:'center',
                    padding:8,
                }} onPress={()=> router.back()}>
                    <Ionicons name="arrow-back" size={25} color="#607D8B" />
                </TouchableOpacity>
                
                <Text style={textStyles.headerTitle}>
                   {language === "en" ? "Create New Record" : "Gumawa ng Bagong Talaan"}
                </Text>
            </View>




            <View style={formWrapperStyles.formWrapperMain}>


                <View style={{width:'100%',alignContent:'flex-start',paddingVertical:25,
                  
                }}>

                    <Text style={textStyles.formHeaderMain}>{language === "en" ? "Basic Information" : "Pangunahing Impormasyon"}</Text>

                </View>

                <View style={formWrapperStyles.formFieldsWrapper}>
                    <Text style={textStyles.formFieldDesc}>
                        {language === "en" ? "Expense Title" : "Pamagat ng Gastos"} *
                    </Text>

                    <TextInput style={{borderWidth:1,borderRadius:3,fontSize:15,minHeight:20,
                        paddingTop:5,paddingBottom:5,borderColor:'#E2E8F0',paddingLeft:5,paddingRight:5
                    }} onChange={(e)=> {setTitle(e.nativeEvent.text)}}>

                    </TextInput>
                </View>



        

                

                <View style={formWrapperStyles.formFieldsWrapper}>
                    <Text style={textStyles.formFieldDesc}>
                        Start Date *
                    </Text>

                    <TouchableOpacity onPress={()=>setShowDatePicker(true)} 
                        style={{borderWidth:1,borderRadius:3,padding:5,borderColor:'#E2E8F0'}}
                        
                        >
                        <Text>{date.toDateString()}</Text>
                    </TouchableOpacity>


                    {showDatePicker && (
                            <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onchangeDate}
                            />
                    )}

                    
                </View>


                <View style={formWrapperStyles.formFieldsWrapper}>
                    <Text style={textStyles.formFieldDesc}>
                        Description
                    </Text>

                    <TextInput 
                    onChange={(e)=>setDescription(e.nativeEvent.text)}
                    style={{borderWidth:1,borderRadius:3,fontSize:15,minHeight:100,
                        paddingTop:5,paddingBottom:5,borderColor:'#E2E8F0',paddingLeft:5,paddingRight:5,
                        
                    }} multiline numberOfLines={5}>

                    </TextInput>
                </View>




            </View>


            <View style={formItemWrapperStyles.itemWrapperMainOuter}>

                <View style={formItemWrapperStyles.headerWrapperInner}>

                    <Text style={textStyles.headerTitle}>{language === "en" ? "Items & Expenses" : "Mga Binili at Gastos"}</Text>

                    <TouchableOpacity onPress={addNewItem}
                        style={{width:50,height:40,borderWidth:1,borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center',borderColor:'#607D8B'}}
                    >

                        <FontAwesome6 name="add" size={20} color="#607D8B" />
                    </TouchableOpacity>

                </View>

                


               {itemCart && itemCart.length > 0 && itemCart.map((content,index)=>(
                <View style={formItemWrapperStyles.itemContainer} key={content.id} >


                    <View style={[formWrapperStyles.formFieldsWrapper,{paddingVertical:10}]}>
                        <Text style={textStyles.formFieldDesc}>
                            {language === "en" ? "Item Name" : "Pangalan ng Produkto"}
                        </Text>

                        <TextInput value={content.itemName}  onChangeText={(text) => handleOnChangeForItems(content.id,'itemName',text)}  style={{borderWidth:1,borderRadius:3,fontSize:15,minHeight:20, 
                            paddingTop:5,paddingBottom:5,borderColor:'#E2E8F0',paddingLeft:5,paddingRight:5
                        }}>

                        </TextInput>
                    </View>

                    <View style={[formWrapperStyles.formFieldsWrapper,{paddingVertical:10}]}>
                        <Text style={textStyles.formFieldDesc}>
                            
                            {language === "en" ? "Quantity" : "Bilang"}
                        </Text>

                        <TextInput value={content.itemQuantity.toString()} onChangeText={(text) => handleOnChangeForItems(content.id,'itemQuantity',Number(text))}  style={{borderWidth:1,borderRadius:3,fontSize:15,minHeight:20,
                            paddingTop:5,paddingBottom:5,borderColor:'#E2E8F0',paddingLeft:5,paddingRight:5
                        }} keyboardType="numeric">

                        </TextInput>
                    </View>

                    <View style={[formWrapperStyles.formFieldsWrapper,{paddingVertical:10}]}>
                        <Text style={textStyles.formFieldDesc}>
                      
                            {language === "en" ? "Price" : "Presyo"}
                        </Text>

                        <TextInput value={content.itemPrice.toString()} onChangeText={(text) => handleOnChangeForItems(content.id,'itemPrice',Number(text))} style={{borderWidth:1,borderRadius:3,fontSize:15,minHeight:20,
                            paddingTop:5,paddingBottom:5,borderColor:'#E2E8F0',paddingLeft:5,paddingRight:5
                        }} keyboardType="numeric">

                        </TextInput>
                    </View>


                    <View style={{borderWidth:0,paddingVertical:5,display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                        <TouchableOpacity onPress={()=>removeItem(content.id)}
                            style={{borderWidth:0,padding:5}}
                        >
                            <FontAwesome name="trash" size={20} color="#EF4444" />

                        </TouchableOpacity>
                    </View>

                </View>
               ))}

                

            </View>





            <View style={formItemWrapperStyles.itemWrapperMainOuter}>
                <View style={formItemWrapperStyles.headerWrapperInner}>
                    <Text style={textStyles.headerTitle}>{language === "en" ? "Expense Summary" : "Buod Ng Gastos"}</Text>
                </View>

                <View style={{width:'100%',borderWidth:0,borderColor:'red',paddingHorizontal:10,paddingVertical:20}}>



                    {itemCart && itemCart.length > 0 && itemCart.map((item,index)=>(

                        <View key={index} style={{width:'100%',borderWidth:0,display:'flex',flexDirection:'row',justifyContent:'space-between',paddingVertical:10}}>
                            <Text style={{
                                color:'#64748B',
                                fontFamily:'ui-sans-serif',
                                fontSize:15,
                                fontWeight:600
                            }}>{item.itemName}</Text>
                            <Text style={{
                                color:'#64748B',
                                fontFamily:'ui-sans-serif',
                                fontSize:15,
                                fontWeight:600
                            }}>{item.itemQuantity} x {item.itemPrice}</Text>
                        </View>


                    ))}

                    <View style={{width:'100%',borderTopWidth:1,display:'flex',flexDirection:'row',justifyContent:'space-between',paddingVertical:10,borderColor:'#E2E8F0'}}>
                            <Text style={[textStyles.headerTitle,{fontSize:17}]}>Total : </Text>
                            <Text style={[textStyles.headerTitle,{fontSize:17}]}>{total.toString()}</Text>
                    </View>

                    <View style={{width:'100%',borderWidth:0,display:'flex',flexDirection:'column',justifyContent:'space-between',paddingVertical:20,gap:10}}>
                        <TouchableOpacity style={[{borderWidth:0,paddingVertical:10,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:3},
                            {backgroundColor:itemCart.length > 0 ? '#4F6B7A': '#CBD5E1'}
                        ]}

                        disabled={isReadyToUpload ? false : true}
                        onPress={()=> setShowConfirmation(true)}
                        >
                            <Text style={{
                                color:'white',
                                fontFamily:'ui-sans-serif',
                                fontSize:15,
                                fontWeight:700
                            }}>{language === "en" ? "Save Record" : "I-save ang Rekord"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{borderWidth:1,paddingVertical:10,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',borderColor:'#E2E8F0',borderRadius:3}}>
                            <Text style={{
                                color:'#94A3B8',
                                fontFamily:'ui-sans-serif',
                                fontSize:15,
                                fontWeight:600
                            }} onPress={()=> router.back()}>Cancel</Text>
                        </TouchableOpacity>
                    </View>




                </View>
            </View>


        </ScrollView> 
    </SafeAreaView>
    
    </PaperProvider>
  )
}

export default ExpensesRecords

const styles = StyleSheet.create({
    
})


const formItemWrapperStyles = StyleSheet.create({
    itemWrapperMainOuter:{
        width:'95%',
        display:'flex',
        flexDirection:'column',
        alignContent:'flex-start',
        paddingVertical:10,
        borderWidth:0,
        marginBottom:20,
        backgroundColor:'#FFFFFF',
        elevation:.5,
        borderRadius:3
    },

    headerWrapperInner:{
        width:'100%',
        paddingVertical:10,
        paddingHorizontal:10,
        display:'flex',
        flexDirection:'row',
        alignContent:'flex-start',
        borderWidth:0,
        alignItems:'center',
        justifyContent:'space-between'
    },


    itemContainer:{
        display:'flex',
        flexDirection:'column',
        padding:10,
        borderWidth:0,
        //borderColor:'red'
    }





})

const formWrapperStyles = StyleSheet.create({
    formWrapperMain:{
        width:'95%',
        borderWidth:0,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        alignContent:'flex-start',
        gap:10,
        flex:1,
        marginBottom:20,
        backgroundColor:'#FFFFFF',
        padding:10,
        elevation:.5
    },
    formFieldsWrapper:{
        width:'100%',
        paddingVertical:10,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        gap:10
    }
})


const textStyles = StyleSheet.create({
    headerTitle:{
        color:'#37474F',
        fontSize:18,
        fontWeight:700,
      
    },


    //form texts

    formHeaderMain:{
        color:'#37474F',
        fontSize:18,
        fontWeight:800,
         fontFamily:'ui-sans-serif',
    },


    formFieldDesc:{
        color:'#64748B',
        fontFamily:'ui-sans-serif',
        fontSize:15,
        fontWeight:700
    },


})