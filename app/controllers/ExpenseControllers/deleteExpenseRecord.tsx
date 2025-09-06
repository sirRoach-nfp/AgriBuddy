import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebaseconfig";

export const deleteExpenseRecord = async (userId: string, expenseId: string) => {
  const userRef = doc(db, "ExpensesCollection", userId);

  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const rawData = docSnap.data().ExpenseLog as any[];

    // Filter out the log we want to delete
    const updatedLogs = rawData.filter(log => log.expenseId !== expenseId);

    // Update Firestore with the new array
    await updateDoc(userRef, {
      ExpenseLog: updatedLogs,
    });

    console.log(`Expense with ID ${expenseId} deleted.`);
  } else {
    console.error("Document does not exist.");
  }
};