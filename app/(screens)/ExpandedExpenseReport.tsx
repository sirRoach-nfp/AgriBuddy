import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons'





const ExpandedExpenseReport = () => {
    



  
  
    return (
    <SafeAreaView style={{display:'flex',flexDirection:'column',flex:1,borderWidth:1,borderColor:'red',alignItems:'center'}}>

        <ScrollView style={{width:'95%', borderWidth:0,borderColor:'blue',display:'flex',flexDirection:'column'}} contentContainerStyle={{alignItems:'center'}}>
            
            <View style={{width:'100%',maxHeight:50,height:50,
            display:'flex',flexDirection:'row',
            alignItems:'center',gap:10,marginBottom:10,borderWidth:0,

            }}>

                <Ionicons name="arrow-back" size={25} color="#607D8B" />
                
            </View>

            
            <View style={[subContainers.UpperSubContainer,{gap:5}]}>
                <Text style={textStyles.headerTitle}>
                    Title Placeholder
                </Text>

 
                <View style={{width:'100%',display:'flex',flexDirection:'row',alignItems:"center",borderWidth:0,justifyContent:'center'}}>
                    <Text style={[textStyles.formFieldDesc,{fontWeight:500}]}>
                        Date Placeholder
                    </Text>
                </View>





            </View>



            <View style={subContainers.DefaultInfoSubContainer}>
                <View style={subContainers.DefaultInfoHeaderWrapper}>
                    <Text style={textStyles.defCardHeaderStyle}>Description</Text>
                </View>

                <View style={subContainers.DefaultContentWrapper}>
                    <Text style={textStyles.defCardContentStyle}
                      >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                         enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                           in culpa qui officia deserunt mollit anim id est laborum
                    </Text>
                </View>
            </View>




            <View style={[subContainers.DefaultInfoSubContainer,{marginBottom:5}]}>
                <View style={subContainers.DefaultInfoHeaderWrapper}>
                    <Text style={textStyles.defCardHeaderStyle}>Items and Expenses</Text>
                </View>

                <View style={[subContainers.DefaultContentWrapper,{display:'flex',flexDirection:'column',gap:5}]}>


                    <View style={{display:'flex',flexDirection:'row',borderWidth:0,paddingVertical:5,borderColor:'red',width:'100%'}}>
                        <View style={{flex:1,borderWidth:0,display:'flex',flexDirection:'column',gap:5}}>
                            <Text style={[textStyles.defCardHeaderStyle,{wordWrap:'wrap',fontSize:15,fontWeight:700,color:'#64748B'}]}>Item name</Text>
                            <Text style={{fontSize:14,color:'#64748B'}}>Quantity</Text>
                        </View>

                        <View style={{display:'flex',flexDirection:'column',alignContent:'flex-start',borderWidth:0,paddingHorizontal:10}}>
                            <Text style={{fontSize:15,color:'#64748B',fontWeight:600}}>Price</Text>
                        </View>
                    </View>


      

                    <View style={{display:'flex',flexDirection:'row',borderTopWidth:1,paddingVertical:5,borderColor:'#E2E8F0',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
                        <Text style={[textStyles.headerTitle,{fontSize:17}]}>Total Amount</Text>
                        <Text style={[textStyles.headerTitle,{fontSize:17,color:'#64748B'}]}>₱ 10000</Text>
                    </View>



                </View>
            </View>


           

        </ScrollView>



    </SafeAreaView>
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