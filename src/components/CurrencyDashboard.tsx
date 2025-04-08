import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import CurrencyCard from "./CurrencyCard";

interface Currency {
  code: string;
  name: string;
  rate: number;
  change: number;
  isFavorite: boolean;
}

const CurrencyDashboard = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [searchQuery, setSearchQuery] = useState("");
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: "EUR", name: "Euro", rate: 0.91, change: -0.2, isFavorite: true },
    {
      code: "GBP",
      name: "British Pound",
      rate: 0.78,
      change: 0.1,
      isFavorite: true,
    },
    {
      code: "JPY",
      name: "Japanese Yen",
      rate: 151.72,
      change: 0.5,
      isFavorite: false,
    },
    {
      code: "CAD",
      name: "Canadian Dollar",
      rate: 1.36,
      change: -0.3,
      isFavorite: false,
    },
    {
      code: "AUD",
      name: "Australian Dollar",
      rate: 1.51,
      change: -0.1,
      isFavorite: false,
    },
    {
      code: "CHF",
      name: "Swiss Franc",
      rate: 0.9,
      change: 0.2,
      isFavorite: false,
    },
    {
      code: "CNY",
      name: "Chinese Yuan",
      rate: 7.23,
      change: -0.4,
      isFavorite: false,
    },
    {
      code: "TRY",
      name: "Turkish Lira",
      rate: 32.15,
      change: -1.2,
      isFavorite: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate fetching data
  useEffect(() => {
    // In a real app, this would be an API call to get live rates
    // Example: fetchRates(baseCurrency);
  }, [baseCurrency]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const toggleFavorite = (code: string) => {
    setCurrencies(
      currencies.map((currency) =>
        currency.code === code
          ? { ...currency, isFavorite: !currency.isFavorite }
          : currency,
      ),
    );
  };

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const favoriteCurrencies = currencies.filter(
    (currency) => currency.isFavorite,
  );

  return (
    <div className="w-full bg-background p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Currency Dashboard</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex-1 sm:w-48">
            <Select value={baseCurrency} onValueChange={setBaseCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Base Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search currencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Currencies</TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites ({favoriteCurrencies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => (
                <CurrencyCard
                  key={currency.code}
                  code={currency.code}
                  name={currency.name}
                  rate={currency.rate}
                  change={currency.change}
                  isFavorite={currency.isFavorite}
                  baseCurrency={baseCurrency}
                  onToggleFavorite={() => toggleFavorite(currency.code)}
                />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex items-center justify-center p-6">
                  <p className="text-muted-foreground">
                    No currencies found matching your search.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {favoriteCurrencies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favoriteCurrencies.map((currency) => (
                <CurrencyCard
                  key={currency.code}
                  code={currency.code}
                  name={currency.name}
                  rate={currency.rate}
                  change={currency.change}
                  isFavorite={currency.isFavorite}
                  baseCurrency={baseCurrency}
                  onToggleFavorite={() => toggleFavorite(currency.code)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <p className="text-muted-foreground">
                  No favorite currencies yet. Click the star icon on any
                  currency to add it to favorites.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurrencyDashboard;
