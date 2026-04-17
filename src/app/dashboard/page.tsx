"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import SidebarFolderTree from "@/components/SidebarFolderTree";
import UploadModal from "@/components/UploadModal";
import FileGrid from "@/components/FileGrid";
import FilePreviewModal from "@/components/FilePreviewModal";
import RenameFileModal from "@/components/RenameFileModal";
import DeleteFileModal from "@/components/DeleteFileModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { showToast } from "@/components/Toast";

type FileType = {
  _id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { data: session } = useSession();
  const [folderId, setFolderId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileType[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [totalBytes, setTotalBytes] = useState<number>(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameFileId, setRenameFileId] = useState<string>("");
  const [renameFileName, setRenameFileName] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState<string>("");
  const [deleteFileName, setDeleteFileName] = useState<string>("");

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const res = await fetch(`/api/files/list?folderId=${folderId ?? ""}`);
        if (!res.ok) throw new Error("Failed to fetch files");
        const data = await res.json();
        setFiles(data);
        setTotalBytes(
          data.reduce((s: number, f: FileType) => s + (f.size || 0), 0),
        );
      } catch (error) {
        console.error("Error loading files:", error);
        showToast("Failed to load files", "error");
      }
    };

    loadFiles();
  }, [folderId]);

  const refetchFiles = useCallback(async () => {
    try {
      const res = await fetch(`/api/files/list?folderId=${folderId ?? ""}`);
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setFiles(data);
      setTotalBytes(
        data.reduce((s: number, f: FileType) => s + (f.size || 0), 0),
      );
    } catch (error) {
      console.error("Error refetching files:", error);
      showToast("Failed to reload files", "error");
    }
  }, [folderId]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 text-black dark:text-white transition-colors">
      <SidebarFolderTree
        onSelectFolder={(id) => setFolderId(id)}
        totalBytes={totalBytes}
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Files</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {session?.user?.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Upload
            </button>
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 text-red-500 dark:text-red-400 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          folderId={folderId}
          onUploadComplete={refetchFiles}
        />

        <FileGrid
          files={files}
          onDelete={(id, name) => {
            setDeleteFileId(id);
            setDeleteFileName(name);
            setDeleteModalOpen(true);
          }}
          onRename={(id, name) => {
            setRenameFileId(id);
            setRenameFileName(name);
            setRenameModalOpen(true);
          }}
          onPreview={(file) => setSelectedFile(file)}
        />

        <FilePreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />

        <RenameFileModal
          isOpen={renameModalOpen}
          onClose={() => setRenameModalOpen(false)}
          fileId={renameFileId}
          fileName={renameFileName}
          onRenamed={refetchFiles}
        />

        <DeleteFileModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          fileId={deleteFileId}
          fileName={deleteFileName}
          onDeleted={refetchFiles}
        />
      </div>
    </div>
  );
}
