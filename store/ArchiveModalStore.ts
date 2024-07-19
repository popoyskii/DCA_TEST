import { create } from "zustand";

interface ArchiveModalState {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    isArchivedOpen: boolean;
    openArchivedModal: () => void;
    closeArchivedModal: () => void;
  }
  
  export const useArchiveModalStore = create<ArchiveModalState>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
    isArchivedOpen: false,
    openArchivedModal: () => set({ isArchivedOpen: true }),
    closeArchivedModal: () => set({ isArchivedOpen: false }),
  }));
  
