import { Info } from "lucide-react";

export const VersionHistory = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-apple p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-500">Version</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
        <span className="font-medium">v1.0.0-dev</span>
      </p>
    </div>
  );
};