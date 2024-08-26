"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useChangelogModalStore } from "@/store/ChangelogModalStore";
import { databases } from "@/appwrite";

function ChangelogModal() {
  const { isOpen, closeModal } = useChangelogModalStore();
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);

  useEffect(() => {
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
    };

    if (isOpen) {
      fetchChangelogs();
    }
  }, [isOpen]);

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
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Changelogs
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  {changelogs.length > 0 ? (
                    changelogs.map((changelog) => (
                      <div
                        key={changelog.$id}
                        className="p-4 border rounded-md"
                      >
                        <p>
                          <strong>Todo ID:</strong> {changelog.todoId}
                        </p>
                        <p>
                          <strong>Changes:</strong> {changelog.changes}
                        </p>
                        <p>
                          <strong>User ID:</strong> {changelog.userId}
                        </p>
                        <p>
                          <strong>Timestamp:</strong> {changelog.timestamp}
                        </p>
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
