import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { StyleSheet, Text, TouchableOpacity, View,KeyboardAvoidingView, Platform, ActivityIndicator, Linking } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import AntDesign from '@expo/vector-icons/AntDesign';
import Collapsible from 'react-native-collapsible';

import { SelectList } from 'react-native-dropdown-select-list';
import MultiSelect from 'react-native-multiple-select';
import { Menu, Divider, PaperProvider,Portal, Dialog } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons'

//react native paper imports
import { Button } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { useSearchParams } from 'expo-router/build/hooks'


import { Image } from 'react-native';
import { router } from 'expo-router'


interface guideStep{
  header: string;
  content: string;
}

interface CropDataLocal{
  cropId:string,
  thumbnail: string;
  scientificName: string;
  commonName:string,
  family: string;
  growthTime: string;
  bestSeason: string;
  soilType: string;
  soilPh: string;
  commonPests: string[];
  commonDiseases: string[];
  guide: Record<string, guideStep>;
}

interface CropsDataLocal {
  [key: string]: CropDataLocal;
}

interface PlotData{
  PlotId : string,
  PlotName: string
}

interface Plots{
  plot:PlotData[],
}



interface pestType{
  pestCoverImage:string,
  pestId:string,
  pestName:string

}

interface diseaseType{
  diseaseCoverImage:string,
  diseaseId:string,
  diseaseName:string

  
}

interface referenceType{
  referenceTitle:string,
  referenceLink:string,
}

interface CropData{
  cropId:string,
  sessionId:string,
  thumbnail: string;
  scientificName: string;
  commonName:string,
  family: string;
  growthTime: string;
  bestSeason: string;
  soilType: string[];
  soilPh: string;
  commonPests: pestType[];
  commonDiseases: diseaseType[];
  content:guideStep[];
  reference:referenceType[]
}





import TomatoData from '../CropsData/Crops/Solanaceae/Tomato.json'
import EggplantData from '../CropsData/Crops/Solanaceae/Eggplant.json'
import Squash from '../CropsData/Crops/Cucurbitaceae/Squash.json'
import ChilliPepper from '../CropsData/Crops/Solanaceae/ChilliPepper.json'
import Potato from '../CropsData/Crops/Solanaceae/Potato.json'
import Sitaw from '../CropsData/Crops/Fabaceae/Sitaw.json'
import Bittergourd from "../CropsData/Crops/Cucurbitaceae/Bittergourd.json"
import Bottlegourd from '../CropsData/Crops/Cucurbitaceae/Bottlegourd.json'
import Cucumber from '../CropsData/Crops/Cucurbitaceae/Cucumber.json'
import MungBean from '../CropsData/Crops/Fabaceae/Mungbean.json'
import Peanut from '../CropsData/Crops/Fabaceae/Peanut.json'
import Spongegourd from '../CropsData/Crops/Cucurbitaceae/Spongegourd.json'

import { diseaseImages, pestImages } from '../Pestdat'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import { hide } from 'expo-splash-screen'
import { useUserContext } from '../Context/UserContext'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import { useLanguage } from '../Context/LanguageContex';




const CropManagement = () => {
  const {language} = useLanguage()
  const {user,logout} = useUserContext();

  //firebase datas

  const [plots,setPlots] = useState<Plots>({plot:[]})
  

  // local data
  const [localCropData,setLocalCropData] = useState<CropsDataLocal>({});
  var selectedCrop

  //loading


  const [isLoading,setLoading] = useState(true);

  //passed params

  const searchParams = useSearchParams();

  const cropName = searchParams.get('cropName');
  const cropId = searchParams.get('cropId');
  const sessionId = searchParams.get('SessionId');
  const PlotAssoc= searchParams.get('PlotAssoc');
  const PlotName = searchParams.get('PlotName');


  

  //crop session datas

  const [assocPlot,setAssocPlot] = useState<string | null>(null);
  const [tempCropName,setTempCropName] = useState<string | null>(null);
  const [selectedOption,setSelectedOption] = useState<String>('CareGuide')


  const handleSegmentChange = (value:String) => {
    setSelectedOption(value);
  };



  const [collapsedStates, setCollapsedStates] = useState<{ [key: number]: boolean }>({});
  const toggleCollapse = (index: number) => {
    setCollapsedStates((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the specific section
    }));
  };

  const [isCollapsed, setIsCollapsed] = useState<number | null>(null);
  const [isCollapsed2, setIsCollapsed2] = useState(true);
  const [isCollapsed3, setIsCollapsed3] = useState(true);
  const [isCollapsed4, setIsCollapsed4] = useState(true);
  const [isCollapsed5, setIsCollapsed5] = useState(true);

  

  

  //records

  //> data 


  const [cropData,setCropData] = useState<CropData | null>()

  const [pesticide,setPesticide] = useState<string> ('')
  const [fertilizer,setFertilizer] = useState<string> ('')
  const [notes,setNotes] = useState<string> ('')

  const [selectedPest, setSelectedPest] = useState<string | null>('');
  const [selectedDisease, setSelectedDisease] = useState<string | null>('');

  const [localPestData,setLocalPestData] = useState<Array<{id:string,name:string}>>([])
  const [localDiseaseData,setLocalDiseaseData] = useState<Array<{id:string,name:string}>>([])
  const [currentTemp,setCurrentTemp] = useState<number>(0)
  const [openDropdown, setOpenDropdown] = useState('');
  //pest data
  const pestData = [
    { id: '1', name: 'fruitworm' },
    { id: '2', name: 'thrips' },
    { id: '3', name: 'whiteflies' },
  
  ];

  const diseaseData = [
    { id: '1', name: 'Nematode' },
    { id: '2', name: 'Bacterial Wilt' },
    { id: '3', name: 'Mosaic Virus' },
    { id: '4', name: 'None' },
  ];

  const fertilizerData =[
    {id:'1',name:'14-14-14'},
    {id:'2',name:'16-20-0'},
    {id:'3',name:'21-0-0'},
    {id:'4',name:'0-0-60'},
    {id:'5',name:'46-0-0'},
    {id:'6',name:'Organic Fertilizer'},
  ]
  const fertilizerApplicationData =[
    {id:'1',name:'Broadcasting'},
    {id:'2',name:'Side-dressing'},
    {id:'3',name:'Basal Application'},
    {id:'4',name:'Fertigation'},
    {id:'5',name:'Foliar Feeding'},
    {id:'6',name:'Hole Fertilization'},
    {id:'7',name:'Ring Application'},
    {id:'8',name:'Top-dressing'},
  ]


  //pest selected
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedPestnames,setSelectedPestNames] = useState<string[]>([])
  const [selectedDiseaseNames,setSelectedDiseaseNames] = useState<string[]>([])
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedFertilizer, setSelectedFertilizer] = useState('');
  const [selectedApplication, setSelectedApplication] = useState('Side-dressing');
  const multiSelectRef = React.useRef<MultiSelect | null>(null);
  const [amountFertilzer, setAmountFertilizer] = useState('');


  const [showError,setShowError] = useState<boolean>(false)
  const [showInternetError,setShowInternetError] = useState(false)
  const [logProcess,setLogProcess] = useState(false)

  //radio button handler for fertilizer 


  const onSelectedItemsChange = (items:string[]) => {
    console.log("Selected Items : ", items)

    const selectedNames = localPestData
    .filter(pest => items.includes(pest.id))
    .map(pest => pest.name);

    setSelectedItems(items)
    setSelectedPestNames(selectedNames);

  };




  const handleAmountChange = (text:string) => {
    // Optional: allow only numbers (with optional decimal)
    const numericValue = text.replace(/[^0-9.]/g, '');
    setAmountFertilizer(numericValue);
  };

  const onSelectedDiseaseChange = (items:string[])=>{
    console.log("Selected disease : ", items)
    console.log("Local disease data : ", localDiseaseData)
    const selectedNames = localDiseaseData.filter(disease=>items.includes(disease.id)).map(disease => disease.name);
    console.log("Selected Disease names conv : ", selectedNames)
    setSelectedDiseases(items);
    setSelectedDiseaseNames(selectedNames)
  }

  const onChangeNotes = (text:string) => {
    setNotes(text);
  };




  useEffect(()=>{
    setLoading(true)

   const fetchCropDataFromFirebase = async () => {
      try {
        setLoading(true); // start loading
        console.log("Passed Document ID : ", cropId);

        const cropDataDocRef = doc(db, "Crops", cropId as string);
        const cropDataDocSnapshot = await getDoc(cropDataDocRef);

        if (cropDataDocSnapshot.exists()) {
          const rawData = {
            cropId: cropDataDocSnapshot.id || "",
            thumbnail: cropDataDocSnapshot.data().cropCover || " ",
            scientificName: cropDataDocSnapshot.data().scientificName || " ",
            commonName: cropDataDocSnapshot.data().cropName || " ",
            family: cropDataDocSnapshot.data().family || " ",
            growthTime: cropDataDocSnapshot.data().growthTime || " ",
            bestSeason: cropDataDocSnapshot.data().bestSeason || " ",
            soilType: cropDataDocSnapshot.data().cropCover || [],
            soilPh: cropDataDocSnapshot.data().soilPh || "",
            commonPests: cropDataDocSnapshot.data().pests || [],
            commonDiseases: cropDataDocSnapshot.data().diseases || [],
            content: cropDataDocSnapshot.data().contents || [],
            sessionId: cropDataDocSnapshot.data().SessionId || "",
            reference:cropDataDocSnapshot.data().reference ?? []
          };

          console.log("Done Fetching Data : ", rawData);
          setCropData(rawData);
        } else {
          setCropData(null); // explicit "not found"
        }
      } catch (err) {
        console.error(err);
        setCropData(null);
      } finally {
        setLoading(false); // ✅ always stop loading
      }
    };


    const fetchPlots = async()=> {
      console.log('fetching plots')

      try{
        console.log('fetching plots 1')
        const ref = doc(db,"Plots",user?.PlotsRefId as string);

        const docSnap = await getDoc(ref);

        if(docSnap.exists()){
    

          const rawData = docSnap.data().Plots as any[];

          const filteredPlots: PlotData[] = rawData
          .filter(crop => !crop.CurrentCrops?.CropAssocId) // Check if CropAssocId is null or empty
          .map(crop => ({
            PlotName: crop.PlotName,
            PlotId: crop.PlotId
          }));

          console.log('fetching plots 2 success')
          setPlots({plot:filteredPlots})

          console.log(filteredPlots)


        }


      }catch(err){console.error(err)}
    }

    const FetchTemp = async () => {
      try {
        
          const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=15.3066&longitude=120.8564&hourly=temperature_2m&timezone=Asia/Manila');
          const data = await response.json();
          console.log(data);
  
          // get current hour
          const currentHour = new Date().getHours();
  
          // find index of the current hour in the API
          const currentHourIndex = data.hourly.time.findIndex((time: string) => {
              return new Date(time).getHours() === currentHour;
          });
  
          // get the temperature of the current hour
          const currentTemp: number = data.hourly.temperature_2m[currentHourIndex];
  
          setCurrentTemp(currentTemp); // This is now only the current temperature
  
          console.log("Current Temperature (°C):", currentTemp);
          
      } catch (err) {
          console.log(err);
      } finally {
          
      }
  }


    fetchCropDataFromFirebase()
    setAssocPlot(PlotAssoc)
    fetchPlots()
    FetchTemp()


    console.log(localCropData)
    console.log(cropName)

  },[cropName])



  /* Legacy use effect*/
  
 
  useEffect(() => {
    console.log("Updated localCropData", localCropData);


    if(cropData?.commonPests){
      const pests = cropData.commonPests.map((pest,index)=>({
        id:(index + 1).toString(),
        name:pest.pestName
      }));
      setLocalPestData(pests)
    }


    if(cropData?.commonDiseases){
      const disease = cropData.commonDiseases.map((disease,index)=>({
        id:(index+1).toString(),
        name:disease.diseaseName
      }))
      setLocalDiseaseData(disease)
    }

    
    if(Object.values(localCropData)[0]?.commonPests){
      const pests = Object.values(localCropData)[0]?.commonPests.map((pest, index) => ({
        id: (index + 1).toString(),
        name: pest
      }));
      setLocalPestData(pests);
    }

    if(Object.values(localCropData)[0]?.commonPests){
      const disease = Object.values(localCropData)[0]?.commonDiseases.map((disease, index) => ({
        id: (index + 1).toString(),
        name: disease
      }))
      setLocalDiseaseData(disease)
    }
     
 
 

  }, [cropData]);
  


  //select crop data

  
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);



  // Select Plot

  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [selectedPlotAssoc, setSelectedPlotAssoc] = useState<string | null>(null);

  // start of modal dialog handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const [dialogVisible,setDialogVisible] = useState(false);
  const [dialogDeleteVisible,setDialogDeleteVisible] = useState(false);
  const [dialogRemoveVisible,setDialogRemoveVisible] = useState(false);


  const showDialog = (plotNumber:any, newPlotAssoc:any) => {
    setSelectedPlot(plotNumber);
    setSelectedPlotAssoc(newPlotAssoc);
    console.log("Select plot name ", plotNumber, " Select plot assoc ", newPlotAssoc)
    setDialogVisible(true);
  };

  const showDeleteDialog = () => {
    setDialogDeleteVisible(true);
  }

  const showSuccessRemoveDialog = () => {
    setDialogRemoveVisible(true);
  }

  const hideDeleteDialog = () => {
    setDialogDeleteVisible(false);
  }

  const hideSuccessRemoveDialog = () => {
    setDialogRemoveVisible(false);
  }

  const hideDialog = () => {
    setDialogVisible(false);
  };

  // end of Dialog Handlers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


  
  //read / write to firebase

  const setPlotToCurrentCrop = async(plotAssoc:string,plotName:string)=>{
    console.log("Plot name param passed : ", plotName)
    console.log("Plot assoc id param passed : ", plotAssoc)
    try{

      console.log("Session Id to target : ", cropData?.sessionId)

     
      const cropRef = doc(db,"CurrentCrops",user?.CurrentCropsRefId as string);
      const cropRefSnap = await getDoc(cropRef);


      const currentCrop = cropRefSnap.data()?.CurrentCrops as any[];
      console.log("Current crops data before setting plotname is : ",currentCrop,)
      const updatedCrops = currentCrop.map(crop => 
        crop.SessionId === sessionId
          ? { ...crop, PlotAssoc: plotAssoc, PlotName:plotName } 
          : crop
      );

      console.log("Updated Crops is : ", updatedCrops)

      
      // Update Firestore with the modified array
      await updateDoc(cropRef, { CurrentCrops: updatedCrops });
      setAssocPlot(plotName);
      setTempCropName(plotName)
    }catch(err){
      console.error(err)
    }
  }


  const setCurrentCropToPlot = async (cropId: string, cropName: string, cropAssocId: string, targetPlotId: string,cropCover:string) => {
    try {
      const plotRef = doc(db, "Plots", user?.PlotsRefId as string);
      const plotDoc = await getDoc(plotRef);
  
      if (plotDoc.exists()) {
        let plotsArray = plotDoc.data().Plots || []; // Ensure it's an array
  
        // Find the index of the plot to update
        const plotIndex = plotsArray.findIndex((plot: any) => plot.PlotId === targetPlotId);
  
        if (plotIndex !== -1) {
          const updatedPlots = [...plotsArray]; // Create a copy of the array
  
          updatedPlots[plotIndex] = {
            ...updatedPlots[plotIndex],
            CurrentCrops: {
              CropId: cropId,
              CropName: cropName,
              CropAssocId: cropAssocId,
              CropCover:cropCover
            }
          };
  
          // Update the whole array in Firestore
          await updateDoc(plotRef, { Plots: updatedPlots });
        }
      }
    } catch (err) {
      console.log("Error updating plot:", err);
    } finally {
      console.log("Updated plot");
    }
  };

  const setPlotFun = async(plotId:any,plotName:any,cropId:any,cropName:any,cropSessionId:any)=> {
    


    try{
      

      await setCurrentCropToPlot(cropId,cropName,cropSessionId,plotId,cropData?.thumbnail as string)

      await setPlotToCurrentCrop(plotId,plotName)
      setDialogVisible(false)
      console.log("Updated plot and crop")
      hideDialog

    }catch(err){
      console.log(err)
    }
  }


  const checkSelectedPest = () => {

    console.log(selectedItems)
    console.log(selectedPestnames)
  }

/*
  const logData = async(cropNameParam:any,plotAssocParam:any)=> {

    console.log("Selected pest name : ", selectedPestnames)

    console.log("Logging Data....")
    hideEntryPosteDialog()


    try{

      if(selectedPestnames.length === 0) return


      const cropName = cropNameParam;
      const date = new Date().toISOString().slice(0, 10);
      const plotAssocId = plotAssocParam


      const pestLogEntries = selectedPestnames.map((pest)=> ({
        Pestname:pest,
        Date:date,
        CropName:cropName,
        Temp:currentTemp
      }))

      console.log("New Pest log entry check : ", pestLogEntries)




      const docRef = doc(db, "Records", user?.RecordsRefId as string);
      const docSnap = await getDoc(docRef);


      if(!docSnap.exists()){
          console.log("document not found")
        return;
      }



      const data = docSnap.data();
      console.log("Returned Data : ", data)
      const existingLogs = data?.PestLogs || [];

      const existingFertsLogs = data?.FertilizerLogs || []
      console.log("existing Logs : ", existingLogs  )
      console.log("existing Fertilizer Logs : ", existingFertsLogs)




      //for pest
      const logIndex = existingLogs.findIndex(
        (log:any) => log.PlotAssocId === plotAssocParam
      )

      if(logIndex !== -1){
        existingLogs[logIndex].PlotPestLog = [
          ...(existingLogs[logIndex].PlotPestLog || []),
          ...pestLogEntries
        ]
      }

      //for Fertilizer

      if(selectedFertilizer && amountFertilzer && selectedApplication){
        console.log("SelectedFertilizer is not empty commencing log modification......")


        const newFertilizerRecord = {
          DateApplied:date,
          cropName:cropName,
          fertilizerType: selectedFertilizer,
          fertilizerAmmount:amountFertilzer,
          selectedApplication:selectedApplication,
        }
        console.log(newFertilizerRecord)


        const fertilizerLogIndex = existingFertsLogs.findIndex(
          (log:any) => log.PlotAssocId === plotAssocParam
        )

      }


      
      await updateDoc(docRef,{
        PestLogs:existingLogs
      })



    }catch(err){
      console.log(err)
    }finally{
      console.log("updated META")
      showEntrySuccessDialog()
    }
  }
*/




  /*--- Log Data [LEGACY]*/


  /* 
  const logData = async(cropNameParam:any,plotAssocParam:any)=>{

    console.log("Logging Data...");
    hideEntryPosteDialog();
    setLogProcess(true)


    const cropName = cropNameParam;
    const plotAssocId = plotAssocParam;
    const date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }).slice(0, 10);
    console.log("Date is " , date)

    try{

      const docRef = doc(db, "Records", user?.RecordsRefId as string);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log("Document not found");
        return;
      }


      const data = docSnap.data();
      const existingPestLogs = data?.PestLogs || [];
      const existingDiseaseLogs = data?.DiseaseLogs || [];
      const existingFertilizerLogs = data?.FertilizerLogs || [];

      console.log("Fetched Existing Fertilizer Logs : ",existingFertilizerLogs,)
      console.log("Fetched From Assoc Id of : ",plotAssocId)
      let updatePayload: any = {};


      // ===== Pest Logging =====
      if (selectedPestnames && selectedPestnames.length > 0) {
        console.log("Selected pest names:", selectedPestnames);

        const pestLogEntries = selectedPestnames.map((pest) => ({
          Pestname: pest,
          Date: date,
          CropName: cropName,
          Temp: currentTemp,
        }));

        const pestLogIndex = existingPestLogs.findIndex(
          (log: any) => log.PlotAssocId === plotAssocId
        );

        if (pestLogIndex !== -1) {
          existingPestLogs[pestLogIndex].PlotPestLog = [
            ...(existingPestLogs[pestLogIndex].PlotPestLog || []),
            ...pestLogEntries,
          ];
        } else {
          existingPestLogs.push({
            PlotAssocId: plotAssocId,
            PlotPestLog: pestLogEntries,
          });
        }

        updatePayload.PestLogs = existingPestLogs;
      }

      //======Disease Logging ======
      if(selectedDiseaseNames && selectedDiseaseNames.length > 0) {
        console.log('Selected Disease names : ', selectedDiseaseNames)


        const diseaseLogEntries = selectedDiseaseNames.map((disease)=>({
          Diseasename : disease,
          Date:date,
          CropName:cropName,
          Temp:currentTemp
        }))
        
        const diseaseLogIndex = existingDiseaseLogs.findIndex(
          (log:any) => log.PlotAssocId === plotAssocId
        );

        if(diseaseLogIndex !== -1){
          existingDiseaseLogs[diseaseLogIndex].PlotDiseaseLog = [
            ...(existingDiseaseLogs[diseaseLogIndex].PlotDiseaseLog || []),
            ...diseaseLogEntries,
          ];
        } else {
          existingDiseaseLogs.push({
            PlotAssocId: plotAssocId,
            PlotDiseaseLog: diseaseLogEntries
          })
        }

        updatePayload.DiseaseLogs = existingDiseaseLogs


      }



      // ===== Fertilizer Logging =====
      if (selectedFertilizer && amountFertilzer && selectedApplication) {
        console.log("Fertilizer logging data filled");
  
        const newFertilizerEntry = {
          DateApplied: date,
          cropName: cropName,
          fertilizerType: selectedFertilizer,
          fertilizerAmmount: amountFertilzer,
          selectedApplication: selectedApplication,
        };

        console.log("New fert entry : ", newFertilizerEntry)
  
        const fertLogIndex = existingFertilizerLogs.findIndex(
          (log: any) => log.PlotAssocId === plotAssocId
        );
        

        console.log("Targeted Fertilzer Plot : ", existingFertilizerLogs[fertLogIndex])
        if (fertLogIndex !== -1) {
          existingFertilizerLogs[fertLogIndex].FertilizerApplications = [
            ...(existingFertilizerLogs[fertLogIndex].FertilizerApplications || []),
            newFertilizerEntry,
          ];
        } else {
          existingFertilizerLogs.push({
            PlotAssocId: plotAssocId,
            FertilizerApplications: [newFertilizerEntry],
          });
        }
  
        updatePayload.FertilizerLogs = existingFertilizerLogs;
      }


      console.log("Payload check : ", updatePayload)
      // ===== Update DB Only If Needed =====
      if (Object.keys(updatePayload).length > 0) {
        await updateDoc(docRef, updatePayload);
        console.log("Data successfully updated:", updatePayload);

      } else {
        console.log("No data to log. All fields empty.");
      }

      
      setLogProcess(false)



    }catch(err){console.error(err)}finally {
      console.log("Logging finished");
      showEntrySuccessDialog();
      setLogProcess(false)

    }


  }*/


  const logData = async (cropNameParam: any, plotAssocParam: any) => {
    console.log("Logging Data...");
    hideEntryPosteDialog();
    setLogProcess(true);

    const cropName = cropNameParam;
    const plotAssocId = plotAssocParam;
    const date = new Date()
      .toLocaleDateString("en-CA", { timeZone: "Asia/Manila" })
      .slice(0, 10);

    console.log("Date is ", date);

    try {
      const docRef = doc(db, "Records", user?.RecordsRefId as string);

      // Wrap everything in Promise.race
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("slowInternetError")), 20000)
      );

      const loggingPromise = (async () => {
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.log("Document not found");
          return;
        }

        const data = docSnap.data();
        const existingPestLogs = data?.PestLogs || [];
        const existingDiseaseLogs = data?.DiseaseLogs || [];
        const existingFertilizerLogs = data?.FertilizerLogs || [];

        let updatePayload: any = {};

        // ===== Pest Logging =====
        if (selectedPestnames && selectedPestnames.length > 0) {
          const pestLogEntries = selectedPestnames.map((pest) => ({
            Pestname: pest,
            Date: date,
            CropName: cropName,
            Temp: currentTemp,
          }));

          const pestLogIndex = existingPestLogs.findIndex(
            (log: any) => log.PlotAssocId === plotAssocId
          );

          if (pestLogIndex !== -1) {
            existingPestLogs[pestLogIndex].PlotPestLog = [
              ...(existingPestLogs[pestLogIndex].PlotPestLog || []),
              ...pestLogEntries,
            ];
          } else {
            existingPestLogs.push({
              PlotAssocId: plotAssocId,
              PlotPestLog: pestLogEntries,
            });
          }

          updatePayload.PestLogs = existingPestLogs;
        }

        // ===== Disease Logging =====
        if (selectedDiseaseNames && selectedDiseaseNames.length > 0) {
          const diseaseLogEntries = selectedDiseaseNames.map((disease) => ({
            Diseasename: disease,
            Date: date,
            CropName: cropName,
            Temp: currentTemp,
          }));

          const diseaseLogIndex = existingDiseaseLogs.findIndex(
            (log: any) => log.PlotAssocId === plotAssocId
          );

          if (diseaseLogIndex !== -1) {
            existingDiseaseLogs[diseaseLogIndex].PlotDiseaseLog = [
              ...(existingDiseaseLogs[diseaseLogIndex].PlotDiseaseLog || []),
              ...diseaseLogEntries,
            ];
          } else {
            existingDiseaseLogs.push({
              PlotAssocId: plotAssocId,
              PlotDiseaseLog: diseaseLogEntries,
            });
          }

          updatePayload.DiseaseLogs = existingDiseaseLogs;
        }

        // ===== Fertilizer Logging =====
        if (selectedFertilizer && amountFertilzer && selectedApplication) {
          const newFertilizerEntry = {
            DateApplied: date,
            cropName: cropName,
            fertilizerType: selectedFertilizer,
            fertilizerAmmount: amountFertilzer,
            selectedApplication: selectedApplication,
          };

          const fertLogIndex = existingFertilizerLogs.findIndex(
            (log: any) => log.PlotAssocId === plotAssocId
          );

          if (fertLogIndex !== -1) {
            existingFertilizerLogs[fertLogIndex].FertilizerApplications = [
              ...(existingFertilizerLogs[fertLogIndex].FertilizerApplications ||
                []),
              newFertilizerEntry,
            ];
          } else {
            existingFertilizerLogs.push({
              PlotAssocId: plotAssocId,
              FertilizerApplications: [newFertilizerEntry],
            });
          }

          updatePayload.FertilizerLogs = existingFertilizerLogs;
        }

        // ===== Update DB =====
        if (Object.keys(updatePayload).length > 0) {
          await updateDoc(docRef, updatePayload);
          console.log("Data successfully updated:", updatePayload);
        } else {
          console.log("No data to log. All fields empty.");
        }
      })();

      await Promise.race([loggingPromise, timeoutPromise]);

      showEntrySuccessDialog();
    } catch (err: any) {
      if (err.message === "slowInternetError") {
        console.error("⚠️ Logging failed due to slow internet.");
        // optional: trigger a UI warning dialog
        setShowInternetError(true)
      } else {
        setShowError(true)
      }
    } finally {
      console.log("Logging finished");
      setLogProcess(false);
    }
  };



  const renderDialog = (plotId:any,plotName:any,cropId:any,cropName:any,cropSessionId:any) => (
  <Portal>
    <Dialog visible={dialogVisible} onDismiss={hideDialog}>
      <Dialog.Title>
        {language === "en" ? "Assign to Plot?" : "Italaga sa Plot?"}
      </Dialog.Title>

      <Dialog.Content>
        <Text>
          {language === "en"
            ? `Assign to plot #${selectedPlot}?`
            : `Italaga sa plot #${selectedPlot}?`}
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={hideDialog}>
          {language === "en" ? "Cancel" : "Kanselahin"}
        </Button>
        <Button
          onPress={() => setPlotFun(plotId, plotName, cropId, cropName, cropSessionId)}
        >
          {language === "en" ? "OK" : "Sige"}
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
  );
  const renderConfirmationDeletion = (plotAssoc:any,sessionId:any) => (
    <Portal>
      <Dialog visible={dialogDeleteVisible} onDismiss={hideDeleteDialog}>
        <Dialog.Title>
          {language === "en" ? "Remove Crop?" : "Alisin ang Pananim?"}
        </Dialog.Title>

        <Dialog.Content>
          <Text>
            {language === "en"
              ? `Do you really want to remove ${cropName} from your tracklist?`
              : `Gusto mo bang alisin ang ${cropName} mula sa iyong talaan ng mga pananim?`}
          </Text>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={hideDeleteDialog}>
            {language === "en" ? "Cancel" : "Kanselahin"}
          </Button>
          <Button onPress={() => deleteCurrentCrop(plotAssoc, sessionId)}>
            {language === "en" ? "Confirm" : "Kumpirmahin"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

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

  const renderSlowInternet = () => (
    <Portal>
        <Dialog visible={showInternetError} onDismiss={()=>setShowInternetError(false)}>

            <Dialog.Icon  icon="alert-circle" size={60} color='#ef9a9a'/>

            <Dialog.Title>
                <Text style={{color:'#37474F'}}>
                    {language === "en" ? "Slow Connection" : "Mabagal na Koneksyon"}
                </Text>
            </Dialog.Title>
            
            <Dialog.Content>
                <Text style={{color:'#475569'}}>
                    {language === "en" ? "Connection seems slow. Please try again." : "Mabagal ang koneksyon. Pakisubukang muli."}
                </Text>
            </Dialog.Content>

            <Dialog.Actions>
                <TouchableOpacity onPress={()=> setShowInternetError(false)} style={{borderColor:'#607D8B',borderWidth:1,alignSelf:'flex-start',backgroundColor:'#607D8B',paddingLeft:20,paddingRight:20,paddingTop:5,paddingBottom:5,borderRadius:5}}>
                    <Text style={{color:'white',fontSize:16,fontWeight:500}}>
                        {language === "en" ? "OK" : "Sige"}
                    </Text>
                </TouchableOpacity>
            </Dialog.Actions>

        </Dialog>
    </Portal>
  )


  const [dialogEntryVisible,setDialogEntryVisible] = useState(false)
  const [dialogEntrySuccessVisible,setDialogEntrySuccessVisible] = useState(false)


  const hideEntryPosteDialog = () => {
    setDialogEntryVisible(false)
  }
  const showEntryDialog = () => {
   setDialogEntryVisible(true)
  };
  const showEntrySuccessDialog = () => {
    setDialogEntrySuccessVisible(true)
  }
  const hideEntrySuccessDialog = () => {
    setDialogEntrySuccessVisible(false)
  }
  const renderConfirmationLogEntry= (cropName:any,plotAssoc:any) => (
    <Portal>
      <Dialog visible={dialogEntryVisible} onDismiss={hideEntryPosteDialog}>
        <Dialog.Title>
          {language === "en" ? "Log Entry?" : "I-log ang Entry?"}
        </Dialog.Title>

        <Dialog.Content>
          <Text>
            {language === "en"
              ? "Do you really want to log this entry to your plot record?"
              : "Sigurado ka bang gusto mong i-log ang entry na ito sa iyong talaan ng plot?"}
          </Text>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={hideEntryPosteDialog}>
            {language === "en" ? "Cancel" : "Kanselahin"}
          </Button>
          <Button onPress={() => logData(cropName, plotAssoc)}>
            {language === "en" ? "Confirm" : "Kumpirmahin"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
  const renderSuccessLogEntry= () => (
    <Portal>
      <Dialog visible={dialogEntrySuccessVisible} onDismiss={() => {}}>
        <Dialog.Title>
          {language === "en" ? "Log Entry Success!" : "Matagumpay ang Pag-log ng Entry!"}
        </Dialog.Title>

        <Dialog.Content>
          <Text>
            {language === "en"
              ? "Your log entry has been successfully recorded."
              : "Matagumpay na naitala ang iyong log entry."}
          </Text>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={hideEntrySuccessDialog}>
            {language === "en" ? "Continue" : "Magpatuloy"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
  const renderDeleteSuccess = () => (

    <Portal>
      <Dialog visible={dialogRemoveVisible} onDismiss={() => {}}>
        <Dialog.Icon icon="check" />
        <Dialog.Title>
          {language === "en" ? "Remove Success" : "Matagumpay na Naalis"}
        </Dialog.Title>

        <Dialog.Content>
          <Text>
            {language === "en"
              ? `${cropName} has been successfully removed from your tracklist.`
              : `Matagumpay na naalis ang ${cropName} mula sa iyong tracklist.`}
          </Text>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={() => {router.back()}}>
            {language === "en" ? "Go Back" : "Bumalik"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

  )
  const deleteCurrentCrop = async(plotAssoc:any,sessionId:any)=>{


    console.log("session id of the crop : ", sessionId)

    try{
      const cropRef = doc(db, "CurrentCrops", user?.CurrentCropsRefId as string); // Change this to your actual document ID
      const cropDoc = await getDoc(cropRef);


      
  
      if (cropDoc.exists()) {
        const currentCrops = cropDoc.data().CurrentCrops || []; // Ensure it's an array
  
        // Filter out the object with the matching sessionId
        const updatedCrops = currentCrops.filter((crop: any) => crop.SessionId !== sessionId);
  
        // Update Firestore with the modified array
        await updateDoc(cropRef, { CurrentCrops: updatedCrops });
  
        console.log("Crop deleted successfully!");


      
      } else {
        console.log("Document does not exist!");
      }


      
      //remove currentCrop if the crop is assigned to a plot

      if(plotAssoc !== null){


        const plotRef = doc(db, "Plots", user?.PlotsRefId as string);
        const plotDoc = await getDoc(plotRef);
    
        if (plotDoc.exists()) {
          let plotsArray = plotDoc.data().Plots || []; // Ensure it's an array
    
          // Find the index of the plot to update
          const plotIndex = plotsArray.findIndex((plot: any) => plot.PlotId === PlotAssoc);
    
          if (plotIndex !== -1) {
            const updatedPlots = [...plotsArray]; // Create a copy of the array
    
            updatedPlots[plotIndex] = {
              ...updatedPlots[plotIndex],
              CurrentCrops: {
                CropId: null,
                CropName: null,
                CropAssocId: null,
                CropCover:null
              }
            };
    
            // Update the whole array in Firestore
            await updateDoc(plotRef, { Plots: updatedPlots });
          }
        }



      }

    }catch(err){
      console.error(err)
    }finally{
      console.log("Deleted crop success META")
      setDialogDeleteVisible(false)
      setDialogRemoveVisible(true)
    }
  }
  const deleteCurrentCropNoModal = async(plotAssoc:any,sessionId:any)=>{
        console.log("session id of the crop : ", sessionId)

    try{
      const cropRef = doc(db, "CurrentCrops", user?.CurrentCropsRefId as string); // Change this to your actual document ID
      const cropDoc = await getDoc(cropRef);


      
  
      if (cropDoc.exists()) {
        const currentCrops = cropDoc.data().CurrentCrops || []; // Ensure it's an array
  
        // Filter out the object with the matching sessionId
        const updatedCrops = currentCrops.filter((crop: any) => crop.SessionId !== sessionId);
  
        // Update Firestore with the modified array
        await updateDoc(cropRef, { CurrentCrops: updatedCrops });
  
        console.log("Crop deleted successfully!");


      
      } else {
        console.log("Document does not exist!");
      }


      
      //remove currentCrop if the crop is assigned to a plot

      if(plotAssoc !== null){


        const plotRef = doc(db, "Plots", user?.PlotsRefId as string);
        const plotDoc = await getDoc(plotRef);
    
        if (plotDoc.exists()) {
          let plotsArray = plotDoc.data().Plots || []; // Ensure it's an array
    
          // Find the index of the plot to update
          const plotIndex = plotsArray.findIndex((plot: any) => plot.PlotId === PlotAssoc);
    
          if (plotIndex !== -1) {
            const updatedPlots = [...plotsArray]; // Create a copy of the array
    
            updatedPlots[plotIndex] = {
              ...updatedPlots[plotIndex],
              CurrentCrops: {
                CropId: null,
                CropName: null,
                CropAssocId: null,
                CropCover:null
              }
            };
    
            // Update the whole array in Firestore
            await updateDoc(plotRef, { Plots: updatedPlots });
          }
        }
      
        router.back()

      }

    }catch(err){
      console.error(err)
    }
  }
  const displayCropData = ()=> {
    console.log("plots : ", plots)
  }
  const displayPestData = ()=>{
    console.log("Pest List :",localPestData)
  }
  if (isLoading) {
    // Return loading screen
    return (
      <SafeAreaView style={[styles.mainContainer,{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}]}>
        <ActivityIndicator size="large" color="#607D8B" />
        <Text>Loading crop data...</Text>
      </SafeAreaView>
    );
  }
  if (!cropData && !isLoading) {
    // Return fallback screen (data not found)
    return (
      <SafeAreaView style={styles.mainContainer}>

          <View style={styles.headerContainer}>

            <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10}} onPress={()=> router.back()}>

                <Ionicons name="arrow-back" size={30} color="black" />

            </TouchableOpacity>
   
        </View>

        <View style={stylesDataDoesntExist.wrapper}>
          <MaterialIcons name="error-outline" size={28} color="#E63946" />
          <Text style={stylesDataDoesntExist.primaryText}>
            This crop data is no longer available
          </Text>
          <Text style={stylesDataDoesntExist.secondaryText}>
            It may have been removed or not found.
          </Text>

          <TouchableOpacity style={stylesDataDoesntExist.actionWrapper} 
              onPress={()=>deleteCurrentCropNoModal(PlotAssoc,sessionId)}>
              <Text style={stylesDataDoesntExist.actionText}>Delete from your tracklist</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    );
  }

  return (


    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >

    <PaperProvider>


    <SafeAreaView style={styles.mainContainer}>

      {renderDialog(selectedPlotAssoc,selectedPlot,cropId,cropName,sessionId)}
      {renderConfirmationDeletion(PlotAssoc,sessionId)}
      {renderDeleteSuccess()}
      {renderConfirmationLogEntry(cropName,PlotAssoc)}
      {renderSuccessLogEntry()}
      {renderError()}
      {renderSlowInternet()}

      {isLoading ? (
        <View >
          <Text>Loading...</Text>
        </View>
        ) : (
        <> 

        <View style={styles.headerContainer}>

          <View style={[styles.headerContainerTop,{width:'100%',borderWidth:1,}]}>

            <TouchableOpacity style={{alignSelf:'flex-start',marginLeft:10}} onPress={()=> router.back()}>

                <Ionicons name="arrow-back" size={30} color="black" />

            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDialogDeleteVisible(true)} style={{marginLeft:'auto',alignSelf:'flex-start'}}><AntDesign name="delete" size={24} color="red" style={{marginLeft:'auto',marginRight:20}} /></TouchableOpacity>

          </View>


          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <TouchableOpacity
              style={styles.segmentButton}
              onPress={() => handleSegmentChange('CareGuide')}
            >
              <Text
                style={[
                  styles.segmentText,
                  selectedOption === 'CareGuide' && styles.activeText,
                ]}
              >
                {language === "en" ? "Care Guide" : "Pangangalaga"}
              </Text>
              {selectedOption === 'CareGuide' && <View style={styles.activeLine} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.segmentButton}
              onPress={() => handleSegmentChange('Management')}
            >
              <Text
                style={[
                  styles.segmentText,
                  selectedOption === 'Management' && styles.activeText,
                ]}
              >
                {language === "en" ? "Logs" : "Pagtatala"}
              </Text>
              {selectedOption === 'Management' && <View style={styles.activeLine} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.segmentButton}
              onPress={() => handleSegmentChange('PestAndDiseases')}
            >
              <Text
                style={[
                  styles.segmentText,
                  selectedOption === 'PestAndDiseases' && styles.activeText,
                ]}
              >
                
                {language === "en" ? "Pest And Diseases" : "Peste At Sakit"}
              </Text>
              {selectedOption === 'PestAndDiseases' && <View style={styles.activeLine} />}
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.segmentButton}
              onPress={() => handleSegmentChange('Sources')}
            >
              <Text
                style={[
                  styles.segmentText,
                  selectedOption === 'Sources' && styles.activeText,
                ]}
              >
                Sources
              </Text>
              {selectedOption === 'Sources' && <View style={styles.activeLine} />}
            </TouchableOpacity>
          </ScrollView>

        </View>
        
        
        

       {selectedOption === 'CareGuide' && 
       
       
        <ScrollView style={styles.contentWrapper} contentContainerStyle={{borderWidth:0,display:'flex'}}>

          <View  style={styles.Thumbnail}>
            <Image source={{ uri:cropData?.thumbnail }} style={{width:'100%',height:'100%',alignSelf: 'stretch'}} resizeMode="cover" />


          </View>


         


          <View style={styles.headerWrapper} >

            <View style={styles.nameWrapper}>
              <Text style={styles.cropName}>{cropData?.commonName || 'Loading...'}</Text>
              <Text style={styles.scientificName}>({cropData?.scientificName})</Text>
              
              
            </View>

              

              <View style={{
                  borderWidth:1,
                  padding:8,
                  display:'flex',
                  flexDirection:'row',
                  backgroundColor:'#FAFAFA',
                  borderRadius:16,
                  borderColor:'#e2e8f0',
                  alignItems:'center',
                  gap:8,
              }}>
                  <View style={{
                      width:40,
                      height:40,
                      borderWidth:0,
                      backgroundColor:'#E3E3E3',
                      borderRadius:8,
                      display:'flex',
                      flexDirection:'column',
                      alignItems:'center',
                      justifyContent:'center'
                  }}>
                      <Feather name="tag" size={20} color="#475569" />
                  </View>

                  <View style={{
                      display:'flex',
                      flexDirection:'column',
                  }}>
                      <Text style={{fontSize:15,fontWeight:600,color:'#475569'}}>
                          {language === "en" ? "Family" : "Pangkat ng Halaman"}
                      </Text>
                      <Text style={{fontSize:16,fontWeight:400,color:'#787C88'}}>
                          {cropData?.family}
                      </Text>
                  </View>
              </View>



              <View style={{
                  borderWidth:1,
                  padding:8,
                  display:'flex',
                  flexDirection:'row',
                  backgroundColor:'#FAFAFA',
                  borderRadius:16,
                  borderColor:'#e2e8f0',
                  alignItems:'center',
                  gap:8,
              }}>
                  <View style={{
                      width:40,
                      height:40,
                      borderWidth:0,
                      backgroundColor:'#E3E3E3',
                      borderRadius:8,
                      display:'flex',
                      flexDirection:'column',
                      alignItems:'center',
                      justifyContent:'center'
                  }}>
              
                      <Entypo name="cycle" size={20} color="#475569" />
                  </View>

                  <View style={{
                      display:'flex',
                      flexDirection:'column',
                  }}>
                      <Text style={{fontSize:15,fontWeight:600,color:'#475569'}}>
                          {language === "en" ? "Maturity Period" : "Panahon ng Paglaki"}
                      </Text>
                      <Text style={{fontSize:16,fontWeight:400,color:'#787C88'}}>
                          {cropData?.growthTime}
                      </Text>
                  </View>
              </View>




              <View style={{
                  borderWidth:1,
                  padding:8,
                  display:'flex',
                  flexDirection:'row',
                  backgroundColor:'#FAFAFA',
                  borderRadius:16,
                  borderColor:'#e2e8f0',
                  alignItems:'center',
                  gap:8,
              }}>
                  <View style={{
                      width:40,
                      height:40,
                      borderWidth:0,
                      backgroundColor:'#E3E3E3',
                      borderRadius:8,
                      display:'flex',
                      flexDirection:'column',
                      alignItems:'center',
                      justifyContent:'center'
                  }}>
                      <FontAwesome6 name="mound" size={20} color="#475569" />
                  
                  </View>

                  <View style={{
                      display:'flex',
                      flexDirection:'column',
                  }}>
                      <Text style={{fontSize:15,fontWeight:600,color:'#475569'}}>
                          {language === "en" ? "Optimal Soil pH" : "Pinakamainam na pH ng Lupa"}
                      </Text>
                      <Text style={{fontSize:16,fontWeight:400,color:'#787C88'}}>
                          {cropData?.soilPh}
                      </Text>
                  </View>
              </View>




            <View>

              {assocPlot && assocPlot !== "null" ?(

                <View style={styles.BadgeWrapper}>
                  <Text style={styles.BadgeText}>{tempCropName || PlotName}</Text>
                </View>
               
              ):(

                <Menu
                  visible={visible}
                  onDismiss={closeMenu}
                  anchor={
                    <TouchableOpacity style={stylesButtons.plotAssign} onPress={openMenu}>
                      <Text>Not assigned to any plot</Text>
                    </TouchableOpacity>
                  }
                >

                  
                  {plots.plot.length === 0 ? (<Menu.Item title="No plots found" />  ) : (


                    plots.plot.map((item, index) => (
                      <Menu.Item key={index} onPress={() => {
                        closeMenu()
                        showDialog(item.PlotName, item.PlotId)}} title={item.PlotName}  />
                    ))

                  )}



                </Menu>


              ) }


    
            </View>


          </View>





          {cropData?.content && cropData.content.length > 0 && cropData.content.map((content,index)=>(

              <View key={index} style={stylesCollapsible.collapseWrapper}>
              <TouchableOpacity onPress={() => setIsCollapsed(index)}>
                <Text style={stylesCollapsible.header}>{content.header}</Text>
              </TouchableOpacity>

              <Collapsible collapsed={isCollapsed !== index}>
                <View>
                  <Text style={stylesCollapsible.contentText}>{content.content}</Text>
                </View>
              </Collapsible>
            </View>

          ))}





        </ScrollView>
       
       
       }


       {selectedOption === 'Management' && 




          
        
        <KeyboardAwareScrollView extraScrollHeight={100} style={styles.contentWrapper} contentContainerStyle={{alignItems:'center'}} nestedScrollEnabled={true}>


          <View style={stylesRecords.container}>

              <Text style={stylesRecords.header}>Progress Logging</Text>



              <View style={stylesRecords.inputWrapper}>


                <View style={stylesRecords.inputHeader}>
                  <View style={stylesRecords.iconWrapper}></View>
                  <Text style={stylesRecords.inputText}>{language === "en" ? "Spotted Pests" : "Mga Napansing Peste"}</Text>
                </View>

                <View style={{flex:1,borderWidth:0,width:'100%',padding:0}}>

                  <MultiSelect
                   
                    hideTags
                    items={localPestData}
                    uniqueKey="id"
                    ref={(component: any) => { multiSelectRef.current = component }}
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={selectedItems}
                    selectText="Select Pest(s)"
                    searchInputPlaceholderText={""}
                    onChangeInput={ (text: any)=> console.log(text)}
                    altFontFamily="ProximaNova-Light"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#CCC"
                    submitButtonText="Confirm"
           
                  />


                 <View style={stylesRecords.selectedItemsWrapper}>
                    {selectedItems.length > 0 ? (
                     selectedItems.map((item) => (

                        <View key={item} style={{ paddingTop:5,paddingBottom:5, paddingLeft:10,paddingRight:10, borderWidth:0,borderRadius:5,alignSelf: 'flex-start',marginRight:10,backgroundColor:'#FAD4D4'}}>
                          
                          <Text style={stylesRecords.selectedItemText} >
                            {localPestData.find((p) => p.id === item)?.name}
                          </Text>
                          
                        </View>

                      ))
                    ) : (
                      <Text style={{ color: '#CCC' }}>No Pest Selected</Text>
                    )}
                  </View>


                </View>

              </View>


              <View style={stylesRecords.inputWrapper}>


                <View style={stylesRecords.inputHeader}>
                  <View style={stylesRecords.iconWrapper}></View>
                  <Text style={stylesRecords.inputText}>{language === "en" ? "Spotted Diseases" : "Mga Napansing Sakit"}</Text>
                </View>

                <View style={{flex:1,borderWidth:0,width:'100%',padding:0}}>

                  <MultiSelect
                   
                    hideTags
                    items={localDiseaseData}
                    uniqueKey="id"
                    ref={(component: any) => { multiSelectRef.current = component }}
                    onSelectedItemsChange={onSelectedDiseaseChange}
                    selectedItems={selectedDiseases}
                    selectText="Select Disease(s)"
                    searchInputPlaceholderText={""}
                    onChangeInput={ (text: any)=> console.log(text)}
                    altFontFamily="ProximaNova-Light"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#CCC"
                    submitButtonText="Confirm"
           
                  />


                 <View style={stylesRecords.selectedItemsWrapper}>
                    {selectedDiseases.length > 0 ? (
                      selectedDiseases.map((item) => (

                        <View key={item} style={{ paddingTop:5,paddingBottom:5, paddingLeft:10,paddingRight:10, borderWidth:0,borderRadius:5,alignSelf: 'flex-start',marginRight:10,backgroundColor:'#FAD4D4'}}>
                          
                          <Text style={stylesRecords.selectedItemText} >
                            {localDiseaseData.find((p) => p.id === item)?.name}
                          </Text>
                          
                        </View>

                      ))
                    ) : (
                      <Text style={{ color: '#CCC' }}>No Pest Selected</Text>
                    )}
                  </View>


                </View>



                

              </View>






              <View style={[stylesRecords.inputWrapper,{display:'none'}]}>


                <View style={stylesRecords.inputHeaderNormal}>
                  <View style={stylesRecords.iconWrapper}></View>
                  <Text style={stylesRecords.inputText}>Applied Pesticide</Text>
                </View>

                <View style={{flex:1,borderWidth:0,width:'100%',padding:0}}>

                <TextInput
                  label=""
                  value={pesticide}
                  onChangeText={(text: React.SetStateAction<string>) => setPesticide(text)}
                  mode='flat'
                  style={{ backgroundColor: 'transparent' }}
                  theme={{ colors: { primary: '#2E6F40' } }}
                />

                </View>



                

              </View>


              <View style={stylesRecords.inputWrapperFertilizer}>


                <View style={stylesRecords.inputHeaderNormal}>
                  <View style={stylesRecords.iconWrapper}></View>
                  <Text style={stylesRecords.inputText}>{language === "en" ? "Applied Fertilizer" : "Ginamit na Pataba"}</Text>
                </View>

                <View style={{flex:1,borderWidth:0,width:'100%',paddingVertical:5}}>

                  {fertilizerData.map((fertilizer) => (
                    <View key={fertilizer.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton
                        value={fertilizer.name}
                        status={selectedFertilizer === fertilizer.name ? 'checked' : 'unchecked'}
                        onPress={() => {
                          if (selectedFertilizer === fertilizer.name) {
                            setSelectedFertilizer(''); // Deselect if already selected
                          } else {
                            setSelectedFertilizer(fertilizer.name); // Select new
                          }
                        }}
                      />
                      <Text>{fertilizer.name}</Text>
                    </View>
                  ))}







                <View style={{width:'100%',borderColor:'red',paddingVertical:5,display:"flex",flexDirection:'column'}}>
                    <View style={{width:'100%',paddingVertical:3,borderColor:'red',borderWidth:0,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                      <Text style={{fontSize:15,fontWeight:500,letterSpacing:.5}}>{language === "en" ? "Application Method:" : "Paraan ng Paglalapat:"}</Text>


                    </View>



                    <Picker
                      selectedValue={selectedApplication}
                      onValueChange={(itemValue) => setSelectedApplication(itemValue)}
                      style={styles.picker}
                      enabled={selectedFertilizer !== ''}
                      
                    >
                      {fertilizerApplicationData.map((application) => (
                        <Picker.Item key={application.id} label={application.name} value={application.name} />
                      ))}
                    </Picker>


                    <TextInput
                   
                    value={amountFertilzer}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    placeholder="Enter Applied amount (kg)"
                    style={{ backgroundColor: 'transparent' }}
                    theme={{ colors: { primary: '#2E6F40' } }}
                   
                    disabled={selectedFertilizer === ''}
                    />

                </View>


                



                </View>



                

              </View>




              <View style={[stylesRecords.inputWrapper,{display:'none'}]}>


                <View style={stylesRecords.inputHeaderNormal}>
                  <View style={stylesRecords.iconWrapper}></View>
                  <Text style={stylesRecords.inputText}>Observation Notes</Text>
                </View>


                <TextInput
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={100}
                  onChangeText={(text: string) => onChangeNotes(text)}
                  value={notes}
                  placeholder='Additional Observations....'
                  style={{width:'100%',backgroundColor: '#f0f0f0',borderRadius:5}}
                  theme={{ colors: { primary: '#2E6F40' } }}
                  
                />





              </View>





              

          </View>


          <Button style={{marginTop:20,marginBottom:20}} icon={() => <FontAwesomeIcon icon={faFileArrowDown} size={20} color="#FFFFFF" />} mode="contained-tonal" onPress={showEntryDialog} buttonColor="#2e6f40" textColor="#FFFFFF"
          
          disabled={assocPlot === null || assocPlot === "null" || logProcess}
          >
              Log Crop Data
          </Button>


        </KeyboardAwareScrollView>
       
       }



       {selectedOption==='PestAndDiseases' && 
       
       
       
        <ScrollView style={stylesAiles.contentWrapper} contentContainerStyle={{alignItems:'center'}}>

          <View style={stylesAiles.containerWrappperPest}>
              
              <View style={stylesAiles.containerWrapperHeader}>
                  <MaterialIcons name="pest-control" size={24} color="#842C2B" />
                  <Text style={stylesAiles.subContainerHeaderPest}>{language === "en" ? "Common Pests" : "Karaniwang Peste"}</Text>
              </View>


              <View style={stylesAiles.badgeContainer}>


                {cropData?.commonPests && cropData.commonPests.length > 0  ? cropData.commonPests.map((pest,index)=>(


                <TouchableOpacity style={stylesAiles.badgeWrapper} onPress={()=>{router.push(`/(screens)/DiseasePestScreen?pestName=${encodeURIComponent(pest.pestId)}`)}}>
                  
                  <View style={stylesAiles.badgeWrapper__imageWrapper}>
                    <Image source={{ uri:pest.pestCoverImage}} style={{objectFit:'cover',width:'100%',height:'100%', borderTopLeftRadius:3,borderTopRightRadius:3}}/>
                  </View>                      
                  
                  
                  <View style={stylesAiles.badgeWrapper__infoWrapper}>
                    <Text  style={stylesAiles.badgesText}>{pest.pestName}</Text>
                  </View>
                </TouchableOpacity>


                )): (
                    <View style={stylesAiles.noDataPlaceholder}>
                      <View style={stylesAiles.noDataPlaceholder__iconWrapper}>
                        <MaterialIcons name="pest-control" size={24} color="#64748B" />
                      </View>
                      
                      <Text style={stylesAiles.noDataPlaceholder__Primary}>No Disease Data Available</Text>
                      <Text style={stylesAiles.noDataPlaceholder__Secondary}>Disease information for this crop is currently being updated</Text>
                    </View>
                  )}


              </View>


        





          </View>




          <View style={stylesAiles.containerWrappperPest}>
              <View style={stylesAiles.containerWrapperHeader}>
                  <MaterialIcons name="pest-control" size={24} color="#842C2B" />
                  <Text style={stylesAiles.subContainerHeaderPest}>{language === "en" ? "Common Diseases" : "Karaniwang Sakit"}</Text>
              </View>


              <View style={stylesAiles.badgeContainer}>




                  {cropData?.commonDiseases && cropData.commonDiseases.length > 0 ? cropData.commonDiseases.map((disease,index)=>(

                    <TouchableOpacity  key={disease.diseaseId} style={stylesAiles.badgeWrapper} onPress={()=>{router.push(`/(screens)/DiseaseScreen?diseaseId=${encodeURIComponent(disease.diseaseId)}`)}} >
                      
                      <View style={stylesAiles.badgeWrapper__imageWrapper}>
                        <Image source={{ uri: disease.diseaseCoverImage}} style={{width:'100%',height:'100%', borderTopLeftRadius:3,borderTopRightRadius:3}}/>
                      </View>
                      
                      <View style={stylesAiles.badgeWrapper__infoWrapper}>
                        <Text  style={stylesAiles.badgesText}>{disease.diseaseName}</Text>
                      </View>
                      

                    </TouchableOpacity>


                  )) : (
                    <View style={stylesAiles.noDataPlaceholder}>
                      <View style={stylesAiles.noDataPlaceholder__iconWrapper}>
                        <MaterialIcons name="pest-control" size={24} color="#64748B" />
                      </View>
                      
                      <Text style={stylesAiles.noDataPlaceholder__Primary}>No Pest Data Available</Text>
                      <Text style={stylesAiles.noDataPlaceholder__Secondary}>Pest information for this crop is currently being updated</Text>
                    </View>
                  )}


         


              </View>


        





          </View>

        </ScrollView>
       
       
       
       
       
       }

       {selectedOption === "Sources" && 


        <ScrollView style={stylesAiles.contentWrapper} contentContainerStyle={{alignItems:'center'}}>

          <View style={[stylesAiles.containerWrappperPest,{borderWidth:0,}]}>
              <View style={[stylesAiles.containerWrapperHeader,{backgroundColor:'#DAEEF7',borderColor:'#53697E'}]}>
      
                  <AntDesign name="link" size={24} color="#53697E" />
                  <Text style={[stylesAiles.subContainerHeaderPest,{color:'#53697E'}]}>{language === "en" ? "Reference Links" : "Mga Pinagkunan ng Impormasyon"}</Text>
              </View>


              <View style={{width:'100%',backgroundColor:'white',
                paddingVertical:10,
                paddingHorizontal:10,
                display:'flex',
                flexDirection:'column',
                gap:5,
                borderLeftWidth:1,
                borderBottomWidth:1,
                borderRightWidth:1,
                borderColor:'#e2e8f0',
           
                }}>


                    {cropData && cropData.reference && cropData.reference.length > 0 
                      ? cropData.reference.map((ref,index)=> (
                        <View style={{
                          borderWidth:0,
                          width:'100%',
                          display:'flex',
                          flexDirection:'row',
                          alignItems:'center',
                          gap:5,

                        }}>

                          <TouchableOpacity style={{padding:7,borderRadius:'50%',borderWidth:0,}}
                            onPress={() => Linking.openURL(ref.referenceLink)}
                          >
                            <Feather name="external-link" size={20} color="#53697E" />
                          </TouchableOpacity>
                          <Text style={{fontSize:17}}>
                            {ref.referenceTitle}
                          </Text>
                          
                        </View>
                      )) : (

                      <View style={stylesAiles.noDataPlaceholder}>
                        <View style={stylesAiles.noDataPlaceholder__iconWrapper}>
                    
                          <AntDesign name="link" size={24} color="#64748B" />
                        </View>
                        
                        <Text style={stylesAiles.noDataPlaceholder__Primary}>{language === "en" ? "No References Yet" : "Walang Reference Pangkasalukuyan"}</Text>
                        <Text style={stylesAiles.noDataPlaceholder__Secondary}> {language === "en" 
    ? "Looks like we don’t have reference links for this crop at the moment." 
    : "Mukhang wala pang reference links para sa pananim na ito sa kasalukuyan."}</Text>
                      </View>

                      )
                    }


              </View>



          </View>

        </ScrollView>
       }
        
        
        
        </>)}

       
        






        
    </SafeAreaView>

    </PaperProvider>
    </KeyboardAvoidingView>
  )
}

export default CropManagement

const stylesDataDoesntExist = StyleSheet.create({

    wrapper:{
        display:'flex',
        flexDirection:'column',
        width:'80%',
        borderWidth:0,
        justifyContent:'center',
        alignItems:'center',
        gap:10,
        marginVertical:'auto',
        marginHorizontal:'auto'
    },

    secondaryText:{
        textAlign:'center',
        color:'#6C757D',
        fontSize:15
    },
    primaryText:{
        fontSize:20,
        textAlign:'center',
        color:'#2B2D42',
        fontWeight:600
    },

    actionWrapper:{
        paddingVertical:5,
        paddingHorizontal:10,
        borderColor:'#E63946',
        borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFE5E5',
        borderRadius:5,
        marginTop:10,
    },

    actionText:{
        fontSize:15,
        fontWeight:500,
        color:'#E63946'
    }

})

const stylesButtons = StyleSheet.create({
  plotAssign:{
    ///borderWidth:1,
    alignSelf:'flex-start',
    display:'flex',
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:10,
    paddingRight:10,
    backgroundColor:'#E9A800',
    borderRadius:5,
    marginTop:15,
    marginBottom:15
    //width:'fit-content',
  }
})

const stylesCollapsible = StyleSheet.create({
  collapseWrapper:{
    width:'100%',
    //borderWidth:1,
    borderRadius:5,
    padding:15,
    backgroundColor:'white',
    marginBottom:10,
    borderWidth:1,
    borderColor:'#E2E8f0'
  },

  header:{
    color:'#37474F',
    fontSize:18,
    fontWeight:700,
  },
  contentText:{
    marginBottom:20,
    marginTop:30,
    fontWeight:400,
    fontSize:17,
    color:'#333333'
  }
})



const stylesAiles = StyleSheet.create({


  noDataPlaceholder:{
    display:'flex',
    flexDirection:'column',
    width:'100%',
    borderWidth:0,
    padding:10,
    alignItems:'center',
    justifyContent:'center',
    gap:10,
    height:250
  },

  noDataPlaceholder__iconWrapper:{
    width:60,
    height:60,
    borderWidth:0,
    borderRadius:'50%',
    backgroundColor:'#F3F4F6',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },

  noDataPlaceholder__Primary:{
    fontSize:18,
    fontWeight:700,
    color:"#2D303F"
  },
  noDataPlaceholder__Secondary:{
    fontSize:15,
    fontWeight:400,
    textAlign:'center',
    color:"#64748B"
  },
  contentWrapper:{
    width:'100%',
  
   
    display:'flex',
    flexDirection:'column',
 
    paddingTop:0
  },
  containerWrappperPest: {
    paddingTop:0,
    paddingHorizontal:0,
    width:'95%',
    borderWidth:0,
    position:'relative',
    marginBottom:20,
    backgroundColor:'white',
    borderRadius:5,

},
badgeContainer:{
  width:'100%',
  borderWidth:0,
  borderLeftWidth:1,
  borderBottomWidth:1,
  borderRightWidth:1,
  borderColor:'#e2e8f0',
  position:'relative',
  //borderWidth: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  paddingVertical:10,
  //justifyContent: 'center',
  gap: 10,
  paddingHorizontal: 10,
},
badgeWrapper:{
  /*
  height:100,
  width:150,
  //borderWidth:1,
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center'
  */

  height:220,
  width:'100%',
  borderWidth:1,
  borderColor:'#E2E8F0',
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center',
  borderRadius:5
  
},
subContainerHeaderPest:{
    color:'#842C2B',
    fontWeight:700,
    fontSize:18,

  
},
badgesText:{
  color:'#2D303F',
  fontWeight:500,
  fontSize:16,
  
  marginTop:10,
  marginBottom:10
},


badgeWrapper__infoWrapper:{
    width:'100%',
    borderWidth:0,
    height:'30%',
    marginTop:'auto',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FFFFFF',
    borderBottomEndRadius:5,
    borderBottomLeftRadius:5,

},

badgeWrapper__imageWrapper:{
    flex:1,
    width:'100%',
    borderWidth:0,
    borderTopEndRadius:5,
    borderTopStartRadius:5,
},
    containerWrapperHeader:{
        width:'100%',
        borderColor:'#D7514E',
        paddingVertical:10,
        paddingLeft:5,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:5,
        borderLeftWidth:5,
        borderTopLeftRadius:10,
        backgroundColor:'#FEF2F2'
    },


})
const stylesRecords = StyleSheet.create({

  inputWrapperFertilizer:{
    paddingVertical:10,
    width:'100%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    marginBottom:20
  },
  logData:{
    paddingTop:10,
    paddingBottom:10,
    paddingRight:30,
    paddingLeft:30
  },
  selectedItemsWrapper:{
    flexDirection:'row',
    flexWrap:'wrap',
    width:'100%',
   
  },

  selectedItemText:{
    fontWeight:500,
    color:'#A94442'
  },
  inputHeader:{
    width:'100%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'row',
    marginBottom:10
  },
  inputHeaderNormal:{
    width:'100%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'row',
    marginBottom:0
  },
  container:{
    width:'95%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'column',
    paddingTop:30
    //backgroundColor:'#CFFFDC'
  },

  inputWrapper:{
    width:'100%',
    //borderWidth:1,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    marginBottom:20
  },
  iconWrapper:{
    width:25,
    height:25,
    borderRadius:5,
    backgroundColor:'#37474F'
  },
  inputText:{
    fontSize:17,
    fontWeight:600,
    color:'#37474F',
    marginRight:10,
    marginLeft:10
  },
  dropdownOpen: {
    position: 'absolute',
    zIndex: 999,
    width: 200,
    backgroundColor: "#FFFFFF",
  },
  dropdownHidden: {
    display: 'none', // Hide dropdown when it's not active
  },

  header:{
    fontSize:20,
    fontWeight:500,
    color:'#37474F',
    textAlign:'center',
    marginBottom:35
  }



})

const styles = StyleSheet.create({

  scrollContainer: {
    flexDirection: 'row',
    borderWidth:1,
    gap:20,
    paddingHorizontal:10,


  },
  headerContainer:{
    width:'100%',
    //maxHeight:50,
    borderBottomWidth:1,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',

 
    backgroundColor:'white',
    marginBottom:20,
    borderColor:'#E2e8f0'
    //backgroundColor:'white'
     
  },

  headerContainerTop:{
    width:'100%',
    //maxHeight:50,
    borderBottomWidth:1,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:10,
   // height:50,
    backgroundColor:'white',
    //marginBottom:20,
    borderColor:'#E2e8f0'
  },
  picker: {
    height: 60,
    width: '100%',
   borderWidth:1
  },
  BadgeWrapper:{
    padding:3,
    backgroundColor:'#607D8B',
    borderWidth:0,
  
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  
    paddingTop:11,
    paddingBottom:11,
    paddingLeft:25,
    paddingRight:25,
    borderRadius:5,
  
  },

  BadgeText:{
    color:'#ffffff',
    fontSize:16,
    fontWeight:600,
  },  
  //care guide


  //> header wrapper

  headerWrapper:{
    width:'100%',
    borderWidth:1,
    marginTop:10,
    display:'flex',
    flexDirection:'column',
    marginBottom:30,
    paddingVertical:10,
    paddingHorizontal:10,
    backgroundColor:'white',
    borderRadius:5,
    borderColor:'#E2e8f0',
    gap:8,

  },
  nameWrapper:{
    display:'flex',
    flexDirection:'column',
   
    //elevation:4,
    //borderWidth:1,
    flexWrap:'wrap'
    //justifyContent:'center'
    
  },

  scientificName:{
    color:"#475569",
    fontSize:17,
    fontStyle:'italic',
    fontWeight:400
  },


  cropName:{
    color:"#475569",
    fontSize:32,
    fontWeight:600,
    marginRight:5
  },

  plantedText:{
    fontWeight:400,
    fontSize:16,
    color:'#253D2C'
  },


  counterWrapper:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    marginTop:10
  },

  Thumbnail:{
    width:'100%',
    height:230,
    //backgroundColor:'red',
    borderRadius:10,
    borderWidth:0,
  },


  mainContainer:{
    flex:1,
    flexDirection:'column',
    display:'flex',
    borderWidth:0,
    borderColor:'green',
    alignItems:'center',
    justifyContent:'flex-start',
    backgroundColor:'#F4F5F7'

  },

  contentWrapper:{
    width:'95%',
    borderWidth:0,
    alignSelf:'auto',
    flexDirection:'column',
    display:'flex',
    flex:1,
   
   
  },

  //tab top

  container: {
    flex: 1,
    padding: 16,
    //backgroundColor: '#fff',
  },
  segmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8f0',
    width:'100%',
    backgroundColor:'white',
    paddingVertical:5,
    marginBottom:10,

  },
  segmentButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  segmentText: {
    color: 'black',
    fontSize: 17,
    fontWeight:600
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
  }




})

function async(cropNamePara: any) {
  throw new Error('Function not implemented.');
}
