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
import { useLanguage } from '../Context/LanguageContex'

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
  
interface DiseaseLog{

}
const PlotScreenSettings = () => {
    const{language,setLanguage} = useLanguage()

    const {user} = useUserContext()
    const searchParams = useSearchParams();
    const plotRefIdParam = searchParams.get('plotAssocId')
    const plotNameParam = searchParams.get('currentPlotName')
    const isCurrentCrop = searchParams.get('currentCrop')
    const PlotCoverParam = searchParams.get('PlotCover')
    const [imageUri,setImageUri] = useState<File | String>('')
    const [plotRefId,setPlotRefId] = useState("")
    const [showError,setShowError] = useState<boolean>(false)


    const[associatedCrops,setAssociatedCrops]= useState<string[]>([])
    const[associatedCropsDisease,setAssociatedCropsDisease] = useState<string[]>([])
    const [pestLogs,setPestLogs] = useState<PestLog[]>([]);
    const [diseaseLogs,setDiseaseLogs] = useState<DiseaseLog[]>([])

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



    const fetchDiseaseLogRecord = async(plotId:String)=>{




        console.log("Fetching Disease Log Record....")
        try{

            console.log("Fetching Disease Log Record 2....")



            const docRef = doc(db,'Records',user?.RecordsRefId as string)
            const docSnap = await getDoc(docRef)


            if(docSnap.exists()){
                    

                const data = docSnap.data()
                console.log("Returned Data : ", data)
                const existingLogs = data?.DiseaseLogs || []
                console.log("existing data logs : ", existingLogs)

                const logIndex = existingLogs.findIndex(
                    (log:any) => log.PlotAssocId === plotId
                )
                console.log("log index : ", logIndex)
                const plotDiseaseLog = existingLogs[logIndex].PlotDiseaseLog;

                
                console.log( "Filtered Plot Pest log entry", existingLogs[logIndex].PlotDiseaseLog)

                //const pestNames = [...new Set(plotPestLog.map((log: any) => log.Pestname))];
                const cropNames = [...new Set(plotDiseaseLog.map((log: any) => log.CropName))]
                console.log("Crop List Data: ", cropNames);

                //setPestListData(pestNames as string[])
                setAssociatedCropsDisease(cropNames as string[])
                setDiseaseLogs(existingLogs[logIndex].PlotDiseaseLog)


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
    fetchDiseaseLogRecord(plotRefIdParam as string)
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


    const removeSelectedCropDataVDisease = async ()=>{
        console.log("Clicking")
        setShowDeleteRecordDataConfirmationForDisease(false)
        setloadingForDeleteRecordData(true)
        setShowRecordDataProcess(true)
        console.log("<--------- Removing selected crop data disease logs START -------------->")
        try {
            
            const docRef = doc(db, "Records", user?.RecordsRefId as string );
            const docSnap = await getDoc(docRef);
        
            if (!docSnap.exists()) {
            console.log("Document does not exist.");
            return;
            }
        
            const data = docSnap.data();
            let existingLogs = data?.DiseaseLogs || [];
        
            // Find the index of the entry that matches the current PlotAssocId
            const logIndex = existingLogs.findIndex(
            (log: any) => log.PlotAssocId === plotRefIdParam
            );
        
            if (logIndex === -1) {
            console.log("No matching PlotAssocId found.");
            return;
            }
        
            // Filter out selected crops
            existingLogs[logIndex].PlotDiseaseLog = existingLogs[logIndex].PlotDiseaseLog.filter(
            (log: any) => !SelectedCropForRemovalVDisease.includes(log.CropName)
            );
        
            // Update Firestore with the new PestLogs array
            await updateDoc(docRef, { DiseaseLogs: existingLogs });
            const updatedCrops = associatedCropsDisease.filter(crop => !SelectedCropForRemovalVDisease.includes(crop));
            console.log("Updated crops ", updatedCrops)
            setAssociatedCropsDisease(updatedCrops)
            console.log("Selected crops deleted successfully.");
            setSelectedCropForRemovalVDisease([]); // Reset selection after deletion
            setDiseaseLogs(existingLogs[logIndex].PlotDiseaseLog); // Update state to reflect changes
            
            
            setloadingForDeleteRecordData(false)


        } catch (error) {
            setloadingForDeleteRecordData(false)
            setShowDeleteRecordDataProcessForFertilizerRecord(false)
            setShowError(true)
            console.error("Error deleting crop data:", error);
        }

        console.log("<--------- Removing selected crop data disease logs START -------------->")
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
  const [showDeleteRecordDataConfirmationForDisease,setShowDeleteRecordDataConfirmationForDisease] = useState(false)

  const [showDeleteRecordDataProcess,setShowRecordDataProcess] = useState(false)
  const [showDeleteRecordDataProcessForDisease,setShowDeleteRecordDataProcess] = useState(false)

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
  const [SelectedCropForRemovalVDisease,setSelectedCropForRemovalVDisease] = useState<string[]>([])

  const toggleCropSelectionRemoval = (crop:string)=>{

    setSelectedCropForRemoval(prev=>
        prev.includes(crop)
            ? prev.filter(c => c !== crop) // Remove if already selected
            : [...prev, crop] // Add if not selected
    )
}

const toggleCropSelectionRemovalForDisease = (crop:string)=> {
    setSelectedCropForRemovalVDisease(prev=> (
        prev.includes(crop) ? prev.filter(c => c !== crop): [...prev,crop] 
    ))
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
        <Dialog
            visible={showDeleteRecordDataConfirmation}
            onDismiss={() => {
            setShowDeleteRecordDataConfirmation(false);
            }}
        >
            <Dialog.Title>
            {language === "en" ? "Delete Crop Data?" : "Burahin ang Crop Data?"}
            </Dialog.Title>

            <Dialog.Content>
            {selectedCrops.map((crop, index) => (
                <Text key={index}>
                {language === "en"
                    ? `This will permanently remove all records related to the selected crop(s) [${crop}] from pest logs. This action cannot be undone. Are you sure you want to proceed?`
                    : `Permanenteng matatanggal ang lahat ng records na may kaugnayan sa napiling crop(s) [${crop}] mula sa pest logs. Hindi na ito maaaring ibalik. Sigurado ka bang gusto mong magpatuloy?`}
                </Text>
            ))}
            </Dialog.Content>

            <Dialog.Actions>
            <TouchableOpacity
                onPress={() => {
                removeSelectedCropData();
                }}
                style={{
                borderWidth: 0,
                alignSelf: "flex-start",
                backgroundColor: "#253D2C",
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                }}
            >
                <Text style={{ color: "white" }}>
                {language === "en" ? "Continue" : "Magpatuloy"}
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
                    {language === "en" ? "Confirm Plot Deletion" : "Kumpirmahin ang Pag-delete ng Plot"}
                </Dialog.Title>

                <Dialog.Content>
                    <Text>
                        {language === "en" 
                        ? "Do you really want to delete this plot? It will also remove all the logs saved to this plot." 
                        : "Sigurado ka bang gusto mong i-delete ang plot na ito? Mababura rin ang lahat ng logs na naka-save dito."}
                    </Text>
                </Dialog.Content>

                <Dialog.Actions>
                    <TouchableOpacity onPress={()=>{deletePlot(plotRefIdParam as string)}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                        <Text style={{color:'white'}}>
                            {language === "en" ? "Continue" : "Magpatuloy"}
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
                    {language === "en" ? "Deleting Plot" : "Binubura ang Plot"}
                </Dialog.Title>

                {loadingForDeletePlot? (
                    <Dialog.Content>
                        <Text>
                            {language === "en" 
                            ? "Your plot is being deleted. Please wait..." 
                            : "Binubura ang iyong plot. Mangyaring maghintay..."}
                        </Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                        <Text>
                            {language === "en" 
                            ? "Your plot was deleted successfully!" 
                            : "Matagumpay na nabura ang iyong plot!"}
                        </Text>
                    </Dialog.Content>
                )}

                {loadingForDeletePlot ? (
                    <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                ) : (
                    <Dialog.Actions>

                        <TouchableOpacity onPress={()=>{router.replace('/(main)/account')}} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                            <Text style={{color:'white'}}>
                                {language === "en" ? "Continue" : "Magpatuloy"}
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
                    {language === "en" ? "Deleting Selected Crop Logs" : "Binubura ang Napiling Crop Logs"}
                </Dialog.Title>

                {loadingForDeleteRecordData ? (
                    <Dialog.Content>
                        <Text>
                            {language === "en" 
                            ? "Please wait while the selected crop data is being removed from pest logs..." 
                            : "Mangyaring maghintay habang binubura ang napiling crop data mula sa pest logs..."}
                        </Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                        <Text>
                            {language === "en" 
                            ? "The crop data has been successfully removed from pest logs." 
                            : "Matagumpay na nabura ang crop data mula sa pest logs."}
                        </Text>
                    </Dialog.Content>
                )}

                {loadingForDeleteRecordData ? (
                    <ProgressBar indeterminate color={MD3Colors.error50} style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} />
                ) : (
                    <Dialog.Actions>

                        <TouchableOpacity onPress={()=>setShowRecordDataProcess(false)} style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>

                            <Text style={{color:'white'}}>
                                {language === "en" ? "Continue" : "Magpatuloy"}
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
                    {language === "en" ? "Save Changes?" : "I-save ang mga Pagbabago?"}
                </Dialog.Title>

                <Dialog.Content>
                    <Text>
                        {language === "en" 
                        ? "Are you sure you want to save the changes made to the plot name and thumbnail?" 
                        : "Sigurado ka bang gusto mong i-save ang mga pagbabagong ginawa sa pangalan at thumbnail ng plot?"}
                    </Text>
                </Dialog.Content>

                <Dialog.Actions>
                    <TouchableOpacity 
                    onPress={()=>setShowEditConfirmation(false)} 
                    style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}
                    >
                        <Text style={{color:'white'}}>
                            {language === "en" ? "Cancel" : "Kanselahin"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                    onPress={()=>{handleSaveEdit()}} 
                    style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}
                    >
                        <Text style={{color:'white'}}>
                            {language === "en" ? "Continue" : "Magpatuloy"}
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
                    {language === "en" ? "Saving Changes" : "Sini-save ang mga Pagbabago"}
                </Dialog.Title>

                {loadingForSaveEditProcess ? (
                    <Dialog.Content>
                        <Text>
                            {language === "en" 
                            ? "Please wait while your changes are being saved..." 
                            : "Maghintay habang sine-save ang iyong mga pagbabago..."}
                        </Text>
                    </Dialog.Content>
                ) : (
                    <Dialog.Content>
                        <Text>
                            {language === "en" 
                            ? "Your plot name and thumbnail have been successfully updated." 
                            : "Matagumpay na na-update ang pangalan at thumbnail ng iyong plot."}
                        </Text>
                    </Dialog.Content>
                )}

                {loadingForSaveEditProcess ? (
                    <ProgressBar 
                    indeterminate 
                    color={MD3Colors.error50} 
                    style={{marginBottom:20,width:'80%',marginLeft:'auto',marginRight:'auto',borderRadius:'50%'}} 
                    />
                ) : (
                    <Dialog.Actions>
                        <TouchableOpacity 
                        onPress={()=>setShowEditProcess(false)} 
                        style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}
                        >
                            <Text style={{color:'white'}}>
                                {language === "en" ? "Continue" : "Magpatuloy"}
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
                    {language === "en" ? "Delete Crop Data?" : "Burahin ang Crop Data?"}
                </Dialog.Title>

                <Dialog.Content>
                    {
                        selectedCrops.map((crop,index)=>(
                            <Text key={index}>
                                {language === "en" 
                                ? `This will permanently remove all records related to the selected crop(s) [${crop}] from fertilizer logs. This action cannot be undone. Are you sure you want to proceed?` 
                                : `Permanenteng matatanggal ang lahat ng records na may kinalaman sa crop(s) [${crop}] mula sa fertilizer logs. Hindi na ito maibabalik. Sigurado ka bang gusto mong magpatuloy?`}
                            </Text>
                        ))
                    }
                </Dialog.Content>

                <Dialog.Actions>
                    <TouchableOpacity 
                    onPress={()=>{removeSelectedCropDataFromFertilizerLog()}} 
                    style={{borderWidth:0,alignSelf:'flex-start',backgroundColor:'#253D2C',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}
                    >
                        <Text style={{color:'white'}}>
                            {language === "en" ? "Continue" : "Magpatuloy"}
                        </Text>
                    </TouchableOpacity>
                </Dialog.Actions>

            </Dialog>
        </Portal>
    )
    const renderProcessDeleteRecordDataVFertilizer = () => (

        <Portal>
            <Dialog
                visible={showDeleteRecordDataProcessForFertilizerRecord}
                onDismiss={() => {}}
            >
                <Dialog.Title>
                {language === "en"
                    ? "Deleting Selected Crop Logs"
                    : "Tinatanggal ang mga Napiling Talaan ng Pananim"}
                </Dialog.Title>

                {loadingForDeleteRecordDataFertilizer ? (
                <Dialog.Content>
                    <Text>
                    {language === "en"
                        ? "Please wait while we remove the selected crop records from your Fertilizer logs..."
                        : "Mangyaring maghintay habang tinatanggal ang mga napiling talaan ng pananim mula sa iyong Fertilizer logs..."}
                    </Text>
                </Dialog.Content>
                ) : (
                <Dialog.Content>
                    <Text>
                    {language === "en"
                        ? "The selected crop records have been successfully deleted from your Fertilizer logs."
                        : "Matagumpay na natanggal ang mga napiling talaan ng pananim mula sa iyong Fertilizer logs."}
                    </Text>
                </Dialog.Content>
                )}

                {loadingForDeleteRecordData ? (
                <ProgressBar
                    indeterminate
                    color={MD3Colors.error50}
                    style={{
                    marginBottom: 20,
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: 50,
                    }}
                />
                ) : (
                <Dialog.Actions>
                    <TouchableOpacity
                    onPress={() =>
                        setShowDeleteRecordDataProcessForFertilizerRecord(false)
                    }
                    style={{
                        borderWidth: 0,
                        alignSelf: "flex-start",
                        backgroundColor: "#253D2C",
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                        borderRadius: 5,
                    }}
                    >
                    <Text style={{ color: "white" }}>
                        {language === "en" ? "Continue" : "Magpatuloy"}
                    </Text>
                    </TouchableOpacity>
                </Dialog.Actions>
                )}
            </Dialog>
        </Portal>
    )
    const renderDeletePlotError = () => (


        <Portal>
            <Dialog visible={showDeletePlotError} onDismiss={() => {}}>
                <Dialog.Title>
                <Text>
                    {language === "en"
                    ? "Cannot Delete Plot"
                    : "Hindi Maaaring Burahin ang Plot"}
                </Text>
                </Dialog.Title>

                <Dialog.Content>
                <Text>
                    {language === "en"
                    ? "This plot cannot be deleted because a crop is currently assigned to it. Please remove the crop before attempting to delete the plot."
                    : "Hindi maaaring burahin ang plot na ito dahil may nakatalagang pananim dito. Mangyaring alisin muna ang pananim bago subukang burahin ang plot."}
                </Text>
                </Dialog.Content>

                <Dialog.Actions>
                <TouchableOpacity
                    onPress={() => {
                    setDeletePlotError(false);
                    }}
                    style={{
                    borderWidth: 0,
                    alignSelf: "flex-start",
                    backgroundColor: "#253D2C",
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 5,
                    paddingBottom: 5,
                    borderRadius: 5,
                    }}
                >
                    <Text style={{ color: "white" }}>
                    {language === "en" ? "Continue" : "Magpatuloy"}
                    </Text>
                </TouchableOpacity>
                </Dialog.Actions>
            </Dialog>
        </Portal>

    )


    /* Disease Modal */

    const renderDeleteRecordDataConfirmationForDisease = (selectedCrops:string[]) => (
        <Portal>
        <Dialog
            visible={showDeleteRecordDataConfirmationForDisease}
            onDismiss={() => {
            setShowDeleteRecordDataConfirmationForDisease(false);
            }}
        >
            <Dialog.Title>
            <Text>
                {language === "en" ? "Delete Crop Data?" : "Burahin ang Talaan ng Pananim?"}
            </Text>
            </Dialog.Title>

            <Dialog.Content>
            {selectedCrops.map((crop, index) => (
                <Text key={index}>
                {language === "en"
                    ? `This will permanently remove all records related to the selected crop(s) [${crop}] from Disease logs. This action cannot be undone. Are you sure you want to proceed?`
                    : `Permanente nitong tatanggalin ang lahat ng talaan na may kaugnayan sa napiling pananim [${crop}] mula sa Disease logs. Hindi na ito maaaring ibalik. Sigurado ka bang gusto mong magpatuloy?`}
                </Text>
            ))}
            </Dialog.Content>

            <Dialog.Actions>
            <TouchableOpacity
                onPress={() => {
                removeSelectedCropDataVDisease();
                }}
                style={{
                borderWidth: 0,
                alignSelf: "flex-start",
                backgroundColor: "#253D2C",
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
                }}
            >
                <Text style={{ color: "white" }}>
                {language === "en" ? "Continue" : "Magpatuloy"}
                </Text>
            </TouchableOpacity>
            </Dialog.Actions>
        </Dialog>
        </Portal>
    )

    const renderProcessDeleteRecordDataForDisease = () => (
        <Portal>
            <Dialog visible={showDeleteRecordDataProcessForDisease} onDismiss={() => {}}>
                <Dialog.Title>
                <Text>
                    {language === "en"
                    ? "Deleting Selected Crop Logs"
                    : "Tinatanggal ang Napiling Talaan ng Pananim"}
                </Text>
                </Dialog.Title>

                {loadingForDeleteRecordData ? (
                <Dialog.Content>
                    <Text>
                    {language === "en"
                        ? "Please wait while the selected crop data is being removed from Disease logs..."
                        : "Mangyaring maghintay habang tinatanggal ang napiling talaan ng pananim mula sa Disease logs..."}
                    </Text>
                </Dialog.Content>
                ) : (
                <Dialog.Content>
                    <Text>
                    {language === "en"
                        ? "The crop data has been successfully removed from Disease logs."
                        : "Matagumpay nang natanggal ang talaan ng pananim mula sa Disease logs."}
                    </Text>
                </Dialog.Content>
                )}

                {loadingForDeleteRecordData ? (
                <ProgressBar
                    indeterminate
                    color={MD3Colors.error50}
                    style={{
                    marginBottom: 20,
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: "50%",
                    }}
                />
                ) : (
                <Dialog.Actions>
                    <TouchableOpacity
                    onPress={() => setShowRecordDataProcess(false)}
                    style={{
                        borderWidth: 0,
                        alignSelf: "flex-start",
                        backgroundColor: "#253D2C",
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 5,
                        paddingBottom: 5,
                        borderRadius: 5,
                    }}
                    >
                    <Text style={{ color: "white" }}>
                        {language === "en" ? "Continue" : "Magpatuloy"}
                    </Text>
                    </TouchableOpacity>
                </Dialog.Actions>
                )}
            </Dialog>
        </Portal>
    )



    const renderError = ()=>(

        <Portal>
              <Dialog visible={showError} onDismiss={()=>setShowError(false)}>
      
                  <Dialog.Icon  icon="alert-circle" size={60} color='#ef9a9a'/>
      
                  <Dialog.Title>
                      <Text style={{color:'#37474F'}}>
                          {language === "en" ? "Something Went Wrong" : "May Nagkaproblema"}
                      </Text>
                      
                  </Dialog.Title>
                  
                  <Dialog.Content>
                      <Text style={{color:'#475569'}}>
                       {language === "en" ? "An unexpected error occured. Please try again later" : "Nagkaroon ng hindi inaasahang error. Pakisubukang muli mamaya."}
                        
                      </Text>
                  </Dialog.Content>
      
      
      
                  <Dialog.Actions>
      
                  <TouchableOpacity onPress={()=> setShowError(false)} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
      
                      <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                          OK
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
                {renderDeleteRecordDataConfirmationForDisease(SelectedCropForRemovalVDisease)}
                {renderProcessDeleteRecordDataForDisease()}
                {renderError()}
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


                    <TouchableOpacity onPress={()=> setShowEditConfirmation(true)} style={{alignSelf:'flex-start',borderWidth:0,paddingVertical:8,paddingHorizontal:10,borderRadius:5,backgroundColor:'#607D8B',elevation:2}}>
                        <Text style={{color:"white",fontSize:16,fontWeight:500}}>{language === "en" ? "Update Plot Information" : "I-update ang Impormasyon ng Plot"}</Text>
                    </TouchableOpacity>
                </View>



                <View style={stylesDataRemove.wrapper}>
                    <View style={stylesDataRemove.wrapperHeader}>
                        <Text style={{fontWeight:600,fontSize:18,color:'#37474F',letterSpacing:0}}>{language === "en" ? "Delete Crop Pest Logs" : "Burahin ang Pest Logs ng Pananim"}</Text>
                    </View>

                    <View style={stylesDataRemove.wrapperControl}>
                    {associatedCrops.length === 0 ? (
                        <Text style={{marginLeft:'auto',marginRight:'auto',fontWeight:500,fontSize:13}}> {language === "en" ? "No associated crops available." : "Walang kaugnay na pananim na available."}</Text>
                    ) : (
                        associatedCrops.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                            status={selectedCropForRemoval.includes(item) ? 'checked' : 'unchecked'}
                            onPress={() => toggleCropSelectionRemoval(item)}
                            key={index}
                            />
                            <Text style={{fontSize:17}}>{item}</Text>
                        </View>
                        ))
                    )}
                    </View>

                    <View style={stylesDataRemove.wrapperButton}>
                        <TouchableOpacity onPress={()=>{if(selectedCropForRemoval.length === 0){return};  setShowDeleteRecordDataConfirmation(true)}} style={{alignSelf:'flex-start',borderWidth:0,paddingVertical:7,paddingHorizontal:10,borderRadius:5,backgroundColor:'red',elevation:2}}>
                            <Text style={{color:'white',fontSize:15,fontWeight:500}}>{language === "en" ? "Delete Data" : "Burahin ang Data"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>



                 <View style={stylesDataRemove.wrapper}>
                    <View style={stylesDataRemove.wrapperHeader}>
                        <Text style={{fontWeight:600,fontSize:18,color:'#37474F',letterSpacing:0}}>{language === "en" ? "Delete Crop Disease Logs" : "Burahin ang Disease Logs ng Pananim"}</Text>
                    </View>

                    <View style={stylesDataRemove.wrapperControl}>
                    {associatedCropsDisease.length === 0 ? (
                        <Text style={{marginLeft:'auto',marginRight:'auto',fontWeight:500,fontSize:13}}>{language === "en" ? "No associated crops available." : "Walang kaugnay na pananim na available."}</Text>
                    ) : (
                        associatedCropsDisease.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                            key={index}
                            status={SelectedCropForRemovalVDisease.includes(item) ? 'checked' : 'unchecked'}
                            onPress={() => toggleCropSelectionRemovalForDisease(item)}
                            />
                            <Text style={{fontSize:17}}>{item}</Text>
                        </View>
                        ))
                    )}
                    </View>

                    <View style={stylesDataRemove.wrapperButton}>
                        <TouchableOpacity onPress={()=>{if(SelectedCropForRemovalVDisease.length === 0){return};  setShowDeleteRecordDataConfirmationForDisease(true)}} style={{alignSelf:'flex-start',borderWidth:0,paddingVertical:7,paddingHorizontal:10,borderRadius:5,backgroundColor:'red',elevation:2}}>
                            <Text style={{color:'white',fontSize:15,fontWeight:500}}>{language === "en" ? "Delete Data" : "Burahin ang Data"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={stylesDataRemove.wrapper}>
                    <View style={stylesDataRemove.wrapperHeader}>
                        <Text style={{fontWeight:600,fontSize:18,color:'#37474F',letterSpacing:0}}>{language === "en" ? "Delete Fertilizer Logs" : "Burahin ang Fertilizer Logs"}</Text>
                    </View>

                    <View style={stylesDataRemove.wrapperControl}>
                    {fertilizerCropNames?.length === 0 ? (
                        <Text style={{marginLeft:'auto',marginRight:'auto',fontWeight:500,fontSize:13,color:'#333333'}}>{language === "en" ? "No associated crops available." : "Walang kaugnay na pananim na available."}</Text>
                    ) : (
                        fertilizerCropNames?.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox key={index}
                            
                            status={SelectedCropForRemovalCropsVFertilizer.includes(item) ? 'checked' : 'unchecked'}
                            onPress={() => toggleCropSelectionRemovalVFertilizer(item)}
                            />
                            <Text style={{fontSize:17}}>{item}</Text>
                        </View>
                        ))
                    )}
                    </View>

                    <View style={stylesDataRemove.wrapperButton}>
                        <TouchableOpacity onPress={()=>{if(SelectedCropForRemovalCropsVFertilizer.length === 0){return};  setShowDeleteRecordDataConfirmationForFertilizerRecord(true)}} style={{alignSelf:'flex-start',borderWidth:0,paddingVertical:7,paddingHorizontal:10,borderRadius:5,backgroundColor:'red',elevation:2}}>
                            <Text style={{color:'white',fontSize:15,fontWeight:500}}>{language === "en" ? "Delete Data" : "Burahin ang Data"}</Text>
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
        borderWidth:0,
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