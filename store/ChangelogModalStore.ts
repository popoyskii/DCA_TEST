import { create } from "zustand";

interface ChangelogModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useChangelogModalStore = create<ChangelogModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
