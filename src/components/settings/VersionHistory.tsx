import { Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const VersionHistory = () => {
  const versions = [
    {
      version: "v1.0.0-dev",
      date: "2024-03-28",
      changes: [
        "Initial development release",
        "Basic transaction management",
        "Payment source management",
        "Due tracking system",
      ],
      technical: [
        "React 18.3.1",
        "Supabase integration",
        "Tailwind CSS for styling",
        "TypeScript for type safety",
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-apple p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-500">Version Information</h3>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300">
        <span className="font-medium">Current Version: v1.0.0-dev</span>
      </p>

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="version-history">
          <AccordionTrigger className="text-sm">
            Detailed Version History
          </AccordionTrigger>
          <AccordionContent>
            {versions.map((v) => (
              <div key={v.version} className="mb-4 last:mb-0">
                <h4 className="text-sm font-medium">{v.version} ({v.date})</h4>
                
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Changes:</p>
                    <ul className="list-disc list-inside text-xs text-gray-500 ml-2">
                      {v.changes.map((change, i) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-600">Technical Details:</p>
                    <ul className="list-disc list-inside text-xs text-gray-500 ml-2">
                      {v.technical.map((tech, i) => (
                        <li key={i}>{tech}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};