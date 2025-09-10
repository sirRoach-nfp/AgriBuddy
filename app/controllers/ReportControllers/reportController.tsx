import { db } from "@/app/firebaseconfig";
import { addDoc, arrayUnion, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';

interface reportData {
    id:string,
    reportType:string,
    reportReason:string,
    additionalInfo:string
}

export const uploadReport = async({id,reportType,reportReason,additionalInfo}:reportData) =>{


    try{


        const newReport = {
            _id:id,
            _reportType:reportType,
            _reportReason:reportReason,
            _additionalInfo:additionalInfo
        }


        const reportRef = await addDoc(collection(db,"Reports"),newReport)
        console.log("Upload success")

    }catch(err){console.log(err)}
}