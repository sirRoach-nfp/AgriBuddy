import { useUserContext } from "@/app/Context/UserContext";
import { db } from "@/app/firebaseconfig";
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';

type ReplyData = {
  userId: string;
  [key: string]: any; // fallback for other fields
};


export const fetchSpecificPost = async (discussionRefId: string) => {
  try {
    // Step 1: Get the discussion document
    const discussionDocRef = doc(db, "Discussions", discussionRefId);
    const discussionSnap = await getDoc(discussionDocRef);

    if (!discussionSnap.exists()) {
      return null;
    }

    const discussionData = discussionSnap.data();

    // Step 2: Fetch the Author's username (single userId lookup)
    let authorName = "Unknown";
    if (discussionData.Author) {
      const userQuery = query(
        collection(db, "Users"),
        where("UserId", "==", discussionData.Author)
      );
      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        const userDoc = userSnap.docs[0].data();
        authorName = userDoc.Username || "Unknown";
      }
    }

    // Step 3: Get all replies for this discussion
    const repliesRef = collection(discussionDocRef, "Comments");
    const repliesSnap = await getDocs(repliesRef);

    const replies = repliesSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as ReplyData),
    }));

    // Step 4: Collect all unique userIds from replies
    const userIds = [...new Set(replies.map((reply) => reply.userId))];

    // Step 5: Fetch usernames for replies
    let userMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const usersQuery = query(
        collection(db, "Users"),
        where("UserId", "in", userIds.slice(0, 10)) // Firestore limit: 10 per query
      );
      const usersSnap = await getDocs(usersQuery);

      usersSnap.forEach((doc) => {
        const data = doc.data();
        userMap[data.UserId] = data.Username;
      });

      // If more than 10, chunk queries
      if (userIds.length > 10) {
        const chunks = [];
        for (let i = 10; i < userIds.length; i += 10) {
          chunks.push(userIds.slice(i, i + 10));
        }

        for (const chunk of chunks) {
          const chunkQuery = query(
            collection(db, "Users"),
            where("UserId", "in", chunk)
          );
          const chunkSnap = await getDocs(chunkQuery);
          chunkSnap.forEach((doc) => {
            const data = doc.data();
            userMap[data.UserId] = data.Username;
          });
        }
      }
    }

    // Step 6: Attach usernames to replies
    const repliesWithUsernames = replies.map((reply) => ({
      ...reply,
      username: userMap[reply.userId] || "Unknown User",
    }));

    // Step 7: Return discussion with author + replies
    return {
      ...discussionData,
      AuthorName: authorName,
      replies: repliesWithUsernames,
    };
  } catch (error) {
    console.error("Error fetching discussion data:", error);
    return null;
  }
};
