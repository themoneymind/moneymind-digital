import { Info } from "lucide-react";

export const VersionHistory = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-apple p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-500">App Version</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Current Version: <span className="font-medium">v1.0.0</span>
        </p>
        <p className="text-xs text-gray-500">Last updated: April 15, 2024</p>
        <div className="text-xs text-gray-500">
          <p className="font-medium mb-1">What's new:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Added dues management feature</li>
            <li>Improved transaction tracking</li>
            <li>Enhanced user interface</li>
          </ul>
        </div>
      </div>
    </div>
  );
};