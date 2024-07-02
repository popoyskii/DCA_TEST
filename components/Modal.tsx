"use client";

import { useState, Fragment, useRef, FormEvent } from "react";
import { Dialog, DialogTitle, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import Image from "next/image";
import {
  ChartBarSquareIcon,
  PaperClipIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

function Modal() {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const dataPickerRef = useRef<HTMLInputElement>(null);
  const [
    addTask,
    image,
    setImage,
    projdata,
    setProjData,
    newTaskInput,
    newTaskType,
    setNewTaskInput,
  ] = useBoardStore((state) => [
    state.addTask,
    state.image,
    state.setImage,
    state.projdata,
    state.setProjData,
    state.newTaskInput,
    state.newTaskType,
    state.setNewTaskInput,
  ]);
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;

    addTask(newTaskInput, newTaskType, image, projdata);

    setImage(null);
    setProjData(null);
    closeModal();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/json",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) return;

    setProjData(file);
  };

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        onSubmit={handleSubmit}
        as="form"
        className="relative z-10"
        onClose={closeModal}
      >
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
          <div className="flex min-h-full  items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a Project
                </DialogTitle>

                <div className="mt-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Enter a Project Title Here..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>

                {/* radiogroup */}
                <TaskTypeRadioGroup />

                <div>
                  <button
                    type="button"
                    onClick={() => imagePickerRef.current?.click()}
                    className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ringe-blue-500 focus-visible:ring-offset-2"
                  >
                    <PhotoIcon className="h-6 w-6 mr-w inline-block" />
                    Upload Image
                  </button>
                  {image && (
                    <Image
                      alt="Upload Image"
                      width={200}
                      height={200}
                      className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                      src={URL.createObjectURL(image)}
                      onClick={() => setImage(null)}
                    />
                  )}

                  <input
                    type="file"
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      if (!e.target.files![0].type.startsWith("image/")) return;
                      setImage(e.target.files![0]);
                    }}
                  />
                </div>

                <div className="my-2">
                  <button
                    type="button"
                    onClick={() => dataPickerRef.current?.click()}
                    className="w-full border border-gray-300 rounded-md outline-none px-5 py-3 focus-visible:ring-2 focus-visible:ringe-blue-500 focus-visible:ring-offset-2"
                  >
                    <PaperClipIcon className="h-5 w-5 mr-w inline-block" />
                    Upload Project Data
                    <p className="text-gray-400 font-thin text-sm">
                      {"json / xlsx / csv / docx / pdf"}
                    </p>
                  </button>

                  {projdata && (
                    <div className="w-full object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed">
                      <p className="font-bold">
                        file:{" "}
                        <span
                          className="font-light text-green-800 border border-gray-200 rounded-md px-2 pb-1"
                          onClick={() => setProjData(null)}
                        >
                          {projdata.name}
                        </span>
                        <button
                          onClick={() => setProjData(null)}
                          className="ml-2 text-red-500"
                        >
                          <TrashIcon className="h-4 w-4 wr-w inline-block" />
                        </button>
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={dataPickerRef}
                    hidden
                    onChange={handleFileChange}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={!newTaskInput}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    Add Project
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

export default Modal;
