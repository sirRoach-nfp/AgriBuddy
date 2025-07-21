import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import PlotMinCard from '@/components/PlotComponents/PlotMinCard';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseconfig';
import { Avatar, Button, Dialog, PaperProvider, Portal } from 'react-native-paper';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { router, useFocusEffect } from 'expo-router';
import { useUserContext } from '../Context/UserContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import Octicons from '@expo/vector-icons/Octicons';
interface CurrentCrops{

  CropAssocId:string | null
  CropId:string | null
  CropName:string | null,
}
interface PlotData{
  PlotId : string,
  PlotName: string,
  PlotThumbnail:string,
  CurrentCrops:CurrentCrops
}

interface Plots{
  plot:PlotData[],
}

interface discussion{
  discussionId:string,
  discussionTitle:string
}

const getAuthorInitials = (name:string) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  return words.length > 1
    ? words[0][0] + words[1][0] // First letter of first and last name
    : words[0][0]; // If only one word, return the first letter
};



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

  const navigateToPost = (RefId:string) =>{

    const queryString= `?PostRefId=${encodeURIComponent(RefId)}`
    //router.push(`/(sc)${queryString}` as any)

    router.push(`/(screens)/DisussionScreen${queryString}` as any)
}

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


  useFocusEffect(
  
  
      useCallback(()=>{
        fetchPlots(user?.PlotsRefId as string)
        fetchDiscussionsRef(user?.DiscussionRecordRefId as string)
  
      },[])
    )


  
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
            CropCover:null,
          },
  
          PlotId:plotId,
          PlotThumbnail:'',
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
  const [discussions,setDiscussions] = React.useState<discussion[]>([])
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
          PlotThumbnail:crop.PlotThumbnail,
          CurrentCrops:crop.CurrentCrops
        }))



        setPlots({plot:filteredPlots})
        setPlotLength(filteredPlots.length)
      }


      setLoadingPlotData(false)
      
    }catch(err){

    }
  }


  const fetchDiscussionsRef = async(userDiscussionRefId:string) =>{

    try{

      const docRef = doc(db,'DiscussionRecords',userDiscussionRefId as string)
      const docSnap = await getDoc(docRef)
      console.log("Fetching discussion Ref : ",userDiscussionRefId)


      if(docSnap.exists()){
        const rawData = docSnap.data().Discussions as discussion[]
        setDiscussions(rawData)
      }

    }catch(err){

    }
  }

  return (


    <PaperProvider>

    {renderAddPlotConfirmationDialog(plotLength)}


    
    
      <SafeAreaView style={styles.mainContainer}  >
      
        <View style={styles.profileHeader}  

            >

          
            <View style={styles.profileIconWrapper}>
              <Avatar.Text size={65} label={getAuthorInitials(user?.Username as string)}  />
            </View>

            <View style={styles.profileInfoWrapper}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ overflow: 'hidden', fontSize:18,fontWeight:700,color:'#253D2C' }}>{user?.Email}</Text>
            </View>

            <View style={styles.profileSettingWrapper}>

              <TouchableOpacity onPress={logoutAccount} style={{alignSelf:'flex-start'}}>
                <AntDesign name="logout" size={24} color="black" />
              </TouchableOpacity>
              
            </View>

        </View> 

        <ScrollView style={styles.scrollWrapperContainer} contentContainerStyle={{alignItems:'center'}}>

            <View style={styles.plotContainerWrapper}>

              <View style={styles.plotHeaderWrapper}>
                <View style={{width:30,height:30,borderWidth:0,borderRadius:50,backgroundColor:'#37474F'}}></View>
                <Text style={styles.plotHeaderText}>Your Farm Plots</Text> 

                <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:'auto'}} onPress={showAddPlotConfirmation}><Ionicons name="add-outline" size={30} color="black" /></TouchableOpacity>
                
              </View>



              <View style={styles.plotContentWrapper}>
                
                {
                  plots && plots.plot.length > 0 ? (

                  plots.plot.map((plot,index)=>(

                        <PlotMinCard plotThumbnail={plot.PlotThumbnail} key={index} plotAssocId={plot.PlotId} plotName={plot.PlotName} CurrentCrops={plot.CurrentCrops}/>
                      ))

                  ) : (
                    <Text style={{textAlign:'center'}}>You currently have no plot to display, Press the add button to create a new plot</Text>
                  )


                }
              

              </View>

              {loadingPlotData && (
                  <ProgressBar indeterminate color={MD3Colors.error50} />
                )}
              

              

            </View>


   
            <View style={styles.discussionContainerWrapper}>


                <View style={styles.discussionHeaderWrapper}>
                  <View style={{width:25,height:25,borderWidth:0,borderRadius:50,backgroundColor:'#37474F'}}></View>
                  <Text style={styles.discussionHeaderText}>My Discussions</Text>
                </View>

                {discussions && discussions.length>0 ? (


                  <View style={styles.discussionContentWrapper}>


                    {discussions && discussions.length > 0 && discussions.map((discussion,index)=>(


                      <TouchableOpacity onPress={()=> navigateToPost(discussion.discussionId)} style={{borderRadius:5,elevation:0,display:'flex',flexDirection:'row', alignItems:'center',borderWidth:0,paddingVertical:10,paddingHorizontal:10}}>

                        
                        <Octicons name="comment-discussion" size={20} color="#37474F" />
                        <Text style={{marginLeft:5,fontSize:17,fontWeight:500,color:'#37474F'}}>{discussion.discussionTitle}</Text>
                      </TouchableOpacity>


                    ))}

                  </View>


                ) : (

                  <View style={{ gap:10,width:"100%",height:200,borderWidth:0,display:'flex',flexDirection:"column",alignItems:'center',justifyContent:'center'}}> 
                    <Octicons name="comment-discussion" size={30} color="#37474F" />
                    <Text style={{color:'#333333', fontSize:17,fontWeight:400}}>You're currently not tracking any crop</Text>
      
                  </View>
                )}




            </View>

        </ScrollView>




        </SafeAreaView>

      



    </PaperProvider>

  )
}

export default account

const styles = StyleSheet.create({


  discussionContentWrapper:{
    display:'flex',
    flexDirection:'column',
    width:'100%',
    gap:3
    //borderWidth:1,
   
  },

  discussionHeaderText:{
    color:'#37474F',
    fontSize:18,
    fontWeight:600,
    letterSpacing:.5,
    marginLeft:10
  },

  discussionContainerWrapper:{
    width:'95%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'column',
    paddingVertical:25,
    gap:10
    
  },

  discussionHeaderWrapper:{
    width:'100%',
    paddingVertical:10,
    //borderWidth:1,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    borderColor:'#666666',
    borderBottomWidth:1
  },


  mainContainer:{
    //borderWidth:1,
    flex:1,
    borderColor:'red',
    flexDirection:'column',
    display:"flex",
    paddingTop:10,
    backgroundColor:'#F2F3F5'
    
  },
  profileHeader:{
    width:'100%',
    height:100,
    //borderWidth:1,
    //backgroundColor:'#4C9142',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
   
  },
  profileInfoWrapper:{
    //borderWidth:1,
    flex:1,
    width:100,
    display:'flex',
    flexDirection:'column',
    height:70,
    marginLeft:20,
    marginRight:20,
    //alignItems:'center',
    justifyContent:'center',

  },profileSettingWrapper:{
    //borderWidth:1,
    width:40,
    height:40,
    marginRight:10,
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
    
  },

  profileIconWrapper:{
    //borderWidth:1,
    borderRadius:5,
    width:70,
    height:70,
    marginLeft:10,
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },

  scrollWrapperContainer:{
    borderWidth:1,
    borderColor:'#37474F',
    flex:1,
    marginTop:20,
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    backgroundColor:'#ffffff'
  },


  //Plot subcontainer

  plotContainerWrapper:{
    width:'95%',
    borderColor:'green',
    //borderWidth:1,
    display:'flex',
    flexDirection:'column',
    paddingVertical:25
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

    color:'#37474F',
    fontSize:18,
    fontWeight:600,
    letterSpacing:.5,
    marginLeft:10
  }
})