"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useChangelogModalStore } from "@/store/ChangelogModalStore";
import { databases } from "@/appwrite";

function ChangelogModal() {
  const { isOpen, closeModal } = useChangelogModalStore();
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchChangelogs = async () => {
      try {
        const changelogData = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID!,
          process.env.NEXT_PUBLIC_CHANGELOGS_COLLECTION_ID!
        );

        const mappedChangelogs: Changelog[] = changelogData.documents.map(
          (doc: any) => ({
            $id: doc.$id,
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
      setLoading(false);
    };

    if (isOpen) {
      fetchChangelogs();
    }
  }, [isOpen]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="max-w-lg p-6 bg-white rounded-lg shadow-xl">
                <Dialog.Title className="text-lg font-medium text-gray-900 uppercase tracking-[6px]">
                  Changelogs
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  {isLoading ? (
                    <></>
                  ) : changelogs.length > 0 ? (
                    changelogs.map((changelog) => (
                      <div
                        key={changelog.$id}
                        className="p-4 border rounded-md"
                      >
                        <p className="text-left font-semibold">
                          {changelog.changes} "{changelog.todoId}"
                        </p>
                        <div className="flex flex-row justify-between items-center min-w-80">
                          <p>{formatDate(changelog.timestamp)}</p>
                          <p>{changelog.userId}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No changelogs available.</p>
                  )}
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ChangelogModal;
