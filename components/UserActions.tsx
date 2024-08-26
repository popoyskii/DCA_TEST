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

  return (
    <div className="relative">
      <button onClick={() => setShowChangelogs(!showChangelogs)}>
        View Changelogs
      </button>
      {showChangelogs && <ChangelogList />}
      <button onClick={handleLogout}> Log Out</button>
      {/* Add more actions here like "Manage Users", "Clear Archived" etc. */}
    </div>
  );
};

export default UserActions;
