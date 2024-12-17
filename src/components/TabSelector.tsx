import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabSelectorProps = {
  activeTab: string;
  onTabChange: (value: string) => void;
};

export const TabSelector = ({ activeTab, onTabChange }: TabSelectorProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full bg-white/10 p-1 rounded-2xl">
        <TabsTrigger
          value="bank"
          className="w-1/2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none"
        >
          Bank
        </TabsTrigger>
        <TabsTrigger
          value="credit"
          className="w-1/2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-none"
        >
          Credit Cards
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};