import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Appbar, PaperProvider } from 'react-native-paper'
import { router, useNavigation } from 'expo-router'
import { Picker } from '@react-native-picker/picker'
import { useUserContext } from '../Context/UserContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSearchParams } from 'expo-router/build/hooks'
import FertilizerDistributionPiechart from '@/components/AnalyticsComponents/FertilizerDistributionPiechart'
import FertilizerUsageByCrop from '@/components/AnalyticsComponents/FertilizerUsageByCrop'
import Ionicons from '@expo/vector-icons/Ionicons';

interface FertilizerLog{
    DateApplied:string,
    cropName:string,
    fertilizerAmmount:string,
    selectedApplication:string,
    fertilizerType:string
}




const formatDateToMonthDay = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };


const FertilizerDetailed = () => {

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      

    //functions redeclare
    const navigate = useNavigation()
    const searchParams = useSearchParams();


    //datas fetched
    const [fertilizerLogs,setFertilizerLogs]= useState<FertilizerLog[]>([])
    const [yearDataForFilter, setYearDataForFilter] = useState<any[]>([]);
    const [monthDataForFilter, setMonthDataForFilter] = useState<any[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<FertilizerLog[]>([]);
    const [onCropsData,setOnCropsData] = useState<string[]>([])


    //Assoc datas
    const {user} = useUserContext();
    const plotId = searchParams.get('plotAssocId');







    


    //options handlers
    const [selectedOption, setSelectedOption] = useState<String>('analytics');
    const [selectedFilterLog,setSelectedFilterLog] = useState<String>('')


    //options destructured Datas
    const [logsFilterDatas,setLogsFilterDatas] = useState<any>([])





    useEffect(()=>{

        fetchFertilizerLogRecord(plotId as string)
    },[])



    
    const handleSegmentChange = (value:String) => {
      setSelectedOption(value);
    };



 //logs 

 const [selectedYear,setSelectedYear] = useState("All")
 const [selectedMonth,setSelectedMonth] = useState("")


//functions

const filterLogsByYear = (year:string)=>{
    console.log("Filtering logs by year : ", year)
    if(year === 'All'){
        setFilteredLogs(fertilizerLogs)
    }else{
        const filtered = fertilizerLogs.filter((log)=>{
            return new Date(log.DateApplied).getFullYear() === parseInt(year)
        })
        console.log("Filtered Data : ", filtered)

        setFilteredLogs(filtered)
    }
}

const fetchFertilizerLogRecord = async(plotId:string) =>{

    console.log("Fetching Fertilizer Log Record for this PLotId .....", plotId)

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
            console.log("Fertilizer Log : ", fertilizerLog)


            if(fertilizerLog.length > 0){
                const years = fertilizerLog.map((item: { DateApplied: string})=> new Date(item.DateApplied).getFullYear())
                const uniqueYears = Array.from(new Set(years))

                const cropNames = [...new Set(fertilizerLog.map((item: { cropName: string }) => item.cropName))]
                console.log("Crop Names : ",cropNames)
                setOnCropsData(cropNames as string[])
                setYearDataForFilter(uniqueYears)
                console.log("Unique Years for filters : ", uniqueYears)
            }
            //const monthlyTotals = getMonthlyTotals(fertilizerLog);
            //console.log("Processed Monthly Totals For Fertilizer Logs : ", monthlyTotals)


           // setFertilizerChartMonthlyTotal(monthlyTotals)

            fertilizerLog.sort((a: any, b: any) => {
                return new Date(b.DateApplied).getTime() - new Date(a.DateApplied).getTime();
            });
            setFertilizerLogs(fertilizerLog)
        }

    }catch(err){console.log(err)}
}




  return (

    <PaperProvider>




    <SafeAreaView style={styles.mainContainer}>







        <View style={styles.headerContainer}>

            <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10}} onPress={()=> router.back()}>

                <Ionicons name="arrow-back" size={25} color="#607D8B" />

            </TouchableOpacity>


        </View>

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
      
        <View style={stylesLogs.logsContainerMain} >

            <View style={{borderWidth:1,width:'95%',flex:1,backgroundColor:'white',borderRadius:5,borderColor:'#e2e8f0'}}>

                <View style={stylesLogs.logsContainerHeader}>

                                <Text style={{fontSize:17,fontWeight:600, color:'#37474F',letterSpacing:.5}}>
                                    Usage Logs 
                                </Text>
                                <View style={{borderWidth:1,borderRadius:5,borderColor:'#E2E8f0'}}>
                                    <Picker
                                        selectedValue={selectedYear}
                                        style={{
                                            padding: 0,
                                            borderRadius: 5,
                                            fontSize: 16,
                                            marginLeft: 'auto',
                                            width: 150,
                                            paddingVertical:5,
                                            height:50
                                        }}
                                        onValueChange={(value) => {
                                            setSelectedYear(value as string);
                                            filterLogsByYear(value as string);
                                        }}
                                        >
                                        {yearDataForFilter && yearDataForFilter.length > 0 &&
                                            yearDataForFilter.map((year, index) => (
                                            <Picker.Item key={index} label={year} value={year} />
                                            ))
                                        }
                                        <Picker.Item label="All" value="All" />
                                    </Picker>
                                </View>


                </View>



                <ScrollView contentContainerStyle={{alignItems:'center'}} style={{paddingTop:20,display:'flex',flexDirection:'column',width:'100%',flex:1,borderWidth:0,borderColor:'red'}}>
                    


                    {filteredLogs && filteredLogs.length>0 && filteredLogs.map((log,index)=>(
                        <View style={{borderColor:'#e2e8f0',borderRadius:5,marginBottom:0,width:'95%',paddingVertical:10,paddingHorizontal:10,borderWidth:1,display:'flex',flexDirection:'column',alignItems:'flex-start',justifyContent:'space-between'}}>
                            <Text style={{fontSize:15,color:'#475569'}}>{formatDateToMonthDay(log.DateApplied)}</Text>
                            <Text style={{fontSize:16,fontWeight:500, color:"#37474F"}}>{log.fertilizerAmmount}kg Of {log.fertilizerType}</Text>
                            <Text style={{fontSize:16,color:'#64748B'}}>On {log.cropName}</Text>
                            <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={
                                ()=>{
                                    router.push({
                                        pathname: '/(screens)/ExpandedFertilizerLog',
                                        params: {
                                        DateApplied: log.DateApplied,
                                        cropName: log.cropName,
                                        fertilizerAmmount: log.fertilizerAmmount,
                                        selectedApplication: log.selectedApplication,
                                        fertilizerType: log.fertilizerType
                                        }
                                    });
                                }
                            }><MaterialIcons name="read-more" size={30} color="#607D8B" /></TouchableOpacity>
                        </View>
                    ))}


                </ScrollView>

            </View>

            
      
        </View> 

        }


        {selectedOption === 'analytics' && (

                <ScrollView style={{display:'flex',flexDirection:'column',width:'100%',flex:1,borderWidth:0,borderColor:'blue'}} contentContainerStyle={{alignItems:'center'}}>
                    <FertilizerDistributionPiechart data={fertilizerLogs} yearDataFilter={yearDataForFilter}/>
                    <FertilizerUsageByCrop data={fertilizerLogs} cropNames={onCropsData}/>

                </ScrollView>
        )}






    </SafeAreaView>
    
    
    
    </PaperProvider>
  )
}

export default FertilizerDetailed


const stylesLogs = StyleSheet.create({


    logsContainerMain:{
        width:'100%',
        alignSelf:'flex-start',
        paddingVertical:20,
        borderWidth:0,
        display:'flex',
        flexDirection:'column',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
       
       
    },
    logsContainerHeader:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:10,
        paddingVertical:10,
        //borderWidth:1,
    
    }
})

const styles = StyleSheet.create({

    headerContainer:{
        width:'100%',
        maxHeight:50,
        //borderWidth:1,
        borderBottomWidth:1,
        borderColor:'#E2E8F0',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        height:50,
        backgroundColor:'#ffffff',
        //marginBottom:20,
        //backgroundColor:'white'
    },
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
        padding:10,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        backgroundColor:'#ffffff',
        gap:20
      },
      segmentButton: {
        alignItems: 'center',
        paddingVertical: 0,
        borderWidth:0,
      },
      segmentText: {
        color: 'black',
        fontSize: 17,
        fontWeight:600
      },
      activeText: {
        fontWeight: 'bold',
        color: '#37474F',
      },
      activeLine: {
        marginTop: 4,
        height: 2,
        width: '100%',
        backgroundColor: '#37474F',
      },
})