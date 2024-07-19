"use client";
import { useArchiveModalStore } from "@/store/ArchiveModalStore";
import { useBoardStore } from "@/store/BoardStore";
import { Dialog, DialogTitle, Transition } from "@headlessui/react";
import { Fragment } from "react";

function ArchivedModal() {
  const [isOpen, closeArchivedModal] = useArchiveModalStore((state) => [
    state.isArchivedOpen,
    state.closeArchivedModal,
  ]);
  const archivedProjects = useBoardStore((state) => state.archivedProjects);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeArchivedModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Archived Projects
                </DialogTitle>
                <div className="mt-2">
                  <ul>
                    {archivedProjects.map((project) => (
                      <li
                        className="hover:text-blue-950 hover:bg-gray-200 rounded-md border bg-gray-300 py-5 pl-2 my-2 items-center flex-auto justify-center "
                        key={project.$id}
                      >
                        {project.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ArchivedModal;
