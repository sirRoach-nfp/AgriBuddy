
import { db } from "@/app/firebaseconfig";
import { addDoc, arrayUnion, collection, doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';


interface expenseLogStructure{
    date:Timestamp,
    expenseId:string,
    title:string,
    total: number,
    amountItems:number
}


export const fetchExpensesController = async(user:any)=>{

    try{

        const userRef = doc(db,"ExpensesCollection",user?.ExpensesRefId as string)

        const docSnap = await getDoc(userRef);


        if(docSnap.exists()){
            const rawData = docSnap.data().ExpenseLog as any [];
            const filteredData:expenseLogStructure[] = rawData.map(log => ({
                date:log.date,
                expenseId:log.expenseId,
                title:log.title,
                total: log.total,
                amountItems:log.items ? log.items.length : 0
            }));

            console.log("Fetched Expenses Logs : ", filteredData)
            return filteredData
        }else{
            return []
        }
        
    }catch(err){
        console.log(err)
        return []; 
    }
}