import { useUserContext } from "@/app/Context/UserContext";
import { db } from "@/app/firebaseconfig";
import { addDoc, arrayUnion, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';


interface ItemObject{
    id:string,
    itemName : string,
    itemQuantity : number,
    itemPrice : number,

}

export const uploadExpenseController = async(
    user:any,
    titleParam:String,
    dateParam: Date,
    descriptionParam:String,
    itemsParam: ItemObject[],
    totalParam:Number,
 

) =>{








    try{

        const newExpenseRecord = {
            expenseId:"EXPID" + Date.now().toString(),
            title:titleParam,
            date:dateParam,
            description:descriptionParam,
            items:itemsParam,
        }


        const expenseRecordRef = doc(db,"ExpensesCollection",user?.ExpensesRefId as string)

        console.log("New Expense Record[From Expenses Controller] : ", newExpenseRecord);

        await updateDoc(expenseRecordRef,{
            ExpenseLog:arrayUnion({
                expenseId:"EXPID" + Date.now().toString(),
                title:titleParam,
                date:dateParam,
                description:descriptionParam,
                items:itemsParam,
                total:totalParam,
            })
        })

        console.log("Success")

        
    }catch(err){
        console.log(err)
    }
}