import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Info } from "lucide-react";
import { format, subDays } from "date-fns";

interface HistoricalDataPoint {
  date: string;
  rate: number;
}

interface HistoricalChartsProps {
  baseCurrency?: string;
  targetCurrency?: string;
}

const HistoricalCharts = ({
  baseCurrency = "USD",
  targetCurrency = "EUR",
}: HistoricalChartsProps) => {
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [selectedBaseCurrency, setSelectedBaseCurrency] =
    useState(baseCurrency);
  const [selectedTargetCurrency, setSelectedTargetCurrency] =
    useState(targetCurrency);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  // Mock currencies for the dropdown
  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "TRY", name: "Turkish Lira" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CNY", name: "Chinese Yuan" },
  ];

  // Generate mock historical data
  useEffect(() => {
    setIsLoading(true);

    // In a real app, this would be an API call to get historical data
    // For example: fetch(`https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&base=${selectedBaseCurrency}&symbols=${selectedTargetCurrency}`)

    const days = period === "7d" ? 7 : 30;
    const mockData: HistoricalDataPoint[] = [];

    const baseValue = Math.random() * 0.5 + 0.8; // Random starting value between 0.8 and 1.3

    for (let i = days; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      // Create some random fluctuation for the mock data
      const fluctuation = (Math.random() - 0.5) * 0.05;
      const rate = baseValue + fluctuation * (days - i);

      mockData.push({
        date,
        rate: parseFloat(rate.toFixed(4)),
      });
    }

    setTimeout(() => {
      setHistoricalData(mockData);
      setIsLoading(false);
    }, 800); // Simulate API delay
  }, [period, selectedBaseCurrency, selectedTargetCurrency]);

  const handlePeriodChange = (value: string) => {
    setPeriod(value as "7d" | "30d");
  };

  const handleBaseCurrencyChange = (value: string) => {
    setSelectedBaseCurrency(value);
  };

  const handleTargetCurrencyChange = (value: string) => {
    setSelectedTargetCurrency(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-2 shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            1 {selectedBaseCurrency} = {payload[0].value}{" "}
            {selectedTargetCurrency}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl">Historical Exchange Rates</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Select
                value={selectedBaseCurrency}
                onValueChange={handleBaseCurrencyChange}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Base" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">to</span>
              <Select
                value={selectedTargetCurrency}
                onValueChange={handleTargetCurrencyChange}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Target" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Tabs
              defaultValue="7d"
              value={period}
              onValueChange={handlePeriodChange}
              className="w-[180px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="7d">7 Days</TabsTrigger>
                <TabsTrigger value="30d">30 Days</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-pulse text-muted-foreground">
              Loading chart data...
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historicalData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "MMM dd")}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => value.toFixed(4)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Info size={16} />
              <span>
                Showing historical exchange rates for 1 {selectedBaseCurrency}{" "}
                to {selectedTargetCurrency} over the past{" "}
                {period === "7d" ? "7 days" : "30 days"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalCharts;
