"use client";
import React, { useEffect, useState } from "react";
import { X, Download, FileIcon } from "lucide-react";

export default function FilePreviewModal({
  file,
  onClose,
}: {
  file: any | null;
  onClose: () => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ext = file?.name.split(".").pop()?.toLowerCase();

  useEffect(() => {
    if (!file) {
      setLoading(false);
      return;
    }

    async function getPreviewUrl() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/files/view", {
          method: "POST",
          body: JSON.stringify({ id: file._id }),
        });
        if (!res.ok) throw new Error("Failed to get preview URL");
        const { url } = await res.json();
        setPreviewUrl(url);
      } catch (error) {
        console.error("Error fetching preview URL:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load preview",
        );
      } finally {
        setLoading(false);
      }
    }

    getPreviewUrl();
  }, [file]);

  if (!file) return null;

  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "");
  const isPdf = ["pdf"].includes(ext || "");

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-white/20 dark:border-gray-700/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 dark:border-gray-700/10 backdrop-blur-sm">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {file.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className="flex items-center gap-2">
            {previewUrl && (
              <a
                href={previewUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-auto p-6 bg-linear-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50"
          style={{
            backgroundImage:
              "repeating-conic-gradient(#00000008 0% 25%, transparent 0% 50%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 10px 10px",
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block mb-4 p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <FileIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading preview...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mb-4 p-4 rounded-full bg-red-100 dark:bg-red-900/30 inline-block">
                  <FileIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                  {error}
                </p>
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    Click here to open in new tab
                  </a>
                )}
              </div>
            </div>
          ) : !previewUrl ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Preview not available
                </p>
                <a
                  href={previewUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </a>
              </div>
            </div>
          ) : isImage ? (
            <div className="flex items-center justify-center bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4">
              <img
                src={previewUrl}
                alt={file.name}
                className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
                onError={() => setError("Failed to load image")}
              />
            </div>
          ) : isPdf ? (
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 dark:border-gray-700/20">
              <iframe
                src={previewUrl}
                className="w-full h-[70vh]"
                title={file.name}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This file type cannot be previewed
                </p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
