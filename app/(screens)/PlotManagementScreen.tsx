import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'


import Feather from '@expo/vector-icons/Feather';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CropPlanCard from '@/components/genComponents/CropPlanCard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useSearchParams } from 'expo-router/build/hooks';
import { cropsImages } from '../Pestdat';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,

    StackedBarChart
  } from "react-native-chart-kit";

interface PlotData{
    PlotId : string,
    PlotName: string
  }
interface CurrentCrop{
    CropAssocId:string | null,
    CropId:string | null,
    CropName:string | null
}
  
interface Plots{
    PlotId : string,
    PlotName: string
    currentCrops:CurrentCrop


}

interface PestLog {
    Date: string;
    CropName: string;
    PestName: string;
  }

const PlotManagementScreen = () => {

    const [pestLogs, setPestLogs] = useState<PestLog[]>([]);
    const [chartData,setChartData] = useState<any>(null);
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
        PlotName: '',  // Initialize as an empty array
        currentCrops: { CropAssocId: '', CropId: '', CropName: '' } // Initialize as an empty object (map)
      });



    const searchParams = useSearchParams();

    const plotId = searchParams.get('plotAssocId');


    
    useEffect(() => {
        const fetchPlotData = async (plotId: string) => {
          try {
            const docRef = doc(db, 'Plots', 'xt4foVBpVYqoM4kdAWBC');
            const docSnap = await getDoc(docRef);
      
            if (docSnap.exists()) {
              const rawData = docSnap.data().Plots as any[];
      
              const foundPlot = rawData.find(plot => plot.PlotId === plotId);
      
              if (foundPlot) {
                const formattedData: Plots = {
                  PlotId: foundPlot.PlotId,
                  PlotName: foundPlot.PlotName,
                  currentCrops: foundPlot.CurrentCrops || {
                    CropAssocId: null,
                    CropId: null,
                    CropName: null
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



                const docRef = doc(db,'Records','aRZmpszYmKkzNKJVzSJt')
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
                    
                    console.log( "Filtered Plot Pest log entry", existingLogs[logIndex].PlotPestLog)
                    setPestLogs(existingLogs[logIndex].PlotPestLog)


                }else{
                    console.log("Document not found records")
                }


                






            }catch(err){
                console.error(err)
            }




        }

      
        if (plotId) {
          fetchPlotData(plotId);
          fetchPestLogRecord(plotId)
        }
      }, [plotId]);




      useEffect(()=>{



        const getWeeklyPestCounts = (logs:any) => {
            const pests = ["whiteflies", "thrips", "fruitworm"];
            const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
          
            // Initialize weekly occurrence count
            const weeklyData = pests.reduce((acc:any, pest) => {
              acc[pest] = new Array(5).fill(0); // 5 weeks, initialized to 0
              return acc;
            }, {});
          
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
                    label: pest.charAt(0).toUpperCase() + pest.slice(1), // Capitalize label
                    data: weeklyData[pest], 
                 // Assign color
                })),
             };
          };
          
          setChartData(getWeeklyPestCounts(pestLogs))
        
      },[pestLogs])


 
  const checkPlotData = () => {
    console.log(chartData)
  }

 
  return (
    <SafeAreaView style={styles.mainContainer}>

        <View style={styles.plotInfoContainer}>
            <View style={styles.thumbnail}></View>
            <View style={styles.infoWrapper}>
                <View style={styles.infoHeaderwrapper}>
                    <Text  style={styles.plotName}>{plotData.PlotName}</Text>
                    <Feather name="edit" size={20} color="black" style={{marginLeft:5}}/>

                </View>
                
                <View style={[styles.badge]}>


                    {plotData.currentCrops.CropAssocId ? (

                        <Text style={styles.status} >
                            Growing
                        </Text>

                    ) : (
                        <Text style={styles.status} >
                            Resting
                        </Text>
                    )}

                </View>
            </View>
        </View>


        <TouchableOpacity onPress={checkPlotData}>TEST</TouchableOpacity>


        // rotation plan
        






        {plotData?.currentCrops.CropAssocId !== null ? (
            

            <View style={stylesCrop.wrapper}>
                <View style= {stylesCrop.cropThumbnailWrapper}>
                    <Image style={{width:'100%',height:'100%',objectFit:'contain',borderRadius:'50%'}} source={cropsImages[plotData.currentCrops.CropId]}/>
                </View>
                <View style={stylesCrop.textContainer}>
                    <Text style={stylesCrop.cropNameText}>
                        {plotData.currentCrops.CropName}
                    </Text>

                    <Text style={stylesCrop.datePlantedText}>
                        Date Planted
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
                <View style={stylesNoRotation.add}>
                    <FontAwesomeIcon icon={faPlus} size={40} color='#FFFFFF'/>
                </View>
            </View>

        )}




    <View style={{borderWidth:0}}>

        <View style={styles.chartsHeaderWrapper}>
            <Text style={styles.chartsHeader}>Pest Occurrences Per Week</Text>

            <Text style={styles.chartsHeaderViewMore}>View In Detail </Text>
        </View>
        

    {chartData && (

        <LineChart
            data={{
                labels: chartData.labels, // Weeks
                datasets: chartData.datasets, // Pest occurrence per week
            }}
            width={Dimensions.get("window").width * .95} // from react-native
            height={220}
            //yAxisLabel="$"
            //yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
            borderRadius: 16
            }}
        />





    )}
    
    </View>










    </SafeAreaView>
  )
}

export default PlotManagementScreen

const styles = StyleSheet.create({
    chartsHeaderWrapper:{
        width:'100%',
        borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    chartsHeader:{
        fontSize:17,
        fontWeight:500,
        color:'#253D2C',
        marginBottom:5,
        marginTop:5
    },
    mainContainer:{
        flex:1,
        display:"flex",
        flexDirection:'column',
        //borderWidth:1,
        alignItems:'center',
        paddingTop:10
    },
    plotInfoContainer:{
        width:'95%',
        borderWidth:1,
        display:'flex',
        flexDirection:'row',
        marginBottom:20
    },
    thumbnail:{
        width:140,
        height:90,
        borderWidth:1
    },
    infoWrapper:{
        marginLeft:10,
        display:"flex",
        flexDirection:'column',
        borderWidth:1,
        marginBottom:'auto',
        height:'100%'
    },
    badge:{
        width:100,
        height:20,
        borderWidth:1,
        marginTop:'auto',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        padding:10
    },

    infoHeaderwrapper:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',

    },


    //text

    plotName:{
        fontSize:18,
        fontWeight:500
    },
    status:{
        fontSize:15,
        fontWeight:500
    }
})


const stylesNoRotation = StyleSheet.create({

    wrapper:{
        width:'95%',
        
        display:'flex',
        flexDirection:'row',
        marginBottom:20,

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
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
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
        width:'95%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'row',
        marginBottom:20,
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:5,
        borderWidth:2,
        borderStyle:'dotted',
        borderColor:'#253D2C',
        borderRadius:10

    },


    cropThumbnailWrapper:{
        width:50,
        height:50,
        borderWidth:1,
        borderRadius:'50%'
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
        fontSize:15,
        fontWeight:400,
        marginTop:'auto',
        color: '#253D2C',
    },
    cropNameText:{
        fontSize:16,
        fontWeight:600,
        color: '#253D2C',
    }
})