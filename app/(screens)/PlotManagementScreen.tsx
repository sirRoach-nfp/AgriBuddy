import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router';

import Feather from '@expo/vector-icons/Feather';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CropPlanCard from '@/components/genComponents/CropPlanCard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useSearchParams } from 'expo-router/build/hooks';
import { cropsImages } from '../Pestdat';
import Foundation from '@expo/vector-icons/Foundation';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,

    StackedBarChart
  } from "react-native-chart-kit";
import { useUserContext } from '../Context/UserContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import { ContributionChartValue } from 'react-native-chart-kit/dist/contribution-graph/ContributionGraph';
import { RectProps } from 'react-native-svg';

interface PlotData{
    PlotId : string,
    PlotName: string,
    PlotThumbnail:string,
  }
interface CurrentCrop{
    CropAssocId:string | null,
    CropId:string | null,
    CropName:string | null
    CropCover:string | null
}
  
interface Plots{
    PlotId : string,
    PlotName: string,
    PlotThumbnail:string,
    currentCrops:CurrentCrop


}

interface PestLog {
    Date: string;
    CropName: string;
    PestName: string;
  }
interface DiseaseLog {
    Date: string;
    CropName: string;
    Diseasename: string;
  }
interface FertilizerLog{
    DateApplied:string,
    cropName:string,
    fertilizerAmmount:string,
    selectedApplication:string,
}

const PlotManagementScreen = () => {
    const screenWidth = Dimensions.get("window").width;

    //chart tools 

    const getMonthlyTotals = (logs:any) => {
        const monthlyTotals = new Array(12).fill(0); // Jan to Dec
      
        logs.forEach((log:any) => {
          const date = new Date(log.DateApplied);
          const monthIndex = date.getMonth(); // 0 = Jan, 11 = Dec
          const amount = parseFloat(log.fertilizerAmmount) || 0;
      
          monthlyTotals[monthIndex] += amount;
        });
      
        return monthlyTotals;
      };


    const {user} = useUserContext();

    //navi
    //const nav
    
    //loaders


    const [pestChartLoading,setPestChartLoading] = useState(true);
    const [diseaseChartLoading,setDiseaseChartLoading] = useState(true);

    const [pestLogs, setPestLogs] = useState<PestLog[]>([]);
    const [diseaseLogs,setDiseaseLogs] = useState<DiseaseLog[]>([])
    const [pestListData,setPestListData] = useState<string[]>([]);
    const [diseaseListData,setDiseaseListData] = useState<string[]>([]);
    const [chartData,setChartData] = useState<any>(null);
    const [diseaseChartData,setDiseaseChartData] = useState<any>(null)
    const [fertilizerChartMonthlyTotal,setFertilizerChartMonthlyTotal] = useState<any>([])

    const [fertilizerLogs,setFertilizerLogs]= useState<FertilizerLog[]>([])
    /*
    const pestLogs = [
        { date: "2024-02-01", crop: "Tomato", pest: "Whiteflies" },
        { date: "2024-02-02", crop: "Tomato", pest: "Thrips" },
        { date: "2024-02-04", crop: "Tomato", pest: "Tomato Fruitworm" },
        { date: "2024-02-07", crop: "Tomato", pest: "Whiteflies" },
        { date: "2024-02-10", crop: "Tomato", pest: "Thrips" },
        { date: "2024-02-13", crop: "Tomato", pest: "Tomato Fruitworm" }
      ];
      */

      const pestColors = {
        Whiteflies: "#FF6384",  // Red
        Thrips: "#36A2EB",      // Blue
        Tomato_Fruitworm: "#FFCE56" // Yellow
      };

      




    

    const checkChartData = () => {
        console.log(pestLogs)
    }





    const [plotData,setPlotData] = useState<Plots>({
        PlotId:'',
        PlotName: '', 
        PlotThumbnail:'', // Initialize as an empty array
        currentCrops: { CropAssocId: '', CropId: '', CropName: '',CropCover:'' } // Initialize as an empty object (map)
      });



    const searchParams = useSearchParams();

    const plotId = searchParams.get('plotAssocId');


    
    useEffect(() => {
        const fetchPlotData = async (plotId: string) => {
          try {
            const docRef = doc(db, 'Plots', user?.PlotsRefId as string);
            const docSnap = await getDoc(docRef);
      
            if (docSnap.exists()) {
              const rawData = docSnap?.data().Plots as any[];
      

              const foundPlot = rawData.find(plot => plot.PlotId === plotId);
      
              if (foundPlot) {
                const formattedData: Plots = {
                  PlotId: foundPlot.PlotId,
                  PlotName: foundPlot.PlotName,
                  PlotThumbnail:foundPlot.PlotThumbnail,
                  currentCrops: foundPlot.CurrentCrops || {
                    CropAssocId: null,
                    CropId: null,
                    CropName: null,
                    CropCover:null
                  }
                };
      
                console.log(formattedData);
                setPlotData(formattedData);
              }
            }
          } catch (err) {
            console.error(err);
          }
        };


        const fetchPestLogRecord = async(plotId:string) =>{
            
            console.log("Fetching Pest Log Record....")
            try{

                console.log("Fetching Pest Log Record 2....")



                const docRef = doc(db,'Records',user?.RecordsRefId as string)
                const docSnap = await getDoc(docRef)


                if(docSnap.exists()){
                     

                    const data = docSnap.data()
                    console.log("Returned Data : ", data)
                    const existingLogs = data?.PestLogs || []
                    console.log("existing data logs : ", existingLogs)

                    const logIndex = existingLogs.findIndex(
                        (log:any) => log.PlotAssocId === plotId
                    )
                    console.log("log index : ", logIndex)
                    const plotPestLog = existingLogs[logIndex].PlotPestLog;

                    
                    console.log( "Filtered Plot Pest log entry", existingLogs[logIndex].PlotPestLog)

                    const pestNames = [...new Set(plotPestLog.map((log: any) => log.Pestname))];
                    console.log("Pest List Data: ", pestNames);

                    setPestListData(pestNames as string[])
                    setPestLogs(existingLogs[logIndex].PlotPestLog)


                }else{
                    console.log("Document not found records")
                }

            }catch(err){
                console.error(err)
            }

        }


        const fetchDiseaseLogRecord = async(plotId:string) =>{
            
            console.log("Fetching Diseaes Log Record....")
            try{

                console.log("Fetching Diseaes Log Record 2....")



                const docRef = doc(db,'Records',user?.RecordsRefId as string)
                const docSnap = await getDoc(docRef)


                if(docSnap.exists()){
                     

                    const data = docSnap.data()
                    console.log("Returned Data : ", data)
                    const existingLogs = data?.DiseaseLogs || []
                    console.log("existing data logs : ", existingLogs)

                    const logIndex = existingLogs.findIndex(
                        (log:any) => log.PlotAssocId === plotId
                    )
                    console.log("log index : ", logIndex)
                    const plotDiseaseLog = existingLogs[logIndex].PlotDiseaseLog;

                    
                    console.log( "Filtered Plot Diseaes log entry", existingLogs[logIndex].PlotDiseaseLog)

                    const diseaseNames = [...new Set(plotDiseaseLog.map((log: any) => log.Diseasename))];
                    console.log("Disease List Data: ", diseaseNames);

                    setDiseaseListData(diseaseNames as string[])
                    setDiseaseLogs(existingLogs[logIndex].PlotDiseaseLog)


                }else{
                    console.log("Document not found records")
                }

            }catch(err){
                console.error(err)
            }

        }

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

                    const monthlyTotals = getMonthlyTotals(fertilizerLog);
                    console.log("Processed Monthly Totals For Fertilizer Logs : ", monthlyTotals)


                    setFertilizerChartMonthlyTotal(monthlyTotals)
                    setFertilizerLogs(fertilizerLog)
                }

            }catch(err){console.log(err)}
        }


        

      
        if (plotId) {
          fetchPlotData(plotId);
          fetchPestLogRecord(plotId)
          fetchFertilizerLogRecord(plotId)
          fetchDiseaseLogRecord(plotId)
        }
      }, [plotId]);




      useEffect(()=>{



        const getWeeklyPestCounts = (logs:any,pestDataName:string[]) => {
            console.log("Getting weekly pest counts...")
            const pests = pestDataName;
            console.log("Pest names array : ",pests)
            const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];


            if (!pestListData || pestListData.length === 0) {
                console.warn("No pests available, skipping chart update.");
                return;
            }
          
            // Initialize weekly occurrence count
            const weeklyData = pests.reduce((acc:any, pest) => {
              acc[pest] = new Array(5).fill(0); // 5 weeks, initialized to 0
              return acc;
            }, {});

            const pestColors: { [key: string]: string } = {};
            pests.forEach((pest) => {
                pestColors[pest] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            });
          
            logs.forEach((log: any) => {
                const logDate = log.Date || log.date; // Ensure correct date key
                const pest = log.Pestname || log.pestname; // Ensure correct pest name key
            
                if (!logDate || !pest) return; 
            
                const weekIndex = Math.floor((new Date(logDate).getDate() - 1) / 7);
                if (weeklyData[pest] && weekIndex >= 0 && weekIndex < 5) {
                    weeklyData[pest][weekIndex] += 1;
                }
            });
          
            return {
                labels: weeks,
                datasets: pests.map((pest) => ({
                    label: pest,
                    data: weeklyData[pest],
                    color: () => pestColors[pest], // Assign color to the dataset
                })),
                pestColors, // Return colors for legend
            };
          };


          const getMonthlyDiseaseCounts = (logs: any[], diseaseNames: string[]) => {

            if(!diseaseListData || diseaseListData.length === 0){
                console.log("No disease log to display")
                return;
            }
            console.log("Getting monthly disease counts...");
          
            // Get last 6 months from today
            const today = new Date();
            const months: any[] = [];
            for (let i = 5; i >= 0; i--) {
              const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
              const monthLabel = date.toLocaleString('default', { month: 'short' });
              const year = date.getFullYear();
              months.push({ label: `${monthLabel}`, year, month: date.getMonth() });
            }
          
            // Initialize counts per disease per month
            const monthlyData = diseaseNames.reduce((acc: any, disease) => {
              acc[disease] = new Array(6).fill(0);
              return acc;
            }, {});
          
            const diseaseColors: { [key: string]: string } = {};
            diseaseNames.forEach((disease) => {
              // Generate consistent random colors
              diseaseColors[disease] = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
            });
          
            // Process logs
            logs.forEach((log: any) => {
              const logDate = new Date(log.Date || log.date);
              const disease = log.Diseasename || log.diseasename;
          
              if (!logDate || !disease || !monthlyData[disease]) return;
          
              months.forEach((month: any, index: number) => {
                if (
                  logDate.getFullYear() === month.year &&
                  logDate.getMonth() === month.month
                ) {
                  monthlyData[disease][index] += 1;
                }
              });
            });
          
            // Final chart data
            return {
              labels: months.map((m: any) => m.label),
              datasets: diseaseNames.map((disease) => ({
                data: monthlyData[disease],
                label: disease,
                color: () => diseaseColors[disease],
                strokeWidth: 2
              })),
              pestColors: diseaseColors // this is used for your legends
            };
          };
          


          setChartData(getWeeklyPestCounts(pestLogs,pestListData))
          setDiseaseChartData(getMonthlyDiseaseCounts(diseaseLogs,diseaseListData))
          console.log(getWeeklyPestCounts(pestLogs,pestListData))
        
      },[pestLogs,pestListData,diseaseLogs,diseaseListData])


    useEffect(()=> {
        setPestChartLoading(false)
        setDiseaseChartLoading(false)
        console.log("Chart data ", chartData)
        console.log("Chart data for disease  ", diseaseChartData)
    },[chartData,diseaseChartData])


 
  const checkPlotData = () => {
    console.log(chartData)
  }


  const navigateToPlotSetting = (plotAssocId:string,plotName:string,currentCrop:any,CropCover:string)=>{
    const queryString = `?plotAssocId=${encodeURIComponent(plotAssocId)}&currentPlotName=${encodeURIComponent(plotName)}&currentCrop=${currentCrop}&PlotCover=${encodeURIComponent(CropCover)}`
    router.push(`/(screens)/PlotScreenSettings${queryString}` as any)
  }

 
  return (
    <SafeAreaView style={styles.mainContainer}>

        <View style={styles.headerContainer}>

            <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10}} onPress={()=> router.back()}>

                <Ionicons name="arrow-back" size={30} color="#607D8B" />

            </TouchableOpacity>


        </View>

        <ScrollView style={{borderWidth:0,width:'100%',flex:1}}>

                <View style={styles.plotInfoContainer}>
                    <View style={styles.thumbnail}>

                        {plotData.PlotThumbnail.length > 0 ? (
                            <Image source={{uri:plotData.PlotThumbnail}} style={{width:'100%',height:'100%',objectFit:'cover'}}  />
                        ) : (

                            <Foundation name="photo" size={24} color="#607D8B" />
                        )}
                        
                    </View>
                    <View style={styles.infoWrapper}>
                        <View style={styles.infoHeaderwrapper}>
                            <Text  style={styles.plotName}>{plotData.PlotName}</Text>
                    

                        </View>
                        
                        <View style={[styles.badge, plotData.currentCrops.CropAssocId ? {backgroundColor:"#2E6F40"} : {} ]}>


                            {plotData.currentCrops.CropAssocId ? (
                                <View style={{alignSelf:'flex-start',borderWidth:0,paddingHorizontal:20,borderRadius:5,backgroundColor:'#2E6F40'}}>
                                    
                                    
                                    <Text style={[styles.status, {color:'#ffffff'}]} >
                                        Growing
                                    </Text>                            
                                    
                                </View>


                            ) : (

                                <View style={{alignSelf:'flex-start',borderWidth:0,paddingHorizontal:20,borderRadius:5,backgroundColor:'#E9A800'}}> 

                                    <Text style={[styles.status, {color:'#ffffff'}]} >
                                        Resting
                                    </Text>

                                </View>

                            )}

                        </View>
                    </View>

                    <View style={{borderWidth:0,width:30,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=>navigateToPlotSetting(plotId as string,plotData?.PlotName,plotData.currentCrops.CropAssocId,plotData.PlotThumbnail)}>

                            <Ionicons name="options" size={24} color="#607D8B" />

                        </TouchableOpacity>
                        
                    </View>
                </View>







                {plotData?.currentCrops.CropAssocId !== null ? (
                    

                    <View style={stylesCrop.wrapper}>
                        <View style= {stylesCrop.cropThumbnailWrapper}>
                            <Image style={{width:'100%',height:'100%',objectFit:'contain',borderRadius:10}} source={{uri:plotData.currentCrops.CropCover as string}}/>
                        </View>
                        <View style={stylesCrop.textContainer}>
                            <Text style={stylesCrop.cropNameText}>
                                {plotData.currentCrops.CropName}
                            </Text>

                            <Text style={stylesCrop.datePlantedText}>
                                Current Crop in the plot
                            </Text>
                        </View>

                    </View>

                ) : (

                    <View style={stylesNoRotation.wrapper}>
                        
                        <View style={stylesNoRotation.textContainer}>
                            <Text style={stylesNoRotation.text}>
                            Not Growing A Crop
                            </Text>
                        </View>
          
                    </View>

                )}




            <View style={{borderWidth:0,marginTop:0,width:'100%',marginLeft:'auto',marginRight:'auto',backgroundColor:'white',paddingVertical:10,elevation:1}}>

                <View style={styles.chartsHeaderWrapper}>

                    <View style={styles.chartsHeaderWrapperIcon}>

                    </View>
                    <Text style={styles.chartsHeader}>Pest Occurrences Per Week</Text>
                    
                    <TouchableOpacity style={{flexShrink:1,borderWidth:0,marginLeft:'auto'}} onPress={()=> router.push(`/(screens)/PestOccurrencesDetailed?plotAssocId=${encodeURIComponent(plotId as string)}`)}>

                        <Text style={styles.chartsHeaderViewMore}>View In Detail </Text>

                    </TouchableOpacity>
                    
                </View>
                

            {!pestChartLoading && chartData && pestListData ? (

                <>
                
                
                
                    <LineChart
                        data={{
                            labels: chartData?.labels, // Weeks
                            datasets: chartData?.datasets, // Pest occurrence per week
                        }}
                        width={Dimensions.get("window").width} // from react-native
                        height={220}
                        //yAxisLabel="$"
                        //yAxisSuffix="k"
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                        backgroundGradientFrom: "#f1f1f1",
                        backgroundGradientTo: "#f1f1f1",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                        }}
                        bezier
                        style={{
                        marginVertical: 8,
                        borderRadius: 0
                        }}
                    />

                    <View style={styles.legendWrapper}> 


                        {Object.entries(chartData?.pestColors).map(([pest, color]) => (
                            <View key={pest} style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
                                {/* Color Indicator */}
                                <View style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: color as string,
                                    marginRight: 5,
                                    borderRadius: 3,
                                    borderWidth:1
                                }} />
                                
                                {/* Pest Name */}
                                <Text style={{ fontSize: 14,fontWeight:500,color:'#253D2C' }}>{pest}</Text>
                            </View>
                        ))}


                    </View>


                </>


            ) : (
                <View style={{width:'100%',borderWidth:0,marginTop:15,backgroundColor:'#D2D2D2',height:220,borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center'}}> 
                    <Text style={{fontSize:15,fontWeight:600,color:'#909090'}}>No Available Data To Display</Text>
                </View>
            )}
            
            </View>





        <View style={{borderWidth:0,marginTop:0,width:'100%',marginLeft:'auto',marginRight:'auto',backgroundColor:'white',paddingVertical:10,elevation:1}}>

             <View style={styles.chartsHeaderWrapper}>

                <View style={styles.chartsHeaderWrapperIcon}>

            </View>
            <Text style={styles.chartsHeader}>Disease Trend (last 6 months)</Text>
            
            <TouchableOpacity style={{flexShrink:1,borderWidth:0,marginLeft:'auto'}} onPress={()=> router.push(`/(screens)/PestOccurrencesDetailed?plotAssocId=${encodeURIComponent(plotId as string)}`)}>

                <Text style={styles.chartsHeaderViewMore}>View In Detail </Text>

            </TouchableOpacity>
            
        </View>


        {!diseaseChartLoading && diseaseChartData && diseaseListData ? (

        <>



            <LineChart
                data={{
                    labels: diseaseChartData?.labels, // Weeks
                    datasets: diseaseChartData?.datasets, // Pest occurrence per week
                }}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                //yAxisLabel="$"
                //yAxisSuffix="k"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                backgroundGradientFrom: "#f1f1f1",
                backgroundGradientTo: "#f1f1f1",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                }
                }}
                bezier
                style={{
                marginVertical: 8,
                borderRadius: 0
                }}
            />

            <View style={styles.legendWrapper}> 


                {Object.entries(diseaseChartData?.pestColors).map(([pest, color]) => (
                    <View key={pest} style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
                        {/* Color Indicator */}
                        <View style={{
                            width: 15,
                            height: 15,
                            backgroundColor: color as string,
                            marginRight: 5,
                            borderRadius: 3,
                            borderWidth:1
                        }} />
                        
                        {/* Pest Name */}
                        <Text style={{ fontSize: 14,fontWeight:500,color:'#253D2C' }}>{pest}</Text>
                    </View>
                ))}


            </View>


        </>


            ) : (
            <View style={{width:'100%',borderWidth:0,marginTop:15,backgroundColor:'#D2D2D2',height:220,borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center'}}> 
                <Text style={{fontSize:15,fontWeight:600,color:'#909090'}}>No Available Data To Display</Text>
            </View>
            )}

        </View>

            




            <View style={{width:'100%',borderWidth:0,marginTop:5,backgroundColor:'white',paddingVertical:10,elevation:1}}>

                    <View style={styles.chartsHeaderWrapper}>

                        <View style={styles.chartsHeaderWrapperIcon}>

                        </View>
                        <Text style={styles.chartsHeader}>Fertilizer Application</Text>

                        <TouchableOpacity style={{flexShrink:1,borderWidth:0,marginLeft:'auto'}} onPress={()=> router.push(`/(screens)/FertilizerDetailed?plotAssocId=${encodeURIComponent(plotId as string)}`)}>

                            <Text style={styles.chartsHeaderViewMore}>View In Detail </Text>

                        </TouchableOpacity>

                    </View>


                    {fertilizerChartMonthlyTotal && fertilizerChartMonthlyTotal.length>0 ? (
                        <>
                            <BarChart
                            style={{ marginVertical: 8, borderRadius: 0,borderWidth:0,marginLeft: -25,}}
                            data={{
                                labels: [
                                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                                ],
                                datasets: [
                                {
                                    data: fertilizerChartMonthlyTotal
                                }
                                ]
                            }}
                            width={screenWidth+10}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix="kg"
                            chartConfig={{
                                backgroundGradientFrom: "#f1f1f1",
                                backgroundGradientTo: "#f1f1f1",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                barPercentage: 0.6,
     
                            }}
                            verticalLabelRotation={30}
                            />
                        </>
                    ):(                
                        <View style={{width:'100%',borderWidth:0,marginTop:15,backgroundColor:'#D2D2D2',height:220,borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center'}}> 
                            <Text style={{fontSize:15,fontWeight:600,color:'#909090'}}>No Available Data To Display</Text>
                        </View>
                    )}







                    
            </View>



    </ScrollView>










    </SafeAreaView>
  )
}

export default PlotManagementScreen

const styles = StyleSheet.create({
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
    legendWrapper:{
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        flexWrap:'wrap'
    },
    chartsHeaderWrapperIcon:{
        width:20,
        height:20,
        borderWidth:1,
        marginRight:5,
        backgroundColor:'#E9A800',
        borderRadius:5,
        color:"#37474F"
    },
    chartsHeaderWrapper:{
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:2,
        backgroundColor:'white'
    },
    chartsHeaderViewMore:{
        marginLeft:'auto',
        textDecorationLine:'underline',
        color:'#333333'
    },
    chartsHeader:{
        fontSize:17,
        fontWeight:500,
        color:"#37474F",
        //borderWidth:1,
        marginBottom:5,
        marginTop:5
    },
    mainContainer:{
        flex:1,
        display:"flex",
        flexDirection:'column',
        //borderWidth:1,
        alignItems:'center',
        paddingTop:0,
        backgroundColor:'#F2F3F5'
    },
    plotInfoContainer:{
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        //marginBottom:20,
        backgroundColor:'white',
        borderRadius:0,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:10,
        height:110,
        elevation:0
    },
    thumbnail:{
        width:140,
        height:90,
        //borderWidth:1,
        borderRadius:5,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#D2D2D2'
    },
    infoWrapper:{
        marginLeft:10,
        display:"flex",
        flex:1,
        flexDirection:'column',
        //borderWidth:1,
        marginBottom:'auto',
        height:'100%'
    },
    badge:{
        width:100,
        alignSelf:'flex-start',
        //borderWidth:1,
        marginTop:'auto',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        padding:0
    },

    infoHeaderwrapper:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',

    },


    //text

    plotName:{
        fontSize:18,
        fontWeight:600,
        color:"#37474F"
    },
    status:{
        fontSize:15,
        fontWeight:500
    }
})


const stylesNoRotation = StyleSheet.create({

    wrapper:{
        width:'100%',
        height:90,
        paddingHorizontal:5,
        paddingVertical:10,
        //borderWidth:1,
        backgroundColor:"white",
        display:'flex',
        flexDirection:'row',
        marginBottom:5,
        justifyContent:'center',
        
        elevation:1,

    },
    add:{
        width:70,
        height:70,
        //borderWidth:1,
        marginLeft:'auto',
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#D2D2D2',
    },
    textContainer:{
        flex:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        borderWidth:2,
        borderStyle:'dotted',
        borderRadius:10,
        marginRight:10,
        borderColor:'#9B9B9B'
    },
    text:{
        fontSize:15,
        fontWeight:500,
        color:'#9B9B9B'
    }
})

const stylesWRotation = StyleSheet.create({

    wrapper:{}
})

const stylesCrop = StyleSheet.create({

 
    wrapper:{
        width:'100%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        marginBottom:5,
        paddingTop:5,
        paddingBottom:5,
        paddingHorizontal:15,
        paddingVertical:50,
        //borderWidth:2,
        //borderStyle:'dotted',
        borderColor:'#253D2C',
        borderRadius:5,
        //backgroundColor:'#D8D8C0',
        backgroundColor:'white',
        elevation:1,


    },


    cropThumbnailWrapper:{
        width:70,
        height:50,
        //borderWidth:1,
        //borderRadius:'50%'
    },
    

    textContainer:{
        flex:1,
        display:'flex',
        flexDirection:'column',
        //alignItems:'center',
        //justifyContent:'center',
        //borderWidth:2,
        borderStyle:'dotted',
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        marginRight:10,
        borderColor:'#9B9B9B',
        marginLeft:10
    },


    datePlantedText:{
        fontSize:14,
        fontWeight:400,
        marginTop:'auto',
        color: '#333333',
    },
    cropNameText:{
        fontSize:16,
        fontWeight:500,
        color:"#37474F"
    }
})