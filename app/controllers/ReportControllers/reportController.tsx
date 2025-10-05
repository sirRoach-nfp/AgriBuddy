import { auth, db } from "@/app/firebaseconfig";
import { addDoc, arrayUnion, collection, doc, FieldValue, Timestamp, updateDoc } from 'firebase/firestore';

interface reportData {
    id:string,
    reportType:string,
    reportReason:string,
    additionalInfo:string
    contentTitle: string | null,
    contentBody:string,
    reportTitle:string,
    postRefId:string,
    createdAt:Timestamp | null | FieldValue
    replyRefId:string | null
    author:string
    
}

export const uploadReport = async({
    id,
    reportType,
    reportReason,
    additionalInfo,
    reportTitle,
    contentTitle,
    contentBody,
    postRefId,
    replyRefId,
    createdAt,
    author,
    }:reportData) =>{


    try{


        const newReport = {
            _id:id,
            _reportType:reportType,
            _reportReason:reportReason,
            _additionalInfo:additionalInfo,
            _reportTitle:reportTitle,
            _contentTitle: contentTitle || null,
            _contentBody: contentBody,
            _postRefId:postRefId.trim(),
            _replyRefId: replyRefId?.trim() || null,
            _author: author,
            CreatedAt:createdAt,


        }


        const reportRef = await addDoc(collection(db,"Reports"),newReport)
        console.log("Upload success")

    }catch(err){console.log(err)}
}