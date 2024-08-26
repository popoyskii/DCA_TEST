import Board from "@/components/Board";
import Header from "@/components/Header";
import { useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";

export default function Home() {
  return (
    <main>
      <Header />

      <Board />
    </main>
  );
}
