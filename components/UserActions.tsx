"use client";
import { useAuthStore } from "@/store/AuthStore";
import ChangelogList from "./ChangelogList";
import { useState } from "react";

const UserActions = () => {
  const { logout } = useAuthStore();
  const [showChangelogs, setShowChangelogs] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return;
};

export default UserActions;
