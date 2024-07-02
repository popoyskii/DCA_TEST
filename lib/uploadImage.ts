import { ID, storage} from "@/appwrite";

const uploadImage = async (file: File) => {
    if (!file) return;

    const fileUploaded = await storage.createFile(
        // bucketid appwrite img storage  
        "65c11b82036b8ae1a762",
        ID.unique(),
        file,
    );

    return fileUploaded;
};

export default uploadImage;