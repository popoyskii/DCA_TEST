"use client";

import { useEffect, useState, Fragment, FormEvent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { useBoardStore } from "@/store/BoardStore";

export default function DateModal({
  isOpen,
  setOpen,
  selectedId,
}: {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  selectedId: string;
}) {
  //   const [isOpen, setIsOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(undefined);

  const [moveToProgress] = useBoardStore((state) => [state.moveToProgress]);

  const handleConfirm = () => {
    const startDate = new Date();
    if (selectedDate) {
      moveToProgress(selectedId, startDate, selectedDate);
    } else {
      toast.error("Please input end date!");
      return;
    }
    setOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setOpen(!isOpen)}
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
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  End Date
                </Dialog.Title>
                <div className="flex flex-col end-date">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: any) => setSelectedDate(date)}
                    className="border pl-2"
                  />
                  <div className="flex items-center justify-end mt-2">
                    <button
                      className="mr-2 text-blue-500 hover:text-blue-700 font-bold px-2 rounded"
                      onClick={handleConfirm}
                    >
                      Confirm
                    </button>
                    <button
                      className="mr-2 text-red-500 hover:text-red-700 font-bold px-2 rounded"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
