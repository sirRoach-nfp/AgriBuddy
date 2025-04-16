import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Appbar, PaperProvider } from 'react-native-paper'
import { useNavigation } from 'expo-router'
import { Picker } from '@react-native-picker/picker'
import { useUserContext } from '../Context/UserContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseconfig'



interface FertilizerLog{
    DateApplied:string,
    cropName:string,
    fertilizerAmmount:string,
    selectedApplication:string,
}





const FertilizerDetailed = () => {

    //datas fetched



    const [fertilizerLogs,setFertilizerLogs]= useState<FertilizerLog[]>([])




    const {user} = useUserContext();
    const navigation = useNavigation()
    const [selectedOption, setSelectedOption] = useState<String>('analytics');
  
    const handleSegmentChange = (value:String) => {
      setSelectedOption(value);
    };



 //logs 

 const [selectedYear,setSelectedYear] = useState("")
 const [selectedMonth,setSelectedMonth] = useState("")




const fetchFertilizerLogRecord = async(plotId:string) =>{

    console.log("Fetching Fertilizer Log Record.....")

    try{
        const docRef = doc(db,'Records',user?.RecordsRefId as string)
        const docSnap = await getDoc(docRef)

        if(docSnap.exists()){

            const data = docSnap.data()
            console.log("Returned Data : ", data)
            const existingLogs = data?.FertilizerLogs || []
            console.log("existing fertilizer logs : ", existingLogs)

            const logIndex = existingLogs.findIndex(
                (log:any)=>log.PlotAssocId === plotId
            )
            console.log("Log Index : ", logIndex)

            const fertilizerLog = existingLogs[logIndex].FertilizerApplications;

            //const monthlyTotals = getMonthlyTotals(fertilizerLog);
            //console.log("Processed Monthly Totals For Fertilizer Logs : ", monthlyTotals)


           // setFertilizerChartMonthlyTotal(monthlyTotals)
            setFertilizerLogs(fertilizerLog)
        }

    }catch(err){console.log(err)}
}




  return (

    <PaperProvider>



    
    <SafeAreaView style={styles.mainContainer}>







        <Appbar.Header style={{width:'100%',flex:1,height:50}}>
            <Appbar.BackAction onPress={()=> navigation.goBack()} />
            <Appbar.Content title="Pest Occurrences Detailed Overview" />
        </Appbar.Header>

        <View style={styles.segmentContainer}>
            <TouchableOpacity
                style={styles.segmentButton}
                onPress={() => handleSegmentChange('analytics')}
            >
                <Text
                style={[
                    styles.segmentText,
                    selectedOption === 'analytics' && styles.activeText,
                ]}
                >
                Usage Analytics
                </Text>
                {selectedOption === 'analytics' && (
                <View style={styles.activeLine} />
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.segmentButton}
                onPress={() => handleSegmentChange('logs')}
            >
                <Text
                style={[
                    styles.segmentText,
                    selectedOption === 'logs' && styles.activeText,
                ]}
                >
                Logs
                </Text>
                {selectedOption === 'logs' && (
                <View style={styles.activeLine} />
                )}
            </TouchableOpacity>
        </View>



        {selectedOption === 'logs' && 
      
        <ScrollView style={stylesLogs.logsContainerMain} contentContainerStyle={{alignItems:'center'}}>

            <View style={stylesLogs.logsContainerMain}>

                <Text>
                    Usage Logs 
                </Text>

                <Picker

                >
                    <Picker.Item label="Overall" value="Overall" />
                    <Picker.Item label="Monthly" value="Monthly" />
                    <Picker.Item label="Quarterly" value="Quarterly" />
                    <Picker.Item label="Yearly" value="Yearly" />
                </Picker>



            </View>

            
        </ScrollView> 

        }






    </SafeAreaView>
    
    
    
    </PaperProvider>
  )
}

export default FertilizerDetailed


const stylesLogs = StyleSheet.create({


    logsContainerMain:{
        width:'100%',
        alignSelf:'flex-start',
        paddingVertical:10,
        borderWidth:1,
        display:'flex',
        flexDirection:'column',
       
    }
})

const styles = StyleSheet.create({
    scrollContainer:{
        display:'flex',
        flexDirection:'column',
        width:'100%',
        //borderWidth:1,
        paddingTop:20,
        flex:1,
       
        
    },

    mainContainer:{
        flex:1,
        backgroundColor:'#F2F3F5',
    
    },

    //

    segmentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        //borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      segmentButton: {
        alignItems: 'center',
        paddingVertical: 10,
      },
      segmentText: {
        color: 'black',
        fontSize: 16,
      },
      activeText: {
        fontWeight: 'bold',
        color: '#2E6F40',
      },
      activeLine: {
        marginTop: 4,
        height: 2,
        width: '100%',
        backgroundColor: '#2E6F40',
      },
})