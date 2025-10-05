import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import PlotMinCard from '@/components/PlotComponents/PlotMinCard';
import { arrayUnion, doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseconfig';
import { Avatar, Button, Dialog, PaperProvider, Portal } from 'react-native-paper';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { router, useFocusEffect } from 'expo-router';
import { useUserContext } from '../Context/UserContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';


//icons import 
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';

//components import

import AccountControlComponent from '@/components/AccountScreenComponents/AccountControlComponent';


import {fonts} from '../utils/typography'
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LanguageSwitchComponent from '@/components/AccountScreenComponents/LanguageSwitchComponent';
import { useLanguage } from '../Context/LanguageContex';

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
  discussionTitle:string,
  CreatedAt:any,
  authorSignature:string,
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
  const{language,setLanguage} = useLanguage()
  const navigateToPost = (RefId:string,SignatureId:string) =>{

    const queryString= `?PostRefId=${encodeURIComponent(RefId)}&SignatureId=${SignatureId}`
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

  const renderAddPlotConfirmationDialog = (plotLength: any) => (
    <Portal>
      <Dialog visible={confirmationForAddPlotVisible} onDismiss={() => {}}>
        <Dialog.Title>
          {language === "en" ? "Plot Creation" : "Paglikha ng Plot"}
        </Dialog.Title>

        <Dialog.Content>
          <Text>
            {language === "en"
              ? "Create another plot?"
              : "Gumawa ng panibagong plot?"}
          </Text>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={hideAddPlotConfirmation}>
            {language === "en" ? "Cancel" : "Kanselahin"}
          </Button>

          <Button
            onPress={() =>
              createNewPlot(
                plotLength,
                user?.PlotsRefId as string,
                user?.RecordsRefId as string
              )
            }
          >
            {language === "en" ? "Confirm" : "Kumpirmahin"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  
  
  
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

  //helper
  function formatFirestoreDate(timestamp: Timestamp): string {
      if (!timestamp) return "";
      console.log("raw timestamp : ",timestamp)
      const date = timestamp.toDate(); // Convert Firestore Timestamp to JS Date
      const options: Intl.DateTimeFormatOptions = {
          month: "long",
          day: "numeric",
          year: "numeric",
      };

      return date.toLocaleDateString("en-US", options);
  }

  return (


    <PaperProvider>

    {renderAddPlotConfirmationDialog(plotLength)}


    
    
      <SafeAreaView style={styles.mainContainer}  >
      


        <ScrollView style={styles.scrollWrapperContainer} contentContainerStyle={{alignItems:'center'}}>

          <View style={styles.profileHeader}>

            
              <View style={styles.profileIconWrapper}>
                <MaterialCommunityIcons name="account" size={30} color="#607D8B" />
              </View>

              <View style={styles.profileInfoWrapper}>
                  <Text style={{ color: "#607D8B", fontWeight: "700", fontSize: 18 }}>
                    {language === "en" ? "Welcome Back!" : "Welcome Back ulit!"}
                  </Text>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={{color:'#64748B'}}>{user?.Email}</Text>
              </View>

              <View style={[styles.profileSettingWrapper,{display:'none'}]}>

                <TouchableOpacity onPress={logoutAccount} style={{alignSelf:'flex-start'}}>
                  <AntDesign name="logout" size={24} color="black" />
                </TouchableOpacity>
                
              </View>

          </View> 



          <View style={[sections.summarySection,{display:'none'}]}>

            <View style={innerComponent.summaryCard}>

              <View style={innerComponent.summaryCard__iconBadge__plot}>
                <Entypo name="location-pin" size={30} color="white" />
              </View>
              
              <Text style={innerComponent.summaryCard__primary}>3</Text>
              <Text style={innerComponent.summaryCard__secondary}>Total Plots</Text>
            </View>

            <View style={innerComponent.summaryCard}>
              <View style={innerComponent.summaryCard__iconBadge__crop}>
                <MaterialCommunityIcons name="sprout" size={30} color="white" />
              </View>
              
              <Text style={innerComponent.summaryCard__primary}>3</Text>
              <Text style={innerComponent.summaryCard__secondary}>Active Crops</Text>
            </View>


            <View style={innerComponent.summaryCard}>

              <View style={innerComponent.summaryCard__iconBadge__humidity}>
                <Feather name="droplet"  size={30} color="white" />
              </View>
              
              <Text style={innerComponent.summaryCard__primary}>3</Text>
              <Text style={innerComponent.summaryCard__secondary}>Humidity</Text>
            </View>

            <View style={innerComponent.summaryCard}>

              <View style={innerComponent.summaryCard__iconBadge__temperature}>
                <Feather name="sun" size={30} color="white" />
              </View>
              
              <Text style={innerComponent.summaryCard__primary}>3</Text>
              <Text style={innerComponent.summaryCard__secondary}>Temperature</Text>
            </View>

          </View>


            <View style={styles.plotContainerWrapper}>

              <View style={styles.plotHeaderWrapper}>
                <View style={{width:30,height:30,borderWidth:0,borderRadius:50,backgroundColor:'#607D8B',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <Entypo name="location-pin" size={20} color="white" />
                </View>
                <Text style={styles.plotHeaderText}>
                  {language === "en" ? "Your Farm Plots" : "Mga Plot Mo"}
                </Text>

                <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:'auto'}} onPress={showAddPlotConfirmation}><Ionicons name="add-outline" size={30} color="black" /></TouchableOpacity>
                
              </View>



              <View style={styles.plotContentWrapper}>
                
                {
                  plots && plots.plot.length > 0 ? (

                  plots.plot.map((plot,index)=>(

                        <PlotMinCard plotThumbnail={plot.PlotThumbnail} key={index} plotAssocId={plot.PlotId} plotName={plot.PlotName} CurrentCrops={plot.CurrentCrops}/>
                      ))

                  ) : (
                    <Text style={{textAlign: 'center'}}>
                      {language === "en" 
                        ? "You currently have no plot to display, Press the add button to create a new plot" 
                        : "Wala ka pang plot na maipapakita, Pindutin ang add button para makagawa ng bagong plot"}
                    </Text>
                  )


                }
              

              </View>

              {loadingPlotData && (
                  <ProgressBar indeterminate color={MD3Colors.error50} />
                )}
              

              

            </View>

            
   
            <View style={styles.discussionContainerWrapper}>


                <View style={styles.discussionHeaderWrapper}>
                  <View style={{width:25,height:25,borderWidth:0,borderRadius:50,backgroundColor:'#607D8B',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                    <MaterialIcons name="mode-comment" size={15} color="white" />

                  </View>
                  <Text style={styles.discussionHeaderText}>
                    {language === "en" ? "My Discussions" : "Mga Diskusyon Ko"}
                  </Text>
                </View>

                {discussions && discussions.length>0 ? (


                  <View style={styles.discussionContentWrapper}>


                    {discussions && discussions.length > 0 && discussions.map((discussion,index)=>(


                      <TouchableOpacity key={discussion.discussionId} onPress={()=> navigateToPost(discussion.discussionId,discussion.authorSignature)} style={{
                        borderRadius:5,elevation:0,display:'flex',flexDirection:'column', 
                        alignItems:'flex-start',borderWidth:1,paddingVertical:10,paddingHorizontal:10,borderColor:'#E2E8F0',gap:5,marginBottom:5}}>

                        
                   
                        <Text style={{fontSize:17,fontWeight:500,color:'#37474F'}}>{discussion.discussionTitle}</Text>
                        <View style={{width:'100%',display:'flex',flexDirection:'row',borderWidth:0,gap:10}}>
                          <Text style={{color:'#94A3B8'}}>{formatFirestoreDate(discussion?.CreatedAt)}</Text>
                        </View>
                      </TouchableOpacity>


                    ))}

                  </View>


                ) : (

                  <View style={{borderWidth:1,
                                borderColor:'#E2E8F0',
                                padding:10, 
                                gap:10,
                                width:"100%",
                                height:200,
                                display:'flex',
                                flexDirection:"column"
                                ,alignItems:'center',
                                justifyContent:'center'}}> 
                    <Octicons name="comment-discussion" size={30} color="#37474F" />
                    <Text style={{color:'#333333', fontSize:17,fontWeight:400}}>You have not posted any discussion yet</Text>
      
                  </View>
                )}




            </View>

          <LanguageSwitchComponent/>
          <AccountControlComponent/>
          
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


    borderWidth:1,
    borderColor:'#E2E8F0',
    padding:10,

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
    backgroundColor:'white',
    display:'flex',
    flexDirection:'column',
  
  
    
  },

  discussionHeaderWrapper:{
    width:'100%',
    paddingHorizontal:10,
    paddingVertical:15,
    borderWidth:1,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#F8FAFC',
    
    borderColor:'#E2E8F0',
    borderBottomWidth:0,
  },


  mainContainer:{
    //borderWidth:1,
    flex:1,
    borderColor:'red',
    flexDirection:'column',
    display:"flex",
    paddingTop:10,
    backgroundColor:'#ffffff'
    
  },
  profileHeader:{
    width:'100%',
    height:100,
    borderWidth:0,
    backgroundColor:'#ffffff',
    borderColor:'#E2E8F0',
    borderBottomWidth:1,
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
    borderWidth:0,
    borderRadius:5,
    width:70,
    height:70,
 
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },

  scrollWrapperContainer:{
    borderWidth:0,
    borderColor:'#37474F',
    flex:1,
    gap:10,
    display:'flex',
    flexDirection:'column',
    
    backgroundColor:'#F4F5F7',
  },


  //Plot subcontainer

  plotContainerWrapper:{
    width:'95%',
    marginVertical:25,
    backgroundColor:'white',
    display:'flex',
    flexDirection:'column',
    
  },

  plotHeaderWrapper:{
    width:'100%',
    flexDirection:'row',
    display:'flex',
    borderWidth:1,
    alignItems:'center',
    padding:10,
   
    backgroundColor:'#F8FAFC',
    
    borderColor:'#E2E8F0',
    borderBottomWidth:0,
  },

  plotContentWrapper:{
    display:'flex',
    flexDirection:'column',
    borderWidth:1,
    borderColor:'#E2E8F0',
    padding:10,
    minHeight:30,
  },

  plotHeaderText:{

    color:'#37474F',
    fontSize:18,
    fontWeight:600,
    letterSpacing:.5,
    marginLeft:10
  }
})

const sections = StyleSheet.create({
  summarySection:{
    width:'95%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    flexWrap:'wrap',

    borderWidth:0,
    paddingTop:5,
    paddingBottom:5,
    gap:5
  }
})


const innerComponent = StyleSheet.create({


  // summary card

  summaryCard:{
    width:'49%',
    borderRadius:5,
    padding:20,
    borderWidth:1,
    borderColor:'#E2E8F0',
   
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    gap:'2',


  },

  summaryCard__iconBadge__plot:{
 
    padding:5,
    borderRadius:'50%',
    backgroundColor:'#607D8B',
  },

    summaryCard__iconBadge__crop:{
 
    padding:5,
    borderRadius:'50%',
    backgroundColor:'#0FB37E',

  },

    summaryCard__iconBadge__humidity:{
 
    padding:5,
    borderRadius:'50%',
    backgroundColor:'#4081F5',
  },

    summaryCard__iconBadge__temperature:{
 
    padding:5,
    borderRadius:'50%',
    backgroundColor:'#F9731C',
  },

  summaryCard__primary:{
    fontSize:22,
    fontWeight:600,
    color: "#607D8B",
  },
  
  summaryCard__secondary:{
    fontSize:13,
    fontWeight:400,
    color: "#607D8B",
  }



})