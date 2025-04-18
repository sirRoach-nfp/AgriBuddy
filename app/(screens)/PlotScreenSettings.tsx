import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Checkbox, Dialog, MD3Colors, PaperProvider, Portal, ProgressBar } from 'react-native-paper'
import { router } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'
import { useUserContext } from '../Context/UserContext'
import { useSearchParams } from 'expo-router/build/hooks'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Image } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';

interface PestLog {
    Date:string,
    CropName:string,
    Pestname:string,
    Temp:number
}

interface PlotObject {
    PlotId: string;
    PlotName: string;
    PlotThumbnail: string;
    CurrentCrops: any;
  }
const PlotScreenSettings = () => {


  const {user} = useUserContext()
  const searchParams = useSearchParams();
  const plotRefIdParam = searchParams.get('plotAssocId')
  const plotNameParam = searchParams.get('currentPlotName')
  const isCurrentCrop = searchParams.get('currentCrop')
  const PlotCoverParam = searchParams.get('PlotCover')
  const [imageUri,setImageUri] = useState<File | String>()
  const [plotRefId,setPlotRefId] = useState("")
 


  const[associatedCrops,setAssociatedCrops]= useState<string[]>([])
  const [pestLogs,setPestLogs] = useState<PestLog[]>([]);

  useEffect(()=>{


    setPlotName(plotNameParam as string)
    setPlotNameChange(plotNameParam as string)


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

                    //const pestNames = [...new Set(plotPestLog.map((log: any) => log.Pestname))];
                    const cropNames = [...new Set(plotPestLog.map((log: any) => log.CropName))]
                    console.log("Crop List Data: ", cropNames);

                    //setPestListData(pestNames as string[])
                    setAssociatedCrops(cropNames as string[])
                    setPestLogs(existingLogs[logIndex].PlotPestLog)


                }else{
                    console.log("Document not found records")
                }


                






            }catch(err){
                console.error(err)
            }





    }

    fetchPestLogRecord(plotRefIdParam as string)
    setImageUri(PlotCoverParam as string)

  },[plotRefIdParam])

  const deletePlot = async (selectedPlotId: string) => {
    setShowDeletePlotConfirmation(false)
    setLoadingForDeletePlot(true)
    SetShowDeletePlotProcess(true)

    try {

      
      


      const docRef = doc(db, "Plots", user?.PlotsRefId as string);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        console.log("No document found.");
        return;
      }
  
      // Get existing Plots array
      const data = docSnap.data();
      const existingPlots = data?.Plots || [];
  
      // Filter out the plot with the selectedPlotId
      const updatedPlots = existingPlots.filter(
        (plot: any) => plot.PlotId !== selectedPlotId
      );
  
      // Update Firestore
      await updateDoc(docRef, { Plots: updatedPlots });
  
      console.log("Plot deleted successfully.");


          // Reference to the Records document
    const recordsDocRef = doc(db, "Records", user?.RecordsRefId as string);
    const recordsDocSnap = await getDoc(recordsDocRef);

    if (recordsDocSnap.exists()) {
      // Get existing PestLogs array and filter out the selected log
      const recordsData = recordsDocSnap.data();
      const updatedPestLogs = (recordsData?.PestLogs || []).filter(
        (log: any) => log.PlotAssocId !== selectedPlotId
      );

      // Update Firestore with the filtered PestLogs array
      await updateDoc(recordsDocRef, { PestLogs: updatedPestLogs });

      console.log("Pest log deleted successfully.");
    }
  
      // Update local state (if needed)
      //setPlots(updatedPlots);

      setLoadingForDeletePlot(false)


  
    } catch (error) {
      console.error("Error deleting plot:", error);
    }
  };

  const removeSelectedCropData = async ()=>{
    console.log("Clicking")
    setShowDeleteRecordDataConfirmation(false)
    setloadingForDeleteRecordData(true)
    setShowRecordDataProcess(true)
    try {

        const docRef = doc(db, "Records", user?.RecordsRefId as string );
        const docSnap = await getDoc(docRef);
    
        if (!docSnap.exists()) {
          console.log("Document does not exist.");
          return;
        }
    
        const data = docSnap.data();
        let existingLogs = data?.PestLogs || [];
    
        // Find the index of the entry that matches the current PlotAssocId
        const logIndex = existingLogs.findIndex(
          (log: any) => log.PlotAssocId === plotRefIdParam
        );
    
        if (logIndex === -1) {
          console.log("No matching PlotAssocId found.");
          return;
        }
    
        // Filter out selected crops
        existingLogs[logIndex].PlotPestLog = existingLogs[logIndex].PlotPestLog.filter(
          (log: any) => !selectedCropForRemoval.includes(log.CropName)
        );
    
        // Update Firestore with the new PestLogs array
        await updateDoc(docRef, { PestLogs: existingLogs });
        const updatedCrops = associatedCrops.filter(crop => !selectedCropForRemoval.includes(crop));
        setAssociatedCrops(updatedCrops)
        console.log("Selected crops deleted successfully.");
        setSelectedCropForRemoval([]); // Reset selection after deletion
        setPestLogs(existingLogs[logIndex].PlotPestLog); // Update state to reflect changes
        
      


        /*

        let existingLogs = pestLogs
        console.log("Selected crop to be removed : ", selectedCropForRemoval)
        console.log("existing Logs ",existingLogs)
        const updatedLogs = existingLogs.filter(
            (log: any) => !selectedCropForRemoval.includes(log.CropName)
          );
        



        
        await updateDoc(doc(db, "Records", user?.RecordsRefId as string), { PestLogs: updatedLogs });

        console.log("Selected crops deleted successfully.");

        console.log(updatedLogs)
        setPestLogs(updatedLogs)
        setSelectedCropForRemoval([])
        */
       setloadingForDeleteRecordData(false)
      } catch (error) {
        console.error("Error deleting crop data:", error);
      }
  }
  
  const [plotName,setPlotName] = useState("")
  const [plotNameChange,setPlotNameChange] = useState("")



  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to select images!");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };


  const handleSaveEdit = async ()=>{
    console.log("Fetching plot document using id : ",user?.PlotsRefId)

    const docRef = doc(db,"Plots",user?.PlotsRefId as string)
    const docSnap = await getDoc(docRef)


    
    //upload to cloudinary
    let finalImageUrl = ""

    if (typeof imageUri === "string" && imageUri.startsWith("http")) {
        // It's already a Cloudinary or remote image URL
        finalImageUrl = imageUri;
      } else if (typeof imageUri === "string") {
        // Local file URI from picker - upload to Cloudinary

        console.log("Selected plot image : ",imageUri)
        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg",
          name: "upload.jpg",
        } as any);
        formData.append("upload_preset", "dishlyunsignedpreset");
      
        console.log("Uploading image to Cloudinary...");
        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dvl7mqi2r/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
      
        const data = await uploadResponse.json();
        if (data.secure_url) {
          finalImageUrl = data.secure_url;
          console.log("Image uploaded successfully:", finalImageUrl);
        } else {
          console.error("Cloudinary upload failed:", data);
          throw new Error("Image upload failed");
        }
      }




    if(docSnap.exists()){

        console.log("Document exists : ",docSnap.data())
        console.log("Plot ref id Is : ", plotRefIdParam)
        const plots = docSnap.data().Plots as PlotObject[]

        const updatedPlots = plots.map((plot)=>{
            if(plot.PlotId === plotRefIdParam){
                return{
                    ...plot,
                    PlotThumbnail:finalImageUrl
                }
            }

            return plot;
        })
        console.log("Updated PLot data (before push) : ", updatedPlots )


        await updateDoc(docRef,{
            Plots:updatedPlots,
        });
        console.log("Plot updated successfully!")
    }


  }

  //dialog handlers

  const[showDeleteRecordDataConfirmation,setShowDeleteRecordDataConfirmation] = useState(false)
  const [showDeleteRecordDataProcess,setShowRecordDataProcess] = useState(false)
  const[loadingForDeleteRecordData,setloadingForDeleteRecordData] = useState(false)
  const[showDeletePlotConfirmation,setShowDeletePlotConfirmation] = useState(false)
  const[showDeletePlotProcess,SetShowDeletePlotProcess] = useState(false)
  const[loadingForDeletePlot,setLoadingForDeletePlot] = useState(false)


  //checbox controller 
  const [selectedCropForRemoval,setSelectedCropForRemoval] = useState<string[]>([]);
  const toggleCropSelectionRemoval = (crop:string)=>{

    setSelectedCropForRemoval(prev=>
        prev.includes(crop)
            ? prev.filter(c => c !== crop) // Remove if already selected
            : [...prev, crop] // Add if not selected
    )
}




    const renderDeleteRecordDataConfirmation = (selectedCrops:string[]) => (

    <Portal>

        <Dialog visible={showDeleteRecordDataConfirmation} onDismiss={()=>{setShowDeleteRecordDataConfirmation(false)}}>


            <Dialog.Title>
                Confirm data deletion from plot:
            </Dialog.Title>


            <Dialog.Content>
                {
                    selectedCrops.map((crop,index)=>(
                        <Text>
                            {crop}
                        </Text>

                    ))
                }

            </Dialog.Content>


            <Dialog.Actions>
                <TouchableOpacity onPress={()=>{removeSelectedCropData()}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                    <Text style={{color:'white'}}>
                        Continue
                    </Text>

                </TouchableOpacity>
            </Dialog.Actions>

        </Dialog>
    </Portal>
    )

    
    const renderDeletePlotDataConfirmation = () => (

        <Portal>
    
            <Dialog visible={showDeletePlotConfirmation} onDismiss={()=>{setShowDeletePlotConfirmation(false)}}>
    
    
                <Dialog.Title>
                    Confirm Plot deletion
                </Dialog.Title>
    
    
                <Dialog.Content>
                    <Text>
                         Do you really want to delete this plot? it will also remove all the logs saved to this plot.
                    </Text>
                   
                </Dialog.Content>

           
    
    
                <Dialog.Actions>
                    <TouchableOpacity onPress={()=>{deletePlot(plotRefIdParam as string)}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
    
                        <Text style={{color:'white'}}>
                            Continue
                        </Text>
    
                    </TouchableOpacity>
                </Dialog.Actions>
    
            </Dialog>
        </Portal>
    )

    const renderProcessDeletePlot = () => (

        <Portal>
            <Dialog visible={showDeletePlotProcess} onDismiss={()=>{}}>


                <Dialog.Title>
                    Deleting Plot
                </Dialog.Title>


                {loadingForDeletePlot? (
                    <Dialog.Content>
                        <Text>Your Plot Is Being Deleted Please wait...</Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                    <Text>Your Plot was deleted successfully!</Text>
                    </Dialog.Content>
                )}



                {loadingForDeletePlot ? (
                    <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                ) : (
                    <Dialog.Actions>

                        <TouchableOpacity onPress={()=>{router.replace('/(main)/account')}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                            <Text style={{color:'white'}}>
                                Continue
                            </Text>

                        </TouchableOpacity>

                    </Dialog.Actions>
                )}

            </Dialog>


        </Portal>
    )



    const renderProcessDeleteRecordData = () => (

        <Portal>
            <Dialog visible={showDeleteRecordDataProcess} onDismiss={()=>{}}>


                <Dialog.Title>
                    Deleting Selected Crop Logs
                </Dialog.Title>


                {loadingForDeleteRecordData? (
                    <Dialog.Content>
                        <Text>Your Logs Are Being Deleted Please wait...</Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                    <Text>Crop logs were deleted successfully!</Text>
                    </Dialog.Content>
                )}



                {loadingForDeleteRecordData ? (
                    <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                ) : (
                    <Dialog.Actions>

                        <TouchableOpacity onPress={()=>setShowRecordDataProcess(false)} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                            <Text style={{color:'white'}}>
                                Continue
                            </Text>

                        </TouchableOpacity>

                    </Dialog.Actions>
                )}

            </Dialog>


        </Portal>
    )




  return (

    <PaperProvider>

        <SafeAreaView style={styles.mainContainer}>


                {renderDeleteRecordDataConfirmation(selectedCropForRemoval)}
                {renderDeletePlotDataConfirmation()}
                {renderProcessDeletePlot()}
                {renderProcessDeleteRecordData()}


            
                <View style={styles.headerContainer}>

                    <TouchableOpacity onPress={()=> router.back()} style={{marginLeft:10}}>
                        <Feather name="x" size={24} color="black"  />
                    </TouchableOpacity>

                <TouchableOpacity onPress={()=>setShowDeletePlotConfirmation(true)} style={{alignSelf:'flex-start',marginRight:10, marginLeft:'auto'}}>
                    <MaterialCommunityIcons name="delete-empty" size={30} color="red" />
                </TouchableOpacity>

                </View>
            <ScrollView style={styles.scrollContentContainer} contentContainerStyle={{alignItems:'center'}}>

                <View style={styles.contentContainer}>

                    <View style={styles.plotThumbnailContainer}>
                    {imageUri && (
                        <Image
                        source={{ uri: imageUri.toString() }}
                        style={StyleSheet.absoluteFillObject} // covers full container
                        resizeMode="cover"
                        />
                    )}

                    <TouchableOpacity onPress={pickImage} style={styles.pickerIcon}>
                        <MaterialCommunityIcons name="image-plus" size={30} color="#fff" />
                    </TouchableOpacity>
                    </View>

                    <TextInput value={plotNameChange} onChange={(e)=>setPlotNameChange(e.nativeEvent.text)} placeholder="Title" style={styles.titleInput}></TextInput>


                    <TouchableOpacity onPress={()=> handleSaveEdit()}><Text>Update Plot Information</Text></TouchableOpacity>
                </View>



                <View style={stylesDataRemove.wrapper}>
                    <View style={stylesDataRemove.wrapperHeader}>
                        <Text style={{fontWeight:500,fontSize:14}}>Delete Crop Pest Logs</Text>
                    </View>

                    <View style={stylesDataRemove.wrapperControl}>
                    {associatedCrops.length === 0 ? (
                        <Text style={{marginLeft:'auto',marginRight:'auto',fontWeight:500,fontSize:13}}>No associated crops available.</Text>
                    ) : (
                        associatedCrops.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                            status={selectedCropForRemoval.includes(item) ? 'checked' : 'unchecked'}
                            onPress={() => toggleCropSelectionRemoval(item)}
                            />
                            <Text>{item}</Text>
                        </View>
                        ))
                    )}
                    </View>

                    <View style={stylesDataRemove.wrapperButton}>
                        <TouchableOpacity onPress={()=>{if(selectedCropForRemoval.length === 0){return};  setShowDeleteRecordDataConfirmation(true)}} style={{alignSelf:'flex-start',borderWidth:0,paddingVertical:5,paddingHorizontal:10,borderRadius:5,backgroundColor:'red',elevation:2}}>
                            <Text style={{color:'white'}}>Delete Data</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text>{plotRefIdParam}</Text>
                <Text>is Current Cropt : {isCurrentCrop}</Text>
                <Text>Check Selected crops data : {selectedCropForRemoval}</Text>
                <Text>Current Plot Thumbnail : {PlotCoverParam}</Text>
                <TouchableOpacity onPress={()=>console.log(pestLogs)}><Text>check Pest Logs</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>{setShowDeleteRecordDataConfirmation(true)}}><Text>check confirmation</Text></TouchableOpacity>
               <Text>Passed plot cover : {imageUri as string}</Text>
            </ScrollView>
            
        </SafeAreaView>


    </PaperProvider>
  )
}

export default PlotScreenSettings


const stylesDataRemove = StyleSheet.create({
    wrapper:{
        width:'100%',
        //borderWidth:1,
        paddingVertical:10,
        paddingHorizontal:5,
        display:"flex",
        flexDirection:'column',
        backgroundColor:'#F2F3F5',
        borderRadius:5,
        elevation:1
    },
    wrapperHeader:{
        paddingVertical:10,
        width:'100%',
        //borderWidth:1,
        marginBottom:5
    },
    wrapperButton:{
        width:'100%',
        paddingVertical:5,
        //marginLeft:'auto'
    },
    wrapperControl:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        //borderWidth:1,
        paddingVertical:10
    },
})

const styles = StyleSheet.create({

    plotThumbnailContainer:{
        width: "100%",
        height: 200,
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ccc", // fallback color
        position: "relative",
    },
    pickerIcon: {
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 10,
        borderRadius: 50,
      },


    headerContainer:{
        width:'100%',
        maxHeight:50,
        //borderWidth:1,
        
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        
    },
    scrollContentContainer:{
        display:'flex',
        width:'95%',
        //backgroundColor:"red"
    },
    mainContainer:{
        borderWidth:1,
        flex:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center'
    },
    contentContainer:{
        marginTop:10,
        width:"100%",
        borderWidth:1,
        display:'flex',
        flexDirection:'column',

    },
    titleInput:{
        fontSize:25,
        fontWeight:500,
        borderWidth:0,
        marginBottom:20,
        borderBottomWidth:1
      
    },
})