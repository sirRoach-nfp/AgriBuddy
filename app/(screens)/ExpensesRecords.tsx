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






interface ItemObject{
    id:string,
    itemName : string,
    itemQuantity : number,
    itemPrice : number

}

const ExpensesRecords = () => {




   const [date,setNewDate] = useState(new Date());
   const [itemCart,setItemCart] = useState<ItemObject[]>([])
   const [title,setTitle] = useState<String>()
   const [description,setDescription] = useState<String>()
   const [total,setTotal] = useState<Number>(0)
   //controllers
   const [showDatePicker,setShowDatePicker] = useState<boolean>(false)


   /*
   const [openCategoryDropDown,setOpenCategoryDropDown] = useState<boolean>(false)
   const [categoryValue,setCategoryValue] = useState<string>()

   const [categoryItems,setCategoryItems] = useState([
    {},{},{},
   ])
    */






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


    const uploadExpenseRecordToStorage = () => {



        const recordObject = {
            title:title,
            date:date,
            description:description,
            items:itemCart

        }

        console.log(recordObject)
    }



    //helpers

    useEffect(()=>{

        const newTotal = itemCart.reduce((sum,item)=> sum + item.itemPrice * item.itemQuantity,0)
        setTotal(newTotal)

    },[itemCart])
   

  return (
    <SafeAreaView  style={{flex:1,display:'flex',flexDirection:'column'}}>


        <ScrollView style={{flex:1,borderWidth:1,display:'flex',flexDirection:'column',gap:20,borderColor:'red'}} contentContainerStyle={{alignItems:'center'}}>
            <View style={{width:'100%',maxHeight:50,height:50,
           display:'flex',flexDirection:'row',
            alignItems:'center',gap:10,marginBottom:10

            }}>

                <Ionicons name="arrow-back" size={25} color="#607D8B" />
                <Text style={textStyles.headerTitle}>
                    Create New Record
                </Text>
            </View>




            <View style={formWrapperStyles.formWrapperMain}>


                <View style={{width:'100%',alignContent:'flex-start',paddingVertical:25,
                  
                }}>

                    <Text style={textStyles.formHeaderMain}>Basic Information</Text>

                </View>

                <View style={formWrapperStyles.formFieldsWrapper}>
                    <Text style={textStyles.formFieldDesc}>
                        Expense Title *
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

                    <Text style={textStyles.headerTitle}>Items & Expenses</Text>

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
                            Item Name
                        </Text>

                        <TextInput value={content.itemName}  onChangeText={(text) => handleOnChangeForItems(content.id,'itemName',text)}  style={{borderWidth:1,borderRadius:3,fontSize:15,minHeight:20, 
                            paddingTop:5,paddingBottom:5,borderColor:'#E2E8F0',paddingLeft:5,paddingRight:5
                        }}>

                        </TextInput>
                    </View>

                    <View style={[formWrapperStyles.formFieldsWrapper,{paddingVertical:10}]}>
                        <Text style={textStyles.formFieldDesc}>
                            Quantity
                        </Text>

                        <TextInput value={content.itemQuantity.toString()} onChangeText={(text) => handleOnChangeForItems(content.id,'itemQuantity',Number(text))}  style={{borderWidth:1,borderRadius:3,fontSize:15,minHeight:20,
                            paddingTop:5,paddingBottom:5,borderColor:'#E2E8F0',paddingLeft:5,paddingRight:5
                        }} keyboardType="numeric">

                        </TextInput>
                    </View>

                    <View style={[formWrapperStyles.formFieldsWrapper,{paddingVertical:10}]}>
                        <Text style={textStyles.formFieldDesc}>
                            Price
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
                    <Text style={textStyles.headerTitle}>Expense Summary</Text>
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

                        disabled={itemCart.length > 0 ? false : true}
                        onPress={uploadExpenseRecordToStorage}
                        >
                            <Text style={{
                                color:'white',
                                fontFamily:'ui-sans-serif',
                                fontSize:15,
                                fontWeight:700
                            }}>Save Record</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{borderWidth:1,paddingVertical:10,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',borderColor:'#E2E8F0',borderRadius:3}}>
                            <Text style={{
                                color:'#94A3B8',
                                fontFamily:'ui-sans-serif',
                                fontSize:15,
                                fontWeight:600
                            }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>




                </View>
            </View>


        </ScrollView> 
    </SafeAreaView>
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


})