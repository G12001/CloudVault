"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  File,
  FileText,
  Music,
  Video,
  Archive,
  Code,
  FileJson,
} from "lucide-react";

type File = {
  _id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
};

export default function FileGrid({
  files,
  onDelete,
  onRename,
  onPreview,
}: {
  files: File[];
  onDelete: (id: string, name: string) => void;
  onRename: (id: string, name: string) => void;
  onPreview: (file: File) => void;
}) {
  return (
    <div
      className="
      grid 
      sm:grid-cols-2 
      md:grid-cols-3 
      lg:grid-cols-4 
      xl:grid-cols-5 
      gap-6
    "
    >
      {files.map((f) => (
        <FileCard
          key={f._id}
          file={f}
          onDelete={onDelete}
          onRename={onRename}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}

function FileCard({
  file,
  onDelete,
  onRename,
  onPreview,
}: {
  file: File;
  onDelete: (id: string, name: string) => void;
  onRename: (id: string, name: string) => void;
  onPreview: (file: File) => void;
}) {
  const [imageError, setImageError] = useState(false);

  const getFileExtension = (name: string) => {
    return name.split(".").pop()?.toLowerCase() || "";
  };

  const isImageFile = (ext: string) => {
    return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext);
  };

  const getFileIcon = (ext: string) => {
    const iconProps = "text-gray-400 dark:text-gray-500";
    if (isImageFile(ext)) return <ImageIcon size={40} className={iconProps} />;
    if (["pdf"].includes(ext))
      return <FileText size={40} className={iconProps} />;
    if (["mp3", "wav", "flac", "aac", "ogg"].includes(ext))
      return <Music size={40} className={iconProps} />;
    if (["mp4", "webm", "avi", "mov"].includes(ext))
      return <Video size={40} className={iconProps} />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
      return <Archive size={40} className={iconProps} />;
    if (["json"].includes(ext))
      return <FileJson size={40} className={iconProps} />;
    if (["js", "ts", "tsx", "jsx", "py", "java", "cpp", "c"].includes(ext))
      return <Code size={40} className={iconProps} />;
    return <File size={40} className={iconProps} />;
  };

  const ext = getFileExtension(file.name);

  return (
    <div
      className="
        bg-white 
        shadow-sm 
        border 
        rounded-xl 
        p-4 
        flex 
        flex-col 
        hover:shadow-md 
        transition 
        group
        dark:bg-gray-900
        dark:border-gray-700
      "
    >
      {/* Thumbnail */}
      <div className="h-40 w-full bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center text-gray-500 overflow-hidden border border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-700 transition">
        {isImageFile(ext) && !imageError ? (
          <img
            src={file.url}
            alt={file.name}
            className="h-full w-full object-cover rounded-lg"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            {getFileIcon(ext)}
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              {ext || "file"}
            </span>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="mt-4 flex-1">
        <h3 className="text-sm font-semibold truncate dark:text-white text-gray-900 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
          {file.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onPreview(file)}
          className="flex-1 text-xs px-3 py-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/30 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 transition font-medium"
          title="Preview file"
        >
          Preview
        </button>

        <button
          onClick={() => onRename(file._id, file.name)}
          className="flex-1 text-xs px-3 py-2 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/30 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 transition font-medium"
          title="Rename file"
        >
          Rename
        </button>

        <button
          onClick={() => onDelete(file._id, file.name)}
          className="flex-1 text-xs px-3 py-2 rounded-lg bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/30 hover:bg-red-500/20 dark:hover:bg-red-500/30 transition font-medium"
          title="Delete file"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
