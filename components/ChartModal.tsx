"use client";

import { useState, Fragment, useEffect, FormEvent } from "react";
import Markdown from "react-markdown";
import { Dialog, DialogTitle, Transition } from "@headlessui/react";
import getUrl from "@/lib/getUrl";
import { getProjectData, getConvertedData } from "@/lib/getProjectData";
import { useChartModalStore } from "@/store/ChartModalStore";
import { useBoardStore } from "@/store/BoardStore";
import Image from "next/image";
import CostChart from "./CostChart";
import { toast } from "react-toastify";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { SiOpenai } from "react-icons/si";

function ChartModal() {
  const [
    addTask,
    image,
    setImage,
    projdata,
    setProjData,
    newTaskInput,
    newTaskType,
    setNewTaskInput,
    setNewTaskType,
    moveToNextState,
    addGptRecommend,
  ] = useBoardStore((state) => [
    state.addTask,
    state.image,
    state.setImage,
    state.projdata,
    state.setProjData,
    state.newTaskInput,
    state.newTaskType,
    state.setNewTaskInput,
    state.setNewTaskType,
    state.moveToNextState,
    state.addGptRecommend,
  ]);
  const [isOpen, closeChartModal, data] = useChartModalStore((state) => [
    state.isOpen,
    state.closeChartModal,
    state.data,
  ]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [convertedDataUrl, setConvertedDataUrl] = useState<string | null>(null);
  const [isGenerate, setGenerate] = useState<boolean>(false);
  const [pdf, setPdf] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [recommand, setRecommand] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<string>("0");
  const [percent, setPercent] = useState<number | null>(null);
  const [costData, setCostData] = useState<
    { category: string; cost: number }[]
  >([]);

  useEffect(() => {
    if (data) {
      setNewTaskInput(data.title);
      setNewTaskType(data.status);
      if (data.image) {
        const fetchImage = async () => {
          const url = await getUrl(data.image!);
          if (url) {
            setImageUrl(url.toString());
          }
        };

        fetchImage();
      }
      if (data.projdata) {
        const fetchData = async () => {
          const url = await getProjectData(data.projdata!);
          if (url) {
            setDataUrl(url.toString());
          }
        };

        fetchData();

        if (data.percentageUsed === null) {
          setPercent(0);
        } else {
          setPercent(data.percentageUsed);
        }
      }
      if (data.convertedData) {
        if (data.threadID && data.msgID) {
          console.log(data.threadID, data.msgID);

          getGptRecommend(data.threadID, data.msgID);
        }
      }
    }
  }, [data]);

  const getGptRecommend = async (threadId: string, msgId: string) => {
    const response = await fetch("/api/getGptRecommend", {
      method: "POST",
      body: JSON.stringify({
        thread_id: threadId,
        msg_id: msgId,
      }),
    });

    const recommend = await response.json();
    const data = recommend.content[0].text.value as string;
    const costBreakdown = extractCostBreakdown(data);

    setCostData(costBreakdown);
    setRecommand(data);
  };

  useEffect(() => {
    if (pdf) {
      getRecommand(pdf);
    }
  }, [pdf]);

  const getRecommand = async (url: string) => {
    setLoading(true);
    const response = await fetch("/api/generateRecommand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, id: data.$id }),
    });

    if (response.ok) {
      const data = await response.json();

      const interval = setInterval(async () => {
        const runResponse = await fetch("/api/openai/run", {
          method: "POST",
          body: JSON.stringify({
            run_id: data.id,
            thread_id: data.thread_id,
          }),
        });

        const run = await runResponse.json();
        if (run.status === "completed") {
          getRecommandText(run.thread_id);
          clearInterval(interval);
        }
      }, 1000);
    } else {
      toast.error("Failed to generate recommendations");
      setLoading(false);
    }
  };

  const getRecommandText = async (threadId: string) => {
    const runResponse = await fetch("/api/openai/message", {
      method: "POST",
      body: JSON.stringify({
        thread_id: threadId,
      }),
    });
    const data1 = await runResponse.json();
    const message = data1.data.filter((item: any) => item.role === "assistant");

    addGptRecommend(threadId, message[0].id, data.$id);

    setRecommand(message[0].content[0].text.value);

    const costBreakdown = extractCostBreakdown(
      message[0].content[0].text.value
    );
    setCostData(costBreakdown);
    setLoading(false);
  };

  const extractCostBreakdown = (text: string) => {
    const regex = /([A-Za-z\s]+):\s*₱([\d,]+\.\d{2})/g;
    const result = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      result.push({
        category: match[1].trim(),
        cost: parseFloat(match[2].replace(/,/g, "")),
      });
    }

    return result;
  };

  const Convert = async (url: string, type: string) => {
    const response = await fetch("/api/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, type }),
    });

    const convertedUrl = await response.json();

    setPdf(convertedUrl.pdf);
  };

  const regenerateResponse = async () => {
    if (pdf) {
      toast.info("Regenerating response...");
      // getRecommand(pdf);
    }
  };

  const generateResponse = async (e: FormEvent) => {
    e.preventDefault();
    const fileType = data.fileType as string;

    if (dataUrl && fileType !== "pdf") {
      Convert(dataUrl, fileType);
      setGenerate(true);
    }
  };

  const handleMoveToNextState = (e: FormEvent) => {
    e.preventDefault();
    if (data) {
      const percent = Number(percentage);
      moveToNextState(data.$id, "todo", percent);
      closeModal();
    }
  };

  const closeModal = () => {
    setImageUrl(null);
    setRecommand(null);
    setDataUrl(null);
    setGenerate(false);
    setPercent(null);
    setCostData([]);
    closeChartModal();
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Check if the input is a number
    if (!/^\d*$/.test(inputValue)) return;

    const numValue = parseInt(inputValue, 10);

    // Enforce range between 0 and 100
    if (inputValue === "" || (numValue >= 0 && numValue <= 100)) {
      setPercentage(inputValue);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="form" className="relative z-10" onClose={closeModal}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2 flex justify-between items-center"
                >
                  <p>Project Details and Analysis</p>
                  <p>
                    {newTaskType !== "proposed" &&
                      data.projdata !== null &&
                      percent !== null &&
                      `GPT %: ${percent}`}
                  </p>
                </DialogTitle>

                <div className="mt-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Enter a Project Title Here..."
                    className="w-full border border-gray-300 rounded-md outline-none p-2 opacity-90"
                    disabled
                  />
                </div>

                {imageUrl && (
                  <Image
                    alt="Upload Image"
                    width={200}
                    height={200}
                    className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150"
                    src={imageUrl}
                  />
                )}
                {isLoading ? (
                  <div className="flex items-center justify-center mt-2">
                    Loading GPT Recommendations...
                  </div>
                ) : (
                  <div className="mt-4">
                    {recommand && <Markdown>{recommand}</Markdown>}
                    {costData.length > 0 && <CostChart data={costData} />}
                  </div>
                )}
                {!isLoading && newTaskType === "proposed" && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2 items-center justify-center">
                      <input
                        type="text"
                        className="w-14 border outline-none px-1"
                        value={percentage}
                        onChange={(e) => handleInput(e)}
                      />
                      <label>GPT recommendation %</label>
                    </div>
                    <div className="flex items-center">
                      {dataUrl && (
                        <button
                          onClick={generateResponse}
                          title="Generate Response"
                          className="mr-2 text-gray-500 hover:text-gray-700 font-bold px-2 rounded"
                        >
                          <SiOpenai className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={handleMoveToNextState}
                        className="mr-2 text-blue-500 hover:text-blue-700 font-bold px-2 rounded"
                      >
                        Move to To Do
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ChartModal;
