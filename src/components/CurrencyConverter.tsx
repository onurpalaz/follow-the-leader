import React, { useState, useEffect } from "react";
import { ArrowLeftRight, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  convertCurrency,
  getLatestRates,
} from "@/services/exchangeRateService";

interface CurrencyConverterProps {
  currencies?: string[];
  onConvert?: (from: string, to: string, amount: number) => void;
}

const CurrencyConverter = ({
  currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "TRY"],
  onConvert = () => {},
}: CurrencyConverterProps) => {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversionRate = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const numAmount = parseFloat(amount) || 0;

        // First try to use the convert endpoint
        try {
          const result = await convertCurrency(
            fromCurrency,
            toCurrency,
            numAmount,
          );
          if (result.success) {
            setRate(result.info.rate);
            setConvertedAmount(result.result);
            onConvert(fromCurrency, toCurrency, numAmount);
            setIsLoading(false);
            return;
          }
        } catch (conversionError) {
          console.log(
            "Direct conversion failed, falling back to rates",
            conversionError,
          );
          // Continue to fallback method
        }

        // Fallback: get latest rates and calculate manually
        const ratesData = await getLatestRates(fromCurrency);
        if (ratesData.success) {
          const targetRate = ratesData.quotes[`${fromCurrency}${toCurrency}`];
          if (targetRate) {
            setRate(targetRate);
            setConvertedAmount(numAmount * targetRate);
            onConvert(fromCurrency, toCurrency, numAmount);
          } else {
            throw new Error(
              `Rate not available for ${fromCurrency} to ${toCurrency}`,
            );
          }
        } else {
          throw new Error(ratesData.error?.info || "Failed to fetch rates");
        }
      } catch (error) {
        console.error("Error fetching conversion rate:", error);
        setError("Unable to fetch current rates. Using fallback data.");

        // Fallback to mock data if API fails
        const mockRate = 1.08;
        setRate(mockRate);
        const numAmount = parseFloat(amount) || 0;
        setConvertedAmount(numAmount * mockRate);
      } finally {
        setIsLoading(false);
      }
    };

    if (amount && fromCurrency && toCurrency) {
      fetchConversionRate();
    }
  }, [amount, fromCurrency, toCurrency, onConvert]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <Card className="w-full bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Currency Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div className="grid gap-2">
              <label htmlFor="from-currency" className="text-sm font-medium">
                From
              </label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="from-currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={`from-${currency}`} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapCurrencies}
                className="rounded-full hidden md:flex"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapCurrencies}
                className="rounded-full md:hidden"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-2">
              <label htmlFor="to-currency" className="text-sm font-medium">
                To
              </label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="to-currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={`to-${currency}`} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Conversion Result</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : convertedAmount !== null && !isNaN(convertedAmount) ? (
                    `${parseFloat(amount) || 0} ${fromCurrency} = ${convertedAmount.toFixed(4)} ${toCurrency}`
                  ) : (
                    "Enter an amount to convert"
                  )}
                </p>
              </div>
              {rate !== null && !isNaN(rate) && !isLoading && (
                <p className="text-xs text-muted-foreground">
                  1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
                </p>
              )}
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
