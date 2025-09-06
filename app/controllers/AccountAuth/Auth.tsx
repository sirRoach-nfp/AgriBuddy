
import { auth } from "@/app/firebaseconfig";
import { sendPasswordResetEmail } from "firebase/auth";


//reset password

export const sendPaswordRequestToEmail = async(email:string) => {

    try{
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent!");
    }catch(err){console.log(err)}
}