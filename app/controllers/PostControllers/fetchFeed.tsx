import { db } from "@/app/firebaseconfig";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter, where } from "firebase/firestore";

interface DiscussionData {
  DocumentId:string,
  Author:string,
  Content:string,
  CreatedAt:any,
  Title:string,
  ReplyCount:any,
  AuthorName:any,
  Tag:string,
}


export const fetchDiscussionsController = async (limitCount=20,lastDoc:any=null,tag:String = "All") => {

    try {

    let discussionRef:any;

    if(tag === "All") {
      discussionRef = query(
        collection(db,"Discussions"),
        orderBy("CreatedAt","desc"),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      )
    }else {
      discussionRef = query(
        collection(db, "Discussions"),
        where("Tag", "==", tag),
        orderBy("CreatedAt","desc"),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(limitCount)
      )
    }

    // Step 2: Fetch snapshot
    const snapshot = await getDocs(discussionRef);
    const docs = snapshot.docs as QueryDocumentSnapshot<DiscussionData>[];

    // Step 3: Map discussions first
    const discussions = await Promise.all(
      docs.map(async (docSnap) => {
        const repliesRef = collection(db, "Discussions", docSnap.id, "Comments");
        const repliesSnap = await getDocs(repliesRef);

        return {
          DocumentId: docSnap.id,
          Author: docSnap.data().Author, // UID
          Content: docSnap.data().Content,
          CreatedAt: docSnap.data().CreatedAt,
          Title: docSnap.data().Title,
          ReplyCount: repliesSnap.size,
          Tag: docSnap.data().Tag,
        };
      })
    );

    // Step 4: Collect all unique Author UIDs
    const authorIds = [...new Set(discussions.map((d) => d.Author))];

    const userDocs = await Promise.all(
      authorIds.map(async (uid) => {
        const userSnap = await getDoc(doc(db, "Users", uid));
        return userSnap.exists()
          ? { uid, Username: userSnap.data().Username }
          : { uid, Username: "Unknown" };
      })
    );

    // Step 5: Build lookup map
    const userMap = userDocs.reduce<Record<string, string>>((acc, u) => {
      acc[u.uid] = u.Username;
      return acc;
    }, {});

    // Step 6: Attach usernames
    const discussionsWithNames = discussions.map((d) => ({
      ...d,
      AuthorName: userMap[d.Author] || "Unknown",
    }));

    return {
      discussions: discussionsWithNames,
      lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
    };
  } catch (err) {
    console.error(err);
    return { discussions: [], lastDoc: null };
  }
}




/* deprecated

const getReplyCount = async (discussionID: string) => {
  const repliesRef = collection(db, "Discussions", discussionID, "Comments");
  const snapshot = await getDocs(repliesRef);
  return snapshot.size; // Number of replies
};



export const fetchDiscussionsController = async (limitCount=20,lastDoc:any=null) => {

    try {
    // Step 1: Build query
    let discussionRef = query(
      collection(db, "Discussions"),
      orderBy("CreatedAt", "desc"),
      limit(limitCount)
    );

    if (lastDoc) {
      discussionRef = query(
        collection(db, "Discussions"),
        orderBy("CreatedAt", "desc"),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    // Step 2: Fetch snapshot
    const snapshot = await getDocs(discussionRef);
    const docs = snapshot.docs;

    // Step 3: Map discussions first
    const discussions = await Promise.all(
      docs.map(async (docSnap) => {
        const repliesRef = collection(db, "Discussions", docSnap.id, "Comments");
        const repliesSnap = await getDocs(repliesRef);

        return {
          DocumentId: docSnap.id,
          Author: docSnap.data().Author, // UID
          Content: docSnap.data().Content,
          CreatedAt: docSnap.data().CreatedAt,
          Title: docSnap.data().Title,
          ReplyCount: repliesSnap.size,
          Tag: docSnap.data().Tag,
        };
      })
    );

    // Step 4: Collect all unique Author UIDs
    const authorIds = [...new Set(discussions.map((d) => d.Author))];

    const userDocs = await Promise.all(
      authorIds.map(async (uid) => {
        const userSnap = await getDoc(doc(db, "Users", uid));
        return userSnap.exists()
          ? { uid, Username: userSnap.data().Username }
          : { uid, Username: "Unknown" };
      })
    );

    // Step 5: Build lookup map
    const userMap = userDocs.reduce<Record<string, string>>((acc, u) => {
      acc[u.uid] = u.Username;
      return acc;
    }, {});

    // Step 6: Attach usernames
    const discussionsWithNames = discussions.map((d) => ({
      ...d,
      AuthorName: userMap[d.Author] || "Unknown",
    }));

    return {
      discussions: discussionsWithNames,
      lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
    };
  } catch (err) {
    console.error(err);
    return { discussions: [], lastDoc: null };
  }
}
  */