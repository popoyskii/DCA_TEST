import { storage } from "@/appwrite";

const getProjectData = async (data: Image) => {
  const url = storage.getFileView(data.bucketId, data.fileId);
  return url;
};

export default getProjectData;
