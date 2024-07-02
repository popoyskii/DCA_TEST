import { create } from "zustand";

interface ChartModalState {
    isOpen: boolean;
    openChartModal: () => void;
    closeChartModal: () => void;
}

export const useChartModalStore = create<ChartModalState>()((set) => ({
    isOpen: false,
    openChartModal: () => set({ isOpen: true}),
    closeChartModal: () => set({ isOpen: false}),
}));