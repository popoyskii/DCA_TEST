import { storage } from "@/appwrite";

export const getProjectData = async (data: ProjData) => {
  const url = storage.getFileView(data.bucketId, data.fileId);
  return url;
};

export const getConvertedData = async (data: ProjData) => {
  const response = storage.getFileView(data.bucketId, data.fileId);
  return response;
};

// export default getProjectData;
