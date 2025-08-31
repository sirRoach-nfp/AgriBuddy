import { useUserContext } from "@/app/Context/UserContext";
import { db } from "@/app/firebaseconfig";
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';



export const fetchSpecificPost = async(discussionRefId:string) => {
    try {
        // Step 1: Get the discussion document
        const discussionDocRef = doc(db, "Discussions", discussionRefId);
        const discussionSnap = await getDoc(discussionDocRef);

        if (!discussionSnap.exists()) {
        return null;
        }

        const discussionData = discussionSnap.data();

        // Step 2: Get all replies for this discussion
        const repliesRef = collection(discussionDocRef, "Comments");
        const repliesSnap = await getDocs(repliesRef);

        const replies = repliesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        }));

        // Step 3: Collect all unique userIds
        const userIds = [...new Set(replies.map((reply) => reply.userId))];

        // Step 4: Fetch all users in one batch
        let userMap: Record<string, string> = {};
        if (userIds.length > 0) {
        const usersQuery = query(
            collection(db, "Users"),
            where("uid", "in", userIds.slice(0, 10)) // Firestore "in" max 10 per query
        );
        const usersSnap = await getDocs(usersQuery);

        usersSnap.forEach((doc) => {
            const data = doc.data();
            userMap[data.uid] = data.username;
        });

        // If you have more than 10 userIds, chunk queries (see note below)
        if (userIds.length > 10) {
            const chunks = [];
            for (let i = 10; i < userIds.length; i += 10) {
            chunks.push(userIds.slice(i, i + 10));
            }

            for (const chunk of chunks) {
            const chunkQuery = query(
                collection(db, "Users"),
                where("uid", "in", chunk)
            );
            const chunkSnap = await getDocs(chunkQuery);
            chunkSnap.forEach((doc) => {
                const data = doc.data();
                userMap[data.uid] = data.username;
            });
            }
        }
        }

        // Step 5: Attach usernames to replies
        const repliesWithUsernames = replies.map((reply) => ({
        ...reply,
        username: userMap[reply.userId] || "Unknown User",
        }));

        return {
        ...discussionData,
        replies: repliesWithUsernames,
        };
    } catch (error) {
        console.error("Error fetching discussion data:", error);
        return null;
    }
}