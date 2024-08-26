import { account } from '@/appwrite';

const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user.$id;
    console.log(user);
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
};

export default getCurrentUser;
