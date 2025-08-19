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
    console.log("Generated data for pie chart is : ",generatedData)
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



  const piePaddingLeftValue = ((screenWidth * 0.95) - 230) /2

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

                <>
                  <PieChart
                      style={{
                        marginLeft: 0,
                        alignSelf:'center',
                        borderWidth:0  // reset any default offset
                      }}
                      data={data}
                      width={220}
                      height={220}
                      chartConfig={{
                      backgroundColor: "#fff",
                      backgroundGradientFrom: "#fff",
                      backgroundGradientTo: "#fff",
                      color: () => "#000"
                      
                      }}
                      accessor="amount"
                      backgroundColor="transparent"
                      paddingLeft={String(piePaddingLeftValue)}
                      absolute={false}
                      hasLegend={false}
                  />


                  <View style={{width:'100%',borderWidth:0,padding:5,display:'flex',flexDirection:'column'}}>
                        {(data as any[]).map((item,index)=>(
                          <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>

                            <View style={{
                              width:15,
                              height:15,
                              backgroundColor:item.color,
                              marginRight:8,
                              borderRadius:'50%'
                            }}> 


                              
                            </View>


                            <Text style={{fontSize:14,color:"#333"}}>
                                {item.amount} {item.name}
                            </Text>

                          </View>
                        ))}
                  </View>
                </>
                ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 220 }}>
                    <Text style={{ color: '#888', fontSize: 16 }}>No data available for this year.</Text>
                </View>
                );
            })()}

            {selectedOption === 'monthly' && (() => {
                const data = getFilteredPieChartData(selectedMonthFilter, selectedYearFilter);
                return data.length > 0 ? (
                  <>
                  <PieChart
                      data={data}
                      width={220}
                      height={220}
                      chartConfig={{
                      backgroundColor: "#fff",
                      backgroundGradientFrom: "#fff",
                      backgroundGradientTo: "#fff",
                      color: () => "#000"
                      }}
                      accessor="amount"
                      backgroundColor="transparent"
                      paddingLeft={String(piePaddingLeftValue)}
                      absolute={false}
                      hasLegend={false}
                      style={{
                        marginLeft: 0,
                        alignSelf:'center',
                        borderWidth:0  // reset any default offset
                      }}
                      center={[0, 0]}
                  />

                  <View style={{width:'100%',borderWidth:0,padding:5,display:'flex',flexDirection:'column'}}>
                      {(data as any[]).map((item,index)=>(
                        <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>

                          <View style={{
                            width:15,
                            height:15,
                            backgroundColor:item.color,
                            marginRight:8,
                            borderRadius:'50%'
                          }}> 


                            
                          </View>


                          <Text style={{fontSize:14,color:"#333"}}>
                              {item.amount} {item.name}
                          </Text>

                        </View>
                      ))}
                  </View>
                
                </>
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

              <View style={{borderWidth:1,borderRadius:5,borderColor:'#E2E8f0'}}>

                <Picker
                  selectedValue={selectedMonthFilter}
                  onValueChange={setSelectedMonthFilter}
                  style={{ height: 50,width:150 }} // 👈 fix for native rendering
                >
                  {months.map((month, index) => (
                    <Picker.Item key={month} label={month} value={index} />
                  ))}

                </Picker>

              </View>


              {/* Year Dropdown */}

              <View style={{borderWidth:1,borderRadius:5,borderColor:'#E2E8f0'}}>

                <Picker
                  selectedValue={selectedYearFilter}
                  onValueChange={setSelectedYearFilter}
                  style={{ height: 50,width:150,borderWidth:2,borderColor:'red' }} // 👈 fix for native rendering
                >
                  {yearDataFilter.map((year) => (
                    <Picker.Item key={year} label={`${year}`} value={year} />
                  ))}
    
                </Picker>

              </View>

            </>
          )}

            {selectedOption === 'yearly' && (

                <View style={{borderWidth:1,borderRadius:5,borderColor:'#E2E8f0'}}>
                  

                  <Picker style={{padding:0,borderRadius:5,fontSize:16,width:150,height:50,borderWidth:1}}
                  onValueChange={(value) => {setSelectedYearFilter(value as string)}}
                  >   

                      {yearDataFilter && yearDataFilter.length>0 && yearDataFilter.map((year,index)=>(
                      <Picker.Item label={year} value={year}  />

                      ))}
                  

                  </Picker>
                </View>
            )}
        </View>








      
    </View>
  )
}









export default FertilizerDistributionPiechart

const styles = StyleSheet.create({
    //main
    componentMainWrapper:{
        width:'95%',
        borderRadius:5,
        borderWidth:1,
        borderColor:'#E2E8F0',
        marginBottom:5,
        marginTop:5,
        backgroundColor:'white'
      
    },
    componentHeaderWrapper:{
        width:'100%',
        padding:10,
        borderColor:'blue',
        borderWidth:0,
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'center'
    },

    componentFilterWrapper:{
        paddingVertical:15,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        //borderWidth:1,
        borderColor:'yellow',
        gap:20
    },
    componentChartWrapper:{
        width:'100%',
        borderWidth:0,
    },


    //text
    componentHeaderText:{
        fontSize:20,
        fontWeight:600,
        marginBottom:10,
        color:'#37474F'
    },




    //segment

    segmentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        //borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderWidth:0,
      
        gap:25
      },
      segmentButton: {
        alignItems: 'center',
        paddingVertical: 0,
      },
      segmentText: {
        color: ' #64748B',
        fontSize: 15,
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