import { useState } from "react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileText, File } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useReport } from "@/hooks/useReport";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { TopBar } from "@/components/TopBar";

const Report = () => {
  const { timeframe, setTimeframe, prepareChartData, downloadReport, transactions, isLoading } = useReport();

  return (
    <div className="min-h-screen bg-[#F5F5F7] relative overflow-hidden">
      <TopBar title="Financial Report" />
      
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7F3DFF]/10 -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#7F3DFF]/10 -ml-20 -mb-20" />
      
      <div className="p-4">
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <Select
                value={timeframe}
                onValueChange={(value: "daily" | "weekly" | "monthly" | "yearly") => setTimeframe(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadReport('excel')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadReport('pdf')}
                >
                  <File className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>

            <div className="h-[300px] w-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading...</p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    expense: { color: "#ef4444" },
                    income: { color: "#22c55e" },
                  }}
                >
                  <LineChart data={prepareChartData()}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload) return null;
                        return (
                          <ChartTooltipContent
                            className="bg-white p-2 border rounded shadow-lg"
                            payload={payload}
                          />
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Income</span>
                <span className="text-green-600 font-medium">
                  ₹{transactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expenses</span>
                <span className="text-red-600 font-medium">
                  ₹{transactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Report;