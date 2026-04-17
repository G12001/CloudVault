"use client";
import React, { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";
import { showToast } from "./Toast";

export default function UploadModal({
  isOpen,
  onClose,
  folderId,
  onUploadComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  folderId: string | null;
  onUploadComplete?: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<
    Array<{
      file: File;
      progress: number;
      status: "pending" | "uploading" | "done" | "error";
    }>
  >([]);

  const uploadFile = async (
    file: File,
    updateProgress: (p: number) => void,
  ) => {
    try {
      // 1. get presigned url
      const presignRes = await fetch("/api/upload-url", {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          folderId,
        }),
      });
      if (!presignRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, key } = await presignRes.json();

      updateProgress(30);

      // 2. upload to s3 using PUT with fetch
      const s3Res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!s3Res.ok) throw new Error("Failed to upload to S3");

      updateProgress(70);

      // 3. save metadata
      const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${key}`;
      const metaRes = await fetch("/api/files", {
        method: "POST",
        body: JSON.stringify({
          name: file.name,
          key,
          size: file.size,
          url,
          folderId,
        }),
      });
      if (!metaRes.ok) throw new Error("Failed to save file metadata");

      updateProgress(100);
      return true;
    } catch (error) {
      console.error("Upload failed:", error);
      showToast(
        `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      );
      return false;
    }
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const newFiles = Array.from(files).map((file) => ({
        file,
        progress: 0,
        status: "pending" as const,
      }));

      setUploadQueue((prev) => [...prev, ...newFiles]);
      setUploading(true);

      for (let i = 0; i < newFiles.length; i++) {
        const fileItem = newFiles[i];
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.file === fileItem.file
              ? { ...item, status: "uploading" as const }
              : item,
          ),
        );

        const success = await uploadFile(fileItem.file, (progress) => {
          setUploadQueue((prev) =>
            prev.map((item) =>
              item.file === fileItem.file ? { ...item, progress } : item,
            ),
          );
        });

        setUploadQueue((prev) =>
          prev.map((item) =>
            item.file === fileItem.file
              ? {
                  ...item,
                  status: success ? ("done" as const) : ("error" as const),
                }
              : item,
          ),
        );
      }

      setUploading(false);
      onUploadComplete?.();
    },
    [folderId, onUploadComplete, uploadFile],
  );

  const removeFromQueue = (index: number) => {
    setUploadQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClose = () => {
    if (!uploading) {
      setUploadQueue([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-white/20 dark:border-gray-700/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 dark:border-gray-700/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upload Files
          </h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900/50"
            }`}
          >
            <input
              type="file"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              id="file-upload-modal"
              disabled={uploading}
            />

            <label
              htmlFor="file-upload-modal"
              className="flex flex-col items-center justify-center py-12 px-4 cursor-pointer"
            >
              <div className="mb-3 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Drop files here or click to upload
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports multiple files, any size
              </p>
            </label>
          </div>

          {/* Upload Queue */}
          {uploadQueue.length > 0 && (
            <div className="space-y-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Uploads (
                {uploadQueue.filter((item) => item.status === "done").length}/
                {uploadQueue.length})
              </h3>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {uploadQueue.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-1 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
                        {item.file.name}
                      </span>
                      {item.status === "done" && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                          Done
                        </span>
                      )}
                      {item.status === "error" && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">
                          Error
                        </span>
                      )}
                      {item.status === "uploading" && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.progress}%
                        </span>
                      )}
                      {item.status === "pending" && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Waiting...
                        </span>
                      )}

                      <button
                        onClick={() => removeFromQueue(index)}
                        disabled={item.status === "uploading"}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    {item.status === "uploading" && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/10 dark:border-gray-700/10 bg-gray-50/50 dark:bg-gray-900/50">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
          >
            {uploadQueue.length === 0 ? "Close" : "Cancel"}
          </button>
          {uploadQueue.length > 0 &&
            uploadQueue.every((item) => item.status === "done") && (
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Done
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
