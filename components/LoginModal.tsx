"use client";

import { useEffect, useState, Fragment, FormEvent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuthStore } from "@/store/AuthStore";
import { toast } from "react-toastify";

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, errorMessage, successMessage, isAuthenticated } =
    useAuthStore();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage]);

  return (
    <Transition appear show={!isAuthenticated} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Login
                </Dialog.Title>
                <form onSubmit={handleLogin} className="mt-2">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full border border-gray-300 rounded-md outline-none p-5 focus:outline-none focus:shadow-outline ${
                        errorMessage ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full border border-gray-300 rounded-md outline-none p-5 focus:outline-none focus:shadow-outline ${
                        errorMessage ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errorMessage && (
                    <p className="text-red-500 text-xs italic mb-4">
                      {errorMessage}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-900 hover:text-blue-100"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Sign In"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
