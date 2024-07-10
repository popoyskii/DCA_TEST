import { create } from "zustand";

interface ChartModalState {
  isOpen: boolean;
  data: Todo;
  setData: (data: Todo) => void;
  openChartModal: () => void;
  closeChartModal: () => void;
}

export const useChartModalStore = create<ChartModalState>()((set) => ({
  isOpen: false,
  data: {
    $id: "",
    $createdAt: "",
    title: "",
    status: "todo",
    fileType: "",
  },
  setData: (data) => set({ data, isOpen: true }),
  openChartModal: () => set({ isOpen: true }),
  closeChartModal: () => set({ isOpen: false }),
}));
