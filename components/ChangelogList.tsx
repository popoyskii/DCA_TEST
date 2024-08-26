"user client";
import { useEffect, useState } from "react";
import { databases } from "@/appwrite";

const ChangelogList = () => {
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);

  useEffect(() => {
    const fetchChangelogs = async () => {
      try {
        const changelogData = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID!,
          process.env.NEXT_PUBLIC_CHANGELOGS_COLLECTION_ID!
        );

        // Map the documents to the Changelog type
        const mappedChangelogs: Changelog[] = changelogData.documents.map(
          (doc) => ({
            $id: doc.$id, // Include the $id field
            todoId: doc.todoId,
            changes: doc.changes,
            timestamp: doc.timestamp,
            userId: doc.userId,
          })
        );

        setChangelogs(mappedChangelogs);
      } catch (error) {
        console.error("Failed to fetch changelogs:", error);
      }
    };

    fetchChangelogs();
  }, []);

  return (
    <div>
      <h2>Changelog List</h2>
      <ul>
        {changelogs.map((log) => (
          <li key={log.$id}>
            <p>Change: {log.changes}</p>
            <p>Timestamp: {log.timestamp}</p>
            <p>User ID: {log.userId}</p>
            <p>Todo ID: {log.todoId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChangelogList;
