"use client";
import React from "react";
import { HardDrive } from "lucide-react";

const MAX_STORAGE_MB = 5120; // 5GB default limit

export default function StorageCard({ totalBytes }: { totalBytes: number }) {
  const mb = totalBytes / (1024 * 1024);
  const percentage = Math.min((mb / MAX_STORAGE_MB) * 100, 100);
  const remaining = Math.max(MAX_STORAGE_MB - mb, 0);

  const getStorageColor = () => {
    if (percentage < 50) return "from-blue-500 to-cyan-500";
    if (percentage < 80) return "from-amber-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getProgressColor = () => {
    if (percentage < 50) return "bg-gradient-to-r from-blue-500 to-cyan-500";
    if (percentage < 80) return "bg-gradient-to-r from-amber-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-pink-500";
  };

  return (
    <div
      className={`bg-linear-to-br ${getStorageColor()} bg-opacity-10 dark:bg-opacity-5 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white/20 dark:bg-white/10">
            <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Storage Used
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {mb.toFixed(1)} MB
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border border-white/20 dark:border-gray-600/50">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-500 rounded-full shadow-lg`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Storage Info */}
      <div className="flex items-center justify-between text-xs">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            {remaining.toFixed(1)} MB{" "}
            <span className="text-gray-500">remaining</span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            {percentage.toFixed(0)}%
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            of {MAX_STORAGE_MB} MB
          </p>
        </div>
      </div>

      {/* Warning if over 80% */}
      {percentage > 80 && (
        <div className="mt-3 p-2 bg-red-500/20 dark:bg-red-500/30 border border-red-500/30 rounded-lg">
          <p className="text-xs font-medium text-red-600 dark:text-red-400">
            ⚠️ Storage nearly full. Consider deleting old files.
          </p>
        </div>
      )}
    </div>
  );
}
