import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { app } from "./firebase-Init.js"

export const storage = getStorage(app)

export function getFileRefference(fileURL) {
    const fileRef = ref(storage, fileURL)
    return fileRef
}
