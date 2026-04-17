"use client";
import React, { useState } from "react";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
  Edit2,
  Trash2,
} from "lucide-react";
import { showToast } from "./Toast";
import CreateFolderModal from "./CreateFolderModal";
import StorageCard from "./StorageCard";

type Folder = {
  _id: string;
  name: string;
  parentId: string | null;
};

export default function SidebarFolderTree({
  onSelectFolder,
  totalBytes = 0,
}: {
  onSelectFolder: (folderId: string | null) => void;
  totalBytes?: number;
}) {
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [folderCreatedKey, setFolderCreatedKey] = useState(0);

  return (
    <div className="w-64 p-4 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-sm text-black dark:text-white">
          Folders
        </h3>
        <button
          onClick={() => setCreateFolderOpen(true)}
          className="p-1.5 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 transition-all hover:scale-110"
          title="Create folder"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1">
        {/* ROOT */}
        <FolderNode
          key={folderCreatedKey}
          folder={{ _id: "root", name: "Root", parentId: null }}
          onSelectFolder={onSelectFolder}
          isRoot={true}
          onFolderCreated={() => setFolderCreatedKey((prev) => prev + 1)}
        />
      </div>

      <CreateFolderModal
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        parentFolderId="root"
        onFolderCreated={() => {
          setCreateFolderOpen(false);
          setFolderCreatedKey((prev) => prev + 1);
        }}
      />

      {/* Storage Card at Bottom */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <StorageCard totalBytes={totalBytes} />
      </div>
    </div>
  );
}

function FolderNode({
  folder,
  onSelectFolder,
  isRoot = false,
  onFolderCreated,
}: {
  folder: Folder;
  onSelectFolder: (folderId: string | null) => void;
  isRoot?: boolean;
  onFolderCreated?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<Folder[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameTargetId, setRenameTargetId] = useState<string>("");
  const [renameTargetName, setRenameTargetName] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string>("");
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");
  const [createFolderOpen, setCreateFolderOpen] = useState(false);

  const loadChildren = async () => {
    try {
      const parentId = folder._id === "root" ? "" : folder._id;
      const res = await fetch(`/api/folders/list?parentId=${parentId}`);
      if (!res.ok) throw new Error("Failed to load folders");
      const data = await res.json();
      setChildren(data);
    } catch (error) {
      console.error("Error loading folders:", error);
      showToast("Failed to load folders", "error");
    }
  };

  const toggleExpand = async () => {
    if (!expanded) await loadChildren();
    setExpanded(!expanded);
  };

  const createFolder = async () => {
    setCreateFolderOpen(true);
  };

  const renameFolderModal = (id: string, oldName: string) => {
    setRenameTargetId(id);
    setRenameTargetName(oldName);
    setRenameOpen(true);
  };

  const deleteFolderModal = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteOpen(true);
  };

  return (
    <div className="ml-2">
      {/* Folder Row */}
      <div
        className={`flex items-center justify-between py-2 px-2 rounded-lg transition-all cursor-pointer ${
          selected === folder._id
            ? "bg-blue-500/20 dark:bg-blue-500/30 backdrop-blur-sm border border-blue-500/30"
            : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
        }`}
        onClick={() => {
          setSelected(folder._id);
          onSelectFolder(folder._id === "root" ? null : folder._id);
        }}
      >
        {/* Left: folder name + arrow */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
            className="p-0.5 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 rounded transition-colors flex items-center justify-center"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {expanded ? (
            <FolderOpen className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
          )}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {folder.name}
          </span>
        </div>

        {/* Right: actions (except root) */}
        {!isRoot && (
          <div className="flex gap-1.5 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                renameFolderModal(folder._id, folder.name);
              }}
              className="p-1.5 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 rounded-lg text-amber-600 dark:text-amber-400 transition-all hover:scale-110"
              title="Rename folder"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteFolderModal(folder._id, folder.name);
              }}
              className="p-1.5 hover:bg-red-500/20 dark:hover:bg-red-500/30 rounded-lg text-red-600 dark:text-red-400 transition-all hover:scale-110"
              title="Delete folder"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Root has only + Add */}
        {isRoot && (
          <button
            className="text-xs px-2 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 border border-blue-500/30 transition-all hover:scale-105 font-medium flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              createFolder();
            }}
          >
            + Add
          </button>
        )}
      </div>

      {/* Expandable Section */}
      {expanded && (
        <div className="ml-2 border-l border-gray-300 dark:border-gray-600 pl-3 mt-1 transition-all duration-200">
          {/* Add new folder inside any folder */}
          {!isRoot && (
            <button
              className="text-xs mb-2 px-2 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-400 border border-green-500/30 transition-all hover:scale-105 font-medium flex items-center gap-2"
              onClick={createFolder}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Folder</span>
            </button>
          )}

          {children.length === 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 italic">
              No folders
            </p>
          )}

          {/* Render children recursively */}
          {children.map((child) => (
            <FolderNode
              key={child._id}
              folder={child}
              onSelectFolder={onSelectFolder}
              onFolderCreated={() => {
                loadChildren();
                onFolderCreated?.();
              }}
            />
          ))}
        </div>
      )}

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        parentFolderId={folder._id}
        onFolderCreated={() => {
          setCreateFolderOpen(false);
          setExpanded(true);
          loadChildren();
          onFolderCreated?.();
        }}
      />

      {/* Rename Folder Modal */}
      <RenameFolderModal
        isOpen={renameOpen}
        onClose={() => setRenameOpen(false)}
        folderId={renameTargetId}
        initialName={renameTargetName}
        onRenamed={() => {
          setRenameOpen(false);
          loadChildren();
        }}
      />

      {/* Delete Folder Modal */}
      <DeleteFolderModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        folderId={deleteTargetId}
        folderName={deleteTargetName}
        onDeleted={() => {
          setDeleteOpen(false);
          loadChildren();
        }}
      />
    </div>
  );
}

function RenameFolderModal({
  isOpen,
  onClose,
  folderId,
  initialName,
  onRenamed,
}: {
  isOpen: boolean;
  onClose: () => void;
  folderId: string;
  initialName: string;
  onRenamed: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "folder", id: folderId, newName: name }),
      });
      if (!res.ok) throw new Error("Failed to rename folder");
      showToast("Folder renamed successfully", "success");
      onClose();
      onRenamed();
    } catch (error) {
      console.error("Error renaming folder:", error);
      showToast("Failed to rename folder", "error");
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
          Rename Folder
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
          >
            {loading ? "Renaming..." : "Rename"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteFolderModal({
  isOpen,
  onClose,
  folderId,
  folderName,
  onDeleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  folderId: string;
  folderName: string;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/folders/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: folderId }),
      });
      if (!res.ok) throw new Error("Failed to delete folder");
      showToast("Folder deleted successfully", "success");
      onClose();
      onDeleted();
    } catch (error) {
      console.error("Error deleting folder:", error);
      showToast("Failed to delete folder", "error");
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
        <h2 className="text-lg font-bold text-black dark:text-white mb-2">
          Delete Folder?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Delete <span className="font-semibold">&quot;{folderName}&quot;</span>
          ? Files inside will not be deleted automatically.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
