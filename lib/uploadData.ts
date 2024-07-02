import { ID, storage} from "@/appwrite";

const uploadData = async (file: File) => {
    if (!file) return;

    const fileUploaded = await storage.createFile(
        // bucketid appwrite proj_data storage  
        "66715a360039b102e6ca",
        ID.unique(),
        file,
    );

    return fileUploaded;
};

export default uploadData;