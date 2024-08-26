import { databases, ID } from '@/appwrite';

const addChangelog = async (todoId: string, changes: string, userId: string) => {
  try {
    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_CHANGELOGS_COLLECTION_ID!,
      ID.unique(),
      {
        todoId,
        changes,
        timestamp: new Date().toISOString(),
        userId,
      }
    );
  } catch (error) {
    console.error("Failed to add changelog:", error);
  }
};

export default addChangelog;
