import { getStorage } from "firebase/storage";
import { Firebase } from "./Firebase";

export const storage = getStorage(Firebase);
