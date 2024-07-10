// lib/fetchUser.ts
import { databases } from '@/appwrite'; // Ensure this path is correct and matches your project structure
import { Query } from 'appwrite';
import { Models } from 'appwrite';

export const fetchUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const data: Models.DocumentList<Models.Document> = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_USERS_COLLECTION_ID!,
      [
        Query.equal('username', username),
        Query.equal('password', password),
      ]
    );

    if (data.documents.length > 0) {
      const userDocument = data.documents[0];
      const user: User = {
        $id: userDocument.$id,
        username: userDocument.username,
        password: userDocument.password,
        position: userDocument.position
      };
      return user;
    }

    console.log(data);
    console.log(username);

    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};