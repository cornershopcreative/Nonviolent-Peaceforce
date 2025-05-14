import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const RESOURCES_COLLECTION = "resources";

export const getResources = async () => {
  try {
    const q = query(
      collection(db, RESOURCES_COLLECTION),
      where("published", "==", "active")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting resources:", error);
    throw error;
  }
};
