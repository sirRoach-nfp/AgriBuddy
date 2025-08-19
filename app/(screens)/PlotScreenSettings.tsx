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


interface FertilizerLog{
    DateApplied:string,
    cropName:'Tomato',
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
  const [imageUri,setImageUri] = useState<File | String>('')
  const [plotRefId,setPlotRefId] = useState("")
 


  const[associatedCrops,setAssociatedCrops]= useState<string[]>([])
  const [pestLogs,setPestLogs] = useState<PestLog[]>([]);


  const [fertilizerLogs,setFertilizerLogs] = useState<FertilizerLog[]>([]);
  const [fertilizerCropNames,setFertilizerCropNames] = useState<string[]>([])
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


    const fetchFertilizerLog = async(plotId:string)=>{


        try{
            console.log("Fetching Fertilizer Log Record 2 ....")

            const docRef = doc(db,'Records',user?.RecordsRefId as string)
            const docSnap = await getDoc(docRef)


            if(docSnap.exists()){

                const data = docSnap.data()
                console.log("Returned Data : ", data)
                const existingLogs = data?.FertilizerLogs || []
                console.log("Existing ferts data logs : ", existingLogs)


                const logIndex = existingLogs.findIndex(
                    (log:any) => log.PlotAssocId === plotRefIdParam
                )

                console.log("log index : ", logIndex)

                const plotFertilizerLog = existingLogs[logIndex].FertilizerApplications;

                const cropNames = [...new Set(plotFertilizerLog.map((log:any)=> log.cropName))]
                console.log("Fertilizer log cropnames : ",cropNames )

                setFertilizerCropNames(cropNames as string[])
                setFertilizerLogs(plotFertilizerLog)
            }
        }catch(err){console.error(err)}
    }
    fetchPestLogRecord(plotRefIdParam as string)
    fetchFertilizerLog(plotRefIdParam as string)
    setImageUri(PlotCoverParam as string)

  },[plotRefIdParam])

  const deletePlot = async (selectedPlotId: string) => {

    console.log("Before check - isCurrentCrop:", isCurrentCrop);
    setShowDeletePlotConfirmation(false)
    console.log("Is current Crop : ",isCurrentCrop)
    if (isCurrentCrop !== 'null') {
        setDeletePlotError(true);
        return;
      }
    
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
        
       setloadingForDeleteRecordData(false)
      } catch (error) {
        console.error("Error deleting crop data:", error);
      }
  }
  
  const removeSelectedCropDataFromFertilizerLog = async ()=>{


    try {

        setShowDeleteRecordDataConfirmationForFertilizerRecord(false)
        setShowDeleteRecordDataProcessForFertilizerRecord(true)
        setLoadingForDeleteRecordDataFertilizer(true)
        console.log("Selected Crops to be removed  :",SelectedCropForRemovalCropsVFertilizer)
        const docRef = doc(db, "Records", user?.RecordsRefId as string );
        const docSnap = await getDoc(docRef);
    
        if (!docSnap.exists()) {
          console.log("Document does not exist.");
          return;
        }
    
        const data = docSnap.data();
        let existingLogs = data?.FertilizerLogs || [];
    
        // Find the index of the entry that matches the current PlotAssocId
        const logIndex = existingLogs.findIndex(
          (log: any) => log.PlotAssocId === plotRefIdParam
        );
    
        if (logIndex === -1) {
          console.log("No matching PlotAssocId found.");
          return;
        }
        
        console.log("Existing fertilizer log before filter : ", existingLogs[logIndex])
        // Filter out selected crops
        existingLogs[logIndex].FertilizerApplications = existingLogs[logIndex].FertilizerApplications.filter(
          (log: any) => !SelectedCropForRemovalCropsVFertilizer.includes(log.cropName)
        );

        console.log("Existing fertilizer log after filter : ", existingLogs)
        
        // Update Firestore with the new PestLogs array
        await updateDoc(docRef, { FertilizerLogs: existingLogs });
        const updatedCrops = fertilizerCropNames.filter(crop => !SelectedCropForRemovalCropsVFertilizer.includes(crop));
        setFertilizerCropNames(updatedCrops)
        console.log("Selected crops deleted successfully.");



        setSelectedCropForRemovalCropsVFertilizer([]); // Reset selection after deletion
        setFertilizerLogs(existingLogs[logIndex].FertilizerApplications); // Update state to reflect changes
        
       setloadingForDeleteRecordData(false)
      } catch (error) {
        console.error("Error deleting crop data:", error);
      }finally{
        setLoadingForDeleteRecordDataFertilizer(false)
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



    try{

        setShowEditConfirmation(false)
        setLoadForSaveEditProcess(true)
        setShowEditProcess(true)

        console.log("Fetching plot document using id : ",user?.PlotsRefId)

        const docRef = doc(db,"Plots",user?.PlotsRefId as string)
        const docSnap = await getDoc(docRef)
    
    
        
        //upload to cloudinary
        let finalImageUrl = ""
    
        if (typeof imageUri === "string" && (imageUri.startsWith("http") || imageUri.length === 0)) {
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
                        PlotThumbnail:finalImageUrl,
                        PlotName:plotName
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
    
    
        //currentCrops Plot names update
    
    
        const currentCropsRef = doc(db,"CurrentCrops",user?.CurrentCropsRefId as string);
        const currentCropsSnap = await getDoc(currentCropsRef);
    
        if(currentCropsSnap.exists()){
    
            const currentCropsData = currentCropsSnap.data();
            const cropsArray = currentCropsData.CurrentCrops as any[]
    
    
    
    
            const updatedCropsArray = cropsArray.map((crop)=>{
                if(crop.PlotAssoc === plotRefIdParam) {
                    return {
                        ...crop,
                        PlotName:plotName
                    };
                }
    
                return crop;
            })
    
            await updateDoc(currentCropsRef,{
                CurrentCrops:updatedCropsArray
            })
    
            console.log("Updated Current Crops plot name !!")
        }

    }catch(err){console.error(err)}finally{
        setLoadForSaveEditProcess(false)
    }



  }

  //dialog handlers

  const[showDeleteRecordDataConfirmation,setShowDeleteRecordDataConfirmation] = useState(false)
  const [showDeleteRecordDataProcess,setShowRecordDataProcess] = useState(false)
  const[loadingForDeleteRecordData,setloadingForDeleteRecordData] = useState(false)
  const[showDeletePlotConfirmation,setShowDeletePlotConfirmation] = useState(false)
  const[showDeletePlotProcess,SetShowDeletePlotProcess] = useState(false)
  const[loadingForDeletePlot,setLoadingForDeletePlot] = useState(false)


  const [showSaveEditConfirmation,setShowEditConfirmation] = useState(false)
  const [showSaveEditProcess,setShowEditProcess] = useState(false)
  const [loadingForSaveEditProcess,setLoadForSaveEditProcess] = useState(false)


  const [showDeleteRecordDataConfirmationForFertilizerRecord,setShowDeleteRecordDataConfirmationForFertilizerRecord] = useState(false)
  const [showDeleteRecordDataProcessForFertilizerRecord,setShowDeleteRecordDataProcessForFertilizerRecord] = useState(false)
  const [loadingForDeleteRecordDataFertilizer,setLoadingForDeleteRecordDataFertilizer] = useState(false)


  const [showDeletePlotError,setDeletePlotError] = useState(false)




  //const [showSaveEditSuccess,setShowEditSuccess] = useState(false)


  //checbox controller 
  const [selectedCropForRemoval,setSelectedCropForRemoval] = useState<string[]>([]);
  const [SelectedCropForRemovalCropsVFertilizer,setSelectedCropForRemovalCropsVFertilizer] = useState<string[]>([])

  const toggleCropSelectionRemoval = (crop:string)=>{

    setSelectedCropForRemoval(prev=>
        prev.includes(crop)
            ? prev.filter(c => c !== crop) // Remove if already selected
            : [...prev, crop] // Add if not selected
    )
}

const toggleCropSelectionRemovalVFertilizer = (crop:string)=>{

    setSelectedCropForRemovalCropsVFertilizer(prev=>
        prev.includes(crop)
            ? prev.filter(c => c !== crop) // Remove if already selected
            : [...prev, crop] // Add if not selected
    )
}




    const renderDeleteRecordDataConfirmation = (selectedCrops:string[]) => (

    <Portal>

        <Dialog visible={showDeleteRecordDataConfirmation} onDismiss={()=>{setShowDeleteRecordDataConfirmation(false)}}>


            <Dialog.Title>
                Delete Crop Data?
            </Dialog.Title>


            <Dialog.Content>
                {
                    selectedCrops.map((crop,index)=>(
                        <Text>
                            This will permanently remove all records related to the selected crop(s) [{crop}] from pest logs. This action cannot be undone. Are you sure you want to proceed?
                         
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
                        <Text>Please wait while the selected crop data is being removed from Pest logs...</Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                    <Text>The crop data has been successfully removed from pest logs.</Text>
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
    const renderSaveEditConfirmation = () => (
        <Portal>

            <Dialog visible={showSaveEditConfirmation} onDismiss={()=>{}}>


                <Dialog.Title>
                    Save Changes?
                </Dialog.Title>


                <Dialog.Content>
                    <Text>Are you sure you want to save the changes made to the plot name and thumbnail?

                    </Text>

                </Dialog.Content>


                <Dialog.Actions>


                    <TouchableOpacity onPress={()=>setShowEditConfirmation(false)} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
                        <Text style={{color:'white'}}>
                            Cancel
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={()=>{handleSaveEdit()}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                    <Text style={{color:'white'}}>
                        Continue
                    </Text>

                    </TouchableOpacity>


                </Dialog.Actions>

            </Dialog>
        </Portal>
    )
    const renderSaveEditProcess = ()=>(
        <Portal>
            <Dialog visible={showSaveEditProcess} onDismiss={()=>{}}>


                <Dialog.Title>
                    Saving Changes
                </Dialog.Title>


                {loadingForSaveEditProcess? (
                    <Dialog.Content>
                        <Text>Please wait while your changes are being saved...</Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                    <Text>Your plot name and thumbnail have been successfully updated.</Text>
                    </Dialog.Content>
                )}



                {loadingForSaveEditProcess ? (
                    <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                ) : (
                    <Dialog.Actions>

                        <TouchableOpacity onPress={()=>setShowEditProcess(false)} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                            <Text style={{color:'white'}}>
                                Continue
                            </Text>

                        </TouchableOpacity>

                    </Dialog.Actions>
                )}

            </Dialog>


        </Portal>
    )

    const renderDeleteRecordDataConfirmationVFertilizer = (selectedCrops:string[]) => (

        <Portal>
    
            <Dialog visible={showDeleteRecordDataConfirmationForFertilizerRecord} onDismiss={()=>{setShowDeleteRecordDataConfirmationForFertilizerRecord(false)}}>
    
    
                <Dialog.Title>
                    Delete Crop Data?
                </Dialog.Title>
    
    
                <Dialog.Content>
                    {
                        selectedCrops.map((crop,index)=>(
                            <Text>
                                This will permanently remove all records related to the selected crop(s) [{crop}] from fertilizer logs. This action cannot be undone. Are you sure you want to proceed?
                             
                            </Text>
    
                        ))
                    }
    
                </Dialog.Content>
    
    
                <Dialog.Actions>
                    <TouchableOpacity onPress={()=>{removeSelectedCropDataFromFertilizerLog()}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
    
                        <Text style={{color:'white'}}>
                            Continue
                        </Text>
    
                    </TouchableOpacity>
                </Dialog.Actions>
    
            </Dialog>
        </Portal>
    )

    const renderProcessDeleteRecordDataVFertilizer = () => (

        <Portal>
            <Dialog visible={showDeleteRecordDataProcessForFertilizerRecord} onDismiss={()=>{}}>


                <Dialog.Title>
                    Deleting Selected Crop Logs
                </Dialog.Title>


                {loadingForDeleteRecordDataFertilizer? (
                    <Dialog.Content>
                        <Text>Please wait while the selected crop data is being removed from Fertilizer logs...</Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                    <Text>The crop data has been successfully removed from Fertilizer logs.</Text>
                    </Dialog.Content>
                )}



                {loadingForDeleteRecordData ? (
                    <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                ) : (
                    <Dialog.Actions>

                        <TouchableOpacity onPress={()=>setShowDeleteRecordDataProcessForFertilizerRecord(false)} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                            <Text style={{color:'white'}}>
                                Continue
                            </Text>

                        </TouchableOpacity>

                    </Dialog.Actions>
                )}

            </Dialog>


        </Portal>
    )


    const renderDeletePlotError = () => (


        <Portal>

            <Dialog visible={showDeletePlotError} onDismiss={()=>{}}>


                <Dialog.Title>
                    <Text>
                        Cannot Delete Plot
                    </Text>
                    
                </Dialog.Title>


                <Dialog.Content>
                    <Text>This plot cannot be deleted because a crop is currently assigned to it. Please remove the crop before attempting to delete the plot.</Text>

                </Dialog.Content>


                <Dialog.Actions>


                    <TouchableOpacity onPress={()=>{setDeletePlotError(false)}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                    <Text style={{color:'white'}}>
                        Continue
                    </Text>

                    </TouchableOpacity>


                </Dialog.Actions>

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
                {renderSaveEditConfirmation()}
                {renderSaveEditProcess()}
                {renderDeleteRecordDataConfirmationVFertilizer(SelectedCropForRemovalCropsVFertilizer)}
                {renderProcessDeleteRecordDataVFertilizer()}
                {renderDeletePlotError()}

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

                    <TextInput value={plotName} onChange={(e)=>setPlotName(e.nativeEvent.text)} placeholder="Title" style={styles.titleInput}></TextInput>


                    <TouchableOpacity onPress={()=> setShowEditConfirmation(true)} style={{alignSelf:'flex-start',borderWidth:0,paddingVertical:5,paddingHorizontal:10,borderRadius:5,backgroundColor:'#297340',elevation:2}}><Text style={{color:"white"}}>Update Plot Information</Text></TouchableOpacity>
                </View>



                <View style={stylesDataRemove.wrapper}>
                    <View style={stylesDataRemove.wrapperHeader}>
                        <Text style={{fontWeight:500,fontSize:16,color:'#37474F',letterSpacing:.5}}>Delete Crop Pest Logs</Text>
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


                <View style={stylesDataRemove.wrapper}>
                    <View style={stylesDataRemove.wrapperHeader}>
                        <Text style={{fontWeight:500,fontSize:16,color:'#37474F',letterSpacing:.5}}>Delete Fertilizer Logs</Text>
                    </View>

                    <View style={stylesDataRemove.wrapperControl}>
                    {fertilizerCropNames?.length === 0 ? (
                        <Text style={{marginLeft:'auto',marginRight:'auto',fontWeight:500,fontSize:13,color:'#333333'}}>No associated crops available.</Text>
                    ) : (
                        fertilizerCropNames?.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                            status={SelectedCropForRemovalCropsVFertilizer.includes(item) ? 'checked' : 'unchecked'}
                            onPress={() => toggleCropSelectionRemovalVFertilizer(item)}
                            />
                            <Text>{item}</Text>
                        </View>
                        ))
                    )}
                    </View>

                    <View style={stylesDataRemove.wrapperButton}>
                        <TouchableOpacity onPress={()=>{if(SelectedCropForRemovalCropsVFertilizer.length === 0){return};  setShowDeleteRecordDataConfirmationForFertilizerRecord(true)}} style={{alignSelf:'flex-start',borderWidth:0,paddingVertical:5,paddingHorizontal:10,borderRadius:5,backgroundColor:'red',elevation:2}}>
                            <Text style={{color:'white'}}>Delete Data</Text>
                        </TouchableOpacity>
                    </View>
                </View>

  
            </ScrollView>

            
            
        </SafeAreaView>


    </PaperProvider>
  )
}

export default PlotScreenSettings


const stylesDataRemove = StyleSheet.create({
    wrapper:{
        width:'100%',
        borderWidth:1,
        paddingVertical:10,
        paddingHorizontal:10,
        display:"flex",
        flexDirection:'column',
       backgroundColor:'white',
       borderColor:'#E2E8f0',
        borderRadius:5,
        elevation:0,
        marginBottom:5,
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
        borderColor:'#e2e8f0',
        borderBottomWidth:1,
        backgroundColor:'white',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:15,
        
    },
    scrollContentContainer:{
        display:'flex',
        width:'95%',
        //backgroundColor:"red"
        //borderWidth:1,
        flexDirection:'column',
        //gap:5
    },
    mainContainer:{
        borderWidth:1,
        flex:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
          backgroundColor:'#F4F5F7',
    },
    contentContainer:{
        marginTop:10,
        width:"100%",
        gap:15,
        paddingHorizontal:0,
        paddingVertical:10,
       
        display:'flex',
        flexDirection:'column',
     
         borderColor:'#E2E8f0',
        borderRadius:5,
        elevation:0,
        marginBottom:5,

    },
    titleInput:{
        fontSize:25,
        fontWeight:500,
        borderWidth:0,
       
        borderBottomWidth:1
      
    },
})