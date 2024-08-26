import { databases} from '@/appwrite';
import {  Query } from 'appwrite';

export const fetchUserDetails = async (userId: string): Promise<User | null> => {
  try {
    const data = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_USERS_COLLECTION_ID!,
      [
        Query.equal('$id', userId),
      ]
    );

    if (data.documents.length > 0) {
      const userDocument = data.documents[0];
      return {
        $id: userDocument.$id,
        username: userDocument.username,
        password: userDocument.password,
        position: userDocument.position,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
