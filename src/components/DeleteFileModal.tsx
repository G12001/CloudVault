"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { showToast } from "./Toast";

export default function DeleteFileModal({
  isOpen,
  onClose,
  fileId,
  fileName,
  onDeleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/files/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: fileId }),
      });
      if (!res.ok) throw new Error("Failed to delete file");
      showToast("File deleted successfully", "success");
      onClose();
      onDeleted();
    } catch (error) {
      console.error("Error deleting file:", error);
      showToast("Failed to delete file", "error");
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
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-red-500/20 dark:bg-red-500/30">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-black dark:text-white">
            Delete File?
          </h2>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            &quot;{fileName}&quot;
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
