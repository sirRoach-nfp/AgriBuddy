import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  limit,
  query,
} from "firebase/firestore";
import { db } from '../../firebaseconfig'

export const listenToArticlesHome = (
    onUpdate: (articles: any[]) => void,
    onError: (error: any) => void
    ) => {
    const articleQuery = query(
        collection(db, "Articles"),
        orderBy("CreatedAt", "desc"),
        limit(5)
    );

    const unsubscribe = onSnapshot(
        articleQuery,
        (snapshot) => {
        const rawData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
            cover: data.cover,
            title: data.title,
            articleId: doc.id,
            };
        });
        onUpdate(rawData);
        },
        (err) => onError(err)
    );

    return unsubscribe;
};