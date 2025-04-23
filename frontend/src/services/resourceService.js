import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const RESOURCES_COLLECTION = "resources";

export const getResources = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, RESOURCES_COLLECTION));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting resources:", error);
    throw error;
  }
};
