import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';



interface FertilizerLogEntry {
    cropName: string;
    fertilizerAmmount: string;
    selectedApplication: string;
    DateApplied: string;
    fertilizerType: string;
}
interface Props {
data: FertilizerLogEntry[];  // 👈 array of objects
yearDataFilter:any[]
}

type PieDataEntry = {
    name: string; // fertilizer type
    amount: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
    month: number; // 0–11
    year: number; // e.g., 2025
  };



const FertilizerDistributionPiechart: React.FC<Props> = ({ data,yearDataFilter }) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

    const screenWidth = Dimensions.get('window').width;

// Color palette for each fertilizer type
const colorMap: Record<string, string> = {
    "14-14-14": "#4E79A7",   // muted blue
    "21-0-0": "#F28E2B",     // soft orange
    "0-0-60": "#E15759",     // coral red
    "46-0-0": "#76B7B2",     // teal
    "16-20-0": "#59A14F",    // earthy green
    // fallback color
    default: "#BEBEBE"       // light gray
  };



    const [selectedOption, setSelectedOption] = useState<String>('monthly');
    const handleSegmentChange = (value:String) => {
    setSelectedOption(value);
    };


    //controller filter
    const [selectedYearFilter,setSelectedYearFilter] = useState("2025");
    const [selectedMonthFilter,setSelectedMonthFilter] = useState<number>(0);


    //data 
    const [dataMain,setDataMain] = useState<FertilizerLogEntry[]>([]);
    const [pieData,setPieData] = useState<PieDataEntry[]>([]);

    //functions
    const generateFullPieData = (logs:any) => {
        const entries : any[]  = [];
      
        logs.forEach((log:any) => {
          const { fertilizerType, fertilizerAmmount, DateApplied } = log;
          const date = new Date(DateApplied);
          const amount = parseFloat(fertilizerAmmount) || 0;
          const month = date.getMonth();
          const year = date.getFullYear();
      
          entries.push({
            name: `${fertilizerType} (${amount} KG)`,
            amount,
            color: colorMap[fertilizerType] || colorMap.default,
            legendFontColor: '#333',
            legendFontSize: 15,
            month,
            year
          });
        });
      
        return entries;
      };
    

 useEffect(()=>{

    const generatedData =generateFullPieData(data)
    console.log("Generated data is : ",generatedData)
    setPieData(generatedData)
 },[])


 const getFilteredPieChartDataByYear = (year: string) => {
    const filtered = pieData.filter(item => item.year === parseInt(year));
    return groupPieData(filtered);
  };

  const getFilteredPieChartData = (month: number, year: string) => {
    console.log("Selected Month : ",month, "Selected Year : ",year)
    console.log("Pie data check : ", pieData)

    const selectedData = pieData[0];
    console.log("Pie Data ")
    console.log("Selected Data : ",selectedData)
    if(selectedData?.month == month){
        console.log("Same month selected")
    }
    const filtered = pieData.filter(item => item.month == month && item.year === parseInt(year));
    console.log("Filtered Data : ",filtered)
    return groupPieData(filtered);
  };
  

  const groupPieData = (data: PieDataEntry[]) => {
    const grouped:any = {};
    data.forEach((item) => {
      if (grouped[item.name]) {
        grouped[item.name].amount += item.amount;
      } else {
        grouped[item.name] = { ...item };
      }
    });
    return Object.values(grouped);
  };



  return (
    <View style={styles.componentMainWrapper}>

        <View style={styles.componentHeaderWrapper}>
            <Text style={styles.componentHeaderText}>Fertilizer Type Breakdown</Text>


            <View style={styles.segmentContainer}>


                <TouchableOpacity
                    style={styles.segmentButton}
                    onPress={() => handleSegmentChange('monthly')}
                >
                    <Text
                    style={[
                        styles.segmentText,
                        selectedOption === 'monthly' && styles.activeText,
                    ]}
                    >
                    Monthly
                    </Text>
                    {selectedOption === 'monthly' && (
                    <View style={styles.activeLine} />
                    )}
                </TouchableOpacity>



                <TouchableOpacity
                    style={styles.segmentButton}
                    onPress={() => handleSegmentChange('yearly')}
                >
                    <Text
                    style={[
                        styles.segmentText,
                        selectedOption === 'yearly' && styles.activeText,
                    ]}
                    >
                    Yearly
                    </Text>
                    {selectedOption === 'yearly' && (
                    <View style={styles.activeLine} />
                    )}
                    </TouchableOpacity>

            </View>


        </View>


        <View style={styles.componentChartWrapper}>
            {selectedOption === 'yearly' && (() => {
                const data = getFilteredPieChartDataByYear(selectedYearFilter);
                return data.length > 0 ? (
                <PieChart
                    data={data}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    color: () => "#000"
                    }}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
                ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 220 }}>
                    <Text style={{ color: '#888', fontSize: 16 }}>No data available for this year.</Text>
                </View>
                );
            })()}

            {selectedOption === 'monthly' && (() => {
                const data = getFilteredPieChartData(selectedMonthFilter, selectedYearFilter);
                return data.length > 0 ? (
                <PieChart
                    data={data}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    color: () => "#000"
                    }}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
                ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 220 }}>
                    <Text style={{ color: '#888', fontSize: 16 }}>No data available for this month.</Text>
                </View>
                );
            })()}
        </View>


        <View style={styles.componentFilterWrapper}>
            

            {selectedOption === 'monthly' && (
                <>
                {/* Month Dropdown */}
                <Picker selectedValue={selectedMonthFilter} onValueChange={setSelectedMonthFilter}>
                    {months.map((month, index) => (
                    <Picker.Item key={month} label={month} value={index} />
                    ))}
                </Picker>

                {/* Year Dropdown */}
                <Picker selectedValue={selectedYearFilter} onValueChange={setSelectedYearFilter}>
                    {yearDataFilter.map(year => (
                    <Picker.Item key={year} label={`${year}`} value={year} />
                    ))}
                </Picker>
                </>
            )}

            {selectedOption === 'yearly' && (

                <Picker style={{padding:0,borderRadius:5,fontSize:16}}
                onValueChange={(value) => {setSelectedYearFilter(value as string)}}
                >   

                    {yearDataFilter && yearDataFilter.length>0 && yearDataFilter.map((year,index)=>(
                    <Picker.Item label={year} value={year} />

                    ))}
                

                </Picker>

            )}
        </View>







      
    </View>
  )
}









export default FertilizerDistributionPiechart

const styles = StyleSheet.create({
    //main
    componentMainWrapper:{
        width:'100%',
        paddingVertical:10,
        borderWidth:1,
        borderColor:'red'
    },
    componentHeaderWrapper:{
        width:'100%',
        paddingVertical:10,
        borderColor:'blue',
        borderWidth:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },

    componentFilterWrapper:{
        paddingVertical:5,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:'yellow',
        gap:20
    },
    componentChartWrapper:{
        width:'100%'
    },


    //text
    componentHeaderText:{
        fontSize:16,
        fontWeight:600,
        marginBottom:10
    },




    //segment

    segmentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        //borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        //borderWidth:1,
        width:'90%',
        gap:25
      },
      segmentButton: {
        alignItems: 'center',
        paddingVertical: 5,
      },
      segmentText: {
        color: 'black',
        fontSize: 14,
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