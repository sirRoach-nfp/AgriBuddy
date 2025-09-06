
import { db } from "@/app/firebaseconfig";
import { addDoc, arrayUnion, collection, doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';




export const fetchSpecificRecord = async(user:any,recordId:string)=>{
    try{



        const userRef = doc(db,"ExpensesCollection",user?.ExpensesRefId as string);
        const docSnap = await getDoc(userRef);


        /*
        if(docSnap.exists()){
            const rawData = docSnap.data().ExpenseLog as any[];
            const expenseIdToFind = recordId;

            const specificLog = rawData.find(log=>log.expenseId === expenseIdToFind);

            if(specificLog){
                return specificLog
            }
            else{
                return {}
            }

        }*/

        if (docSnap.exists()) {
            const rawData = docSnap.data().ExpenseLog as any[];
            const expenseIdToFind = recordId;

            const specificLog = rawData.find(log => log.expenseId === expenseIdToFind);

            if (specificLog) {
                return {
                ...specificLog,
                date: specificLog.date?.toDate() ?? null,
                };
            } else {
                return {};
            }
        }
    }catch(err){
        return{}
    }
}