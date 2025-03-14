import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'


import Ionicons from '@expo/vector-icons/Ionicons';
import PlotMinCard from '@/components/PlotComponents/PlotMinCard';


const account = () => {

  const [farmPlots, setFarmPlots] = React.useState([
    {
      plotName:"Plot 1",
    },
    {
      plotName:"Plot 2",
    },
    {
      plotName:"Plot 3",
    },
  ]);

  return (

    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.profileHeader}>
        

      </View>

      <ScrollView style={styles.scrollWrapperContainer} contentContainerStyle={{alignItems:'center'}}>

          <View style={styles.plotContainerWrapper}>

            <View style={styles.plotHeaderWrapper}>
              <View style={{width:30,height:30,borderWidth:1,borderRadius:'50%',backgroundColor:'green'}}></View>
              <Text>Your Farm Plots</Text>
              <Ionicons name="add-outline" size={30} color="black" style={{marginLeft:'auto'}} />
            </View>


            <View style={styles.plotContentWrapper}>
              {farmPlots.map((plot,index)=>(

                <PlotMinCard key={index}/>
              ))}

            </View>

          </View>

      </ScrollView>




    </SafeAreaView>

  )
}

export default account

const styles = StyleSheet.create({


  mainContainer:{
    borderWidth:1,
    flex:1,
    borderColor:'red',
    flexDirection:'column',
    display:"flex"
  },
  profileHeader:{
    width:'100%',
    height:100,
    borderWidth:1
  },
  scrollWrapperContainer:{
    borderWidth:1,
    flex:1,
    marginTop:20
  },


  //Plot subcontainer

  plotContainerWrapper:{
    width:'95%',
    borderColor:'green',
    borderWidth:1,
    display:'flex',
    flexDirection:'column'
  },

  plotHeaderWrapper:{
    width:'100%',
    flexDirection:'row',
    display:'flex',
    borderWidth:1,
    alignItems:'center',
    marginBottom:10
  },

  plotContentWrapper:{
    display:'flex',
    flexDirection:'column',

  }
})