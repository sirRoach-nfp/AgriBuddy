import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'


import Ionicons from '@expo/vector-icons/Ionicons';
import PlotMinCard from '@/components/PlotComponents/PlotMinCard';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseconfig';
import { Button, Dialog, PaperProvider, Portal } from 'react-native-paper';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { useUserContext } from '../Context/UserContext';


interface CurrentCrops{

  CropAssocId:string | null
  CropId:string | null
  CropName:string | null,
}
interface PlotData{
  PlotId : string,
  PlotName: string
  CurrentCrops:CurrentCrops
}

interface Plots{
  plot:PlotData[],
}





interface userData{
  CropRotationPlanRefId:string,
  Email:string,
  PlotsRefId:string,
  RecordsRefId:string,
  CurrentCropsRefId:string,
  Username:string
}



//dialogs







const account = () => {



  const {user,logout} = useUserContext();

  //userdata


  const [userMainData,setUserMainData] = useState<userData | null>(null)
  const logoutAccount = async () => {
    try {
      console.log("Logging out...");
  
      // Sign out fr m Firebase
      await signOut(auth);
      console.log("User signed out from Firebase.");
  
      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem("userData");
      console.log("User data removed from AsyncStorage.");
      logout();
  
      // Redirect to login page
      router.replace('/(screens)/LoginPage'); // Update path as per your routing setup
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  
  //loaders


  const [loadingPlotData,setLoadingPlotData]= useState(false)

  const [confirmationForAddPlotVisible,setConfirmationForAddPlotVisible] = useState(false);

  const showAddPlotConfirmation = () => setConfirmationForAddPlotVisible(true);
  const hideAddPlotConfirmation = () => setConfirmationForAddPlotVisible(false);

  const [userData, setUserData] = useState(null);

  const renderAddPlotConfirmationDialog = (plotLength:any) => (
    <Portal>
    <Dialog visible={confirmationForAddPlotVisible} onDismiss={()=>{}}>
      <Dialog.Title>Plot Creation</Dialog.Title>
      <Dialog.Content>
        <Text>Create another plot?</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={hideAddPlotConfirmation}>Cancel</Button>
        <Button onPress={() => createNewPlot(plotLength,user?.PlotsRefId as string,user?.RecordsRefId as string)}>Confirm</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
  )
  
  
  
  const createNewPlot = async(plotLength:number,userPlotRefId:string,userRecordRefId:string)=> {
    
  
    if(plotLength < 0){return}
  
  
  
    console.log("Plot number : ", plotLength)
  
    try{
      const userRef = doc(db,'Plots',userPlotRefId);
      

      const plotId = Date.now().toString();
      
      await updateDoc(userRef,{
        Plots:arrayUnion({
          CurrentCrops:{
            CropAssocId:null,
            CropId:null,
            CropName:null,
          },
  
          PlotId:plotId,
          PlotName:"New Plot #"+(plotLength+1),
        })
      })


      console.log("Plot created !! ")
      console.log("Creating relation with record ...... ")

      const userRefRecords = doc(db,'Records',user?.RecordsRefId as string);
      console.log("userRefRecords ",userRefRecords)
      await updateDoc(userRefRecords,{
        PestLogs:arrayUnion({
          PlotAssocId:plotId,
          PlotPestLog:[],
        }),
        DiseaseLogs:arrayUnion({
          PlotAssocId:plotId,
          PlotDiseaseLog:[],
        }),
        FertilizerLogs:arrayUnion({
          PlotAssocId:plotId,
          PlotFertilizerLog:[],
        })
      })


      console.log("Plot relation with record established !! ")

      fetchPlots(user?.PlotsRefId as string)
      hideAddPlotConfirmation()
    }catch(err){
      console.error(err)
    }
  }

  



  const [plots,setPlots] = React.useState<Plots>({plot:[]});
  const [plotLength,setPlotLength] = useState(0)
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


  useEffect(()=> {




    fetchPlots(user?.PlotsRefId as string);
  }, [plotLength])

  const fetchPlots = async(userPlotRefId:string)=> {

    setLoadingPlotData(true)
    try{
      const docRef = doc(db,'Plots',userPlotRefId);

      const docSnap = await getDoc(docRef);
      console.log("Doc snap fetching plots : ",docSnap)
      if(docSnap.exists()){
        const rawData = docSnap.data().Plots as any[];

        const filteredPlots:PlotData[]=rawData.map(crop=>({
          PlotName: crop.PlotName,
          PlotId: crop.PlotId,
          CurrentCrops:crop.CurrentCrops
        }))



        setPlots({plot:filteredPlots})
        setPlotLength(filteredPlots.length)
      }


      setLoadingPlotData(false)
      
    }catch(err){

    }
  }

  return (


    <PaperProvider>

    {renderAddPlotConfirmationDialog(plotLength)}


    

      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.profileHeader}>
          

        </View>

        <ScrollView style={styles.scrollWrapperContainer} contentContainerStyle={{alignItems:'center'}}>

            <View style={styles.plotContainerWrapper}>

              <View style={styles.plotHeaderWrapper}>
                <View style={{width:30,height:30,borderWidth:1,borderRadius:'50%',backgroundColor:'green'}}></View>
                <Text style={styles.plotHeaderText}>Your Farm Plots</Text> 

                <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:'auto'}} onPress={showAddPlotConfirmation}><Ionicons name="add-outline" size={30} color="black" /></TouchableOpacity>
                
              </View>



              <View style={styles.plotContentWrapper}>
                

                {plots.plot.map((plot,index)=>(

                  <PlotMinCard key={index} plotAssocId={plot.PlotId} plotName={plot.PlotName} CurrentCrops={plot.CurrentCrops}/>
                ))}

              </View>

              {loadingPlotData && (
                  <ProgressBar indeterminate color={MD3Colors.error50} />
                )}
              

              

            </View>


            <TouchableOpacity onPress={()=>{console.log(plots)}}>Test Plot Data</TouchableOpacity>
            <TouchableOpacity onPress={logoutAccount}>Logout</TouchableOpacity>
            <Text>{user?.Email}</Text>
            <Text>{user?.Username}</Text>
            <Text>{user?.PlotsRefId}</Text>
            <Text>{user?.RecordsRefId}</Text>

        </ScrollView>




      </SafeAreaView>

      



    </PaperProvider>

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
    //borderWidth:1,
    flex:1,
    marginTop:20
  },


  //Plot subcontainer

  plotContainerWrapper:{
    width:'95%',
    borderColor:'green',
    //borderWidth:1,
    display:'flex',
    flexDirection:'column'
  },

  plotHeaderWrapper:{
    width:'100%',
    flexDirection:'row',
    display:'flex',
    //borderWidth:1,
    alignItems:'center',
    marginBottom:10,
    paddingBottom:10,
    paddingTop:10,
    borderColor:'#666666',
    borderBottomWidth:1
  },

  plotContentWrapper:{
    display:'flex',
    flexDirection:'column',

  },

  plotHeaderText:{

    fontSize:17,
    fontWeight:500,
    color:'#253D2C',
    marginLeft:10
  }
})