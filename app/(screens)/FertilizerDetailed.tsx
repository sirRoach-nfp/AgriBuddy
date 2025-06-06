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







        <Appbar.Header style={{width:'100%',flex:1,height:50}}>
            <Appbar.BackAction onPress={()=> navigate.goBack()} />
           
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
      
        <View style={stylesLogs.logsContainerMain} >

            <View style={stylesLogs.logsContainerHeader}>

                <Text style={{fontSize:17,fontWeight:400}}>
                    Usage Logs 
                </Text>

                <Picker
                    selectedValue={selectedYear}
                    style={{
                        padding: 0,
                        borderRadius: 5,
                        fontSize: 16,
                        marginLeft: 'auto',
                        width: 150,
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
                <TouchableOpacity style={{borderWidth:1,paddingHorizontal:20,marginRight:8,borderRadius:5,marginLeft:8}}><Text style={{fontSize:17}}>Filter</Text></TouchableOpacity>


            </View>



            <ScrollView contentContainerStyle={{alignItems:'center'}} style={{paddingTop:20,display:'flex',flexDirection:'column',width:'100%',flex:1,borderWidth:1,borderColor:'red'}}>
                


                {filteredLogs && filteredLogs.length>0 && filteredLogs.map((log,index)=>(
                    <View style={{marginBottom:0,width:'100%',paddingHorizontal:10,borderWidth:0,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontSize:15}}>{formatDateToMonthDay(log.DateApplied)} - {log.fertilizerAmmount}kg  {log.fertilizerType} on {log.cropName}</Text>
                        <TouchableOpacity onPress={
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
                        }><MaterialIcons name="read-more" size={30} color="black" /></TouchableOpacity>
                    </View>
                ))}


            </ScrollView>
      
        </View> 

        }


        {selectedOption === 'analytics' && (

                <ScrollView style={{display:'flex',flexDirection:'column',width:'100%',flex:1,borderWidth:1,borderColor:'blue'}}>
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
        paddingVertical:10,
        borderWidth:1,
        display:'flex',
        flexDirection:'column',
        flex:1
       
    },
    logsContainerHeader:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        //justifyContent:'space-between',
        paddingHorizontal:10,
        borderWidth:1,
    
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