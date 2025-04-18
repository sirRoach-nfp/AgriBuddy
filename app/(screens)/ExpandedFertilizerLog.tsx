import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Appbar, PaperProvider } from 'react-native-paper'
import { router, useNavigation } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams } from 'expo-router';
const ExpandedFertilizerLog = () => {

  const navigation = useNavigation();


  function formatDateToReadable(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  const {
    cropName,
    fertilizerAmmount,
    selectedApplication,
    fertilizerType,
    DateApplied
  } = useLocalSearchParams();
  return (

    <PaperProvider>

        <SafeAreaView style={styles.mainWrapper}>

            <View style={styles.headerContainer}>

                <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10}} onPress={()=> router.back()}>

                    <Ionicons name="arrow-back" size={30} color="black" />

                </TouchableOpacity>


            </View>

            <ScrollView contentContainerStyle={{alignItems:'center'}} style={styles.scrollContainer}>


            <View style={styles.contentWrapper}>
                <Text style={styles.contentHeader}>Application Summary</Text>

                <View style={styles.contentSubContainer}>
                    <Text style={styles.contentText}>Date Applied</Text>
                    <Text style={styles.contentText}>{formatDateToReadable(DateApplied as string)}</Text>
                </View>

                
                <View style={styles.contentSubContainer}>
                    <Text style={styles.contentText}>Fertilizer Type</Text>
                    <Text style={styles.contentText}>{fertilizerType}</Text>
                </View>

                <View style={styles.contentSubContainer}>
                    <Text style={styles.contentText}>Application Method</Text>
                    <Text style={styles.contentText}>{selectedApplication}</Text>
                </View>
            </View>


            <View style={styles.contentWrapper}>
                <Text style={styles.contentHeader}>Fertilizer Composition</Text>

                <View style={styles.contentSubContainer}>
                    <Text style={styles.contentText}>N-P-K Ratio</Text>
                    <Text style={styles.contentText}>{fertilizerType}</Text>
                </View>

                
                <View style={styles.contentSubContainer}>
                    <Text style={styles.contentText}>Inorganic</Text>
                    <Text style={styles.contentText}>Inorganic</Text>
                </View>


            </View>


            <View style={styles.contentWrapper}>
                <Text style={styles.contentHeader}>Quantity Applied</Text>

                <View style={styles.contentSubContainer}>
                    <Text style={styles.contentText}>Amount Used</Text>
                    <Text style={styles.contentText}>{fertilizerAmmount}KG</Text>
                </View>



            </View>


            <View style={styles.contentWrapper}>
                <Text style={styles.contentHeader}>Location And Crop Association</Text>

                <View style={styles.contentSubContainer}>
                    <Text style={styles.contentText}>Crop Name</Text>
                    <Text style={styles.contentText}>{cropName}</Text>
                </View>

                <View style={styles.contentSubContainer}>
                    <Text style={styles.contentText}>Plot Name</Text>
                    <Text style={styles.contentText}>Test Right</Text>
                </View>



            </View>





            </ScrollView>

        </SafeAreaView>
    
    </PaperProvider>
  )
}

export default ExpandedFertilizerLog

const styles = StyleSheet.create({

    contentHeader:{
        fontSize:18,
        fontWeight:500
    },

    contentWrapper:{
        width:'100%',
        display:'flex',
        flexDirection:'column',
        //borderWidth:1,
        gap:10,
        marginBottom:15
    },
    contentSubContainer:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
    },
    contentText:{
        fontSize:16,
        fontWeight:400
    },



    headerContainer:{
        width:'100%',
        maxHeight:50,
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        height:50,
        //backgroundColor:'#2E6F40',
        //marginBottom:20,
        backgroundColor:'white'
    },
    mainWrapper:{
        width:'100%',
        flex:1,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    scrollContainer:{
        width:'95%',
        flex:1,
        //borderWidth:1,
        paddingTop:10
    }
})