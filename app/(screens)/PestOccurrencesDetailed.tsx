import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Appbar, Checkbox, PaperProvider } from 'react-native-paper'
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from 'react-native-gesture-handler';


import { DataTable } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useSearchParams } from 'expo-router/build/hooks';


import DatePicker from 'react-native-date-picker';
import { LineChart,PieChart } from 'react-native-chart-kit';
import { useNavigation } from 'expo-router';
import { useUserContext } from '../Context/UserContext';

interface PestLog {
    Date:string,
    CropName:string,
    Pestname:string,
    Temp:number
}



const PestOccurrencesDetailed = () => {



      

    const {user} = useUserContext();

    //comparison handlers 

    /*
    const [selectedDate, setSelectedDate] = useState(new Date("2025-03-23"));
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [comparisonType, setComparisonType] = useState("previous_month"); // Default comparison
    const [chartData, setChartData] = useState<any>([]);
    */



    const searchParams = useSearchParams();

    const plotId = searchParams.get('plotAssocId');

  //record data <start>

    const [pestLogs,setPestLogs] = useState<PestLog[]>([]);

  //record data <end>



  //tabular settings <start> 

  

  const [selectedSummary,setSelectedSummary] = React.useState("Overall") 
  
  const [pestCounts, setPestCounts] = useState<{ name: string; count: number }[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );



  const [selectedPests, setSelectedPests] = useState<string[]>([]);
  const [selectedPestTempVOccurrences, setSelectedPestTempVOccurrences] = useState<string[]>([]);
  const [selectedCropForChart,setSelectedCropForChart] = useState<string[]>([]);


    const togglePestSelection = (pest: string) => {
        setSelectedPests(prev =>
            prev.includes(pest)
                ? prev.filter(p => p !== pest) // Remove if already selected
                : [...prev, pest] // Add if not selected
        );
    };

    const togglePestSelectionTempVOccurrences = (pest: string) => {

        setSelectedPestTempVOccurrences(prev =>
            prev.includes(pest)
                ? prev.filter(p => p !== pest) // Remove if already selected
                : [...prev, pest] // Add if not selected
        );


    }

    const toggleCropSelectionChartOccurence = (crop:string)=>{

        setSelectedCropForChart(prev=>
            prev.includes(crop)
                ? prev.filter(c => c !== crop) // Remove if already selected
                : [...prev, crop] // Add if not selected
        )
    }

  const [chartData,setChartData] = useState<any>(null);
  const [pieChartData,setPieChartData] = useState<any>(null);



  const [chartDataTempVOccurrences,setChartDataTempVOccurrences] = useState<any>(null);


  const [pestListData,setPestListData] = useState<string[]>([])
  const [cropNameListData,setCropNameListData] = useState<string[]>([])


  //tabular settings <end>



  const [items] = React.useState([
   {
     key: 1,
     name: 'Cupcake',
     calories: 356,
     fat: 16,
   },
   {
     key: 2,
     name: 'Eclair',
     calories: 262,
     fat: 16,
   },
   {
     key: 3,
     name: 'Frozen yogurt',
     calories: 159,
     fat: 6,
   },
   {
     key: 4,
     name: 'Gingerbread',
     calories: 305,
     fat: 3.7,
   },
  ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);


  const displayData = (pestLogs: PestLog[], selectedPests: string[]) => {
    // Helper function to get short month name (e.g., "Jan", "Feb", "Mar")
    const getMonthShortName = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('default', { month: 'short' }); // "Jan", "Feb", etc.
    };

    // Filter logs by selected pests
    const filteredLogs = pestLogs.filter((log: any) => selectedPests.includes(log.Pestname));
    console.log("Filtered Log:", filteredLogs);

    // Group data by pest name and month
    const groupedData: Record<string, Record<string, number>> = {};
    filteredLogs.forEach((log) => {
        const { Pestname, Date } = log;
        const month = getMonthShortName(Date);

        if (!groupedData[Pestname]) {
            groupedData[Pestname] = {};
        }
        groupedData[Pestname][month] = (groupedData[Pestname][month] || 0) + 1;
    });
    console.log("Grouped Data:", groupedData);

    // Ensure all months are present (Jan to Dec)
    const allMonths = Array.from({ length: 12 }, (_, i) =>
        new Date(2025, i, 1).toLocaleString('default', { month: 'short' })
    );

    // Convert data into chart-friendly format
    const dataset = selectedPests.map((pest, index) => ({
        label: pest,
        data: allMonths.map((month) => groupedData[pest]?.[month] || 0), // Default to 0 if no data
        color: `hsl(${index * 60}, 70%, 50%)`, // Assign unique colors dynamically
    }));

    setChartData(dataset);
    console.log("Chart Data:", dataset);
};
 


 const displayDataTempVOccu = (pestLogs:PestLog[],selectedPests:string[])=>{
    

    console.log("At DisplayDataTempVOccu_Function .....")
    console.log("Passed Pest Logs Data : ", pestLogs),
    console.log("Selected Pests Data : ", selectedPests)


    console.log("Filtering pest logs by selected pests...")

    const filteredLogs = pestLogs.filter((log: any) => selectedPests.includes(log.Pestname));
    console.log("Filtered Log:", filteredLogs);






    const uniqueTemps = [...new Set(filteredLogs.map(item => item.Temp))].sort((a, b) => a - b);
    console.log("Unique Temps : ", uniqueTemps)



    const pestCounts: Record<string, number[]> = {};
    const pestTypes = [...new Set(filteredLogs.map(item=>item.Pestname))];
    console.log("Pest type : ", pestTypes)

    pestTypes.forEach(pest => {
        pestCounts[pest] = new Array(uniqueTemps.length).fill(0);
    })

    console.log("Pest Count Before : ", pestCounts)

    


    filteredLogs.forEach(({ Pestname, Temp }) => {
        const tempIndex = uniqueTemps.indexOf(Temp);
        if (tempIndex !== -1) {
          pestCounts[Pestname][tempIndex]++;
        }
      });

      console.log("Pest Count After : ", pestCounts)


    
    const generateColor = (index:any) => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
    
    const colors = pestTypes.map(() => 
        `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`
    );


    console.log("Exiting DisplayDataTempVOccu_Function (Success).....")
    
    return {
        labels: uniqueTemps.map(temp => `${temp}°C`),
        datasets: pestTypes.map((pest,index)=>({
            data: pestCounts[pest],
            color: (opacity = 1) => colors[index],
        })),
        colors, 
    }

    /*
    setChartDataTempVOccurrences(chartDataFinal)
    console.log(chartDataFinal)
    */
    


 }




 const displayPieChartData = (pestLogs:PestLog[],selectedCrop:string[])=>{

    if(selectedCrop.length === 0) return [];

    console.log("At display pie chart function .......")
    console.log("Passed Pest Logs Data : ", pestLogs)
    console.log("Selected Crops Data : ", selectedCrop)


    console.log("Filtering logs by selected crops...")

    const filteredLogs = pestLogs.filter((log:any)=> selectedCrop.includes(log.Cropname));
    console.log("Filter logs by cropname : ", filteredLogs)

    const pestCounts = pestLogs.reduce((acc, log) => {
        acc[log.Pestname] = (acc[log.Pestname] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    

    const generateColor = () =>
    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;

    return Object.keys(pestCounts).map((pest, index) => ({
        name: pest,
        population: pestCounts[pest],
        color: generateColor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
    }));

 }




  useEffect(()=> {
    


    const fetchPestLogRecord = async(plotId:String)=>{




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
                    const cropNames = [...new Set(plotPestLog.map((log: any) => log.CropName))]
                    console.log("Pest List Data: ", pestNames);

                    setPestListData(pestNames as string[])
                    setCropNameListData(cropNames as string[])
                    setPestLogs(existingLogs[logIndex].PlotPestLog)


                }else{
                    console.log("Document not found records")
                }


                






            }catch(err){
                console.error(err)
            }



    }

    fetchPestLogRecord(plotId as string)


  },[plotId])




  useEffect(()=> {



    const formatPestLogToCount = (PestLog:any) => {

        console.log("Formatting Pest Log to Count...")
        console.log("Pest log data : ", pestLogs)
        const pestMap: Record<string,number> = {};



        PestLog.forEach((log:any)=> {

            const pestName = log.Pestname;
            if(pestName){
                pestMap[pestName] = (pestMap[pestName] || 0) + 1;
            }
        })

        console.log("Processed Pest Map : ", pestMap)

        const formattedPests = Object.entries(pestMap).map(([name, count]) => ({
            name,
            count,
          }));

        console.log("Formatted Pest Map : ", formattedPests)


        setPestCounts(formattedPests)
        
        console.log("Format Complete");

        

    }


    formatPestLogToCount(pestLogs)
  },[pestLogs])





  const testParam = () => {
    displayData(pestLogs,selectedPests)
    
  }

  const displayTempVOccuChart = (pestLogPass:PestLog[], selectedPestsPass:string[]) =>{

    setChartDataTempVOccurrences(displayDataTempVOccu(pestLogPass,selectedPestsPass))
    console.log("ChartData for TempVOccu : ", chartDataTempVOccurrences)
  }

  const displayPieChartOccurent = (pestLogPass:PestLog[],selectedCropPass:string[])=>{
    setPieChartData(displayPieChartData(pestLogPass ,selectedCropPass))
    console.log("Pie chart data for pie chart : ", pieChartData)
  }


  const navigation = useNavigation()


  return (
    <PaperProvider>

    

        <SafeAreaView style={styles.mainContainer}>





            <Appbar.Header style={{width:'100%',flex:1}}>
            <Appbar.BackAction onPress={()=> navigation.goBack()} />
            <Appbar.Content title="Pest Occurrences Detailed Overview" />
            </Appbar.Header>





            <ScrollView style={styles.scrollContainer} contentContainerStyle={{alignItems:'center'}}>

                <View style={styleSummaryCard.Wrapper}>
                    <View style={styleSummaryCard.Header}>
                        <Text style={styleSummaryCard.HeaderText}>
                            Most Frequent Pest
                        </Text>


                        <View  style={styleSummaryCard.PickerWrapper}>
                        
                            <Picker
                                style={styleSummaryCard.Picker}
                                selectedValue={selectedSummary}
                                onValueChange={(itemValue) => setSelectedSummary(itemValue)}
                            >
                                <Picker.Item label="Overall" value="Overall" />
                                <Picker.Item label="Monthly" value="Monthly" />
                                <Picker.Item label="Quarterly" value="Quarterly" />
                                <Picker.Item label="Yearly" value="Yearly" />
                            </Picker>
                        </View>
                    </View>


                    <View>

                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Pest Name</DataTable.Title>
                                <DataTable.Title numeric>Log Count</DataTable.Title>
                            </DataTable.Header>

                            {pestCounts?.slice(from, to).map((item, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell>{item.name}</DataTable.Cell>
                                <DataTable.Cell numeric>{item.count}</DataTable.Cell>
                                </DataTable.Row>
                            ))}

                            <DataTable.Pagination
                                page={page}
                                numberOfPages={Math.ceil(pestCounts.length / itemsPerPage)}
                                onPageChange={(page) => setPage(page)}
                                label={`${from + 1}-${to} of ${pestCounts?.length}`}
                                numberOfItemsPerPageList={numberOfItemsPerPageList}
                                numberOfItemsPerPage={itemsPerPage}
                                onItemsPerPageChange={onItemsPerPageChange}
                                showFastPaginationControls
                                selectPageDropdownLabel={'Rows per page'}
                            />
                        </DataTable>

                    </View>



                </View>







                <View style={stylePie.wrapper}>


                    <View style={styleComparisonChart.headerWrapper}>
                        <Text style={styleComparisonChart.headerText}>
                            Pest Distribution
                        </Text>
                    </View >



                    <View style={styleComparisonChart.chartWrapper}>


                        {pieChartData && pieChartData.length > 0 && (



                            <PieChart
                            data={pieChartData}
                            width={Dimensions.get("window").width - 20}
                            height={220}
                            chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                            />
                            
                        )}





                    </View>


                    <View style={styleComparisonChart.controlWrapper}>
                            {cropNameListData?.map((item, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Checkbox
                                        status={selectedCropForChart.includes(item) ? 'checked' : 'unchecked'}
                                        onPress={() => toggleCropSelectionChartOccurence(item)}
                                    />
                                    <Text>{item}</Text>
                                </View>
                            ))}
                    </View>


                    <TouchableOpacity style={styleComparisonChart.button} onPress={()=> displayPieChartOccurent(pestLogs,selectedCropForChart)}>

                        <Text style={styleComparisonChart.buttonText} >
                            Display Data
                        </Text>


                    </TouchableOpacity>


                </View>












                <View style={styleComparisonChart.wrapper}>

                    <View style={styleComparisonChart.headerWrapper}>
                        <Text style={styleComparisonChart.headerText}>
                            Pest Occurrence Monthly
                        </Text>
                    </View >

                    <View style={styleComparisonChart.chartWrapper}>


                    {chartData && chartData.length > 0 && (
                        <LineChart
                            data={{
                                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                datasets: chartData.map((pest: any) => ({
                                    data: pest.data,
                                    color: () => pest.color,
                                })),
                            }}
                            width={400}
                            height={220}
                            yAxisLabel=""
                            bezier
                            //yAxisSuffix=" occurrences"
                            chartConfig={{
                                backgroundGradientFrom: "#fff",
                                backgroundGradientTo: "#fff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                        />

                    )}

                    </View>

                    <View style={styleComparisonChart.legendWrapper}>


                        {chartData?.map((pest:any, index:any) => (
                                <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                                    <View style={{
                                        width: 15,
                                        height: 15,
                                        backgroundColor: pest.color,
                                        marginRight: 5,
                                        borderRadius: 3,
                                        borderWidth: 1,
                                    }} />
                                    <Text>{pest.label}</Text>
                                </View>
                                ))}


                    </View>

                    <View style={styleComparisonChart.controlWrapper}>
                        {pestListData?.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Checkbox
                                    status={selectedPests.includes(item) ? 'checked' : 'unchecked'}
                                    onPress={() => togglePestSelection(item)}
                                />
                                <Text>{item}</Text>
                            </View>
                        ))}
                    </View>

                        <TouchableOpacity style={styleComparisonChart.button}  onPress={testParam}>

                            <Text style={styleComparisonChart.buttonText}>
                                Display Data
                            </Text>
                         

                        </TouchableOpacity>
                </View>


         //temp chart

                <View style={styleComparisonChart.wrapper}>

                    <View style={styleComparisonChart.headerWrapper}>
                        <Text style={styleComparisonChart.headerText}>
                            Pest Occurrence vs Temperature Trend
                        </Text>
                    </View >

                    <View style={styleComparisonChart.chartWrapper}>


                    {chartDataTempVOccurrences && chartDataTempVOccurrences.labels.length > 0 && (
                        <LineChart
                        data={chartDataTempVOccurrences}
                        width={Dimensions.get("window").width * 0.95}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                            borderRadius: 16,
                            },
                            propsForDots: {
                            r: "5",
                            strokeWidth: "2",
                            stroke: "#ffa726",
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                        />

                    )}

                    </View>


           

                    <View style={styleComparisonChart.legendWrapper}>



                    {chartDataTempVOccurrences?.datasets?.map((dataset:any, index:any) => (
                        <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                            <View
                                style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: chartDataTempVOccurrences.colors[index],// Ensure color function works
                                    marginRight: 5,
                                    borderRadius: 3,
                                    borderWidth: 1,
                                }}
                            />
                            <Text>{selectedPestTempVOccurrences[index]}</Text>
                        </View>
                    ))}




                    </View>

                    <View style={styleComparisonChart.controlWrapper}>
                        {pestListData?.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Checkbox
                                    status={selectedPestTempVOccurrences.includes(item) ? 'checked' : 'unchecked'}
                                    onPress={() => togglePestSelectionTempVOccurrences(item)}
                                />
                                <Text>{item}</Text>
                            </View>
                        ))}
                    </View>

                        <TouchableOpacity style={styleComparisonChart.button} onPress={()=> displayTempVOccuChart(pestLogs,selectedPestTempVOccurrences)}>

                            <Text style={styleComparisonChart.buttonText} >
                                Display Data
                            </Text>
                         

                        </TouchableOpacity>
                </View>



                




                




                <TouchableOpacity onPress={()=>console.log(cropNameListData)}>See crops</TouchableOpacity>

            </ScrollView>


            






        </SafeAreaView>

    </PaperProvider>

  )
}

export default PestOccurrencesDetailed

const styles = StyleSheet.create({
    scrollContainer:{
        display:'flex',
        flexDirection:'column',
        width:'100%',
        //borderWidth:1,
        paddingTop:20,
        flex:1
        
    },

    mainContainer:{
        flex:1
    }
})




const stylePie = StyleSheet.create({
    wrapper:{
        width:'95%',
        //borderWidth:1,
        marginBottom:20,
        backgroundColor:'#FAF3E0',
        
    },

})


const styleComparisonChart = StyleSheet.create({

    button: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        //borderWidth: 1,
        alignSelf: "flex-start", // Makes the button fit the child content
        borderRadius:5,
        marginTop:10,
        marginBottom:10,
        marginLeft:10,
        backgroundColor:"#2e6f40"
    },
    buttonText:{
        fontSize:15,
        fontWeight:400,
        color:'#ffffff'
    },
    wrapper:{
        width:'95%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        paddingTop:10,
        //paddingBottom:10,
        borderRadius:5,
        backgroundColor:'#FAF3E0'
    },

    headerWrapper:{
        display:'flex',
        flexDirection:'row',
        width:'100%',
        borderColor:'blue',
        //borderWidth:1,
        padding:5,
        //marginBottom:15
    },


    chartWrapper:{
        width:'100%',
        borderColor:'red',
        //borderWidth:1,
    },


    controlWrapper:{
        width:'95%',
        borderColor:'#d9d9d9',
        //borderWidth:1,
        marginLeft:'auto',
        marginRight:'auto',
        paddingTop:5,
        paddingBottom:5,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        flexWrap:'wrap',
        gap:20,
        borderBottomWidth:1
    },

    legendWrapper:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        gap:20,
        alignItems:'center',
        justifyContent:'center',
        paddingTop:5,
        paddingBottom:5,
        flexWrap:'wrap'
    },

    //text 

    headerText:{
        fontSize:16,
        fontWeight:500,
        color:'#253D2C'
    }




})

const styleSummaryCard = StyleSheet.create({

    Wrapper:{
        width:'95%',
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',
        marginBottom:15,
        borderRadius:5,
        backgroundColor:'#FAF3E0',
        //padding:10,
        paddingTop:10,
        paddingBottom:10
    },
    Header:{
        display:'flex',
        flexDirection:'row',
        //borderWidth:1,
        width:'100%',
        padding:5,
        alignItems:'center'
    },
    HeaderText:{
        fontSize:16,
        fontWeight:500,
        color:'#253D2C'
    },
    PickerWrapper:{
        marginLeft:'auto',
        paddingLeft:10,
        paddingRight:10
    },
    Picker:{
        padding:5,
        borderRadius:5
    },

})