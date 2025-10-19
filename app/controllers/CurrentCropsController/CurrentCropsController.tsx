import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  limit,
  query,
} from "firebase/firestore";
import { db } from '../../firebaseconfig'


export const listenToCurrentCrops = (
  userRefId: string,
  onUpdate: (crops: any[]) => void,
  onError: (error: any) => void
) => {
  const userRef = doc(db, "CurrentCrops", userRefId);

  const unsubscribe = onSnapshot(
    userRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const metadata = docSnap.metadata;
        console.log(
          metadata.fromCache
            ? "📦 Data loaded from cache (offline mode)"
            : "🌐 Data loaded from server (online mode)"
        );

        const rawData = docSnap.data().CurrentCrops as any[];
        const filteredCrops = rawData.map((crop) => ({
          CropName: crop.CropName,
          CropId: crop.CropId,
          SessionId: crop.SessionId,
          PlotAssoc: crop.PlotAssoc,
          PlotName: crop.PlotName,
          CropThumbnail: crop.CropCover,
        }));

        onUpdate(filteredCrops);
      } else {
        console.log("⚠️ Document does not exist");
      }
    },
    (err) => {
      console.error("❌ Error fetching crops:", err);
      onError(err);
    }
  );

  return unsubscribe;
};