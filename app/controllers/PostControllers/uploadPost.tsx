

import { useUserContext } from "@/app/Context/UserContext";
import { db } from "@/app/firebaseconfig";
import { addDoc, arrayUnion, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';





export const uploadPostController = async(imageUri : string[],
    title:string,body:string,user:any,tag:string) =>{


   



    try{
        console.log("Inside uploadPostController")
        const uploadedImageUrls = [];

        if (imageUri.length > 0){

            for (const uri of imageUri){
                
                const formData = new FormData();

                formData.append("file",{
                    uri: uri,
                    type: "image/jpeg",
                    name: "upload.jpg",
                } as any);

                formData.append("upload_preset","dishlyunsignedpreset");

                console.log("Uploading selected image || Origin : uploadPost__controller")
                
                const uploadResponse = await fetch(
                    "https://api.cloudinary.com/v1_1/dvl7mqi2r/image/upload",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                console.log("Image uploaded || Origin : uploadPost__controller")
                
                const data = await uploadResponse.json();
                if (data.secure_url) {
                    uploadedImageUrls.push(data.secure_url); // Store uploaded image URL
                } else {
                    console.error("Upload failed:", data);
                }
                console.log("Image done uploading to Cloudinary || Origin : uploadPost__controller")
            }


        }


        


        const newDiscussion = {
            Title:title,
            Tag:tag,
            Content:body,
            ImageSnapshots:uploadedImageUrls,
            ReplyCount:0,
            Author:user?.UserId || "placeholder",
            AuthorUid:user?.UserId,
            CreatedAt:Timestamp.now(),
            Keyword: extractKeywords(title)
        }

        console.log("New discussion object  : ", newDiscussion)


        const discussionRef = await addDoc(collection(db,"Discussions"),newDiscussion);
        console.log("New discussion added with ID:", discussionRef.id);


        const repliesCollectionRef = collection(db,"Discussions", discussionRef.id,"Replies");

        console.log("Replies subcollection ready:", repliesCollectionRef.path)


        const discussionRecordRef = doc(db,"DiscussionRecords",user?.DiscussionRecordRefId as string)

        
        await updateDoc(discussionRecordRef,{
            Discussions:arrayUnion({
                discussionId:discussionRef.id,
                discussionTitle:title,
                CreatedAt:Timestamp.now(),
                authorSignature:user?.UserId
            })
        })

        console.log("Upload success")

    }catch(err){
        console.log({err})
    }



}

//helper

const extractKeywords = (text: string): string[] => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/gi, '') // remove punctuation
        .split(/\s+/)
        .filter((word, index, self) =>
        word.length > 1 && self.indexOf(word) === index
        );
    };