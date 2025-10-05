import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Checkbox } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import { useLanguage } from '@/app/Context/LanguageContex';




interface FertilizerLogEntry {
    cropName: string;
    fertilizerAmmount: string;
    selectedApplication: string;
    DateApplied: string;
    fertilizerType: string;
}

interface cropsDat{
    cropNames:string[];
    data: FertilizerLogEntry[];
}
const FertilizerUsageByCrop:React.FC<cropsDat> = ({cropNames,data}) => {
  const{language,setLanguage} = useLanguage() 


  const [selectedCrops,setSelectedCrops] = useState<string[]>([]);  
  const [formattedData, setFormattedData] = useState<any>({});
  const toggleCropSelection = (crop:string)=>{

    setSelectedCrops(prev=>
        prev.includes(crop)
            ? prev.filter(c => c !== crop) // Remove if already selected
            : [...prev, crop] // Add if not selected
    )
}




  const formatDataForBarchart = (dataSet: FertilizerLogEntry[]) => {
      


    const cropMap : Record<string,number>= {};

    dataSet.forEach((entry)=>{
        const crop = entry.cropName;
        const amount = parseFloat(entry.fertilizerAmmount) || 0;

        if(cropMap[crop]){
            cropMap[crop] += amount;
        }else{
            cropMap[crop] = amount;
        }



    })





    const labels = Object.keys(cropMap);
    const data = Object.values(cropMap);

    return{
        labels,
        datasets:[
            {
                data
            }
        ]
    }
  }


  useEffect(()=>{

    console.log("Initial data set for barChart : ", data)
    const formattedBarData = formatDataForBarchart(data);
    console.log(formattedBarData)
    setFormattedData(formattedBarData)
  },[])


  const filteredBarData = {
    labels: formattedData.labels?.filter((label:any, index:any) =>
      selectedCrops.includes(label)
    ),
    datasets: [
      {
        data: formattedData.datasets?.[0]?.data?.filter((_ : any, index:any) =>
          selectedCrops.includes(formattedData.labels[index])
        )
      }
    ]
  };



  const screenWidth = Dimensions.get('window').width;

    const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16
    },
    propsForLabels: {
        fontSize: 12
    }
    };

  return (
    <View style={styles.componentMainContainer}>

        <View style={styles.componentHeaderWrapper}> 
            <Text style={styles.componentHeaderText}>
                {language === "en" ? "Fertilizer Usage By Crop" : "Paggamit ng Pataba Kada Pananim"}
            </Text>
     
        </View>


        <View style={styles.componentChartWrapper}>
            {formattedData &&
            formattedData.labels?.length > 0 &&
            formattedData.datasets?.[0]?.data?.length > 0 ? (

                <BarChart
                    key={selectedCrops.join(',')}
                    data={filteredBarData}
                    width={(screenWidth*0.94)}
                    height={280}
                    yAxisSuffix=" kg"
                    fromZero
                    chartConfig={chartConfig}
                    yAxisLabel=''
                    showValuesOnTopOfBars
                    
                />


            ) : (
                <View style={{height:280,width:'100%',borderWidth:0,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:"white"}}>
                    <Text style={{fontSize:15,fontWeight:600,color:'#909090'}}>No Data</Text>
                </View>
            )}


        </View>


        <View style={styles.componentFilterWrapper}>
            {cropNames && cropNames.map((item,index)=>(
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                    status={selectedCrops.includes(item) ? 'checked' : 'unchecked'}
                    onPress={() => toggleCropSelection(item)}
                />
                <Text style={{color:''}}>{item}</Text>
            </View>

            ))}
        </View>

    </View>
  )
}

export default FertilizerUsageByCrop

const styles = StyleSheet.create({
    componentMainContainer:{
        width:'95%',
        paddingVertical:0,
        borderColor:'#E2E8F0',
        marginBottom:10,
        borderWidth:1,
        backgroundColor:'white',
        borderRadius:5,
    },
    componentHeaderWrapper:{
        width:'100%',
        paddingVertical:20,
        borderColor:'red',
        borderWidth:0,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        paddingHorizontal:15,
        
    },

    componentHeaderText:{
        fontSize:17,
        fontWeight:600,
        
        color:'#37474F'
    },

    componentFilterWrapper:{
        width:'100%',
        paddingVertical:15,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderWidth:0,
        borderColor:'yellow',
        
    },
    componentChartWrapper:{
        width:'100%'
    },


    button: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        //borderWidth: 1,
        alignSelf: "flex-start", // Makes the button fit the child content
        borderRadius:5,
        marginTop:10,
        //marginBottom:10,
        marginLeft:10,
        backgroundColor:"#2e6f40"
    },
    buttonText:{
        fontSize:15,
        fontWeight:400,
        color:'#ffffff'
    },

})