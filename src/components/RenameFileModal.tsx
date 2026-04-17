"use client";

import React, { useState } from "react";
import { showToast } from "./Toast";

export default function RenameFileModal({
  isOpen,
  onClose,
  fileId,
  fileName,
  onRenamed,
}: {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
  onRenamed: () => void;
}) {
  const [newName, setNewName] = useState(fileName);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newName.trim()) return;
    if (newName === fileName) {
      onClose();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "file",
          id: fileId,
          newName: newName.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to rename file");
      showToast("File renamed successfully", "success");
      onClose();
      onRenamed();
    } catch (error) {
      console.error("Error renaming file:", error);
      showToast("Failed to rename file", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm border border-white/20 dark:border-gray-700/50 backdrop-blur-xl shadow-2xl">
        <h2 className="text-lg font-bold text-black dark:text-white mb-4">
          Rename File
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New filename
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={fileName}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !newName.trim()}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 font-medium"
          >
            {loading ? "Renaming..." : "Rename"}
          </button>
        </div>
      </div>
    </div>
  );
}
